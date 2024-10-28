import {
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    Ionicons,
} from '@expo/vector-icons';
import { StatusBar, Text, View, StyleSheet, Image, Button } from 'react-native';
import { Avatar } from 'react-native-elements';

const data = {
    name: 'Nguyễn Phúc Hiệp',
    avatar: undefined,
    email: 'Hiep.np215367@sis.hust.edu.vn',
};
export default function Profile() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thông tin sinh viên</Text>
            <View style={styles.core}>
                <View style={styles.coreContent}>
                    <View>
                        <Avatar
                            size={80}
                            source={{
                                uri:
                                    data.avatar ??
                                    '.././assets/images/avatar-default.jpg',
                            }}
                        >
                            <Avatar.Accessory size={20}></Avatar.Accessory>
                        </Avatar>
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.name}>{data.name}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Ionicons
                                name="mail-open"
                                color={'#c21c1c'}
                                size={17}
                                style={{ marginLeft: 10, marginRight: 10 }}
                            ></Ionicons>
                            <Text>{data.email}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 16,
    },
    title: {
        marginLeft: 16,
        fontSize: 16,
        fontWeight: 'bold',
    },
    core: {
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        flexDirection: 'row',
    },
    coreContent: {
        flexDirection: 'row',
        marginLeft: 0,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 10,
        marginBottom: 20,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 30,
    },
    role: {
        fontSize: 19,
        marginLeft: 10,
    },
    info: {
        flexDirection: 'column',
    },
    icon: {
        backgroundColor: '#ccc',
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
});
