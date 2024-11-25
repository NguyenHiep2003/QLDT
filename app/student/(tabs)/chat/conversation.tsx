import { ConversationDetail } from '@/common/conversationDetail';
import { UserAvatar } from '@/components/UserAvatar';
import { getProfile } from '@/services/api-calls/profile';
import { TProfile } from '@/types/profile';
import { convertDriveUrl } from '@/utils/convertDriveUrl';
import { useErrorContext } from '@/utils/ctx';
import { getColor } from '@/utils/getColor';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';


export default function StudentConversationDetailScreen() {
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
                              title: `${
                                  partnerProfile.ho + ' ' + partnerProfile.ten
                              }`,
                              headerBackVisible: true,
                              headerLeft: () => (
                                  <UserAvatar
                                      link={partnerProfile.avatar}
                                      title={
                                          partnerProfile.ho[0] +
                                          partnerProfile.ten[0]
                                      }
                                      id={partnerId as string}
                                  ></UserAvatar>
                              ),
                          }
                        : undefined
                }
            ></Stack.Screen>
            <ConversationDetail
                partnerId={partnerId as string}
                conversationId={conversationId as string}
            ></ConversationDetail>
        </>
    );
}
