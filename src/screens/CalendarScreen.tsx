import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface CalendarScreenProps {
  onClose: () => void;
}

const CalendarScreen: React.FC<CalendarScreenProps> = ({ onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const generateCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: "", isEmpty: true });
    }

    // Add all days of the month
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        i
      );
      days.push({
        day: i,
        date: date,
        isEmpty: false,
        isSelected: date.toDateString() === selectedDate.toDateString(),
        isToday: date.toDateString() === new Date().toDateString(),
      });
    }

    return days;
  };

  const changeMonth = (direction: number) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + direction,
        1
      )
    );
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const calendarDays = generateCalendarDays();

  return (
    <View className="flex-1">
      {/* Header */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        className="px-6 py-8 rounded-b-3xl"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">Calendar</Text>
            <Text className="text-white/80 text-lg">Plan your tasks</Text>
          </View>
          <TouchableOpacity
            className="bg-white/20 p-3 rounded-full"
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Month Navigation */}
      <View className="bg-white p-4 mx-6 -mt-4 rounded-2xl shadow">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={() => changeMonth(-1)} className="p-2">
            <Ionicons name="chevron-back" size={24} color="#667eea" />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-gray-800">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>

          <TouchableOpacity onPress={() => changeMonth(1)} className="p-2">
            <Ionicons name="chevron-forward" size={24} color="#667eea" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar Grid */}
      <View className="flex-1 px-6 py-4">
        {/* Day Headers */}
        <View className="flex-row mb-4">
          {dayNames.map((day, index) => (
            <View key={index} className="flex-1 items-center">
              <Text className="text-gray-600 font-medium text-sm">{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Days */}
        <View className="flex-row flex-wrap">
          {calendarDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => !day.isEmpty && day.date && selectDate(day.date)}
              className={`w-[14.28%] aspect-square items-center justify-center mb-2 ${
                day.isEmpty ? "opacity-0" : ""
              }`}
            >
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  day.isSelected
                    ? "bg-blue-500"
                    : day.isToday
                    ? "bg-blue-100"
                    : ""
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    day.isSelected
                      ? "text-white"
                      : day.isToday
                      ? "text-blue-600"
                      : "text-gray-800"
                  }`}
                >
                  {day.day}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Date Info */}
        <View className="mt-6 bg-white rounded-2xl p-4 shadow">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            {selectedDate.toDateString()}
          </Text>
          <Text className="text-gray-600">
            No tasks scheduled for this date
          </Text>
          <TouchableOpacity className="mt-3 bg-blue-500 py-2 px-4 rounded-xl self-start">
            <Text className="text-white font-semibold">Add Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CalendarScreen;
