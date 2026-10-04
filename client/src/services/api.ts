import { AdminMetrics, Campaign, CollegeLeaderboardEntry, Expense, LeaderboardEntry, Student } from '../types';

const BASE_URL = '/api';

export async function fetchCampaign(): Promise<{ success: boolean; campaign: Campaign }> {
  const res = await fetch(`${BASE_URL}/campaign`);
  if (!res.ok) throw new Error('Failed to load campaign');
  return res.json();
}

export async function registerStudent(payload: any): Promise<{ success: boolean; student: Student; message?: string }> {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    const error: any = new Error(data.error || 'Failed to complete registration');
    error.student = data.student;
    error.status = res.status;
    throw error;
  }
  return data;
}

export async function fetchStudentByCode(code: string): Promise<{ success: boolean; student: Student }> {
  const res = await fetch(`${BASE_URL}/students/${code}`);
  if (!res.ok) throw new Error('Student not found');
  return res.json();
}

export async function fetchStudentByEmail(email: string): Promise<{ success: boolean; student: Student }> {
  const res = await fetch(`${BASE_URL}/students/by-email/${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error('Student not found with this email');
  return res.json();
}

export async function fetchLeaderboard(): Promise<{ success: boolean; leaderboard: LeaderboardEntry[] }> {
  const res = await fetch(`${BASE_URL}/leaderboard`);
  if (!res.ok) throw new Error('Failed to load leaderboard');
  return res.json();
}

export async function fetchCollegeLeaderboard(): Promise<{ success: boolean; colleges: CollegeLeaderboardEntry[] }> {
  const res = await fetch(`${BASE_URL}/colleges/leaderboard`);
  if (!res.ok) throw new Error('Failed to load college leaderboard');
  return res.json();
}

export async function generateAIMessage(params: {
  audience: string;
  tone: string;
  studentName?: string;
  referralLink?: string;
  referralCode?: string;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/ai/generate-message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Failed to generate message');
  return res.json();
}

export async function adminLogin(email: string, password: string): Promise<{ success: boolean; token: string; user: any }> {
  const res = await fetch(`${BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Admin login failed');
  return data;
}

export async function fetchAdminMetrics(token: string): Promise<{ success: boolean; metrics: AdminMetrics }> {
  const res = await fetch(`${BASE_URL}/admin/metrics`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to load admin metrics');
  return res.json();
}

export async function updateCampaignSettings(data: any, token: string): Promise<{ success: boolean; campaign: Campaign }> {
  const res = await fetch(`${BASE_URL}/admin/campaign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update campaign');
  return res.json();
}

export async function fetchExpenses(token: string): Promise<{ success: boolean; expenses: Expense[] }> {
  const res = await fetch(`${BASE_URL}/admin/expenses`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to load expenses');
  return res.json();
}

export async function addExpense(payload: any, token: string): Promise<{ success: boolean; expense: Expense }> {
  const res = await fetch(`${BASE_URL}/admin/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to add expense');
  return res.json();
}

export async function deleteExpense(id: string, token: string): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/admin/expenses/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete expense');
  return res.json();
}

export async function fetchStudentsList(params: { search?: string; channel?: string; college?: string; page?: number }, token: string) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.channel) query.set('channel', params.channel);
  if (params.college) query.set('college', params.college);
  if (params.page) query.set('page', params.page.toString());

  const res = await fetch(`${BASE_URL}/admin/students?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to load students');
  return res.json();
}

export async function generateDemoData(token: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/admin/demo/generate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to generate demo data');
  return res.json();
}

export async function clearDemoData(token: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/admin/demo/clear`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to clear data');
  return res.json();
}

export async function triggerQuickReferral(ref_code: string): Promise<{ success: boolean; message: string; student: Student }> {
  const res = await fetch(`${BASE_URL}/admin/demo/quick-referral`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref_code })
  });
  if (!res.ok) throw new Error('Failed to trigger quick referral');
  return res.json();
}
