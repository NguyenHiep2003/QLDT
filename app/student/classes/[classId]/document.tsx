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
            <Text>Document Tab</Text>
            <Link href={'/student'}>Press here</Link>
        </View>
    );
}
