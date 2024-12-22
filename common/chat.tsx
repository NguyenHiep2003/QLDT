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
import { useSocketContext } from '@/utils/socket.ctx';
import { ROLES } from '@/constants/Roles';

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
                            conversation.last_message?.created_at
                        ).toLocaleString('vi')}
                    </Text>
                </View>

                {userId != conversation.last_message?.sender?.id &&
                conversation.last_message?.unread ? (
                    <Text style={styles.unreadMessage} numberOfLines={1}>
                        {conversation.last_message
                            ? conversation.last_message?.message
                                ? conversation.last_message?.message
                                : 'Tin nhắn đã bị xóa'
                            : undefined}
                    </Text>
                ) : (
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {userId != conversation.last_message?.sender?.id
                            ? conversation.last_message
                                ? conversation.last_message?.message
                                    ? conversation.last_message?.message
                                    : 'Tin nhắn đã bị xóa'
                                : undefined
                            : conversation.last_message
                            ? conversation.last_message?.message
                                ? `Bạn: ${conversation.last_message?.message}`
                                : 'Bạn đã xóa 1 tin nhắn'
                            : undefined}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

export function Chat({ role }: { role: ROLES }) {
    const { setUnhandledError } = useErrorContext();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const { stompClient } = useSocketContext();
    const [profile, setProfile] = useState<TProfile>();
    // const [index, setIndex] = useState(0);
    const count = 15;
    // function handleLoadMore() {
    //     getConversation(index + count, count)
    //         .then((data) => {
    //             console.log(data.data.conversations);

    //             setConversations((prev) => [
    //                 ...prev,
    //                 ...data.data.conversations,
    //             ]);
    //             setIndex(index + count);
    //         })
    //         .catch((err) => setUnhandledError(err));
    // }
    useFocusEffect(
        React.useCallback(() => {
            getProfileLocal().then((profile) => {
                setProfile(profile);
                if(stompClient?.connected) stompClient?.subscribe(
                    `/user/${profile?.id}/inbox`,
                    function () {
                        getConversation(0, count)
                            .then((data) => {
                                // console.log(data.data.conversations);

                                setConversations(data.data.conversations);
                            })
                            .catch((err) => setUnhandledError(err));
                    },
                    { id: 'subscribe in chat' }
                );
            });
            getConversation(0, count)
                .then((data) => {
                    // console.log(data.data.conversations);

                    setConversations(data.data.conversations);
                })
                .catch((err) => setUnhandledError(err));
            return () => {
                if(stompClient?.connected) stompClient?.unsubscribe('subscribe in chat');
            };
        }, [])
    );
    return (
        <View style={{ flex: 1 }}>
            <SearchBar
                onFocus={() => {
                    if (role == ROLES.STUDENT)
                        router.push('/student/chat/search');
                    else router.push('/lecturer/chat/search');
                }}
            ></SearchBar>
            <FlatList
                onEndReachedThreshold={10}
                // onEndReached={() => {
                //     handleLoadMore();
                // }}
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ChatListItem
                        conversation={item}
                        onPress={() => {
                            if (role == ROLES.STUDENT)
                                router.push(
                                    `/student/(tabs)/chat/conversation?conversationId=${item.id}&partnerId=${item.partner.id}`
                                );
                            else
                                router.push(
                                    `/lecturer/(tabs)/chat/conversation?conversationId=${item.id}&partnerId=${item.partner.id}`
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
