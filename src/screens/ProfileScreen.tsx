import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface ProfileScreenProps {
  onClose: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => console.log("Logout"),
      },
    ]);
  };

  const profileStats = [
    { label: "Tasks Completed", value: "24", icon: "checkmark-circle" },
    { label: "Current Streak", value: "7 days", icon: "flame" },
    { label: "Total Tasks", value: "156", icon: "list" },
    { label: "Productivity", value: "85%", icon: "trending-up" },
  ];

  const menuItems = [
    {
      icon: "notifications",
      title: "Notifications",
      value: notifications,
      onPress: () => setNotifications(!notifications),
      type: "switch",
    },
    {
      icon: "moon",
      title: "Dark Mode",
      value: darkMode,
      onPress: () => setDarkMode(!darkMode),
      type: "switch",
    },
    {
      icon: "cloud-upload",
      title: "Auto Backup",
      value: autoBackup,
      onPress: () => setAutoBackup(!autoBackup),
      type: "switch",
    },
    {
      icon: "settings",
      title: "Settings",
      onPress: () => console.log("Settings"),
      type: "button",
    },
    {
      icon: "help-circle",
      title: "Help & Support",
      onPress: () => console.log("Help"),
      type: "button",
    },
    {
      icon: "information-circle",
      title: "About",
      onPress: () => console.log("About"),
      type: "button",
    },
  ];

  return (
    <View className="flex-1">
      {/* Header */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        className="px-6 py-8 rounded-b-3xl"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">Profile</Text>
            <Text className="text-white/80 text-lg">Manage your account</Text>
          </View>
          <TouchableOpacity
            className="bg-white/20 p-3 rounded-full"
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-6 py-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info */}
        <View className="bg-white rounded-2xl p-6 shadow mb-6">
          <View className="items-center mb-4">
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-3">
              <Ionicons name="person" size={40} color="#667eea" />
            </View>
            <Text className="text-xl font-bold text-gray-800">John Doe</Text>
            <Text className="text-gray-600">john.doe@example.com</Text>
          </View>

          <TouchableOpacity className="bg-blue-500 py-2 px-4 rounded-xl self-center">
            <Text className="text-white font-semibold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Your Stats
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {profileStats.map((stat, index) => (
              <View
                key={index}
                className="w-[48%] bg-white rounded-2xl p-4 shadow mb-3"
              >
                <View className="flex-row items-center mb-2">
                  <Ionicons name={stat.icon as any} size={20} color="#667eea" />
                  <Text className="text-gray-600 text-sm ml-2">
                    {stat.label}
                  </Text>
                </View>
                <Text className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View className="bg-white rounded-2xl shadow mb-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              className={`flex-row items-center justify-between p-4 ${
                index !== menuItems.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <View className="flex-row items-center">
                <Ionicons name={item.icon as any} size={20} color="#667eea" />
                <Text className="text-gray-800 font-medium ml-3">
                  {item.title}
                </Text>
              </View>

              {item.type === "switch" ? (
                <Switch
                  value={item.value as boolean}
                  onValueChange={item.onPress}
                  trackColor={{ false: "#e5e7eb", true: "#667eea" }}
                  thumbColor="#ffffff"
                />
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 py-4 rounded-2xl mb-6"
        >
          <Text className="text-white font-semibold text-center">Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View className="items-center mb-6">
          <Text className="text-gray-500 text-sm">Daily Task App v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
