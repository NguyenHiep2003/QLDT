import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
export default function Header() {
    return(
        <Text style={styles.headerTitle}>HUST</Text>
    )
}
const styles = StyleSheet.create({
    headerTitle: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 30,
      textAlign:'center',
    },
  });