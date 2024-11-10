import { ServiceCard } from '@/components/ServiceCard';
import { getClassInfo } from '@/services/api-calls/classes';
import { ClassInfo } from '@/types/generalClassInfor';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function StudentClassDetail() {
    const servicesCardConfig = [
        { name: 'description', title: 'Tài liệu' },
        { name: 'assignment', title: 'Bài tập' },
        { name: 'sick', title: 'Nghỉ học' },
    ];
    const classStatusMap = {
        ACTIVE: 'Đang diễn ra',
        COMPLETED: 'Đã hoàn thành',
        UPCOMING: 'Mở đăng ký',
    };
    const { classId } = useLocalSearchParams();
    const [classInfo, setClassInfo] = useState<ClassInfo | undefined>(
        undefined
    );
    const [isShowStudentList, setIsShowStudentList] = useState(false);
    useEffect(() => {
        getClassInfo({ class_id: classId as string })
            .then((response) => setClassInfo(response.data))
            .catch((err) => console.log(err));
    }, []);
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}
                >
                    <View style={styles.classInfo}>
                        <Text style={styles.title}>
                            {classInfo?.class_name}
                        </Text>
                        <Text style={styles.text}>
                            Mã lớp: {classInfo?.class_id}
                        </Text>
                        <Text style={styles.text}>
                            Loại hình: {classInfo?.class_type}
                        </Text>
                        <Text style={styles.text}>
                            Giảng viên: {classInfo?.lecturer_name}
                        </Text>
                        <Text style={styles.text}>
                            Số sinh viên:{' '}
                            <Text
                                onPress={() => setIsShowStudentList(true)}
                                style={{
                                    textDecorationLine: 'underline',
                                    fontStyle: 'italic',
                                    color: 'blue',
                                }}
                            >
                                {classInfo?.student_count}
                            </Text>
                        </Text>
                        <Text style={styles.text}>
                            Ngày bắt đầu: {classInfo?.start_date}
                        </Text>
                        <Text style={styles.text}>
                            Ngày kết thúc: {classInfo?.end_date}
                        </Text>
                        <Text style={styles.text}>
                            Trạng thái:{' '}
                            {classInfo?.status
                                ? classStatusMap[`${classInfo?.status}`]
                                : undefined}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between', // Chia đều khoảng cách giữa các box
                            alignItems: 'center',
                        }}
                    >
                        {servicesCardConfig.map((val) => (
                            <View style={{ flex: 1 }}>
                                <ServiceCard
                                    title={val.title}
                                    name={val.name}
                                ></ServiceCard>
                            </View>
                        ))}
                    </View>
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
        marginHorizontal: 10,
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
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 7,
    },
    gridView: {
        marginTop: 10,
        flex: 1,
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 5,
        padding: 10,
        height: 150,
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
});
