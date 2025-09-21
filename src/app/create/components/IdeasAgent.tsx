"use client";
import React from "react";

const AI_ML_CONCEPTS = [
  "AI is probabilistic",
  "Latent Space",
  "Adversarial Attacks",
  "Overfitting",
  "Context Window",
  "Bias in Models",
];

interface IdeasAgentProps {
  selectedConcept: string | null;
  onConceptSelect: (concept: string) => void;
}

const IdeasAgent: React.FC<IdeasAgentProps> = ({
  selectedConcept,
  onConceptSelect,
}) => {
  const handleConceptSelect = (concept: string) => {
    onConceptSelect(concept);
  };

  return (
    <div className="grid grid-cols-3 gap-4 w-full mx-auto">
      {AI_ML_CONCEPTS.map((concept) => (
        <button
          key={concept}
          type="button"
          onClick={() => handleConceptSelect(concept)}
          className={`
            p-2 rounded-lg border-2 transition-all duration-200 text-center hover:cursor-pointer
            ${
              selectedConcept === concept
                ? "border-blue-500 bg-blue-50 shadow-lg transform scale-105"
                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:bg-blue-25"
            }
          `}
        >
          <h3 className="text-sm font-semibold text-gray-800">{concept}</h3>
        </button>
      ))}
    </div>
  );
};

export default IdeasAgent;
