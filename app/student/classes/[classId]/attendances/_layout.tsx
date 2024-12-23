// app/(top-tabs)/_layout.tsx
import {
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions,
    createMaterialTopTabNavigator,
  } from "@react-navigation/material-top-tabs";
  import { useLocalSearchParams, withLayoutContext } from "expo-router";
  import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getProfileLocal } from "@/services/storages/profile";
import { ActivityIndicator, View } from "react-native";
import { getClassInfo } from "@/services/api-calls/classes";
import { useErrorContext } from "@/utils/ctx";
import { NetworkError } from "@/utils/exception";
  
  const { Navigator } = createMaterialTopTabNavigator();
  
  export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
  >(Navigator);
  
  export default function TabLayout() {
    const { classId } = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(true)
    const [className, setClassName] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [lecturerAccountId, setLecturerAccountId] = useState('')
    const {setUnhandledError} = useErrorContext()
    useEffect(() => {
      const findClassInfo = async () => {
        try{
          setIsLoading(true)
          const classInfo: any = await getClassInfo({class_id: classId.toString()})
          setClassName(classInfo.data.class_name)
          setStartDate(classInfo.data.start_date)
          setEndDate(classInfo.data.end_date)
          setLecturerAccountId(classInfo.data.lecturer_account_id)
        } catch (error: any) {
          if(!(error instanceof NetworkError)) setUnhandledError(error)
        } finally{
          setIsLoading(false)
        }
      }
      findClassInfo()
    }, [classId])
    if (isLoading) {
      return (
        <View style={{alignSelf: 'center',position: 'absolute', top: '40%'}}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      )
    }
    return (
      <MaterialTopTabs>
        <MaterialTopTabs.Screen name="index" options={{ title: "Lịch sử nghỉ" }} initialParams={{ classId }} />
        <MaterialTopTabs.Screen name="request-absence" options={{ title: "Xin nghỉ" }} initialParams={{ classId, className, startDate, endDate, lecturerAccountId }} />
        <MaterialTopTabs.Screen name="history-request" options={{ title: "Đơn xin nghỉ" }} initialParams={{ classId, className, startDate, endDate }} />
      </MaterialTopTabs>
    );
  }