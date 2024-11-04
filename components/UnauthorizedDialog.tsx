import { Dialog } from "react-native-elements";
import { Text } from "react-native";
import { router } from "expo-router";

export function UnauthorizedDialog(props: any) {
    return (
        <Dialog isVisible={props.isVisible}>
            <Dialog.Title title={"Tài khoản xác thực không thành công"} />
            <Text>Phiên đăng nhập của bạn đã hết!</Text>
            <Dialog.Actions>
                <Dialog.Button
                    buttonStyle={{ marginRight: 30 }}
                    title="OK"
                    onPress={() => {
                        router.navigate('/(auth)/sign-in');
                    }}
                />
            </Dialog.Actions>
        </Dialog>
    );
}
