import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../components/Header';
import Button from '../components/Button';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../theme';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'todoList'>;

const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your backend URL

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTodos(data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch todos.');
      console.error('Fetch todos error:', e);
      Alert.alert('Error', 'Failed to load todos. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTodos();
    }, [])
  );

  const navigateToTodoDetail = (todoId: string) => {
    navigation.navigate('todoDetail', { todoId });
  };

  const navigateToAddTodo = () => {
    navigation.navigate('addTodo', {});
  };

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <TouchableOpacity
      style={styles.todoItem}
      onPress={() => navigateToTodoDetail(item.id)}
    >
      <Text style={item.completed ? styles.todoTitleCompleted : styles.todoTitle}>
        {item.title}
      </Text>
      <Text style={styles.todoStatus}>
        Status: {item.completed ? 'Completed' : 'Pending'}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.text, marginTop: 10 }}>Loading Todos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="My Todos" color={theme.primary} />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={renderTodoItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>No todos yet! Add some tasks.</Text>
          </View>
        }
      />
      <View style={styles.buttonContainer}>
        <Button label="Add New Todo" onPress={navigateToAddTodo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  todoItem: {
    backgroundColor: theme.secondary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: theme.primary,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 5,
  },
  todoTitleCompleted: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 5,
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  todoStatus: {
    fontSize: 14,
    color: theme.text,
    opacity: 0.8,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.secondary,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyListText: {
    fontSize: 16,
    color: theme.text,
    textAlign: 'center',
  },
});

export default HomeScreen;
