import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: "Welcome to TaskFlow",
    subtitle: "Your Personal Productivity Partner",
    description: "Organize your daily tasks with ease and boost your productivity like never before.",
    icon: "checkmark-circle",
    gradient: ['#667eea', '#764ba2']
  },
  {
    id: 2,
    title: "Smart Organization",
    subtitle: "Categorize & Prioritize",
    description: "Create custom categories, set priorities, and never miss an important task again.",
    icon: "library",
    gradient: ['#f093fb', '#f5576c']
  },
  {
    id: 3,
    title: "Track Progress",
    subtitle: "Visual Analytics",
    description: "Monitor your productivity with beautiful charts and achievement badges.",
    icon: "trending-up",
    gradient: ['#4facfe', '#00f2fe']
  },
  {
    id: 4,
    title: "Stay Motivated",
    subtitle: "Rewards & Streaks",
    description: "Build lasting habits with our reward system and daily streaks tracker.",
    icon: "trophy",
    gradient: ['#43e97b', '#38f9d7']
  }
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      // Animate completion
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onComplete();
      });
    }
  };

  const skipToEnd = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
    });
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => {
    return (
      <LinearGradient
        key={slide.id}
        colors={slide.gradient}
        className="flex-1 justify-center items-center px-8"
        style={{ width }}
      >
        {/* Icon Container */}
        <View className="mb-12">
          <View className="w-32 h-32 bg-white/20 rounded-full justify-center items-center mb-4 backdrop-blur-sm">
            <Ionicons 
              name={slide.icon} 
              size={64} 
              color="white" 
            />
          </View>
          
          {/* Floating particles effect */}
          <View className="absolute -top-2 -right-2 w-4 h-4 bg-white/30 rounded-full" />
          <View className="absolute top-8 -left-4 w-2 h-2 bg-white/40 rounded-full" />
          <View className="absolute -bottom-2 left-8 w-3 h-3 bg-white/25 rounded-full" />
        </View>

        {/* Content */}
        <View className="items-center">
          <Text className="text-4xl font-bold text-white text-center mb-4">
            {slide.title}
          </Text>
          
          <Text className="text-xl text-white/90 text-center mb-6 font-medium">
            {slide.subtitle}
          </Text>
          
          <Text className="text-lg text-white/80 text-center leading-7 max-w-sm">
            {slide.description}
          </Text>
        </View>

        {/* Slide indicator */}
        <View className="absolute bottom-48 flex-row space-x-2">
          {slides.map((_, idx) => (
            <View
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx === index ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </View>
      </LinearGradient>
    );
  };

  return (
    <Animated.View 
      className="flex-1"
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {slides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>

      {/* Skip Button */}
      <TouchableOpacity
        onPress={skipToEnd}
        className="absolute top-16 right-6 bg-black/20 px-4 py-2 rounded-full"
        style={{ zIndex: 10 }}
      >
        <Text className="text-white font-medium">Skip</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View className="absolute bottom-20 left-0 right-0 px-8">
        <TouchableOpacity
          onPress={nextSlide}
          className="bg-white rounded-full py-4 px-8 shadow-lg"
        >
          <View className="flex-row items-center justify-center">
            <Text className="text-gray-800 font-bold text-lg mr-2">
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons 
              name={currentIndex === slides.length - 1 ? "checkmark" : "arrow-forward"} 
              size={20} 
              color="#374151" 
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View className="absolute bottom-8 left-8 right-8 h-1 bg-white/20 rounded-full overflow-hidden">
        <View 
          className="h-full bg-white rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
        />
      </View>
    </Animated.View>
  );
};

export default OnboardingScreen;