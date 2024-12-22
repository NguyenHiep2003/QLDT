import { ServiceCard } from '@/components/ServiceCard';
import { StudentInfo, StudentList } from '@/components/StudentList';
import { getClassInfo } from '@/services/api-calls/classes';
import { ClassInfo } from '@/types/generalClassInfor';
import { useErrorContext } from '@/utils/ctx';
import { Href, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { Dialog, Divider } from 'react-native-elements';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function StudentClassDetail() {
    const classStatusMap = {
        ACTIVE: 'Đang diễn ra',
        COMPLETED: 'Đã hoàn thành',
        UPCOMING: 'Mở đăng ký',
    };
    const { classId } = useLocalSearchParams();
    const [classInfo, setClassInfo] = useState<ClassInfo | undefined>(
        undefined
    );
    const [isLoading, setIsLoading] = useState(false);
    const { setUnhandledError } = useErrorContext();
    const servicesCardConfig = [
        {
            name: 'description',
            title: 'Tài liệu',
            link: `/student/classes/${classId}/documents` as Href<string>,
        },
        {
            name: 'assignment',
            title: 'Bài tập',
            link: `/student/classes/${classId}/assignments` as Href<string>,
        },
        {
            name: 'rule',
            title: 'Điểm danh',
            link: `/student/classes/${classId}/attendances` as Href<string>,
        },
    ];
    useEffect(() => {
        setIsLoading(true);
        getClassInfo({ class_id: classId as string })
            .then((response) => {
                setClassInfo(response.data);
            })
            .catch((err) => setUnhandledError(err))
            .finally(() => setIsLoading(false));
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
                    <Divider style={{ width: '95%', margin: 10 }} width={2}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            Dịch vụ
                        </Text>
                    </Divider>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                        }}
                    >
                        {servicesCardConfig.map((val) => (
                            <Pressable
                                style={{ width: '33%' }}
                                onPress={() => router.push(val.link)}
                                key={val.name}
                            >
                                <View style={{ width: '100%' }}>
                                    <ServiceCard
                                        title={val.title}
                                        name={val.name}
                                    ></ServiceCard>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                    <Divider
                        style={{ width: '95%', margin: 10, marginTop: 20 }}
                        width={2}
                    >
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            Danh sách sinh viên
                        </Text>
                    </Divider>
                    <View style={{ marginLeft: 10, marginTop: 10 }}>
                        {classInfo?.student_accounts.length == 0 ? (
                            <Text style={{ fontSize: 17, alignSelf: 'center' }}>
                                Không có sinh viên
                            </Text>
                        ) : (
                            classInfo?.student_accounts.map((val) => (
                                <StudentInfo
                                    key={val.account_id.toString()}
                                    info={val}
                                ></StudentInfo>
                            ))
                        )}
                    </View>
                </ScrollView>
                <Dialog isVisible={isLoading}>
                    <Dialog.Loading></Dialog.Loading>
                </Dialog>
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
