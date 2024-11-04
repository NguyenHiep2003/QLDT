import { ClassInfo } from '@/types/generalClassInfor';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

type ClassCardProps = {
    data: ClassInfo;
    onPress: () => void;
};

export const ClassCard = ({ data, onPress }: ClassCardProps) => (
    <TouchableOpacity onPress={onPress}>
        <View style={styles.item}>
            <Text
                numberOfLines={2}
                style={styles.title}
            >{`${data.class_id} - ${data.class_name}`}</Text>
            <Text style={styles.sub_info}>GV : {data.lecturer_name}</Text>
        </View>
    </TouchableOpacity>
);
const styles = StyleSheet.create({
    item: {
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    title: {
        fontSize: 20,
    },
    sub_info: {
        fontSize: 15,
        marginTop: 10,
        fontStyle: 'italic',
    },
});
