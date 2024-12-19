import Header from "@/components/Header";
import { Stack } from "expo-router";

export default function AssignmentDetailLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerStyle: {
            backgroundColor: "#c21c1c",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitleAlign: "center",
          headerTitle: () => <Header title="Chi tiết bài tập"></Header>,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="edit-survey"
        options={{
          headerStyle: {
            backgroundColor: "#c21c1c",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitleAlign: "center",
          headerTitle: () => <Header title="Chỉnh sửa bài tập"></Header>,
        }}
      ></Stack.Screen>
    </Stack>
  );
}
