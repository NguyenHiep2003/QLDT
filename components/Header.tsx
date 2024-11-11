import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
export default function Header({title='HUST'}:{title?: string}) {
    return(
        <Text style={styles.headerTitle}>{title}</Text>
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