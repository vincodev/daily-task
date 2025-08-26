import "./global.css";

import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import OnboardingScreen from "./src/components/OnboardingScreen";
import Main from "./src/screens/Main";

import { Provider } from "react-redux";
import { store } from "./src/app/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    const hydrateOnboardingFlag = async () => {
      try {
        const stored = await AsyncStorage.getItem("onboardingCompleted");
        if (stored === "true") {
          setShowOnboarding(false);
        }
      } catch (error) {
        // If storage fails, default to showing onboarding once
      } finally {
        setIsHydrated(true);
      }
    };
    hydrateOnboardingFlag();
  }, []);

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem("onboardingCompleted", "true");
    } catch (error) {
      // Best-effort; continue
    }
    setShowOnboarding(false);
  };

  if (!isHydrated) {
    return null;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <Provider store={store}>
      <SafeAreaView className="flex-1">
        <Main />
      </SafeAreaView>
    </Provider>
  );
}
