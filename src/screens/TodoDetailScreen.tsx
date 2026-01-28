import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../components/Header';
import TextDisplay from '../components/TextDisplay';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

type TodoDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'todoDetail'>;
type TodoDetailScreenRouteProp = RouteProp<RootStackParamList, 'todoDetail'>;

const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your backend URL

const TodoDetailScreen: React.FC = () => {
  const navigation = useNavigation<TodoDetailScreenNavigationProp>();
  const route = useRoute<TodoDetailScreenRouteProp>();
  const { todoId } = route.params;

  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchTodoDetails = async () => {
    if (!todoId) {
      setError('No Todo ID provided.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${todoId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTodo(data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch todo details.');
      console.error('Fetch todo details error:', e);
      Alert.alert('Error', 'Failed to load todo details.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTodoDetails();
    }, [todoId])
  );

  const toggleTodoCompletion = async () => {
    if (!todo) return;

    setUpdatingStatus(true);
    const newCompletedStatus = !todo.completed;

    try {
      const response = await fetch(`${API_BASE_URL}/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...todo, completed: newCompletedStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      setTodo((prevTodo) => prevTodo ? { ...prevTodo, completed: newCompletedStatus } : null);
      // Alert.alert('Success', `Todo marked as ${newCompletedStatus ? 'completed' : 'pending'}.`);
    } catch (error: any) {
      console.error('Error toggling todo completion:', error);
      Alert.alert('Error', `Failed to update todo status: ${error.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const deleteTodo = async () => {
    if (!todo) return;

    Alert.alert(
      'Delete Todo',
      `Are you sure you want to delete "${todo.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true); // Use global loading for deletion as well
            try {
              const response = await fetch(`${API_BASE_URL}/todos/${todo.id}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                const errorText = await response.text(); // Get raw text for better debugging
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
              }

              Alert.alert('Success', 'Todo deleted successfully.');
              navigation.goBack(); // Go back to the list after deletion
            } catch (error: any) {
              console.error('Error deleting todo:', error);
              Alert.alert('Error', `Failed to delete todo: ${error.message}`);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const navigateToEditTodo = () => {
    if (todo) {
      navigation.navigate('addTodo', { todoId: todo.id, initialTitle: todo.title, initialDescription: todo.description });
    }
  };

  if (loading && !todo) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.text, marginTop: 10 }}>Loading Todo Details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={{ color: 'red', fontSize: 16 }}>Error: {error}</Text>
        <Button label="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: 20 }} />
      </View>
    );
  }

  if (!todo) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={{ color: theme.text, fontSize: 16 }}>Todo not found.</Text>
        <Button label="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Todo Details"
        color={theme.primary}
        rightButtonIcon={"edit"}
        onRightButtonPress={navigateToEditTodo}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <TextDisplay label="Title" value={todo.title} />
        <TextDisplay label="Description" value={todo.description || 'No description provided.'} />
        <View style={styles.checkboxContainer}>
          <Checkbox
            label="Completed"
            checked={todo.completed}
            onToggle={toggleTodoCompletion}
            disabled={updatingStatus}
          />
          {updatingStatus && <ActivityIndicator size="small" color={theme.primary} style={styles.activityIndicator} />}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button label="Delete Todo" onPress={deleteTodo} color="#EF4444" />
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
  content: {
    flexGrow: 1,
    padding: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 5,
    backgroundColor: theme.secondary,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.secondary,
  },
  activityIndicator: {
    marginLeft: 10,
  },
});

export default TodoDetailScreen;
