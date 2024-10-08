import {
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions,
    createMaterialTopTabNavigator,
  } from "@react-navigation/material-top-tabs";
  import { withLayoutContext } from "expo-router";
  import { ParamListBase, TabNavigationState } from "@react-navigation/native";
  
  const { Navigator } = createMaterialTopTabNavigator();
  
  export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
  >(Navigator);
  
  export default function TopTabLayout() {
    return (
      <MaterialTopTabs>
        <MaterialTopTabs.Screen name="document" options={{ title: "Tài liệu" }} />
        <MaterialTopTabs.Screen name="assignment" options={{ title: "Bài tập" }} />
      </MaterialTopTabs>
    );
  }