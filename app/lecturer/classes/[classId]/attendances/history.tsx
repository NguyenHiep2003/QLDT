import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Modal,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Divider } from './index';
import { useLocalSearchParams } from 'expo-router';
import {
    getAttendanceList,
    getClassInfo,
    getAttendanceDates
} from '@/services/api-calls/classes';
import { useErrorContext } from '@/utils/ctx';
import _ from 'lodash';
import { useFocusEffect } from '@react-navigation/native';

const Item: React.FC<{ name: any; MSSV: any; status: any; index: any }> = ({
    name,
    MSSV,
    status,
    index,
}) => (
    <View style={styles.containerItem}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
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
                {status == 'EXCUSED_ABSENCE' && (
                    <Text style={{ color: '#f6c500', fontSize: 16 }}>Vắng CP</Text>
                )}
            </View>
        </View>

        <Divider />
    </View>
);

const HistoryAttendanceCard: React.FC<{ date: any, search: (date: any) => void, selectedItem: any, onSelect: (date: any) => void }> = ({ date, search, selectedItem, onSelect }) => (
    <TouchableOpacity
        style={styles.historyAttendanceCard}
        onPress={() => {
            onSelect(date)
            search(date)
        }}
    >
        {(selectedItem !== date) && <Text style={{ color: '#007bff', fontSize: 16, textAlign: 'center' }}>{date.split('-').reverse().join('-')}</Text>}
        {(selectedItem == date) && <ActivityIndicator style={{ paddingHorizontal: 15 }} size="small" color="#007BFF" />}
    </TouchableOpacity>
)

export default function ViewAttendanceHistoryScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [date, setDate] = useState<Date>(new Date(Date.now()));
    const [show, setShow] = useState(false);
    const [dateLookUp, setDateLookUp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [historyAttendance, setHistoryAttendance] = useState<any[]>([])
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const { setUnhandledError } = useErrorContext();
    const [refreshing, setRefreshing] = React.useState(false);
    const [focused, setFocused] = useState(true)
    const { classId } = useLocalSearchParams();

    const attendanceDates = async () => {
        try {
            const res = await getAttendanceDates(classId)
            setHistoryAttendance(res)
        } catch (error: any) {
            setUnhandledError(error)
        } finally { setIsLoading(false) }
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await attendanceDates()
        setRefreshing(false);
    }

    useEffect(() => {
        if (focused) {
            setIsLoading(true)
            setFocused(false)
            attendanceDates()
        }
    }, [focused])

    useFocusEffect(
        React.useCallback(() => {
            setFocused(true)
            return () => {
                setFocused(false)
            };
        }, [])
    );

    const handleSelectItem = (dateSelected: any) => {
        setSelectedItem(dateSelected);
    }

    const handleLookup = async (dateLookup: any) => {
        setIsLoading(true)
        setDateLookUp(dateLookup)
        try {
            const attendanceRecord = await getAttendanceList(classId, dateLookup, null, null);
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
            setSelectedItem(null)
            setModalVisible(true)
        } catch (error: any) {
            if (error.rawError) {
                // Yêu cầu đã được gửi và máy chủ đã phản hồi với mã trạng thái khác 2xx
                const errorCode = error.rawError.meta.code;
                if (errorCode == "9994") {
                    // setErr( `Không có lịch sử điểm danh\nvào ngày ${dateLookup.split('-').reverse().join('-')}!` );
                    error.setTitle("Thông báo");
                    error.setContent(`Không có lịch sử điểm danh vào ngày ${dateLookup.split('-').reverse().join('-')}!`);
                    // setShowErr(true);
                    setIsLoading(false);
                    // return
                }
            }
            setUnhandledError(error);
            setSelectedItem(null)
            setIsLoading(false);
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
            {isLoading &&
                <View style={styles.overlay}></View>
            }
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
                                : date.toLocaleDateString('vi-VN')}{' '}
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
                    onPress={() => { handleLookup(getLocalDateString(date)) }}
                >
                    {(!isLoading || (isLoading && selectedItem)) && <Text style={{ color: 'white' }}>Tra cứu</Text>}
                    {isLoading && !selectedItem && <ActivityIndicator style={{ paddingHorizontal: 15 }} size="small" color="white" />}
                </TouchableOpacity>
            </View>

            <View
                style={{
                    flex: 1,
                    marginTop: 15,
                    paddingHorizontal: 10
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Lịch sử các ngày điểm danh</Text>
                <Divider />
                {_.isEmpty(historyAttendance) &&
                    <ScrollView
                        contentContainerStyle={{ flex: 1 }}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    >
                        <Text style={{ fontSize: 16, color: 'blue', alignSelf: 'center', marginTop: 20 }}>Lớp học chưa điểm danh buổi nào</Text>
                    </ScrollView>
                }
                {!_.isEmpty(historyAttendance) &&
                    <FlatList
                        style={{ marginTop: 10 }}
                        data={historyAttendance}
                        renderItem={({ item, index }) => (
                            <HistoryAttendanceCard
                                date={item}
                                search={handleLookup}
                                selectedItem={selectedItem}
                                onSelect={handleSelectItem}
                            />
                        )}
                        onRefresh={onRefresh}
                        refreshing={refreshing}
                        keyExtractor={(item, index) => index.toString()}
                    />
                }
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    // Alert.alert('Modal has been closed.')
                    setModalVisible(!modalVisible)
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView} >
                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 15, marginBottom: 10, alignSelf: 'center' }}>
                            BẢN GHI ĐIỂM DANH NGÀY {dateLookUp.split('-').reverse().join('-')}
                        </Text>
                        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                            {data.map((item, index) => (
                                <Item
                                    name={`${item.first_name} ${item.last_name}`}
                                    MSSV={item.student_id}
                                    status={item.status}
                                    index={index}
                                    key={index}
                                />
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                marginHorizontal: '30%',
                                marginVertical: 5,
                                backgroundColor: '#007bff',
                                borderRadius: 20
                            }}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', alignSelf: 'center' }}>OKE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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
        width: '90%'
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
    centeredView: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: '29%',
        backgroundColor: 'rgba(128, 128, 128, 0.8)'
    },
    modalView: {
        marginTop: '11%',
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '95%',
        height: '85%'
        // marginBottom: '15%'
    },
    historyAttendanceCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal: '5%'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0)', // Màu xám với độ trong suốt
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, // Đảm bảo lớp phủ nằm trên các thành phần khác
    }
});
