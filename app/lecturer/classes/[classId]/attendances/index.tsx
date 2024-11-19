import { getAttendanceList, getClassInfo, setAttendanceStatus, takeAttendance } from '@/services/api-calls/classes';
import { getTokenLocal } from '@/services/storages/token';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  Alert,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import _ from 'lodash'

const Note: React.FC<{presentCount: any, absentCount: any}> = ({presentCount, absentCount}) => (
  <View style= {styles.note}> 
    <View > 
      <Text style= {{fontSize: 18}}>
        Có mặt:
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
        Vắng:
        <Image
          style={{width: 20, height: 20}}
          source={require('@assets/images/Vang.png')}
        />
      </Text>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18 }}>{absentCount}</Text>
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
          style={[styles.circleButton, {backgroundColor: status == 'UNEXCUSED_ABSENCE' ? '#ff4141' : '#007BFF'}]}
          onPress={() => toggleStatus(MSSV)}
        >
          {status == 'PRESENT' && (<Image
            style={styles.checked}
            source={require('@assets/images/checks.png')}
          />)}
          {(status == 'UNEXCUSED_ABSENCE') && (<Image
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
  const [text, setText] = React.useState('');
  const [data, setData] = useState<any[]>([]);
  const [dataSearch, setDataSearch] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [attStatus, setAttStatus] = useState('') // 0: khởi tạo điểm danh|| 1: cập nhật điểm danh
  const [err, setErr] = useState('')
  const [statusShow, setStatusShow] = useState({
    showRecord: false,
    showErr: false,
    isLoading: false
  })
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [requesting, setRequesting] = useState(false)
  const [searching, setSearching] = useState(false)

  const { classId } = useLocalSearchParams();
  
  // console.log('originalData: ', originalData)

  useEffect(() => {
    const countAttendance = (studentList: any[]) => {
      const present = studentList.filter(student => student.status === 'PRESENT').length;
      const absent = studentList.filter(student => student.status === 'UNEXCUSED_ABSENCE').length;

      setPresentCount(present);
      setAbsentCount(absent);
    };
    const getStudentList = async() => {
      const token = await getTokenLocal()
      console.log('token: ', token)
      getClassInfo({class_id: classId as string} )
      .then((response) => {
        getAttendanceList(classId, getLocalDateString(new Date(Date.now())))
        .then((attendanceRecord) => {
          const studentList = response.data.student_accounts.map((student: any) => {
            const attendance = attendanceRecord.attendance_student_details.find((att: any) => att.student_id === student.student_id)
            return {
                ...student,
                status: attendance ? attendance.status : null,
                attendance_id: attendance ? attendance.attendance_id: null
            }
          })
          countAttendance(studentList)
          setData(studentList)
          setOriginalData(_.cloneDeep(studentList)); // Lưu dữ liệu ban đầu
          setAttStatus('1')
          setStatusShow({
            showRecord: true,
            showErr: false,
            isLoading: false
          })
        })
        .catch((error: any) => {
          if (error.rawError) {
            // Yêu cầu đã được gửi và máy chủ đã phản hồi với mã trạng thái khác 2xx
            const errorCode = error.rawError.meta.code;
            if(errorCode == 9994){
              const studentList =  response.data.student_accounts.map((student: any) => {
                  return {
                      ...student,
                      status: 'PRESENT'
                  }
                })
              countAttendance(studentList)
              setData(studentList)
              setOriginalData(_.cloneDeep(studentList)); // Lưu dữ liệu ban đầu
              setAttStatus('0')
              setStatusShow({
                showRecord: true,
                showErr: false,
                isLoading: false
              })
            }
            else if(errorCode == 1004){
              setErr(`Không phải thời gian mở lớp!`)
              setStatusShow({
                showRecord: false,
                showErr: true,
                isLoading: false
              })
            }
          } else if (error.request) {
              // Yêu cầu đã được gửi nhưng không nhận được phản hồi
              setErr('Máy chủ không phản hồi!');
              setStatusShow({
                showRecord: false,
                showErr: true,
                isLoading: false
              })
          } else {
              // Có lỗi xảy ra khi thiết lập yêu cầu
              console.error('Error-----:', error.message);
              setErr('Có lỗi xảy ra khi thiết lập yêu cầu!');
              setStatusShow({
                showRecord: false,
                showErr: true,
                isLoading: false
              })
          }
        })
      })
      .catch((error: any) => {
        if (error.response) {
          // Yêu cầu đã được gửi và máy chủ đã phản hồi với mã trạng thái khác 2xx
          const errorCode = error.response.data.meta.code;
          if(errorCode == 1000){
            setErr(`Không được phép truy cập lớp này!`)
            setStatusShow({
              showRecord: false,
              showErr: true,
              isLoading: false
            })
          }
      } else if (error.request) {
          // Yêu cầu đã được gửi nhưng không nhận được phản hồi
          setErr('Máy chủ không phản hồi!');
          setStatusShow({
            showRecord: false,
            showErr: true,
            isLoading: false
          })
      } else {
          // Có lỗi xảy ra khi thiết lập yêu cầu
          console.error('Error:', error.message);
          setErr('Hmm... Có gì đó không ổn đã xảy ra!');
          setStatusShow({
            showRecord: false,
            showErr: true,
            isLoading: false
          })
        }
      })
    }

    setStatusShow({
      showRecord: false,
      showErr: false,
      isLoading: true
    })
    getStudentList()
  }, [requesting])

  const getLocalDateString = (utcDate: Date) => {
    const localDate = new Date(utcDate); // Tạo đối tượng Date từ UTC

    // Lấy năm, tháng, ngày
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(localDate.getDate()).padStart(2, '0');

    // Trả về chuỗi theo định dạng yyyy-mm-dd
    return `${year}-${month}-${day}`;
  };

  const toggleStatus = (MSSV: any) => {
    setData(prevData => {
      const updatedData = prevData.map(student => {
        if (student.student_id === MSSV) {
          const newStatus = student.status === 'PRESENT' ? 'UNEXCUSED_ABSENCE' : 'PRESENT';

          if (newStatus === 'PRESENT') {
            setPresentCount(prevCount => prevCount + 1);
            setAbsentCount(prevCount => prevCount - 1);
          } else {
            setPresentCount(prevCount => prevCount - 1);
            setAbsentCount(prevCount => prevCount + 1);
          }
          return { ...student, status: newStatus };
        }
        return student;
      });
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
        const dateTakeAttendance= getLocalDateString(new Date(Date.now()))
        const attendanceList = data.filter(student => student.status === 'UNEXCUSED_ABSENCE').map(student => student.student_id.toString());
        await takeAttendance(classId, dateTakeAttendance, attendanceList);
        setAttStatus('1');
        Alert.alert('Thành công', 'Điểm danh đã được xác nhận thành công!');
      } else {
        const updatesNeeded = data.filter(student => {
          const originalStudent = originalData.find(orig => orig.student_id === student.student_id);
          return originalStudent && originalStudent.status !== student.status;
        });
        const attendanceUpdates = updatesNeeded.map(student => ({
          status: student.status,
          attendanceId: student.attendance_id
        }));
        const promises = attendanceUpdates.map(update => setAttendanceStatus(update.status, update.attendanceId));
        await Promise.all(promises);
        Alert.alert('Thành công', 'Cập nhật điểm danh thành công!');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình điểm danh.');
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

  return (
    <SafeAreaView style={styles.container}>
    {requesting && (
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    )}
      {statusShow.isLoading && (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
          <Text style={{fontSize: 18,textAlign: 'center'}}>Đang tải...</Text>
        </View>
      )}

      {statusShow.showRecord && (<>
        {!searching && <Note presentCount={presentCount} absentCount={absentCount} />}

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
          {/* <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              marginRight: 10,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10
            }}
            onPress = {() => { handleSearch() }}
          >
            <Image style={{ width: 20, height: 20, }} source={require('@assets/images/search.png')} />
          </TouchableOpacity> */}
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

      {statusShow.showErr && (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
          <Text style={{fontSize: 18,textAlign: 'center'}}>{err}</Text>
        </View>
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
    justifyContent: 'space-evenly',
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