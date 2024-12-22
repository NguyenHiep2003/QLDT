import {
    useContext,
    createContext,
    type PropsWithChildren,
    useState,
} from 'react';
import { CompatClient } from '@stomp/stompjs';
import { connectSocket } from '@/services/sockets/connection';

export const SocketContext = createContext<{
    stompClient: CompatClient | undefined;
    setStompClient: (setStompClient: CompatClient) => void;
}>({ stompClient: undefined, setStompClient: (stompClient) => null });

// This hook can be used to access the user info.
export function useSocketContext() {
    const value = useContext(SocketContext);
    if (!value.stompClient) {
        const stompClient = connectSocket();
        value.stompClient = stompClient;
    }
    return value;
}

export function SocketProvider({ children }: PropsWithChildren) {
    const [stompClient, setStompClient] = useState<undefined | CompatClient>(
        undefined
    );
    return (
        <SocketContext.Provider value={{ stompClient, setStompClient }}>
            {children}
        </SocketContext.Provider>
    );
}
