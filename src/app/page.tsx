"use client";
import Image from "next/image";

export default function Home() {
  // Button redirect to /create
  const handleStart = () => {
    window.location.href = "/create";
  };

  return (
    // Splash Screen
    <div className="max-w-6xl mx-auto p-16 h-screen text-center gap-4 bg-pink-50 justify-center flex flex-col">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        AI Minigame Creator
      </h1>

      {/* Description */}
      <p className="mb-8 text-lg text-gray-700">
        Work with a team of AI agents to build your own AI minigame!
      </p>

      <p className="text-lg text-gray-700 mb-8">
        Collaborate with specialized AI agents who will help you brainstorm,
        plan, and code your educational minigame step-by-step.
      </p>

      {/* Agent Avatars */}
      <div className="flex flex-col items-center gap-4 mb-8">
        {/* Top 3 Agents */}
        <div className="flex gap-4">
          <Image src="/robot1.png" alt="robot1" width={96} height={96} />
          <Image src="/robot2.png" alt="robot2" width={96} height={96} />
          <Image src="/robot3.png" alt="robot3" width={96} height={96} />
          <Image src="/robot4.png" alt="robot4" width={96} height={96} />
          <Image src="/robot5.png" alt="robot5" width={96} height={96} />
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition hover:cursor-pointer"
      >
        Start
      </button>
    </div>
  );
}
