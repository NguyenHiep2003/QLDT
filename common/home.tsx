import { router, useFocusEffect } from 'expo-router';
import {
    SafeAreaView,
    View,
    FlatList,
    StyleSheet,
    Text,
    StatusBar,
    RefreshControl,
} from 'react-native';
import { ClassInfo } from '@/types/generalClassInfor';
import { ClassCard } from '@/components/ClassCard';
import React, { useState } from 'react';
import { getClassList } from '@/services/api-calls/classes';
import { ROLES } from '@/constants/Roles';
import { Dialog } from 'react-native-elements';
import { useErrorContext } from '@/utils/ctx';
import OfflineStatusBar from '@/components/OfflineBar';
import { NetworkError } from '@/utils/exception';

export function Home({ role }: { role: ROLES }) {
    const [refreshing, setRefreshing] = React.useState(false);
    const [classes, setClasses] = useState<ClassInfo[]>([]);
    const { setUnhandledError } = useErrorContext();
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getClassList(role)
            .then((classes) => {
                setClasses(classes?.page_content as ClassInfo[]);
            })
            .catch((err) => {
                if (err instanceof NetworkError) return setClasses(err.cache);
                setUnhandledError(err);
            })
            .finally(() => setRefreshing(false));
    }, []);
    const [isLoading, setIsLoading] = useState(true);
    useFocusEffect(
        React.useCallback(() => {
            setIsLoading(true);
            getClassList(role)
                .then((classes) => {
                    setClasses(classes?.page_content as ClassInfo[]);
                })
                .catch((err) => {
                    if (err instanceof NetworkError)
                        return setClasses(err.cache);
                    setUnhandledError(err);
                })
                .finally(() => setIsLoading(false));
        }, [])
    );
    return (
        <SafeAreaView style={styles.container}>
            <OfflineStatusBar></OfflineStatusBar>
            {role == ROLES.STUDENT ? (
                <Text style={styles.title}>Danh sách lớp học</Text>
            ) : (
                <Text style={styles.title}>Danh sách lớp giảng dạy </Text>
            )}
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
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    data={classes}
                    renderItem={({ item }) => (
                        <ClassCard
                            data={item}
                            onPress={() => {
                                role == ROLES.STUDENT
                                    ? router.push(
                                          `/student/classes/${item.class_id}`
                                      )
                                    : router.push(
                                          `/lecturer/classes/${item.class_id}`
                                      );
                            }}
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
        marginTop: 0,
    },
    title: {
        marginTop: 10,
        marginLeft: 16,
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold',
    },
});
