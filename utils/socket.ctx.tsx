import {
    useContext,
    createContext,
    type PropsWithChildren,
    useState,
} from 'react';
import { CompatClient } from '@stomp/stompjs';

export const SocketContext = createContext<{
    stompClient: CompatClient | undefined;
    setStompClient: (setStompClient: CompatClient) => void;
}>({ stompClient: undefined, setStompClient: (stompClient) => null });

// This hook can be used to access the user info.
export function useSocketContext() {
    const value = useContext(SocketContext);
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
