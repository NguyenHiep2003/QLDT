import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Href, router} from "expo-router";
import {useEffect, useState} from "react";
import {getUnreadCount} from "@/services/api-calls/notification";

export default function Header({title='HUST'}:{title?: string}) {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        getUnreadNotificationCount();
    }, []);

    async function getUnreadNotificationCount() {
        const response = await getUnreadCount();
        setUnreadCount(response.data);
    }

    return(
        <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={{ position: 'relative' }}>
                <Ionicons
                    style={styles.icon}
                    name="notifications-outline"
                    size={24}
                    color="white"
                    onPress={() => router.navigate(`/(notification)` as Href<string>)}
                />
                {unreadCount > 0 && (
                    <View style={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        backgroundColor: 'red',
                        borderRadius: 10,
                        width: 20,
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: 'white', fontSize: 12 }}>
                            {unreadCount}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    headerTitle: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 30,
      textAlign:'center',
    },
    header: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
    },
    icon: {
        marginRight: 0
    }
});
