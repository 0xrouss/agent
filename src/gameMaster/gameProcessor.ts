import { getRandomLevelByDifficulty } from "../nillion";
import { sendAssignLevel } from "../onchain/txSender";

/**
 * Handles new game creation events:
 * Assigns an initial level (difficulty 1)
 */
export async function handleGameCreated(game: { gameId: number; owner: string }) {
    try {
        // Get first level (difficulty 1)
        const initialLevelId = await getRandomLevelByDifficulty(1);

        // Assign initial level
        await sendAssignLevel(game.gameId, initialLevelId);

        console.log(`Game ${game.gameId} initialized with level ${initialLevelId}`);
    } catch (error) {
        console.error(`Error handling game creation for ${game.gameId}:`, error);
    }
}
