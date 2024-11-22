'use client';

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("hello");
  const [confidence, setConfidence] = useState<number | null>(85.78);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setMessage("Please enter a valid URL.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.prediction > 0.5) {
          const conf = parseFloat((data.prediction * 100).toFixed(2));
          setMessage("This article is real news.");
          setConfidence(conf);
        } else {
          const conf = parseFloat(((1 - data.prediction) * 100).toFixed(2));
          setMessage("This article is fake news.");
          setConfidence(conf);
        }
      } else {
        setMessage(`Error: ${data.error || "Something went wrong."}`);
        setConfidence(null);
      }
    } catch (error) {
      setMessage(`Network Error: ${error}`);
      setConfidence(null);
    }
  };

  const shareOnTwitter = () => {
    const tweetText = `I just used the Fake News Predictor! ${message} Confidence: ${confidence}% #FakeNewsPrediction`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Fake News Predictor</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="url">Enter a news article URL:</label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          style={{
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            color: "black",
          }}
          required
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>

      {message && (
  <div style={{ marginTop: "20px" }}>
    <p style={{ color: message.startsWith("Error") ? "red" : "white" }}>
      {message}
    </p>
    {confidence !== null && (
      <div style={{ marginTop: "10px" }}>
        <p>Confidence: {confidence}%</p>
        <div
          style={{
            height: "20px",
            backgroundColor: "#ccc",
            borderRadius: "10px",
            overflow: "hidden",
            marginTop: "5px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${confidence}%`,
              backgroundColor: confidence > 50 ? "#4caf50" : "#f44336",
              transition: "width 0.3s ease",
            }}
          ></div>
        </div>
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <button
            onClick={shareOnTwitter}
            style={{
              padding: "10px",
              backgroundColor: "#1DA1F2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Share on Twitter
          </button>
        </div>
      </div>
    )}
  </div>
)}
    </div>
  );
}
