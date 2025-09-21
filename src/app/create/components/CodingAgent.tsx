"use client";
import React, { useState, useEffect, useRef } from "react";
import { GameData } from "../types";

interface CodingAgentProps {
  gameData: GameData;
  onComplete: (htmlGame: string) => void;
}

const CodingAgent: React.FC<CodingAgentProps> = ({ gameData, onComplete }) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasCalledAPI = useRef(false);

  useEffect(() => {
    if (hasCalledAPI.current) return;
    const generateHTMLGame = async () => {
      hasCalledAPI.current = true;
      setIsStreaming(true);
      setError(null);

      try {
        const response = await fetch("/api/generate-html-game", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prd: gameData.prd,
          }),
        });

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body
          .pipeThrough(new TextDecoderStream())
          .getReader();

        let accumulatedContent = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            setIsStreaming(false);
            setIsComplete(true);
            // Use a timeout to ensure state updates are processed
            setTimeout(() => onComplete(accumulatedContent), 100);
            break;
          }

          // AI SDK streams plain text, so we can directly append it
          accumulatedContent += value;
          setHtmlContent(accumulatedContent);
        }
      } catch (error) {
        console.error("Error generating HTML game:", error);
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
        setIsStreaming(false);
      }
    };

    generateHTMLGame();
  }, []); // Empty dependency array since we only want this to run once

  const downloadHTML = () => {
    if (!htmlContent) return;

    const gameTitle = gameData.selectedGameIdea?.title || "ai-minigame";
    const filename = `${gameTitle
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()}.html`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          HTML Game Generation
        </h3>
        {isStreaming && (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-600">
              Generating your game...
            </span>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Failed to generate game</span>
          </div>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      )}

      {/* View Toggle Buttons */}
      {(htmlContent || isStreaming) && (
        <div className="flex justify-center gap-4 mb-2">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !showPreview
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            View Code
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            disabled={!htmlContent || isStreaming}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showPreview
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
            }`}
          >
            Preview Game
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        {showPreview ? (
          // HTML Preview
          <div className="h-96 border-b border-gray-200">
            <iframe
              srcDoc={htmlContent}
              className="w-full h-full border-0"
              title="Game Preview"
              sandbox="allow-scripts"
            />
          </div>
        ) : (
          // Code View
          <div className="h-96 overflow-auto p-4">
            <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap">
              {htmlContent}
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1"></span>
              )}
            </pre>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-6">
        {isComplete && (
          <button
            type="button"
            onClick={downloadHTML}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download HTML Game
          </button>
        )}
      </div>

      {/* Status */}
      {isComplete && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-green-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">
              Game Generated Successfully!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingAgent;
