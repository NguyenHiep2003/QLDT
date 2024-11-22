import { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    FlatList,
    Modal,
    TouchableOpacity,
    Image,
    Linking,
    ActivityIndicator,
    Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import {getAbsenceRequests} from '@/services/api-calls/classes'
import {reviewAbsenceRequest} from '@/services/api-calls/classes'
import { useLocalSearchParams } from 'expo-router';

const RequestAbsenceCard: React.FC<{status: any, name: any, MSSV: any, title: any, reason: any, DateTime: any, id: any, selectedItemId: any, onSelect: (id: any) => void, fileUrl: any, whenReview: (id: any, status: any) => void}> = ({status, name, MSSV, title, reason, DateTime, id, selectedItemId, onSelect, fileUrl, whenReview}) => (
    <TouchableOpacity style={styles.requestAbsenceCard} onPress={() => onSelect(id)}>
        <View style={[styles.statusContainer, {backgroundColor: status === 'ACCEPTED'? '#e0f6f1' :(status === 'PENDING'? '#fdf6dc' : '#fee9e4')}]} >
            <Text style={[styles.statusText, {color: status === 'ACCEPTED'? '#0e8f70' :(status === 'PENDING'? '#f2b925' : '#fa572f')}]}>
                {status === 'ACCEPTED' ? 'Đã xác nhận' :
                (status === 'PENDING' ? 'Chờ phê duyệt' : 'Đã từ chối')}
            </Text>
        </View>
        <View>
            <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">Tên sinh viên: <Text style={{color: '#000'}}>{name}</Text></Text>
            <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">MSSV: <Text style={{color: '#000'}}>{MSSV}</Text></Text>
            <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">Ngày xin nghỉ: <Text style={{color: '#000'}}>{DateTime}</Text></Text>
        </View>
        {(selectedItemId == id) && <View style={{}}>
            <View>
                {title && <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">Tiêu đề: <Text style={{color: '#000'}}>{title}</Text></Text>}
                <Text style={styles.cardTitle} >Lý do: <Text style={{color: '#000'}}>{reason}</Text></Text>
                
                {fileUrl && <>
                    <Text style={styles.cardTitle}>Minh chứng:</Text>
                    <TouchableOpacity
                        style={styles.itemProof}
                        onPress={() => Linking.openURL(fileUrl)}
                    >
                        <Image source={require('@assets/images/proofAbsence.png')}/>
                        <Text>  Minh chứng</Text>
                    </TouchableOpacity>
                </>}
            </View>
            {status == 'PENDING' &&<View style={styles.groupButtonReview}>
                <TouchableOpacity
                    style={styles.buttonReject}
                    onPress= {() => {
                        Alert.alert(
                            'Xác nhận từ chối!',
                            'Bạn chắc chắn với việc từ chối đơn xin nghỉ?',
                            [
                              {
                                text: 'Cancel',
                                onPress: () => {},
                                style:'cancel'
                              },
                              {
                                text: 'OK',
                                onPress: () => {whenReview(id, 'REJECTED')}
                              },
                            ],
                            { cancelable: false }
                        )
                        }
                    }
                >
                    <Text style={{color: '#fa572f', fontWeight: 'bold', fontSize: 16}}>Từ chối</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonAprove}
                    onPress= {() => {
                        Alert.alert(
                            'Xác nhận từ chối!',
                            'Bạn chắc chắn với việc từ chối đơn xin nghỉ?',
                            [
                              {
                                text: 'Cancel',
                                onPress: () => {},
                                style:'cancel'
                              },
                              {
                                text: 'OK',
                                onPress: () => {whenReview(id, 'ACCEPTED')}
                              },
                            ],
                            { cancelable: false }
                        )
                        }
                    }
                >
                    <Text style={{color: '#0e8f70', fontWeight: 'bold', fontSize: 16}}>Đồng ý</Text>
                </TouchableOpacity>
            </View>}
        </View>}
    </TouchableOpacity>
)

export default function AbsenceRequestScreen() {
    const [data, setData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [requesting, setRequesting] = useState(false)
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [pageInfo, setPageInfo] = useState<any>({})
    const [page, setPage] = useState(0)

    const page_size = '10'
    const {classId} = useLocalSearchParams()

    useEffect(() => {
        const getData = async () => {
            getAbsenceRequests(classId, page.toString(), page_size)
                .then((response:any) => {
                    setData(response.data.page_content)
                    setPageInfo(response.data.page_info)
                })
                .catch((error: any) => {
                    console.log('err: ', error)
                    // TODO: Xử lý lỗi
                }) 
                .finally(() => {
                    setIsLoading(false)
                })
                
        }
        setIsLoading(true)
        getData()
    }, [])

    const handleSelectItem = (id: any) => {
        setSelectedItemId(prevId => (prevId === id ? null : id)); // Nếu thẻ đang mở được chọn lại thì đóng, nếu chọn thẻ khác thì mở thẻ đó
    }

    const handleReviewAbsenceRequest = async (id: any, status: any) => {
        setRequesting(true)
        try{
            const res = await reviewAbsenceRequest(id.toString(), status)
            setData((prevData) =>
                prevData.map((item) =>
                    item.id === id ? { ...item, status } : item // Cập nhật trạng thái nếu ID khớp
                )
            )
        } catch(error){
            console.log('error: ', error)
        } finally {
            setRequesting(false)
        }
        
    }
    return (
        <SafeAreaView style={styles.container}>
            {/* <WebView source={{ uri: 'https://drive.google.com/uc?id=1cE25Y5GTDWs8PFWQCLknRRPG5PMfHBOq' }} /> */}
            {requesting && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#007BFF" />
                </View>
            )}
            {isLoading && (
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                <Text style={{fontSize: 18,textAlign: 'center'}}>Đang tải...</Text>
                </View>
            )}
            {!isLoading &&<FlatList
                style={styles.flatList}
                data={data}
                renderItem={({item}) => 
                    <RequestAbsenceCard
                        status={item.status}
                        name={`${item.student_account.first_name} ${item.student_account.last_name}`}
                        MSSV={`${item.student_account.student_id}`}
                        title={item.title}
                        reason={item.reason}
                        DateTime={item.absence_date}
                        id={item.id}
                        selectedItemId={selectedItemId || ''}
                        onSelect={handleSelectItem}
                        fileUrl={item.file_url}
                        whenReview={handleReviewAbsenceRequest}/>
                }
                keyExtractor={item => item.id}
            >
            </FlatList>}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statusContainer: {
        alignSelf: 'flex-start',
        paddingVertical: 5,
        paddingHorizontal: 10,
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
        marginHorizontal: 15,
    },
    flatList: {
        marginTop: 10
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu xám với độ trong suốt
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, // Đảm bảo lớp phủ nằm trên các thành phần khác
        height: '100%'
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
        marginTop: 20,
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

