import SearchBar from '@/components/SearchBar';
import { searchByEmail } from '@/services/api-calls/search';
import { AccountSearch, SearchByMailResponse } from '@/types/search';
import { useErrorContext } from '@/utils/ctx';
import { router } from 'expo-router';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { StyleSheet, Text } from 'react-native';
import { Divider } from 'react-native-elements';

const renderItem = ({ item }: { item: AccountSearch }) => {
    return (
        <TouchableOpacity
            onPress={() =>
                router.push(
                    `/student/(tabs)/chat/conversation?partnerId=${item.account_id}`
                )
            }
        >
            <View style={{ marginTop: 10, marginLeft: 15 }}>
                <Text style={{ fontSize: 20 }}>
                    {item.first_name + ' ' + item.last_name}
                </Text>
                <Text style={{ fontSize: 17, fontWeight: 200 }}>
                    {item.email}
                </Text>
                <Divider></Divider>
            </View>
        </TouchableOpacity>
    );
};

export function ConversationSearch() {
    const [data, setData] = useState<AccountSearch[]>([]);
    const [search, setSearch] = useState('');
    const { setUnhandledError } = useErrorContext();
    const [isEmpty, setIsEmpty] = useState(false);
    const handleSearch = useCallback(
        debounce((text) => {
            searchByEmail(text)
                .then((data: SearchByMailResponse) => {
                    console.log(data);
                    const list = data.data.page_content;
                    if (list.length == 0) setIsEmpty(true);
                    setData(list);
                })
                .catch((err) => setUnhandledError(err));
        }, 300),
        []
    );

    const onChangeText = (text: string) => {
        setSearch(text);
        setIsEmpty(false);
        if (text.length > 1) {
            handleSearch(text);
        } else {
            setData([]);
        }
    };

    return (
        <View>
            <SearchBar
                search={search}
                onChangeText={onChangeText}
                autoFocus={true}
            ></SearchBar>
            {isEmpty && (
                <Text style={{ alignSelf: 'center' }}>
                    Không tìm thấy kết quả phù hợp
                </Text>
            )}
            <FlatList
                data={data}
                keyExtractor={(item) => item.account_id}
                renderItem={renderItem}
            ></FlatList>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});
