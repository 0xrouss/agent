import type { Abi } from "viem";

export const FantasyGameMasterABI: Abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_gameMaster",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "gameId",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "GameCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "gameId",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "GameEnded",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "gameId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "interactionId",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "address",
                name: "player",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "assignedLevelIndex",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "string",
                name: "interactionNillionUUID",
                type: "string",
            },
        ],
        name: "InteractionCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "gameId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "interactionId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "levelPassed",
                type: "bool",
            },
            {
                indexed: false,
                internalType: "string",
                name: "result",
                type: "string",
            },
        ],
        name: "InteractionUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "gameId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "assignedLevelIndex",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "levelId",
                type: "uint256",
            },
        ],
        name: "LevelAssigned",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "levelId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "string",
                name: "nillionUUID",
                type: "string",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "difficulty",
                type: "uint256",
            },
        ],
        name: "LevelCreated",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_nillionUUID",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "_difficulty",
                type: "uint256",
            },
        ],
        name: "addLevel",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_gameId",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_levelId",
                type: "uint256",
            },
        ],
        name: "assignLevel",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "createGame",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_gameId",
                type: "uint256",
            },
            {
                internalType: "string",
                name: "_action",
                type: "string",
            },
        ],
        name: "createInteraction",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "currentGameId",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "gameInteractions",
        outputs: [
            {
                internalType: "address",
                name: "player",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "assignedLevelIndex",
                type: "uint256",
            },
            {
                internalType: "string",
                name: "action",
                type: "string",
            },
            {
                internalType: "string",
                name: "result",
                type: "string",
            },
            {
                internalType: "bool",
                name: "isComplete",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "gameLevels",
        outputs: [
            {
                internalType: "uint256",
                name: "levelId",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "completed",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "gameMaster",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "games",
        outputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                internalType: "bool",
                name: "isActive",
                type: "bool",
            },
            {
                internalType: "uint256",
                name: "levelsAssigned",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_gameId",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_assignedIndex",
                type: "uint256",
            },
        ],
        name: "getAssignedLevelInfo",
        outputs: [
            {
                internalType: "uint256",
                name: "levelId",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "completed",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_gameId",
                type: "uint256",
            },
        ],
        name: "getAssignedLevelsCount",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_gameId",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_interactionId",
                type: "uint256",
            },
        ],
        name: "getInteraction",
        outputs: [
            {
                internalType: "address",
                name: "player",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "assignedLevelIndex",
                type: "uint256",
            },
            {
                internalType: "string",
                name: "action",
                type: "string",
            },
            {
                internalType: "string",
                name: "result",
                type: "string",
            },
            {
                internalType: "bool",
                name: "isComplete",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_gameId",
                type: "uint256",
            },
        ],
        name: "getInteractionsCount",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_levelId",
                type: "uint256",
            },
        ],
        name: "getLevel",
        outputs: [
            {
                internalType: "string",
                name: "nillionUUID",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "difficulty",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getLevelsCount",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_player",
                type: "address",
            },
        ],
        name: "getPlayerGames",
        outputs: [
            {
                internalType: "uint256[]",
                name: "gameIds",
                type: "uint256[]",
            },
            {
                internalType: "bool[]",
                name: "isActive",
                type: "bool[]",
            },
            {
                internalType: "uint256[]",
                name: "levelsAssigned",
                type: "uint256[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "levels",
        outputs: [
            {
                internalType: "string",
                name: "nillionUUID",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "difficulty",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "playerGames",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_gameId",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_interactionId",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "_levelPassed",
                type: "bool",
            },
            {
                internalType: "string",
                name: "_result",
                type: "string",
            },
        ],
        name: "updateInteraction",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
