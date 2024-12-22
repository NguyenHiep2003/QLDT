import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Link, router } from 'expo-router';
import { createClass } from '@/services/api-calls/classes';
import { createClassResponse } from '@/types/createClassRequest';
import { useErrorContext } from '@/utils/ctx';

const CreateClassScreen = () => {
    const calculateEndDate = (start: any) => {
        const end = new Date(start);
        end.setDate(end.getDate() + 17 * 7);
        return end;
    };

    const [className, setClassName] = useState('');
    const [classId, setClassId] = useState('');
    const [classType, setClassType] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(calculateEndDate(startDate));
    const [maxStudents, setMaxStudents] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openClassType, setOpenClassType] = useState(false);
    const { setUnhandledError } = useErrorContext();

    const classTypeItems = [
        { label: 'LT', value: 'LT' },
        { label: 'BT', value: 'BT' },
        { label: 'LT+BT', value: 'LT_BT' },
    ];

    const showStartDatePicker = () => {
        DateTimePickerAndroid.open({
            value: startDate,
            onChange: (event, selectedDate) => {
                if (event.type === 'set' && selectedDate) {
                    setStartDate(selectedDate);
                    const newEndDate = calculateEndDate(selectedDate);
                    setEndDate(newEndDate);
                }
            },
            mode: 'date',
            // minimumDate: new Date(),
        });
    };

    const showEndDatePicker = () => {
        DateTimePickerAndroid.open({
            value: endDate,
            onChange: (event, selectedDate) => {
                if (event.type === 'set' && selectedDate) {
                    setEndDate(selectedDate);
                }
            },
            mode: 'date',
            minimumDate: startDate,
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('vi-VN');
    };

    const handleCreateClass = async () => {
        if (!className || !classId || !classType || !startDate || !endDate) {
            setErrorMessage('Vui lòng điền đầy đủ thông tin');
        } else if (startDate >= endDate) {
            setErrorMessage('Ngày kết thúc phải sau ngày bắt đầu');
        } else if (parseInt(maxStudents) > 50) {
            setErrorMessage('Số lượng sinh viên tối đa không được vượt quá 50');
        } else if (classId.length != 6) {
            setErrorMessage('Mã lớp phải có 6 ký tự');
        } else {
            await createClass({
                class_id: classId,
                class_type: classType,
                class_name: className,
                start_date: startDate.toISOString().slice(0, 10),
                end_date: endDate.toISOString().slice(0, 10),
                max_student_amount: parseInt(maxStudents),
            })
                .then((response: any) => {
                    if (response.meta.code === '1000') {
                        Alert.alert('Thành công', 'Lớp học đã được tạo');
                        setErrorMessage('');
                        router.push(`/lecturer/(tabs)/class-management`);
                    }
                })
                .catch((error: any) => {
                    const errorCode = error.rawError?.meta?.code;
                    if (errorCode == 1004) {
                        error?.setTitle('Lỗi');
                        error?.setContent('Mã lớp đã tồn tại');
                    } else {
                        error?.setTitle('Lỗi');
                        error?.setContent(
                            'Có lỗi xảy ra, vui lòng thử lại sau'
                        );
                    }
                    setUnhandledError(error);
                });
        }
    };

    const handleNumberInput = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setMaxStudents(numericValue);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                nestedScrollEnabled={true}
                contentContainerStyle={{ paddingBottom: 50 }}
            >
                <TextInput
                    style={styles.input}
                    placeholder="Mã lớp*"
                    placeholderTextColor="#c21c1c"
                    value={classId}
                    onChangeText={setClassId}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Tên lớp*"
                    placeholderTextColor="#c21c1c"
                    value={className}
                    onChangeText={setClassName}
                />

                {/* Class Type Dropdown */}
                <View
                    style={{
                        zIndex: 3000,
                        marginBottom: openClassType ? 120 : 0,
                    }}
                >
                    <DropDownPicker
                        open={openClassType}
                        value={classType}
                        items={classTypeItems}
                        setOpen={setOpenClassType}
                        setValue={setClassType}
                        placeholder="Loại lớp"
                        style={[
                            styles.dropdown,
                            { marginBottom: 10, zIndex: 1000 },
                        ]}
                        textStyle={styles.dropdownText}
                        dropDownContainerStyle={[
                            styles.dropdownContainer,
                            {
                                elevation: 5,
                                shadowColor: '#000',
                                shadowOpacity: 0.2,
                            },
                        ]}
                        listMode="MODAL"
                    />
                </View>

                <View style={styles.datePickerContainer}>
                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={showStartDatePicker}
                    >
                        <Text style={styles.dateText}>
                            Ngày bắt đầu: {formatDate(startDate)}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={showEndDatePicker}
                    >
                        <Text style={styles.dateText}>
                            Ngày kết thúc: {formatDate(endDate)}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Số lượng sinh viên tối đa*"
                    placeholderTextColor="#c21c1c"
                    value={maxStudents}
                    onChangeText={handleNumberInput}
                    keyboardType="numeric"
                />
                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleCreateClass}
                >
                    <Text style={styles.buttonText}>Tạo lớp học</Text>
                </TouchableOpacity>

                {/*<Link href={'/'} style={styles.classOpen}>*/}
                {/*    Thông tin danh sách lớp mở*/}
                {/*</Link>*/}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        backgroundColor: '#c21c1c',
        paddingVertical: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 20,
        color: 'white',
    },
    container: {
        marginTop: 15,
        flex: 1,
        paddingHorizontal: 20,
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        borderColor: '#c21c1c',
        color: '#c21c1c',
    },
    dropdownSection: {
        marginBottom: 10,
    },

    dropdownText: {
        color: '#c21c1c',
    },

    halfWidth: {
        width: '48%',
    },
    button: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        zIndex: -1,
        width: '50%',
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        zIndex: -1,
    },
    classOpen: {
        color: '#c21c1c',
        zIndex: -1,
        textAlign: 'center',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    dropdown: {
        borderColor: '#c21c1c',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
        borderStyle: 'solid',
    },
    dropdownContainer: {
        borderColor: '#ccc',
        backgroundColor: '#c21c1c',
        borderRadius: 5,
    },
    datePickerContainer: {
        marginBottom: 10,
        zIndex: -1,
    },
    dateInput: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        borderColor: '#c21c1c',
        backgroundColor: 'white',
    },
    dateText: {
        color: '#c21c1c',
    },
});

export default CreateClassScreen;
