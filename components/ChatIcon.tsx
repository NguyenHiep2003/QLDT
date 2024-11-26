// import {
//     Conversation,
//     ConversationData,
//     getConversation,
// } from '@/services/api-calls/chat';
// import { getProfileLocal } from '@/services/storages/profile';
// import { TProfile } from '@/types/profile';
// import { useErrorContext } from '@/utils/ctx';
// import { useSocketContext } from '@/utils/socket.ctx';
// import { FontAwesome } from '@expo/vector-icons';
// import { useEffect, useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { Icon } from 'react-native-elements';

// export function ChatIcon({ color }: { color: string }) {
//     const { stompClient } = useSocketContext();
//     const [numNewMessage, setNumNewMessage] = useState<string>('0');
//     const { setUnhandledError } = useErrorContext();
//     const [profile, setProfile] = useState<TProfile>();
//     useEffect(() => {
//         getConversation(0, 20)
//             .then((data) => {
//                 console.log(data.data.conversations);

//                 setNumNewMessage(data.data.num_new_message);
//             })
//             .catch((err) => setUnhandledError(err));
//         getProfileLocal().then((profile) => {
//             setProfile(profile);
//             stompClient?.subscribe(
//                 `/user/${profile?.id}/inbox`,
//                 function (message) {
//                     getConversation(0, 20)
//                         .then((data) => {
//                             console.log(data.data.conversations);

//                             setNumNewMessage(data.data.num_new_message);
//                         })
//                         .catch((err) => setUnhandledError(err));
//                 },
//                 { id: `sub-in-home` }
//             );
//         });
//         return () => stompClient?.unsubscribe('sub-in-home')
//     }, []);
//     return (
//         <View style={styles.container}>
//             {/* Chat Icon */}
//             <FontAwesome size={28} name="wechat" color={color} />

//             {/* Red Dot Badge */}
//             {numNewMessage != '0' && (
//                 <View style={styles.badge}>
//                     {/* <Text style={styles.badgeText}>{badgeCount}</Text> */}
//                 </View>
//             )}
//         </View>
//     );
// }
// const styles = StyleSheet.create({
//     container: {
//         width: 40,
//         height: 40,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     badge: {
//         position: 'absolute',
//         top: 4,
//         right: 2,
//         backgroundColor: 'red',
//         borderRadius: 10,
//         height: 10,
//         minWidth: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingHorizontal: 5,
//     },
//     badgeText: {
//         color: 'white',
//         fontSize: 12,
//         fontWeight: 'bold',
//     },
// });
