import { Feather } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { generateResponse, isAIInitialized, isAIModelReady } from '../../ai/runanywhere';
import { ChatBubble } from '../../components/ChatBubble';
import { Colors } from '../../constants/Colors';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
}

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<string>('Ready to initialize');
    const [isThinking, setIsThinking] = useState(false);

    const flatListRef = useRef<FlatList>(null);

    const sendMessage = async () => {
        if (!input.trim() || isThinking) return;

        const userMsg: Message = { id: Date.now().toString(), text: input.trim(), isUser: true };
        setMessages(prev => [...prev, userMsg]);
        const prompt = input.trim();
        setInput('');
        setIsThinking(true);

        // Initial status update
        if (!isAIInitialized()) {
            setStatus('Initializing SDK...');
        } else if (!isAIModelReady()) {
            setStatus('Downloading model...');
        } else {
            setStatus('Thinking...');
        }

        try {
            // Status callback updates UI
            const onStatus = (msg: string) => setStatus(msg);

            // This function handles lazy initialization internally
            const responseText = await generateResponse(prompt, onStatus);

            const aiMsg: Message = { id: (Date.now() + 1).toString(), text: responseText, isUser: false };
            setMessages(prev => [...prev, aiMsg]);
            setStatus('Ready');
        } catch (error) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                isUser: false
            };
            setMessages(prev => [...prev, errorMsg]);
            setStatus('Error occurred');
        } finally {
            setIsThinking(false);
            // Scroll to bottom
            setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>MemoraAI Chat</Text>
                <Text style={styles.headerSubtitle}>On-device AI assistant {status !== 'Ready' ? `• ${status}` : ''}</Text>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <ChatBubble message={item.text} isUser={item.isUser} />}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Feather name="cpu" size={48} color={Colors.textMuted} />
                            <Text style={styles.emptyText}>Start a conversation with your local AI.</Text>
                            <Text style={styles.statusText}>{status}</Text>
                        </View>
                    }
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor={Colors.textMuted}
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={sendMessage}
                        editable={!isThinking}
                        returnKeyType="send"
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, (!input.trim() || isThinking) && styles.sendButtonDisabled]}
                        onPress={sendMessage}
                        disabled={!input.trim() || isThinking}
                    >
                        {isThinking ? (
                            <ActivityIndicator color="#FFF" size="small" />
                        ) : (
                            <Feather name="send" size={20} color="#FFF" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.cardBorder,
        backgroundColor: Colors.background,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 13,
        color: Colors.accent,
        fontWeight: '500',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 20,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        opacity: 0.7,
    },
    emptyText: {
        color: Colors.textSecondary,
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
    },
    statusText: {
        color: Colors.textMuted,
        marginTop: 8,
        fontSize: 12,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 0 : 16,
        borderTopWidth: 1,
        borderTopColor: Colors.cardBorder,
        backgroundColor: Colors.background, // Ensure solid background covers content
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: Colors.card,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: Colors.textPrimary,
        marginRight: 10,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
        fontSize: 16,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    sendButtonDisabled: {
        opacity: 0.5,
        backgroundColor: Colors.cardBorder, // Use border color for disabled state
        shadowOpacity: 0,
    },
});
