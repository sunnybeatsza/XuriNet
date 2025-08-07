import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Profile() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Profile Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 100,
  },

  headerText: {
    fontSize: 25,
    fontWeight: "bold",
  },
});
