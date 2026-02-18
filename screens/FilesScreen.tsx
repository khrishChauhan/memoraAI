import { Feather } from '@expo/vector-icons';
import React from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { FileCard } from '../components/FileCard';
import { Header } from '../components/Header';
import { Colors } from '../constants/Colors';
import { useFiles } from '../context/FileContext';

const FilesScreen = () => {
    const { files } = useFiles();

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconRing}>
                <Feather name="inbox" size={40} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No files scanned yet</Text>
            <Text style={styles.emptyDescription}>
                Scan files from Home to see them here.
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <Header title="Files" subtitle={`${files.length} scanned files`} />

            {files.length === 0 ? (
                renderEmpty()
            ) : (
                <FlatList
                    data={files}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <FileCard
                            name={item.name}
                            size={item.size}
                            type={item.type}
                            dateAdded={item.dateAdded}
                            index={index}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIconRing: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.03)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: 14,
        color: Colors.textMuted,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default FilesScreen;
