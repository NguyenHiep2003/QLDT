import React, { useState } from 'react';
import { Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RequestAbsenceScreen() {
  const [textTiltle, onChangeTextTiltle] = useState('');
  const [textReason, onChangeTextReason] = useState('');
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerSuccessResult>();
  const [dateAbsence, setDateAbsence] = useState<Date>(new Date(Date.now())); 
  const [showDatepicker, setShowDatePicker] = useState(false);

  // Hàm chọn file
  const handleChooseFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled=== false) {
        setSelectedFile(result);
        console.log('File selected:', result);
      }
      console.log('result file: ', result.assets?.[0])
    } catch (err) {
      console.error('Error selecting file:', err);
    }
  };
  return (
    <>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <TextInput
          style= {styles.input}
          // onFocus={() => setSearching(true)}
          // onBlur={() => setSearching(false)}
          onChangeText={onChangeTextTiltle}
          value= {textTiltle}
          placeholder= "Tiêu đề"
          placeholderTextColor= '#b71c1c'
          multiline= {true}
        />
        <TextInput
          style= {[styles.input, styles.reasonInput]}
          // onFocus={() => setSearching(true)}
          // onBlur={() => setSearching(false)}
          onChangeText={onChangeTextReason}
          value= {textReason}
          placeholder= "Lý do"
          placeholderTextColor= '#b71c1c'
          multiline= {true}
          numberOfLines={8}
          // maxLength={40}
        />
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
          <TouchableOpacity
            onPress={() =>setShowDatePicker(true)}
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
            <View style={{ marginRight: 20, paddingVertical: 10 }}>
                <Text style={{ marginTop: 3, fontWeight: 'bold', fontSize: 16 }}>
                    <Text style={{ color: '#b71c1c' }}> Ngày nghỉ phép</Text>
                    {':  '}
                    {dateAbsence == null
                        ? 'Chọn ngày nghỉ phép'
                        : dateAbsence.toLocaleDateString()}{' '}
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
            onPress = {() => { Alert.alert("Xác nhận gửi thông tin nghỉ phép") }}
          >
            <Text style={{color: 'white'}}>Submit</Text>
          </TouchableOpacity>

          {showDatepicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={dateAbsence == null ? new Date(Date.now()) : dateAbsence}
                    mode={'date'}
                    minimumDate={new Date(Date.now())}
                    // TODO: giới hạn dưới bằng ngày bắt đầu lớp học
                    onChange={(event: any, selectedDate: any) => {
                      const currentDate = selectedDate;
                      setShowDatePicker(false);
                      setDateAbsence(currentDate);
                    }}
                    timeZoneName={'Asia/Bangkok'}
                />
            )}
      </View>
    </>
  )
};
const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 5,
    padding: 10,
    // color: '#b71c1c',
    borderColor: '#b71c1c',
    borderWidth: 1,
    marginTop: 20
  },
  reasonInput: {
    textAlignVertical: 'top',
    marginTop: 10
  }
})
