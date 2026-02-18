import React from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { FileCard } from '../components/FileCard';
import { Header } from '../components/Header';
import { Colors } from '../constants/Colors';

const MOCK_FILES = [
    { id: '1', name: 'resume_final_v2.pdf', size: '1.2 MB', tag: 'Duplicate' as const, icon: 'file-text' as const },
    { id: '2', name: 'IMG_20240315.jpg', size: '4.8 MB', tag: 'Duplicate' as const, icon: 'image' as const },
    { id: '3', name: 'project_report.docx', size: '2.3 MB', tag: 'Important' as const, icon: 'file' as const },
    { id: '4', name: 'screen_recording.mp4', size: '145 MB', tag: 'Unused' as const, icon: 'video' as const },
    { id: '5', name: 'backup_2023.zip', size: '2.1 GB', tag: 'Unused' as const, icon: 'archive' as const },
    { id: '6', name: 'IMG_20240315_copy.jpg', size: '4.8 MB', tag: 'Duplicate' as const, icon: 'image' as const },
    { id: '7', name: 'tax_receipt_2024.pdf', size: '320 KB', tag: 'Important' as const, icon: 'file-text' as const },
    { id: '8', name: 'old_notes.txt', size: '45 KB', tag: 'Unused' as const, icon: 'edit-3' as const },
];

const FilesScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <Header title="Files" subtitle="Analyzed storage items" />

            <FlatList
                data={MOCK_FILES}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <FileCard
                        name={item.name}
                        size={item.size}
                        tag={item.tag}
                        icon={item.icon}
                        index={index}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
});

export default FilesScreen;
