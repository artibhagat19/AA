import React, { useState, useEffect } from "react";
import "./Summarizer.css";

const API_KEY = "AIzaSyCa5HHImK1ZK8onxEtYhjJ_kfzx4T2eJI0";
const MODEL_NAME = "gemini-1.5-flash";

const Summarizer = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [savedSummaries, setSavedSummaries] = useState([]);

  useEffect(() => {
    const storedSummaries = JSON.parse(localStorage.getItem("summaries")) || [];
    setSavedSummaries(storedSummaries);
  }, []);

  const saveSummariesToLocalStorage = (summaries) => {
    localStorage.setItem("summaries", JSON.stringify(summaries));
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      alert("Please enter text to summarize!");
      return;
    }

    setSummary("Generating summary...");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Summarize: ${inputText}` }] }],
          }),
        }
      );

      const data = await response.json();
      const generatedSummary =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "Error generating summary.";

      setSummary(generatedSummary);
    } catch (error) {
      console.error("Error:", error);
      setSummary("Failed to generate summary.");
    }
  };

  const handleSaveSummary = () => {
    if (!summary) return;

    const newSummaries = [
      ...savedSummaries,
      { id: Date.now(), input: inputText, summary },
    ];

    setSavedSummaries(newSummaries);
    saveSummariesToLocalStorage(newSummaries);
    setSummary("");
    setInputText("");
  };

  const handleDeleteSummary = (id) => {
    const filteredSummaries = savedSummaries.filter((item) => item.id !== id);
    setSavedSummaries(filteredSummaries);
    saveSummariesToLocalStorage(filteredSummaries);
  };

  return (
    <div className="container">
      <h1>AI Text Summarizer</h1>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text here..."
      ></textarea>

      <button className="btn-primary" onClick={handleSummarize}>
        Summarize
      </button>

      {summary && (
        <div className="summary-output">
          <h2>Summary:</h2>
          <p>{summary}</p>
          <button className="btn-success" onClick={handleSaveSummary}>
            Save
          </button>
          <button className="btn-danger" onClick={() => setSummary("")}>Delete</button>
        </div>
      )}

      <h2>Saved Summaries:</h2>
      <div className="saved-summaries-container">
        <ul>
          {savedSummaries.map((item) => (
            <li key={item.id} className="summary-item">
              <div>
                <strong>Input:</strong> {item.input}
                <br />
                <strong>Summary:</strong> {item.summary}
              </div>
              <button className="btn-danger" onClick={() => handleDeleteSummary(item.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Summarizer;
