const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/analyze", async (req, res) => {
  try {
    res.json({
      threat: "Phishing",
      risk: 8,
      mitre: "T1566.001",
      action: "Do not click links. Verify sender."
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});