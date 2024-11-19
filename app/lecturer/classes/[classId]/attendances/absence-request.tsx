import { useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    FlatList,
    Modal,
    TouchableOpacity,
    Image,
    Linking
} from 'react-native';
import { WebView } from 'react-native-webview';

const  data = [
    {
        'id': '1',
        'title': 'Tiêu đề xin nghỉ',
        'reason': 'Lý do xin nghỉ',
        'DateTime': 'ngày xin nghỉ phép'
    },
    {
        'id': '2',
        'title': 'Tiêu đề xin nghỉ',
        'reason': 'Lý do xin nghỉ',
        'DateTime': 'ngày xin nghỉ phép'
    },
    {
        'id': '3',
        'title': 'Tiêu đề xin nghỉ',
        'reason': 'Lý do xin nghỉ',
        'DateTime': 'ngày xin nghỉ phép'
    }
]

const RequestAbsenceCard: React.FC<{name: any, title: any, reason: any, DateTime: any}> = ({name, title, reason, DateTime}) => (
    <TouchableOpacity style={styles.requestAbsenceCard}>
        <View style={styles.statusContainer} >
            <Text style={styles.statusText}>Chờ phê duyệt</Text>
        </View>
        <View>
            <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">Tên sinh viên: <Text style={{color: '#000'}}>{name}</Text></Text>
            <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">Ngày xin nghỉ: <Text style={{color: '#000'}}>{DateTime}</Text></Text>
        </View>
        {true &&<View style={{}}>
            <View>
                <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">Tiêu đề: <Text style={{color: '#000'}}>{title}</Text></Text>
                <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">Lý do: <Text style={{color: '#000'}}>{reason}</Text></Text>
                
                <Text style={styles.cardTitle}>Minh chứng:</Text>
                <TouchableOpacity
                    style={styles.itemProof}
                    onPress={() => Linking.openURL('https://drive.google.com/file/d/1-g7rJucZ8z1pPjRFwk1G8Vza6Q3fSGds/view?usp=drivesdkk')}
                >
                    <Image source={require('@assets/images/proofAbsence.png')}/>
                    <Text>  Minh chứng 1</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.groupButtonReview}>
                <TouchableOpacity
                    style={styles.buttonReject}
                >
                    <Text style={{color: '#fa572f', fontWeight: 'bold', fontSize: 16}}>Từ chối</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonAprove}
                >
                    <Text style={{color: '#34b394', fontWeight: 'bold', fontSize: 16}}>Đồng ý</Text>
                </TouchableOpacity>
            </View>
        </View>}
    </TouchableOpacity>
)

export default function AbsenceRequestScreen() {
    return (
        <SafeAreaView style={styles.container}>
            {/* <WebView source={{ uri: 'https://drive.google.com/uc?id=1cE25Y5GTDWs8PFWQCLknRRPG5PMfHBOq' }} /> */}
            <FlatList
                style={styles.flatList}
                data={data}
                renderItem={({item}) => 
                    <RequestAbsenceCard name={'tên sinh viên'} title={item.title} reason={item.reason} DateTime={item.DateTime}/>
                }
                keyExtractor={item => item.id}
            >
            </FlatList>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 10
    },
    statusContainer: {
        alignSelf: 'flex-start',
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fdf5da',
        borderRadius: 15,
        marginBottom: 10
    },
    requestAbsenceCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, 
    },
    flatList: {
        
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    content: {
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#f2b925',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    statusText: {
        color: '#f2b925',
        fontWeight: 'bold',
        fontSize: 14,
    },
    cardTitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    itemProof:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#f0dddd',
        borderColor: '#575555',
        borderWidth: 0.5,
        borderRadius: 3
    },
    groupButtonReview: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    buttonAprove: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#e0f6f1',
        borderRadius: 5
    },
    buttonReject: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#fee9e4',
        borderRadius: 5,
        marginEnd: 20
    }
})

