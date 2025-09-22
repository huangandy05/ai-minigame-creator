"use client";
import { useState } from "react";
import React from "react";

import StepProgressBar from "./components/StepProgressBar";
import AgentStep from "./components/AgentStep";
import IdeasAgent from "./components/IdeasAgent";
import PlannerAgent from "./components/PlannerAgent";
import RequirementsAgent from "./components/RequirementsAgent";
import ProductManagerAgent from "./components/ProductManagerAgent";
import CodingAgent from "./components/CodingAgent";
import { AGENT_CONFIGS, GameData, GameIdea, Question } from "./types";
import Sidebar from "../components/Sidebar";

function CreatePageContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [requirementsQuestionIndex, setRequirementsQuestionIndex] = useState(0);
  const [isPRDComplete, setIsPRDComplete] = useState(false);

  // Game data state
  const [gameData, setGameData] = useState<GameData>({
    selectedConcept: null,
    selectedGameIdea: null,
    questions: [],
    questionAnswers: {},
    prd: null,
    generatedGame: null,
  });

  const handleContinue = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      // Reset requirements question index when entering step 3
      if (currentStep === 2) {
        setRequirementsQuestionIndex(0);
      }
      // Reset PRD complete state when entering step 4
      if (currentStep === 3) {
        setIsPRDComplete(false);
      }
    }
  };

  const handleRequirementsNext = () => {
    if (requirementsQuestionIndex < 4) {
      setRequirementsQuestionIndex((prev) => prev + 1);
    } else {
      // All questions answered, proceed to next step
      handleContinue();
    }
  };

  // Handler functions for updating game data
  const handleConceptSelect = (concept: string) => {
    setGameData((prev) => ({ ...prev, selectedConcept: concept }));
  };

  const handleGameIdeaSelect = (gameIdea: GameIdea) => {
    setGameData((prev) => ({ ...prev, selectedGameIdea: gameIdea }));
  };

  const handleAnswerUpdate = (questionId: string, answer: string) => {
    setGameData((prev) => ({
      ...prev,
      questionAnswers: { ...prev.questionAnswers, [questionId]: answer },
    }));
  };

  const handleQuestionsGenerated = (questions: Question[]) => {
    setGameData((prev) => ({ ...prev, questions }));
  };

  const handlePRDComplete = (prd: string) => {
    setGameData((prev) => ({ ...prev, prd }));
    setIsPRDComplete(true);
  };

  const handleGameComplete = (generatedGame: string) => {
    setGameData((prev) => ({ ...prev, generatedGame }));
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return !!gameData.selectedConcept;
      case 2:
        return !!gameData.selectedGameIdea;
      case 3:
        // For requirements, check if the current question has been answered
        if (gameData.questions.length === 0) return false; // No questions generated yet
        const currentQuestion = gameData.questions[requirementsQuestionIndex];
        return currentQuestion
          ? !!gameData.questionAnswers[currentQuestion.question]
          : false;
      case 4:
        return isPRDComplete;
      case 5:
        return !!gameData.generatedGame;
      default:
        return false;
    }
  };

  const getButtonText = () => {
    if (currentStep === 3) {
      return requirementsQuestionIndex < 4 ? "Next Question" : "Continue";
    }
    return "Continue";
  };

  const getStepHandler = () => {
    if (currentStep === 3) {
      return handleRequirementsNext;
    }
    return handleContinue;
  };

  const currentAgent = AGENT_CONFIGS[currentStep - 1];

  return (
    <div className="bg-blue-100 min-h-screen h-full">
      <Sidebar />
      <div className="ml-64 p-8 flex flex-col min-h-screen h-full max-w-7xl">
        {/* <div className="max-w-6xl w-full flex flex-col h-screen justify-between"> */}
        <div className="flex-1">
          <AgentStep
            stepNumber={currentStep}
            title={currentAgent.title}
            description={currentAgent.description}
            onContinue={getStepHandler()}
            canContinue={canContinue()}
            buttonText={getButtonText()}
          >
            {currentStep === 1 && (
              <IdeasAgent
                selectedConcept={gameData.selectedConcept}
                onConceptSelect={handleConceptSelect}
              />
            )}
            {currentStep === 2 && (
              <PlannerAgent
                selectedConcept={gameData.selectedConcept}
                selectedGameIdea={gameData.selectedGameIdea}
                onGameIdeaSelect={handleGameIdeaSelect}
              />
            )}
            {currentStep === 3 && (
              <RequirementsAgent
                selectedConcept={gameData.selectedConcept}
                selectedGameIdea={gameData.selectedGameIdea}
                questionAnswers={gameData.questionAnswers}
                onAnswerUpdate={handleAnswerUpdate}
                onQuestionsGenerated={handleQuestionsGenerated}
                onNext={handleRequirementsNext}
                canProceed={canContinue()}
                currentQuestionIndex={requirementsQuestionIndex}
              />
            )}
            {currentStep === 4 && (
              <ProductManagerAgent
                gameData={gameData}
                onComplete={handlePRDComplete}
              />
            )}
            {currentStep === 5 && (
              <CodingAgent
                gameData={gameData}
                onComplete={handleGameComplete}
              />
            )}
          </AgentStep>
        </div>
        <div className="bg-blue-100">
          <StepProgressBar currentStep={currentStep} />
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}

export default function CreatePage() {
  return <CreatePageContent />;
}
