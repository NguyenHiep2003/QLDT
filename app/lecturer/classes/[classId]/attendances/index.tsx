import { getAttendanceList, getClassInfo, setAttendanceStatus, takeAttendance, getAbsenceRequests, getAttendanceDates } from '@/services/api-calls/classes';
import { getTokenLocal } from '@/services/storages/token';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  RefreshControl
} from 'react-native';
import _ from 'lodash'
import { useErrorContext } from '@/utils/ctx';

const Note: React.FC<{presentCount: any, ECAbsentCount: any, UECAbsentCount: any}> = ({presentCount, ECAbsentCount, UECAbsentCount}) => (
  <View style= {styles.note}> 
    <View > 
      <Text style= {{fontSize: 18}}>
        <Text>Có mặt: </Text>
        <Image
          style={{width: 20, height: 20}}
          source={require('@assets/images/correct.png')}
        />
      </Text>
      <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
        <Text style={{ fontSize: 18 }}>{presentCount}</Text>
      </View>
    </View>

    <View style={styles.separator} />

    <View> 
      <Text style= {{fontSize: 18}}>
        <Text>Vắng CP: </Text>
        <Image
          style={{width: 20, height: 20}}
          source={require('@assets/images/VangCP.png')}
        />
      </Text>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18}}>{ECAbsentCount}</Text>
      </View>
    </View>

    <View style={styles.separator} />

    <View> 
      <Text style= {{fontSize: 18}}>
        <Text>Vắng: </Text>
        <Image
          style={{width: 20, height: 20}}
          source={require('@assets/images/Vang.png')}
        />
      </Text>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18 }}>{UECAbsentCount}</Text>
      </View>
    </View>
  </View>
)

const Item:  React.FC<{ name: any, MSSV: any, status: any, index: any, toggleStatus: (MSSV: any) => void }> = ({name, MSSV, status, index, toggleStatus}) => (
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
      <TouchableOpacity
          style={[styles.circleButton, {backgroundColor: status == 'PRESENT' ? '#007BFF' : (status == 'EXCUSED_ABSENCE') ? '#f6c500':'#ff4141'}]}
          onPress={() => toggleStatus(MSSV)}
        >
          {status == 'PRESENT' && (<Image
            style={styles.checked}
            source={require('@assets/images/checks.png')}
          />)}
          {(status == 'UNEXCUSED_ABSENCE' || status == 'EXCUSED_ABSENCE') && (<Image
            style={styles.absent}
            source={require('@assets/images/vvang.png')}
          />)}
        </TouchableOpacity>
    </View>
    <Divider />
  </View>
);

export const Divider: React.FC<{}> = () => (
  <View style={styles.divider} />
)

export default function TakeAttendanceScreen() {
  const { setUnhandledError } = useErrorContext();
  const [text, setText] = React.useState('');
  const [data, setData] = useState<any[]>([]);
  const [dataSearch, setDataSearch] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [attStatus, setAttStatus] = useState('') // 0: khởi tạo điểm danh|| 1: cập nhật điểm danh
  // const [err, setErr] = useState('')
  const [statusShow, setStatusShow] = useState({
    showRecord: false,
    showErr: false,
    isLoading: false
  })
  const [presentCount, setPresentCount] = useState(0);
  const [ECAbsentCount, setECAbsentCount] = useState(0);
  const [UECAbsentCount, setUECAbsentCount] = useState(0);
  const [requesting, setRequesting] = useState(false)
  const [refreshing, setRefreshing] = React.useState(false);
  const [searching, setSearching] = useState(false)

  const { classId } = useLocalSearchParams();
  
  // console.log('originalData: ', originalData)
 

  const getLocalDateString = (utcDate: Date) => {
    const localDate = new Date(utcDate); // Tạo đối tượng Date từ UTC

    // Lấy năm, tháng, ngày
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(localDate.getDate()).padStart(2, '0');

    // Trả về chuỗi theo định dạng yyyy-mm-dd
    return `${year}-${month}-${day}`;
  };
  const dateNow = getLocalDateString(new Date(Date.now()))

  const countAttendance = (studentList: any[]) => {
    const present = studentList.filter(student => student.status === 'PRESENT').length;
    const ECAbsent = studentList.filter(student => student.status === 'EXCUSED_ABSENCE').length;
    const UECAbsent = studentList.filter(student => student.status === 'UNEXCUSED_ABSENCE').length;

    setPresentCount(present);
    setECAbsentCount(ECAbsent);
    setUECAbsentCount(UECAbsent);
  };

  const getStudentList = async() => {
    getClassInfo({class_id: classId as string} )
    .then((classInfo) => {
      if(_.isEmpty(classInfo.data.student_accounts)){
        setStatusShow({ showRecord: false, showErr: false, isLoading: false })
        return
      } else{
        getAttendanceDates(classId)
        .then((AttendanceDateList) => {
          if(!_.isEmpty(AttendanceDateList) && AttendanceDateList.find((date: any) => date == dateNow)){// hôm nay đã điểm danh
            getAttendanceList(classId, dateNow, null, null)
            .then((attendanceRecord) => {
              const studentList = classInfo.data.student_accounts.map((student: any) => {
                const attendance = attendanceRecord.attendance_student_details.find((att: any) => att.student_id === student.student_id)
                return {
                    ...student,
                    status: attendance ? attendance.status : null, // nếu sinh viên có trong lớp mà ko có bản ghi điểm danh thì mặc định là null
                    attendance_id: attendance ? attendance.attendance_id: null
                }
              })
              countAttendance(studentList)
              setData(studentList)
              setOriginalData(_.cloneDeep(studentList)); // Lưu dữ liệu ban đầu
              setAttStatus('1')
              setStatusShow({ showRecord: true, showErr: false, isLoading: false })
            })
            .catch((error: any) => {
              setStatusShow({ showRecord: false, showErr: false, isLoading: false })
              setUnhandledError(error)
            })
          } else {// hôm nay chưa điểm danh
            const studentList =  classInfo.data.student_accounts.map((student: any) => {
              return {
                  ...student,
                  status: 'PRESENT'
              }
            })
            countAttendance(studentList)
            setData(studentList)
            setOriginalData(_.cloneDeep(studentList)); // Lưu dữ liệu ban đầu
            setAttStatus('0')
            setStatusShow({ showRecord: true, showErr: false, isLoading: false })
          }
        })
        .catch((error: any) => { 
          setStatusShow({ showRecord: false, showErr: false, isLoading: false })
          setUnhandledError(error) 
        })
      }
    })
    .catch((error: any) => {
      setStatusShow({ showRecord: false, showErr: false, isLoading: false })
      setUnhandledError(error)
    })
  }

  useEffect(() => {
    setStatusShow({ showRecord: false, showErr: false, isLoading: true })
    getStudentList()
  }, [requesting])

  const toggleStatus = (MSSV: any) => {
    setData(prevData => {
      const updatedData = prevData.map(student => {
        if (student.student_id === MSSV) {
          const newStatus = student.status === 'PRESENT' ? 'UNEXCUSED_ABSENCE' : 'PRESENT';
          return { ...student, status: newStatus };
        }
        return student;
      });
      countAttendance(updatedData)
      // Cập nhật lại dataSearch nếu nó không rỗng
      if (!_.isEmpty(dataSearch)) {
        setDataSearch(updatedData.filter(student => {
          const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
          const mssv = student.student_id.toString();
          return fullName.includes(text.toLowerCase()) || mssv.includes(text);
        }));
      }

      return updatedData;
    });
  };

  const compareStudentStatuses = () => {
      return data.every(studentDta => {
          const studentOriginal = originalData.find(student => student.student_id === studentDta.student_id);
          return studentOriginal ? studentDta.status === studentOriginal.status : false;
      });
  };

  const hanldeAttendance = async () => {
    setRequesting(true); // Bắt đầu tải
    try {
      if (attStatus === '0') {
        const attendanceList = data.filter(student => student.status === 'UNEXCUSED_ABSENCE').map(student => student.student_id.toString());
        await takeAttendance(classId, dateNow, attendanceList);
        setAttStatus('1');
        const attendanceRecordList = await getAttendanceList(classId, dateNow, null, null)
        const ECAbsenceRespone : any = await getAbsenceRequests(classId, null, null, 'ACCEPTED', dateNow) // danh sách các đơn xin nghỉ đã được xác nhận vao ngay diem danh
        if(!_.isEmpty(attendanceRecordList.attendance_student_details) && !_.isEmpty(ECAbsenceRespone.page_content)){
          const ECAbsenceList : any = attendanceRecordList.attendance_student_details
            .filter((recordAttendance: any) => {
              return (
                recordAttendance.status === 'UNEXCUSED_ABSENCE' &&
                ECAbsenceRespone.page_content.some((recordECAbsence: any) => recordECAbsence.student_account.student_id == recordAttendance.student_id)
              )
            })

          if(!_.isEmpty(ECAbsenceList)){
            const promises = ECAbsenceList.map((ECAbsence: any) => setAttendanceStatus('EXCUSED_ABSENCE', ECAbsence.attendance_id));
            try{
              await Promise.all(promises);
            } catch(error: any){
              const errorCode = error.rawError?.meta?.code;
              if(errorCode == 9994){
                error.setTitle("Lỗi đồng bộ !");
                error.setContent("Không tìm thấy bản ghi điểm danh để đồng bộ với đơn xin nghỉ phép !");
              } else if(error.rawError){
                error.setTitle("Lỗi đồng bộ !");
                error.setContent("Đồng bộ bản ghi điểm danh với đơn xin nghỉ phép thất bại !");
              }
              setUnhandledError(error)
            }
          }
        }
        Alert.alert('Thành công', 'Điểm danh đã được xác nhận thành công!');
      } else {
        const updatesNeeded = data.filter(student => {
          const originalStudent = originalData.find(orig => orig.student_id === student.student_id);
          return originalStudent && originalStudent.status !== student.status;
        });
        const attendanceUpdates = updatesNeeded.map(student => ({
          status: student.status,
          attendanceId: student.attendance_id,
          studentId: student.student_id
        }));
        const ECAbsenceRespone : any = await getAbsenceRequests(classId, null, null, 'ACCEPTED', dateNow) // danh sách các đơn xin nghỉ đã được xác nhận vao ngay diem danh
        attendanceUpdates.forEach((student) => {
          if(student.status === "UNEXCUSED_ABSENCE"){
            const matchedRecord  = ECAbsenceRespone.page_content.find(
            (recordECAbsence: any) => recordECAbsence.student_account.student_id === student.studentId)

            if (matchedRecord) { student.status = "EXCUSED_ABSENCE"; }
          }
        });
        const promises = attendanceUpdates.map(update => setAttendanceStatus(update.status, update.attendanceId));
        await Promise.all(promises);
        Alert.alert('Thành công', 'Cập nhật điểm danh thành công!');
      }
    } catch (error: any) {
      console.error('Error:', JSON.stringify(error));
      const errorCode = error.rawError.meta.code;
      // if(errorCode == 9994) 
      if(errorCode == "1004"){
        error.setTitle("Thông báo !");
        error.setContent("Thời gian điểm danh không thuộc thời gian mở lớp!");
      } else if(error.rawError){
        error.setTitle("Lỗi !");
        error.setContent("Đã có lỗi xảy ra khi điểm danh, vui lòng thử lại sau!");
      }
      setUnhandledError(error)
    } finally {
      setRequesting(false); // Kết thúc tải
    }
  };

  const handleSearch = (value: any) => {
    if(!_.isEmpty(value)){
      setDataSearch(
        data.filter(student => {
        const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
        const mssv = student.student_id.toString();
        return fullName.includes(value.toLowerCase())|| mssv.includes(value);
      })
    )}
    else setDataSearch([])
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await getStudentList()
    setRefreshing(false)
  }

  return (
    <SafeAreaView style={styles.container}>
    {requesting && (
      <View style={styles.overlay}>
        <ActivityIndicator  size="large" color="#007BFF" />
      </View>
    )}
      {statusShow.isLoading && (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={{fontSize: 18, marginBottom: '20%'}}>Đang tải</Text>
        </View>
      )}

      {statusShow.showRecord && !_.isEmpty(data) && (<>
        {!searching && <Note presentCount={presentCount} ECAbsentCount={ECAbsentCount}  UECAbsentCount={UECAbsentCount}/>}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: 10,
            marginRight: 10,
            marginTop: 10
          }}
        > 
          <TextInput
            style= {[styles.input, {backgroundColor: 'white', width: '60%', borderRadius: 10}]}
            onFocus={() => setSearching(true)}
            onBlur={() => setSearching(false)}
            onChangeText={(value) => {
              setText(value);
              handleSearch(value);
            }}
            value= {text}
            placeholder= "Tìm kiếm..."
          />
        </View> 

        <FlatList
          style = {{backgroundColor: 'white'}}
          data= {_.isEmpty(text) ? data : dataSearch}
          renderItem={({item, index}) => (
            <Item
              name={`${item.first_name} ${item.last_name}`}
              MSSV={item.student_id}
              status={item.status}
              index={index}
              toggleStatus={toggleStatus}
            />
          )}
          onRefresh={onRefresh}
          refreshing={refreshing}
          keyExtractor={item => item.student_id.toString()}
        />
        
        <View style={{paddingVertical: 10, paddingHorizontal: 50, backgroundColor: 'white'}}> 
          <TouchableOpacity
            style={{
              backgroundColor: compareStudentStatuses() && attStatus === '1' ? 'gray' : '#007bff',
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50,
              marginHorizontal: '8%'
            }}
            disabled={compareStudentStatuses()&& attStatus === '1'}
            onPress={() => {
              Alert.alert(
                `${attStatus === '1' ? 'Xác nhận cập nhật điểm danh' : 'Xác nhận điểm danh'}`,
                `Bạn có chắc chắn muốn ${attStatus === '1' ? 'cập nhật': 'xác nhận'} điểm danh không?`,
                [
                  {
                    text: 'Cancel',
                    onPress: () => {},
                    style:'cancel'
                  },
                  {
                    text: 'OK',
                    onPress: () => {hanldeAttendance()}
                  },
                ],
                { cancelable: false } // Không cho phép đóng hộp thoại bằng cách nhấn ra ngoài
              );
            }}
          ><Text style={{padding: 0, margin: 0, fontSize: 16, color: 'white'}}>{attStatus === '1' ? 'Cập nhật điểm danh' : 'Xác nhận điểm danh'}</Text></TouchableOpacity>
        </View>
      </>)}

      {/* {statusShow.showErr &&(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{fontSize: 18, marginBottom: '20%'}}>{err}</Text>
        </View>
      )} */}
      {!requesting && !statusShow.isLoading && _.isEmpty(data) &&(
        <ScrollView
          contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }
        >
          <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: '20%'}}>Lớp học chưa có sinh viên nào!</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  )
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
    // paddingLeft: 10,
    // paddingVertical: 10,
    // marginVertical: 8,
    // marginHorizontal: 16,
    flexDirection: 'row',
  },
  index: {
    fontSize: 16,
    marginEnd: 2
  },
  name: {
    fontSize: 16,
    // fontWeight: 'bold'
  },
  divider: {
    borderBottomColor: '#bdc3c7', // Màu sắc của đường kẻ
    borderBottomWidth: 1,      // Độ dày của đường kẻ
    marginVertical: 0,        // Khoảng cách trên và dưới của đường kẻ
  },
  separator: {
    width: 1, // Chiều rộng của đường phân cách
    height: '100%', // Chiều cao của đường phân cách
    backgroundColor: '#ccc', // Màu sắc của đường phân cách
  },
  circleButton: {
    backgroundColor: '#007BFF', // Màu nền của nút
    padding: 15,
    borderRadius: 50, // Làm nút có bo góc hình tròn
    width: 10,       // Đặt kích thước chiều rộng
    height: 10,      // Đặt kích thước chiều cao bằng chiều rộng để nó tròn
    justifyContent: 'center',
    alignItems: 'center', // Canh giữa text trong nút
  },
  checked: {
    width: 25,
    height: 25,
  },
  absent: {
    width: 15,
    height: 15,
  },
  note: {
    backgroundColor: 'white', 
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 5
  },
  input: {
    height: 40,
    padding: 10,
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
  }
});