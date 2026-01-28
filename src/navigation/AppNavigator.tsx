import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddTodoScreen from '../screens/AddTodoScreen';
import TodoDetailScreen from '../screens/TodoDetailScreen';
import { theme } from '../theme';

export type RootStackParamList = {
  todoList: undefined;
  addTodo: { todoId?: string; initialTitle?: string; initialDescription?: string } | undefined;
  todoDetail: { todoId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer theme={{
        dark: false,
        colors: {
            primary: theme.primary,
            background: theme.background,
            card: theme.background,
            text: theme.text,
            border: theme.secondary,
            notification: theme.primary,
          },
    }}>
      <Stack.Navigator
        initialRouteName="todoList"
        screenOptions={{
          headerShown: false, // Custom headers are used in screens
          cardStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="todoList" component={HomeScreen} />
        <Stack.Screen name="addTodo" component={AddTodoScreen} />
        <Stack.Screen name="todoDetail" component={TodoDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
