// app/(top-tabs)/_layout.tsx
import {
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions,
    createMaterialTopTabNavigator,
  } from "@react-navigation/material-top-tabs";
  import { useLocalSearchParams, withLayoutContext } from "expo-router";
  import { ParamListBase, TabNavigationState } from "@react-navigation/native";
  
  const { Navigator } = createMaterialTopTabNavigator();
  
  export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
  >(Navigator);
  
  export default function TabLayout() {
    const { classId } = useLocalSearchParams();
    return (
      <MaterialTopTabs>
        <MaterialTopTabs.Screen name="index" options={{ title: "Điểm danh" }} initialParams={{ classId }} />
        <MaterialTopTabs.Screen name="history" options={{ title: "Lịch sử điểm danh" }} initialParams={{ classId }} />
      </MaterialTopTabs>
    );
  }