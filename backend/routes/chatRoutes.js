const { Router } = require("express");
const { Groq } = require("groq-sdk");
const Vacancy = require("../models/Vacancy"); // ඔයාගේ Vacancy මොඩල් එක

const router = Router();

// Groq SDK එක Initialize කිරීම
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 🚀 Chatbot Endpoint
router.post("/chat", async (req, res) => {
  try {
    const { message, chatHistory } = req.body; // chatHistory එක එවන්නේ කලින් කතා කරපු දේවල් මතක තියාගන්න

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 1. දැනට ඩේටාබේස් එකේ තියෙන Active රැකියා විස්තර ලබා ගැනීම
    const activeJobs = await Vacancy.find({ status: "Active" }).select("jobTitle jobDescription location salaryRange jobType");
    
    // 2. ජොබ් ඩේටා ටික AI එකට කියවන්න ලේසි වෙනස් Text එකක් බවට හැරවීම
    const jobsContext = activeJobs.map(job => 
      `Title: ${job.jobTitle}, Location: ${job.location}, Salary: ${job.salaryRange}, Type: ${job.jobType}, Description: ${job.jobDescription}`
    ).join("\n\n");

    // 3. AI එක පාලනය කරන System Prompt එක (නීති රීති මාලාව)
    const systemPrompt = `
      You are an advanced Job Assistant AI chatbot for our recruitment platform.
       Your strictly primary rule: You MUST ONLY answer questions related to job vacancies, career advice, resumes, interviews, or available jobs listed below.
      
      If the user asks about anything else (e.g., cooking, politics, sports, general knowledge, math, coding unrelated to jobs, etc.), politely decline and say:
      "I am sorry, but I am programmed to only assist you with job vacancies, career advice, and employment-related queries."
      
      Here is the live data of currently available job vacancies on our platform:
      ---
      ${jobsContext || "No active jobs available at the moment."}
      ---
      
      Guidelines:
      1. Use the provided job data to suggest matches if the user asks for specific jobs.
      2. Keep answers professional, friendly, clear, and concise.
      3. Reply in the language used by the user (English or Sinhala).
    `;

    // 4. Groq වෙත යැවීම සඳහා Messages Array එක සකස් කිරීම
    const messages = [
      { role: "system", content: systemPrompt }
    ];

    // කලින් කතා කරපු හිස්ට්‍රියක් තිබේ නම් ඒවා එකතු කිරීම
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach(msg => {
        messages.push({ role: msg.role, content: msg.content });
      });
    }

    // වත්මන් පරිශීලක පණිවිඩය එකතු කිරීම
    messages.push({ role: "user", content: message });

    // 5. Groq API හරහා Llama Model එක Call කිරීම
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile", // වේගවත් සහ බුද්ධිමත් මෝස්තරයකි
      temperature: 0.3, // උත්තර වල නිරවද්‍යතාව වැඩි කිරීමට (Creativity අඩු කර නීති වලටම තබා ගැනීමට)
      max_tokens: 500,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content;

    return res.status(200).json({
      success: true,
      reply: aiResponse,
    });

  } catch (error) {
    console.error("Groq AI Chat Error:", error);
    return res.status(500).json({ error: "Internal server error with AI Chatbot" });
  }
});

module.exports = router;