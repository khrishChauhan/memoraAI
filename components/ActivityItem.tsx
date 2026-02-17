import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ActivityItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    time: string;
    accentColor?: string;
    isLast?: boolean;
}

export default function ActivityItem({
    icon,
    title,
    time,
    accentColor = '#3b82f6',
    isLast = false,
}: ActivityItemProps) {
    return (
        <View style={styles.container}>
            {/* Timeline line */}
            <View style={styles.timelineColumn}>
                <View style={[styles.dot, { backgroundColor: accentColor }]}>
                    <View style={[styles.dotInner, { backgroundColor: accentColor }]} />
                </View>
                {!isLast && <View style={styles.line} />}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.contentCard}>
                    <View style={[styles.iconBg, { backgroundColor: accentColor + '12' }]}>
                        <Ionicons name={icon} size={16} color={accentColor} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.time}>{time}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        minHeight: 64,
    },
    timelineColumn: {
        width: 32,
        alignItems: 'center',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    dotInner: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        opacity: 0.5,
    },
    line: {
        flex: 1,
        width: 1.5,
        backgroundColor: '#1e293b',
        marginVertical: 4,
    },
    content: {
        flex: 1,
        paddingLeft: 12,
        paddingBottom: 12,
    },
    contentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    iconBg: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        color: '#e2e8f0',
        marginBottom: 2,
    },
    time: {
        fontSize: 11,
        color: '#475569',
        fontWeight: '500',
    },
});
