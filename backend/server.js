const express = require("express");
const cors = require("cors");
require("dotenv").config();

const OpenAI = require("openai");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cors());

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// analyze route
app.post("/analyze", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("Incoming:", message); // debug

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a cybersecurity SOC analyst. Respond ONLY in JSON with keys: threat, risk (1-10), mitre, action."
        },
        {
          role: "user",
          content: message
        }
      ],
    });

   let text = response.choices[0].message.content;

// remove ```json formatting if present
text = text.replace(/```json/g, "").replace(/```/g, "").trim();

let data;

try {
  data = JSON.parse(text);
} catch (e) {
  console.log("JSON parse failed, raw text:", text);

  // fallback manual response
  data = {
    threat: "Unknown",
    risk: 5,
    mitre: "N/A",
    action: "Review manually"
  };
}

res.json(data);

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "AI failed" });
  }
});

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});