import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Href, router} from "expo-router";
export default function Header({title='HUST'}:{title?: string}) {
    return(
        <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Ionicons style={styles.icon} name="notifications-outline" size={24} color="white" onPress={() => router.navigate(`/(notification)` as Href<string>)}/>
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
