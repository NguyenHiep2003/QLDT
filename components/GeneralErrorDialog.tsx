import { Dialog } from 'react-native-elements';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

export type GeneralErrorDialogProps = {
    title: string;
    content: string;
    isVisible: boolean;
    onClickPositiveBtn: () => void;
    onBackdropPress?: () => void;
};
export function GeneralErrorDialog({
    title,
    content,
    isVisible,
    onClickPositiveBtn,
    onBackdropPress
}: GeneralErrorDialogProps) {
    return (
        <Dialog
            isVisible={isVisible}
            onBackdropPress={onBackdropPress}
        >
            <Dialog.Title title={title} />
            <Text>{content}</Text>
            <Dialog.Actions>
                <Dialog.Button
                    buttonStyle={{ marginRight: 30 }}
                    title="OK"
                    onPress={onClickPositiveBtn}
                />
            </Dialog.Actions>
        </Dialog>
    );
}
