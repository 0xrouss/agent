import { insertGame, getRandomLevelByDifficulty, insertAssignedLevel, incrementLevelsAssigned } from "../database/queries";
import { sendAssignLevel } from "../onchain/txSender";

/**
 * Handles new game creation events:
 * 1. Inserts the game into the database
 * 2. Assigns an initial level (difficulty 1)
 */
export async function handleGameCreated(game: { gameId: number; owner: string }) {
    try {
        // Insert base game record
        insertGame(game.gameId, game.owner);

        // Get first level (difficulty 1)
        const initialLevelId = await getRandomLevelByDifficulty(1);

        // Assign initial level
        await sendAssignLevel(game.gameId, initialLevelId);
        insertAssignedLevel(game.gameId, initialLevelId);
        incrementLevelsAssigned(game.gameId);

        console.log(`Game ${game.gameId} initialized with level ${initialLevelId}`);
    } catch (error) {
        console.error(`Error handling game creation for ${game.gameId}:`, error);
    }
}
