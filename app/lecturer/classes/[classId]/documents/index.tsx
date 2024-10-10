import { Link, Redirect, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Button, Text, View } from 'react-native';

export default function ViewDocumentScreen() {
    const {classId} = useLocalSearchParams();
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text>Display list of documents</Text>
            {/* <Link href={`/student/classes/${classId}/assignments/${assignmentId}`}>Go to specific assignment</Link> */}
        </View>
    );
}
