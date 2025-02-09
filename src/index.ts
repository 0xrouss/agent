import { config } from "./config/config";
import { startEventListeners } from "./onchain/listener";
import { generateNewLevel } from "./gameMaster/openaiService";
import { sendAddLevel } from "./onchain/txSender";
import { startApiServer } from "./api/server";
import { writeToNodes } from "./nillion";

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

async function generateAndAddLevel(baseDifficulty: number = 1) {
    try {
        const theme = FANTASY_THEMES[Math.floor(Math.random() * FANTASY_THEMES.length)];
        const { levelDescription, levelDifficulty } = await generateNewLevel(theme, baseDifficulty);

        console.log(`Generated new level: ${levelDescription} (Difficulty ${levelDifficulty})`);

        const data = [
            {
                description: { $allot: levelDescription },
                difficulty: { $allot: levelDifficulty },
            },
        ];

        const nillionUUID = await writeToNodes(data);

        await sendAddLevel(nillionUUID, levelDifficulty);
    } catch (error) {
        console.error("Failed to generate level:", error);
    }
}

async function startLevelGenerationScheduler() {
    // Generate initial difficulty 1-10 levels
    console.log("\n--- Generating initial 10 levels ---");
    for (let difficulty = 1; difficulty <= 10; difficulty++) {
        await generateAndAddLevel(difficulty);
    }

    // Run every hour with random difficulty
    console.log("\n--- Starting scheduled level generation ---");
    setInterval(async () => {
        const randomDifficulty = Math.floor(Math.random() * 10) + 1;
        await generateAndAddLevel(randomDifficulty);
    }, 60 * 60 * 1000); // Every hour
}

console.log("Starting Fantasy Game Master Agent...");
console.log(`Using contract address: ${config.contractAddress}`);
console.log(`Database path: ${config.database.path}`);

try {
    startEventListeners();
    startApiServer();
    // startLevelGenerationScheduler();
    console.log("📡 Event listeners started successfully");
    console.log("⏰ Level generation scheduler initialized");
    console.log("🏰 Agent is ready to process blockchain events...");
} catch (error) {
    console.error("Failed to start agent:", error);
    process.exit(1);
}
