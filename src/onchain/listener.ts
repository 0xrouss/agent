import { createPublicClient, http, decodeEventLog, type Hex } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { FANTASY_GAME_MASTER_ADDRESS } from "./contract";
import { handleInteraction } from "../gameMaster/interactionProcessor";
import { handleGameCreated } from "../gameMaster/gameProcessor";
import { FantasyGameMasterABI } from "../ABI/FantasyGameMaster";

// Create a public client to read from the blockchain
export const publicClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(),
});

/**
 * Listen for InteractionCreated events emitted by the contract.
 */
export function startInteractionListener(): void {
    publicClient.watchContractEvent({
        address: FANTASY_GAME_MASTER_ADDRESS,
        abi: FantasyGameMasterABI,
        eventName: "InteractionCreated",
        onLogs: async (logs) => {
            for (const log of logs) {
                const decodedLogs = decodeEventLog({
                    abi: FantasyGameMasterABI,
                    data: log.data,
                    topics: log.topics,
                });

                if (!decodedLogs.args) return;
                const args = decodedLogs.args as unknown as {
                    gameId: bigint;
                    interactionId: bigint;
                    player: Hex;
                    assignedLevelIndex: bigint;
                    interactionNillionUUID: string;
                };
                const { gameId, interactionId, player, assignedLevelIndex, interactionNillionUUID } = args;
                console.log(`New InteractionCreated event detected: Game ${gameId}, Interaction ${interactionId}, Player ${player}`);

                // Forward to the interaction processor
                await handleInteraction({
                    gameId: Number(gameId),
                    interactionId: Number(interactionId),
                    player,
                    assignedLevelIndex: Number(assignedLevelIndex),
                    interactionNillionUUID,
                });
            }
        },
        onError: (error) => {
            console.error("Error in InteractionCreated listener:", error);
        },
    });
}

/**
 * Listen for GameCreated events emitted by the contract.
 */
export function startGameCreatedListener(): void {
    publicClient.watchContractEvent({
        address: FANTASY_GAME_MASTER_ADDRESS,
        abi: FantasyGameMasterABI,
        eventName: "GameCreated",
        onLogs: async (logs) => {
            for (const log of logs) {
                // Expecting event arguments: gameId, owner
                const decodedLogs = decodeEventLog({
                    abi: FantasyGameMasterABI,
                    data: log.data,
                    topics: log.topics,
                });

                if (!decodedLogs.args) return;
                const args = decodedLogs.args as unknown as {
                    gameId: bigint;
                    owner: Hex;
                };
                const { gameId, owner } = args;
                console.log(`New GameCreated event detected: Game ${gameId} created by Owner ${owner}`);

                // Forward to the game processor
                await handleGameCreated({
                    gameId: Number(gameId),
                    owner,
                });
            }
        },
        onError: (error) => {
            console.error("Error in GameCreated listener:", error);
        },
    });
}

/**
 * Start all blockchain event listeners.
 */
export function startEventListeners(): void {
    startInteractionListener();
    startGameCreatedListener();
}
