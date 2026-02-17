import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

interface ScanButtonProps {
    onPress: () => void;
    isScanning: boolean;
}

export default function ScanButton({ onPress, isScanning }: ScanButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.button, isScanning && styles.buttonScanning]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={isScanning}
        >
            {isScanning ? (
                <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 10 }} />
            ) : (
                <Ionicons name="scan-outline" size={20} color="#ffffff" style={{ marginRight: 10 }} />
            )}
            <Text style={styles.text}>
                {isScanning ? 'Scanning...' : 'Scan Files'}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3b82f6',
        marginHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 14,
        marginBottom: 28,
    },
    buttonScanning: {
        backgroundColor: '#1e40af',
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ffffff',
    },
});
