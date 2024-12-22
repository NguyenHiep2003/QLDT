import { ClassInfo } from '@/types/generalClassInfor';
import { getAvatarTitle } from '@/utils/getAvatarTitle';
import { getColor } from '@/utils/getColor';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';

type ClassCardProps = {
    data: ClassInfo;
    onPress: () => void;
};

export const ClassCard = ({ data, onPress }: ClassCardProps) => {
    const avatarTitle = getAvatarTitle(data.class_name);
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.item}>
                <Avatar
                    title={avatarTitle}
                    activeOpacity={0.7}
                    rounded
                    containerStyle={{
                        backgroundColor: `${getColor(
                            avatarTitle,
                            data.class_id
                        )}`,
                        width: 65,
                        height: 65,
                        marginRight: 10,
                        borderRadius: 10,
                    }}
                ></Avatar>
                <View
                    style={{
                        marginTop: 10,
                        marginBottom: 5,
                        width: '80%',
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={styles.title}
                    >{`${data.class_id} - ${data.class_name}`}</Text>
                    <Text style={styles.sub_info}>
                        GV : {data.lecturer_name}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    item: {
        borderRadius: 10,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 10,
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
    title: {
        fontSize: 18,
    },
    sub_info: {
        fontSize: 15,
        // marginTop: 10,
        fontStyle: 'italic',
    },
});
