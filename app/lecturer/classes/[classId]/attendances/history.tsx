import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useRef, useState } from 'react';
import {
    Text,
    View,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Button,
    TouchableOpacity,
    Image,
    FlatList,
    Animated,
} from 'react-native';
import { Divider } from './index';
import { router, useLocalSearchParams } from 'expo-router';
import {
    getAttendanceList,
    getClassInfo,
} from '../../../../../services/api-calls/classes';
import { getProfileLocal } from '@/services/storages/profile';
import { getTokenLocal } from '@/services/storages/token';

const Item: React.FC<{ name: any; MSSV: any; status: any; index: any }> = ({
    name,
    MSSV,
    status,
    index,
}) => (
    <View>
        <View style={styles.containerItem}>
            <View style={styles.item}>
                <Text style={styles.index}>{index + 1}.</Text>
                <View>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={{ color: '#7f8c8d' }}> {MSSV} </Text>
                    {/* <Text style= {{marginTop: 4}}> Vắng: 0 | Vắng CP: 0 </Text>  */}
                </View>
            </View>

            <View>
                {status == 'PRESENT' && (
                    <Text style={{ color: '#007BFF', fontSize: 16 }}>
                        Có mặt
                    </Text>
                )}
                {status == 'UNEXCUSED_ABSENCE' && (
                    <Text style={{ color: '#ff4141', fontSize: 16 }}>Vắng</Text>
                )}
            </View>
        </View>

        <Divider />
    </View>
);

export default function ViewAttendanceHistoryScreen() {
    const [date, setDate] = useState<Date>(new Date(Date.now()));
    const [show, setShow] = useState(false);
    const [showRecord, setShowRecord] = useState(false);
    const [showErr, setShowErr] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [err, setErr] = useState('');

    const { classId } = useLocalSearchParams();

    const handleLookup = async () => {
        setIsLoading(true);
        setShowErr(false);
        setShowRecord(false);
        const dateLookup = getLocalDateString(date);
        try {
            const attendanceRecord = await getAttendanceList(
                classId,
                dateLookup
            );
            const response = await getClassInfo({ class_id: classId as string });
            response.data.student_accounts = response.data.student_accounts.map(
                (student: any) => {
                    const attendance =
                        attendanceRecord.attendance_student_details.find(
                            (att: any) => att.student_id === student.student_id
                        );
                    return {
                        ...student,
                        status: attendance ? attendance.status : null,
                    };
                }
            );

            setData(response.data.student_accounts);
            setIsLoading(false);
            setShowRecord(true);
        } catch (error: any) {
            if (error.rawError) {
                // Yêu cầu đã được gửi và máy chủ đã phản hồi với mã trạng thái khác 2xx
                const errorCode = error.rawError.meta.code;
                if (errorCode == 9994)
                    setErr(
                        `Không có lịch sử điểm danh\nvào ngày ${date.toLocaleDateString('vi-VN')}!`
                    );
                else if (errorCode == 1004)
                    setErr(`Thời gian tra cứu\nkhông thuộc thời gian mở lớp!`);
                setIsLoading(false);
                setShowErr(true);
            } else if (error.request) {
                // Yêu cầu đã được gửi nhưng không nhận được phản hồi
                setErr('Máy chủ không phản hồi!');
                setIsLoading(false);
                setShowErr(true);
            } else {
                // Có lỗi xảy ra khi thiết lập yêu cầu
                console.error('Error:', error.message);
                setErr('Hmm... Có gì đó không ổn đã xảy ra!');
                setIsLoading(false);
                setShowErr(true);
            }
        }
    };

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = () => {
        setShow(true);
    };

    const showDatepicker = () => {
        showMode();
    };

    const getLocalDateString = (utcDate: Date) => {
        const localDate = new Date(utcDate); // Tạo đối tượng Date từ UTC

        // Lấy năm, tháng, ngày
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const day = String(localDate.getDate()).padStart(2, '0');

        // Trả về chuỗi theo định dạng yyyy-mm-dd
        return `${year}-${month}-${day}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <TouchableOpacity
                    onPress={showDatepicker}
                    style={{
                        borderRadius: 8,
                        marginVertical: 10,
                        marginRight: 20,
                        backgroundColor: 'white',
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ marginRight: 20 }}>
                        <Text style={{ color: '#bdc3c7' }}> Ngày tra cứu</Text>
                        <Text style={{ marginTop: 3, fontWeight: 'bold' }}>
                            {' '}
                            {date == null
                                ? 'Chọn ngày tra cứu'
                                :date.toLocaleDateString('vi-VN')}{' '}
                        </Text>
                    </View>
                    <Image source={require('@assets/images/calendar.png')} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        backgroundColor: '#007bff',
                        padding: 10,
                        justifyContent: 'center',
                        borderRadius: 8,
                        // marginHorizontal: '40%',
                        alignItems: 'center',
                    }}
                    onPress={handleLookup}
                >
                    <Text style={{ color: 'white' }}>Tra cứu</Text>
                </TouchableOpacity>
            </View>

            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date == null ? new Date(Date.now()) : date}
                    mode={'date'}
                    maximumDate={new Date(Date.now())}
                    // TODO: giới hạn dưới bằng ngày bắt đầu lớp học
                    onChange={onChange}
                    timeZoneName={'Asia/Bangkok'}
                />
            )}

            {isLoading && (
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 10,
                    }}
                >
                    <Text style={{ fontSize: 18, textAlign: 'center' }}>
                        Đang tra cứu...
                    </Text>
                </View>
            )}

            {showRecord && (
                <FlatList
                    style={{ backgroundColor: 'white', marginTop: 10 }}
                    data={data}
                    renderItem={({ item, index }) => (
                        <Item
                            name={`${item.first_name} ${item.last_name}`}
                            MSSV={item.student_id}
                            status={item.status}
                            index={index}
                        />
                    )}
                    keyExtractor={(item) => item.student_id.toString()}
                />
            )}

            {showErr && (
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 10,
                    }}
                >
                    <Text style={{ fontSize: 18, textAlign: 'center' }}>
                        {err}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
        backgroundColor: '#f2f2f2',
    },
    containerItem: {
        flex: 1,
        flexDirection: 'row', // Thiết lập hướng bố trí theo hàng
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    item: {
        flexDirection: 'row',
    },
    index: {
        fontSize: 16,
        marginEnd: 2,
    },
    name: {
        fontSize: 16,
    },
});
