import { Link, Redirect } from 'expo-router';
import { useState } from 'react';
import { Button, Text, View } from 'react-native';

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text>Edit app/index.tsx to edit this screen. Hiệp mo</Text>
            <Link href={"/student"}>Press here to go to student tab</Link>
            <Link href={"/lecturer"}>Press here to go to lecturer tab</Link>

        </View>
    );
}
