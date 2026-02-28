import { createContext, useContext, useEffect, useState } from 'react';
import { getStoredFiles, saveFiles } from '../utils/storage';

const FilesContext = createContext();

export const FilesProvider = ({ children }) => {
    const [scannedFiles, setScannedFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initStorage = async () => {
            try {
                const files = await getStoredFiles();
                setScannedFiles(files);
            } finally {
                setLoading(false);
            }
        };
        initStorage();
    }, []);

    const updateFiles = async (newFiles) => {
        setScannedFiles(newFiles);
        await saveFiles(newFiles);
    };

    return (
        <FilesContext.Provider value={{ scannedFiles, setScannedFiles: updateFiles, loading }}>
            {children}
        </FilesContext.Provider>
    );
};

export const useFiles = () => {
    const context = useContext(FilesContext);
    if (!context) {
        throw new Error('useFiles must be used within a FilesProvider');
    }
    return context;
};
