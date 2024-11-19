import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet
} from 'react-native';

const DATA = {
    "absent_dates": [
        "2024-11-06",
        "2024-11-05",
        "2024-11-08",
        "2024-11-02",
        "2024-11-01",
        "2024-11-18"
    ]
};

export default function AttendanceHistory() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bạn đã nghỉ {DATA.absent_dates.length} buổi vào các ngày</Text>
            
            <FlatList
                data={DATA.absent_dates}
                keyExtractor={index => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.dateText}>{item}</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
            />
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
        fontSize: 20,
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
