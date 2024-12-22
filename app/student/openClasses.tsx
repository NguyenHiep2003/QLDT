import Checkbox from "expo-checkbox";
import { Link, router } from "expo-router";
import React, { useState, useEffect } from "react";
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
    getOpenClassList,
    getOpenClassByFilter,
} from "../../services/api-calls/classes";
import RNPickerSelect from "react-native-picker-select";
import {
    getClassInfoRequest,
    getClassOpenResponse,
} from "@/types/createClassRequest";
import { set } from "lodash";
import { Icon } from "react-native-elements";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

const OpenClasses = () => {
    const headers = [
        "Mã lớp",
        "Tên lớp",
        "Loại lớp",
        "Giảng viên",
        "Số sinh viên",
        "Ngày bắt đầu",
        "Ngày kết thúc",
        "Trạng thái",
    ];
    const [className, setClassName] = useState<string>("");
    // const [classID, setClassID] = useState<string>("");
    const [openClasses, setOpenClasses] = useState<
        getClassOpenResponse["data"]["page_content"]
    >([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedClassType, setSelectedClassType] = useState("");

    useEffect(() => {
        const fetchOpenClasses = async () => {
            try {
                const pageable_request = {
                    page: currentPage,
                    page_size: 10,
                };
                const data = await getOpenClassList(pageable_request);
                if ("data" in data) {
                    setOpenClasses(data.data.page_content);
                } else {
                    Alert.alert(
                        "Không tìm thấy dữ liệu lớp:",
                        data.meta.message
                    );
                }
            } catch (error) {
                console.error("Lấy danh sách lớp thất bại:", error);
            }
        };
        fetchOpenClasses();
    }, []);
    useEffect(() => {
        const fetchOpenClassesByFilter = async () => {
            try {
                const pageable_request = {
                    page: currentPage,
                    page_size: 10,
                };
                const data = await getOpenClassByFilter({
                    class_id: null,
                    class_name: className,
                    class_type: selectedClassType ? selectedClassType : null,
                    status: selectedStatus ? selectedStatus : null,
                    pageable_request: pageable_request,
                });
                if ("data" in data) {
                    setTotalPages(data.data?.page_info?.total_page as any);
                    setOpenClasses(data.data?.page_content);
                } else {
                    Alert.alert(
                        "Không tìm thấy dữ liệu lớp:",
                        data.meta.message
                    );
                }
            } catch (error) {
                console.error("Lấy danh sách lớp thất bại:", error);
            }
        };
        fetchOpenClassesByFilter();
    }, [selectedStatus, selectedClassType, currentPage]);

    const handleFindClass = async () => {
        if (className) {
            try {
                const pageable_request = {
                    page: currentPage,
                    page_size: 10,
                };
                const data = await getOpenClassByFilter({
                    class_id: null,
                    class_name: className,
                    class_type: selectedClassType ? selectedClassType : null,
                    status: selectedStatus ? selectedStatus : null,
                    pageable_request: pageable_request,
                });
                Keyboard.dismiss();
                if ("data" in data) {
                    setTotalPages(data.data?.page_info?.total_page as any);
                    setOpenClasses(data.data?.page_content);
                } else {
                    Alert.alert(
                        "Không tìm thấy dữ liệu lớp:",
                        data.meta.message
                    );
                }
                setCurrentPage(0);
            } catch (error) {
                console.error("Lấy danh sách lớp thất bại:", error);
            }
        }
    };

    const formatDate = (dateString: any) => {
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    };

    const handlePageChange = (page: number) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const getDisplayedPages = () => {
        const pages = [];
        const delta = 2;

        const range = delta + 4;
        const numberTruncateLeft = currentPage - delta;
        const numberTruncateRight = currentPage + delta;

        if (totalPages <= 2 * range - 1) {
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        if (numberTruncateLeft >= 3 && numberTruncateRight < totalPages - 3) {
            pages.push(0, "...");
            for (let i = numberTruncateLeft; i <= numberTruncateRight; i++) {
                pages.push(i);
            }
            pages.push("...", Number(totalPages - 1));
        } else if (currentPage < range) {
            for (let i = 0; i < range; i++) {
                pages.push(i);
            }
            pages.push("...", Number(totalPages - 1));
        } else if (currentPage >= range) {
            pages.push(0, "...");
            for (let i = totalPages - range; i < totalPages; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tên lớp"
                    value={className}
                    onChangeText={setClassName}
                />
                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleFindClass}
                >
                    <Text style={styles.buttonText}>Tìm kiếm</Text>
                </TouchableOpacity>
            </View>

            {/* <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập mã lớp"
                    value={classID}
                    onChangeText={setClassID}
                />
                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleFindClass}
                >
                    <Text style={styles.buttonText}>Tìm kiếm</Text>
                </TouchableOpacity>
            </View> */}

            <View style={styles.styleDropdown}>
                <RNPickerSelect
                    onValueChange={(value) => setSelectedStatus(value)}
                    items={[
                        { label: "Active", value: "ACTIVE" },
                        { label: "Completed", value: "COMPLETED" },
                        { label: "Upcoming", value: "UPCOMING" },
                    ]}
                    value={selectedStatus}
                    style={pickerSelectStylesStatus}
                    placeholder={{
                        label: "Chọn trạng thái...",
                        value: null,
                        color: "#B71C1C",
                    }}
                    Icon={() => (
                        <AntDesign name="caretdown" size={18} color="#B71C1C" />
                    )}
                    useNativeAndroidPickerStyle={false}
                />

                <RNPickerSelect
                    onValueChange={(value) => setSelectedClassType(value)}
                    items={[
                        { label: "LT", value: "LT" },
                        { label: "BT", value: "BT" },
                        { label: "LT_BT", value: "LT_BT" },
                    ]}
                    value={selectedClassType}
                    style={pickerSelectStylesType}
                    placeholder={{
                        label: "Chọn loại lớp...",
                        value: null,
                        color: "#B71C1C",
                    }}
                    Icon={() => (
                        <AntDesign name="caretdown" size={18} color="#B71C1C" />
                    )}
                    useNativeAndroidPickerStyle={false}
                />
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
                                        header === "Trạng thái") &&
                                        styles.headerCellClassCode,
                                ]}
                            >
                                <Text style={styles.headerText}>{header}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Table Body */}
                    <ScrollView style={styles.verticalScroll}>
                        {openClasses.length > 0 ? (
                            openClasses.map((item, index) => (
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
                                            {item.lecturer_name}
                                        </Text>
                                    </View>
                                    <View style={styles.cellClassCode}>
                                        <Text style={styles.classCode}>
                                            {item.student_count}
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
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noDataText}>
                                Không có dữ liệu lớp nào được tìm thấy.
                            </Text>
                        )}
                    </ScrollView>
                </View>
            </ScrollView>
            <View style={styles.paginationContainer}>
                <TouchableOpacity
                    style={[
                        styles.paginationButton,
                        currentPage === 0
                            ? styles.disabledButton
                            : styles.activePreviousNextButton,
                    ]}
                    onPress={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    <Text
                        style={
                            currentPage === 0
                                ? styles.nonActiveButtonNextPreText
                                : styles.activeButtonNextPreText
                        }
                    >
                        {"<"}
                    </Text>
                </TouchableOpacity>

                {getDisplayedPages().map((page, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.paginationButton,
                            page === currentPage
                                ? styles.activeButton
                                : styles.nonActiveButton,
                            typeof page === "string" && {
                                backgroundColor: "white",
                            },
                        ]}
                        onPress={() =>
                            typeof page === "number" && handlePageChange(page)
                        }
                        disabled={typeof page !== "number"}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                page === currentPage
                                    ? styles.activeButtonText
                                    : styles.nonActiveButtonText,
                            ]}
                        >
                            {page}
                        </Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity
                    style={[
                        styles.paginationButton,
                        currentPage === totalPages - 1
                            ? styles.disabledButton
                            : styles.activePreviousNextButton,
                    ]}
                    onPress={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                >
                    <Text
                        style={
                            currentPage === totalPages - 1
                                ? styles.nonActiveButtonNextPreText
                                : styles.activeButtonNextPreText
                        }
                    >
                        {">"}
                    </Text>
                </TouchableOpacity>
            </View>
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
        marginTop: 20,
        flex: 1,
        maxHeight: 400,
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
    styleDropdown: {
        // display: "flex",
        // flexDirection: "row",
        // justifyContent: "space-between",
    },

    paginationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    paginationButton: {
        padding: 6,
        borderRadius: 5,
        marginHorizontal: 2,

        backgroundColor: "#B71C1C",
    },
    activeButton: {},
    nonActiveButton: {
        backgroundColor: "white",
    },
    disabledButton: {
        backgroundColor: "white",
    },
    activePreviousNextButton: {
        backgroundColor: "white",
    },
    activeButtonText: {
        color: "#fff",
    },
    nonActiveButtonText: {
        color: "#ccc",
    },
    activeButtonNextPreText: {
        color: "#B71C1C",
        fontSize: 24,
        fontWeight: "bold",
    },
    nonActiveButtonNextPreText: {
        color: "#ccc",
        fontSize: 24,
        fontWeight: "bold",
    },
    noDataText: {
        marginLeft: 40,
        marginVertical: 20,
        fontSize: 16,
        color: "#B71C1C",
    },
});

const pickerSelectStylesStatus = StyleSheet.create({
    inputAndroid: {
        display: "flex",
        width: 200,
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#B71C1C",
        borderRadius: 5,
        color: "#B71C1C",
    },
    placeholder: {
        color: "#aaa",
        fontSize: 18,
    },
    iconContainer: {
        width: 200,
        top: 12,
    },
});

const pickerSelectStylesType = StyleSheet.create({
    inputAndroid: {
        display: "flex",
        width: 200,
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#B71C1C",
        borderRadius: 5,
        color: "#B71C1C",
    },
    placeholder: {
        color: "#aaa",
        fontSize: 18,
    },
    iconContainer: {
        width: 200,
        top: 12,
    },
});

export default OpenClasses;
