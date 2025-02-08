import { config } from "./config/config";
import { startEventListeners } from "./onchain/listener";
import { generateNewLevel } from "./gameMaster/openaiService";
import { sendAddLevel } from "./onchain/txSender";
import { startApiServer } from "./api/server";

// Add fantasy themes for level generation
const FANTASY_THEMES = [
    "Dragon's Lair",
    "Enchanted Forest",
    "Ancient Crypt",
    "Floating Citadel",
    "Underdark Caverns",
    "Celestial Temple",
    "Abyssal Rift",
    "Mechanical Forge",
];

async function generateAndAddLevel() {
    try {
        const theme = FANTASY_THEMES[Math.floor(Math.random() * FANTASY_THEMES.length)];
        const { levelDescription, difficulty } = await generateNewLevel(theme, 1);

        console.log(`Generated new level: ${levelDescription} (Difficulty ${difficulty})`);
        await sendAddLevel(levelDescription, difficulty);
    } catch (error) {
        console.error("Failed to generate level:", error);
    }
}

async function startLevelGenerationScheduler() {
    // Run every hour at minute 0
    console.log("\n--- Starting scheduled level generation ---");
    await generateAndAddLevel();
}

console.log("Starting Fantasy Game Master Agent...");
console.log(`Using contract address: ${config.contractAddress}`);
console.log(`Database path: ${config.database.path}`);

try {
    startEventListeners();
    // startLevelGenerationScheduler();
    startApiServer();
    console.log("📡 Event listeners started successfully");
    console.log("⏰ Level generation scheduler initialized");
    console.log("🏰 Agent is ready to process blockchain events...");
} catch (error) {
    console.error("Failed to start agent:", error);
    process.exit(1);
}
