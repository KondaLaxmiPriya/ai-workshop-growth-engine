export interface Campaign {
  id: string;
  name: string;
  target_registrations: number;
  budget: number;
  start_date: string;
  end_date: string;
  workshop_date: string;
  status: string;
  current_registrations?: number;
  progress_percentage?: number;
  remaining_seats?: number;
  days_remaining?: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  graduation_year: string;
  skill_level: string;
  preferred_technology: string;
  referral_code: string;
  referred_by: string | null;
  source: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  referrals_count: number;
  leaderboard_visible: boolean;
  created_at: string;
  rank?: number;
  badge?: {
    title: string;
    tier: number;
    next: string | null;
    target: number;
  };
  referred_friends?: {
    id: string;
    name: string;
    college: string;
    branch: string;
    date: string;
    status: string;
  }[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  college: string;
  branch: string;
  referrals: number;
  badge: string;
}

export interface CollegeLeaderboardEntry {
  rank: number;
  college: string;
  registrations: number;
  referralRegistrations: number;
  percentage: number;
}

export interface Expense {
  id: string;
  campaign_id: string;
  name: string;
  channel: string;
  amount: number;
  date: string;
  notes: string;
  created_at?: string;
}

export interface GrowthInsight {
  id: string;
  type: 'channel' | 'referral' | 'college' | 'projection' | 'budget';
  icon: string;
  title: string;
  highlight: string;
  description: string;
}

export interface AdminMetrics {
  target: number;
  totalRegistrations: number;
  progressPercentage: number;
  remainingSeatsNeeded: number;
  referralRegistrations: number;
  referralConversionRate: number;
  viralCoefficient: number;
  budget: number;
  totalSpent: number;
  remainingBudget: number;
  costPerRegistration: number;
  topChannel: string;
  topCollege: string;
  daysElapsed: number;
  daysRemaining: number;
  currentDailyRate: number;
  requiredDailyRate: number;
  projectedTotal: number;
  channelStats: { name: string; count: number; percentage: number }[];
  dailyTrend: {
    day: string;
    dailyActual: number;
    cumulativeActual: number;
    targetCumulative: number;
    dailyTarget: number;
  }[];
  topColleges: CollegeLeaderboardEntry[];
  referralDistribution: { tier: string; students: number }[];
  insights: GrowthInsight[];
}
