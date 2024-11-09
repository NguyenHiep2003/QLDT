import Checkbox from "expo-checkbox";
import { Link, router } from "expo-router";
import React, { useState, useEffect } from "react";
import { getClassList } from "@/services/api-calls/classes";
import { ROLES } from "@/constants/Roles";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TextInput,
    TouchableOpacity,
} from "react-native";

const CreateClass = () => {
    type Classes = {
        class_id: string;
        attached_code: string | null;
        class_name: string;
        class_type: string;
        lecturer_name: string;
        student_count: number;
        start_date: string;
        end_date: string;
        status: string;
    };
    const headers = [
        "Mã lớp",
        "Mã lớp kèm",
        "Tên lớp",
        "Loại lớp",
        "Giảng viên",
        "Số sinh viên",
        "Ngày bắt đầu",
        "Ngày kết thúc",
        "Trạng thái",
    ];
    const [classCode, setClassCode] = useState("");
    const [classes, setClasses] = useState<Classes[]>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await getClassList(ROLES.LECTURER);
                setClasses(data);
            } catch (error) {
                console.error("Lấy danh sách lớp thất bại:", error);
            }
        };
        fetchClasses();
    }, [classCode]);

    const handleFindClass = () => {
        if (classCode) {
            const filtered = classes.filter((cls) =>
                cls.class_id.includes(classCode)
            );
            setClasses(filtered);
        }
    };

    const handleSelectClass = (class_id: string) => {
        if (selectedClass === class_id) {
            setSelectedClass(null);
        } else {
            setSelectedClass(class_id);
        }
    };

    const handleEditClass = () => {
        if (selectedClass) {
            router.push(`/lecturer/(tabs)/class-management/${selectedClass}`);
        } else {
            console.error("Không có lớp nào được chọn để chỉnh sửa");
        }
    };

    // const handleRemoveSelected = () => {
    //     const filteredClasses = classes.filter(
    //         (item) => item.class_id !== selectedClass
    //     );
    //     setClasses(filteredClasses);
    //     setSelectedClass(null);
    // };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Mã lớp"
                    value={classCode}
                    onChangeText={setClassCode}
                />
                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleFindClass}
                >
                    <Text style={styles.buttonText}>Tìm kiếm</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal={true} style={styles.horizontalScroll}>
                <View>
                    {/* Header Row */}
                    <View style={styles.headerRow}>
                        {headers.map((header, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.headerCell,
                                    (header === "Mã lớp" ||
                                        header === "Mã lớp kèm") &&
                                        styles.headerCellClassCode,
                                ]}
                            >
                                <Text style={styles.headerText}>{header}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Table Body */}
                    <ScrollView style={styles.verticalScroll}>
                        {classes.length > 0 ? (
                            classes.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.classRow,
                                        selectedClass === item.class_id &&
                                            styles.selectedRow,
                                    ]}
                                    onPress={() =>
                                        handleSelectClass(item.class_id)
                                    }
                                >
                                    <View style={styles.cellClassCode}>
                                        <Text style={styles.classCode}>
                                            {item.class_id}
                                        </Text>
                                    </View>
                                    <View style={styles.cellClassCode}>
                                        <Text style={styles.classCode}>
                                            {item.attached_code}
                                        </Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <Text style={styles.classCode}>
                                            {item.class_name}
                                        </Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <Text style={styles.classCode}>
                                            {item.class_type}
                                        </Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <Text style={styles.classCode}>
                                            {item.lecturer_name}
                                        </Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <Text style={styles.classCode}>
                                            {item.student_count}
                                        </Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <Text style={styles.classCode}>
                                            {item.start_date}
                                        </Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <Text style={styles.classCode}>
                                            {item.end_date}
                                        </Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <Text style={styles.classCode}>
                                            {item.status}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.textNoData}>
                                Không có dữ liệu
                            </Text>
                        )}
                    </ScrollView>
                </View>
            </ScrollView>

            <View style={styles.bottomFooter}>
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={() =>
                        router.push(
                            "/lecturer/(tabs)/class-management/create-class"
                        )
                    }
                >
                    <Text style={styles.buttonText}>Tạo lớp học</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    style={styles.removeButton}
                    onPress={handleRemoveSelected}
                >
                    <Text style={styles.buttonText}>Xóa lớp</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEditClass}
                >
                    <Text style={styles.buttonText}>Chỉnh sửa</Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <Link href={"/"} style={styles.footerText}>
                Thông tin danh sách các lớp mở
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },

    inputContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 40,
        marginBottom: 20,
    },

    input: {
        flex: 2,
        color: "#c21c1c",
        borderWidth: 1,
        borderColor: "#c21c1c",
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
        fontSize: 18,
    },

    registerButton: {
        flex: 1,
        backgroundColor: "#c21c1c",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 18,
        fontStyle: "italic",
        fontWeight: "bold",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },
    horizontalScroll: {
        flex: 1,
        maxHeight: 460,
        borderColor: "#B71C1C",
        borderWidth: 1,
    },
    verticalScroll: {
        maxHeight: Dimensions.get("window").height * 0.6,
    },
    headerRow: {
        flexDirection: "row",
        backgroundColor: "#B71C1C",
    },
    headerCell: {
        width: 170,
        padding: 16,
        borderWidth: 1,
        borderColor: "#fff",
        alignItems: "center",
    },

    headerCellClassCode: {
        width: 120,
        padding: 16,
        borderWidth: 1,
        borderColor: "#fff",
        alignItems: "center",
    },

    headerText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
    },
    cell: {
        width: 170,
        height: 70,
        padding: 16,
        borderWidth: 1,
        borderColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
    },

    cellClassCode: {
        width: 120,
        height: 70,
        padding: 16,
        borderWidth: 1,
        borderColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
    },

    bottomFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        marginTop: 10,
    },
    sendButton: {
        backgroundColor: "#B71C1C",
        padding: 10,
        borderRadius: 5,
    },
    removeButton: {
        backgroundColor: "#B71C1C",
        padding: 10,
        borderRadius: 5,
    },
    editButton: {
        backgroundColor: "#c21c1c",
        padding: 10,
        borderRadius: 5,
    },
    footerText: {
        marginTop: 20,
        textAlign: "center",
        color: "#B71C1C",
        fontStyle: "italic",
        fontSize: 18,
    },
    selectedRow: {
        backgroundColor: "#EEEEEE",
    },
    checkbox: {
        width: 20,
        height: 20,
    },

    CheckboxCell: {
        width: 60,
        height: 70,
        padding: 16,
        borderWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
        justifyContent: "center",
    },

    classRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    classCode: {
        height: 70,
        textAlign: "center",
        textAlignVertical: "center",
    },

    textNoData: {
        marginLeft: 100,
        marginTop: 100,
        color: "#B71C1C",
        fontSize: 20,
    },
});

export default CreateClass;
