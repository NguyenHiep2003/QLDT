import Checkbox from "expo-checkbox";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Alert,
} from "react-native";
import {
    getBasicClassInfo,
    registerClass,
} from "../../../services/api-calls/classes";
import {
    getClassInfoRequest,
    getClassInfoResponse,
} from "@/types/createClassRequest";

const CreateClass = () => {
    const headers = [
        "Mã lớp",
        "Tên lớp",
        "Loại lớp",
        "Ngày bắt đầu",
        "Ngày kết thúc",
        "Tình trạng",
        "Trạng thái",
    ];

    const [classCode, setClassCode] = useState<string>("");
    const [registeredClasses, setRegisteredClasses] = useState<
        getClassInfoResponse["data"][]
    >([]);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

    const handleRegister = async () => {
        if (classCode) {
            try {
                const data: getClassInfoResponse = await getBasicClassInfo({
                    class_id: classCode,
                });
                const newClass = data.data;
                setRegisteredClasses([...registeredClasses, newClass]);
                setClassCode("");
                Keyboard.dismiss();
            } catch (error) {
                Keyboard.dismiss();
                Alert.alert("Lấy thông tin lớp thất bại");
            }
        }
    };

    const toggleSelectClass = (class_id: string) => {
        if (selectedClasses.includes(class_id)) {
            setSelectedClasses(
                selectedClasses.filter((item) => item !== class_id)
            );
        } else {
            setSelectedClasses([...selectedClasses, class_id]);
        }
    };

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedClasses([]);
        } else {
            const allClassIds = registeredClasses.map((cls) => cls.class_id);
            setSelectedClasses(allClassIds);
        }
        setIsAllSelected(!isAllSelected);
    };

    const handleSendRegister = async () => {
        try {
            const class_ids = registeredClasses.map((cls) => cls.class_id);
            const data = await registerClass(class_ids);
            Alert.alert("Gửi đăng ký thành công");

            updateClassStatusRegister(data);
        } catch (error) {
            Alert.alert("Gửi đăng ký thất bại");
        }
    };

    const handleRemoveSelected = () => {
        const filteredClasses = registeredClasses.filter(
            (item) => !selectedClasses.includes(item.class_id)
        );
        setRegisteredClasses(filteredClasses);
        setSelectedClasses([]);
    };

    const formatDate = (dateString: any) => {
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    };

    const updateClassStatusRegister = (
        response: { class_id: string; status: string }[]
    ) => {
        console.log("response:", response);
        const updatedClasses = registeredClasses.map((cls) => {
            const found = response.find(
                (item) => item.class_id === cls.class_id
            );
            if (found) {
                console.log("found:", found);
                return { ...cls, statusRegister: found.status };
            }
            return cls;
        });
        setRegisteredClasses(updatedClasses);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập mã lớp"
                    value={classCode}
                    onChangeText={setClassCode}
                />
                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleRegister}
                >
                    <Text style={styles.buttonText}>Đăng ký</Text>
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
                                        header === "Loại lớp" ||
                                        header === "Số sinh viên" ||
                                        header === "Tình trạng" ||
                                        header === "Trạng thái") &&
                                        styles.headerCellClassCode,
                                ]}
                            >
                                <Text style={styles.headerText}>{header}</Text>
                            </View>
                        ))}
                        <View style={styles.CheckboxHeaderCell}>
                            <Checkbox
                                color={isAllSelected ? "green" : "white"}
                                value={isAllSelected}
                                onValueChange={handleSelectAll}
                                style={styles.checkbox}
                            />
                        </View>
                    </View>

                    {/* Table Body */}
                    <ScrollView style={styles.verticalScroll}>
                        {registeredClasses.map((item, index) => (
                            <View key={index} style={styles.classRow}>
                                <View style={styles.cellClassCode}>
                                    <Text style={styles.classCode}>
                                        {item.class_id}
                                    </Text>
                                </View>

                                <View style={styles.cell}>
                                    <Text style={styles.classCode}>
                                        {item.class_name}
                                    </Text>
                                </View>
                                <View style={styles.cellClassCode}>
                                    <Text style={styles.classCode}>
                                        {item.class_type}
                                    </Text>
                                </View>

                                <View style={styles.cell}>
                                    <Text style={styles.classCode}>
                                        {formatDate(item.start_date)}
                                    </Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={styles.classCode}>
                                        {formatDate(item.end_date)}
                                    </Text>
                                </View>
                                <View style={styles.cellClassCode}>
                                    <Text style={styles.classCode}>
                                        {item.status}
                                    </Text>
                                </View>

                                <View style={styles.cellClassCode}>
                                    <Text style={styles.classCode}>
                                        {item.statusRegister
                                            ? item.statusRegister === "SUCCESS"
                                                ? "Thành công"
                                                : "Hết chỗ"
                                            : ""}
                                    </Text>
                                </View>

                                <View style={styles.CheckboxCell}>
                                    <Checkbox
                                        color={"#B71C1C"}
                                        value={selectedClasses.includes(
                                            item.class_id
                                        )}
                                        onValueChange={() =>
                                            toggleSelectClass(item.class_id)
                                        }
                                        style={styles.checkbox}
                                    />
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            <View style={styles.bottomFooter}>
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendRegister}
                >
                    <Text style={styles.buttonText}>Gửi đăng ký</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={handleRemoveSelected}
                >
                    <Text style={styles.buttonText}>Xóa lớp</Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <Link
                href={"/student/openClasses" as any}
                style={styles.footerText}
            >
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
    footerText: {
        marginTop: 20,
        textAlign: "center",
        color: "#B71C1C",
        fontStyle: "italic",
        fontSize: 18,
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

    CheckboxHeaderCell: {
        width: 60,

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
});

export default CreateClass;
