import { Link, Redirect } from 'expo-router';
import { useState } from 'react';
import { Button, Text, View } from 'react-native';

export default function AssignmentInfo() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text>Display info of assignment</Text>
        </View>
    );
}
