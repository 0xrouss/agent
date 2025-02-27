import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import { orgConfig } from './nillionOrgConfig.js';
import { config } from '../config/config.js';

export async function getCollection() {
    const collection = new SecretVaultWrapper(
        orgConfig.nodes,
        orgConfig.orgCredentials,
        config.nillion.schema,
    );
    await collection.init();

    return collection;
}

export async function writeToNodes(data) {
    const collection = await getCollection();

    const dataWritten = await collection.writeToNodes(data);

    const newId = dataWritten[0].result.data.created[0]
    console.log('Uploaded record UUID:', newId);

    return newId;
}

export async function getDescription(uuid) {
    const collection = await getCollection();

    const decryptedCollectionData = await collection.readFromNodes({
        _id: uuid,
    });

    // Add error handling for empty results
    if (decryptedCollectionData.length === 0) {
        throw new Error(`No level found with UUID: ${uuid}`);
    }

    return decryptedCollectionData[0].description;
}

export async function getLevelsByDifficulty(difficulty) {
    const collection = await getCollection();

    // Get all levels from the collection
    const allLevels = await collection.readFromNodes({});

    // Filter levels by difficulty and map to return just the level IDs
    return allLevels
        .filter(level => Number(level.difficulty) === difficulty)
        .map(level => level._id);
}

export async function getRandomLevelByDifficulty(difficulty) {
    const allLevels = await getLevelsByDifficulty(difficulty);
    if (allLevels.length === 0) {
        throw new Error(`No levels found with difficulty: ${difficulty}`);
    }
    const randomLevelIndex = Math.floor(Math.random() * allLevels.length);
    const randomLevelId = allLevels[randomLevelIndex];
    return randomLevelId;
}