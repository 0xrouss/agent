// src/gameMaster/interactionProcessor.ts
import { evaluateLevelAnswer } from "./openaiService";
import { sendUpdateInteraction, sendAssignLevel } from "../onchain/txSender";
import { getDescription, getRandomLevelByDifficulty } from "../nillion";
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
  interactionNillionUUID: string;
}): Promise<void> {
  try {
    console.log(
      `Processing interaction ${interaction.interactionId} for player ${interaction.player}...`
    );

    const interactionDescription = await getDescription(
      interaction.interactionNillionUUID
    );

    const levelNillionUUID = await getLastAssignedLevelNillionUUID(
      interaction.gameId
    );

    const levelDescription = await getDescription(levelNillionUUID);

    // Evaluate the player's answer using OpenAI
    const evaluationResult = await evaluateLevelAnswer(
      interaction.assignedLevelIndex,
      levelDescription,
      interactionDescription
    );

    // Update the interaction on-chain
    await sendUpdateInteraction(
      interaction.gameId,
      interaction.interactionId,
      evaluationResult.passed,
      evaluationResult.reason
    );

    // If the player passed the level, assign a new level with increased difficulty
    if (evaluationResult.passed) {
      try {
        // Calculate next level difficulty (current level index + 2 since index is 0-based)
        const nextDifficulty = interaction.assignedLevelIndex + 2;

        // Get a random level of the next difficulty
        const nextLevelId = await getRandomLevelByDifficulty(nextDifficulty);

        // Assign the new level to the game
        await sendAssignLevel(interaction.gameId, nextLevelId);

        console.log(
          `Assigned new level with difficulty ${nextDifficulty} to game ${interaction.gameId}`
        );
      } catch (error) {
        console.error(
          `Error assigning new level for game ${interaction.gameId}:`,
          error
        );
      }
    }

    console.log(
      `Interaction ${interaction.interactionId} processed successfully`
    );
  } catch (error) {
    console.error(
      `Error processing interaction ${interaction.interactionId}:`,
      error
    );
  }
}
