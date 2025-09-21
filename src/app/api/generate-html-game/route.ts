import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const runtime = "edge";

// Request body interface
interface RequestBody {
  prd: string;
}

// System prompt for HTML game generation
const HTML_GAME_SYSTEM_PROMPT = `You are the Coding Agent, an expert in creating simple, educational HTML games. Your role is to generate complete, self-contained HTML games based on a Product Requirements Document.

CRITICAL INSTRUCTIONS:
1. Output ONLY raw HTML code - no explanations, no markdown, no code blocks, no additional text
2. Generate a complete HTML document with <!DOCTYPE html>, <html>, <head>, and <body> tags
3. All CSS must be inline in a <style> tag within the <head>
4. All JavaScript must be inline in a <script> tag within the <body>
5. Use ONLY vanilla HTML, CSS, and JavaScript - no external libraries or frameworks
6. The game must be fully functional and playable immediately when the HTML file is opened
7. Keep the implementation simple but engaging and educational
8. Include clear instructions within the game interface
9. There should not be more than one level or complex mechanics - focus on simplicity

IMPLEMENTATION REQUIREMENTS:
- Use basic HTML elements (divs, buttons, canvas if needed)
- Implement game logic with vanilla JavaScript
- Style with CSS for an attractive, educational interface
- Include game controls, scoring, and feedback mechanisms
- Ensure the educational objective is clear and achieved through play

Remember: Output ONLY the HTML code. Start with <!DOCTYPE html> and end with </html>. No other text.`;

// Function to generate user prompt
function generateUserPrompt(prd: string): string {
  return `Generate a complete but simple self-contained HTML game based on this PRD:

${prd}

Create a fully functional HTML file specified in the PRD. The game should be educational, engaging, and demonstrate the AI/ML concept effectively.

Output ONLY the HTML code - no explanations or additional text.`;
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body: RequestBody = await req.json();
    const { prd } = body;

    console.log("HTML game generation request received");

    // Validate input
    if (!prd || typeof prd !== "string") {
      return new Response("Invalid request: prd is required", {
        status: 400,
      });
    }

    if (prd.trim().length < 50) {
      return new Response("Invalid request: prd is too short", {
        status: 400,
      });
    }

    // Stream text using AI SDK
    const result = await streamText({
      model: openai("gpt-5-mini"),
      messages: [
        {
          role: "system",
          content: HTML_GAME_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: generateUserPrompt(prd),
        },
      ],
      //   maxTokens: 4000, // Increased for complete HTML games
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("HTML Game Generation Error:", error);

    // Generic error response
    return new Response(
      JSON.stringify({
        error: "Failed to generate HTML game",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
