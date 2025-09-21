import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Request body interface
interface RequestBody {
  selectedConcept: string;
  gameTitle: string;
  gameDescription: string;
  questionsAndAnswers: string; // Space-separated question-answer pairs
}

// System prompt for PRD generation
const PRD_SYSTEM_PROMPT = `You are the Product Manager Agent, an expert in creating technical product requirements documents (PRDs) for simple educational games.

IMPORTANT INSTRUCTIONS:
1. Generate a comprehensive but concise PRD for an educational AI/ML minigame
2. The game MUST be implementable as a single HTML file with inline CSS and JavaScript
3. Keep technical requirements VERY SIMPLE - no external libraries, frameworks, or dependencies
4. Focus on basic HTML elements, CSS styling, and vanilla JavaScript functionality
5. Emphasize educational value while maintaining simplicity
6. Include specific implementation guidance for HTML/CSS/JavaScript
7. Keep the scope small and achievable for a single-file implementation

Structure your PRD with these sections:
- Game Overview
- Educational Objectives  
- Core Mechanics
- Technical Requirements
- Implementation Details
- User Interface Design
- Success Criteria

Remember: This is for a SINGLE HTML FILE implementation using only vanilla web technologies.`;

// Function to generate user prompt
function generateUserPrompt(
  concept: string,
  gameTitle: string,
  gameDescription: string,
  questionsAndAnswers: string
): string {
  return `Create a detailed and **CONCISE** PRD for this educational AI/ML minigame:

**AI/ML Concept:** ${concept}
**Game Title:** ${gameTitle}
**Game Description:** ${gameDescription}

**Requirements from user feedback:**
${questionsAndAnswers}

Generate a short Product Requirements Document that will guide a developer to create this game as a single HTML file. Focus on simplicity, educational value, and technical feasibility using only HTML, CSS, and JavaScript.`;
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body: RequestBody = await req.json();
    const { selectedConcept, gameTitle, gameDescription, questionsAndAnswers } =
      body;

    console.log("PRD generation request:", {
      selectedConcept,
      gameTitle,
      gameDescription,
      questionsAndAnswers,
    });

    // Validate input
    if (!selectedConcept || typeof selectedConcept !== "string") {
      return new Response("Invalid request: selectedConcept is required", {
        status: 400,
      });
    }

    if (!gameTitle || typeof gameTitle !== "string") {
      return new Response("Invalid request: gameTitle is required", {
        status: 400,
      });
    }

    if (!gameDescription || typeof gameDescription !== "string") {
      return new Response("Invalid request: gameDescription is required", {
        status: 400,
      });
    }

    if (!questionsAndAnswers || typeof questionsAndAnswers !== "string") {
      return new Response("Invalid request: questionsAndAnswers is required", {
        status: 400,
      });
    }

    // Stream text using AI SDK
    const result = await streamText({
      model: openai("gpt-5-mini"),
      messages: [
        {
          role: "system",
          content: PRD_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: generateUserPrompt(
            selectedConcept,
            gameTitle,
            gameDescription,
            questionsAndAnswers
          ),
        },
      ],
      // maxTokens: 2000,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("PRD Generation Error:", error);

    // Generic error response
    return new Response(
      JSON.stringify({
        error: "Failed to generate PRD",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
