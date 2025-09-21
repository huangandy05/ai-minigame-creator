"use client";
import React, { useState, useEffect, useRef } from "react";
import { GameIdea } from "../types";

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-lg border-2 border-gray-200 p-6 animate-pulse">
    <div className="h-6 bg-gray-300 rounded mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </div>
  </div>
);

interface PlannerAgentProps {
  selectedConcept: string | null;
  selectedGameIdea: GameIdea | null;
  onGameIdeaSelect: (gameIdea: GameIdea) => void;
}

const PlannerAgent: React.FC<PlannerAgentProps> = ({
  selectedConcept,
  selectedGameIdea,
  onGameIdeaSelect,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [gameIdeas, setGameIdeas] = useState<GameIdea[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [apiCallStarted, setApiCallStarted] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchGameIdeas = async () => {
      // Prevent multiple calls using state instead of ref
      if (apiCallStarted) return;
      setApiCallStarted(true);

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/generate-game-ideas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            concept: selectedConcept,
          }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch game ideas: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);
        console.log("data.ideas:", data.ideas);
        console.log("data.ideas is array:", Array.isArray(data.ideas));

        // Check if request was aborted before setting state
        if (abortController.signal.aborted) {
          console.log("Request was aborted before setting game ideas");
          return;
        }

        // Handle both possible response formats
        if (data.ideas && Array.isArray(data.ideas)) {
          console.log("Setting game ideas from data.ideas:", data.ideas);
          setGameIdeas(data.ideas);
          console.log("setGameIdeas called with:", data.ideas);
        } else if (Array.isArray(data)) {
          console.log("Setting game ideas from data array:", data);
          setGameIdeas(data);
          console.log("setGameIdeas called with:", data);
        } else {
          console.log("Using fallback, setting empty array");
          setGameIdeas([]);
          console.log("setGameIdeas called with empty array");
        }
      } catch (err) {
        if (abortController.signal.aborted) {
          console.log("Fetch was aborted");
          return;
        }
        console.error("Error fetching game ideas:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setApiCallStarted(false); // Reset on error to allow retry
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchGameIdeas();

    // Cleanup function to abort the request if component unmounts
    return () => {
      abortController.abort();
    };
  }, []); // Empty dependency array to run only once

  // Debug effect to track gameIdeas state changes
  useEffect(() => {
    console.log("gameIdeas state updated:", gameIdeas);
  }, [gameIdeas]);

  const handleGameIdeaSelect = (gameIdea: GameIdea) => {
    onGameIdeaSelect(gameIdea);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-2">
        <h3 className="text-2xl font-bold text-gray-800">Game Ideas</h3>
        {isLoading && (
          <p className="text-sm text-gray-600">
            Generating ideas based on your selected concept...
          </p>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Failed to load game ideas</span>
          </div>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <button
            type="button"
            onClick={() => {
              setApiCallStarted(false);
              setError(null);
              // Re-trigger the effect by changing a dependency
              window.location.reload();
            }}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Cards Grid */}
      {!error && (
        <div className="grid grid-cols-3 gap-4">
          {isLoading ? (
            // Show skeleton cards while loading
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : // Show actual game idea cards
          gameIdeas && gameIdeas.length > 0 ? (
            gameIdeas.map((gameIdea) => (
              <button
                key={gameIdea.id}
                type="button"
                onClick={() => handleGameIdeaSelect(gameIdea)}
                className={`
                  bg-white rounded-lg border-2 transition-all duration-200 text-left p-3 hover:shadow-lg
                  ${
                    selectedGameIdea?.id === gameIdea.id
                      ? "border-blue-500 bg-blue-50 shadow-lg transform scale-102"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                  }
                `}
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {gameIdea.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {gameIdea.description}
                </p>
              </button>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No game ideas available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlannerAgent;
