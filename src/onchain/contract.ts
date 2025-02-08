import { createPublicClient, createWalletClient, http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { config } from "../config/config";
import { FantasyGameMasterABI } from "../ABI/FantasyGameMaster";
import { privateKeyToAccount } from "viem/accounts";
import { createNonceManager, jsonRpc } from "viem/nonce";

// Export the smart contract address (read from your config)
export const FANTASY_GAME_MASTER_ADDRESS = config.contractAddress;

const nonceManager = createNonceManager({
    source: jsonRpc(),
});

const account = privateKeyToAccount(config.gameMasterPrivateKey, { nonceManager });

// Create a wallet client to send transactions (using the game master's private key)
export const walletClient = createWalletClient({
    chain: arbitrumSepolia,
    transport: http(),
    account: account,
});

// Helper function to call the smart contract's updateInteraction function
export async function updateInteractionOnchain(partidaId: number, interactionId: number, levelPassed: boolean, result: string): Promise<string> {
    try {
        const txHash = await walletClient.writeContract({
            address: FANTASY_GAME_MASTER_ADDRESS,
            abi: FantasyGameMasterABI,
            functionName: "updateInteraction",
            args: [partidaId, interactionId, levelPassed, result],
        });
        return txHash;
    } catch (error) {
        console.error("Error updating interaction onchain:", error);
        throw error;
    }
}

// Helper function to assign a level to a game
export async function assignLevelOnchain(gameId: number, levelId: number): Promise<string> {
    try {
        const txHash = await walletClient.writeContract({
            address: FANTASY_GAME_MASTER_ADDRESS,
            abi: FantasyGameMasterABI,
            functionName: "assignLevel",
            args: [gameId, levelId],
        });
        return txHash;
    } catch (error) {
        console.error("Error assigning level onchain:", error);
        throw error;
    }
}

// Helper function to add a new level
export async function addLevelOnchain(description: string, difficulty: number): Promise<string> {
    try {
        const txHash = await walletClient.writeContract({
            address: FANTASY_GAME_MASTER_ADDRESS,
            abi: FantasyGameMasterABI,
            functionName: "addLevel",
            args: [description, difficulty],
        });
        return txHash;
    } catch (error) {
        console.error("Error adding global level onchain:", error);
        throw error;
    }
}
