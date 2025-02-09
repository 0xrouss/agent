// src/gameMaster/interactionProcessor.ts
import { evaluateLevelAnswer } from "./openaiService";
import { sendUpdateInteraction, sendAssignLevel } from "../onchain/txSender";
import { getLevelDescription, getRandomLevelByDifficulty } from "../nillion";
import { getLastAssignedLevelNillionUUID } from "../onchain/contract"; // Import the new function

/**
 * Processes an interaction event:
 *  - Builds a prompt from the interaction data.
 *  - Calls the OpenAI API to get the outcome.
 *  - Parses the AI response.
 *  - Submits a transaction to update the interaction on-chain.
 *
 * @param interaction The interaction event data.
 */
export async function handleInteraction(interaction: {
    gameId: number;
    interactionId: number;
    player: string;
    assignedLevelIndex: number;
    action: string;
}): Promise<void> {
    try {
        console.log(`Processing interaction ${interaction.interactionId} for player ${interaction.player}...`);

        // Fetch the level description using the new function
        const nillionUUID = await getLastAssignedLevelNillionUUID(interaction.gameId);
        const levelDescription = await getLevelDescription(nillionUUID);

        // Evaluate the player's answer using OpenAI
        const evaluationResult = await evaluateLevelAnswer(interaction.assignedLevelIndex, levelDescription, interaction.action);

        // Log the evaluation result
        console.log(`Evaluation result for interaction ${interaction.interactionId}:`, evaluationResult);

        // Update the game state based on the evaluation
        if (evaluationResult.passed) {
            console.log(`Player ${interaction.player} passed the level!`);

            // Update interaction
            await sendUpdateInteraction(interaction.gameId, interaction.interactionId, true, evaluationResult.reason);

            // Check for game completion (level 10 passed)
            if (interaction.assignedLevelIndex !== 9) {
                // Calculate next difficulty and assign level
                const nextDifficulty = interaction.assignedLevelIndex + 2;
                const nextLevelId = await getRandomLevelByDifficulty(nextDifficulty);

                // Update chain
                await sendAssignLevel(interaction.gameId, nextLevelId);

                console.log(`Assigned level ${nextLevelId} (difficulty ${nextDifficulty}) to game ${interaction.gameId}`);
            }
        } else {
            // Logic for when the player fails the level
            console.log(`Player ${interaction.player} failed the level: ${evaluationResult.reason}`);
            // Handle failure (e.g., notify player, update state)
            // Send the update to the blockchain
            await sendUpdateInteraction(interaction.gameId, interaction.interactionId, false, evaluationResult.reason);
        }

        console.log(`Finished processing interaction ${interaction.interactionId}.`);
    } catch (error) {
        console.error(`Error processing interaction ${interaction.interactionId}:`, error);
    }
}
