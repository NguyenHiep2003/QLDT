import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams } from "expo-router";
import { fetchSubmission, submitSurvey } from "@/services/api-calls/assignments";
import { useErrorContext } from "@/utils/ctx";

const AssignmentScreen = () => {
  const { assignmentId, assignment, overdue } = useLocalSearchParams();
  const parsedAssignment = assignment ? JSON.parse(assignment as string) : null;
  const { title, deadline, description, file_url } = parsedAssignment;
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [studentResponse, setStudentResponse] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const { setUnhandledError } = useErrorContext(); // Dialog báo lỗi

  var isOverdue = overdue === "true";
  const formattedDate = new Date(deadline).toLocaleDateString("vi-VN", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const formattedTime = new Date(deadline).toLocaleTimeString("vi-VN", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hour: "2-digit",
    minute: "2-digit",
  });

  const loadSubmission = async () => {
    try {
      setLoading(true);
      const result = await fetchSubmission(assignmentId as string);
      setSubmission(result);
    } catch (err: any) {
      setUnhandledError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmission();
  }, []);

  const MAX_FILE_SIZE_MB = 5; // Giới hạn kích cỡ file
  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log("User canceled file picker");
        //Alert.alert("Thông báo", "Bạn đã hủy chọn tài liệu.");
      } else if (result.assets && result.assets.length > 0) {
        const selected = result.assets[0];
        const fileSizeMb = (selected.size || 0) / (1024 * 1024); // Tính kích thước file (MB)
        if (fileSizeMb > MAX_FILE_SIZE_MB) {
          Alert.alert("Lỗi", `File không được vượt quá ${MAX_FILE_SIZE_MB}MB.`);
          return;
        }
        console.log("Selected file:", selected);
        setSelectedFile(selected);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi chọn tài liệu.");
    }
  };

  const confirmSubmission = () => {
    Alert.alert("Xác nhận nộp bài", "Bạn chỉ được phép nộp bài một lần duy nhất. Bạn có chắc chắn muốn nộp?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đồng ý", onPress: handleSubmitAssignment },
    ]);
  };

  const handleSubmitAssignment = async () => {
    if (!studentResponse.trim() && !selectedFile) {
      Alert.alert("Lỗi", "Vui lòng nhập câu trả lời hoặc tải lên tài liệu trước khi nộp bài!");
      return;
    }

    setIsSubmitting(true);

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
      formData.append("assignmentId", assignmentId as string);
      formData.append("textResponse", studentResponse);
      // Gọi API submitSurvey
      const response = await submitSurvey(formData);

      // Hiển thị thông báo thành công
      Alert.alert("Nộp bài", "Bài của bạn đã được nộp thành công!");
      console.log("Submission ID:", response.submission_id);

      // Cập nhật trạng thái submission để hiển thị kết quả đã nộp
      loadSubmission();

      setSelectedFile(null);
      setStudentResponse("");
    } catch (err: any) {
      setUnhandledError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Tiêu đề */}
      <Text style={styles.title}>{title}</Text>
      {/* Hạn chót */}
      <Text style={styles.deadline}>
        Hạn chót: {formattedDate} {formattedTime}
      </Text>
      {/* Hướng dẫn */}
      <Text style={styles.sectionTitle}>Hướng dẫn:</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : (
        <Text style={styles.noFile}>Không có mô tả</Text>
      )}

      {/* Tài liệu từ giảng viên */}
      <Text style={styles.sectionTitle}>Tài liệu từ giảng viên:</Text>
      {file_url ? (
        <TouchableOpacity
          style={styles.fileBox}
          onPress={() => {
            // Mở link file trong trình duyệt
            Linking.openURL(file_url).catch((err) =>
              Alert.alert("Lỗi", "Không thể mở liên kết. Vui lòng thử lại sau!")
            );
          }}
        >
          <Ionicons name="document-text-outline" size={20} color="#555" />
          <Text style={styles.fileBoxText}>File hướng dẫn</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.noFile}>Không có tài liệu nào</Text>
      )}

      {isOverdue ? (
        <Text style={[styles.errorText, { marginTop: 20 }]}>Đã quá hạn nộp bài. Bạn không thể nộp bài nữa.</Text>
      ) : (
        <>
          {/* Bài nộp của sinh viên */}
          <Text style={styles.sectionTitle}>Bài nộp của bạn:</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#2196f3" />
          ) : submission ? (
            <>
              {/* Câu trả lời */}
              <Text style={styles.submissionLabel}>Câu trả lời:</Text>
              {submission.text_response ? (
                <Text style={styles.responseText}>{submission.text_response}</Text>
              ) : (
                <Text style={styles.noFile}>Không có câu trả lời</Text>
              )}
              {/* File đính kèm */}
              <Text style={styles.submissionLabel}>File đính kèm:</Text>
              {submission.file_url ? (
                <TouchableOpacity
                  style={styles.fileBox}
                  onPress={() => {
                    // Mở link file trong trình duyệt
                    Linking.openURL(submission.file_url).catch((err) =>
                      Alert.alert("Lỗi", "Không thể mở liên kết. Vui lòng thử lại sau!")
                    );
                  }}
                >
                  <Ionicons name="document-text-outline" size={20} color="#555" />
                  <Text style={styles.fileBoxText}>File đã nộp</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.noFile}>Không có tài liệu nào</Text>
              )}
              {/* Nộp lúc */}
              <Text style={[styles.submissionText, { color: "#4caf50" }]}>
                Nộp lúc:{" "}
                {new Date(submission.submission_time).toLocaleString("vi-VN", {
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                })}
              </Text>
              {/* Điểm */}
              <Text style={[styles.submissionText, { color: "#ff9800" }]}>Điểm: {submission.grade || "Chưa chấm"}</Text>
            </>
          ) : (
            <>
              {/* Câu trả lời */}
              <Text style={styles.submissionLabel}>Câu trả lời:</Text>
              <TextInput
                style={styles.responseInput}
                value={studentResponse}
                onChangeText={setStudentResponse}
                placeholder="Nhập câu trả lời của bạn"
                multiline
              />
              {selectedFile && (
                <View style={styles.fileBox}>
                  {/*<Ionicons name="document-text-outline" size={20} color="#555" />*/}
                  <Text style={styles.fileBoxText}>{selectedFile.name}</Text>
                  <TouchableOpacity onPress={() => setSelectedFile(null)} style={styles.closeButton}>
                    <Ionicons name="close-outline" size={20} color="#f00" />
                  </TouchableOpacity>
                </View>
              )}
              {/* Nút tải tài liệu lên */}
              <TouchableOpacity style={styles.fileUploadContainer} onPress={handleFilePick}>
                <Ionicons name="document-attach-outline" size={20} color="#2196f3" />
                <Text style={styles.uploadFileText}>Tải tài liệu lên</Text>
              </TouchableOpacity>
              {/* Nút nộp bài */}
              <TouchableOpacity
                style={[styles.uploadButton, isSubmitting && { backgroundColor: "#ccc" }]}
                onPress={confirmSubmission}
                disabled={isSubmitting}
              >
                <Text style={styles.uploadButtonText}>{isSubmitting ? "Đang nộp..." : "Nộp bài"}</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  deadline: {
    fontSize: 14,
    color: "#f00",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 15,
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
  },
  fileItem: {
    fontSize: 14,
    color: "#2196f3",
    textDecorationLine: "underline",
    marginBottom: 5,
  },
  noFile: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#aaa",
  },
  errorText: {
    color: "#f00",
    fontStyle: "italic",
    marginBottom: 10,
  },
  submissionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
  },
  responseText: {
    fontSize: 14,
    marginVertical: 10,
    color: "#333",
  },
  responseInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    marginTop: 10,
  },
  fileUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  uploadFileText: {
    fontSize: 16,
    color: "#2196f3",
    marginLeft: 5,
  },
  uploadButton: {
    backgroundColor: "#2196f3",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  uploadButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  submissionText: {
    fontSize: 14,
    marginBottom: 5,
  },
  fileBox: {
    flexDirection: "row", // Để hiển thị icon và text ngang hàng
    alignItems: "center", // Căn giữa icon và text
    padding: 10,
    backgroundColor: "#f5f5f5", // Màu nền nhạt
    borderRadius: 8,
    marginVertical: 10, // Khoảng cách giữa các ô
    borderWidth: 1,
    borderColor: "#ddd", // Viền màu xám nhạt
  },
  fileBoxText: {
    marginLeft: 10, // Khoảng cách giữa icon và text
    fontSize: 16,
    fontWeight: "500", // Font chữ đậm vừa
    color: "#333", // Màu chữ
  },
  closeButton: {
    marginLeft: "auto", // Đẩy nút xóa sang bên phải
    padding: 5, // Tăng khoảng cách xung quanh icon để dễ bấm
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16, // Tạo hiệu ứng nút tròn
    backgroundColor: "#ffe5e5", // Màu nền nhạt cho nút
  },
});

export default AssignmentScreen;
