import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface ChatBubbleProps {
    message: string;
    isUser: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser }) => {
    return (
        <View
            style={[
                styles.container,
                isUser ? styles.userContainer : styles.aiContainer,
            ]}
        >
            <Text
                style={[
                    styles.text,
                    isUser ? styles.userText : styles.aiText,
                ]}
            >
                {message}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        maxWidth: '80%',
        marginVertical: 6,
    },
    userContainer: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.accent,
        borderBottomRightRadius: 4,
    },
    aiContainer: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.card,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
    },
    text: {
        fontSize: 15,
        lineHeight: 22,
        fontFamily: 'System', // Use default font for now
    },
    userText: {
        color: '#FFFFFF',
    },
    aiText: {
        color: Colors.textPrimary,
    },
});
