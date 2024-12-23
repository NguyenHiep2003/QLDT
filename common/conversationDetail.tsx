import { UserAvatar } from '@/components/UserAvatar';
import {
    deleteMessage,
    getConversationDetails,
} from '@/services/api-calls/chat';
import { getProfileLocal } from '@/services/storages/profile';
import { getTokenLocal } from '@/services/storages/token';
import { TProfile } from '@/types/profile';
import { useErrorContext } from '@/utils/ctx';
import { useSocketContext } from '@/utils/socket.ctx';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import {
    Actions,
    ActionsProps,
    Bubble,
    Composer,
    ComposerProps,
    GiftedChat,
    IMessage,
    Message,
    MessageContainer,
    MessageProps,
    Send,
    SendProps,
} from 'react-native-gifted-chat';
import * as Clipboard from 'expo-clipboard';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    FlatList,
} from 'react-native';
import { Icon } from 'react-native-elements';

export function ConversationDetail({
    conversationId,
    partnerId,
}: {
    conversationId?: string;
    partnerId?: string;
}) {
    const [profile, setProfile] = useState<TProfile>();
    const [messages, setMessages] = useState<
        (IMessage & { deleted?: boolean })[]
    >([]);
    const { setUnhandledError } = useErrorContext();
    const { stompClient } = useSocketContext();
    const [index, setIndex] = useState(0);
    const [isShowEarlyLoad, setIsShowEarlyLoad] = useState(true);
    const count = 50;
    const chatRef = useRef<FlatList<IMessage> | null>(null);

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
                                            size={35}
                                        ></UserAvatar>
                                    ),
                                },
                                createdAt: new Date(message.created_at),
                                deleted: message.message ? false : true,
                                sent: true,
                            };
                        })
                    );
                })
                .catch((err) => setUnhandledError(err));
            getProfileLocal().then((profile) => {
                setProfile(profile);
                if (stompClient?.connected)
                    stompClient?.subscribe(
                        `/user/${profile?.id}/inbox`,
                        function (message) {
                            const msg = JSON.parse(message.body);
                            if (
                                (conversationId &&
                                    msg.conversation_id != conversationId) ||
                                (partnerId &&
                                    partnerId != msg.receiver?.id &&
                                    partnerId != msg.sender?.id)
                            )
                                return;
                            const name = msg.sender.name;
                            const split = name.split(' ');
                            const title =
                                split[0][0] + split[split.length - 1][0];
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
                                            size={35}
                                        ></UserAvatar>
                                    ),
                                },
                                createdAt: new Date(msg.created_at),
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
                if (stompClient?.connected)
                    stompClient?.subscribe(
                        `/user/${profile?.id}/inbox/delete`,
                        function (message) {
                            const msg = JSON.parse(message.body);
                            const id = msg.message_id;
                            if (
                                (conversationId &&
                                    msg.conversation_id != conversationId) ||
                                (partnerId &&
                                    partnerId != msg.receiver?.id &&
                                    partnerId != msg.sender?.id)
                            )
                                return;
                            setMessages((previousMessages) =>
                                previousMessages.map((message) => {
                                    if (message._id == id)
                                        message.deleted = true;
                                    return message;
                                })
                            );
                        },
                        { id: `sub-delete-in-chat-details-${partnerId}` }
                    );
            });
            return () => {
                if (stompClient?.connected)
                    stompClient?.unsubscribe(
                        `sub-delete-in-chat-details-${partnerId}`
                    );

                if (stompClient?.connected)
                    stompClient?.unsubscribe(
                        `sub-in-chat-details-${partnerId}`
                    );
            };
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
            if (stompClient?.connected)
                stompClient?.send('/chat/message', {}, JSON.stringify(message));
            chatRef.current?.scrollToOffset({
                offset: 0,
                animated: true,
            });
        }
    }, []);
    const onLongPress = (
        context: any,
        message: IMessage & { deleted: boolean }
    ) => {
        if (message.deleted) return;
        const options =
            message.user._id == profile?.id
                ? ['Copy', 'Delete Message', 'Cancel']
                : ['Copy', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            (buttonIndex: number) => {
                switch (buttonIndex) {
                    case 0:
                        Clipboard.setStringAsync(message.text);
                        break;
                    case 1:
                        if (options.length == 3)
                            deleteMessage(
                                { partnerId, conversationId },
                                message._id
                            )
                                .then(() => {
                                    message.deleted = true;
                                    setMessages((prev) =>
                                        GiftedChat.append([], prev)
                                    );
                                })
                                .catch((err) => {
                                    setUnhandledError(err);
                                });
                        break;
                }
            }
        );
    };
    const renderSend = useCallback((props: SendProps<IMessage>) => {
        return (
            <Send
                {...props}
                containerStyle={{
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                }}
            >
                <MaterialIcons size={30} color={'#4287f5'} name={'send'} />
            </Send>
        );
    }, []);
    const renderActions = (props: ActionsProps) => (
        <Actions
            {...props}
            containerStyle={styles.actionsContainer}
            icon={() => (
                <Ionicons name="image-outline" size={24} color="gray" />
            )}
            onPressActionButton={async () =>
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    // allowsEditing: true,
                    quality: 1,
                })
            } // Custom pick image action
        />
    );
    // const render = useCallback((props: ComposerProps) => {
    //     return (
    //         <View style={{ flexDirection: 'row', paddingLeft: 5 }}>
    //             <Ionicons
    //                 style={{ marginTop: 5 }}
    //                 name="image-outline"
    //                 size={30}
    //                 onPress={async () =>
    //                     await ImagePicker.launchImageLibraryAsync({
    //                         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //                         // allowsEditing: true,
    //                         quality: 1,
    //                     })
    //                 }
    //             ></Ionicons>
    //             <Composer {...props} />
    //         </View>
    //     );
    // }, []);
    const renderBubble = (
        props: Bubble<IMessage & { deleted: boolean }>['props']
    ) => {
        // Customizing bubble based on user
        // const isCurrentUser = props.currentMessage.user._id == profile?.id;
        const isDeleted = props.currentMessage.deleted ? true : false;
        if (isDeleted) {
            props.currentMessage.text = 'Tin nhắn đã bị xóa';
            // props.currentMessage.createdAt = 0;
            // props.renderTime :
        }
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: isDeleted ? 'white' : '#4d4a49', // Customize for received messages
                        borderBlockColor: 'black',
                        borderWidth: isDeleted ? 1 : 0, // Customize for received messages
                        // backgroundColor: isCurrentUser ? '#4287f5' : 'white', // Customize for received messages
                    },
                    right: {
                        backgroundColor: isDeleted ? 'white' : '#4287f5', // Customize for received messages
                        borderBlockColor: 'black',
                        borderWidth: isDeleted ? 1 : 0, // Customize for received messages

                        // backgroundColor: isCurrentUser ? 'blue' : 'blue', // Customize for sent messages
                    },
                }}
                textStyle={{
                    left: {
                        color: isDeleted ? '#333333' : '#ffffff',
                        fontStyle: isDeleted ? 'italic' : 'normal',
                        fontWeight: isDeleted ? '200' : 'black',
                        fontSize: isDeleted ? 15 : 17,
                    },
                    right: {
                        color: isDeleted ? '#333333' : '#ffffff',
                        fontStyle: isDeleted ? 'italic' : 'normal',
                        fontWeight: isDeleted ? '200' : 'black',
                        fontSize: isDeleted ? 15 : 17,
                    },
                }}
            />
        );
    };

    return (
        <GiftedChat
            messageContainerRef={chatRef}
            keyboardShouldPersistTaps={'never'}
            // shouldUpdateMessage={(props, nextProps) => {return props.currentMessage.text != nextProps.currentMessage.text} }
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
                _id: Number(profile?.id as string),
            }}
            loadEarlier={isShowEarlyLoad}
            renderBubble={renderBubble}
            infiniteScroll={true}
            onLongPress={onLongPress}
            renderActions={renderActions}
            renderSend={renderSend}
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
                                        createdAt: new Date(message.created_at),
                                        deleted: message.message ? false : true,
                                        sent: true,
                                    };
                                })
                            )
                        );
                    })
                    .catch((err) => setUnhandledError(err));
                setIndex((prev) => prev + count);
            }}
            shouldUpdateMessage={(
                props: Readonly<MessageProps<IMessage & { deleted: boolean }>>,
                nextProps: Readonly<
                    MessageProps<IMessage & { deleted: boolean }>
                >
            ) => {
                return props.currentMessage.deleted ==
                    nextProps.currentMessage.deleted
                    ? true
                    : false;
            }}
        />
    );
}
const styles = StyleSheet.create({
    messageContainer: {
        marginVertical: 5,
        marginHorizontal: 10,
        alignSelf: 'flex-start', // Adjust based on user
    },
    messageBubble: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    icon: {
        marginLeft: 8,
    },
    actionsContainer: {
        marginLeft: 5,
    },
});
