import { Link, Stack } from "expo-router";
import { Text, View, StyleSheet, Pressable } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Home",
        }}
      />
      <Text style={styles.title}>Zurinet</Text>

      <View style={styles.linksWrapper}>
        <Pressable style={styles.linkButton}>
          <Link href="/Info" style={styles.linkText}>
            More Information
          </Link>
        </Pressable>

        <Pressable style={styles.linkButton}>
          <Link href="/Profile" style={styles.linkText}>
            Profile Details
          </Link>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingTop: 80,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 40,
  },

  linksWrapper: {
    width: "100%",
    gap: 15,
  },

  linkButton: {
    backgroundColor: "#1A1A1A",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },

  linkText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
