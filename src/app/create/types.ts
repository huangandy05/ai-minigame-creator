export interface GameIdea {
  id: number;
  title: string;
  description: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
}

export interface GameData {
  selectedConcept: string | null;
  selectedGameIdea: GameIdea | null;
  questions: Question[];
  questionAnswers: Record<string, string>;
  prd: string | null;
  generatedGame: string | null;
}

export interface AgentConfig {
  id: number;
  name: string;
  title: string;
  description: string;
}

export const AGENT_CONFIGS: AgentConfig[] = [
  {
    id: 1,
    name: "Ideas Agent",
    title: "Choose an AI/ML Concept",
    description:
      "Hello! I'm your Ideas Agent, and I'm excited to help you explore the fascinating world of AI. Think of agents like me as specialized digital assistants - each of us has our own unique role, instructions, memory and tools! We work together as a team to help you accomplish tasks. \n My job is to generate interesting AI-related topics for your game. \n I've prepared several ideas below that will help you dive deeper. Select one of the ideas below to be the theme of your AI minigame!",
  },
  {
    id: 2,
    name: "Planner Agent",
    title: "Select a Game Idea",
    description:
      "Hi, I'm the Ideas Agent. Based on your chosen concept, I will generate a few ideas for your game! Select one for your minigame.\n It is important for people like you to supervise, guide and correct AI like me. This is called 'human-in-the-loop' and ensures AI produces accurate and safe responses.",
  },
  {
    id: 3,
    name: "Requirements Agent",
    title: "Game Requirements",
    description:
      "Great choice! Now I need to understand more about how you want your game to work. Having more detailed requirements helps language models generate more desired outputs. This process is a core part of what we call 'prompt engineering'. \n Answer these questions to help me gather the requirements.",
  },
  {
    id: 4,
    name: "Product Manager Agent",
    title: "Game Specification",
    description:
      "Perfect! I will now summarise all the information and create a plan for the coding agent. Language models have a 'context window' which is basically the working memory of the AI. Exceeding this limit may lead to lost information in earlier parts of the conversation. Having clear, concise prompts prevents this and keep the model focused with the task at hand!",
  },
  {
    id: 5,
    name: "Coding Agent",
    title: "Game Creation",
    description:
      "Time to bring your game to life! I'm generating your custom HTML game based on all the choices you've made. This may take a moment...",
  },
];
