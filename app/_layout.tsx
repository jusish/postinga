import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";
import Toast from "react-native-toast-message";
import store from "@/store";
import { toastConfig } from "@/components/ToastConfig";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="posts/[id]"
              options={{
                title: "Post Details",
                headerStyle: {
                  backgroundColor: "#f8fafc",
                },
                headerTintColor: "#0f172a",
                headerTitleStyle: {
                  fontWeight: "600",
                },
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
          <Toast config={toastConfig} />
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}
