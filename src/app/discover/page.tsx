import React from "react";
import Sidebar from "../components/Sidebar";
import GameCard from "./components/GameCard";

export default function DiscoverPage() {
  const dummyGames = [
    {
      imageUrl: "/robot1.png",
      title: "Neural Network Playground",
      tags: ["Machine Learning", "Neural Networks", "Interactive"],
      profileName: "AI_Enthusiast42",
      rating: 4.8,
    },
    {
      title: "Reinforcement Learning Maze",
      tags: ["RL", "Pathfinding", "Q-Learning"],
      profileName: "CodeWizard",
      rating: 4.2,
    },
    {
      imageUrl: "/robot2.png",
      title: "Bias Detection Challenge",
      tags: ["Ethics", "Bias", "Classification"],
      profileName: "FairAI_Dev",
      rating: 4.6,
    },
    {
      title: "Latent Space Explorer",
      tags: ["Deep Learning", "Visualization", "VAE"],
      profileName: "DataScientist99",
      rating: 4.4,
    },
  ];

  return (
    <div className="bg-blue-100 min-h-screen h-full">
      <Sidebar />
      <div className="ml-64 p-8 flex flex-col min-h-screen h-full max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Discover AI Minigames
        </h1>

        <p className="text-gray-600 mb-6">
          Explore a variety of AI-generated minigames created by the community.
          Play, rate, and get inspired to create your own!
        </p>
        <p className="text-gray-600 mb-6">
          This feature has not been implemented but users should be able to save
          their created minigames and play others' creations. You get the idea..
        </p>

        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search is not implemented..."
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dummyGames.map((game, index) => (
            <GameCard
              key={index}
              imageUrl={game.imageUrl}
              title={game.title}
              tags={game.tags}
              profileName={game.profileName}
              rating={game.rating}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
