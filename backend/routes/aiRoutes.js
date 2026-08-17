const mongoose = require("mongoose");
const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");
const Vacancy = require("../models/Vacancy"); // .js කෑල්ල ඉවත් කර ඇත

const router = Router();

// uploads folder එක පරීක්ෂා කිරීම සහ සෑදීම
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage එක සකස් කිරීම
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "ai-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
});

// Python Script එක හරහා PDF එක කියවීමේ Function එක
const parsePdfWithPython = (filePath) => {
  return new Promise((resolve, reject) => {
    execFile("python", ["parse_pdf.py", filePath], (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      try {
        const result = JSON.parse(stdout);
        if (result.error) {
          return reject(new Error(result.error));
        }
        resolve(result.text);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
};

// 🧠 Keyword Matching Algorithm
function calculateMatchScore(cvText, jobDescription) {
  const cleanText = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3);

  const cvWords = new Set(cleanText(cvText));
  const jobWords = cleanText(jobDescription);

  if (jobWords.length === 0) return 0;

  let matchCount = 0;
  jobWords.forEach((word) => {
    if (cvWords.has(word)) matchCount++;
  });

  return Math.round((matchCount / jobWords.length) * 100);
}

// 🚀 POST Route
router.post("/suggest-jobs", upload.single("cv"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a PDF CV to scan" });
    }

    let cvText = "";
    if (req.file.mimetype === "application/pdf") {
      try {
        cvText = await parsePdfWithPython(req.file.path);
      } catch (pdfError) {
        console.error("Python PDF Parse Error:", pdfError);
        return res.status(500).json({ error: "Failed to parse PDF using Python script" });
      } finally {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
    } else {
      return res.status(400).json({ error: "Only PDF files are supported for AI scanning" });
    }

    const activeJobs = await Vacancy.find({ status: "Active" }).populate('companyId');

    const scoredJobs = activeJobs.map((job) => {
      const score = calculateMatchScore(cvText, job.jobDescription || "");
      return {
        _id: job._id,
        jobTitle: job.jobTitle,
        companyId: job.companyId,
        jobType: job.jobType,
        salaryRange: job.salaryRange,
        location: job.location,
        jobDescription: job.jobDescription,
        matchPercentage: score,
      };
    });

    const filteredJobs = scoredJobs
      .filter((j) => j.matchPercentage > 10)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    return res.status(200).json({
      success: true,
      count: filteredJobs.length,
      suggestions: filteredJobs,
    });

  } catch (error) {
    console.error("AI Match Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// CommonJS export ක්‍රමය 
module.exports = router;