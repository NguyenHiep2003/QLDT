import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Link, Router, useLocalSearchParams, useRouter} from "expo-router";
import {getClassInfoResponse} from "@/types/createClassRequest";
import {editClass, getClassInfo} from "@/services/api-calls/classes";
import {getProfile} from "@/services/api-calls/profile";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";

const EditClassScreen = () => {


    useEffect(() => {
        const getInitialInfo = async () => {
            console.log(classId.toString());
            try {
                const response = await getClassInfo({
                    class_id: classId.toString(),
                });

                if (response.meta.code === 1000) {
                    setNewClassName(response.data.class_name)
                    setNewClassId(response.data.class_id)
                    setNewStatus(response.data.status)
                    setStartDate(response.data.start_date)
                    setEndDate(response.data.end_date)
                    setErrorMessage('');
                } else {
                    setErrorMessage(response.meta.message);
                }
            } catch (error) {
                setErrorMessage('Có lỗi xảy ra, vui lòng thử lại sau.');
            }
        }

        getInitialInfo().then(r => console.log(r));
    }, [])


    const [newClassName, setNewClassName] = useState('');
    const [newClassId, setNewClassId] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [errorMessage, setErrorMessage] = useState('');

    const handleEditClass = async () => {
        try {
            const response = await editClass({
                class_id: newClassId,
                class_name: newClassName,
                status: newStatus,
                start_date: startDate.toISOString().slice(0,10),
                end_date: endDate.toISOString().slice(0,10),
            })

            if (response.meta.code === 1000) {
                Alert.alert('Thành công', 'Lớp học đã cập nhật');
                setErrorMessage('');
            } else {
                setErrorMessage(response.meta.message);
            }
        } catch (error) {
            setErrorMessage('Có lỗi xảy ra, vui lòng thử lại sau.');
        }
    }

    const showStartDatePicker = () => {
        DateTimePickerAndroid.open({
            value: startDate,
            onChange: (event, selectedDate) => {
                if (event.type === 'set' && selectedDate) {
                    setStartDate(selectedDate);
                    if (endDate < selectedDate) {
                        setEndDate(selectedDate);
                    }
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>CHỈNH SỬA THÔNG TIN LỚP HỌC</Text>
            </View>
            <ScrollView
                style={styles.container}
                nestedScrollEnabled={true}
                contentContainerStyle={{ paddingBottom: 50 }}
            >
                <TextInput
                    style={styles.input}
                    placeholder="Mã lớp*"
                    value={newClassId}
                    onChangeText={setNewClassId}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Tên lớp*"
                    value={newClassName}
                    onChangeText={setNewClassName}
                />

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

                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleEditClass}
                >
                    <Text style={styles.buttonText}>Chỉnh sửa lớp học</Text>
                </TouchableOpacity>
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

export default EditClassScreen;
