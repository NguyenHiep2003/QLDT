import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, router } from "expo-router";
import { editSurvey } from "@/services/api-calls/assignments";
import { useErrorContext } from "@/utils/ctx";
import { convertUTCtoAdjustedTime } from "@/utils/convertUTCtoAdjustedTime";

const MAX_FILE_SIZE_MB = 5;

const EditSurveyScreen = () => {
  const { classId, assignmentId, survey } = useLocalSearchParams() as {
    classId: string;
    assignmentId: string;
    survey: string;
  };

  const parsedSurvey = useMemo(() => JSON.parse(survey), [survey]);
  const { title, deadline, description, file_url } = parsedSurvey;

  const [newDeadline, setNewDeadline] = useState<Date | null>(deadline ? new Date(deadline) : null);
  const [newDescription, setNewDescription] = useState(description || "");
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState("date");
  const { setUnhandledError } = useErrorContext(); // Dialog báo lỗi

  const startDate = new Date();

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log("User canceled file picker");
      } else if (result.assets && result.assets.length > 0) {
        const selected = result.assets[0];
        const fileSizeMb = (selected.size || 0) / (1024 * 1024);
        if (fileSizeMb > MAX_FILE_SIZE_MB) {
          Alert.alert("Lỗi", `File không được vượt quá ${MAX_FILE_SIZE_MB}MB.`);
          return;
        }
        setSelectedFile(selected);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi chọn tài liệu.");
    }
  };

  const handleDeadlineChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;

    setShowDatePicker(false);
    setNewDeadline(currentDate);

    if (mode === "date") {
      setMode("time");
      setShowDatePicker(true);
    }

    if (mode === "time") {
      const now = new Date();
      if (currentDate < now) {
        Alert.alert("Deadline không hợp lệ", "Thời gian kết thúc không được trước thời gian hiện tại.");
        setShowDatePicker(false);
        setNewDeadline(new Date(deadline));
        return;
      }
    }
  };

  const openPicker = () => {
    setMode("date");
    setShowDatePicker(true);
  };

  const handleSubmit = async () => {
    if (isUpdating) return;

    if (!newDescription && !selectedFile) {
      Alert.alert("Lỗi", "Vui lòng thêm mô tả hoặc tải tài liệu lên.");
      return;
    }
    if (!newDeadline) {
      Alert.alert("Lỗi", "Vui lòng chọn thời gian kết thúc.");
      return;
    }

    const now = new Date();
    if (newDeadline < now) {
      Alert.alert("Deadline không hợp lệ", "Thời gian kết thúc không được trước thời gian hiện tại.");
      return;
    }

    setIsUpdating(true);

    try {
      const formData = new FormData();

      if (selectedFile) {
        formData.append("file", {
          uri: selectedFile.uri,
          name: selectedFile.name || selectedFile.uri.split("/").pop(),
          type: selectedFile.mimeType || "application/octet-stream",
        } as any);
      }
      formData.append("assignmentId", assignmentId);
      formData.append("deadline", convertUTCtoAdjustedTime(newDeadline));
      formData.append("description", newDescription);

      const response = await editSurvey(formData);
      console.log(response);
      Alert.alert("Thành công", "Bài kiểm tra đã được cập nhật thành công!");
      router.back();
      router.back();
      router.push({
        pathname: "/lecturer/classes/[classId]/assignments/[assignmentId]",
        params: { classId: classId, assignmentId: assignmentId, survey: JSON.stringify(response) },
      });
    } catch (err: any) {
      setUnhandledError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>{title}</Text>

      {/* Mô tả */}
      <Text style={styles.sectionTitle}>Mô tả:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Nhập mô tả"
        placeholderTextColor="#d3d3d3"
        value={newDescription}
        onChangeText={setNewDescription}
        multiline
      />

      {/* File đính kèm */}
      <Text style={styles.sectionTitle}>File đính kèm:</Text>
      {file_url ? (
        <TouchableOpacity
          style={styles.fileBox}
          onPress={() => Linking.openURL(file_url).catch(() => Alert.alert("Lỗi", "Không thể mở liên kết."))}
        >
          <Ionicons name="document-text-outline" size={20} color="#555" />
          <Text style={styles.fileBoxText}>File cũ</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.noFile}>Chưa có file tài liệu</Text>
      )}
      {selectedFile && (
        <View style={styles.fileBox}>
          <Text style={styles.fileBoxText}>File mới: {selectedFile.name}</Text>
          <TouchableOpacity onPress={() => setSelectedFile(null)} style={styles.closeButton}>
            <Ionicons name="close-outline" size={20} color="#f00" />
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.fileUploadContainer} onPress={handleFilePick}>
        <Ionicons name="document-attach-outline" size={20} color="#2196f3" />
        <Text style={styles.uploadFileText}>Chọn file mới</Text>
      </TouchableOpacity>

      {/* Thời gian kết thúc */}
      <Text style={styles.sectionTitle}>Thời gian kết thúc:</Text>
      <TouchableOpacity style={styles.dateInput} onPress={openPicker}>
        <Text style={{ textAlign: "center", color: newDeadline ? "#000" : "#d3d3d3" }}>
          {newDeadline
            ? newDeadline.toLocaleString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Chọn thời gian kết thúc"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={newDeadline || startDate}
          mode={mode as any}
          display="default"
          minimumDate={startDate}
          is24Hour={true}
          minuteInterval={1}
          onChange={handleDeadlineChange}
        />
      )}

      {/* Nút cập nhật */}
      <TouchableOpacity
        style={[styles.submitButton, isUpdating && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isUpdating}
      >
        {isUpdating ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Cập nhật</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#000",
    marginBottom: 16,
  },
  textArea: {
    height: 160,
    textAlignVertical: "top",
  },
  fileBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  fileBoxText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginRight: 36, // Tạo khoảng cách giữa text và closeButton
  },
  noFile: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#aaa",
  },
  closeButton: {
    marginLeft: "auto",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#ffebeb",
  },
  fileUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eaf4fd",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadFileText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#2196f3",
  },
  dateInput: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#2196f3",
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  disabledButton: {
    backgroundColor: "#b0c4de",
  },
});

export default EditSurveyScreen;
