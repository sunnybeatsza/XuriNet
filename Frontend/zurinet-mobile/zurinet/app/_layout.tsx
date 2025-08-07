import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1ee6f4b4",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="Home" />
      <Stack.Screen name="Info" />
      <Stack.Screen name="Profile" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
