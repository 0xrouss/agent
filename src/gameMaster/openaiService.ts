// src/gameMaster/openaiService.ts
import { OpenAI } from "openai";
import { config } from "../config/config"; // Your centralized configuration file

// Initialize the OpenAI client using your API key (make sure the key is stored securely)
const openai = new OpenAI({
    baseURL: config.openai.apiUrl,
    apiKey: config.openai.apiKey,
});

/**
 * Core OpenAI chat completion function with proper typing and error handling
 */
async function createChatCompletion(
    messages: Array<{ role: "system" | "user"; content: string }>,
    model: string = config.openai.model,
    maxTokens: number = config.openai.maxTokens,
    temperature: number = config.openai.temperature
): Promise<any> {
    try {
        const response = await openai.chat.completions.create({
            model,
            messages,
            max_tokens: maxTokens,
            temperature,
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content?.trim();
        if (!content) throw new Error("Empty response from OpenAI");

        return JSON.parse(content);
    } catch (error) {
        console.error("OpenAI API error:", error);
        throw error;
    }
}

/**
 * Evaluates a player's answer against level requirements
 * Returns structured result with pass/fail and reason
 */
export async function evaluateLevelAnswer(levelNumber: number, levelDescription: string, playerAnswer: string): Promise<{ passed: boolean; reason: string }> {
    const systemMessage = `You are a fantasy game master. Evaluate if the player's answer passes the level. Return ONLY valid JSON in this format:
    { "passed": <true or false>, "reason": "<brief explanation>" }`;

    const userMessage = `Level #${levelNumber}: "${levelDescription}"
    Player's answer: "${playerAnswer}"`;

    try {
        const result = await createChatCompletion([
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage },
        ]);

        // Validate response structure
        if (typeof result.passed !== "boolean" || typeof result.reason !== "string") {
            throw new Error("Invalid response format from OpenAI");
        }

        return {
            passed: result.passed,
            reason: result.reason,
        };
    } catch (error) {
        console.error("Level evaluation error:", error);
        return {
            passed: false,
            reason: "Evaluation failed. Player defaults to failure.",
        };
    }
}

/**
 * Generates a new game level using AI based on theme and difficulty
 * Returns structured level data { levelDescription: string, difficulty: number }
 */
export async function generateNewLevel(theme: string, baseDifficulty: number): Promise<{ levelDescription: string; levelDifficulty: number }> {
    const systemMessage = `You are a fantasy game designer. Create engaging levels with:
    - Vivid environmental details
    - Unique challenges (puzzles, enemies, traps)
    - Clear objectives
    - Thematic consistency

    Examples of good levels:
    1. {
      "levelDescription": "Volcanic Dragon's Chamber: Navigate floating obsidian platforms over a lava lake while dodging fireballs. Final challenge: Steal a golden egg from the sleeping dragon's hoard.",
      "difficulty": 8
    }
    2. {
      "levelDescription": "Fae Forest Maze: Solve riddles from talking trees to find the hidden moonstone. Beware of will-o'-wisps leading players astray.",
      "difficulty": 5
    }
    3. {
      "levelDescription": "Collapsing Clockwork Tower: Ascend while gears shift and platforms disappear. Disarm the giant automaton guardian to stop the mechanism.",
      "difficulty": 7
    }

    Return JSON format: { 
      "levelDescription": "<concise 1-2 sentence description>",
      "difficulty": <number 1-10 based on ${baseDifficulty}>
    }`;

    const userMessage = `Create a level with:
    - Theme: ${theme}
    - Base difficulty: ${baseDifficulty}
    Make the level description vivid but concise.`;

    try {
        const result = await createChatCompletion([
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage },
        ]);

        // Validate response structure
        if (typeof result.levelDescription !== "string" || typeof result.difficulty !== "number") {
            throw new Error("Invalid level generation response format");
        }

        // Clamp difficulty between 1-10
        const clampedDifficulty = Math.min(10, Math.max(1, result.difficulty));

        return {
            levelDescription: result.levelDescription,
            levelDifficulty: clampedDifficulty,
        };
    } catch (error) {
        console.error("Level generation error:", error);
        throw new Error("Failed to generate level: " + (error instanceof Error ? error.message : "Unknown error"));
    }
}
