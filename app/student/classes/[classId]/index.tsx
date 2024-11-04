import { ClassInfo } from '@/types/generalClassInfor';
import { Link, Redirect, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    Button,
    StatusBar,
    Text,
    StyleSheet,
    ScrollView,
    View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
    const { classId } = useLocalSearchParams();
    const [classInfo, setClassInfo] = useState<ClassInfo | undefined>(
        undefined
    );
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.classInfo}>
                        <Text style={styles.title}>Thông tin lớp học</Text>
                        <Text style={styles.text}></Text>
                    </View>
                    <Text style={styles.text}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                    </Text>
                    <Text>
                        Display class information and service for student
                    </Text>
                    <Link href={`/student/classes/${classId}/assignments`}>
                        Press here to go to assignments tab
                    </Link>
                    <Link href={`/student/classes/${classId}/documents`}>
                        Press here to go to documents tab
                    </Link>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
    },
    scrollView: {
        backgroundColor: 'white',
    },
    classInfo: {
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 2,
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 19,
        padding: 12,
    },
});
