import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Modal,
    Animated,
    Alert,
    Share,
    Clipboard,
    Linking,
} from "react-native";
import { getTokenLocal } from "@/services/storages/token";
import * as DocumentPicker from "expo-document-picker";
import {
    getMaterialList,
    uploadMaterial,
    deleteMaterial,
} from "@/services/api-calls/material";
import {
    MaterialCommunityIcons,
    AntDesign,
    MaterialIcons,
} from "@expo/vector-icons";
import { Dialog } from "react-native-elements";
import { set } from "lodash";

export default function ViewDocumentScreen() {
    const { classId } = useLocalSearchParams();
    const [documents, setDocuments] = useState<any[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const slideAnim = useRef(new Animated.Value(0)).current;

    const fetchDocuments = async () => {
        try {
            const data = await getMaterialList(classId as string);
            setDocuments(data.data);
        } catch (error) {
            Alert.alert("Lỗi khi lấy danh sách tài liệu");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchDocuments();
    }, [classId]);

    const handleUploadDocument = async () => {
        setIsLoading(true);
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
            });
            const token = await getTokenLocal();
            if (!result.canceled) {
                console.log("first result", result);

                const formData = new FormData();
                formData.append("file", {
                    uri: result.assets[0].uri,
                    name: result.assets[0].name,
                    type:
                        result.assets[0].mimeType || "application/octet-stream",
                } as any);

                formData.append("token", token as string);
                formData.append("classId", classId as string);
                formData.append("title", result.assets[0].name.split(".")[0]);
                formData.append(
                    "description",
                    result.assets[0].name.split(".")[0]
                );
                formData.append(
                    "materialType",
                    result.assets[0].name.split(".")[1]
                );

                const response = await uploadMaterial(formData);
                console.log("first response", response);

                if (!response) {
                    throw new Error("Failed to upload document");
                }
                Alert.alert("Tải lên tài liệu thành công");
                fetchDocuments();
            }
        } catch (error) {
            Alert.alert("Lỗi khi tải lên tài liệu");
        }
    };

    const handleOpenDocument = (document: any) => {
        if (document?.material_link) {
            Linking.openURL(document.material_link).catch((err) =>
                Alert.alert("Lỗi khi mở tài liệu")
            );
        } else {
            console.log("Không có liên kết tài liệu để mở");
        }
    };

    const handleDeleteDocument = () => {
        Alert.alert("Xóa tài liệu", "Bạn có chắc chắn muốn xóa tài liệu này?", [
            {
                text: "Hủy",
                style: "cancel",
            },
            {
                text: "Xóa",
                onPress: () => {
                    setIsLoading(true);
                    deleteMaterial(selectedDocument.id);
                    Alert.alert("Đã xóa tài liệu");
                    fetchDocuments();
                    closeModal();
                    console.log("Đã xóa tài liệu:", selectedDocument);
                },
                style: "destructive",
            },
        ]);
    };

    const handleShareDocument = async () => {
        try {
            await Share.share({
                message: `Tài liệu: ${selectedDocument?.name}`,
                url: selectedDocument?.material_link,
            });
        } catch (error) {
            Alert.alert("Lỗi khi chia sẻ tài liệu:");
        }
    };

    const handleCopyLink = () => {
        Clipboard.setString(selectedDocument?.material_link);
        Alert.alert("Đã sao chép liên kết vào clipboard");
    };

    const openModal = (document: any) => {
        setSelectedDocument(document);
        setModalVisible(true);
        Animated.timing(slideAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setModalVisible(false));
    };

    const icon = (type: string) => {
        switch (type) {
            case "docx":
                return (
                    <MaterialCommunityIcons
                        name="microsoft-word"
                        size={30}
                        color="#007bff"
                        style={styles.icon}
                    />
                );
            case "pdf":
                return (
                    <MaterialCommunityIcons
                        name="file-pdf-box"
                        size={38}
                        color="#FF0000"
                        style={styles.icon}
                    />
                );
            case "txt":
                return (
                    <AntDesign
                        name="filetext1"
                        size={28}
                        color="#111111"
                        style={styles.icon}
                    />
                );
            case "excel":
                return (
                    <MaterialCommunityIcons
                        name="microsoft-excel"
                        size={30}
                        color="#009900"
                        style={styles.icon}
                    />
                );
            default:
                return (
                    <MaterialIcons
                        name="insert-drive-file"
                        size={30}
                        color="#007bff"
                        style={styles.icon}
                    />
                );
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUploadDocument}
            >
                <Text style={styles.buttonText}>Upload Tài liệu</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Danh sách tài liệu</Text>

            {isLoading ? (
                <Dialog isVisible={isLoading}>
                    <Dialog.Loading />
                </Dialog>
            ) : documents.length > 0 ? (
                <FlatList
                    data={documents}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleOpenDocument(item)}
                        >
                            <View style={styles.documentItem}>
                                {icon(item.material_type)}
                                <View style={styles.documentInfo}>
                                    <Text
                                        style={styles.documentName}
                                        numberOfLines={1}
                                    >
                                        {item.material_name}
                                    </Text>
                                    <Text style={styles.documentDetails}>
                                        .{item.material_type}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => openModal(item)}
                                >
                                    <MaterialIcons
                                        name="more-horiz"
                                        size={24}
                                        color="#777"
                                    />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                    style={styles.documentList}
                />
            ) : (
                <Text style={styles.noDocuments}>Không có tài liệu nào</Text>
            )}

            {isModalVisible && (
                <Modal
                    transparent
                    animationType="none"
                    visible={isModalVisible}
                    onRequestClose={closeModal}
                >
                    <TouchableOpacity
                        style={styles.overlay}
                        onPress={closeModal}
                    />
                    <Animated.View
                        style={[
                            styles.modalContainer,
                            {
                                transform: [
                                    {
                                        translateY: slideAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [300, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <Text style={styles.modalTitle}>
                            {selectedDocument?.material_name}
                        </Text>
                        <TouchableOpacity
                            onPress={() => handleOpenDocument(selectedDocument)}
                        >
                            <Text style={styles.modalOption}>Mở</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDeleteDocument}>
                            <Text style={styles.modalOption}>Xóa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleShareDocument}>
                            <Text style={styles.modalOption}>Chia sẻ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCopyLink}>
                            <Text style={styles.modalOption}>
                                Sao chép liên kết
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    uploadButton: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    documentList: {
        marginTop: 20,
    },
    documentItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    icon: {
        marginRight: 10,
    },

    documentInfo: {
        flex: 1,
    },
    documentName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    documentDetails: {
        fontSize: 12,
        color: "#777",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    modalOption: {
        fontSize: 16,
        paddingVertical: 10,
        color: "#007bff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    noDocuments: {
        marginTop: 50,
        textAlign: "center",
        fontSize: 32,
        color: "#777",
    },
});
