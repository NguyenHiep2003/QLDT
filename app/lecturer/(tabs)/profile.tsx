import { UnauthorizedDialog } from '@/components/UnauthorizedDialog';
import { changeUsername } from '@/services/api-calls/profile';
import { deleteProfile, getProfileLocal } from '@/services/storages/profile';
import { deleteToken } from '@/services/storages/token';
import { TProfile } from '@/types/profile';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar, Text, View, StyleSheet, Image, Button } from 'react-native';
import { Avatar, Dialog, Icon, Input, ListItem } from 'react-native-elements';

export default function Profile() {
    const [profile, setProfile] = useState<TProfile | undefined>(undefined);
    const [newUserName, setNewUsername] = useState('');
    const [dialogLogoutVisible, setDialogLogoutVisible] = useState(false);
    const [dialogUnauthorizedVisible, setDialogUnauthorizedVisible] =
        useState(false);
    const [dialogEditUsernameVisible, setDialogEditUsernameVisible] =
        useState(false);
    const toggleDialog = () => {
        setDialogLogoutVisible(!dialogLogoutVisible);
    };
    const toggleDialogEdit = () => {
        setNewUsername('');
        setDialogEditUsernameVisible(!dialogEditUsernameVisible);
    };
    useEffect(() => {
        getProfileLocal().then((data) => setProfile(data));
    }, []);
    if (profile)
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Thông tin giảng viên</Text>
                <View style={styles.core}>
                    <View style={styles.coreContent}>
                        <View>
                            <Avatar
                                size={80}
                                source={
                                    profile.avatar
                                        ? {
                                              uri: profile.avatar,
                                          }
                                        : require('@assets/images/avatar-default.jpg')
                                }
                            >
                                <Avatar.Accessory size={20}></Avatar.Accessory>
                            </Avatar>
                        </View>
                        <View style={styles.info}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.name}>
                                    {profile.user_name}
                                </Text>
                                <View style={{ marginLeft: 10, marginTop: 33 }}>
                                    <Icon
                                        name="edit"
                                        color={'black'}
                                        size={20}
                                        onPress={() =>
                                            setDialogEditUsernameVisible(true)
                                        }
                                    ></Icon>
                                </View>
                            </View>

                            {/* <Ionicons
                                    name="mail-open"
                                    color={'#c21c1c'}
                                    size={17}
                                    style={{ marginLeft: 10, marginRight: 10 }}
                                ></Ionicons> */}
                            <Text style={{ marginLeft: 10, marginRight: 10 }}>
                                Họ tên: {profile.ho + ' ' + profile.ten}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.list}>
                    <ListItem
                        onPress={() => {
                            router.navigate('/lecturer/changePassword');
                        }}
                    >
                        <Icon
                            name="key"
                            type="material-community"
                            color="grey"
                        />
                        <ListItem.Content>
                            <ListItem.Title>{'Đổi mật khẩu'}</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                    <ListItem onPress={() => setDialogLogoutVisible(true)}>
                        <Icon
                            name="logout"
                            type="material-community"
                            color="grey"
                        />
                        <ListItem.Content>
                            <ListItem.Title>{'Đăng xuất'}</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron
                            onPress={() => setDialogLogoutVisible(true)}
                        />
                    </ListItem>
                </View>
                <Dialog
                    isVisible={dialogLogoutVisible}
                    onBackdropPress={toggleDialog}
                >
                    <Dialog.Title title={'Đăng xuất'} />
                    <Text>Bạn có chắc chắn muốn đăng xuất?</Text>
                    <Dialog.Actions>
                        <Dialog.Button
                            buttonStyle={{ marginRight: 30 }}
                            title="Đồng ý"
                            onPress={async () => {
                                await deleteProfile();
                                await deleteToken();
                                router.navigate('/(auth)/sign-in');
                            }}
                        />
                    </Dialog.Actions>
                </Dialog>
                <Dialog
                    isVisible={dialogEditUsernameVisible}
                    onBackdropPress={toggleDialogEdit}
                >
                    <Dialog.Title title={'Nhập username mới:'} />
                    <Input
                        value={newUserName}
                        onChangeText={(e) => {
                            setNewUsername(e);
                        }}
                    ></Input>
                    <Dialog.Actions>
                        <Dialog.Button
                            buttonStyle={{ marginRight: 30 }}
                            title={'CONFIRM'}
                            onPress={async () => {
                                try {
                                    await changeUsername(newUserName);
                                    toggleDialogEdit();
                                } catch (error: any) {
                                    console.log(error);
                                }
                            }}
                        />
                        <Dialog.Button
                            title={'CANCEL'}
                            onPress={() => {
                                toggleDialogEdit();
                            }}
                        />
                    </Dialog.Actions>
                </Dialog>
                <UnauthorizedDialog
                    isVisible={dialogUnauthorizedVisible}
                    onBackdropPress={() =>
                        setDialogUnauthorizedVisible(!dialogUnauthorizedVisible)
                    }
                ></UnauthorizedDialog>
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
    list: {
        marginHorizontal: 16,
    },
});
