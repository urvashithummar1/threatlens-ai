require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/analyze", (req, res) => {
  const message = req.body.message;

  // Fake AI response (for now)
  let type = "Phishing";
  let score = 8;
  let mitre = "T1566.001";
  let recommendation = "Do not click links. Verify sender.";

  res.json({
    type,
    score,
    mitre,
    recommendation
  });
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});