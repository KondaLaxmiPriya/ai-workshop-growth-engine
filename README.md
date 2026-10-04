# 🚀 AI Workshop Growth Engine
### *"Turn student interest into 500 registrations."*

A full-stack, viral acquisition and growth platform engineered for **NxtWave's Growth Challenge**. Built to acquire, track, and amplify registrations for the free online workshop: **"Build Your First AI Project in 60 Minutes"**, targeting **500 final-year engineering students in 7 days with a ₹2,000 budget**.

---

## 📌 Problem Statement & Context
- **Workshop:** "Build Your First AI Project in 60 Minutes" (Free, Online, 60 Minutes)
- **Target Audience:** Final-year engineering students (Graduating 2025/2026 across CSE, IT, ECE, EEE, AI/DS)
- **Primary Goal:** 500 confirmed student registrations within 7 days
- **Budget Constraint:** ₹2,000 total marketing budget (Blended target CPA ≤ ₹4.00)
- **Core Challenge:** Generic landing pages have low conversion and zero viral amplification. To hit 500 registrations within a ₹2,000 ceiling, organic peer-to-peer sharing and campus network effects must drive ≥ 35% of all registrations.

---

## 💡 Solution: The AI Workshop Growth Engine
Rather than a static landing page, this system combines:
1. **High-Converting Landing Page** tailored to final-year student placement anxieties and project needs.
2. **Deterministic Referral Loop** with auto-generated referral codes (`NXT-A7K92`) and shareable links (`/?ref=NXT-XXXXX`).
3. **AI-Powered Sharing Assistant** generating tailored copy across 5 audiences (College WhatsApp Groups, Coding Clubs, Friends, LinkedIn, Classmates) and 4 tones (Friendly, Professional, Exciting, Short).
4. **Gamified Student Dashboard** with milestones (*AI Starter*, *AI Builder*, *Growth Champion*, *AI Growth Leader*) and instant WhatsApp sharing.
5. **Privacy-Preserving Campus & Student Leaderboard** (anonymized names and colleges, opt-out support).
6. **Real-Time Admin Growth Command Center** featuring live pacing analysis toward the 500 goal, Recharts analytics, UTM channel attribution, budget burn-rate tracker, and algorithmic AI growth insights.
7. **Built-in Anti-Fraud & Duplicate Protection** preventing self-referral and duplicate email misuse.

---

## 🧱 Tech Stack & Architecture

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS (Dark/Modern tech aesthetic with emerald growth indicators)
- **Icons:** Lucide React
- **Visual Analytics:** Recharts (Area charts, bar charts, donut charts, histograms)
- **Celebration UX:** Canvas Confetti

### Backend & Database
- **Runtime:** Node.js (v20+ / v22) + Express.js
- **Persistence:** Relational JSON Database with ACID file writes (`server/data/growth_engine.json`) + Production PostgreSQL / Supabase Schema (`server/schema.sql`)
- **Security:** Bearer token authentication, input sanitization, duplicate email validation, self-referral blocking
- **Architecture:** Clean modular REST API (`/api/campaign`, `/api/register`, `/api/students/:code`, `/api/leaderboard`, `/api/admin/*`, `/api/ai/*`)

---

## 🔁 The Core Growth Loop

```text
Student Discovers Workshop (WhatsApp / Club / Ad)
                    ↓
   Completes Frictionless Registration Form
                    ↓
  Unique Referral Code Generated (e.g. NXT-A7K92)
                    ↓
  AI Tailors Customized WhatsApp / LinkedIn Message
                    ↓
     Student Shares in College / Lab WhatsApp Groups
                    ↓
Friends Register Through Link (/?ref=NXT-A7K92)
                    ↓
Referral Count Increments & Milestone Badges Unlock
                    ↓
      Ranks on Campus Leaderboard (Social Proof)
                    ↓
           More Peer Sharing (K-Factor > 0.40)
```

---

## 🗄 Database Schema Design

The production PostgreSQL / Supabase schema is defined in `server/schema.sql`:

- **`campaigns`**: Campaign parameters (target: 500, budget: 2000, start/end dates, workshop date).
- **`students`**: Registered student records (`id`, `name`, `email`, `phone`, `college`, `branch`, `graduation_year`, `skill_level`, `preferred_technology`, `referral_code`, `referred_by`, `source`, `utm_*`, `referrals_count`, `leaderboard_visible`).
- **`referrals`**: Audit trail of confirmed peer referrals (`id`, `referrer_student_id`, `referred_student_id`, `referral_code`, `status`, `created_at`).
- **`expenses`**: Campaign expenditures (`id`, `campaign_id`, `name`, `channel`, `amount`, `date`, `notes`).
- **`admin_users`**: Admin credentials and roles.

---

## 🛡 Anti-Fraud & Attribution Integrity
1. **Unique Email Constraint:** Email addresses are normalized to lowercase. Duplicate attempts return a 409 Conflict error with a direct link to the student's existing dashboard.
2. **Self-Referral Prevention:** If a student attempts to register using their own referral code, email, or phone number, the referral credit is blocked.
3. **Verified Attribution Only:** Referrals are credited **only** upon full, valid registration completion—not mere link clicks.
4. **Attribution Hierarchy:** URL referral codes (`?ref=...`) take first priority, followed by UTM parameters (`utm_source`), followed by self-selected attribution channels.

---

## ⚡ Quick Start: Running Locally

### Prerequisites
- Node.js v18+ or v22+
- npm v9+

### 1. Clone & Install
```bash
cd ai-workshop-growth-engine
npm run install:all
```
*(Or install packages in root, client, and server folders individually).*

### 2. Start Both Client and Backend (Unified Dev Mode)
```bash
npm run dev
```

- **Frontend Application:** `http://localhost:3000` (or `http://localhost:5000` when running production build)
- **Backend REST API:** `http://localhost:5000/api`

---

## 🔑 Demo & Admin Credentials

To inspect the Growth Dashboard during interviews:
- **Admin Portal URL:** Click **"Admin Hub"** in the top navigation or navigate to `http://localhost:3000/?view=admin`
- **Email:** `admin@nxtwave.tech`
- **Password:** `growthadmin2026`
*(A 1-click credential auto-fill button is provided on the login modal for quick access).*

---

## 🎮 2-to-3 Minute Interview Demo Flow

1. **Open Landing Page (`http://localhost:3000`):**
   - Note the live dynamic counter: **347 / 500 confirmed seats** (69.4% filled, 153 remaining).
   - Point out final-year engineering student pain points and the interactive project preview (*Smart ATS Resume Reviewer*).
2. **Register a Test Student:**
   - Click **"Reserve My Free Seat"**.
   - Enter: Name: `Demo Student`, College: `ABC Engineering College`, Email: `demo_evaluator@example.com`.
   - Submit: Instant confetti celebration and unique referral code generated (e.g. `NXT-XXXXX`).
3. **Explore Student Referral Dashboard:**
   - View assigned referral code and link.
   - Click **"Share on WhatsApp"** to preview the pre-populated viral invitation.
   - Test the **AI Message Generator**: Switch between *College WhatsApp Group* and *Close Friend* to see customized copy.
   - Click **"Simulate +1 Friend Registering"** helper button to see the referral count jump from `0` to `1` live!
4. **Open Admin Growth Hub:**
   - Log in with `admin@nxtwave.tech` / `growthadmin2026`.
   - View real-time 500-goal pacing: daily required run-rate, days remaining, and projected finish.
   - Review AI Growth Insights (channel ROI, K-factor, campus clusters, budget reallocation).
   - Check Recharts analytics (Cumulative vs Target curve, Channel breakdown, Top colleges).
   - Review Budget Tracker (₹1,250 spent of ₹2,000, blended CPA of ₹3.60).
   - Demonstrate **"Generate Demo Data"** and **"Clear Data"** buttons.

---

## 🚀 Deployment Instructions

### Option A: Single Unified Node Server (Render / Railway / Heroku / AWS EC2)
The server is configured to serve the compiled frontend (`client/dist`) automatically:
```bash
cd client && npm run build
cd ../server
npm start
```
The entire application will run on port `5000`.

### Option B: Decoupled Deployment (Vercel Frontend + Render Backend / Supabase)
1. Deploy `client/` to **Vercel** with environment variable `VITE_API_BASE_URL=https://your-backend.onrender.com/api`.
2. Deploy `server/` to **Render** or **Railway**.
3. Run `server/schema.sql` inside the **Supabase SQL Editor** to initialize the PostgreSQL schema.
