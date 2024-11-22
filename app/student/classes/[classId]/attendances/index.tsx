import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ScrollView
} from 'react-native';
import _ from 'lodash'
import {getAttendanceRecord} from '@/services/api-calls/classes'
import { useLocalSearchParams } from 'expo-router';
import { AxiosResponse } from 'axios';

//TODO: cải thiện giao điện không nghỉ học
export default function AttendanceHistory() {
    const [data, setData] = useState<any[]>([])
    const { classId } = useLocalSearchParams();
    useEffect(() => {
        getAttendanceRecord(classId)
        .then((response)  => {
            const axiosResponse  = response as AxiosResponse<any>
            setData(axiosResponse.data.absent_dates)
        })
        .catch((error: any) => {
            //TODO: Xử lý lỗi
        })
    }, [])
    return (
        <View style={styles.container}>
            {(_.isEmpty(data))
                ? <Text style={styles.title}>Bạn chưa nghỉ học buổi nào {"\n"} Tiếp tục phát huy nhé!</Text>
                :
                (<>
                    <Text style={styles.title}>Bạn đã nghỉ {data.length} buổi vào các ngày</Text>
                    {/* <FlatList
                        data={data}
                        keyExtractor={index => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Text style={styles.dateText}>{item}</Text>
                            </View>
                        )}
                        contentContainerStyle={styles.listContainer}
                    /> */}
                    <ScrollView>
                        {data.map((date, index) => (
                            <View style={styles.card} key={index}>
                                <Text style={styles.dateText}>{date.split('-').reverse().join('-')}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </>)
            }
        </View>
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
    }
});
