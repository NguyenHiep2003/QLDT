import React, { useEffect, useState } from "react";
import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { useLocalSearchParams, withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { View, Text } from "react-native";
import { fetchAssignments } from "@/services/api-calls/assignments";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
  const [hasOverdueAssignments, setHasOverdueAssignments] = useState(false);
  const [focusedTab, setFocusedTab] = useState<string>("index"); // Tab đang focus
  const { classId } = useLocalSearchParams();
  useEffect(() => {
    const checkOverdueAssignments = async () => {
      try {
        const response = await fetchAssignments("PASS_DUE", classId as string);
        setHasOverdueAssignments(response.length > 0);
      } catch (err) {
        console.error(err);
      }
    };
    checkOverdueAssignments();
  }, []);

  return (
    <MaterialTopTabs
      screenListeners={{
        state: (event) => {
          // Cập nhật tab đang được focus
          const index = event.data.state.index;
          const routeName = event.data.state.routeNames[index];
          setFocusedTab(routeName);
        },
      }}
    >
      <MaterialTopTabs.Screen name="index" options={{ title: "Sắp tới" }} />
      <MaterialTopTabs.Screen
        name="overdueAssignments"
        initialParams={{ classId }}
        options={{
          tabBarLabel: ({ focused }) => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  //fontSize: 16,
                  fontWeight: "normal",
                  color: focused ? "black" : "#979797",
                }}
              >
                QUÁ HẠN
              </Text>
              {hasOverdueAssignments && focusedTab !== "overdueAssignments" && (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: "red",
                    borderRadius: 4,
                    marginLeft: 4,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="completedAssignments"
        initialParams={{ classId }}
        options={{ title: "Đã hoàn thành" }}
      />
    </MaterialTopTabs>
  );
}
