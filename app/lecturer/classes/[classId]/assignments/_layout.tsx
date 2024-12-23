import Header from "@/components/Header";
import { Stack } from "expo-router";
import NotificationBell from "@/components/navigation/NotificationBell";

export default function AssignmentLayout() {
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
          headerTitle: () => <Header title="Bài tập"></Header>,
            headerRight: () => (
                NotificationBell()
            )
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="create-survey"
        options={{
          headerStyle: {
            backgroundColor: "#c21c1c",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitleAlign: "center",
          headerTitle: () => <Header title="Tạo bài tập"></Header>,
        }}
      ></Stack.Screen>
      <Stack.Screen name="[assignmentId]" options={{ headerShown: false }}></Stack.Screen>
    </Stack>
  );
}
