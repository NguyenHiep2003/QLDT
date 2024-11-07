import DateTimePicker from '@react-native-community/datetimepicker'
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
    Animated
 } from 'react-native'
 import {Divider} from './index'
import { router, useLocalSearchParams } from 'expo-router';
import {getAttendanceList, getClassInfo} from '../../../../../services/api-calls/classes'
import { getProfileLocal } from '@/services/storages/profile';
import { getTokenLocal } from '@/services/storages/token';

const DATA = [
    {
        "id": "58694a0f-3da1-471f-bd96-145571e29d74",
        "name": "Lê Trọng Bảo An",
        "MSSV": "20215295",
        "status": "có mặt"
    },
    {
        "id": "b1a2c3d4-e5f6-7890-1234-56789abcdef0",
        "name": "Hoàng Kỳ Anh",
        "MSSV": "20210068",
        "status": "có mặt"
    },
    {
        "id": "12345678-90ab-cdef-1234-567890abcdef",
        "name": "Nguyễn Thuý Anh",
        "MSSV": "20215306",
        "status": "có mặt"
    },
    {
        "id": "abcdef12-3456-7890-abcd-ef1234567890",
        "name": "Quách Hữu Tùng Anh",
        "MSSV": "20215311",
        "status": "có mặt"
    },
    {
        "id": "fedcba98-7654-3210-fedc-ba9876543210",
        "name": "Trần Minh Chiến",
        "MSSV": "20215321",
        "status": "có mặt"
    },
    {
        "id": "0f1e2d3c-4b5a-6978-90ab-cdef12345678",
        "name": "Nguyễn Quốc Dũng",
        "MSSV": "20215329",
        "status": "có mặt"
    },
    {
        "id": "9a8b7c6d-5e4f-3210-1a2b-3c4d5e6f7a8b",
        "name": "Nguyễn Hoàng Dương",
        "MSSV": "20215337",
        "status": "vắng"
    },
    {
        "id": "1a2b3c4d-5e6f-7890-1234-56789abcdef0",
        "name": "Nguyễn Thành Đạt",
        "MSSV": "20215344",
        "status": "vắng"
    },
    {
        "id": "abcdef01-2345-6789-0abc-def123456789",
        "name": "Vũ Hải Đăng",
        "MSSV": "20215347",
        "status": "vắng"
    },
    {
        "id": "12345678-9abc-def0-1234-56789abcdef0",
        "name": "Đinh Nhẫn Đức",
        "MSSV": "20215350",
        "status": "có mặt"
    },
    {
        "id": "0a1b2c3d-4e5f-6789-0abc-def123456789",
        "name": "Nguyễn Trọng Đức",
        "MSSV": "20215356",
        "status": "có mặt"
    },
    {
        "id": "abcdef12-3456-7890-abcd-ef1234567891",
        "name": "Nguyễn Đức Hải",
        "MSSV": "20210313",
        "status": "có mặt"
    },
    {
        "id": "fedcba98-7654-3210-fedc-ba9876543211",
        "name": "Nguyễn Phúc Hiệp",
        "MSSV": "20215367",
        "status": "vắng"
    },
    {
        "id": "0f1e2d3c-4b5a-6978-90ab-cdef12345679",
        "name": "Phạm Trung Hiếu",
        "MSSV": "20215374",
        "status": "có mặt"
    },
    {
        "id": "9a8b7c6d-5e4f-3210-1a2b-3c4d5e6f7a8c",
        "name": "Lục Minh Hoàng",
        "MSSV": "20215379",
        "status": "có mặt"
    },
    {
        "id": "1a2b3c4d-5e6f-7890-1234-56789abcdef1",
        "name": "Nguyễn Việt Hoàng",
        "MSSV": "20215384",
        "status": "có mặt"
    },
    {
        "id": "abcdef01-2345-6789-0abc-def12345678a",
        "name": "Nguyễn Vũ Hùng",
        "MSSV": "20210400",
        "status": "có mặt"
    },
    {
        "id": "12345678-9abc-def0-1234-56789abcdef1",
        "name": "Hoàng Nguyễn Huy",
        "MSSV": "20215393",
        "status": "có mặt"
    },
    {
        "id": "0a1b2c3d-4e5f-6789-0abc-def12345678a",
        "name": "Nhuien Tkhi Kam Tu",
        "MSSV": "20210988",
        "status": "có mặt"
    },
    {
        "id": "abcdef12-3456-7890-abcd-ef1234567892",
        "name": "Lie Min Kyonh",
        "MSSV": "20210989",
        "status": "vắng"
    },
    {
        "id": "fedcba98-7654-3210-fedc-ba9876543212",
        "name": "Trần Quang Khải",
        "MSSV": "20215401",
        "status": "có mặt"
    },
    {
        "id": "0f1e2d3c-4b5a-6978-90ab-cdef12345680",
        "name": "Phạm Đăng Khuê",
        "MSSV": "20215406",
        "status": "có mặt"
    },
    {
        "id": "9a8b7c6d-5e4f-3210-1a2b-3c4d5e6f7a8d",
        "name": "Nguyễn Hoàng Lâm",
        "MSSV": "20210515",
        "status": "có mặt"
    },
    {
        "id": "1a2b3c4d-5e6f-7890-1234-56789abcdef2",
        "name": "Tô Thái Linh",
        "MSSV": "20215414",
        "status": "có mặt"
    },
    {
        "id": "abcdef01-2345-6789-0abc-def12345678b",
        "name": "Bùi Anh Minh",
        "MSSV": "20215422",
        "status": "có mặt"
    },
    {
        "id": "12345678-9abc-def0-1234-56789abcdef2",
        "name": "Hoàng Trọng Minh",
        "MSSV": "20215427",
        "status": "có mặt"
    },
    {
        "id": "0a1b2c3d-4e5f-6789-0abc-def12345678b",
        "name": "Nguyễn Văn Nam",
        "MSSV": "20210618",
        "status": "có mặt"
    },
    {
        "id": "abcdef12-3456-7890-abcd-ef1234567893",
        "name": "Phạm Thị Thúy Ngần",
        "MSSV": "20215437",
        "status": "có mặt"
    },
    {
        "id": "fedcba98-7654-3210-fedc-ba9876543213",
        "name": "Lê Hà Phi",
        "MSSV": "20215443",
        "status": "có mặt"
    },
    {
        "id": "0f1e2d3c-4b5a-6978-90ab-cdef12345681",
        "name": "Thẩm Lập Phong",
        "MSSV": "20215449",
        "status": "có mặt"
    },
    {
        "id": "9a8b7c6d-5e4f-3210-1a2b-3c4d5e6f7a8e",
        "name": "Hà Vĩnh Phước",
        "MSSV": "20215455",
        "status": "có mặt"
    },
    {
        "id": "1a2b3c4d-5e6f-7890-1234-56789abcdef3",
        "name": "Hứa Hành Quân",
        "MSSV": "20215464",
        "status": "có mặt"
    },
    {
        "id": "abcdef01-2345-6789-0abc-def12345678c",
        "name": "Trương Đình Văn Quyền",
        "MSSV": "20215467",
        "status": "có mặt"
    },
    {
        "id": "12345678-9abc-def0-1234-56789abcdef3",
        "name": "Trần Cao Sơn",
        "MSSV": "20215472",
        "status": "có mặt"
    },
    {
        "id": "0a1b2c3d-4e5f-6789-0abc-def12345678c",
        "name": "Nguyễn Duy Tấn",
        "MSSV": "20215478",
        "status": "có mặt"
    },
    {
        "id": "abcdef12-3456-7890-abcd-ef1234567894",
        "name": "Phạm Đình Tú",
        "MSSV": "20210888",
        "status": "có mặt"
    },
    {
        "id": "fedcba98-7654-3210-fedc-ba9876543214",
        "name": "Nguyễn Quang Tuyến",
        "MSSV": "20215510",
        "status": "có mặt"
    },
    {
        "id": "0f1e2d3c-4b5a-6978-90ab-cdef12345682",
        "name": "Lê Thanh Thương",
        "MSSV": "20215485",
        "status": "có mặt"
    },
    {
        "id": "9a8b7c6d-5e4f-3210-1a2b-3c4d5e6f7a8f",
        "name": "Lương Đức Trọng",
        "MSSV": "20215489",
        "status": "có mặt"
    },
    {
        "id": "1a2b3c4d-5e6f-7890-1234-56789abcdef4",
        "name": "Nguyễn Văn Trường",
        "MSSV": "20215496",
        "status": "có mặt"
    },
    {
        "id": "abcdef01-2345-6789-0abc-def12345678d",
        "name": "Lý Quang Vũ",
        "MSSV": "20215517",
        "status": "vắng"
    }
]  

const Item:  React.FC<{ name: any, MSSV: any, status: any, index: any }> = ({name, MSSV, status, index}) => (
    <View>
      <View style= {styles.containerItem}>
        <View style={styles.item}>
          <Text style={styles.index}>{index + 1}.</Text>
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style= {{color: '#7f8c8d'}}> {MSSV} </Text> 
            {/* <Text style= {{marginTop: 4}}> Vắng: 0 | Vắng CP: 0 </Text>  */}
          </View>
        </View>

        <View>
        {status == 'PRESENT' &&(
            <Text style={{color: '#007BFF', fontSize: 16}}>Có mặt</Text>
        )}
        {status == 'UNEXCUSED_ABSENCE' &&(
            <Text style={{color: '#ff4141', fontSize: 16}}>Vắng</Text>
        )}
      </View>
      </View>



      <Divider />
    </View>
  );
  
  export default function ViewAttendanceHistoryScreen() {
    const [date, setDate] = useState<Date>(new Date(Date.now()));
    const [show, setShow] = useState(false);
    const [showRecord, setShowRecord] = useState(false)
    const [showErr, setShowErr] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any[]>([])
    const [err, setErr] = useState('')

    const { classId } = useLocalSearchParams();

    const handleLookup = async () => {
        setIsLoading(true)
        setShowErr(false)
        setShowRecord(false)
        const dateLookup = date.toISOString().split('T')[0]
        try{
            const attendanceRecord = await getAttendanceList(classId, dateLookup)
            const classInfo = await getClassInfo(classId)
            classInfo.student_accounts = classInfo.student_accounts.map((student: any) => {
                const attendance = attendanceRecord.attendance_student_details.find((att: any) => att.student_id === student.student_id)
                return {
                    ...student,
                    status: attendance ? attendance.status : null
                }
            })
        
            setData(classInfo.student_accounts)
            setIsLoading(false)
            setShowRecord(true)
        } catch(error: any){
            if (error.response) {
                // Yêu cầu đã được gửi và máy chủ đã phản hồi với mã trạng thái khác 2xx
                const errorCode = error.response.data.meta.code;
                if(errorCode == 9994) setErr(`Không có lịch sử điểm danh\nvào ngày ${dateLookup}!`)
                setIsLoading(false)
                setShowErr(true)
            } else if (error.request) {
                // Yêu cầu đã được gửi nhưng không nhận được phản hồi
                setErr('Máy chủ không phản hồi!');
                setIsLoading(false)
                setShowErr(true)
            } else {
                // Có lỗi xảy ra khi thiết lập yêu cầu
                console.error('Error:', error.message);
                setErr('Hmm... Có gì đó không ổn đã xảy ra!');
                setIsLoading(false)
                setShowErr(true)
            }
        }
    }

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
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={{flexDirection: 'row',  alignItems: 'center', justifyContent: 'center'}}>
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
                        alignItems: 'center'
                }}>
                    <View style={{marginRight: 20}}>
                        <Text style={{color: '#bdc3c7'}}> Ngày tra cứu</Text>
                        <Text style={{marginTop: 3, fontWeight: 'bold'}}> {date == null ? 'Chọn ngày tra cứu' : date.toLocaleDateString()} </Text>
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
                ><Text style={{color: 'white'}} >Tra cứu</Text>
                </TouchableOpacity>
            </View>
            

            {show && (
            <DateTimePicker
                testID="dateTimePicker"
                value={date == null ? new Date(Date.now()) : date}
                mode={'date'}
                maximumDate={new Date(Date.now())}
                onChange={onChange}
            />)}

            {isLoading && (
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                    <Text style={{fontSize: 18,textAlign: 'center'}}>Đang tra cứu...</Text>
                </View>
            )}

            {showRecord && <FlatList
                style = {{backgroundColor: 'white', marginTop: 10}}
                data={data}
                renderItem={({item, index}) => <Item name={item.last_name} MSSV={item.email} status={item.status} index={index}/>}
                keyExtractor={item => item.student_id.toString()}
            />}

            {showErr && (
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                    <Text style={{fontSize: 18,textAlign: 'center'}}>{err}</Text>
                </View>
            )}
            

        </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 0,
      backgroundColor: '#f2f2f2'
    },
    containerItem: {
        flex: 1,
        flexDirection: 'row', // Thiết lập hướng bố trí theo hàng
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },
    item: {
        flexDirection: 'row',
    },
    index: {
        fontSize: 16,
        marginEnd: 2
    },
    name: {
        fontSize: 16
    }
  })
  