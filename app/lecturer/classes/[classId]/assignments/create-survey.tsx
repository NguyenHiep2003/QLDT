import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { createSurvey } from "@/services/api-calls/assignments";
import { useErrorContext } from "@/utils/ctx";
import { convertUTCtoAdjustedTime } from "@/utils/convertUTCtoAdjustedTime";

const MAX_FILE_SIZE_MB = 5;

const CreateSurveyScreen = () => {
  const { classId } = useLocalSearchParams() as { classId: string };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const startDate = new Date();
  const [mode, setMode] = useState("date");

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const { setUnhandledError } = useErrorContext(); // Dialog báo lỗi

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
    setDeadline(currentDate);

    if (mode === "date") {
      setMode("time");
      setShowDatePicker(true);
    }

    if (mode === "time") {
      const now = new Date();
      if (currentDate < now) {
        Alert.alert("Deadline không hợp lệ", "Thời gian kết thúc không được trước thời gian hiện tại.");
        setShowDatePicker(false);
        setDeadline(null);
        return;
      }
    }
  };

  const openPicker = () => {
    setMode("date");
    setShowDatePicker(true);
  };

  const handleSubmit = async () => {
    if (isCreating) return;

    if (!title.trim()) {
      Alert.alert("Lỗi", "Tên bài kiểm tra là bắt buộc.");
      return;
    }
    if (!description && !selectedFile) {
      Alert.alert("Lỗi", "Vui lòng điều mô tả bài tập hoặc tải tài liệu lên.");
      return;
    }
    if (!deadline) {
      Alert.alert("Lỗi", "Vui lòng chọn thời gian kết thúc.");
      return;
    }

    const now = new Date();
    if (deadline < now) {
      Alert.alert("Deadline không hợp lệ", "Thời gian kết thúc không được trước thời gian hiện tại.");
      return;
    }

    setIsCreating(true);

    try {
      const formData = new FormData();
      const file = selectedFile as any;
      if (selectedFile) {
        formData.append("file", {
          uri: file.uri,
          name: file.name || file.uri.split("/").pop(),
          type: file.mimeType || "application/octet-stream",
        } as any);
      }
      formData.append("classId", classId);
      formData.append("title", title);
      formData.append("deadline", convertUTCtoAdjustedTime(deadline));
      formData.append("description", description);
      const response = await createSurvey(formData);
      console.log(response);
      Alert.alert("Thành công", "Bài tập đã được tạo thành công!");
      router.back();
    } catch (err: any) {
      setUnhandledError(err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <TextInput
        style={styles.input}
        placeholder="Tên bài kiểm tra*"
        placeholderTextColor="#d3d3d3"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Mô tả"
        placeholderTextColor="#d3d3d3"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {selectedFile && (
        <View style={styles.fileBox}>
          <Text style={styles.fileBoxText}>{selectedFile.name}</Text>
          <TouchableOpacity onPress={() => setSelectedFile(null)} style={styles.closeButton}>
            <Ionicons name="close-outline" size={20} color="#f00" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.fileUploadContainer} onPress={handleFilePick}>
        <Ionicons name="document-attach-outline" size={20} color="#2196f3" />
        <Text style={styles.uploadFileText}>Tải tài liệu lên</Text>
      </TouchableOpacity>

      <View style={styles.dateContainer}>
        {/* Thời gian bắt đầu */}
        <View style={styles.dateItem}>
          <Text style={styles.label}>Thời gian bắt đầu:</Text>
          <TextInput
            style={[styles.dateInput, styles.nonEditableInput]}
            value={startDate.toLocaleString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
            editable={false}
          />
        </View>

        {/* Thời gian kết thúc */}
        <View style={styles.dateItem}>
          <Text style={styles.label}>Thời gian kết thúc:</Text>
          <TouchableOpacity style={styles.dateInput} onPress={openPicker}>
            <Text style={{ textAlign: "center", color: deadline ? "#000" : "#d3d3d3" }}>
              {deadline
                ? deadline.toLocaleString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Chọn thời gian kết thúc"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={deadline || startDate}
          mode={mode as any}
          display="default"
          minimumDate={startDate}
          is24Hour={true}
          minuteInterval={1}
          onChange={handleDeadlineChange}
        />
      )}

      <TouchableOpacity
        style={[styles.submitButton, isCreating && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isCreating}
      >
        {isCreating ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Tạo bài tập</Text>}
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  textArea: {
    height: 160,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  fileBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#eef2ff",
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#d1d9ff",
  },
  fileBoxText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#4f4f4f",
    marginRight: 36,
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
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#eaf7ff",
    borderWidth: 1,
    borderColor: "#90caf9",
  },
  uploadFileText: {
    fontSize: 16,
    color: "#2196f3",
    marginLeft: 8,
  },
  dateContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  dateItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    height: 48, // Đồng bộ chiều cao
    justifyContent: "center", // Giữa dọc
    alignItems: "center", // Giữa ngang
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  nonEditableInput: {
    textAlign: "center", // Giữ văn bản ở giữa ngang
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CreateSurveyScreen;
