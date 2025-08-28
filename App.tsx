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
import CalendarScreen from "./src/screens/CalendarScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "./src/app/hooks";
import { setTasks } from "./src/features/tasks/tasksSlice";
import {
  setNotifications,
  addNotification,
} from "./src/features/notifications/notificationsSlice";

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<
    "home" | "task" | "calendar" | "profile" | "notifications"
  >("home");

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
          {currentPage === "home" && (
            <Main
              onAddPress={() => setCurrentPage("task")}
              onNotificationsPress={() => setCurrentPage("notifications")}
            />
          )}
          {currentPage === "notifications" && (
            <NotificationsScreen onClose={() => setCurrentPage("home")} />
          )}
          {currentPage === "task" && (
            <TaskScreen onClose={() => setCurrentPage("home")} />
          )}
          {currentPage === "calendar" && (
            <CalendarScreen
              onClose={() => setCurrentPage("home")}
              onAddPress={() => setCurrentPage("task")}
            />
          )}
          {currentPage === "profile" && (
            <ProfileScreen onClose={() => setCurrentPage("home")} />
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
                  (tab.key === "task" && currentPage === "task") ||
                  (tab.key === "calendar" && currentPage === "calendar") ||
                  (tab.key === "profile" && currentPage === "profile");
                return (
                  <TouchableOpacity
                    key={tab.key}
                    className="items-center"
                    onPress={() => {
                      if (tab.key === "home") setCurrentPage("home");
                      if (tab.key === "task") setCurrentPage("task");
                      if (tab.key === "calendar") setCurrentPage("calendar");
                      if (tab.key === "profile") setCurrentPage("profile");
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
const NOTIFS_STORAGE_KEY = "notifs_state_v1";

const TaskPersistence: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);
  const notifications = useAppSelector((state) => state.notifications.items);

  // Load persisted tasks and notifications on mount
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
        const rawNotifs = await AsyncStorage.getItem(NOTIFS_STORAGE_KEY);
        if (rawNotifs) {
          const parsedN = JSON.parse(rawNotifs);
          if (Array.isArray(parsedN)) {
            dispatch(setNotifications(parsedN));
          }
        }
      } catch (_) {}
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist tasks
  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      } catch (_) {}
    };
    save();
  }, [tasks]);

  // Persist notifications
  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(
          NOTIFS_STORAGE_KEY,
          JSON.stringify(notifications)
        );
      } catch (_) {}
    };
    save();
  }, [notifications]);

  // Generate in-app notifications
  useEffect(() => {
    const postDailyReminder = () => {
      const todayKey = new Date().toDateString();
      const exists = notifications.some((n) => n.tag === `daily:${todayKey}`);
      if (!exists) {
        dispatch(
          addNotification(
            "Daily Reminder",
            "Create your tasks for today to stay on track",
            `daily:${todayKey}`
          )
        );
      }
    };

    const postIncompleteYesterday = () => {
      const now = new Date();
      const yesterday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
      );
      const sameDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
      const yTasks = tasks.filter((t) =>
        sameDay(new Date(t.createdAt), yesterday)
      );
      if (yTasks.length === 0) return;
      const allDone = yTasks.every((t) => t.completed);
      const tag = `incomplete:${yesterday.toDateString()}`;
      const exists = notifications.some((n) => n.tag === tag);
      if (!allDone && !exists) {
        dispatch(
          addNotification(
            "Unfinished tasks",
            "You didn't finish all tasks yesterday. Review and complete them.",
            tag
          )
        );
      }
    };

    postDailyReminder();
    postIncompleteYesterday();
  }, [tasks, notifications, dispatch]);

  return <>{children}</>;
};
