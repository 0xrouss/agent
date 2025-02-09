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
    const systemMessage = `You are a fantasy game master. Evaluate if the player's answer passes the level. 
    
    Evaluation Criteria:
    1. Relevance -  The player's answer must directly address the level challenges and objectives.
    2. Creativity and Strategy - Assess if the response demonstrates problem-solving, logic, or an innovative approach.
    3. Feasibility - The answer should be plausible within the fantasy world and adhere to established mechanics (e.g., magic, physics).
    4. Completeness - Ensure the player's response fully resolves the level challenge rather than being vague or incomplete.
    5. Difficulty Scaling - Higher-level challenges require more strategic depth. The player's solution should match the expected complexity:
        - Levels 1-3: Basic solutions (e.g., simple combat, straightforward puzzles, direct actions).
        - Levels 4-6: Moderate solutions (e.g., combining abilities, using the environment, multi-step tactics).
        - Levels 7-10: Advanced solutions (e.g., out-of-the-box thinking, deep strategy, teamwork, high-risk maneuvers).
    
    Instructions:
    - Analyze the level description and player's answer.
    - Compare the response against the expected difficulty level.
    - Decide if the player passes (true) or fails (false).
    - Provide a concise reason explaining why.
    
    Return ONLY valid JSON in this format:
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
    - Vivid environmental details - Immerse players in the setting with rich descriptions
    - Unique challenges - Introduce puzzles, enemies, or traps that require problem-solving
    - Clear objectives - Define what must be accomplished to progress
    - Thematic consistency - Ensure the level fits within a cohesive fantasy world

    Narration Style:
    - Write as if you are the Game Master describing the world directly to the players.
    - Use second-person perspective ("You step into...").
    - Maintain an engaging and immersive tone.

    Examples of good levels:
    1. {
      "levelDescription": "As you step into the Whispering Woods, the towering trees close in around you, their twisted branches whispering secrets on the wind. A faint glow beckons from a hidden grove, where an ancient rune stone hums with untapped magic. But beware—mischievous forest sprites flicker through the shadows, weaving illusions to lead you astray. To pass, you must decipher the riddle etched into the bark of an ancient oak and activate the runes power.",
      "difficulty": 1
    }
    2. {
      "levelDescription": "The stench of damp earth and burning torches fills your nostrils as you crawl into the Goblin Warrens, a labyrinth of tunnels echoing with guttural laughter. Ahead, three pathways branch off, each riddled with crude goblin traps—some designed to collapse the ceiling, others filled with swarms of venomous rats. In the heart of this twisted lair, a towering goblin chieftain awaits, gripping the stolen artifact that bars your passage. Will you challenge him in combat or outwit him with trickery?",
      "difficulty": 2
    }
    3. {
      "levelDescription": "Your boots sink into the waterlogged ruins of an ancient temple, half-submerged in the stagnant swamp. The air is thick with the croaks of unseen creatures and the ripples of something massive stirring beneath the surface. Ahead, a wall of stone totems stands tall, their runes glowing faintly. Aligning them in the correct sequence will shift the water levels and reveal the passage forward—but be warned, each mistake stirs the slumbering sea serpent coiled in the depths.",
      "difficulty": 3
    }
    4. {
      "levelDescription": "The cold grip of darkness wraps around you as you enter the cursed halls of Shadowfang Keep. Flickering torches cast elongated shadows, and ghostly whispers echo through shifting corridors, their words both warning and deception. Spirits of long-dead knights roam these halls, cursed to guard the keep until its shattered soul mirror is restored. Finding its pieces will demand both courage and cunning—fail, and the wraiths will claim your essence as their own.",
      "difficulty": 4
    }

    Return JSON format: { 
      "levelDescription": "<concise 5-6 sentence description in second-person narration>",
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
