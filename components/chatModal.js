// components/ChatModal.js

import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/auth'; // Import useAuth from AuthContext

export default function ChatModal({ visible, onClose, projectId }) {
    const { authData } = useAuth(); // Access authData from context
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const pollingInterval = useRef(null); // Reference to the polling interval

    const BACKEND_URL = 'http://10.16.28.214:3000'; // Replace with your backend URL

    // Function to fetch messages
    const fetchMessages = async () => {
        try {
            // Fetch only the latest 50 messages
            const response = await axios.get(`${BACKEND_URL}/chat/${projectId}?limit=50`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            // Optionally, display an error message to the user
        }
    };

    // Function to send a new message
    const sendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            setSending(true);
            const messageData = {
                sender: authData.email, // Use authenticated user's email
                content: newMessage.trim(),
            };
            await axios.post(`${BACKEND_URL}/chat/${projectId}`, messageData);
            setNewMessage('');
            fetchMessages(); // Fetch messages immediately after sending
        } catch (error) {
            console.error('Error sending message:', error);
            // Optionally, display an error message to the user
        } finally {
            setSending(false);
        }
    };

    // Set up polling when the modal is visible
    useEffect(() => {
        if (visible) {
            setLoading(true);
            fetchMessages().then(() => setLoading(false));

            // Start polling every 10 seconds
            pollingInterval.current = setInterval(() => {
                fetchMessages();
            }, 10000); // 10,000 milliseconds
        }

        // Clean up the polling interval when the modal is closed
        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        };
    }, [visible]);

    // Render each message
    const renderMessage = ({ item }) => {
        const isMyMessage = item.sender === authData.email;

        return (
            <View
                style={[
                    styles.messageBubble,
                    isMyMessage ? styles.myMessage : styles.otherMessage,
                ]}
            >
                {!isMyMessage && <Text style={styles.messageSender}>{item.sender}</Text>}
                <Text style={styles.messageContent}>{item.content}</Text>
                <Text style={styles.messageTimestamp}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        );
    };

    return (
        <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Project Chat</Text>
                    <TouchableOpacity onPress={onClose}>
                        <MaterialIcons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Messages */}
                {loading ? (
                    <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item._id.toString()} // Use unique ID if available
                        style={styles.messagesContainer}
                        renderItem={renderMessage}
                        inverted={false} // Change to true if you want latest messages at the bottom
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}

                {/* Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message..."
                        placeholderTextColor="#bbb"
                        value={newMessage}
                        onChangeText={setNewMessage}
                        onSubmitEditing={sendMessage}
                        returnKeyType="send"
                    />
                    <TouchableOpacity onPress={sendMessage} style={styles.sendButton} disabled={sending}>
                        <MaterialIcons name="send" size={24} color={sending ? '#555' : '#fff'} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#272222',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#444',
        padding: 15,
    },
    headerTitle: {
        fontSize: 18,
        color: '#fff',
    },
    messagesContainer: {
        flex: 1,
        padding: 10,
    },
    messageBubble: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    myMessage: {
        backgroundColor: '#28a745',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: '#444',
        alignSelf: 'flex-start',
    },
    messageSender: {
        fontSize: 12,
        color: '#fff',
        marginBottom: 2,
    },
    messageContent: {
        fontSize: 16,
        color: '#fff',
    },
    messageTimestamp: {
        fontSize: 10,
        color: '#ccc',
        marginTop: 5,
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#333',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#444',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        color: '#fff',
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#28a745',
        borderRadius: 20,
        padding: 10,
    },
});
