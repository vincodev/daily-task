import "./global.css";

import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import OnboardingScreen from "./components/OnboardingScreen";

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleResetOnboarding = () => {
    setShowOnboarding(true);
  };

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        className="flex-1"
      >
        <View className="flex-1 items-center justify-center p-6">
            <Pressable
              onPress={handleResetOnboarding}
              className="bg-white/20 backdrop-blur-sm border border-white/30 py-4 px-8 rounded-2xl shadow-lg"
            >
              <Text className="font-bold text-lg text-white">
                View Onboarding Again
              </Text>
            </Pressable>
          </View>
      </LinearGradient>
    </SafeAreaView>
  );
}