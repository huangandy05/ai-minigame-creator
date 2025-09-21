"use client";
import React, { useState } from "react";
import Image from "next/image";

interface StepProgressBarProps {
  currentStep: number;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Ideas Agent", imagePath: "/robot1.png" },
    { id: 2, label: "Planner Agent", imagePath: "/robot2.png" },
    { id: 3, label: "Requirements Agent", imagePath: "/robot3.png" },
    { id: 4, label: "Product Manager Agent", imagePath: "/robot4.png" },
    { id: 5, label: "Coding Agent", imagePath: "/robot5.png" },
  ];

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "current";
    return "future";
  };

  const getStepColors = (status: string) => {
    switch (status) {
      case "completed":
        return {
          circle: "bg-green-500 border-green-500",
          icon: "text-white",
          text: "text-green-600 font-semibold",
        };
      case "current":
        return {
          circle: "bg-blue-500 border-blue-500",
          icon: "text-white",
          text: "text-blue-600 font-semibold",
        };
      case "future":
        return {
          circle: "bg-gray-200 border-gray-300",
          icon: "text-gray-400",
          text: "text-gray-400",
        };
      default:
        return {
          circle: "bg-gray-200 border-gray-300",
          icon: "text-gray-400",
          text: "text-gray-400",
        };
    }
  };

  const getLineColor = (stepIndex: number) => {
    // Line after completed steps should be green
    if (stepIndex + 1 < currentStep) return "bg-green-500";
    // Line after current step should be gray
    return "bg-gray-300";
  };

  return (
    <div className="flex w-full pb-2 mb-10">
      {steps.map((step, index) => {
        const status = getStepStatus(step.id);
        const colors = getStepColors(status);

        return (
          <React.Fragment key={step.id}>
            {/* Step Container */}
            <div className="flex flex-col items-center">
              {/* Circle with Icon */}
              <div
                className={`
                  flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all duration-300
                  ${colors.circle}
                `}
              >
                <Image
                  src={step.imagePath}
                  alt={step.label}
                  width={64}
                  height={64}
                  className={`${colors.icon} "object-cover`}
                />
              </div>

              {/* Label */}
              <div
                className={`mt-3  max-w-16 text-sm font-medium transition-all relative overflow-visible duration-300 ${colors.text}`}
              >
                <span className="absolute left-1/2 -translate-x-1/2 flext flex-col text-center">
                  {step.label}
                </span>
              </div>
            </div>
            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="h-16 flex-1 flex items-center">
                <div
                  className={`w-full  h-1 transition-all duration-300 ${getLineColor(
                    index
                  )}
                  `}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepProgressBar;
