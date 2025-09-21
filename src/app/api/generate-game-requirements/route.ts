import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Type definitions
interface RequestBody {
  selectedConcept: string;
  gameTitle: string;
  gameDescription: string;
}

// Zod schemas
const QuestionFormat = z.object({
  id: z.number(),
  question: z.string(),
  options: z.array(z.string()).length(3),
});

const RequirementsFormat = z.object({
  questions: z.array(QuestionFormat).length(5),
});

// System prompt for the Requirements Agent
const REQUIREMENTS_SYSTEM_PROMPT = `You are the Requirements Agent, an expert in game design and technical implementation. Your role is to gather detailed requirements for educational AI/ML minigames that can be implemented as single HTML files.

IMPORTANT INSTRUCTIONS:
1. Generate EXACTLY 5 multiple choice questions about game mechanics and implementation details
2. Each question must have exactly 3 options
3. Focus on technical simplicity - games must be implementable in a single HTML file with inline CSS/JavaScript
4. Questions should cover: interaction mechanics, visual style and technical approach
5. All options should be realistic and implementable for HTML/CSS/JavaScript games
6. Ensure question options can be implemented simply using vanilla JavaScript, HTML and CSS
7. Questions should help determine concrete implementation details
`;

// Function to generate user prompt
function generateUserPrompt(
  concept: string,
  gameTitle: string,
  gameDescription: string
): string {
  return `Generate 5 detailed requirement questions for implementing this educational AI/ML game:

**Concept:** ${concept}
**Game Title:** ${gameTitle}
**Game Description:** ${gameDescription}

The questions should help determine how to technically implement the game in a single HTML file.

Each question should have 3 practical options that can be implemented in a single HTML file using standard web technologies (HTML, CSS, JavaScript). Focus on concrete, actionable choices that will guide the technical implementation.`;
}

// Main API route handler
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body: RequestBody = await req.json();
    const { selectedConcept, gameTitle, gameDescription } = body;

    console.log("Requirements request:", {
      selectedConcept,
      gameTitle,
      gameDescription,
    });

    // Validate input
    if (!selectedConcept || typeof selectedConcept !== "string") {
      return NextResponse.json(
        { error: "Invalid request: selectedConcept is required" },
        { status: 400 }
      );
    }

    if (!gameTitle || typeof gameTitle !== "string") {
      return NextResponse.json(
        { error: "Invalid request: gameTitle is required" },
        { status: 400 }
      );
    }

    if (!gameDescription || typeof gameDescription !== "string") {
      return NextResponse.json(
        { error: "Invalid request: gameDescription is required" },
        { status: 400 }
      );
    }

    // Call OpenAI API
    const completion = await client.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: REQUIREMENTS_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: generateUserPrompt(
            selectedConcept,
            gameTitle,
            gameDescription
          ),
        },
      ],
      response_format: zodResponseFormat(RequirementsFormat, "Requirements"),
    });

    // Parse the response
    const responseText = completion.choices[0].message.content;

    console.log("Raw OpenAI response:", responseText);

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
    console.error("Requirements Agent Error:", error);

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
        error: "Failed to generate game requirements",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
