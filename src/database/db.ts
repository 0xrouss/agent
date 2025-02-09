import { Database } from "bun:sqlite";
import { config } from "../config/config"; // Adjust the path as needed

// Create or open the database using the path from your configuration
const db = new Database(config.database.path);

// Create the tables if they do not exist
db.run(`
    CREATE TABLE IF NOT EXISTS levels (
        id INTEGER PRIMARY KEY,
        nillionUUID TEXT,
        difficulty INTEGER
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY,
        owner TEXT,
        is_active BOOLEAN,
        levels_assigned INTEGER
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS assigned_levels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_id INTEGER,
        level_id INTEGER,
        completed BOOLEAN,
        FOREIGN KEY (game_id) REFERENCES games(id),
        FOREIGN KEY (level_id) REFERENCES levels(id)
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_id INTEGER,
        interaction_id INTEGER,
        assigned_level_index INTEGER,
        action TEXT,
        result TEXT,
        is_complete BOOLEAN,
        FOREIGN KEY (game_id) REFERENCES games(id)
    );
`);

export default db;
