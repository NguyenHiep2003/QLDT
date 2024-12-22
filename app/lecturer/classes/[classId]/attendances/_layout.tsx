// app/(top-tabs)/_layout.tsx
import {
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions,
    createMaterialTopTabNavigator,
  } from "@react-navigation/material-top-tabs";
  import { useLocalSearchParams, withLayoutContext } from "expo-router";
  import { ParamListBase, TabNavigationState, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getProfileLocal } from "@/services/storages/profile";
import { ActivityIndicator, View } from "react-native";
import { getClassInfo } from "@/services/api-calls/classes";
  
  const { Navigator } = createMaterialTopTabNavigator();
  
  export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
  >(Navigator);
  
  export default function TabLayout() {
    const { classId } = useLocalSearchParams();
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    useEffect(() => {
      const findClassInfo = async () => {
        const classInfo : any = await getClassInfo({
          class_id: classId.toString()
        })
        setStartDate(classInfo.data.start_date)
        setEndDate(classInfo.data.end_date)
      }
      findClassInfo()
    }, [classId])


    if ( !startDate || !endDate) {
      return (
        <View style={{alignSelf: 'center',position: 'absolute', top: '40%'}}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      )
    }
    return (
      <MaterialTopTabs>
        <MaterialTopTabs.Screen name="index" options={{ title: "Điểm danh" }} initialParams={{ classId }} />
        <MaterialTopTabs.Screen name="history" options={{ title: "Lịch sử" }} initialParams={{ classId }} />
        <MaterialTopTabs.Screen name="absence-request" options={{ title: "Đơn xin nghỉ" }} initialParams={{ classId, startDate, endDate }} />
      </MaterialTopTabs>
    );
  }