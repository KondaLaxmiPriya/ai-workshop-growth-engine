import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { generateSharingMessage } from './aiGenerator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DIST = path.join(__dirname, '../client/dist');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// ============================================================================
// PUBLIC CAMPAIGN & METADATA ENDPOINTS
// ============================================================================

// GET /api/campaign -> General campaign info and live registration counter
app.get('/api/campaign', (req, res) => {
  try {
    const campaign = db.getCampaign();
    const metrics = db.getAdminMetrics();

    res.json({
      success: true,
      campaign: {
        ...campaign,
        current_registrations: metrics.totalRegistrations,
        progress_percentage: metrics.progressPercentage,
        remaining_seats: metrics.remainingSeatsNeeded,
        days_remaining: metrics.daysRemaining
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ============================================================================
// STUDENT REGISTRATION & DASHBOARD ENDPOINTS
// ============================================================================

// POST /api/register -> Register a student & handle referral crediting
app.post('/api/register', (req, res) => {
  try {
    const student = db.registerStudent(req.body);

    res.status(201).json({
      success: true,
      message: 'Registration confirmed successfully!',
      student
    });
  } catch (err) {
    const statusCode = err.status || 400;

    res.status(statusCode).json({
      success: false,
      error: err.message,
      student: err.student || null
    });
  }
});

// GET /api/students/:code -> Get student dashboard profile by referral code
app.get('/api/students/:code', (req, res) => {
  try {
    const student = db.getStudentByCode(req.params.code);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student with this referral code not found.'
      });
    }

    res.json({
      success: true,
      student
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET /api/students/by-email/:email -> Lookup student by email
app.get('/api/students/by-email/:email', (req, res) => {
  try {
    const student = db.getStudentByEmail(req.params.email);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'No registration found for this email.'
      });
    }

    res.json({
      success: true,
      student
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ============================================================================
// LEADERBOARDS (STUDENT & COLLEGE)
// ============================================================================

// GET /api/leaderboard -> Anonymized student growth leaderboard
app.get('/api/leaderboard', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 25;
    const leaderboard = db.getLeaderboard(limit);

    res.json({
      success: true,
      leaderboard
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET /api/colleges/leaderboard -> College level aggregation
app.get('/api/colleges/leaderboard', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const colleges = db.getCollegeLeaderboard(limit);

    res.json({
      success: true,
      colleges
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ============================================================================
// AI MESSAGE GENERATOR
// ============================================================================

// POST /api/ai/generate-message -> Generate customized sharing message
app.post('/api/ai/generate-message', (req, res) => {
  try {
    const {
      audience,
      tone,
      studentName,
      referralLink,
      referralCode
    } = req.body;

    const message = generateSharingMessage({
      audience,
      tone,
      studentName,
      referralLink,
      referralCode
    });

    res.json({
      success: true,
      message
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ============================================================================
// ADMIN AUTHENTICATION & DASHBOARD ENDPOINTS
// ============================================================================

// Simple admin auth middleware
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Admin authentication token required.'
    });
  }

  const token = authHeader.split(' ')[1];

  if (token !== 'demo_admin_jwt_token_2026') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid admin token.'
    });
  }

  next();
};

// POST /api/admin/login -> Verify admin credentials
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;

  if (
    email === 'admin@nxtwave.tech' &&
    password === 'growthadmin2026'
  ) {
    return res.json({
      success: true,
      token: 'demo_admin_jwt_token_2026',
      user: {
        email: 'admin@nxtwave.tech',
        name: 'NxtWave Growth Lead',
        role: 'growth_admin'
      }
    });
  }

  res.status(401).json({
    success: false,
    error:
      'Invalid admin credentials. Use admin@nxtwave.tech / growthadmin2026'
  });
});

// GET /api/admin/metrics -> Comprehensive growth metrics,
// trends, Recharts data, and AI insights
app.get('/api/admin/metrics', requireAdmin, (req, res) => {
  try {
    const metrics = db.getAdminMetrics();

    res.json({
      success: true,
      metrics
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// POST /api/admin/campaign -> Update campaign configuration
app.post('/api/admin/campaign', requireAdmin, (req, res) => {
  try {
    const updated = db.updateCampaign(req.body);

    res.json({
      success: true,
      campaign: updated
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET /api/admin/expenses -> List expenses
app.get('/api/admin/expenses', requireAdmin, (req, res) => {
  try {
    const expenses = db.getExpenses();

    res.json({
      success: true,
      expenses
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// POST /api/admin/expenses -> Log new campaign expense
app.post('/api/admin/expenses', requireAdmin, (req, res) => {
  try {
    const expense = db.addExpense(req.body);

    res.status(201).json({
      success: true,
      expense
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// DELETE /api/admin/expenses/:id -> Remove expense
app.delete('/api/admin/expenses/:id', requireAdmin, (req, res) => {
  try {
    db.deleteExpense(req.params.id);

    res.json({
      success: true,
      message: 'Expense deleted'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET /api/admin/students -> Paginated student records
// with search & filters
app.get('/api/admin/students', requireAdmin, (req, res) => {
  try {
    const {
      search,
      channel,
      college,
      page,
      limit
    } = req.query;

    const result = db.getStudentsList({
      search: search || '',
      channel: channel || '',
      college: college || '',
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 50
    });

    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ============================================================================
// DEMO MODE CONTROLS
// (SEEDED SIMULATION FOR EVALUATOR DEMO)
// ============================================================================

// POST /api/admin/demo/generate
// -> Reset and seed 347 realistic records
app.post('/api/admin/demo/generate', requireAdmin, (req, res) => {
  try {
    db.generateDemoData();

    res.json({
      success: true,
      message:
        'Seeded 347 realistic student records, referral trees, and ₹1,250 expenses.'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// POST /api/admin/demo/clear -> Clear all records to 0
app.post('/api/admin/demo/clear', requireAdmin, (req, res) => {
  try {
    db.clearData();

    res.json({
      success: true,
      message: 'Cleared all student and referral data.'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// POST /api/admin/demo/quick-referral
// -> Quick helper to test referral live during interview demo
app.post('/api/admin/demo/quick-referral', (req, res) => {
  try {
    const { ref_code } = req.body;

    if (!ref_code) {
      return res.status(400).json({
        success: false,
        error: 'ref_code is required'
      });
    }

    const randId = Math.floor(1000 + Math.random() * 9000);

    const demoFriend = {
      name: `Demo Friend ${randId}`,
      email: `friend${randId}@example.com`,
      phone: `+91980000${randId}`,
      college: 'Vellore Institute of Technology (VIT)',
      branch: 'Computer Science & Engg',
      graduation_year: '2027',
      skill_level: 'Beginner',
      preferred_technology: 'Python',
      source: 'Referral',
      ref_code: ref_code
    };

    const student = db.registerStudent(demoFriend);

    res.json({
      success: true,
      message: `Simulated friend registered using code ${ref_code}`,
      student
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

// Root ping
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Workshop Growth Engine API',
    version: '1.0.0'
  });
});

// ============================================================================
// SERVE FRONTEND BUILD
// ============================================================================

if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));

  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      return res.sendFile(
        path.join(CLIENT_DIST, 'index.html')
      );
    }

    next();
  });

  console.log(
    `[SERVER] Serving production frontend build from ${CLIENT_DIST}`
  );
}

// ============================================================================
// START SERVER
// ============================================================================

// IMPORTANT FOR RENDER:
// Listen on 0.0.0.0 so the application is accessible externally.
app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `[SERVER] AI Workshop Growth Engine running on port ${PORT}`
  );
});