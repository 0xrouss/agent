import db from "./db";

/**
 * Insert a level.
 */
export function insertLevel(id: number, nillionUUID: string, difficulty: number) {
    db.run(
        `
        INSERT INTO levels (id, nillionUUID, difficulty)
            VALUES (?, ?, ?);
        `,
        [id, nillionUUID, difficulty]
    );
}

/**
 * Insert a game record.
 */
export function insertGame(id: number, owner: string, isActive: boolean = true, levelsAssigned: number = 0) {
    db.run(
        `
        INSERT INTO games (id, owner, is_active, levels_assigned)
            VALUES (?, ?, ?, ?);
        `,
        [id, owner, isActive ? 1 : 0, levelsAssigned]
    );
}

/**
 * Insert a new assigned level for a game.
 */
export function insertAssignedLevel(gameId: number, levelId: number, completed: boolean = false) {
    db.run(
        `
        INSERT INTO assigned_levels (game_id, level_id, completed)
            VALUES (?, ?, ?);
    `,
        [gameId, levelId, completed ? 1 : 0]
    );
}

/**
 * Insert a new interaction.
 */
export function insertInteraction(
    gameId: number,
    interactionId: number,
    assignedLevelIndex: number,
    action: string,
    result: string = "",
    isComplete: boolean = false
) {
    db.run(
        `
        INSERT INTO interactions (
            game_id, interaction_id, 
            assigned_level_index, action, result, is_complete
        )
            VALUES (?, ?, ?, ?, ?, ?);
        `,
        [gameId, interactionId, assignedLevelIndex, action, result, isComplete ? 1 : 0]
    );
}

/**
 * Update an existing interaction record with the result from the AI.
 */
export function updateInteraction(gameId: number, interactionId: number, result: string, isComplete: boolean) {
    db.run(
        `
        UPDATE interactions
            SET result = ?, is_complete = ?
            WHERE game_id = ? AND interaction_id = ?;
        `,
        [result, isComplete ? 1 : 0, gameId, interactionId]
    );
}

/**
 * Mark an assigned level as completed.
 */
export function markAssignedLevelCompleted(gameId: number) {
    db.run(
        `
        UPDATE assigned_levels
            SET completed = 1
            WHERE id = (
                SELECT id FROM assigned_levels
                    WHERE game_id = ?
                    ORDER BY id DESC
                    LIMIT 1
            );
        `,
        [gameId]
    );
}

/**
 * Increment the levels assigned for a game.
 */
export function incrementLevelsAssigned(gameId: number) {
    db.run(
        `
        UPDATE games
            SET levels_assigned = levels_assigned + 1
            WHERE id = ?;
        `,
        [gameId]
    );
}

/**
 * Finalize a game by setting its 'is_active' status to false.
 */
export function finalizeGame(gameId: number) {
    db.run(
        `
        UPDATE games
            SET is_active = 0
            WHERE id = ?;
        `,
        [gameId]
    );
}

/**
 * Fetches the level nillionUUID from the database.
 * @param gameId - The ID of the game.
 * @returns The level nillionUUID.
 */
export async function getLevelNillionUUID(gameId: number): Promise<string> {
    const stmt = db.prepare(`
        SELECT nillionUUID FROM levels 
        WHERE id = (
            SELECT level_id FROM assigned_levels
            WHERE game_id = ?
            ORDER BY id DESC
            LIMIT 1
        )
    `);

    const level = stmt.get(gameId) as { nillionUUID: string } | undefined;
    return level?.nillionUUID || "Level nillionUUID not found";
}

/**
 * Add this query to find a random level by difficulty
 */
export async function getRandomLevelByDifficulty(targetDifficulty: number): Promise<number> {
    const stmt = db.prepare(`
        SELECT id FROM levels 
        WHERE difficulty = ?
        ORDER BY RANDOM()
        LIMIT 1
    `);

    const result = stmt.get(targetDifficulty) as { id: number } | undefined;
    return result!.id;
}

export async function getGamesByOwner(owner: string) {
    return db
        .prepare(
            `SELECT id, is_active, levels_assigned 
            FROM games 
            WHERE owner = ? 
            ORDER BY id DESC`
        )
        .all(owner);
}
