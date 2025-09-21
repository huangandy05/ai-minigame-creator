# AI Minigame Creator

An innovative web application that leverages multiple AI agents to collaboratively design and generate educational HTML minigames focused on AI/ML concepts. Transform any AI/ML concept into a fully playable, self-contained HTML game through a guided, multi-agent workflow.

## ✨ What It Does

The AI Minigame Creator guides users through a structured 5-step process where specialized AI agents work together to:

- **Select AI/ML Concepts**: Choose from curated educational topics like reinforcement learning, latent space, adversarial attacks, and more
- **Generate Game Ideas**: AI creates multiple game concepts based on your selected topic
- **Gather Requirements**: Interactive questionnaire to understand your preferences for gameplay mechanics, difficulty, and style
- **Create Specifications**: Generate a comprehensive Product Requirements Document (PRD) for your game
- **Build the Game**: Automatically generate a complete, playable HTML file that you can download and share

## 🎯 Key Features

- **No Coding Required**: Perfect for educators, students, and anyone interested in AI concepts
- **Self-Contained Games**: Generated HTML files work offline with no dependencies
- **Educational Focus**: Games are designed to teach AI/ML concepts through interactive play
- **Real-Time Generation**: Watch your game being created with live streaming text
- **Download & Share**: Get a complete HTML file ready to play in any web browser
- **Multi-Agent Collaboration**: Experience how different AI agents can work together on complex tasks

## 🤖 Multi-Agent Architecture

This application demonstrates the power of multi-agent AI systems through five specialized agents that collaborate to create your minigame:

### The Agent Workflow

1. **Ideas Agent** 🎯
   - **Role**: Concept curator and selector
   - **Function**: Presents AI/ML concepts and captures user selection
   - **Output**: Selected educational concept (e.g., "Human-in-the-loop AI")

2. **Planner Agent** 📋  
   - **Role**: Creative game designer
   - **Function**: Generates 3 unique game ideas based on the selected concept
   - **Output**: Multiple game concepts with titles and descriptions

3. **Requirements Agent** 📝
   - **Role**: Requirements gatherer and analyst
   - **Function**: Asks targeted questions about gameplay preferences, difficulty, and implementation details
   - **Output**: Structured requirements based on user responses

4. **Product Manager Agent** 📊
   - **Role**: Technical specification writer
   - **Function**: Creates a comprehensive PRD combining all previous inputs
   - **Output**: Detailed product requirements document for game implementation

5. **Coding Agent** 💻
   - **Role**: Game developer and implementer  
   - **Function**: Generates complete, self-contained HTML game from the PRD
   - **Output**: Playable HTML file with inline CSS and JavaScript

### Why Multi-Agent?

Each agent specializes in a specific domain, just like human teams. This approach:
- **Improves Quality**: Each agent focuses on their expertise area
- **Increases Reliability**: Structured workflow reduces errors
- **Enhances User Experience**: Clear, logical progression through the creation process
- **Demonstrates AI Collaboration**: Shows how AI systems can work together effectively

## 🚀 Quick Start

### Prerequisites

- Node.js (version 18 or higher)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-minigame-creator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to start creating minigames!

## 🏗️ Technical Architecture

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Vercel AI SDK with OpenAI
- **Streaming**: Server-Sent Events for real-time text generation
- **Deployment**: Optimized for Vercel deployment with Edge Runtime

### Key Technologies

- **OpenAI GPT Models**: Powers all AI agent responses (gpt-5-mini, gpt-5-nano)
- **Streaming APIs**: Real-time text generation for PRD and HTML game creation
- **Type Safety**: Full TypeScript implementation with strict typing
- **Component Architecture**: Modular React components for each agent
- **State Management**: Props-based data flow with centralized game state

## 📋 Detailed Agent Workflow

### Step 1: Concept Selection (Ideas Agent)
Users choose from pre-curated AI/ML concepts including:
- Human-in-the-loop AI
- Prompt Engineering  
- AI Agents
- And more educational topics

The agent explains each concept and captures the user's selection for the next stage.

### Step 2: Game Ideation (Planner Agent)
Based on the selected concept, the Planner Agent:
- Generates 3 unique game ideas using OpenAI's API
- Ensures games are simple enough for HTML implementation
- Focuses on educational value while maintaining engagement
- Presents options with clear titles and descriptions

### Step 3: Requirements Gathering (Requirements Agent)
An interactive questionnaire that:
- Asks 5 targeted multiple-choice questions
- Covers gameplay mechanics, visual style, and technical approach
- Ensures all preferences are implementable in vanilla HTML/CSS/JavaScript
- Stores responses for PRD generation

### Step 4: Specification Creation (Product Manager Agent)
The Product Manager Agent:
- Combines all previous inputs into a comprehensive PRD
- Streams the document creation in real-time
- Focuses on single HTML file implementation constraints
- Provides technical guidance for the final coding stage

### Step 5: Game Generation (Coding Agent)
The final agent:
- Takes the complete PRD as input
- Generates a fully functional HTML game
- Includes all CSS and JavaScript inline
- Creates downloadable, self-contained game files
- Provides live preview and code viewing options

## 📸 Screenshots

### Agent Interface Examples

*Screenshots will be added here showing each agent's interface and interaction flow*

### Generated Game Samples  

*Screenshots will be added here showcasing example games created by the system*

### User Workflow Demonstration

*Screenshots will be added here demonstrating the complete user journey from concept to game*

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

### Key Development Notes

- **API Routes**: Located in `/src/app/api/` with streaming support
- **Components**: Agent components in `/src/app/create/components/`
- **Types**: Shared TypeScript interfaces in `/src/app/create/types.ts`
- **Styling**: Tailwind CSS with custom component styling

## 📋 Requirements

### System Requirements
- Node.js 18+ 
- Modern web browser with JavaScript enabled
- Internet connection for AI API calls

### API Requirements
- Valid OpenAI API key with access to:
  - gpt-5-mini model
  - gpt-5-nano model  
  - gpt-4o-mini model

### Dependencies
The application uses several key packages:
- **@ai-sdk/openai**: OpenAI integration for the Vercel AI SDK
- **ai**: Vercel AI SDK for streaming responses
- **react-markdown**: Markdown rendering for PRD display
- **zod**: Runtime type validation for API responses

---

## 🎮 Ready to Create?

Start building educational AI minigames that teach complex concepts through interactive play. Each game is a unique combination of AI creativity and educational design, ready to share with students, colleagues, or anyone curious about AI and machine learning.

**[Get Started →](http://localhost:3000)**