import { useNetworkContext } from '@/context/NetworkContext';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OfflineStatusBar = () => {
    const { disconnect } = useNetworkContext();
    if (!disconnect) return;
    return (
        <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>You are offline</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    offlineBanner: {
        backgroundColor: '#808080',
        padding: 8,
        width: '100%',
        // position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // For Android shadow
    },
    offlineText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default OfflineStatusBar;
