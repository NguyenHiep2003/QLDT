import { router } from 'expo-router';
import {
    SafeAreaView,
    View,
    FlatList,
    StyleSheet,
    Text,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { ClassInfo } from '@/types/generalClassInfor';
import { ClassCard } from '@/components/ClassCard';

const DATA: ClassInfo[] = [
    {
        classId: '156700',
        className: 'Phát triển ứng dụng đa nền tảng',
        courseId: 'IT3000',
        lecturer: 'Nguyễn Tiến Thành',
    },
    {
        classId: '156708',
        className: 'Phát triển ứng dụng đa nền tảng',
        courseId: 'IT3000',
        lecturer: 'Nguyễn Tiến Thành',
    },
    {
        classId: '156709',
        className: 'Phát triển ứng dụng đa nền tảng',
        courseId: 'IT3000',
        lecturer: 'Nguyễn Tiến Thành',
    },
    {
        classId: '156701',
        className: 'Phát triển ứng dụng đa nền tảng',
        courseId: 'IT3000',
        lecturer: 'Nguyễn Tiến Thành',
    },
    {
        classId: '156702',
        className: 'Phát triển ứng dụng đa nền tảng',
        courseId: 'IT3000',
        lecturer: 'Nguyễn Tiến Thành',
    },
    {
        classId: '156703',
        className: 'Phát triển ứng dụng đa nền tảng',
        courseId: 'IT3000',
        lecturer: 'Nguyễn Tiến Thành',
    },
    {
        classId: '156704',
        className: 'Kĩ thuật chiến ddausbooj binh và chiens thuâtt',
        courseId: 'IT3000',
        lecturer: 'Nguyễn Tiến Thành',
    },
];

export default function Index() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Danh sách lớp học</Text>
            <FlatList
                data={DATA}
                renderItem={({ item }) => (
                    <ClassCard
                        data={item}
                        onPress={() =>
                            router.push(`/student/classes/${item.classId}`)
                        }
                    />
                )}
                keyExtractor={(item) => item.classId}
            />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 16,
    },
    title: {
        marginLeft: 16,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
