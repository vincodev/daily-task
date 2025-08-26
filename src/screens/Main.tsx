import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { increment, decrement } from '../features/counter/counterSlice';

const Main = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <View className='flex-1 '>
      <Text className='font-bold text-2xl'>Count: {count}</Text>
      <Button title="Increment" onPress={() => dispatch(increment())} />
      <Button title="Decrement" onPress={() => dispatch(decrement())} />
    </View>
  );
};

export default Main;
