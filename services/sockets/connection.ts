import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { TextEncoder } from 'text-encoding';
global.TextEncoder = TextEncoder;
export function connectSocket() {
    const stompClient = Stomp.over(
        () => new SockJS(`${process.env.EXPO_PUBLIC_API_URL}/ws`)
    );
    // stompClient.forceBinaryWSFrames = true;
    // stompClient.appendMissingNULLonIncoming = true;
    stompClient.connect({}, function (frame: any) {
        console.log('Connected: ' + frame);
    });
    return stompClient;
}
