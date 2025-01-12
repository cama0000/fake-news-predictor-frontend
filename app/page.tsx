'use client';

import { useState } from "react";
import { CiTwitter } from "react-icons/ci";
import { IoIosInformationCircle } from "react-icons/io";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [model, setModel] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const shareOnTwitter = () => {
    const tweetText = `I just used the Fake News Predictor! ${message} Confidence: ${confidence}% #FakeNewsPrediction`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-4">
            Fake News Predictor
          </h1>
          <h3 className="text-xl text-gray-300">
            Combating the spread of misinformation, one article at a time.
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter article URL"
              className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                onClick={() => setModel("cnn")}
                className={`group relative px-8 py-3 rounded-lg transition-all duration-300 shadow-lg 
                  ${model === "cnn" 
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900" 
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/25"
                  }`}
              >
                CNN Model
              </button>
              <a
                href="https://towardsdatascience.com/convolutional-neural-networks-explained-9cc5188c4939"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                <IoIosInformationCircle size={24} />
              </a>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                onClick={() => setModel("lstm")}
                className={`group relative px-8 py-3 rounded-lg transition-all duration-300 shadow-lg 
                  ${model === "lstm" 
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 ring-2 ring-purple-400 ring-offset-2 ring-offset-gray-900" 
                    : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-500/25"
                  }`}
              >
                LSTM Model
              </button>
              <a
                href="https://medium.com/@rebeen.jaff/what-is-lstm-introduction-to-long-short-term-memory-66bd3855b9ce"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
              >
                <IoIosInformationCircle size={24} />
              </a>
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center mt-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </form>



        {message && (
          <div className="mt-12 bg-gray-800/50 rounded-xl p-8 backdrop-blur-sm border border-gray-700">
            <div className="text-center">
              <p
                className={`text-4xl font-bold mb-6 ${
                  message.startsWith("Error")
                    ? "text-blue-400"
                    : message.includes("FAKE NEWS")
                    ? "text-red-500"
                    : message.includes("REAL NEWS")
                    ? "text-green-500"
                    : "text-white"
                }`}
              >
                {message}
              </p>
            </div>

            {confidence !== null && (
              <div className="space-y-4">
                <p className="text-gray-300">
                  Confidence: <span className="font-semibold">{confidence}%</span>
                </p>
                <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ease-out ${
                      confidence > 50 ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{ width: `${confidence}%` }}
                  ></div>
                </div>

                <div className="flex justify-center mt-8">
                  <button
                    onClick={shareOnTwitter}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1DA1F2] rounded-lg hover:bg-[#1991DB] transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                  >
                    Share <CiTwitter size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
