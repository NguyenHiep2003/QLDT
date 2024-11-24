import { UserAvatar } from '@/components/UserAvatar';
import { getConversationDetails } from '@/services/api-calls/chat';
import { getProfileLocal } from '@/services/storages/profile';
import { getTokenLocal } from '@/services/storages/token';
import { TProfile } from '@/types/profile';
import { useErrorContext } from '@/utils/ctx';
import { useSocketContext } from '@/utils/socket.ctx';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

export function ConversationDetail({
    conversationId,
    partnerId,
}: {
    conversationId?: string;
    partnerId?: string;
}) {
    const [profile, setProfile] = useState<TProfile>();
    const [messages, setMessages] = useState<any[]>([]);
    const { setUnhandledError } = useErrorContext();
    const { stompClient } = useSocketContext();
    const [index, setIndex] = useState(0);
    const [isShowEarlyLoad, setIsShowEarlyLoad] = useState(true);
    const count = 40;

    useFocusEffect(
        React.useCallback(() => {
            getConversationDetails({ partnerId, conversationId }, index, count)
                .then((response) => {
                    const messages = response.data.conversation;
                    if (messages.length < count) setIsShowEarlyLoad(false);
                    setMessages(
                        messages.map((message) => {
                            const name = message.sender.name;
                            const split = name.split(' ');
                            const title =
                                split[0][0] + split[split.length - 1][0];
                            return {
                                _id: message.message_id,
                                text: message.message,
                                user: {
                                    _id: message.sender.id,
                                    name: message.sender.name,
                                    avatar: () => (
                                        <UserAvatar
                                            link={message.sender.avatar}
                                            title={title}
                                            id={partnerId}
                                            marginRight={0}
                                        ></UserAvatar>
                                    ),
                                },
                                createdAt: new Date(
                                    new Date(message.created_at).getTime() +
                                        7 * 3600 * 1000
                                ),
                            };
                        })
                    );
                })
                .catch((err) => setUnhandledError(err));
            getProfileLocal().then((profile) => {
                setProfile(profile);
                console.log('nhan dc r', profile);
                stompClient?.subscribe(
                    `/user/${profile?.id}/inbox`,
                    function (message) {
                        console.log('nhan dc r', profile);
                        const msg = JSON.parse(message.body);
                        const name = msg.sender.name;
                        const split = name.split(' ');
                        const title = split[0][0] + split[split.length - 1][0];
                        const convertMessage = {
                            _id: msg.id,
                            text: msg.content,
                            user: {
                                _id: msg.sender.id,
                                name: msg.sender.name,
                                avatar: () => (
                                    <UserAvatar
                                        link={msg.sender.avatar}
                                        title={title}
                                        id={partnerId}
                                        marginRight={0}
                                    ></UserAvatar>
                                ),
                            },
                            createdAt: new Date(
                                new Date(msg.created_at).getTime() +
                                    7 * 3600 * 1000
                            ),
                            sent: true,
                        };
                        setMessages((previousMessages) =>
                            GiftedChat.append(previousMessages, [
                                convertMessage,
                            ])
                        );
                    },
                    { id: `sub-in-chat-details-${partnerId}` }
                );
            });
            return () =>
                stompClient?.unsubscribe(`sub-in-chat-details-${partnerId}`);
        }, [])
    );
    const onSend = useCallback(async (messages: any[] = []) => {
        const token = await getTokenLocal();
        console.log(token);
        for (const content of messages) {
            // console.log('>>>>', content);
            const message = {
                receiver: { id: partnerId },
                content: content.text,
                sender: profile?.email,
                token,
            };
            stompClient?.send('/chat/message', {}, JSON.stringify(message));
        }
    }, []);
    return (
        <GiftedChat
            keyboardShouldPersistTaps={'never'}
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
                _id: Number(profile?.id as string),
            }}
            loadEarlier={isShowEarlyLoad}
            infiniteScroll={true}
            onLoadEarlier={() => {
                getConversationDetails(
                    { partnerId, conversationId },
                    index + count,
                    count
                )
                    .then((response) => {
                        const messages = response.data.conversation;
                        if (messages.length < count) setIsShowEarlyLoad(false);
                        setMessages((prev) =>
                            GiftedChat.prepend(
                                prev,
                                messages.map((message) => {
                                    const name = message.sender.name;
                                    const split = name.split(' ');
                                    const title =
                                        split[0][0] +
                                        split[split.length - 1][0];
                                    return {
                                        _id: message.message_id,
                                        text: message.message,
                                        user: {
                                            _id: message.sender.id,
                                            name: message.sender.name,
                                            avatar: () => (
                                                <UserAvatar
                                                    link={message.sender.avatar}
                                                    title={title}
                                                    id={partnerId}
                                                    marginRight={0}
                                                ></UserAvatar>
                                            ),
                                        },
                                        createdAt: new Date(
                                            new Date(
                                                message.created_at
                                            ).getTime() +
                                                7 * 3600 * 1000
                                        ),
                                    };
                                })
                            )
                        );
                    })
                    .catch((err) => setUnhandledError(err));
                setIndex((prev) => prev + count);
            }}
        />
        // </ScrollView >
    );
}
