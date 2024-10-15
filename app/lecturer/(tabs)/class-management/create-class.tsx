import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Link} from "expo-router";

const CreateClassScreen = () => {
    const [className, setClassName] = useState('');
    const [classId, setClassId] = useState('');
    const [additionalClassId, setAdditionalClassId] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [classType, setClassType] = useState(null);
    const [startPeriod, setStartPeriod] = useState(null);
    const [endPeriod, setEndPeriod] = useState(null);
    const [maxStudents, setMaxStudents] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [openClassType, setOpenClassType] = useState(false);
    const [openStartPeriod, setOpenStartPeriod] = useState(false);
    const [openEndPeriod, setOpenEndPeriod] = useState(false);

    const classTypeItems = [
        { label: 'LT', value: 'LT' },
        { label: 'BT', value: 'BT' },
        { label: 'LT+BT', value: 'LTBT' },
        { label: 'TN', value: 'TN' },
        { label: 'DA', value: 'DA' },
    ];

    const periodItems = Array.from({ length: 12 }, (_, i) => ({
        label: `Tiết ${i + 1}`,
        value: `${i + 1}`,
    }));

    const handleCreateClass = () => {
        if (!className || !classId || !subjectId || !classType || !startPeriod || !endPeriod) {
            setErrorMessage('Vui lòng điền đầy đủ thông tin');
        } else if (parseInt(startPeriod) > parseInt(endPeriod)) {
            setErrorMessage('Tiết bắt đầu phải nhỏ hơn hoặc bằng tiết kết thúc');
        } else {
            // Call API
            Alert.alert('Thành công', 'Lớp học đã được tạo');
            setErrorMessage('');
        }
    };

    const handleNumberInput = (text: string) => {
        // Allow only numbers
        const numericValue = text.replace(/[^0-9]/g, "");
        setMaxStudents(numericValue);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>CREATE CLASS</Text>
            </View>
            <ScrollView style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Mã lớp*"
                    value={classId}
                    onChangeText={setClassId}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mã lớp kèm*"
                    value={additionalClassId}
                    onChangeText={setAdditionalClassId}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Tên lớp*"
                    value={className}
                    onChangeText={setClassName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mã học phần*"
                    value={subjectId}
                    onChangeText={setSubjectId}
                />
                <View style={styles.dropdownSection}>
                    <DropDownPicker
                        open={openClassType}
                        value={classType}
                        items={classTypeItems}
                        setOpen={setOpenClassType}
                        setValue={setClassType}
                        placeholder="Loại lớp"
                        style={styles.dropdown}
                        textStyle={styles.dropdownText}
                        dropDownContainerStyle={styles.dropdownContainer}
                        zIndex={3000}
                    />
                </View>
                <View style={styles.rowContainer}>
                    <View style={[styles.dropdownSection, styles.halfWidth]}>
                        <DropDownPicker
                            open={openStartPeriod}
                            value={startPeriod}
                            items={periodItems}
                            setOpen={setOpenStartPeriod}
                            setValue={setStartPeriod}
                            placeholder="Tiết bắt đầu"
                            style={styles.dropdown}
                            textStyle={styles.dropdownText}
                            dropDownContainerStyle={styles.dropdownContainer}
                            zIndex={10}
                        />
                    </View>
                    <View style={[styles.dropdownSection, styles.halfWidth]}>
                        <DropDownPicker
                            open={openEndPeriod}
                            value={endPeriod}
                            items={periodItems}
                            setOpen={setOpenEndPeriod}
                            setValue={setEndPeriod}
                            placeholder="Tiết kết thúc"
                            style={styles.dropdown}
                            textStyle={styles.dropdownText}
                            dropDownContainerStyle={styles.dropdownContainer}
                            zIndex={10}
                        />
                    </View>

                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Số lượng sinh viên tối đa*"
                    value={maxStudents}
                    onChangeText={handleNumberInput}
                    keyboardType='numeric'
                />
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                <TouchableOpacity style={styles.button} onPress={handleCreateClass}>
                    <Text style={styles.buttonText}>Tạo lớp học</Text>
                </TouchableOpacity>

                <Link href={"/student"} style={styles.classOpen}>Thông tin danh sách lớp mở</Link>

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
        color: '#c21c1c'
    },
    dropdownSection: {
        marginBottom: 10,
        zIndex: 3000,
    },
    dropdown: {
        borderColor: '#c21c1c',
    },
    dropdownText: {
        color: '#c21c1c',
    },
    dropdownContainer: {
        borderColor: '#c21c1c',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        width: "50%",
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        zIndex: -1
    },
    classOpen: {
        color: '#c21c1c',
        zIndex: -1,
        textAlign: "center"
    }
});

export default CreateClassScreen;
