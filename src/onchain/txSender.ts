// src/blockchain/txSender.ts
import { updateInteractionOnchain, assignLevelOnchain, addLevelOnchain } from "./contract";

/**
 * Sends a transaction to update an interaction on-chain.
 * @param gameId - The ID of the game
 * @param interactionId - The unique interaction ID within the game
 * @param levelPassed - Indicates if the player passed the level
 * @param result - Narrative result from the AI
 * @returns The transaction hash as a string
 */
export async function sendUpdateInteraction(gameId: number, interactionId: number, levelPassed: boolean, result: string): Promise<string> {
    try {
        const txHash = await updateInteractionOnchain(gameId, interactionId, levelPassed, result);
        console.log(`Transaction submitted. Hash: ${txHash}`);
        return txHash;
    } catch (error) {
        console.error("Error sending updateInteraction transaction:", error);
        throw error;
    }
}

/**
 * Assigns a level to a specific game session
 * @param gameId - The ID of the game
 * @param levelId - The ID of the level to assign
 * @returns The transaction hash as a string
 */
export async function sendAssignLevel(gameId: number, levelId: number): Promise<string> {
    try {
        const txHash = await assignLevelOnchain(gameId, levelId);
        console.log(`Level assignment transaction submitted. Hash: ${txHash}`);
        return txHash;
    } catch (error) {
        console.error("Error sending assignLevel transaction:", error);
        throw error;
    }
}

/**
 * Adds a new level to the game system
 * @param nillionUUID - nillionUUID of the new level
 * @param difficulty - Difficulty rating of the level
 * @returns The transaction hash as a string
 */
export async function sendAddLevel(nillionUUID: string, difficulty: number): Promise<string> {
    try {
        const txHash = await addLevelOnchain(nillionUUID, difficulty);
        console.log(`Add level transaction submitted. Hash: ${txHash}`);
        return txHash;
    } catch (error) {
        console.error("Error sending addLevel transaction:", error);
        throw error;
    }
}
