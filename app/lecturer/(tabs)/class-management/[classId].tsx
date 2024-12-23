import React, { useEffect, useState } from 'react';
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
import { deleteClass, editClass, getClassInfo } from '@/services/api-calls/classes';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/core';
import { router } from 'expo-router';
import { useErrorContext } from '@/utils/ctx';

type RouteParams = {
    classId: string;
};

const EditClassScreen = () => {
    const route = useRoute();
    const classId = route.params as RouteParams;
    const statusList = [
        { label: 'Đã hoàn thành', value: 'COMPLETED' },
        { label: 'Mở đăng kí', value: 'UPCOMING' },
        { label: 'Đang diễn ra', value: 'ACTIVE' },
    ];

    useEffect(() => {
        const getInitialInfo = async () => {
            try {
                const response = await getClassInfo({
                    class_id: classId.classId,
                });

                if (response.meta.code === '1000') {
                    setNewClassName(response.data.class_name);
                    setNewClassId(response.data.class_id);
                    setNewStatus(response.data.status);
                    setStartDate(new Date(response.data.start_date));
                    setEndDate(new Date(response.data.end_date));
                    setErrorMessage('');
                } else {
                    setErrorMessage(response.meta.message);
                }
            } catch (error) {
                setErrorMessage('Có lỗi xảy ra, vui lòng thử lại sau.');
            }
        };

        getInitialInfo().then((r) => console.log(r));
    }, []);

    const [newClassName, setNewClassName] = useState('');
    const [newClassId, setNewClassId] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [errorMessage, setErrorMessage] = useState('');
    const [openStatus, setOpenStatus] = useState(false);

    const handleEditClass = async () => {
        await editClass({
            class_id: newClassId,
            class_name: newClassName,
            status: newStatus,
            start_date: startDate.toISOString().slice(0, 10),
            end_date: endDate.toISOString().slice(0, 10),
        })
            .then((response: any) => {
                if (response.meta.code === '1000') {
                    Alert.alert('Thành công', 'Lớp học đã cập nhật');
                    setErrorMessage('');
                    router.back();
                } else {
                    setErrorMessage(response.meta.message);
                }
            })
            .catch((error: any) => setUnhandledError(error));
    };

    const { setUnhandledError } = useErrorContext();
    const handleDeleteClass = async () => {
        await deleteClass(classId.classId).then((response: any) => {
            if (response.meta.code === '1000') {
                Alert.alert('Thành công', 'Lớp học đã được xóa');
                setErrorMessage('');
                router.back();
            } else {
                setErrorMessage(response.meta.message);
            }
        }).catch((error: any) => setUnhandledError(error));
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
            <ScrollView
                style={styles.container}
                nestedScrollEnabled={true}
                contentContainerStyle={{ paddingBottom: 50 }}
            >
                <TextInput
                    style={[styles.input, { backgroundColor: '#D3D3D3' }]}
                    placeholder="Mã lớp*"
                    value={newClassId}
                    editable={false}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Tên lớp*"
                    placeholderTextColor="#c21c1c"
                    value={newClassName}
                    onChangeText={setNewClassName}
                />

                <View
                    style={{ zIndex: 3000, marginBottom: openStatus ? 120 : 0 }}
                >
                    <DropDownPicker
                        open={openStatus}
                        value={newStatus}
                        items={statusList}
                        setOpen={setOpenStatus}
                        setValue={setNewStatus}
                        placeholder="Trạng thái"
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

                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleEditClass}
                >
                    <Text style={styles.buttonText}>Chỉnh sửa lớp học</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.deleteButton]}
                    onPress={() =>
                        Alert.alert(
                            "Xác nhận xóa",
                            "Bạn có chắc chắn muốn xóa lớp này không?",
                            [
                                {
                                    text: "Hủy",
                                    style: "cancel",
                                },
                                {
                                    text: "Đồng ý",
                                    onPress: handleDeleteClass,
                                    style: "destructive",
                                },
                            ]
                        )
                    }
                >
                    <Text style={styles.buttonText}>Xóa lớp học</Text>
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
        marginTop: 15,
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
    deleteButton: {
        backgroundColor: '#ff6347',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        width: '50%',
        alignSelf: 'center',
    },
});

export default EditClassScreen;
