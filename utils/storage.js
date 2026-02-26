import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'MEMORA_FILES';

export const getStoredFiles = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error reading storage:', e);
        return [];
    }
};

export const saveFiles = async (files) => {
    try {
        const jsonValue = JSON.stringify(files);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
        console.error('Error saving to storage:', e);
    }
};

export const mergeFiles = (existingFiles, newFiles) => {
    const existingUris = new Set(existingFiles.map(file => file.uri));

    const filteredNewFiles = newFiles.filter(
        file => !existingUris.has(file.uri)
    );

    return [...existingFiles, ...filteredNewFiles];
};
