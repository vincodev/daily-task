import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { markAllRead } from "../features/notifications/notificationsSlice";

interface NotificationsScreenProps {
  onClose: () => void;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.notifications.items);
  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        className="px-6 py-8 rounded-b-3xl"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">Notifications</Text>
            <Text className="text-white/80 text-lg">{unreadCount} unread</Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              className="bg-white/20 p-3 rounded-full mr-3"
              onPress={() => dispatch(markAllRead())}
            >
              <Text className="text-white font-semibold">Mark all read</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white/20 p-3 rounded-full"
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {items.length === 0 && (
          <Text className="text-gray-500">No notifications</Text>
        )}
        {items.map((n) => (
          <View
            key={n.id}
            className={`bg-white rounded-2xl p-4 shadow mb-3 ${
              n.read ? "opacity-60" : ""
            }`}
          >
            <View className="flex-row items-start">
              <Ionicons name="notifications" size={18} color="#667eea" />
              <View className="ml-3 flex-1">
                <Text className="text-gray-900 font-semibold">{n.title}</Text>
                {!!n.body && (
                  <Text className="text-gray-600 mt-1">{n.body}</Text>
                )}
                <Text className="text-gray-400 text-xs mt-2">
                  {new Date(n.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default NotificationsScreen;
