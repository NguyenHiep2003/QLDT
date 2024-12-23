import { ConversationDetail } from '@/common/conversationDetail';
import OfflineStatusBar from '@/components/OfflineBar';
import { UserAvatar } from '@/components/UserAvatar';
import { getProfile } from '@/services/api-calls/profile';
import { TProfile } from '@/types/profile';
import { useErrorContext } from '@/utils/ctx';
import { getTitleFromName } from '@/utils/getAvatarTitle';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import React from 'react';

export default function LecturerConversationDetailScreen() {
    const { setUnhandledError } = useErrorContext();
    const [partnerProfile, setPartnerProfile] = useState<TProfile>();
    const { partnerId, conversationId } = useLocalSearchParams();
    useEffect(() => {
        getProfile(partnerId as string)
            .then((profile) => {
                setPartnerProfile(profile);
            })
            .catch((err) => setUnhandledError(err));
    }, []);
    return (
        <>
            <Stack.Screen
                options={
                    partnerProfile
                        ? {
                              title: `${partnerProfile.name}`,
                              headerBackVisible: true,
                              headerLeft: () => (
                                  <UserAvatar
                                      link={partnerProfile.avatar}
                                      title={getTitleFromName(
                                          partnerProfile.name
                                      )}
                                      id={partnerId as string}
                                  ></UserAvatar>
                              ),
                          }
                        : undefined
                }
            ></Stack.Screen>
            <OfflineStatusBar></OfflineStatusBar>
            <ConversationDetail
                partnerId={partnerId as string}
                conversationId={conversationId as string}
            ></ConversationDetail>
        </>
    );
}
