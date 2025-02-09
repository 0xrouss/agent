import type { Address, Hex } from "viem";

/**
 * Interface for our configuration.
 */
export interface Config {
    // Deployed contract address for FantasyGameMaster
    contractAddress: Address;
    // Private key for the AI Game Master wallet (ensure you secure this!)
    gameMasterPrivateKey: Hex;
    openai: {
        // OpenAI API url
        apiUrl: string;
        // OpenAI API key for making calls to the API
        apiKey: string;
        // OpenAI model to use (for example, "text-davinci-003")
        model: string;
        // Temperature setting for creative responses
        temperature: number;
        // Maximum tokens for completions
        maxTokens: number;
    };
    database: {
        // Path to the local Bun SQLite database file
        path: string;
    };
    api: {
        port?: number;
    };
    privy: {
        appId: string;
        appSecret: string;
        walletId: string;
        walletAddress: Address;
    };
}

/**
 * Central configuration object. Values are read from environment variables,
 * with defaults provided for development.
 */
export const config: Config = {
    contractAddress: (process.env.CONTRACT_ADDRESS as Address) || "0xYourContractAddress",
    gameMasterPrivateKey: `0x${process.env.GAME_MASTER_PRIVATE_KEY}` || "0x",
    openai: {
        apiUrl: process.env.OPENAI_API_URL || "",
        apiKey: process.env.OPENAI_API_KEY || "",
        model: process.env.OPENAI_MODEL || "deepseek-chat",
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE || "0.7"),
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || "500", 10),
    },
    database: {
        path: process.env.DATABASE_PATH || "localGameMaster.db",
    },
    api: {
        port: process.env.API_PORT ? parseInt(process.env.API_PORT) : undefined,
    },
    privy: {
        appId: process.env.APP_ID || "appId",
        appSecret: process.env.APP_SECRET || "appSecret",
        walletId: process.env.WALLET_ID || "walletId",
        walletAddress: (process.env.WALLET_ADDRESS as Address) || "0xAddress",
    },
};
