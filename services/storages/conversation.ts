import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConversationData } from '../api-calls/chat';

export async function cacheConversation(data: ConversationData) {
    try {
        return await AsyncStorage.setItem(
            'conversations',
            JSON.stringify(data)
        );
    } catch (error) {
        console.log(
            '🚀 ~ file: conversation.ts:7 ~ cacheConversation ~ error:',
            error
        );
    }
}

export async function getConversationsCache(): Promise<
    undefined | ConversationData
> {
    try {
        const data = await AsyncStorage.getItem('conversations');
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.log(
            '🚀 ~ file: conversation.ts:22 ~ getConversationsCache ~ error:',
            error
        );
    }
}
