'use client';

import { useState } from "react";
import { CiTwitter } from "react-icons/ci";
import { IoIosInformationCircle } from "react-icons/io";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [model, setModel] = useState<string>("");

  const URL = "https://fake-news-predictor-backend-1.onrender.com/";
  // const URL = "http://127.0.0.1:5000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setMessage("Please enter a valid URL.");
      return;
    }

    if(model == ""){
      alert("No model selected. Please select a model.");
      return;
    }

    try {
      const response = await fetch(`${URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, model }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.prediction > 0.5) {
          const conf = parseFloat((data.prediction * 100).toFixed(2));
          setMessage("REAL NEWS");
          setConfidence(conf);
        } else {
          const conf = parseFloat(((1 - data.prediction) * 100).toFixed(2));
          setMessage("FAKE NEWS");
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
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 className="text-6xl font-bold">Fake News Predictor</h1>
      <h3 className="mb-6">Combating the spread of misinformation, one article at a time.</h3>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://theonion.com/rfk-jr-demands-secret-service-protection-after-finding-cheez-it-on-kitchen-floor/"
          style={{
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            color: "black",
          }}
          required
        />

        <div className="flex flex-col items-center gap-6 mt-10">
          <div className="flex items-center gap-4">
            <button
              type="submit"
              onClick = {() => setModel("cnn")}
              className="w-40 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              CNN Model
            </button>

            <a
              href="https://towardsdatascience.com/convolutional-neural-networks-explained-9cc5188c4939"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300"
            >
              <IoIosInformationCircle size={20} />
            </a>

          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              onClick = {() => setModel("lstm")}
              className="w-40 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              LSTM Model
            </button>

            <a
                href="https://medium.com/@rebeen.jaff/what-is-lstm-introduction-to-long-short-term-memory-66bd3855b9ce"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300"
              >
                <IoIosInformationCircle size={20} />
              </a>
          </div>
        </div>

          
      </form>

      {message && (
  <div style={{ marginTop: "40px" }}>

<div style={{ textAlign: "center" }}>
<p
  style={{
    color: message.startsWith("Error")
      ? "blue"
      : message.includes("FAKE NEWS")
      ? "#fc0328"
      : message.includes("REAL NEWS")
      ? "#03fc4e"
      : "white",
  }}

  className="text-4xl "
>
  {message}
</p>

</div>
    {confidence !== null && (
      <div style={{ marginTop: "10px" }}>
        <p>
          Confidence: <i>{confidence}%</i>
        </p>
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

        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <button
            onClick={shareOnTwitter}
            style={{
              width: "120px",
              padding: "10px 15px",
              backgroundColor: "#1DA1F2",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1991DB")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1DA1F2")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Share <CiTwitter size={20} />
          </button>
        </div>

      </div>
    )}
  </div>
)}
    </div>
  );
}
