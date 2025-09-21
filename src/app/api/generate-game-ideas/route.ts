import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Type definitions
interface GameIdea {
  id: number;
  title: string;
  description: string;
}

interface RequestBody {
  concept: string;
}

const IdeasFormat = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
});

const GameIdeasArrayFormat = z.object({
  ideas: z.array(IdeasFormat).length(3),
});

// System prompt for the Planner Agent
const PLANNER_SYSTEM_PROMPT = `You are the Planner Agent, a creative game designer specializing in educational AI/ML minigames. Your role is to generate SIMPLE game ideas that teach AI/ML concepts through interactive gameplay.

IMPORTANT INSTRUCTIONS:
1. Generate EXACTLY 3 unique game ideas based on the given AI/ML concept
2. Each game must be simple enough to implement in HTML/JavaScript and not require complex mechanics, external libraries or any neural networks
3. Games should be educational but also engaging
4. Focus on single-level gameplay experiences
5. The AI/ML concept should be core to the gameplay, not just themed
6. Provide a concise title and a brief 2 sentence description for each game idea`;

// Example function to generate user prompt
function generateUserPrompt(concept: string): string {
  return `Generate 3 educational and simple minigame ideas for teaching the concept of "${concept}".

Requirements:
- Each game should demonstrate ${concept} in an interactive way
- Games should be simple enough for beginners to understand
- Mechanics should directly relate to how ${concept} works
- Include visual or interactive elements that make the concept tangible
- Consider games that show the process, not just the result

Focus on making the games both educational and entertaining. The player should understand ${concept} better after playing.`;
}

// Main API route handler (App Router)
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body: RequestBody = await req.json();
    const { concept } = body;

    console.log(concept);

    if (!concept || typeof concept !== "string") {
      return NextResponse.json(
        { error: "Invalid request: concept is required" },
        { status: 400 }
      );
    }

    // Validate input
    if (!concept || typeof concept !== "string") {
      return NextResponse.json(
        { error: "Invalid request: concept is required" },
        { status: 400 }
      );
    }

    // Call OpenAI API
    const completion = await client.chat.completions.parse({
      model: "gpt-5-nano", // or 'gpt-4' for better quality
      messages: [
        {
          role: "system",
          content: PLANNER_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: generateUserPrompt(concept),
        },
      ],
      //   max_completion_tokens: 1600,
      response_format: zodResponseFormat(GameIdeasArrayFormat, "Ideas"),
    });

    // Parse the response
    const responseText = completion.choices[0].message.content;

    console.log("Raw OpenAI response:", responseText); // Debug

    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON string from OpenAI
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", responseText);
      throw new Error("Invalid JSON response from OpenAI");
    }

    console.log("Parsed response:", parsedResponse);

    // Return successful response
    return NextResponse.json(parsedResponse, { status: 200 });
  } catch (error) {
    console.error("Planner Agent Error:", error);

    // Handle specific error types
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: "OpenAI API error", details: error.message },
        { status: 502 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: "Failed to generate game ideas",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
