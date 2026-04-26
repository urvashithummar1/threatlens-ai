import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
  let message = input;

  // if file uploaded, read file
  if (file) {
    const text = await file.text();
    message = text;
  }

  try {
    const res = await axios.post("http://localhost:5000/analyze", {
      message,
    });
    setResult(res.data);
    setInput("");
setFile(null);
setHistory([res.data, ...history.slice(0, 4)]);
    setLoading(false);
  } catch (err) {
    alert("Error connecting to backend");
  }
};

  return (
    <div className="container">
      <div className="card">

        <div className="logo">🔐</div>

        <a href="#" className="title-link">
           ThreatLens AI Dashboard
       </a>
        <p className="subtitle">AI-powered SOC threat analysis</p>

        <textarea
          placeholder="Paste your security alert..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="upload-box">
  <p>📂 Click to upload security log</p>
  <input 
    type="file" 
    onChange={(e) => setFile(e.target.files[0])}
  />
  <span className="file-name">
    {file ? file.name : "No file selected"}
  </span>
</div>

           <button onClick={analyze}>
  {loading ? "Analyzing..." : "Analyze Threat"}
</button>

 {!result && (
  <p style={{ textAlign: "center", color: "#94a3b8", marginTop: "15px" }}>
    No analysis yet. Paste or upload a security alert to begin.
  </p>
)}       
{/* ✅ RESULT (ONLY ONE) */}
{result && (
  <div className="result">
    <h3>🔍 Analysis Result</h3>

    <div className="result-row">
      <span>Threat</span>
      <b>{result.type}</b>
    </div>

    <div className="result-row">
      <span>Risk</span>
      <b style={{
        color:
          result.score >= 8 ? "#ef4444" :
          result.score >= 5 ? "#f59e0b" :
          "#22c55e"
      }}>
        {result.score}
      </b>
    </div>

    <div className="result-row">
      <span>MITRE</span>
      <b>{result.mitre}</b>
    </div>

    <div className="result-row">
      <span>Action</span>
      <b>{result.recommendation}</b>
    </div>
  </div>
)}

{/* ✅ HISTORY (SEPARATE BOX BELOW) */}
{history.length > 0 && (
  <div className="history">
    <h3>📜 Alert History</h3>

    {history.map((item, index) => (
      <div key={index} className="history-item">
        <span>{item.type}</span>
        <span style={{
          color:
            item.score >= 8 ? "#ef4444" :
            item.score >= 5 ? "#f59e0b" :
            "#22c55e"
        }}>
          {item.score}
        </span>
      </div>
    ))}
  </div>
)}

      </div>
    </div>
  );
}

export default App;