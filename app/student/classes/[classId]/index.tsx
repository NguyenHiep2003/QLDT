import { Link, Redirect, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Button, Text, View } from 'react-native';

export default function Index() {
    const {classId} = useLocalSearchParams()
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text>Display class information and service for student</Text>
            <Link href={`/student/classes/${classId}/assignments`}>Press here to go to assignments tab</Link>
            <Link href={`/student/classes/${classId}/documents`}>Press here to go to documents tab</Link>

        </View>
    );
}
