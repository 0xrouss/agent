// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title FantasyGameMaster
 * @dev Contract that manages games and levels for a fantasy game.
 *      It allows a player to "die" on a level without ending their game.
 *      The player may repeat interactions until they pass the level.
 */
contract FantasyGameMaster {

    // =========================================================================
    // Data Structures
    // =========================================================================

    /**
     * @dev Represents the template for a level that can be reused in different games.
     */
    struct LevelData {
        string nillionUUID;
        uint256 difficulty;
    }

    /**
     * @dev Reference to a level assigned to a game.
     */
    struct AssignedLevel {
        uint256 levelId;
        bool completed; // Indicates whether the player has completed this level
    }

    /**
     * @dev Represents a game.
     *      - owner: the address of the player who owns the game.
     *      - isActive: indicates whether the game is still active or has ended.
     *      - levelsAssigned: number of levels that have been assigned (but not necessarily completed).
     */
    struct Game {
        address owner;
        bool isActive;
        uint256 levelsAssigned;
    }

    /**
     * @dev Represents an interaction within a level:
     *      - player: the address of the player.
     *      - assignedLevelIndex: index of the level (within the game) where the interaction occurs.
     *      - action: the action taken by the player.
     *      - result: description of the result, provided by the Game Master.
     *      - isComplete: indicates whether the Game Master has processed this interaction.
     */
    struct Interaction {
        address player;
        uint256 assignedLevelIndex;
        string action;
        string result;
        bool isComplete;
    }

    // =========================================================================
    // Storage Variables
    // =========================================================================

    // List of levels
    LevelData[] public levels;

    // Counter for game IDs
    uint256 public currentGameId;

    // Mapping: player address -> list of game IDs
    mapping(address => uint256[]) public playerGames;

    // Mapping: game ID -> game data
    mapping(uint256 => Game) public games;

    // Mapping: game ID -> list of assigned levels
    mapping(uint256 => AssignedLevel[]) public gameLevels;

    // Mapping: game ID -> list of interactions
    mapping(uint256 => Interaction[]) public gameInteractions;

    // Address of the Game Master (AI) with special permissions
    address public gameMaster;

    // =========================================================================
    // Events
    // =========================================================================

    /** Emitted when a new level is created */
    event LevelCreated(
        uint256 indexed levelId,
        string nillionUUID,
        uint256 difficulty
    );

    /** Emitted when a new game is created */
    event GameCreated(
        uint256 indexed gameId,
        address indexed owner
    );

    /** Emitted when a level is assigned to a game */
    event LevelAssigned(
        uint256 indexed gameId,
        uint256 assignedLevelIndex,
        uint256 levelId
    );

    /** Emitted when a player performs an interaction on a level */
    event InteractionCreated(
        uint256 indexed gameId,
        uint256 interactionId,
        address indexed player,
        uint256 assignedLevelIndex,
        string action
    );

    /**
     * @dev Emitted when an interaction is updated with the result.
     * @param levelPassed indicates whether the player successfully passed the level in this interaction.
     */
    event InteractionUpdated(
        uint256 indexed gameId,
        uint256 interactionId,
        bool levelPassed,
        string result
    );

    /** Emitted when a game ends (for example, after completing the 10th level) */
    event GameEnded(
        uint256 indexed gameId,
        address indexed owner
    );

    // =========================================================================
    // Constructor
    // =========================================================================

    constructor(address _gameMaster) {
        gameMaster = _gameMaster;
    }

    // =========================================================================
    // Modifiers
    // =========================================================================

    modifier onlyGameMaster() {
        require(msg.sender == gameMaster, "Only the Game Master can call this function");
        _;
    }

    // =========================================================================
    // Levels Logic
    // =========================================================================

    /**
     * @dev Creates a new level to be reused in games.
     */
    function addLevel(string calldata _nillionUUID, uint256 _difficulty)
        external
        onlyGameMaster
        returns (uint256)
    {
        levels.push(LevelData({
            nillionUUID: _nillionUUID,
            difficulty: _difficulty
        }));

        uint256 newLevelId = levels.length - 1;
        emit LevelCreated(newLevelId, _nillionUUID, _difficulty);
        return newLevelId;
    }

    function getLevelsCount() external view returns (uint256) {
        return levels.length;
    }

    function getLevel(uint256 _levelId)
        external
        view
        returns (string memory nillionUUID, uint256 difficulty)
    {
        LevelData memory lvl = levels[_levelId];
        return (lvl.nillionUUID, lvl.difficulty);
    }

    // =========================================================================
    // Games Logic
    // =========================================================================

    /**
     * @dev Creates a new game for the player invoking this function.
     */
    function createGame() external returns (uint256) {
        currentGameId++;
        uint256 newGameId = currentGameId;

        games[newGameId] = Game({
            owner: msg.sender,
            isActive: true,
            levelsAssigned: 0
        });

        playerGames[msg.sender].push(newGameId);

        emit GameCreated(newGameId, msg.sender);
        return newGameId;
    }

    /**
     * @dev Assigns a level to the specified game.
     *      The player can attempt this level until they pass it.
     */
    function assignLevel(uint256 _gameId, uint256 _levelId)
        external
        onlyGameMaster
    {
        Game storage game = games[_gameId];
        require(game.isActive, "The game is not active");
        require(_levelId < levels.length, "The level does not exist");

        // Add to the list of assigned levels for the game
        gameLevels[_gameId].push(AssignedLevel({
            levelId: _levelId,
            completed: false
        }));

        // Increase the counter of assigned levels
        game.levelsAssigned++;

        uint256 assignedIndex = gameLevels[_gameId].length - 1;
        emit LevelAssigned(_gameId, assignedIndex, _levelId);
    }

    /**
     * @dev The player creates an interaction (e.g., attempts to pass the level).
     *      The AI will listen to the event and then call `updateInteraction` with the result.
     *
     *      Here we assume that the player always interacts with the last assigned level
     *      that has not yet been completed. For more flexibility, you could allow choosing
     *      the index of the AssignedLevel.
     */
    function createInteraction(uint256 _gameId, string calldata _action) external {
        Game memory game = games[_gameId];
        require(game.isActive, "The game is not active");
        require(game.owner == msg.sender, "You are not the owner of this game");
        require(game.levelsAssigned > 0, "No levels have been assigned yet");

        // Last assigned level (by index)
        uint256 currentAssignedIndex = game.levelsAssigned - 1;

        // Create the interaction
        Interaction memory newInteraction = Interaction({
            player: msg.sender,
            assignedLevelIndex: currentAssignedIndex,
            action: _action,
            result: "",
            isComplete: false
        });

        uint256 interactionId = gameInteractions[_gameId].length;
        gameInteractions[_gameId].push(newInteraction);

        emit InteractionCreated(
            _gameId,
            interactionId,
            msg.sender,
            currentAssignedIndex,
            _action
        );
    }

    /**
     * @dev The Game Master updates the interaction with the result.
     *      - `levelPassed` indicates whether the player successfully passed the level in this interaction.
     *      - If `levelPassed = false`, the player may simply create another interaction to try again
     *        (the game does not end).
     *      - If `levelPassed = true`, the level is marked as completed.
     *        If it is the 10th level, the game ends; otherwise, the Game Master may assign
     *        the next level.
     */
    function updateInteraction(
        uint256 _gameId,
        uint256 _interactionId,
        bool _levelPassed,
        string calldata _result
    ) external onlyGameMaster {
        Game storage game = games[_gameId];
        require(game.isActive, "The game is not active");
        
        Interaction storage interaction = gameInteractions[_gameId][_interactionId];
        require(!interaction.isComplete, "Interaction already completed");

        // Update the interaction
        interaction.result = _result;
        interaction.isComplete = true;

        emit InteractionUpdated(
            _gameId,
            _interactionId,
            _levelPassed,
            _result
        );

        // If the level was not passed, the player can try again (nothing further is done)
        if (!_levelPassed) {
            return;
        }

        // If the level was passed, mark the AssignedLevel as completed
        uint256 assignedIndex = interaction.assignedLevelIndex;
        AssignedLevel storage assignedLevel = gameLevels[_gameId][assignedIndex];
        assignedLevel.completed = true;

        // If the player has been assigned 10 levels (and just completed the tenth),
        // end the game.
        if (game.levelsAssigned >= 10) {
            endGame(_gameId);
        }
    }

    /**
     * @dev Internal function that marks a game as ended.
     */
    function endGame(uint256 _gameId) internal {
        Game storage game = games[_gameId];
        require(game.isActive, "The game is already inactive");

        game.isActive = false;
        emit GameEnded(_gameId, game.owner);
    }

    // =========================================================================
    // Query Functions
    // =========================================================================

    /**
     * @dev Returns the number of levels assigned to a game.
     */
    function getAssignedLevelsCount(uint256 _gameId) external view returns (uint256) {
        return gameLevels[_gameId].length;
    }

    /**
     * @dev Returns the level ID and its completion status for a given index.
     */
    function getAssignedLevelInfo(uint256 _gameId, uint256 _assignedIndex)
        external
        view
        returns (uint256 levelId, bool completed)
    {
        AssignedLevel storage lvl = gameLevels[_gameId][_assignedIndex];
        return (lvl.levelId, lvl.completed);
    }

    /**
     * @dev Returns the number of interactions recorded in a game.
     */
    function getInteractionsCount(uint256 _gameId) external view returns (uint256) {
        return gameInteractions[_gameId].length;
    }

    /**
     * @dev Returns the data of a specific interaction.
     */
    function getInteraction(uint256 _gameId, uint256 _interactionId)
        external
        view
        returns (
            address player,
            uint256 assignedLevelIndex,
            string memory action,
            string memory result,
            bool isComplete
        )
    {
        Interaction storage inter = gameInteractions[_gameId][_interactionId];
        return (
            inter.player,
            inter.assignedLevelIndex,
            inter.action,
            inter.result,
            inter.isComplete
        );
    }

    function getPlayerGames(address _player)
        external
        view
        returns (
            uint256[] memory gameIds,
            bool[] memory isActive,
            uint256[] memory levelsAssigned
        )
    {
        uint256 length = playerGames[_player].length;
        gameIds = playerGames[_player];
        isActive = new bool[](length);
        levelsAssigned = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            uint256 id = gameIds[i];
            Game storage game = games[id];
            isActive[i] = game.isActive;
            levelsAssigned[i] = game.levelsAssigned;
        }
    }

}
