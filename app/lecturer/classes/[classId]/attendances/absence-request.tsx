import { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Linking,
    ActivityIndicator,
    Alert,
    ScrollView,
    RefreshControl
} from 'react-native';
import {reviewAbsenceRequest, getAttendanceList, getAbsenceRequests, setAttendanceStatus, getAttendanceDates} from '@/services/api-calls/classes'
import { useLocalSearchParams } from 'expo-router';
import {} from '@/services/api-calls/classes'
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { useErrorContext } from '@/utils/ctx';
import _ from 'lodash';
import {Divider} from './index'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import {getNotifications, getUnreadCount, markAsRead, sendNotification} from '@/services/api-calls/notification';
import OfflineStatusBar from '@/components/OfflineBar';

const RequestAbsenceCard: React.FC<{
    status: any,
    name: any,
    MSSV: any,
    account_id: any,
    title: any,
    reason: any,
    DateTime: any,
    id: any,
    selectedItemId: any,
    onSelect: (id: any) => void,
    fileUrl: any,
    whenReview: (id: any, studentId: any, account_id: any, status: any, dateTime: any) => void
}> = ({
    status,
    name,
    MSSV,
    account_id,
    title,
    reason,
    DateTime,
    id,
    selectedItemId,
    onSelect,
    fileUrl,
    whenReview
}) => (
    <TouchableOpacity style={[styles.requestAbsenceCard, {borderColor: status === 'PENDING'? '#f1c40f' : 'white'}]} onPress={() => onSelect(id)}>
        <View style={[styles.statusContainer, {backgroundColor: status === 'ACCEPTED'? '#e0f6f1' :(status === 'PENDING'? '#fdf6dc' : '#fee9e4')}]} >
            <Text style={[styles.statusText, {color: status === 'ACCEPTED'? '#0e8f70' :(status === 'PENDING'? '#f2b925' : '#fa572f')}]}>
                {status === 'ACCEPTED' ? 'Đã xác nhận' :
                (status === 'PENDING' ? 'Chờ phê duyệt' : 'Đã từ chối')}
            </Text>
        </View>
        <View>
            <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">Tên sinh viên: <Text style={{color: '#000'}}>{name}</Text></Text>
            <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">MSSV: <Text style={{color: '#000'}}>{MSSV}</Text></Text>
            <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">Ngày xin nghỉ: <Text style={{color: '#000'}}>{DateTime.split('-').reverse().join('-')}</Text></Text>
        </View>
        {(selectedItemId == id) && <View style={{}}>
            <View>
                {title && <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">Tiêu đề: <Text style={{color: '#000'}}>{title}</Text></Text>}
                <Text style={styles.cardTitle} >Lý do: <Text style={{color: '#000'}}>{reason}</Text></Text>
                
                {fileUrl && <>
                    <Text style={styles.cardTitle}>Minh chứng:</Text>
                    <TouchableOpacity
                        style={styles.itemProof}
                        onPress={() => Linking.openURL(fileUrl)}
                    >
                        <Image source={require('@assets/images/proofAbsence.png')}/>
                        <Text>  Minh chứng</Text>
                    </TouchableOpacity>
                </>}
            </View>
            {status == 'PENDING' &&<View style={styles.groupButtonReview}>
                <TouchableOpacity
                    style={styles.buttonReject}
                    onPress= {() => {
                        Alert.alert(
                            'Xác nhận từ chối !',
                            'Bạn chắc chắn từ chối đơn xin nghỉ?',
                            [
                              {
                                text: 'Cancel',
                                onPress: () => {},
                                style:'cancel'
                              },
                              {
                                text: 'OK',
                                onPress: () => {whenReview(id, MSSV, account_id, 'REJECTED', DateTime)}
                              },
                            ],
                            { cancelable: false }
                        )
                        }
                    }
                >
                    <Text style={{color: '#fa572f', fontWeight: 'bold', fontSize: 16}}>Từ chối</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonAprove}
                    onPress= {() => {
                        Alert.alert(
                            'Xác nhận đồng ý !',
                            'Bạn chắc chắn đồng ý đơn xin nghỉ?',
                            [
                              {
                                text: 'Cancel',
                                onPress: () => {},
                                style:'cancel'
                              },
                              {
                                text: 'OK',
                                onPress: () => {whenReview(id, MSSV, account_id, 'ACCEPTED', DateTime)}
                              },
                            ],
                            { cancelable: false }
                        )
                        }
                    }
                >
                    <Text style={{color: '#0e8f70', fontWeight: 'bold', fontSize: 16}}>Đồng ý</Text>
                </TouchableOpacity>
            </View>}
        </View>}
    </TouchableOpacity>
)

const StatusBar: React.FC<{ status: any, statusSelected: any, onselect: (status: any) => void }> = ({ status, statusSelected, onselect }) => (
    <TouchableOpacity onPress={() => onselect(status)}>
        <Text style={statusSelected == status ? styles.statusbarSeledted : styles.statusBar}>
            {(status == 'PENDING') ? 'Chờ phê duyệt'
                : (status == 'ACCEPTED') ? 'Đã xác nhận'
                : 'Đã từ chối'
            }
        </Text>
    </TouchableOpacity>
)

export default function AbsenceRequestScreen() {
    const [data, setData] = useState<any[]>([])
    const [isFocus, setIsFocus] = useState(false);
    const [focused, setFocused] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [requesting, setRequesting] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [date, setDate] = useState<Date | null>(null)
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [statusSelected, setStatusSelected] = useState<string | null>('PENDING')
    const [pageInfo, setPageInfo] = useState<any>({})
    const [page, setPage] = useState(0)
    const {setUnhandledError} = useErrorContext()
    const [refreshing, setRefreshing] = React.useState(false);

    const page_size = '10'
    const {classId, startDate, endDate, className } = useLocalSearchParams()
    const dataDropdown = [
        { label: 'Tất cả', value: 'null' },
        { label: 'Chờ phê duyệt', value: 'PENDING' },
        { label: 'Đã xác nhận', value: 'ACCEPTED' },
        { label: 'Đã từ chối', value: 'REJECTED' }
    ];

    const getData = async () => {
        setIsLoading(true)
        const dateFilter = date ? getLocalDateString(date) : null
        setPage(0)
        getAbsenceRequests(classId, '0', page_size, statusSelected, dateFilter)
            .then((response:any) => {
                setData(response.page_content)
                setPageInfo(response.page_info)
            })
            .catch((error: any) => {
                setUnhandledError(error)
            }) 
            .finally(() => {
                setIsLoading(false)
            })  
    }

    useEffect(() => {
        if(focused){
            console.log('reload...')
            setFocused(false)
            getData()
        }
    }, [focused])

    useFocusEffect(
        React.useCallback(() => {
            console.log("Absence Request Screen is focused");
            setFocused(true)

            // Optional: Refresh data or perform other actions when the screen is focused
            // const refreshData = async () => {
            //     // Your data refreshing logic here
            // };
            // refreshData();

            return () => {
                setFocused(false)
                console.log("Absence Request Screen is being left");
                // Optional: Cleanup or other actions when the screen is left
            };
        }, [])
    );

    const handleSelectItem = (id: any) => {
        setSelectedItemId(prevId => (prevId === id ? null : id)); // Nếu thẻ đang mở được chọn lại thì đóng, nếu chọn thẻ khác thì mở thẻ đó
    }

    const handleSelectStatus = async (status: any) => {
        if(status == 'null') status = null
        setStatusSelected((preStatus) => {
            if(preStatus != status) {
                const dateFilter = date ? getLocalDateString(date) : null
                handleChangeFilter(status, dateFilter)
            }
            return status
        })
        
    }

    const handleChangeFilter = async (status: any, dateFilter: any) => {
        setIsLoading(true)
        setPage(0)
        getAbsenceRequests(classId, '0', page_size, status, dateFilter)
            .then((response:any) => {
                setData(response.page_content)
                setPageInfo(response.page_info)
            })
            .catch((error: any) => {
                setUnhandledError(error)
            }) 
            .finally(() => {
                setIsLoading(false)
            })
    }

    const sendPushNotification = async (message: string, toUser: string, type: string) => {
        await sendNotification({ message, toUser, type})
    }

    const handleReviewAbsenceRequest = async (id: any,studentId: any, account_id: any, status: any, dateTime: any) => {
        setRequesting(true)
        try{
            const res = await reviewAbsenceRequest(id.toString(), status)
            if(statusSelected == 'PENDING') {
                setData((prevData) =>
                    prevData.filter((item) => item.id !== id) // Loại bỏ phần tử có id khớp
                );
            } else {
                setData((prevData) =>
                    prevData.map((item) =>
                        item.id === id ? { ...item, status } : item // Cập nhật trạng thái nếu ID khớp
                    )
                )
            }
            
            if(status == 'ACCEPTED'){ //gọi thêm API để ghi vào attendent record nếu có
                try{
                    const attendanceDates = await getAttendanceDates(classId)
                    const hasRecord = attendanceDates.find((date: any) => date == dateTime)
                    if(hasRecord) {
                        const attendanceRecord = await getAttendanceList(classId, dateTime, null, null)
                        const studentAbsence = attendanceRecord?.attendance_student_details.find((record: any) => record.student_id == studentId && record.status == 'UNEXCUSED_ABSENCE')
                        if(studentAbsence) await setAttendanceStatus('EXCUSED_ABSENCE', studentAbsence.attendance_id)
                    }
                } catch(error: any) {
                    const errorCode = error.rawError?.meta?.code;
                    if(errorCode == 9994) return
                    else if(errorCode == 1004){
                        error.setTitle("Cảnh báo !");
                        error.setContent("Thời gian sinh viên xin nghỉ không thuộc thời gian mở lớp!");
                        setUnhandledError(error)
                    } else {
                        error.setTitle("Lỗi đồng bộ !");
                        error.setContent("Đồng bộ xin nghỉ với bản ghi điểm danh thất bại!");
                        setUnhandledError(error)
                    }
                }
            }

            // send noti to student
            try{
                let message = ''
                let type = ''
                if(status == 'ACCEPTED') {
                    message = `Đơn xin nghỉ học ngày ${dateTime} lớp '${className}' đã được đồng ý`
                    type = 'ACCEPT_ABSENCE_REQUEST'
                }
                else {
                    message = `Đơn xin nghỉ học ngày ${dateTime} lớp '${className}' đã bị từ chối`
                    type = 'REJECT_ABSENCE_REQUEST'
                }
                await sendPushNotification(message, account_id, type)
            }catch(error: any){
                setUnhandledError(error)
            }
        } catch(error: any){
            setUnhandledError(error)
        } finally {
            setRequesting(false)
        }
        
    }

    const getLocalDateString = (utcDate: Date) => {
        const localDate = new Date(utcDate); // Tạo đối tượng Date từ UTC

        // Lấy năm, tháng, ngày
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const day = String(localDate.getDate()).padStart(2, '0');

        // Trả về chuỗi theo định dạng yyyy-mm-dd
        return `${year}-${month}-${day}`;
    };

    const onChangeDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setShowDatePicker(false);
        if(event.type == 'set') {
            setDate((preDate) => {
                if(preDate != selectedDate) handleChangeFilter(statusSelected, getLocalDateString(currentDate))
                return currentDate
            })
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await getData()
        setRefreshing(false);
    }

    // function delay(time: any) {
    //     return new Promise(resolve => setTimeout(resolve, time));
    // }

    const handleLoadMore = async () => {
        if (page < pageInfo.total_page - 1 && page == pageInfo.page) {
            const nextPage = page + 1;
            setPage(nextPage);
            setIsLoadingMore(true);
            // await delay(5000);
            try {
                const response = await getAbsenceRequests(classId, nextPage.toString(), page_size, statusSelected, date ? getLocalDateString(date) : null);
                setData(prevData => [...prevData, ...response.page_content]);
                setPageInfo(response.page_info);
            } catch (error: any) {
                setUnhandledError(error);
            } finally {
                setIsLoadingMore(false);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <OfflineStatusBar></OfflineStatusBar>
            {requesting && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#007BFF" />
                </View>
            )}

            <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 15, paddingBottom: 4, alignItems: 'center'}}>
                <View style={styles.container1}>
                    <Text style={[styles.label, isFocus && { color: 'blue' }]}> Trạng thái </Text>
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        data={dataDropdown}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        value={statusSelected ? statusSelected : 'null'}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={(item: any) => {
                            setIsFocus(false);
                            handleSelectStatus(item.value)
                        }}
                    />
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {date != null && <>
                    <Text style={[styles.label, isFocus && { color: 'blue' }]}> Ngày </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 12, borderWidth: 0.5, borderColor: 'gray', paddingLeft: 12, height: 50, borderRadius: 8}}>
                        <Text style={{ fontSize: 15}}>{date.toLocaleDateString('vi-VN')}</Text>
                        <TouchableOpacity 
                            onPress={() => {
                                setDate(null)
                                handleChangeFilter(statusSelected, null)
                            }}
                        >
                            <Text style={{fontSize: 16, paddingHorizontal: 12}}>X</Text>
                        </TouchableOpacity>
                    </View>
                    </>}
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Image
                            style={{width: 24, height: 24, alignSelf: 'flex-end'}}
                            source={require('@/assets/images/filter.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            
            {isLoading && !requesting && (
                <View style={{alignSelf: 'center',position: 'absolute', top: '40%'}}>
                    <ActivityIndicator size="large" color="#007BFF" />
                    <Text style={{fontSize: 18, marginBottom: '20%'}}>Đang tải</Text>
                </View>
            )}

            {!isLoading && !_.isEmpty(data) &&
                <FlatList
                    style={styles.flatList}
                    data={data}
                    renderItem={({item}) => 
                        <RequestAbsenceCard
                            status={item.status}
                            name={`${item.student_account.first_name} ${item.student_account.last_name}`}
                            MSSV={`${item.student_account.student_id}`}
                            account_id = {`${item.student_account.account_id}`}
                            title={item.title}
                            reason={item.reason}
                            DateTime={item.absence_date}
                            id={item.id}
                            selectedItemId={selectedItemId || ''}
                            onSelect={handleSelectItem}
                            fileUrl={item.file_url}
                            whenReview={handleReviewAbsenceRequest}/>
                    }
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                    keyExtractor={item => item.id}
                    onEndReached={handleLoadMore}
                    // onEndReachedThreshold={0.9}
                    ListFooterComponent={isLoadingMore ? <ActivityIndicator size="large" color="#007BFF" /> : null}
                    ListFooterComponentStyle={{marginBottom: '10%'}}
                />
            }

            {_.isEmpty(data) && !isLoading && !requesting &&
                <ScrollView 
                    contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                    refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }
                >
                    <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: '20%'}}>Không có dữ liệu!</Text>
                </ScrollView>
            }

            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date == null ? new Date(Date.now()) : date}
                    mode={'date'}
                    minimumDate={new Date(startDate.toString())}
                    maximumDate={new Date(endDate.toString())}
                    onChange={onChangeDate}
                    timeZoneName={'Asia/Bangkok'}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statusContainer: {
        alignSelf: 'flex-start',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
        marginBottom: 10
    },
    requestAbsenceCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal: 15,
        borderWidth: 1
    },
    flatList: {
        marginTop: 10
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu xám với độ trong suốt
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, // Đảm bảo lớp phủ nằm trên các thành phần khác
        height: '100%'
    },
    popup: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    content: {
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#f2b925',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    cardTitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    itemProof:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#f0dddd',
        borderColor: '#575555',
        borderWidth: 0.5,
        borderRadius: 3
    },
    groupButtonReview: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    buttonAprove: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#e0f6f1',
        borderRadius: 5
    },
    buttonReject: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#fee9e4',
        borderRadius: 5,
        marginEnd: 20
    },
    statusBar: {
        fontSize: 16,
        paddingBottom: 3
    },
    statusbarSeledted: {
        fontSize: 16,
        paddingBottom: 3,
        borderColor: '#007bff',
        borderBottomWidth: 2,
        fontWeight: 'bold'
    },
    container1: {
        width: '45%',
      },
      dropdown: {
        width: 'auto',
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        backgroundColor: '#f2f2f2',
        left: 14,
        top: -10,
        zIndex: 999,
        paddingHorizontal: 2,
        fontSize: 14,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
})

