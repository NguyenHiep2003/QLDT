import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import _ from 'lodash'
import {getAttendanceRecord} from '@/services/api-calls/classes'
import { useLocalSearchParams } from 'expo-router';
import { useErrorContext } from '@/utils/ctx';

export default function AttendanceHistory() {
    const {setUnhandledError} = useErrorContext()
    const [data, setData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { classId } = useLocalSearchParams();

    const getData = async () => {
        try{
            const res = await getAttendanceRecord(classId)
            setData(res.absent_dates)
        } catch(error: any){
            setUnhandledError(error)
        } finally{
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setIsLoading(true)
        getData()
    }, [])

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = async () => {
      setRefreshing(true);
      await getData()
    setRefreshing(false);
    }
    return (
        <>
        {isLoading && 
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={{ fontSize: 18, marginBottom: '20%'}} >Đang tải</Text>
            </View>
        }
        {!isLoading &&
            <View style={styles.container}>
                {(_.isEmpty(data))
                    ? <ScrollView
                        contentContainerStyle={styles.container1}
                        refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }
                    >
                        <Text style={styles.title1}>🎉 Bạn chưa nghỉ buổi nào!</Text>
                        <Text style={styles.title}>💪 Tiếp tục phát huy nhé! 💪</Text>
                    </ScrollView>
                    :
                    (<>
                        <Text style={styles.title}>Bạn đã nghỉ {data.length} buổi vào {data.length > 1? 'các': ''} ngày</Text>
                        <ScrollView
                            refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }
                        >
                            {data.map((date, index) => (
                                <View style={styles.card} key={index}>
                                    <Text style={styles.dateText}>{date.split('-').reverse().join('-')}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </>)
                }
            </View>
        }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
        paddingTop: 10
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center'
    },
    listContainer: {
        paddingBottom: 20
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal: '10%'
    },
    dateText: {
        fontSize: 16,
        color: '#007bff',
        textAlign: 'center'
    },
    container1: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f8f9fa",
    },
    title1: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#d32f2f",
      textAlign: "center",
      marginBottom: 8,
    }
});
