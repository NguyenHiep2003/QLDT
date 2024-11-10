import { TStudentAccount } from '@/types/profile';
import { FlatList, Text, View, StyleSheet, ScrollView } from 'react-native';
import { Avatar } from 'react-native-elements';

type StudentListProps = {
    data: TStudentAccount[];
};
type StudentInfoProps = {
    info: TStudentAccount;
};
export const StudentList = ({ data }: StudentListProps) => {
    return (
            <FlatList
                data={data}
                // keyExtractor={(item) => item.account_id.toString()}
                renderItem={({ item }) => (
                    <StudentInfo info={item}></StudentInfo>
                )}
            />
    );
};

const StudentInfo = ({ info }: StudentInfoProps) => {
    return (
        <View style={styles.core}>
            <View style={styles.coreContent}>
                <View>
                    <Avatar
                        rounded
                        size={40}
                        source={
                            info.avatar
                                ? {
                                      uri: info.avatar,
                                  }
                                : require('@assets/images/avatar-default.jpg')
                        }
                    ></Avatar>
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>
                        {info.first_name + ' ' + info.last_name}
                    </Text>

                    <Text style={{ marginLeft: 10, marginRight: 10 }}>
                        {info.email}
                    </Text>
                </View>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    core: {
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 0,
        marginVertical: 8,
        marginHorizontal: 0,
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
    name: {
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 0,
    },
    info: {
        flexDirection: 'column',
    },
});
