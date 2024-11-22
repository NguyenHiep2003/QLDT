import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { TextEncoder } from 'text-encoding';
global.TextEncoder = TextEncoder;

export function connectSocket(id: string) {
    const stompClient = Stomp.over(
        () => new SockJS(`${process.env.EXPO_PUBLIC_API_URL}/ws`)
    );
    // stompClient.forceBinaryWSFrames = true;
    // stompClient.appendMissingNULLonIncoming = true;
    stompClient.connect({}, function (frame: any) {
        console.log('Connected: ' + frame);
        const subscription = stompClient.subscribe(
            `/user/${id}/inbox`,
            function (message) {
                const msg = JSON.parse(message.body);
                console.log('Received message from inbox:', msg);
            }
        );
        console.log(">>>>>>>>",subscription.id)
        stompClient.onDisconnect = () => subscription.unsubscribe();
    });
    return stompClient;
}
// getTokenLocal().then((token) => {
//     const message = {
//         receiver: { id: 74 },
//         content: 'Hello',
//         sender: 'student@hust.edu.vn', // Send the email as sender
//         token: token, // Include the token in the message
//     };
//     console.log('Sending message:', message);
//     stompClient?.send('/chat/message', {}, JSON.stringify(message));
// });