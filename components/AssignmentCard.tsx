import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { getAvatarTitle } from '@/utils/getAvatarTitle';
import { getColor } from '@/utils/getColor';

interface AssignmentCardProps {
  className: string;
  classId: string;
  assignmentTitle: string;
  dueDate?: string;
  dueTime: string;
  isSubmitted?: boolean; // Nếu đã nộp bài
  isOverdue?: boolean; // Mới thêm: true nếu bài tập thuộc tab "QUÁ HẠN"
  onPress?: () => void;
}


const AssignmentCard: React.FC<AssignmentCardProps> = ({
  className,
  classId,
  assignmentTitle,
  dueTime,
  isSubmitted,
  isOverdue,
  onPress,
}) => {
  const avatarTitle = getAvatarTitle(className);
  const avatarColor = getColor(avatarTitle, classId);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Avatar
        title={avatarTitle}
        activeOpacity={0.7}
        rounded
        containerStyle={{
          backgroundColor: avatarColor,
          width: 40,
          height: 40,
          marginRight: 10,
          borderRadius: 10,
        }}
      />
      <View style={styles.content}>
        <Text style={styles.assignmentTitle}>{assignmentTitle}</Text>
        <Text
          style={[
            styles.dueText,
            isOverdue && { color: "red" }, // Nếu là "QUÁ HẠN" thì màu đỏ
          ]}
        >
          {`Đến hạn lúc ${dueTime}`}
        </Text>
        <Text style={styles.className}>{className}</Text>
      </View>
      <View style={styles.rightIcon}>
        {isSubmitted ? (
          <MaterialIcons name="check-circle" size={24} color="#4caf50" />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 5,
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  dueText: {
    fontSize: 14,
    color: '#757575',
  },
  className: {
    fontSize: 14,
    color: '#9e9e9e',
    marginTop: 5,
  },
  rightIcon: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default AssignmentCard;
