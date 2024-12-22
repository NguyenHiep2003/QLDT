import React, { useEffect, useState } from 'react';
import { Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {requestAbsence} from '@/services/api-calls/classes'
import { useLocalSearchParams } from 'expo-router';
import _ from 'lodash'
import { useErrorContext } from '@/utils/ctx';
import { sendNotification } from '@/services/api-calls/notification';
import { getProfileLocal } from '@/services/storages/profile';

export default function RequestAbsenceScreen() {
  const {setUnhandledError} = useErrorContext()
  const [requesting, setRequesting] = useState(false)
  const [textTitle, onChangeTextTitle] = useState('');
  const [textReason, onChangeTextReason] = useState('');
  const [selectedFile, setSelectedFile] = useState<Array<DocumentPicker.DocumentPickerSuccessResult>>([]);
  const [dateAbsence, setDateAbsence] = useState<Date>(new Date(Date.now())); 
  const [showDatepicker, setShowDatePicker] = useState(false);
  const [err, setErr] = useState('')
  const { classId, className, startDate, endDate, lecturerAccountId } = useLocalSearchParams();
  const [studentName, setStudentName] = useState('');

  const getLocalDateString = (utcDate: Date) => {
    const localDate = new Date(utcDate); // Tạo đối tượng Date từ UTC

    // Lấy năm, tháng, ngày
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(localDate.getDate()).padStart(2, '0');

    // Trả về chuỗi theo định dạng yyyy-mm-dd
    return `${year}-${month}-${day}`;
};

  // Hàm chọn file
  const handleChooseFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled === false) {
        const isDuplicate = selectedFile.some(
          (file) => file.assets[0].name === result.assets[0].name && file.assets[0].size === result.assets[0].size && file.assets[0].mimeType === result.assets[0].mimeType
        );
        if (isDuplicate) {
          Alert.alert('Tệp trùng lặp', 'Tập tin này đã được chọn.');
          return;
        }
        setSelectedFile([result]);
      }
    } catch (err) {
      console.error('Error selecting file:', err);
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại sau!');
      return;
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFile(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const formatDate = (date: any) => date.toISOString().split('T')[0];

  const initialData = async () => {
    const dateNow = formatDate(new Date(Date.now()))
    if(dateNow < startDate){
      setDateAbsence(new Date(startDate.toString()))
    } else if(dateNow > endDate){
      setDateAbsence(new Date(endDate.toString()))
    }

    try{
      const profileLocal = await getProfileLocal()
      setStudentName(profileLocal?.name ? profileLocal?.name : '')
    } catch(error: any){
      setUnhandledError(error)
      throw error
    }
  }

  useEffect(() => {
    initialData()
  }, [])

  const sendPushNotification = async () => {
    const message = `Sinh viên '${studentName}' lớp '${className}' xin nghỉ học ngày ${formatDate(dateAbsence)}`
    const toUser = lecturerAccountId.toString()
    console.log('toUser: ', toUser)
    const type = 'ABSENCE'
    await sendNotification({ message, toUser, type})
  }

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('title', textTitle)
    formData.append('reason', textReason)
    formData.append('classId', classId.toString())
    formData.append('date', getLocalDateString(dateAbsence))

    for(const file of selectedFile) {
      const fileUri = file.assets[0].uri;
      const fileName = file.assets[0].name;
      const fileType = file.assets[0].mimeType;

      formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: fileType,
      } as any);
    }
    setRequesting(true)
    try{
      const res = await requestAbsence(formData)
      await sendPushNotification()
      Alert.alert( 'Thành công', 'Gửi yêu cầu xin nghỉ thành công' )
      onChangeTextTitle('')
      onChangeTextReason('')
      setSelectedFile([])
      setDateAbsence(new Date(Date.now()))
    } catch(error: any) {
      setUnhandledError(error)
    } finally {
      setErr('')
      setRequesting(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {requesting && (
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    )}
      <ScrollView>
        <View style={styles.container}>
          <TextInput
            style= {styles.input}
            // onFocus={() => setSearching(true)}
            // onBlur={() => setSearching(false)}
            onChangeText={onChangeTextTitle}
            value= {textTitle}
            placeholder= "Tiêu đề"
            placeholderTextColor= '#b71c1c'
            multiline= {true}
          />
          <TextInput
            style= {[styles.input, styles.reasonInput]}
            // onFocus={() => setSearching(true)}
            // onBlur={() => setSearching(false)}
            onChangeText={value => {
              onChangeTextReason(value)
              if(value.length > 0) setErr('')
            }}
            value= {textReason}
            placeholder= "Lý do"
            placeholderTextColor= '#b71c1c'
            multiline= {true}
            numberOfLines={8}
            // maxLength={40}
          />
          
          {!_.isEmpty(err.trim()) &&
            <View style={{width: '100%', paddingVertical: 6}}>
              <Text style={{justifyContent: 'flex-start', alignItems: 'flex-start', color: '#fc9403', fontSize: 15}}>{err}</Text>
            </View>
          }

          <TouchableOpacity
              style={{
                marginTop: 10,
                padding: 10,
                marginRight: 10,
                backgroundColor: '#b71c1c',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10
              }}
              onPress = {() => { handleChooseFile() }}
            >
              <Text style={{color: 'white'}}>Tải minh chứng</Text>
            </TouchableOpacity>

            {/* Hiển thị danh sách file đã chọn */}
          {selectedFile.length > 0 && selectedFile.map((file, index) => (
            <View key={index} 
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between' ,
                alignItems: 'center',
                marginTop: 10,
                backgroundColor: "#f0dddd",
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 5,
                borderColor: "#b71c1c",
                borderWidth: 0.75}}
            >
              <Text style={{ marginRight: 10, maxWidth: '90%', fontSize: 16 }} numberOfLines={1} ellipsizeMode="tail">{file.assets[0].name}</Text>
              <TouchableOpacity onPress={() => handleRemoveFile(index)}>
                <Text style={{ color: 'red', paddingHorizontal: 3, fontSize: 16}}>X</Text>
              </TouchableOpacity>
            </View>
          ))}

            <TouchableOpacity
              onPress={() =>setShowDatePicker(true)}
              style={{
                  borderRadius: 8,
                  marginVertical: 16,
                  backgroundColor: 'white',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  borderColor: '#b71c1c',
                  borderWidth: 0.75 
              }}
            >
              <View style={{ marginRight: 20, paddingVertical: 8 }}>
                  <Text style={{ fontSize: 16 }}>
                      <Text style={{ color: '#b71c1c' }}> Ngày nghỉ phép:</Text>
                      {'  '}
                      {dateAbsence == null
                          ? 'Chọn ngày nghỉ phép'
                          : dateAbsence.toLocaleDateString('vi-VN')}{' '}
                  </Text>
              </View>
              <Image source={require('@assets/images/calendar.png')} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginTop: 10,
                padding: 10,
                marginRight: 10,
                backgroundColor: '#b71c1c',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 3,
                paddingHorizontal: 20
              }}
              onPress={() => {
                if (!textReason.trim()) {
                  setErr('"Lý do" không được để trống!!!')
                  return;
                }
                Alert.alert(
                  'Xác nhận gửi yêu cầu xin nghỉ!',
                  'Bạn có chắc chắn muốn gửi yêu cầu xin nghỉ không?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => {},
                      style:'cancel'
                    },
                    {
                      text: 'OK',
                      onPress: () => { handleSubmit() }
                    },
                  ],
                  { cancelable: false } // Không cho phép đóng hộp thoại bằng cách nhấn ra ngoài
                );
              }}
            >
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>Submit</Text>
            </TouchableOpacity>

            {showDatepicker && (
                  <DateTimePicker
                      testID="dateTimePicker"
                      value={ dateAbsence == null ? new Date(Date.now()) : dateAbsence }
                      mode={'date'}
                      minimumDate={new Date(startDate.toString())}
                      maximumDate={new Date(endDate.toString())}
                      onChange={(event: any, selectedDate: any) => {
                        const currentDate = selectedDate;
                        setShowDatePicker(false);
                        setDateAbsence(currentDate);
                      }}
                      timeZoneName={'Asia/Bangkok'}
                  />
              )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 5,
    padding: 10,
    // color: '#b71c1c',
    borderColor: '#b71c1c',
    borderWidth: 1,
    marginTop: 20,
    fontSize: 16
  },
  reasonInput: {
    textAlignVertical: 'top',
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
    height: '100%',
  }
})
