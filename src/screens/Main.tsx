//src/screens/Main.tsx


import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toggleTask, removeTask } from "../features/tasks/tasksSlice";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface MainProps {
  onAddPress?: () => void;
}

const Main: React.FC<MainProps> = ({ onAddPress }) => {
  const tasks = useAppSelector((state) => state.tasks.items);
  const dispatch = useAppDispatch();

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPct = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        className="px-6 py-8 rounded-b-3xl"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">Good Morning!</Text>
            <Text className="text-white/80 text-lg">
              Let's be productive today
            </Text>
          </View>
          <TouchableOpacity className="bg-white/20 p-3 rounded-full">
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Progress Card */}
        <View className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
          <Text className="text-white font-semibold mb-2">
            Today's Progress
          </Text>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white/90">
              {completedCount} of {totalCount} tasks completed
            </Text>
            <Text className="text-white font-bold">{progressPct}%</Text>
          </View>
          <View className="h-2 bg-white/20 rounded-full overflow-hidden">
            <View
              className="h-full bg-white rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Tasks Section */}
      <View className="flex-1 px-6 py-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-800">My Tasks</Text>
          <TouchableOpacity
            className="bg-blue-500 px-4 py-2 rounded-full"
            onPress={onAddPress}
          >
            <View className="flex-row items-center">
              <Ionicons name="add" size={18} color="white" />
              <Text className="text-white font-medium ml-1">Add</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {tasks.length === 0 && (
            <Text className="text-gray-500">
              No tasks yet. Tap Add to create one.
            </Text>
          )}
          {tasks.map((item) => (
            <View
              key={item.id}
              className={`bg-white p-4 rounded-2xl mb-3 shadow-sm ${
                item.completed ? "opacity-60" : ""
              }`}
            >
              <View className="flex-row items-center">
                {/* Checkbox */}
                <TouchableOpacity
                  onPress={() => dispatch(toggleTask(item.id))}
                  className={`w-6 h-6 rounded-full mr-4 justify-center items-center ${
                    item.completed ? "bg-green-500" : "border-2 border-gray-300"
                  }`}
                >
                  {item.completed && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </TouchableOpacity>

                {/* Task Title */}
                <View className="flex-1">
                  <Text
                    className={`text-lg font-medium ${
                      item.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {item.title}
                  </Text>
                </View>

                {/* Delete */}
                <TouchableOpacity
                  onPress={() => dispatch(removeTask(item.id))}
                  className="p-2"
                >
                  <Text className="text-red-500 font-semibold">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Main;
