import DateTimePicker from '@react-native-community/datetimepicker'
import React, { useState } from 'react';
import { 
    Text, 
    View, 
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Button,
    TouchableOpacity
    
    } from 'react-native'
  
  export default function ViewAttendanceHistoryScreen() {
    const [date, setDate] = useState(new Date(1598051730000));
    const [show, setShow] = useState(false);

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode: any) => {
        setShow(true);
    };

    const showDatepicker = () => {
        showMode('date');
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={showDatepicker}
                style={{
                    backgroundColor: '#007bff',
                    padding: 10,
                    justifyContent: 'center',
                    marginRight:'auto',
                    borderRadius: 10,
                    alignItems: 'flex-start'}}
            ><Text style={{color: 'white'}} >Chọn ngày</Text></TouchableOpacity>
            <Text>selected: {date.toLocaleDateString()}</Text>
            
            {show && (
            <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={'date'}
                is24Hour={true}
                onChange={onChange}
            />
    )}
        </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
      backgroundColor: '#f2f2f2'
    }
  })
  