import SearchBar from '@/components/SearchBar';
import { router, useFocusEffect } from 'expo-router';
import { Text, View } from 'react-native';
import { StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

import React, { useState } from 'react';
import { Conversation, getConversation } from '@/services/api-calls/chat';
import { useErrorContext } from '@/utils/ctx';
import { UserAvatar } from '@/components/UserAvatar';
import { getTitleFromName } from '@/utils/getAvatarTitle';
import { TProfile } from '@/types/profile';
import { getProfileLocal } from '@/services/storages/profile';

const ChatListItem = ({
    conversation,
    onPress,
    userId,
}: {
    conversation: Conversation;
    onPress: () => void;
    userId: number | string | undefined;
}) => {
    return (
        <TouchableOpacity
            onPress={() => onPress()}
            style={styles.itemContainer}
        >
            {/* <Image
                source={{ uri: conversation.partner?.avatar }}
                style={styles.avatar}
            /> */}
            <UserAvatar
                link={conversation.partner?.avatar}
                title={getTitleFromName(conversation.partner.name)}
                id={conversation.partner.id}
                size={65}
            ></UserAvatar>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>
                        {conversation.partner?.name}
                    </Text>
                    <Text style={styles.timestamp}>
                        {new Date(
                            new Date(
                                conversation.last_message?.created_at
                            ).getTime() +
                                7 * 3600 * 1000
                        ).toLocaleString('vi')}
                    </Text>
                </View>

                {userId != conversation.last_message?.sender?.id && conversation.last_message?.unread ? (
                    <Text style={styles.unreadMessage} numberOfLines={1}>
                        {conversation.last_message
                            ? conversation.last_message?.message
                                ? conversation.last_message?.message
                                : 'Tin nhắn đã bị xóa'
                            : undefined}
                    </Text>
                ) : (
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {conversation.last_message
                            ? conversation.last_message?.message
                                ? conversation.last_message?.message
                                : 'Tin nhắn đã bị xóa'
                            : undefined}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

export function Chat() {
    const { setUnhandledError } = useErrorContext();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [profile, setProfile] = useState<TProfile>();
    useFocusEffect(
        React.useCallback(() => {
            getProfileLocal().then((profile) => setProfile(profile));
            getConversation(0, 8)
                .then((data) => {
                    console.log(data.data.conversations);

                    setConversations(data.data.conversations);
                })
                .catch((err) => setUnhandledError(err));
        }, [])
    );
    return (
        <View style={{flex:1}}>
            <SearchBar
                onFocus={() => {
                    router.push('/student/chat/search');
                }}
            ></SearchBar>
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ChatListItem
                        conversation={item}
                        onPress={() => {
                            router.push(
                                `/student/(tabs)/chat/conversation?conversationId=${item.id}&partnerId=${item.partner.id}`
                            );
                        }}
                        userId={profile?.id}
                    />
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    timestamp: {
        marginTop: 4,
        fontSize: 13,
        color: '#999',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
    },
    unreadMessage: {
        fontSize: 15,
        color: '#000',
        fontWeight: 'bold',
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
