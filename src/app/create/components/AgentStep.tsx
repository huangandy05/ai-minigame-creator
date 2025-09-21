"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface AgentStepProps {
  stepNumber: number;
  title: string;
  description: string;
  children: React.ReactNode;
  onContinue: () => void;
  canContinue?: boolean;
  buttonText?: string;
}

interface TypingTextProps {
  text: string; // The full text to display
  speed?: number; // Delay in ms between characters
  onComplete?: () => void; // Callback when typing finishes
}

const TypingText: React.FC<TypingTextProps> = ({
  text,
  speed = 50,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText(""); // Reset displayed text
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]); // Removed onComplete from dependencies to prevent re-renders

  return <span>{displayedText}</span>;
};

const AgentStep: React.FC<AgentStepProps> = ({
  stepNumber,
  title,
  description,
  children,
  onContinue,
  canContinue = false,
  buttonText = "Continue",
}) => {
  const robotImage = `/robot${stepNumber}.png`;
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Reset typing when stepNumber changes
  useEffect(() => {
    setIsTypingComplete(false);
  }, [stepNumber, description]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <p className="text-md text-gray-600">Step {stepNumber} of 5</p>
      </div>

      {/* Agent Avatar and Speech Bubble */}
      <div className="flex items-start gap-6 mb-4">
        {/* Robot Avatar */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-white border-4 border-blue-200 flex items-center justify-center shadow-lg">
            <Image
              src={robotImage}
              alt={`Agent ${stepNumber}`}
              width={64}
              height={64}
              className="object-cover rounded-full"
            />
          </div>
        </div>

        {/* Speech Bubble */}
        <div className="relative bg-white rounded-2xl p-4 shadow-lg border border-gray-200 flex-1">
          {/* Speech bubble arrow */}
          <div className="absolute left-[-12px] top-6 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[12px] border-r-white"></div>
          <div className="absolute left-[-13px] top-6 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[12px] border-r-gray-200"></div>
          <div className="text-gray-700 text-md leading-relaxed whitespace-pre-line">
            <TypingText
              key={`${stepNumber}-${description}`}
              text={description.replace(/\n/g, "\n\n")}
              speed={10}
              onComplete={() => setIsTypingComplete(true)}
            />
          </div>
        </div>
      </div>

      {/* Content Area - Only show when typing is complete */}
      {isTypingComplete && (
        <div className="mb-2 ml-26 animate-fadeIn">{children}</div>
      )}

      {/* Continue Button - Only show when typing is complete */}
      {isTypingComplete && (
        <div className="ml-26 mb-4 text-center animate-fadeIn">
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            className={`
              px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 hover:cursor-pointer
              ${
                canContinue
                  ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {buttonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default AgentStep;
