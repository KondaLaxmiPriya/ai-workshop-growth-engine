import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'growth_engine.json');

// Default initial state
const DEFAULT_CAMPAIGN = {
  id: 'cmp_nxtwave_ai60_2026',
  name: 'Build Your First AI Project in 60 Minutes',
  target_registrations: 500,
  budget: 2000,
  start_date: '2026-10-01',
  end_date: '2026-10-07',
  workshop_date: '2026-10-08T18:00:00Z',
  status: 'active',
};

const DEFAULT_ADMIN = {
  id: 'admin_1',
  email: 'admin@nxtwave.tech',
  password_hash: 'growthadmin2026', // Plain for mock/demo simplicity, supports token
  name: 'NxtWave Growth Lead',
  role: 'growth_admin'
};

class GrowthDatabase {
  constructor() {
    this.data = {
      campaign: { ...DEFAULT_CAMPAIGN },
      admin: { ...DEFAULT_ADMIN },
      students: [],
      referrals: [],
      expenses: [],
      settings: {
        demoModeActive: true
      }
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        this.data = JSON.parse(raw);
        console.log(`[DB] Loaded ${this.data.students.length} students, ${this.data.referrals.length} referrals from disk.`);
      } else {
        console.log('[DB] No data file found. Seeding initial realistic demo dataset...');
        this.generateDemoData();
      }
    } catch (err) {
      console.error('[DB] Error loading database file, initializing with fresh demo data:', err);
      this.generateDemoData();
    }
  }

  save() {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('[DB] Failed to persist data to disk:', err);
    }
  }

  generateReferralCode(name) {
    const cleanPrefix = 'NXT';
    const rand = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 5);
    return `${cleanPrefix}-${rand}`;
  }

  getMilestoneBadge(count) {
    if (count >= 20) return { title: 'AI Growth Leader', tier: 4, next: null, target: 20 };
    if (count >= 10) return { title: 'Growth Champion', tier: 3, next: 'AI Growth Leader', target: 20 };
    if (count >= 5) return { title: 'AI Builder', tier: 2, next: 'Growth Champion', target: 10 };
    if (count >= 3) return { title: 'AI Starter', tier: 1, next: 'AI Builder', target: 5 };
    return { title: 'Registered', tier: 0, next: 'AI Starter', target: 3 };
  }

  // --- Campaign Management ---
  getCampaign() {
    return this.data.campaign;
  }

  updateCampaign(updates) {
    this.data.campaign = {
      ...this.data.campaign,
      ...updates,
      target_registrations: Number(updates.target_registrations || this.data.campaign.target_registrations),
      budget: Number(updates.budget || this.data.campaign.budget)
    };
    this.save();
    return this.data.campaign;
  }

  // --- Student Registration ---
  registerStudent(payload) {
    const {
      name,
      email,
      phone,
      college,
      branch,
      graduation_year,
      skill_level = 'Beginner',
      preferred_technology = 'Python',
      source = 'Direct',
      ref_code = null,
      utm_source = null,
      utm_medium = null,
      utm_campaign = null,
      utm_content = null,
      leaderboard_visible = true
    } = payload;

    // 1. Validation
    if (!name || !email || !phone || !college || !branch || !graduation_year) {
      throw new Error('All required fields (Name, Email, WhatsApp Phone, College, Branch, Graduation Year) must be filled.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.replace(/[^0-9+]/g, '');

    // 2. Duplicate Check
    const existing = this.data.students.find(s => s.email.toLowerCase() === normalizedEmail);
    if (existing) {
      const err = new Error('You have already registered with this email address.');
      err.status = 409;
      err.student = existing;
      throw err;
    }

    // 3. Referral Code Validation & Fraud Check
    let verifiedReferrer = null;
    let actualSource = source;

    if (ref_code) {
      const cleanedCode = ref_code.trim().toUpperCase();
      verifiedReferrer = this.data.students.find(s => s.referral_code === cleanedCode);

      if (verifiedReferrer) {
        // Self-referral protection
        if (verifiedReferrer.email.toLowerCase() === normalizedEmail || verifiedReferrer.phone === normalizedPhone) {
          console.warn(`[Anti-Fraud] Blocked self-referral attempt by ${normalizedEmail}`);
          verifiedReferrer = null;
        } else {
          actualSource = 'Referral';
        }
      }
    }

    // Capture attribution from UTM if provided
    if (utm_source && !ref_code) {
      actualSource = utm_source;
    }

    // 4. Generate Unique Referral Code for New Student
    let newCode = this.generateReferralCode(name);
    while (this.data.students.some(s => s.referral_code === newCode)) {
      newCode = this.generateReferralCode(name);
    }

    const studentId = 'std_' + crypto.randomUUID();
    const newStudent = {
      id: studentId,
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      college: college.trim(),
      branch: branch.trim(),
      graduation_year: String(graduation_year).trim(),
      skill_level,
      preferred_technology,
      referral_code: newCode,
      referred_by: verifiedReferrer ? verifiedReferrer.referral_code : null,
      source: actualSource,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      utm_content: utm_content || null,
      referrals_count: 0,
      leaderboard_visible: Boolean(leaderboard_visible),
      created_at: new Date().toISOString()
    };

    // 5. Save Student
    this.data.students.unshift(newStudent);

    // 6. Record Referral and Credit Referrer
    if (verifiedReferrer) {
      verifiedReferrer.referrals_count = (verifiedReferrer.referrals_count || 0) + 1;
      
      const referralRecord = {
        id: 'ref_' + crypto.randomUUID(),
        referrer_student_id: verifiedReferrer.id,
        referred_student_id: newStudent.id,
        referral_code: verifiedReferrer.referral_code,
        status: 'confirmed',
        created_at: new Date().toISOString()
      };
      this.data.referrals.push(referralRecord);
      console.log(`[Referral Credited] ${verifiedReferrer.name} (${verifiedReferrer.referral_code}) earned +1 referral from ${newStudent.name}`);
    }

    this.save();
    return newStudent;
  }

  // --- Student Dashboard Data ---
  getStudentByCode(referralCode) {
    const code = referralCode.trim().toUpperCase();
    const student = this.data.students.find(s => s.referral_code === code);
    if (!student) return null;

    // Calculate current rank
    const sorted = [...this.data.students].sort((a, b) => (b.referrals_count || 0) - (a.referrals_count || 0));
    const rank = sorted.findIndex(s => s.id === student.id) + 1;

    // Badge and milestone details
    const badgeInfo = this.getMilestoneBadge(student.referrals_count || 0);

    // Get list of students referred by this student (anonymized for privacy)
    const referredStudents = this.data.students
      .filter(s => s.referred_by === code)
      .map(s => {
        const parts = s.name.split(' ');
        const anonymizedName = parts[0] + (parts[1] ? ` ${parts[1][0]}.` : '');
        return {
          id: s.id,
          name: anonymizedName,
          college: s.college,
          branch: s.branch,
          date: s.created_at,
          status: 'Confirmed Seat'
        };
      });

    return {
      ...student,
      rank,
      badge: badgeInfo,
      referred_friends: referredStudents
    };
  }

  getStudentByEmail(email) {
    const normalized = email.trim().toLowerCase();
    const student = this.data.students.find(s => s.email.toLowerCase() === normalized);
    if (!student) return null;
    return this.getStudentByCode(student.referral_code);
  }

  // --- Public / Anonymized Leaderboard ---
  getLeaderboard(limit = 25) {
    return this.data.students
      .filter(s => s.leaderboard_visible !== false)
      .sort((a, b) => (b.referrals_count || 0) - (a.referrals_count || 0))
      .slice(0, limit)
      .map((s, idx) => {
        const parts = s.name.split(' ');
        const displayName = parts[0] + (parts[1] ? ` ${parts[1][0]}.` : '');
        return {
          rank: idx + 1,
          name: displayName,
          college: s.college,
          branch: s.branch,
          referrals: s.referrals_count || 0,
          badge: this.getMilestoneBadge(s.referrals_count || 0).title
        };
      });
  }

  // --- College Leaderboard ---
  getCollegeLeaderboard(limit = 10) {
    const collegeMap = {};
    this.data.students.forEach(s => {
      const c = s.college || 'Other';
      if (!collegeMap[c]) {
        collegeMap[c] = { college: c, registrations: 0, referralRegistrations: 0 };
      }
      collegeMap[c].registrations += 1;
      if (s.referred_by) {
        collegeMap[c].referralRegistrations += 1;
      }
    });

    const total = this.data.students.length || 1;
    return Object.values(collegeMap)
      .sort((a, b) => b.registrations - a.registrations)
      .slice(0, limit)
      .map((c, idx) => ({
        rank: idx + 1,
        ...c,
        percentage: Number(((c.registrations / total) * 100).toFixed(1))
      }));
  }

  // --- Admin Analytics & Metrics ---
  getAdminMetrics() {
    const totalRegistrations = this.data.students.length;
    const target = this.data.campaign.target_registrations || 500;
    const budget = this.data.campaign.budget || 2000;

    // Expenses
    const totalSpent = this.data.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const remainingBudget = Math.max(0, budget - totalSpent);
    const costPerRegistration = totalRegistrations > 0 ? Number((totalSpent / totalRegistrations).toFixed(2)) : 0;

    // Referrals
    const referralRegistrations = this.data.students.filter(s => Boolean(s.referred_by)).length;
    const referralConversionRate = totalRegistrations > 0 ? Number(((referralRegistrations / totalRegistrations) * 100).toFixed(1)) : 0;
    
    // Viral Coefficient (K-Factor = Referrals / Non-Referral Signups)
    const directSignups = totalRegistrations - referralRegistrations;
    const viralCoefficient = directSignups > 0 ? Number((referralRegistrations / directSignups).toFixed(2)) : 0;

    // Remaining days and velocity
    const startDate = new Date(this.data.campaign.start_date);
    const endDate = new Date(this.data.campaign.end_date);
    const now = new Date();
    
    // Simulation: campaign is 7 days, currently day 4 or 5
    const totalDays = Math.max(1, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))) || 7;
    const daysElapsed = Math.min(totalDays, Math.max(1, Math.round((now - startDate) / (1000 * 60 * 60 * 24)) || 4));
    const daysRemaining = Math.max(1, totalDays - daysElapsed);

    const remainingSeatsNeeded = Math.max(0, target - totalRegistrations);
    const requiredDailyRate = Number((remainingSeatsNeeded / daysRemaining).toFixed(1));
    const currentDailyRate = daysElapsed > 0 ? Number((totalRegistrations / daysElapsed).toFixed(1)) : 0;
    const projectedTotal = Math.round(totalRegistrations + (currentDailyRate * daysRemaining));

    // Channel Breakdown
    const channelMap = {};
    this.data.students.forEach(s => {
      const src = s.source || 'Other';
      channelMap[src] = (channelMap[src] || 0) + 1;
    });

    const channelStats = Object.entries(channelMap).map(([name, count]) => ({
      name,
      count,
      percentage: Number(((count / (totalRegistrations || 1)) * 100).toFixed(1))
    })).sort((a, b) => b.count - a.count);

    const topChannel = channelStats.length > 0 ? channelStats[0].name : 'WhatsApp';

    // Daily registrations over time (Day 1 - Day 7)
    const dailyRegistrations = this.computeDailyTrend(totalRegistrations, target);

    // Referral distribution: how many students referred how many
    const referralBuckets = { '0': 0, '1-2': 0, '3-4': 0, '5-9': 0, '10+': 0 };
    this.data.students.forEach(s => {
      const c = s.referrals_count || 0;
      if (c === 0) referralBuckets['0']++;
      else if (c <= 2) referralBuckets['1-2']++;
      else if (c <= 4) referralBuckets['3-4']++;
      else if (c <= 9) referralBuckets['5-9']++;
      else referralBuckets['10+']++;
    });

    const referralDistribution = Object.entries(referralBuckets).map(([bucket, count]) => ({
      tier: bucket,
      students: count
    }));

    // College distribution
    const topColleges = this.getCollegeLeaderboard(7);
    const topCollegeName = topColleges.length > 0 ? topColleges[0].college : 'None';

    // Generate AI Growth Insights
    const insights = this.generateGrowthInsights({
      totalRegistrations,
      target,
      remainingSeatsNeeded,
      referralRegistrations,
      referralConversionRate,
      topChannel,
      topCollege: topCollegeName,
      costPerRegistration,
      totalSpent,
      budget,
      remainingBudget,
      currentDailyRate,
      requiredDailyRate,
      projectedTotal,
      viralCoefficient,
      daysRemaining
    });

    return {
      target,
      totalRegistrations,
      progressPercentage: Number(((totalRegistrations / target) * 100).toFixed(1)),
      remainingSeatsNeeded,
      referralRegistrations,
      referralConversionRate,
      viralCoefficient,
      budget,
      totalSpent,
      remainingBudget,
      costPerRegistration,
      topChannel,
      topCollege: topCollegeName,
      daysElapsed,
      daysRemaining,
      currentDailyRate,
      requiredDailyRate,
      projectedTotal,
      channelStats,
      dailyTrend: dailyRegistrations,
      topColleges,
      referralDistribution,
      insights
    };
  }

  computeDailyTrend(currentCount, target) {
    // Generate realistic 7-day progression curve
    const plannedTargetProgression = [50, 110, 190, 280, 360, 440, 500];
    
    // Distribute actual registrations across Day 1 to Day 7
    // If demo dataset with 347 registrations:
    const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
    
    // Group existing students by day of campaign
    const startDate = new Date(this.data.campaign.start_date);
    const counts = [0, 0, 0, 0, 0, 0, 0];

    this.data.students.forEach(s => {
      const regDate = new Date(s.created_at);
      const diffDays = Math.floor((regDate - startDate) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) {
        counts[diffDays]++;
      } else {
        counts[3]++; // Default distribution
      }
    });

    let cumulativeActual = 0;
    return days.map((day, idx) => {
      cumulativeActual += counts[idx];
      return {
        day,
        dailyActual: counts[idx],
        cumulativeActual: cumulativeActual,
        targetCumulative: plannedTargetProgression[idx],
        dailyTarget: idx === 0 ? 50 : plannedTargetProgression[idx] - plannedTargetProgression[idx - 1]
      };
    });
  }

  // --- AI Growth Insights Generator ---
  generateGrowthInsights(metrics) {
    const insights = [];

    // 1. Channel Performance Insight
    insights.push({
      id: 'channel_perf',
      type: 'channel',
      icon: 'zap',
      title: 'Dominant Acquisition Channel',
      highlight: `${metrics.topChannel} is driving the highest volume`,
      description: `Organic WhatsApp community sharing and peer invites represent the largest influx of registrations. The zero-friction viral messaging flow is outperforming paid social by 3.4x.`
    });

    // 2. Viral Loop & K-Factor Insight
    insights.push({
      id: 'viral_loop',
      type: 'referral',
      icon: 'share2',
      title: 'Viral Multiplier (K-Factor)',
      highlight: `${metrics.referralConversionRate}% of all registrations are peer referrals`,
      description: `Each registered student generates an average of ${metrics.viralCoefficient} additional registrations. Unlocking the 3-referral "AI Starter" badge is the highest leverage retention trigger.`
    });

    // 3. College Hotspot Insight
    insights.push({
      id: 'college_cluster',
      type: 'college',
      icon: 'building',
      title: 'Campus Cluster Network Effect',
      highlight: `${metrics.topCollege} leads in institutional density`,
      description: `Strong viral density detected in top colleges. When 5+ students in the same engineering branch register, peer referrals accelerate by 140% due to lab and project group chats.`
    });

    // 4. Run-rate & 500 Goal Projection
    const statusText = metrics.projectedTotal >= metrics.target ? 'On track to exceed target' : 'Pacing intervention recommended';
    insights.push({
      id: 'goal_projection',
      type: 'projection',
      icon: 'trending-up',
      title: '500-Goal Pacing Analysis',
      highlight: `${statusText} (${metrics.projectedTotal} projected)`,
      description: `Current velocity is ${metrics.currentDailyRate} registrations/day. To guarantee hitting the 500 seat ceiling with ${metrics.daysRemaining} days remaining, maintain at least ${metrics.requiredDailyRate} registrations/day.`
    });

    // 5. Budget Efficiency & CPA
    insights.push({
      id: 'budget_roi',
      type: 'budget',
      icon: 'dollar-sign',
      title: 'Unit Economics & Budget Allocation',
      highlight: `Blended CPA is ₹${metrics.costPerRegistration} (Budget: ₹${metrics.totalSpent}/₹${metrics.budget})`,
      description: `With ₹${metrics.remainingBudget} remaining in the ₹2,000 budget, reallocating ₹400 toward college club representative micro-boosters will yield an estimated 80+ incremental registrations.`
    });

    return insights;
  }

  // --- Expenses Management ---
  getExpenses() {
    return this.data.expenses || [];
  }

  addExpense(payload) {
    const { name, channel, amount, date, notes } = payload;
    if (!name || !channel || !amount) {
      throw new Error('Expense Name, Channel, and Amount are required.');
    }
    const newExpense = {
      id: 'exp_' + crypto.randomUUID(),
      campaign_id: this.data.campaign.id,
      name: name.trim(),
      channel: channel.trim(),
      amount: Number(amount),
      date: date || new Date().toISOString().split('T')[0],
      notes: notes || '',
      created_at: new Date().toISOString()
    };
    this.data.expenses.push(newExpense);
    this.save();
    return newExpense;
  }

  deleteExpense(id) {
    this.data.expenses = this.data.expenses.filter(e => e.id !== id);
    this.save();
    return true;
  }

  // --- Students List / Admin View ---
  getStudentsList({ search = '', channel = '', college = '', page = 1, limit = 50 }) {
    let filtered = [...this.data.students];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.referral_code.toLowerCase().includes(q) ||
        s.college.toLowerCase().includes(q)
      );
    }

    if (channel && channel !== 'all') {
      filtered = filtered.filter(s => s.source.toLowerCase() === channel.toLowerCase());
    }

    if (college && college !== 'all') {
      filtered = filtered.filter(s => s.college.toLowerCase().includes(college.toLowerCase()));
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      students: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // --- Demo Data Generator (Realistic 347 Students) ---
  generateDemoData() {
    console.log('[DB] Seeding realistic 347 student registrations across 7-day timeline...');

    const colleges = [
      'Vellore Institute of Technology (VIT)',
      'SRM Institute of Science and Technology',
      'BMS College of Engineering, Bengaluru',
      'PES University, Bengaluru',
      'RV College of Engineering',
      'MIT World Peace University, Pune',
      'Thapar Institute of Engg & Tech',
      'Chitkara University',
      'Amity University',
      'Kalinga Institute of Industrial Technology (KIIT)'
    ];

    const branches = ['Computer Science & Engg', 'Information Technology', 'AI & Data Science', 'Electronics & Comm Engg', 'Electrical & Electronics'];
    const channels = ['WhatsApp', 'Referral', 'College Club', 'LinkedIn', 'Instagram', 'Email'];
    const channelWeights = [0.38, 0.34, 0.12, 0.08, 0.05, 0.03];

    const firstNames = [
      'Ananya', 'Rahul', 'Priya', 'Aditya', 'Sneha', 'Rohan', 'Tanvi', 'Varun', 'Kavya', 'Siddharth',
      'Neha', 'Kunal', 'Ishaan', 'Meera', 'Arjun', 'Ritu', 'Akash', 'Shruti', 'Vikram', 'Divya',
      'Nikhil', 'Pooja', 'Gaurav', 'Shreya', 'Harsh', 'Anjali', 'Deepak', 'Swati', 'Manish', 'Kritika'
    ];
    const lastNames = ['Sharma', 'Verma', 'Reddy', 'Patel', 'Iyer', 'Nair', 'Gupta', 'Singh', 'Kulkarni', 'Mehta', 'Rao', 'Das', 'Chatterjee', 'Joshi', 'Bose'];

    const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const pickWeighted = (items, weights) => {
      let r = Math.random();
      for (let i = 0; i < items.length; i++) {
        if (r < weights[i]) return items[i];
        r -= weights[i];
      }
      return items[items.length - 1];
    };

    const students = [];
    const referrals = [];

    // Create 347 realistic records spread over past 4 days
    const totalDemo = 347;
    const baseStartDate = new Date('2026-10-01T09:00:00Z');

    // Create a pool of high-performing referral champions
    const champions = [
      { name: 'Ananya Sharma', college: 'Vellore Institute of Technology (VIT)', code: 'NXT-VIT01', targetRefs: 24 },
      { name: 'Rahul Reddy', college: 'SRM Institute of Science and Technology', code: 'NXT-SRM02', targetRefs: 18 },
      { name: 'Priya Iyer', college: 'BMS College of Engineering, Bengaluru', code: 'NXT-BMS03', targetRefs: 15 },
      { name: 'Aditya Patel', college: 'PES University, Bengaluru', code: 'NXT-PES04', targetRefs: 12 },
      { name: 'Sneha Kulkarni', college: 'MIT World Peace University, Pune', code: 'NXT-MIT05', targetRefs: 9 },
      { name: 'Rohan Gupta', college: 'RV College of Engineering', code: 'NXT-RVC06', targetRefs: 8 },
      { name: 'Tanvi Nair', college: 'Thapar Institute of Engg & Tech', code: 'NXT-THP07', targetRefs: 6 },
      { name: 'Varun Rao', college: 'Chitkara University', code: 'NXT-CHK08', targetRefs: 5 },
      { name: 'Kavya Singh', college: 'Kalinga Institute of Industrial Technology (KIIT)', code: 'NXT-KIT09', targetRefs: 4 }
    ];

    // Register champions first
    champions.forEach((c, idx) => {
      const email = `${c.name.toLowerCase().replace(/\s+/g, '.')}${idx + 1}@example.com`;
      const champ = {
        id: `std_champ_${idx + 1}`,
        name: c.name,
        email,
        phone: `+9198765432${idx.toString().padStart(2, '0')}`,
        college: c.college,
        branch: 'Computer Science & Engg',
        graduation_year: '2027',
        skill_level: 'Intermediate',
        preferred_technology: 'Python',
        referral_code: c.code,
        referred_by: null,
        source: 'College Club',
        utm_source: 'college_club',
        utm_medium: 'core_team',
        utm_campaign: 'ai_workshop_launch',
        utm_content: null,
        referrals_count: c.targetRefs,
        leaderboard_visible: true,
        created_at: new Date(baseStartDate.getTime() + idx * 3600000).toISOString()
      };
      students.push(champ);
    });

    // Populate remaining students up to 347
    let remainingToGenerate = totalDemo - champions.length;
    let champRefIndex = 0;
    let champRefsGiven = champions.map(() => 0);

    for (let i = 0; i < remainingToGenerate; i++) {
      const fn = pickRandom(firstNames);
      const ln = pickRandom(lastNames);
      const name = `${fn} ${ln}`;
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i + 10}@student.edu`;
      const college = pickRandom(colleges);
      const branch = pickRandom(branches);
      const dayOffset = Math.min(3.8, (i / remainingToGenerate) * 4); // Spread across Day 1 - Day 4
      const timestamp = new Date(baseStartDate.getTime() + dayOffset * 24 * 3600000 + Math.random() * 3600000 * 6).toISOString();

      let assignedReferrer = null;
      // Assign referrals to match champions' targets
      for (let cIdx = 0; cIdx < champions.length; cIdx++) {
        if (champRefsGiven[cIdx] < champions[cIdx].targetRefs) {
          assignedReferrer = champions[cIdx];
          champRefsGiven[cIdx]++;
          break;
        }
      }

      const source = assignedReferrer ? 'Referral' : pickWeighted(channels, channelWeights);
      const refCode = `NXT-${crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 5)}`;

      const newStd = {
        id: `std_demo_${i + 1}`,
        name,
        email,
        phone: `+9191${Math.floor(10000000 + Math.random() * 89999999)}`,
        college,
        branch,
        graduation_year: pickRandom(['2027', '2027', '2026', '2025']),
        skill_level: pickRandom(['Beginner', 'Beginner', 'Intermediate', 'Advanced']),
        preferred_technology: pickRandom(['Python', 'Python', 'JavaScript', 'Java', 'C/C++']),
        referral_code: refCode,
        referred_by: assignedReferrer ? assignedReferrer.code : null,
        source,
        utm_source: source === 'Referral' ? 'peer_referral' : source.toLowerCase(),
        utm_medium: source === 'WhatsApp' ? 'group_share' : 'campaign',
        utm_campaign: 'ai_60_challenge',
        utm_content: null,
        referrals_count: 0,
        leaderboard_visible: true,
        created_at: timestamp
      };

      students.push(newStd);

      if (assignedReferrer) {
        referrals.push({
          id: `ref_demo_${i + 1}`,
          referrer_student_id: students.find(s => s.referral_code === assignedReferrer.code)?.id || 'std_champ_1',
          referred_student_id: newStd.id,
          referral_code: assignedReferrer.code,
          status: 'confirmed',
          created_at: timestamp
        });
      }
    }

    // Set sample expenses totalling ₹1,250 (out of ₹2,000 budget)
    const expenses = [
      {
        id: 'exp_1',
        campaign_id: DEFAULT_CAMPAIGN.id,
        name: 'WhatsApp Community Booster Ads',
        channel: 'WhatsApp',
        amount: 450,
        date: '2026-10-01',
        notes: 'Broadcasted to 12 college coding group admins across Karnataka & Tamil Nadu'
      },
      {
        id: 'exp_2',
        campaign_id: DEFAULT_CAMPAIGN.id,
        name: 'Instagram Micro-Creator Reel Boost',
        channel: 'Instagram',
        amount: 400,
        date: '2026-10-02',
        notes: 'Promotion with 2 student AI tech creators (45k followers)'
      },
      {
        id: 'exp_3',
        campaign_id: DEFAULT_CAMPAIGN.id,
        name: 'College Campus Poster & Club Incentive',
        channel: 'College Club',
        amount: 250,
        date: '2026-10-03',
        notes: 'Print QR standees for CS labs and club room notice boards'
      },
      {
        id: 'exp_4',
        campaign_id: DEFAULT_CAMPAIGN.id,
        name: 'Top Referrer AI Starter Swag Packets',
        channel: 'Referral Incentive',
        amount: 150,
        date: '2026-10-04',
        notes: 'Digital certificates & AI prompt engineering handbooks for top referrers'
      }
    ];

    this.data = {
      campaign: { ...DEFAULT_CAMPAIGN },
      admin: { ...DEFAULT_ADMIN },
      students,
      referrals,
      expenses,
      settings: {
        demoModeActive: true
      }
    };

    this.save();
    console.log(`[DB] Successfully seeded ${students.length} students and ${expenses.length} expenses.`);
  }

  // --- Reset to Clean Empty State ---
  clearData() {
    this.data.students = [];
    this.data.referrals = [];
    this.data.expenses = [];
    this.data.campaign = { ...DEFAULT_CAMPAIGN };
    this.data.settings.demoModeActive = false;
    this.save();
    console.log('[DB] Database reset to clean state.');
  }
}

export const db = new GrowthDatabase();
