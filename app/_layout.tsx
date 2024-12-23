import { ErrorProvider } from '@/utils/ctx';
import { SocketProvider } from '@/utils/socket.ctx';
import { Slot, Stack } from 'expo-router';
import { NotificationProvider } from '@/context/NotificationContext';
import { UnreadCountProvider } from '@/context/UnreadCountContext';
// import { TextEncoder } from 'text-encoding';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { NetworkProvider } from '@/context/NetworkContext';
// import { LogBox } from 'react-native';

// LogBox.ignoreAllLogs();
// global.TextEncoder = TextEncoder;

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask(
    BACKGROUND_NOTIFICATION_TASK,
    ({ data, error, executionInfo }): Promise<any> => {
        console.log('✅ Received a notification in the background!', {
            data,
            error,
            executionInfo,
        });
        return Promise.resolve('Completed to handle notification');
    }
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

export default function Root() {
    // Set up the auth context and render our layout inside of it.
    return (
        <NotificationProvider>
            <UnreadCountProvider>
                <ErrorProvider>
                    <SocketProvider>
                        <NetworkProvider>
                            <Stack screenOptions={{ headerShown: false }}>
                                <Slot />
                            </Stack>
                        </NetworkProvider>
                    </SocketProvider>
                </ErrorProvider>
            </UnreadCountProvider>
        </NotificationProvider>
    );
}
