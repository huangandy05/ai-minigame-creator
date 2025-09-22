"use client";
import React, { useState, useEffect } from "react";
import { Question, GameIdea } from "../types";

const QuestionSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border-2 border-gray-200 p-8 animate-pulse">
    <div className="h-6 bg-gray-300 rounded mb-6 w-3/4"></div>
    <div className="space-y-4">
      <div className="h-12 bg-gray-300 rounded"></div>
      <div className="h-12 bg-gray-300 rounded"></div>
      <div className="h-12 bg-gray-300 rounded"></div>
    </div>
  </div>
);

interface RequirementsAgentProps {
  selectedConcept: string | null;
  selectedGameIdea: GameIdea | null;
  questionAnswers: Record<string, string>;
  onAnswerUpdate: (questionId: string, answer: string) => void;
  onQuestionsGenerated: (questions: Question[]) => void;
  onNext: () => void;
  canProceed: boolean;
  currentQuestionIndex?: number;
}

const RequirementsAgent: React.FC<RequirementsAgentProps> = ({
  selectedConcept,
  selectedGameIdea,
  questionAnswers,
  onAnswerUpdate,
  onQuestionsGenerated,
  onNext,
  canProceed,
  currentQuestionIndex = 0,
}) => {
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [questionsGenerated, setQuestionsGenerated] = useState(false);

  const generateQuestions = async () => {
    if (!selectedConcept || !selectedGameIdea || questionsGenerated) return;

    setIsGeneratingQuestions(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-game-requirements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedConcept,
          gameTitle: selectedGameIdea.title,
          gameDescription: selectedGameIdea.description,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate questions: ${response.status}`);
      }

      const data = await response.json();
      console.log("Requirements API Response:", data);

      if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
        onQuestionsGenerated(data.questions);
        setQuestionsGenerated(true);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error generating questions:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const currentAnswer = currentQuestion
    ? questionAnswers[currentQuestion.question]
    : undefined;

  const handleOptionSelect = (option: string) => {
    if (currentQuestion) {
      onAnswerUpdate(currentQuestion.question, option);
    }
  };

  // Show skeleton loading during question generation
  if (isGeneratingQuestions) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800">
            Generating Questions...
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Creating personalized questions for your game concept... again, this
            may take a moment...
          </p>
        </div>
        <QuestionSkeleton />
      </div>
    );
  }

  // Show generate button if questions haven't been generated yet
  if (!questionsGenerated || questions.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Generate Requirements
          </h3>
          <p className="text-gray-600 mb-6">
            I'll ask you 5 questions to understand the specific requirements for
            your game.
          </p>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-700">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">
                  Failed to generate questions
                </span>
              </div>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}
          <button
            type="button"
            onClick={generateQuestions}
            disabled={
              !selectedConcept || !selectedGameIdea || isGeneratingQuestions
            }
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Generate Questions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4 mb-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          {currentQuestion.question}
        </h4>

        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleOptionSelect(option)}
              className={`
                w-full p-2 rounded-lg border-2 transition-all duration-200 text-left
                ${
                  currentAnswer === option
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                }
              `}
            >
              <div className="flex items-center">
                <div
                  className={`
                  w-4 h-4 rounded-full border-2 mr-4 flex-shrink-0
                  ${
                    currentAnswer === option
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }
                `}
                >
                  {currentAnswer === option && (
                    <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5"></div>
                  )}
                </div>
                <span className="text-gray-700 text-sm">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequirementsAgent;
