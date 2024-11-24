import SearchBar from '@/components/SearchBar';
import { router, useFocusEffect } from 'expo-router';
import { Text, View } from 'react-native';
import { StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

import React, { useState } from 'react';
import { Conversation, getConversation } from '@/services/api-calls/chat';
import { useErrorContext } from '@/utils/ctx';

const ChatListItem = ({
    conversation,
    onPress,
}: {
    conversation: Conversation;
    onPress: () => void;
}) => {
    return (
        <TouchableOpacity
            onPress={() => onPress()}
            style={styles.itemContainer}
        >
            <Image
                source={{ uri: conversation.partner.avatar }}
                style={styles.avatar}
            />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{conversation.partner.name}</Text>
                    <Text style={styles.timestamp}>
                        {conversation.last_message.created_at}
                    </Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {conversation.last_message.message}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export function Chat() {
    const { setUnhandledError } = useErrorContext();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    useFocusEffect(
        React.useCallback(() => {
            getConversation()
                .then((data) => {
                    setConversations(data.data.conversations);
                    console.log(data);
                })
                .catch((err) => setUnhandledError(err));
        }, [])
    );
    return (
        <View>
            <SearchBar
                onFocus={() => {
                    router.push('/student/chat/search');
                }}
            ></SearchBar>
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ChatListItem conversation={item} onPress={() => {}} />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    itemContainer: {
        // marginLeft:15,
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        // backgroundColor: '#fff',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
    },
    badgeContainer: {
        backgroundColor: 'red',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
        // marginLeft: 80, // Align separator after avatar
    },
});
