import { insertLevel } from "../database/queries";

/**
 * Handles new level creation events by:
 * 1. Inserting the level into the database
 * 2. Maintaining sync with on-chain state
 */
export async function handleLevelCreated(level: { levelId: number; nillionUUID: string; difficulty: number }) {
    try {
        // Insert the new level into the database
        insertLevel(level.levelId, level.nillionUUID, level.difficulty);
        console.log(`Inserted new level ${level.levelId} into database`);
    } catch (error) {
        console.error(`Error processing level ${level.levelId}:`, error);
    }
}
