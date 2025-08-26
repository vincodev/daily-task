//src/screens/TaskScreen.tsx


import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addTask, toggleTask, removeTask } from "../features/tasks/tasksSlice";

interface TaskScreenProps {
  onClose: () => void;
  onAddTitle?: (title: string) => void;
}

const TaskScreen: React.FC<TaskScreenProps> = ({ onClose, onAddTitle }) => {
  const [title, setTitle] = useState("");
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);
  const completedTasks = tasks.filter((t) => t.completed);

  const handleAdd = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    if (onAddTitle) {
      onAddTitle(trimmed);
    } else {
      dispatch(addTask(trimmed));
    }
    onClose();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      {/* Header */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        className="px-6 py-8 rounded-b-3xl"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">New Task</Text>
            <Text className="text-white/80 text-lg">
              Let's add something to do
            </Text>
          </View>
          <TouchableOpacity
            className="bg-white/20 p-3 rounded-full"
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <LinearGradient colors={["#f5f7fa", "#ffffff"]} className="flex-1 p-6">
        <View className="bg-white/90 rounded-2xl p-4 shadow">
          <Text className="text-gray-700 mb-2">Task title</Text>
          <TextInput
            placeholder="e.g. Buy groceries"
            value={title}
            onChangeText={setTitle}
            className="text-lg text-gray-800"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAdd}
          />
        </View>

        <View className="mt-6 flex-row space-x-4">
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 bg-white/20 border border-gray-200 py-4 rounded-xl items-center"
          >
            <Text className="text-gray-800 font-semibold">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAdd}
            className="flex-1 bg-blue-500 py-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold">Add Task</Text>
          </TouchableOpacity>
        </View>

        {completedTasks.length > 0 && (
          <View className="mt-8">
            <Text className="text-gray-800 text-lg font-bold mb-3">
              Completed
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {completedTasks.map((item) => (
                <View
                  key={item.id}
                  className="bg-white p-4 rounded-2xl mb-3 shadow-sm opacity-80"
                >
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={() => dispatch(toggleTask(item.id))}
                      className="w-6 h-6 rounded-full mr-4 justify-center items-center bg-green-500"
                    >
                      <Ionicons name="checkmark" size={16} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                      <Text className="text-lg font-medium line-through text-gray-500">
                        {item.title}
                      </Text>
                    </View>
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
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default TaskScreen;
