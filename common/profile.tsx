import { UnauthorizedDialog } from '@/components/UnauthorizedDialog';
import { logOut } from '@/services/api-calls/auth';
import { changeProfile } from '@/services/api-calls/profile';
import {
    deleteProfile,
    getProfileLocal,
    saveProfileLocal,
} from '@/services/storages/profile';
import { deleteToken } from '@/services/storages/token';
import { TProfile } from '@/types/profile';
import { useErrorContext } from '@/utils/ctx';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar, Text, View, StyleSheet } from 'react-native';
import { Avatar, Dialog, Icon, ListItem } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';
import { convertDriveUrl } from '@/utils/convertDriveUrl';
import { ROLES } from '@/constants/Roles';
import { getColor } from '@/utils/getColor';
import { useSocketContext } from '@/utils/socket.ctx';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Profile({ role }: { role: string }) {
    const [profile, setProfile] = useState<TProfile | undefined>(undefined);
    const [dialogLogoutVisible, setDialogLogoutVisible] = useState(false);
    const { setUnhandledError } = useErrorContext();
    const [isLoading, setIsLoading] = useState(false);
    const { stompClient } = useSocketContext();
    const _handlePressButtonAsync = async () => {
        await WebBrowser.openBrowserAsync(
            'https://ctsv.hust.edu.vn/#/so-tay-sv'
        );
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });
            if (!result.canceled) {
                console.log(result.assets[0]);
                const form = new FormData();
                form.append('file', {
                    uri: result.assets[0]?.uri,
                    type: result.assets[0]?.mimeType,
                    name: result.assets[0]?.fileName,
                    size: result.assets[0]?.fileSize,
                } as any);
                form.append('name', profile?.ho + ' ' + profile?.ten);
                setIsLoading(true);
                const newProfile = await changeProfile(form);
                newProfile.avatar = convertDriveUrl(newProfile.avatar);
                if (profile)
                    saveProfileLocal({ ...profile, avatar: newProfile.avatar });
                setProfile(newProfile);
            }
        } catch (error) {
            console.log('🚀 ~ pickImage ~ error:', error);
        }
    };
    const toggleDialog = () => {
        setDialogLogoutVisible(!dialogLogoutVisible);
    };
    useEffect(() => {
        setIsLoading(true);
        getProfileLocal()
            .then((data) => {
                setProfile(data);
            })
            .finally(() => setIsLoading(false));
    }, []);
    if (profile)
        return (
            <View style={styles.container}>
                {/* <Text style={styles.title}>Thông tin tài khoản</Text> */}
                <View style={styles.core}>
                    <View style={styles.coreContent}>
                        <View>
                            {!profile.avatar ? (
                                <Avatar
                                    title={profile.ho[0] + profile.ten[0]}
                                    activeOpacity={0.7}
                                    size={100}
                                    containerStyle={{
                                        backgroundColor: `${getColor(
                                            profile.ho[0] + profile.ten[0],
                                            profile.id
                                        )}`,
                                        marginRight: 10,
                                    }}
                                >
                                    <Avatar.Accessory
                                        size={20}
                                        onPress={() =>
                                            pickImage().finally(() =>
                                                setIsLoading(false)
                                            )
                                        }
                                    ></Avatar.Accessory>
                                </Avatar>
                            ) : (
                                <Avatar
                                    size={100}
                                    source={{
                                        uri: profile.avatar,
                                    }}
                                >
                                    <Avatar.Accessory
                                        size={20}
                                        onPress={() =>
                                            pickImage().finally(() =>
                                                setIsLoading(false)
                                            )
                                        }
                                    ></Avatar.Accessory>
                                </Avatar>
                            )}
                        </View>
                        <View style={styles.info}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.name}>
                                    {profile.ho + ' ' + profile.ten}
                                </Text>
                                <View style={{ marginLeft: 10, marginTop: 39 }}>
                                    {/* <Icon
                                        name="edit"
                                        color={'black'}
                                        size={20}
                                        onPress={() =>
                                            setDialogEditUsernameVisible(true)
                                        }
                                    ></Icon> */}
                                </View>
                            </View>

                            {/* <Ionicons
                                    name="mail-open"
                                    color={'#c21c1c'}
                                    size={17}
                                    style={{ marginLeft: 10, marginRight: 10 }}
                                ></Ionicons> */}
                            {/* <Text style={{ marginLeft: 10, marginRight: 10 }}>
                                Họ tên: {profile.ho + ' ' + profile.ten}
                            </Text> */}
                            <View style={{ flexDirection: 'row' }}>
                                <Ionicons
                                    name="mail-open"
                                    color={'#c21c1c'}
                                    size={17}
                                    style={{
                                        marginLeft: 10,
                                        marginRight: 5,
                                        marginTop: 4,
                                    }}
                                ></Ionicons>
                                <Text
                                    style={{
                                        marginLeft: 0,
                                        marginBottom: 0,
                                        fontSize: 18,
                                        marginTop: 0,
                                    }}
                                >
                                    {profile.email}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text
                                    style={{
                                        marginLeft: 10,
                                        marginRight: 10,
                                        marginTop: 15,
                                        fontSize: 16,
                                    }}
                                >
                                    Vai trò:
                                </Text>
                                <Text
                                    style={{
                                        marginLeft: 0,
                                        marginBottom: 0,
                                        fontSize: 16,
                                        marginTop: 15,
                                    }}
                                >
                                    {profile.role == 'STUDENT'
                                        ? 'Sinh viên'
                                        : 'Giảng viên'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.list}>
                    <ListItem
                        style={{ marginBottom: 5 }}
                        onPress={() => {
                            if (role == ROLES.STUDENT)
                                router.push('/student/changePassword');
                            else router.push('/lecturer/changePassword');
                        }}
                    >
                        <Icon
                            name="key"
                            type="material-community"
                            color="#ffe44a"
                        />
                        <ListItem.Content>
                            <ListItem.Title>{'Đổi mật khẩu'}</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                    {role == ROLES.STUDENT ? (
                        <ListItem
                            style={{ marginBottom: 5 }}
                            onPress={_handlePressButtonAsync}
                        >
                            <Icon
                                name="book"
                                type="material-community"
                                color="#189bcc"
                            />
                            <ListItem.Content>
                                <ListItem.Title>
                                    {'Sinh viên cần biết'}
                                </ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron
                                onPress={_handlePressButtonAsync}
                            />
                        </ListItem>
                    ) : undefined}
                    <ListItem
                        style={{ marginBottom: 5 }}
                        onPress={() => setDialogLogoutVisible(true)}
                    >
                        <Icon
                            name="logout"
                            type="material-community"
                            color="#cb0527"
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
                                try {
                                    logOut();
                                    deleteProfile();
                                    deleteToken();
                                    AsyncStorage.clear();
                                    if (stompClient?.connected)
                                        stompClient?.deactivate();
                                    router.navigate('/(auth)/sign-in');
                                } catch (error: any) {
                                    setUnhandledError(error);
                                }
                            }}
                        />
                    </Dialog.Actions>
                </Dialog>
                <Dialog isVisible={isLoading}>
                    <Dialog.Loading></Dialog.Loading>
                </Dialog>
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
        marginBottom: 10,
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
        marginBottom: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 0,
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
