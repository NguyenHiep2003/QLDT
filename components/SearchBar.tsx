import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchBar = ({
    onFocus,
    search,
    onChangeText,
    autoFocus = false
}: {
    onFocus?: () => void;
    search?: string;
    onChangeText?: (text: string) => void;
    autoFocus?: boolean
}) => {
    return (
        <View style={styles.container}>
            <Icon name="search" size={20} color="#888" style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder="Tìm kiếm..."
                value={search}
                onChangeText={onChangeText ? onChangeText : undefined}
                onFocus={onFocus}
                autoFocus={autoFocus}

            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    icon: {
        marginHorizontal: 5,
    },
    input: {
        flex: 1,
        height: 30,
    },
    clearIcon: {
        marginHorizontal: 5,
    },
});

export default SearchBar;
