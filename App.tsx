//App.tsx

import "./global.css";
import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import { store } from "./src/app/store";
import OnboardingScreen from "./src/components/OnboardingScreen";
import Main from "./src/screens/Main";
import TaskScreen from "./src/screens/TaskScreen";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "./src/app/hooks";
import { setTasks } from "./src/features/tasks/tasksSlice";

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<"home" | "task">("home");

  useEffect(() => {
    const hydrateOnboardingFlag = async () => {
      try {
        const stored = await AsyncStorage.getItem("onboardingCompleted");
        if (stored === "true") {
          setShowOnboarding(false);
        }
      } catch (error) {
      } finally {
        setIsHydrated(true);
      }
    };
    hydrateOnboardingFlag();
  }, []);

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem("onboardingCompleted", "true");
    } catch (error) {}
    setShowOnboarding(false);
  };

  if (!isHydrated) return null;
  if (showOnboarding)
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;

  return (
    <Provider store={store}>
      <TaskPersistence>
        <SafeAreaView className="flex-1">
          {currentPage === "home" ? (
            <Main onAddPress={() => setCurrentPage("task")} />
          ) : (
            <TaskScreen onClose={() => setCurrentPage("home")} />
          )}

          {/* Bottom Tab Bar */}
          <View className="bg-white px-6 py-4 border-t border-gray-100">
            <View className="flex-row justify-around">
              {[
                { key: "home", icon: "home", label: "Home" },
                { key: "task", icon: "list", label: "Tasks" },
                { key: "calendar", icon: "calendar", label: "Calendar" },
                { key: "profile", icon: "person", label: "Profile" },
              ].map((tab) => {
                const isActive =
                  (tab.key === "home" && currentPage === "home") ||
                  (tab.key === "task" && currentPage === "task");
                return (
                  <TouchableOpacity
                    key={tab.key}
                    className="items-center"
                    onPress={() => {
                      if (tab.key === "home") setCurrentPage("home");
                      if (tab.key === "task") setCurrentPage("task");
                    }}
                  >
                    <View
                      className={`p-2 rounded-full ${
                        isActive ? "bg-blue-100" : ""
                      }`}
                    >
                      <Ionicons
                        name={tab.icon as keyof typeof Ionicons.glyphMap}
                        size={24}
                        color={isActive ? "#3B82F6" : "#6B7280"}
                      />
                    </View>
                    <Text
                      className={`text-xs mt-1 ${
                        isActive ? "text-blue-500 font-medium" : "text-gray-500"
                      }`}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </SafeAreaView>
      </TaskPersistence>
    </Provider>
  );
}

// Persist tasks in AsyncStorage
const TASKS_STORAGE_KEY = "tasks_state_v1";

const TaskPersistence: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            dispatch(setTasks(parsed));
          }
        }
      } catch (_) {}
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      } catch (_) {}
    };
    save();
  }, [tasks]);

  return <>{children}</>;
};
