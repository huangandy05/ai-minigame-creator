"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { GameData } from "../types";

interface ProductManagerAgentProps {
  gameData: GameData;
  onComplete: (prd: string) => void;
}

const ProductManagerAgent: React.FC<ProductManagerAgentProps> = ({
  gameData,
  onComplete,
}) => {
  const [content, setContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const hasCalledAPI = useRef(false);

  useEffect(() => {
    if (hasCalledAPI.current) return;
    const generatePRD = async () => {
      hasCalledAPI.current = true;
      setIsStreaming(true);

      try {
        // Format questions and answers as space-separated pairs
        const questionsAndAnswers = Object.entries(gameData.questionAnswers)
          .map(([question, answer]) => `${question}: ${answer}`)
          .join(" | ");

        const response = await fetch("/api/generate-prd", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedConcept: gameData.selectedConcept,
            gameTitle: gameData.selectedGameIdea?.title || "",
            gameDescription: gameData.selectedGameIdea?.description || "",
            questionsAndAnswers: questionsAndAnswers,
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
          setContent(accumulatedContent);
        }
      } catch (error) {
        console.error("Error generating PRD:", error);
        setIsStreaming(false);
      }
    };

    generatePRD();
  }, []); // Empty dependency array since we only want this to run once

  return (
    <div className="w-full max-w-4xl">
      {/* Header */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Product Requirements Document
        </h3>
        {isStreaming && (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-600">
              Generating specification...
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6 max-h-72 overflow-y-auto">
        <div className="prose prose-sm max-w-none text-gray-700">
          <ReactMarkdown>{content}</ReactMarkdown>
          {isStreaming && (
            <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-1"></span>
          )}
        </div>
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
            <span className="text-sm font-medium">Specification Complete</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagerAgent;
