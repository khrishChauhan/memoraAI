import React, { createContext, useCallback, useContext, useState } from 'react';

export interface ScannedFile {
    id: string;
    name: string;
    uri: string;
    size: number;
    type: string;
    dateAdded: number;
}

interface FileContextType {
    files: ScannedFile[];
    addFiles: (newFiles: ScannedFile[]) => void;
    clearFiles: () => void;
    fileCount: number;
}

const FileContext = createContext<FileContextType>({
    files: [],
    addFiles: () => { },
    clearFiles: () => { },
    fileCount: 0,
});

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [files, setFiles] = useState<ScannedFile[]>([]);

    const addFiles = useCallback((newFiles: ScannedFile[]) => {
        setFiles((prev) => {
            // Avoid duplicates by URI
            const existingUris = new Set(prev.map((f) => f.uri));
            const unique = newFiles.filter((f) => !existingUris.has(f.uri));
            return [...prev, ...unique];
        });
    }, []);

    const clearFiles = useCallback(() => {
        setFiles([]);
    }, []);

    return (
        <FileContext.Provider value={{ files, addFiles, clearFiles, fileCount: files.length }}>
            {children}
        </FileContext.Provider>
    );
};

export const useFiles = () => useContext(FileContext);
