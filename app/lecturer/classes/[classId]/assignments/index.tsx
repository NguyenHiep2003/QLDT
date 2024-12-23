import React, { useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, ScrollView } from "react-native";
import { fetchSurveys, Survey } from "@/services/api-calls/assignments";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useErrorContext } from "@/utils/ctx";
import { InternalServerError, NetworkError } from "@/utils/exception";

const SurveysScreen = () => {
  const { classId } = useLocalSearchParams() as { classId: string };
  const { setUnhandledError } = useErrorContext(); // Dialog báo lỗi
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<string | null>(null); // Quản lý lỗi

  const loadSurveys = async () => {
    try {
      setErrorState(null); // Reset lỗi trước khi load
      const fetchedSurveys = await fetchSurveys(classId);
      setSurveys(fetchedSurveys);
    } catch (err: any) {
      if (err instanceof NetworkError) {
        setErrorState("Không có kết nối mạng ...");
      } else if (!err?.rawError && err instanceof InternalServerError) {
        setErrorState("Không thể kết nối đến máy chủ");
      }
      setUnhandledError(err); // Lỗi khác không xác định
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const fetchedSurveys = await fetchSurveys(classId);
      setErrorState(null); // Reset lỗi ngay sau khi load
      setSurveys(fetchedSurveys);
    } catch (err: any) {
      if (err instanceof NetworkError) {
        setErrorState("Không có kết nối mạng ...");
      } else if (!err?.rawError && err instanceof InternalServerError) {
        setErrorState("Không thể kết nối đến máy chủ");
      } else {
        setErrorState(null); // Reset lỗi ngay sau khi load
      }
      setUnhandledError(err); // Lỗi khác không xác định
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSurveys();
    }, [])
  );

  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  const renderSurvey = ({ item }: { item: Survey }) => {
    const isExpired = new Date(item.deadline) < new Date();
    return (
      <TouchableOpacity
        style={[styles.surveyItem]}
        onPress={() =>
          router.push({
            pathname: "/lecturer/classes/[classId]/assignments/[assignmentId]",
            params: {
              classId: classId,
              className: item.class_name,
              assignmentId: item.id,
              survey: JSON.stringify(item),
            },
          })
        }
      >
        <View style={styles.surveyContent}>
          <Text style={styles.surveyTitle}>{truncateText(item.title, 35)}</Text>
          {item.description ? (
            <Text style={styles.surveyDescription}>{truncateText(item.description, 45)}</Text>
          ) : (
            <Text style={styles.noFile}>Chưa có mô tả</Text>
          )}

          <Text style={[styles.surveyDeadline, isExpired ? styles.expiredSurveyText : styles.activeSurveyText]}>
            Deadline: {new Date(item.deadline).toLocaleDateString("vi-VN")}{" "}
            {new Date(item.deadline).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            {""}
            {isExpired ? "(Đã hết hạn nộp bài)" : "(Đang diễn ra)"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleCreateSurvey = () => {
    router.push({
      pathname: "/lecturer/classes/[classId]/assignments/create-survey",
      params: { classId },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (surveys.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.center}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          {errorState ? (
            <Text style={styles.noDataText}>{errorState}</Text>
          ) : (
            <>
              <Text style={styles.noDataText}>Chưa có bài tập nào</Text>
              <TouchableOpacity style={styles.createButton} onPress={handleCreateSurvey}>
                <Text style={styles.createButtonText}>Tạo bài tập mới</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    );
  }
  

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.createButton} onPress={handleCreateSurvey}>
        <Text style={styles.createButtonText}>Tạo bài tập mới</Text>
      </TouchableOpacity>
      {errorState && <Text style={[styles.noDataText, {fontStyle: "italic", marginBottom: 5}]}>{errorState}</Text>}    
      
      <FlatList
        data={surveys}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSurvey}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
  },
  surveyItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20, // Tăng padding
    backgroundColor: "#fff",
    borderRadius: 12, // Bo góc lớn hơn
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4, // Tăng độ nổi
    marginBottom: 15, // Thoáng hơn giữa các bài tập
  },
  activeSurveyText: {
    color: "#388e3c",
  },
  expiredSurveyText: {
    color: "#d32f2f",
  },
  surveyContent: {
    flex: 1,
  },
  surveyTitle: {
    fontSize: 18, // Tiêu đề nổi bật hơn
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  surveyDescription: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 6,
  },
  noFile: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#aaa",
    marginBottom: 6,
  },
  surveyDeadline: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#d32f2f",
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  createButton: {
    backgroundColor: "#007bff", // Xanh lá
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    margin: 16,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SurveysScreen;
