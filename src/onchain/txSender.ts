// src/blockchain/txSender.ts
import { updateInteractionOnchain, assignLevelOnchain, addLevelOnchain } from "./contract";

/**
 * Sends a transaction to update an interaction on-chain.
 * @param partidaId - The ID of the partida (game session)
 * @param interactionId - The unique interaction ID within the partida
 * @param levelPassed - Indicates if the player passed the level
 * @param result - Narrative result from the AI
 * @returns The transaction hash as a string
 */
export async function sendUpdateInteraction(partidaId: number, interactionId: number, levelPassed: boolean, result: string): Promise<string> {
    try {
        const txHash = await updateInteractionOnchain(partidaId, interactionId, levelPassed, result);
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
 * @param description - Description of the new level
 * @param difficulty - Difficulty rating of the level
 * @returns The transaction hash as a string
 */
export async function sendAddLevel(description: string, difficulty: number): Promise<string> {
    try {
        const txHash = await addLevelOnchain(description, difficulty);
        console.log(`Add level transaction submitted. Hash: ${txHash}`);
        return txHash;
    } catch (error) {
        console.error("Error sending addLevel transaction:", error);
        throw error;
    }
}
