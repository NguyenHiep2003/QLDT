import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, SectionList, Text, ActivityIndicator, RefreshControl } from 'react-native';
import AssignmentCard from '@/components/AssignmentCard';
import { Assignment, fetchAssignments } from '@/services/api-calls/assignments';
import { router, useFocusEffect } from 'expo-router';
import { useErrorContext } from '@/utils/ctx';
function groupAssignmentsByDate(assignments: Assignment[]) {

  const grouped: { title: string; data: Assignment[] }[] = [];

  // Tạo bản đồ nhóm bài tập theo ngày
  const map = new Map<string, Assignment[]>();
  assignments.forEach((assignment) => {
    assignment.deadline = assignment.deadline + "Z"; // chờ backend fix là bỏ
    const dateKey = new Date(assignment.deadline).toLocaleDateString('vi-VN', {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    console.log(dateKey)

    if (!map.has(dateKey)) {
      map.set(dateKey, []);
    }
    map.get(dateKey)!.push(assignment);
    console.log(assignment.deadline);
  });

  // Chuyển bản đồ thành mảng
  map.forEach((data, title) => {
    // **Sắp xếp các bài tập theo thời gian deadline**
    data.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    grouped.push({ title, data });
  });

  // Sắp xếp các nhóm theo ngày gần nhất
  grouped.sort((a, b) => {
    const [dayA, monthA, yearA] = a.title.split('/').map(Number); // Tách ngày/tháng/năm
    const [dayB, monthB, yearB] = b.title.split('/').map(Number);

    // So sánh đối tượng Date
    return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
  });
  
  return grouped;
}

const UpcomingAssignments: React.FC = () => {
  const [sections, setSections] = useState<{ title: string; data: Assignment[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Trạng thái làm mới
  const { setUnhandledError } = useErrorContext(); // Dialog báo lỗi

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await fetchAssignments('UPCOMING');
      const groupedData = groupAssignmentsByDate(data);
      setSections(groupedData);
    } catch (err: any) {
      console.error(err);
      setUnhandledError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchAssignments('UPCOMING');
      const groupedData = groupAssignmentsByDate(data);
      setSections(groupedData);
    } catch (err: any) {
      console.error(err);
      setUnhandledError(err);
    } finally {
      setRefreshing(false);
    }
  };

  // Lắng nghe sự kiện focus
  useFocusEffect(
    useCallback(() => {
      loadAssignments();
    }, [])
  );

  useEffect(() => {
    loadAssignments();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (sections.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>Không có bài tập nào sắp tới</Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.contentContainer} // Thêm padding dưới
      renderSectionHeader={({ section: { title, data } }) => {
        const currentDate = new Date();
        const [day, month, year] = title.split('/').map(Number); // Tách ngày, tháng, năm từ title
        const deadlineDate = new Date(year, month - 1, day);
      
        const diffTime = deadlineDate.getTime() - currentDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Tính số ngày
      
        let comparisonText = '';
        if (diffDays > 0) {
          comparisonText = `Còn ${diffDays} ngày`;
        } else if (diffDays === 0) {
          comparisonText = `Hết hạn hôm nay`;
        } else {
          comparisonText = `Quá hạn ${Math.abs(diffDays)} ngày`;
        }
      
        return (
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeader}>{`${title}`}</Text>
            <Text style={styles.comparisonText}>{comparisonText}</Text>
          </View>
        );
      }}
      
      renderItem={({ item }) => (
        <AssignmentCard
          className={`${item.class_name}`}
          assignmentTitle={item.title}
          //dueDate={new Date(item.deadline).toLocaleDateString('vi-VN')}
          dueTime={new Date(item.deadline).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          isSubmitted={item.is_submitted}
          onPress={() => {
            router.push({
              pathname: '/student/classes/[classId]/assignments/[assignmentId]',
              params: { classId: item.class_id, assignmentId: item.id, assignment: JSON.stringify(item)},
            });
          }}
        />
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Đảm bảo chiếm toàn bộ màn hình
    backgroundColor: '#f9f9f9',
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 50, // Thêm khoảng trống cuối để tránh bị che
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#757575',
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Giãn cách tiêu đề và text nhỏ
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  comparisonText: {
    fontSize: 14, // Cỡ chữ nhỏ hơn
    fontWeight: '400', // Không đậm
    color: '#757575', // Màu xám nhẹ
    marginLeft: 10, // Khoảng cách với header
  },  
});

export default UpcomingAssignments;
