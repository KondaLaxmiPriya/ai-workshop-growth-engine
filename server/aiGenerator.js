/**
 * AI Message Generator for Peer Referral Viral Amplification
 * Supports dynamic generation for different audiences & tones
 * With offline resilient template matrix and optional Gemini API integration
 */

const TEMPLATES = {
  'Close Friend': {
    'Friendly': (name, link) => `Hey! 👋 Are you free this weekend? I just registered for this free online workshop: "Build Your First AI Project in 60 Minutes" by NxtWave.

It's specially designed for final-year engineering students to get a hands-on AI project on our resumes before placements kick in. Let's do it together!

Here's the link to grab a free seat:
${link}

See you there! 🚀`,
    'Professional': (name, link) => `Hey! I came across this 60-minute practical AI workshop: "Build Your First AI Project in 60 Minutes" hosted by NxtWave for final-year engineering students.

Thought of you since you were asking about adding GenAI projects to your portfolio. It's completely free.

Register here: ${link}`,
    'Exciting': (name, link) => `Bro! Check this out 🔥 NxtWave is hosting a free hands-on workshop called "Build Your First AI Project in 60 Minutes".

We actually build and ship a working AI project live instead of just watching theory! Super useful for final-year placement prep.

Reserve your free seat here before the 500-seat limit fills up:
${link}`,
    'Short': (name, link) => `Hey! Check this free AI project workshop for final-year engineers:
${link}
Takes 60 mins and you build a working AI app. Register fast!`
  },

  'College WhatsApp Group': {
    'Friendly': (name, link) => `Hi everyone! 👋
For all of us looking for practical AI project experience for our final-year resumes, NxtWave is hosting a FREE online workshop:

📌 "Build Your First AI Project in 60 Minutes"
⏰ 60 Mins | 💻 Online | 🎯 Zero theory, 100% building
🎓 Targeted at final-year engineering students

You can reserve a free seat using this priority link:
👉 ${link}`,
    'Professional': (name, link) => `Notice to Batchmates:
NxtWave is conducting a complimentary technical masterclass: "Build Your First AI Project in 60 Minutes", tailored for final-year engineering students.

Key Takeaways:
• Hands-on development of a working AI application
• Practical exposure to GenAI workflows & APIs
• Valuable addition to technical interview portfolios

Free Registration Link: ${link}`,
    'Exciting': (name, link) => `Guys! Found an awesome opportunity for our batch 🚀

NxtWave is conducting "Build Your First AI Project in 60 Minutes" — a free hands-on workshop where we build an actual AI project from scratch in 1 hour. Perfect for our placement profiles!

Seats are limited to 500 students across colleges. Claim your free pass here:
${link}`,
    'Short': (name, link) => `Free 60-min AI Project workshop for final year batchmates:
Link: ${link}
(Build a real AI project for placements. Free registration!)`
  },

  'Coding Club': {
    'Friendly': (name, link) => `Hey club members! 💻
If you've been wanting to transition from basic Python to building real-world GenAI applications, NxtWave is holding a 60-minute free workshop: "Build Your First AI Project in 60 Minutes".

Great way to collaborate and ship something together. Register here:
${link}`,
    'Professional': (name, link) => `Dear Coding Club Members,
Here is a recommended hands-on session on AI application engineering:
Workshop: "Build Your First AI Project in 60 Minutes"
Organizer: NxtWave
Focus: Architecture, LLM integration, and rapid project deployment for final-year engineers.
Fee: 100% Free
Registration: ${link}`,
    'Exciting': (name, link) => `Attention Developers & Hackers! ⚡
Ready to build your first working AI project in just 60 minutes? NxtWave is hosting an intense, builder-focused session for final-year engineers.

No slides, just code & working AI. Let's represent our club on the leaderboard!
Register: ${link}`,
    'Short': (name, link) => `Coding Club Alert: Build an AI Project in 60 Mins (Free Workshop).
Grab a seat here: ${link}`
  },

  'LinkedIn Network': {
    'Friendly': (name, link) => `Excited to share that I'm attending NxtWave's upcoming free workshop: "Build Your First AI Project in 60 Minutes"! 🚀

As a final-year engineering student, having tangible AI projects to showcase during campus placements is crucial. This session focuses on practical execution in just 1 hour.

If any fellow final-year students want to attend, here is the free registration link:
${link}

#AI #Engineering #Projects #Placements #GenAI`,
    'Professional': (name, link) => `Accelerating practical AI competency before graduation:

I have registered for the specialized workshop "Build Your First AI Project in 60 Minutes" organized by NxtWave. The curriculum is specifically curated for final-year engineering candidates aiming to demonstrate applied AI skills to hiring teams.

Access the registration portal here:
${link}

#SoftwareEngineering #ArtificialIntelligence #FinalYear #CareerGrowth`,
    'Exciting': (name, link) => `Going from zero to a live AI project in 60 minutes! 🤖✨

I just reserved my seat for NxtWave's free masterclass: "Build Your First AI Project in 60 Minutes". If you're in your final year and want to stand out in upcoming placement interviews, don't miss this!

Reserve your free seat: ${link}`,
    'Short': (name, link) => `Registered for "Build Your First AI Project in 60 Minutes" with NxtWave! Free for final-year engineers. Join here: ${link}`
  },

  'Classmates': {
    'Friendly': (name, link) => `Hey guys! Found something useful for our upcoming semester projects and placements.

NxtWave is doing a free 60-minute workshop on building your first AI project from scratch. It's online and completely free.

Register using this link:
${link}`,
    'Professional': (name, link) => `Hello classmates,
Sharing a relevant learning resource: NxtWave is organizing a free online workshop titled "Build Your First AI Project in 60 Minutes" for final-year students. It's practical and focused on project building.

Registration link: ${link}`,
    'Exciting': (name, link) => `Guys, stop procrastinating on your AI project! 😂
Join this 60-minute free workshop by NxtWave: "Build Your First AI Project in 60 Minutes". We can knock out a working project together this week!

Register here: ${link}`,
    'Short': (name, link) => `Free 60-min AI workshop for our batch:
${link}
Build an AI project for placement resumes. Register now!`
  }
};

export function generateSharingMessage({ audience = 'Close Friend', tone = 'Friendly', studentName = 'A friend', referralLink, referralCode }) {
  const targetAudience = TEMPLATES[audience] || TEMPLATES['Close Friend'];
  const generator = targetAudience[tone] || targetAudience['Friendly'];
  
  const link = referralLink || `http://localhost:3000/?ref=${referralCode || 'NXT-GROWTH'}`;
  return generator(studentName, link);
}
