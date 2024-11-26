import { getTokenLocal } from '../storages/token';
import instance from './axios';
export type Conversation = {
    id: string;
    partner: {
        id: string;
        name: string;
        avatar: string;
    };
    last_message: {
        sender: {
            id: string;
            name: string;
            avatar: string;
        };
        message: string;
        created_at: string;
        unread: number;
    };
};
export type ConversationData = {
    data: {
        conversations: Conversation[];
        num_new_message: string;
    };
};

export async function getConversation(
    index = 0,
    count = 1
): Promise<ConversationData> {
    return await instance.post('/it5023e/get_list_conversation', {
        index,
        count,
    });
}

export type TMessage = {
    message_id: string;
    message: string;
    sender: {
        id: string;
        name: string;
        avatar: string;
    };
    created_at: string;
    unread: number;
};

export type GetConversationDetailsResponse = {
    data: {
        conversation: TMessage[];
        is_blocked: 'false';
    };
};
export async function getConversationDetails(
    {
        partnerId,
        conversationId,
    }: {
        partnerId?: string;
        conversationId?: string;
    },
    index = 0,
    count = 15
): Promise<GetConversationDetailsResponse> {
    console.log(partnerId, conversationId);
    if (partnerId) {
        const response = await instance.post('/it5023e/get_conversation', {
            partner_id: partnerId,
            index,
            count,
            mark_as_read: true,
        });
        return response;
    } else {
        const response = await instance.post('/it5023e/get_conversation', {
            conversation_id: conversationId,
            index,
            count,
            mark_as_read: true,
        });
        return response;
    }
}

export async function deleteMessage(
    {
        partnerId,
        conversationId,
    }: {
        partnerId?: string;
        conversationId?: string;
    },
    messageId: string | number
): Promise<GetConversationDetailsResponse> {
    if (partnerId) {
        const response = await instance.post('/it5023e/delete_message', {
            partner_id: partnerId,
            message_id: messageId,
        });
        return response;
    } else {
        const response = await instance.post('/it5023e/delete_message', {
            conversation_id: conversationId,
            message_id: messageId,
        });
        return response;
    }
}