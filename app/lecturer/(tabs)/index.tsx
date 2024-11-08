import {router, useFocusEffect} from 'expo-router';
import {
    SafeAreaView,
    FlatList,
    StyleSheet,
    Text,
    StatusBar,
} from 'react-native';
import { ClassInfo } from '@/types/generalClassInfor';
import { ClassCard } from '@/components/ClassCard';
import { useEffect, useState } from 'react';
import { getClassList } from '@/services/api-calls/classes';
import { ROLES } from '@/constants/Roles';
import { UnauthorizedDialog } from '@/components/UnauthorizedDialog';

export default function Index() {
    const [classes, setClasses] = useState<ClassInfo[]>([]);
    const [dialogUnauthorizedVisible, setDialogUnauthorizedVisible] = useState(false);

    useFocusEffect(() => {
        getClassList(ROLES.STUDENT)
            .then((classes) => setClasses(classes))
            .catch((err) => {
                if (err.response.status == 401 || err.response.status == 403) {
                    setDialogUnauthorizedVisible(true);
                }
            });
    });

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Danh sách lớp giảng dạy</Text>
            <FlatList
                data={classes}
                renderItem={({ item }) => (
                    <ClassCard
                        data={item}
                        onPress={() =>
                            router.push({
                                pathname: `/lecturer/classes/${item.class_id}`,
                                params: { class_id: item.class_id },
                            })
                        }
                    />
                )}
                keyExtractor={(item) => item.class_id}
            />
            <UnauthorizedDialog
                isVisible={dialogUnauthorizedVisible}
            ></UnauthorizedDialog>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 10,
    },
    title: {
        marginLeft: 16,
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold',
    },
});
