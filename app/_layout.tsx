import { ErrorProvider } from '@/utils/ctx';
import { SocketProvider } from '@/utils/socket.ctx';
import { Slot } from 'expo-router';
// import { TextEncoder } from 'text-encoding';

// global.TextEncoder = TextEncoder;

export default function Root() {
    // Set up the auth context and render our layout inside of it.
    return (
        <ErrorProvider>
            <SocketProvider>
                <Slot />
            </SocketProvider>
        </ErrorProvider>
    );
}
