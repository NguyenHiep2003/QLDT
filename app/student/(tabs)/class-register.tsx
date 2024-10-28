// import React, { useState } from "react";
// import { Link } from "expo-router";
// import CheckBox from "expo-checkbox";
// import {
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";

// export default function App() {
//     const [classCode, setClassCode] = useState("");
//     const [registeredClasses, setRegisteredClasses] = useState([
//         {
//             code: "CS101",
//             combinedCode: "CS101-A",
//             name: "Computer Science 101",
//         },
//         {
//             code: "CS101",
//             combinedCode: "CS101-A",
//             name: "Computer Science 101",
//         },
//         {
//             code: "CS101",
//             combinedCode: "CS101-A",
//             name: "Computer Science 101",
//         },
//         {
//             code: "CS101",
//             combinedCode: "CS101-A",
//             name: "Computer Science 101",
//         },
//         {
//             code: "MA202",
//             combinedCode: "MA202-B",
//             name: "Mathematics 202",
//         },
//         {
//             code: "PH303",
//             combinedCode: "PH303-C",
//             name: "Physics 303",
//         },
//         {
//             code: "PH303",
//             combinedCode: "PH303-C",
//             name: "Physics 303",
//         },
//         {
//             code: "PH303",
//             combinedCode: "PH303-C",
//             name: "Physics 303",
//         },
//         {
//             code: "PH303",
//             combinedCode: "PH303-C",
//             name: "Physics 303",
//         },
//         {
//             code: "PH303",
//             combinedCode: "PH303-C",
//             name: "Physics 303",
//         },
//         {
//             code: "PH303",
//             combinedCode: "PH303-C",
//             name: "Physics 303",
//         },
//         {
//             code: "PH303",
//             combinedCode: "PH303-C",
//             name: "Physics 303",
//         },
//         {
//             code: "PH303",
//             combinedCode: "PH303-C",
//             name: "Physics 303",
//         },
//         {
//             code: "PH303",
//             combinedCode: "PH303-C",
//             name: "Physics 303",
//         },
//         {
//             code: "PH303",
//             combinedCode: "PH303-C",
//             name: "Physics 303",
//         },
//     ]);
//     const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

//     const handleRegister = () => {
//         if (classCode) {
//             const newClass = {
//                 code: classCode,
//                 combinedCode: `${classCode}-ABC`,
//                 name: `New Class ${classCode}`,
//             };
//             setRegisteredClasses([...registeredClasses, newClass]);
//             setClassCode("");
//         }
//     };

//     const toggleSelectClass = (code: string) => {
//         if (selectedClasses.includes(code)) {
//             setSelectedClasses(selectedClasses.filter((item) => item !== code));
//         } else {
//             setSelectedClasses([...selectedClasses, code]);
//         }
//     };

//     const handleRemoveSelected = () => {
//         const filteredClasses = registeredClasses.filter(
//             (item) => !selectedClasses.includes(item.code)
//         );
//         setRegisteredClasses(filteredClasses);
//         setSelectedClasses([]);
//     };

//     return (
//         <View style={styles.container}>
//             {/* Nhập mã lớp và nút đăng ký */}
//             <View style={styles.inputContainer}>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Mã lớp"
//                     value={classCode}
//                     onChangeText={setClassCode}
//                 />
//                 <TouchableOpacity
//                     style={styles.registerButton}
//                     onPress={handleRegister}
//                 >
//                     <Text style={styles.buttonText}>Đăng ký</Text>
//                 </TouchableOpacity>
//             </View>

//             {/* Danh sách lớp */}
//             <View style={styles.listContainer}>
//                 {/* Header của danh sách lớp (có thể trượt ngang) */}
//                 <ScrollView style={styles.scrollViewHeader} horizontal={true}>
//                     <View style={styles.listHeader}>
//                         <Text style={styles.listHeaderText}>Mã lớp</Text>
//                         <Text style={styles.listHeaderText}>Mã lớp kèm</Text>
//                         <Text style={styles.listHeaderText}>Tên lớp</Text>
//                         <Text style={styles.listHeaderText}>Tên lớp</Text>
//                         <Text style={styles.listHeaderText}>Tên lớp</Text>
//                         <Text style={styles.listHeaderText}>Tên lớp</Text>
//                         <Text style={styles.listHeaderText}>Tên lớp</Text>
//                     </View>
//                 </ScrollView>

//                 {/* Nội dung danh sách lớp (có thể trượt dọc và ngang) */}
//                 <View style={styles.listView}>
//                     <ScrollView style={styles.scrollViewList}>
//                         <ScrollView horizontal={true}>
//                             <View>
//                                 {registeredClasses.length === 0 ? (
//                                     <Text style={styles.emptyText}>
//                                         Sinh viên chưa đăng ký lớp nào
//                                     </Text>
//                                 ) : (
//                                     registeredClasses.map((item, index) => (
//                                         <View
//                                             key={index}
//                                             style={styles.classRow}
//                                         >
//                                             <CheckBox
//                                                 color={"#B71C1C"}
//                                                 value={selectedClasses.includes(
//                                                     item.code
//                                                 )}
//                                                 onValueChange={() =>
//                                                     toggleSelectClass(item.code)
//                                                 }
//                                                 style={styles.checkbox}
//                                             />
//                                             <Text style={styles.classCode}>
//                                                 {item.code}
//                                             </Text>
//                                             <Text style={styles.classCode}>
//                                                 {item.combinedCode}
//                                             </Text>
//                                             <Text style={styles.classCode}>
//                                                 {item.name}
//                                             </Text>
//                                         </View>
//                                     ))
//                                 )}
//                             </View>
//                         </ScrollView>
//                     </ScrollView>
//                 </View>
//             </View>

//             {/* Nút gửi đăng ký và xóa lớp */}
//             <View style={styles.bottomFooter}>
//                 <TouchableOpacity style={styles.sendButton}>
//                     <Text style={styles.buttonText}>Gửi đăng ký</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={styles.removeButton}
//                     onPress={handleRemoveSelected}
//                 >
//                     <Text style={styles.buttonText}>Xóa lớp</Text>
//                 </TouchableOpacity>
//             </View>

//             {/* Footer */}
//             <Link href={"/"} style={styles.footerText}>
//                 Thông tin danh sách các lớp mở
//             </Link>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: "#fff",
//     },
//     inputContainer: {
//         display: "flex",
//         flexDirection: "row",
//         alignItems: "center",
//         marginTop: 40,
//         marginBottom: 20,
//     },
//     input: {
//         flex: 2,
//         color: "#c21c1c",
//         borderWidth: 1,
//         borderColor: "#c21c1c",
//         padding: 10,
//         borderRadius: 5,
//         marginRight: 10,
//         fontSize: 18,
//     },
//     registerButton: {
//         flex: 1,
//         backgroundColor: "#c21c1c",
//         padding: 10,
//         borderRadius: 5,
//     },
//     buttonText: {
//         color: "#fff",
//         textAlign: "center",
//         fontSize: 18,
//         fontStyle: "italic",
//         fontWeight: "bold",
//     },
//     listContainer: {
//         padding: 10,
//         marginBottom: 20,
//     },
//     listHeader: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginBottom: 10,
//         paddingVertical: 10,
//         backgroundColor: "#c21c1c",
//     },
//     scrollViewHeader: {
//         marginBottom: 20,
//     },
//     listHeaderText: {
//         fontWeight: "bold",
//         marginHorizontal: 6,
//         color: "#fff",
//         padding: 16,
//     },
//     scrollViewList: {},
//     listView: {
//         height: 320,
//         borderWidth: 1,
//         borderColor: "#c21c1c",
//         padding: 10,
//         borderRadius: 10,
//         shadowColor: "#000",
//     },
//     emptyText: {
//         textAlign: "center",
//         color: "#c21c1c",
//         fontStyle: "italic",
//         fontSize: 20,
//     },
//     classRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginBottom: 10,
//     },
//     classCode: {
//         marginLeft: 20,
//     },
//     checkbox: {
//         width: 20,
//         height: 20,
//         borderWidth: 1,
//         borderColor: "#ccc",
//         marginRight: 10,
//     },
//     checkboxSelected: {
//         backgroundColor: "#B71C1C",
//     },
//     bottomFooter: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginBottom: 10,
//     },
//     sendButton: {
//         backgroundColor: "#B71C1C",
//         padding: 10,
//         borderRadius: 5,
//     },
//     removeButton: {
//         backgroundColor: "#B71C1C",
//         padding: 10,
//         borderRadius: 5,
//     },
//     footerText: {
//         marginTop: 20,
//         textAlign: "center",
//         color: "#B71C1C",
//         fontStyle: "italic",
//         fontSize: 18,
//     },
// });
import Checkbox from "expo-checkbox";
import { Link } from "expo-router";
import React, { useState } from "react";
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
    // Mock data
    const headers = ["Mã lớp", "Mã lớp kèm", "Tên lớp"];
    const [classCode, setClassCode] = useState("");
    const [registeredClasses, setRegisteredClasses] = useState([
        {
            code: "IT4788",
            combinedCode: "IT4788",
            name: "Phát triển ứng dụng đa nền tảng",
        },
        {
            code: "IT4000",
            combinedCode: "IT4000",
            name: "Lập trình hướng đối tượng",
        },
        {
            code: "IT3080",
            combinedCode: "IT3080",
            name: "Cấu trúc dữ liệu và giải thuật",
        },
    ]);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

    const handleRegister = () => {
        if (classCode) {
            const newClass = {
                code: classCode,
                combinedCode: `${classCode}-ABC`,
                name: `New Class ${classCode}`,
            };
            setRegisteredClasses([...registeredClasses, newClass]);
            setClassCode("");
        }
    };

    const toggleSelectClass = (code: string) => {
        if (selectedClasses.includes(code)) {
            setSelectedClasses(selectedClasses.filter((item) => item !== code));
        } else {
            setSelectedClasses([...selectedClasses, code]);
        }
    };

    const handleRemoveSelected = () => {
        const filteredClasses = registeredClasses.filter(
            (item) => !selectedClasses.includes(item.code)
        );
        setRegisteredClasses(filteredClasses);
        setSelectedClasses([]);
    };

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
                            <View key={index} style={styles.headerCell}>
                                <Text style={styles.headerText}>{header}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Table Body */}
                    <ScrollView style={styles.verticalScroll}>
                        {registeredClasses.map((item, index) => (
                            <View key={index} style={styles.classRow}>
                                <View style={styles.cell}>
                                    <Text style={styles.classCode}>
                                        {item.code}
                                    </Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={styles.classCode}>
                                        {item.combinedCode}
                                    </Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={styles.classCode}>
                                        {item.name}
                                    </Text>
                                </View>
                                <View style={styles.CheckboxCell}>
                                    <Checkbox
                                        color={"#B71C1C"}
                                        value={selectedClasses.includes(
                                            item.code
                                        )}
                                        onValueChange={() =>
                                            toggleSelectClass(item.code)
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
                <TouchableOpacity style={styles.sendButton}>
                    <Text style={styles.buttonText}>Gửi đăng ký</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={handleRemoveSelected}
                >
                    <Text style={styles.buttonText}>Xóa</Text>{" "}
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
        borderRadius: 10,
    },
    verticalScroll: {
        maxHeight: Dimensions.get("window").height * 0.6,
    },
    headerRow: {
        flexDirection: "row",
        backgroundColor: "#B71C1C",
    },
    headerCell: {
        width: 160,
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
        width: 160,
        height: 60,
        padding: 16,
        borderWidth: 1,
        borderColor: "#ddd",
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
        height: 60,
        padding: 16,
        borderWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
    },

    classRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    classCode: {
        flexWrap: "wrap",
    },
});

export default CreateClass;
