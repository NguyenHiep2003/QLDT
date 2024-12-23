import {
    useContext,
    createContext,
    type PropsWithChildren,
    useState,
    useEffect,
} from 'react';
import * as NetInfo from '@react-native-community/netinfo';

export const NetworkContext = createContext<{
    disconnect: boolean;
    setDisconnect: (state: boolean) => void;
}>({ disconnect: false, setDisconnect: (disconnect) => null });

// This hook can be used to access the user info.
export function useNetworkContext() {
    const value = useContext(NetworkContext);
    return value;
}

export function NetworkProvider({ children }: PropsWithChildren) {
    const [disconnect, setDisconnect] = useState<boolean>(false);
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setDisconnect(!state.isInternetReachable);
        });

        return () => unsubscribe();
    }, []);
    return (
        <NetworkContext.Provider value={{ disconnect, setDisconnect }}>
            {children}
        </NetworkContext.Provider>
    );
}
