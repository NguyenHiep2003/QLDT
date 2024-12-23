import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { deleteSurvey, fetchSurveyResponses, Submission } from "@/services/api-calls/assignments";
import { useErrorContext } from "@/utils/ctx";
import { Toast } from "toastify-react-native";
import ToastContainer from "toastify-react-native";
import { getClassInfo } from "@/services/api-calls/classes";
import { StudentInfo } from "@/components/StudentList";
import { sendNotification } from "@/services/api-calls/notification";
import { InternalServerError, NetworkError } from "@/utils/exception";

// Component hiển thị thông tin bài nộp
const SubmissionItem = ({
  submission,
  isExpanded,
  toggleDetail,
  handleGrade,
  gradingInput,
  setGradingInput,
  isGrading,
}: {
  submission: Submission;
  isExpanded: boolean;
  toggleDetail: (id: string) => void;
  handleGrade: (id: string, account_id: string) => void;
  gradingInput: { [key: string]: string };
  setGradingInput: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  isGrading: boolean;
}) => {
  return (
    <View key={submission.id}>
      {!isExpanded ? (
        <TouchableOpacity
          style={[styles.submissionBox, submission.grade !== null && submission.grade !== undefined ? styles.gradedSubmissionBox : undefined]}
          onPress={() => toggleDetail(submission.id)}
        >
          <View style={styles.submissionHeader}>
            <View>
              <Text style={styles.submissionText}>
                {submission.student_account.first_name} {submission.student_account.last_name}
              </Text>
              <Text style={styles.submissionText}>
                Thời gian nộp: {new Date(submission.submission_time).toLocaleString("vi-VN")}
              </Text>
              <Text style={styles.submissionText}>Điểm: {submission.grade ?? "Chưa chấm"}</Text>
            </View>
            <Ionicons name="chevron-down-outline" size={20} color="#555" />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={[styles.submissionBox, styles.expandedSubmissionBox]}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin sinh viên:</Text>
            <Text style={styles.submissionText}>
              Họ tên: {submission.student_account.first_name + " " + submission.student_account.last_name}
            </Text>
            <Text style={styles.submissionText}>Email: {submission.student_account.email}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nội dung bài nộp:</Text>
            {submission.text_response && (
              <Text style={styles.submissionText}>Câu trả lời: {submission.text_response}</Text>
            )}
            {submission.file_url && (
              <TouchableOpacity
                style={styles.fileBox}
                onPress={() =>
                  Linking.openURL(submission.file_url as string).catch(() =>
                    Alert.alert("Lỗi", "Không thể mở liên kết. Vui lòng thử lại sau!")
                  )
                }
              >
                <Ionicons name="document-text-outline" size={20} color="#555" />
                <Text style={styles.fileBoxText}>File bài nộp</Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Kết quả nộp */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kết quả nộp:</Text>
            <Text style={styles.submissionText}>
              Thời gian nộp: {new Date(submission.submission_time).toLocaleString("vi-VN")}
            </Text>
            <Text style={styles.submissionText}>Điểm: {submission.grade ?? "Chưa chấm"}</Text>
          </View>
          <View style={styles.gradeInputBox}>
            <TextInput
              style={styles.gradeInput}
              placeholder="Nhập điểm"
              keyboardType="numeric"
              value={gradingInput[submission.id] || ""}
              onChangeText={(text) => setGradingInput((prev) => ({ ...prev, [submission.id]: text }))}
            />
            <TouchableOpacity
              disabled={isGrading}
              style={[styles.gradeButton, isGrading && styles.disabledButton]}
              onPress={() => handleGrade(submission.id, submission.student_account.account_id)}
            >
              {isGrading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.gradeButtonText}>{submission.grade ? "Chấm lại bài" : "Chấm bài"}</Text>
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.gradeNote}>Chỉ nhập điểm dạng số, sử dụng dấu '.' cho số thập phân.</Text>
          <TouchableOpacity onPress={() => toggleDetail(submission.id)} style={styles.collapseButton}>
            <Ionicons name="chevron-up-outline" size={20} color="#555" />
            <Text style={styles.collapseButtonText}>Thu gọn</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const SurveyDetailsScreen = () => {
  const { classId, className, assignmentId, survey } = useLocalSearchParams() as {
    classId: string;
    className: string;
    assignmentId: string;
    survey: string;
  };

  const parsedSurvey = useMemo(() => JSON.parse(survey), [survey]);
  const { title, deadline, description, file_url } = parsedSurvey;

  const { setUnhandledError } = useErrorContext();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [expandedSubmissionId, setExpandedSubmissionId] = useState<string | null>(null);
  const [gradingInput, setGradingInput] = useState<{ [key: string]: string }>({});
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "graded" | "ungraded" | "not_submitted">("all");
  const [notSubmittedStudents, setNotSubmittedStudents] = useState<any[]>([]);
  const [errorState, setErrorState] = useState<string | null>(null); // Quản lý lỗi
  const [isDeleting, SetIsDeleting] = useState<boolean>(false);

  const handleEditSurvey = () => {
    router.push({
      pathname: "/lecturer/classes/[classId]/assignments/[assignmentId]/edit-survey",
      params: { classId, assignmentId, survey } as any,
    });
  };

  const handleDeleteSurvey = () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa bài kiểm tra này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            if (isDeleting) return;
            SetIsDeleting(true);
            await deleteSurvey(assignmentId);
            setErrorState(null); // Reset lỗi ngay sau khi load
            Alert.alert("Thành công", "Bài kiểm tra đã được xóa.");
            router.back();
          } catch (err: any) {
            if (err instanceof NetworkError) {
              setErrorState("Không có kết nối mạng ...");
            } else if (!err?.rawError && err instanceof InternalServerError) {
              setErrorState("Không thể kết nối đến máy chủ");
            } else {
              setErrorState(null); // Reset lỗi ngay sau khi load
            }
            setUnhandledError(err);
          } finally {
            SetIsDeleting(false);
          }
        },
      },
    ]);
  };

  const fetchNotSubmittedStudents = useCallback(async () => {
    try {
      // Gọi API getClassInfo
      const response = await getClassInfo({ class_id: parsedSurvey.class_id });
      setErrorState(null); // Reset lỗi ngay sau khi load
      const allStudents = response.data.student_accounts; // Danh sách tất cả sinh viên trong lớp
      const submittedStudentIds = submissions.map((sub) => sub.student_account.account_id);

      // Lọc ra các sinh viên chưa nộp
      const notSubmitted = allStudents.filter((student) => !submittedStudentIds.includes(String(student.account_id)));

      setNotSubmittedStudents(notSubmitted);
    } catch (error: any) {
      if (error instanceof NetworkError) {
        setErrorState("Không có kết nối mạng ...");
      } else if (!error?.rawError && error instanceof InternalServerError) {
        setErrorState("Không thể kết nối đến máy chủ");
      } else {
        setErrorState(null); // Reset lỗi ngay sau khi load
      }
      setUnhandledError(error);
    }
  }, [parsedSurvey.class_id, submissions]);

  useEffect(() => {
    if (filter === "not_submitted") {
      fetchNotSubmittedStudents(); // Gọi API khi chuyển sang bộ lọc "Chưa nộp bài"
    }
  }, [filter, fetchNotSubmittedStudents]);

  const filteredSubmissions = useMemo(() => {
    switch (filter) {
      case "graded":
        return submissions.filter((submission) => submission.grade !== null);
      case "ungraded":
        return submissions.filter((submission) => submission.grade === null);
      case "not_submitted":
        return []; // Không trả về bài nộp trong trường hợp này
      default:
        return submissions;
    }
  }, [filter, submissions]);
  const fetchSubmissions = async () => {
    try {
      const response = await fetchSurveyResponses(assignmentId);
      setErrorState(null); // Reset lỗi ngay sau khi load
      setSubmissions(response);
    } catch (err: any) {
      if (err instanceof NetworkError) {
        setErrorState("Không có kết nối mạng ...");
      } else if (!err?.rawError && err instanceof InternalServerError) {
        setErrorState("Không thể kết nối đến máy chủ");
      } else {
        setErrorState(null); // Reset lỗi ngay sau khi load
      }
      setUnhandledError(err);
    } finally {
      setLoading(false);
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetchSurveyResponses(assignmentId);
      setErrorState(null); // Reset lỗi ngay sau khi load
      setSubmissions(response);
    } catch (err: any) {
      if (err instanceof NetworkError) {
        setErrorState("Không có kết nối mạng ...");
      } else if (!err?.rawError && err instanceof InternalServerError) {
        setErrorState("Không thể kết nối đến máy chủ");
      } else {
        setErrorState(null); // Reset lỗi ngay sau khi load
      }
      setUnhandledError(err);
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (filter === "ungraded" || filter === "not_submitted") {
      fetchSubmissions();
    }
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      fetchSubmissions();
    }, [])
  );
  const toggleSubmissionDetail = useCallback((id: string) => {
    setExpandedSubmissionId((prev) => (prev === id ? null : id));
  }, []);

  const handleGradeSubmission = async (id: string, account_id: string) => {
    if (isGrading) return;

    const grade = gradingInput[id];
    if (!grade) {
      Alert.alert("Lỗi", "Vui lòng nhập điểm trước khi chấm bài.");
      return;
    }

    if (!/^-?[0-9]+(\.[0-9]+)?$/.test(grade)) {
      Alert.alert("Lỗi", "Vui lòng nhập điểm hợp lệ.");
      return;
    }

    setIsGrading(true);

    try {
      const updatedSubmissions = await fetchSurveyResponses(assignmentId, id, grade);
      setErrorState(null); // Reset lỗi ngay sau khi load
      Toast.success(`Đã chấm điểm: ${grade}`);

      const currentIndex = submissions.findIndex((sub) => sub.id === id);
      const nextSubmission = submissions[currentIndex + 1];

      setExpandedSubmissionId(nextSubmission ? nextSubmission.id : null);
      setSubmissions(updatedSubmissions);

      setGradingInput((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      await sendNotification({
        message: `Đã có điểm bài tập ${title}, lớp ${className}`,
        toUser: account_id,
        type: "ASSIGNMENT_GRADE",
      });
    } catch (error: any) {
      if (error instanceof NetworkError) {
        setErrorState("Không có kết nối mạng ...");
      } else if (!error?.rawError && error instanceof InternalServerError) {
        setErrorState("Không thể kết nối đến máy chủ");
      } else {
        setErrorState(null); // Reset lỗi ngay sau khi load
      }
      setUnhandledError(error);
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Toast Container */}
      <ToastContainer style={styles.toastContainer} duration={2000} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[8]} // Giữ cố định bộ lọc
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.deadline}>
          Hạn chót: {new Date(deadline).toLocaleDateString("vi-VN")}{" "}
          {new Date(deadline).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
        </Text>
        <Text style={styles.sectionTitle}>Hướng dẫn:</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : (
          <Text style={styles.noFile}>Chưa có mô tả</Text>
        )}

        <Text style={styles.sectionTitle}>Tài liệu từ giảng viên:</Text>
        {file_url ? (
          <TouchableOpacity
            style={styles.fileBox}
            onPress={() => Linking.openURL(file_url).catch(() => Alert.alert("Lỗi", "Không thể mở liên kết."))}
          >
            <Ionicons name="document-text-outline" size={20} color="#555" />
            <Text style={styles.fileBoxText}>File hướng dẫn</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.noFile}>Không có tài liệu nào</Text>
        )}
        {/* Thêm hai nút chỉnh sửa và xóa */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditSurvey}>
            <Text style={styles.editButtonText}>Sửa bài tập</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteButton, isDeleting && styles.disabledButton]}
            disabled={isDeleting}
            onPress={handleDeleteSurvey}
          >
            {isDeleting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.deleteButtonText}>Xóa bài tập</Text>
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Danh sách bài nộp:</Text>
        {/* Bộ lọc */}
        <View style={styles.filterBarContainer}>
          <FilterBar filter={filter} setFilter={setFilter} />
        </View>
        {filter === "not_submitted" ? (
          notSubmittedStudents.length === 0 ? (
            errorState ? (
              <Text style={styles.noFile}>{errorState}</Text>
            ) : (
              <Text style={styles.noFile}>Tất cả sinh viên đã nộp bài</Text>
            )
          ) : (
            notSubmittedStudents.map((student) => (
              <StudentInfo key={student.account_id.toString()} info={student}></StudentInfo>
            ))
          )
        ) : loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : filteredSubmissions.length === 0 ? (
          errorState ? (
            <Text style={styles.noFile}>{errorState}</Text>
          ) : (
            <Text style={styles.noFile}>Không có bài nộp nào</Text>
          )
        ) : (
          <>
            {errorState && <Text style={[styles.noFile, { marginBottom: 5 }]}>{errorState}</Text>}
            {filteredSubmissions.map((submission) => (
              <SubmissionItem
                key={submission.id}
                submission={submission}
                isExpanded={expandedSubmissionId === submission.id}
                toggleDetail={toggleSubmissionDetail}
                handleGrade={handleGradeSubmission}
                gradingInput={gradingInput}
                setGradingInput={setGradingInput}
                isGrading={isGrading}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const FilterBar = ({
  filter,
  setFilter,
}: {
  filter: "all" | "graded" | "ungraded" | "not_submitted";
  setFilter: React.Dispatch<React.SetStateAction<"all" | "graded" | "ungraded" | "not_submitted">>;
}) => (
  <View style={styles.filterBar}>
    <TouchableOpacity
      style={[styles.filterButton, filter === "all" && styles.activeFilter]}
      onPress={() => setFilter("all")}
    >
      <Text style={styles.filterButtonText}>Tất cả</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.filterButton, filter === "graded" && styles.activeFilter]}
      onPress={() => setFilter("graded")}
    >
      <Text style={styles.filterButtonText}>Đã chấm</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.filterButton, filter === "ungraded" && styles.activeFilter]}
      onPress={() => setFilter("ungraded")}
    >
      <Text style={styles.filterButtonText}>Chưa chấm</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.filterButton, filter === "not_submitted" && styles.activeFilter]}
      onPress={() => setFilter("not_submitted")}
    >
      <Text style={styles.filterButtonText}>Chưa nộp</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute", // Giúp cố định vị trí trên màn hình
    top: 0, // Đặt ở góc trên cùng
    left: 0, // Canh từ lề trái
    right: 0, // Canh từ lề phải (đảm bảo full width)
    width: "100%", // Đảm bảo chiều rộng là toàn màn hình
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
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
    fontSize: 16, // Kích thước lớn hơn cho tiêu đề
    fontWeight: "bold", // Chữ đậm để nhấn mạnh
    marginBottom: 10,
    color: "#007BFF", // Màu xanh tạo sự nổi bật
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
  },
  noFile: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#aaa",
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
    marginRight: 36,
  },
  submissionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  submissionBox: {
    padding: 15,
    backgroundColor: "#e6f7ff",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#8cc0de",
  },
  gradedSubmissionBox: {
    backgroundColor: "#d4edda", // Xanh lá nhạt
    borderColor: "#c3e6cb", // Đường viền cùng tông màu
  },
  expandedSubmissionBox: {
    backgroundColor: "#fff3e6", // Nền màu cam nhạt để thu hút chú ý
    borderColor: "#ffcc99", // Đường viền cùng tông màu với nền
    padding: 15, // Tăng padding để mở rộng nội dung
  },
  submissionText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 8,
  },
  section: {
    marginBottom: 10,
  },
  collapseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 5,
  },
  collapseButtonText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 5,
  },
  gradeInputBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15, // Khoảng cách trên
    paddingTop: 10, // Tạo khoảng trống phía trên
    borderTopWidth: 1, // Đường kẻ phân tách
    borderColor: "#ddd",
  },
  gradeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15, // Tăng padding để dễ bấm
    paddingVertical: 10, // Cải thiện vùng cảm ứng
    height: 50, // Tăng chiều cao cho dễ nhìn
    marginVertical: 5, // Tách biệt khỏi các thành phần khác
    marginRight: 5,
  },
  gradeButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 12, // Tăng vùng cảm ứng
    paddingHorizontal: 20, // Tăng kích thước nút
    height: 50, // Giúp nút đồng bộ với input
    justifyContent: "center",
    alignItems: "center",
  },
  gradeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  gradeNote: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    fontStyle: "italic",
  },
  disabledButton: {
    opacity: 0.6,
  },
  filterBarContainer: {
    backgroundColor: "#fff",
    zIndex: 10,
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  activeFilter: {
    backgroundColor: "#007BFF",
  },
  filterButtonText: {
    color: "#fff",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    flex: 0.48,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 8,
    flex: 0.48,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SurveyDetailsScreen;
