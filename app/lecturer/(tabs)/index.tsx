import { router, useFocusEffect } from 'expo-router';
import {
    SafeAreaView,
    FlatList,
    StyleSheet,
    Text,
    StatusBar,
    View,
} from 'react-native';
import { ClassInfo } from '@/types/generalClassInfor';
import { ClassCard } from '@/components/ClassCard';
import React, { useState } from 'react';
import { getClassList } from '@/services/api-calls/classes';
import { ROLES } from '@/constants/Roles';
import { Dialog } from 'react-native-elements';
import { useErrorContext } from '@/utils/ctx';
import { CustomException, InternalServerError, UnauthorizedException } from '@/utils/exception';

export default function Index() {
    const { setUnhandledError } = useErrorContext();
    const [classes, setClasses] = useState<ClassInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useFocusEffect(
        React.useCallback(() => {
            setIsLoading(true);
            getClassList(ROLES.LECTURER)
                .then((classes) => setClasses(classes))
                .catch((err) => {
                    setUnhandledError(err);
                })
                .finally(() => setIsLoading(false));
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Danh sách lớp giảng dạy</Text>
            {isLoading == false && classes && classes.length == 0 ? (
                <View
                    style={{
                        marginLeft: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center',
                        flex: 1,
                    }}
                >
                    <Text style={{ fontSize: 16 }}>Chưa có lớp</Text>
                </View>
            ) : (
                <FlatList
                    data={classes}
                    renderItem={({ item }) => (
                        <ClassCard
                            data={item}
                            onPress={() =>
                                router.push(
                                    `/lecturer/classes/${item.class_id}`
                                )
                            }
                        />
                    )}
                    keyExtractor={(item) => item.class_id}
                />
            )}
            <Dialog isVisible={isLoading && classes.length == 0}>
                <Dialog.Loading></Dialog.Loading>
            </Dialog>
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
