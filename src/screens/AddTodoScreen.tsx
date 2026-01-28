import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import TextArea from '../components/TextArea';
import Button from '../components/Button';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../theme';

type AddTodoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'addTodo'>;
type AddTodoScreenRouteProp = RouteProp<RootStackParamList, 'addTodo'>;

const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your backend URL

const AddTodoScreen: React.FC = () => {
  const navigation = useNavigation<AddTodoScreenNavigationProp>();
  const route = useRoute<AddTodoScreenRouteProp>();
  const { todoId, initialTitle, initialDescription } = route.params || {};

  const [title, setTitle] = useState(initialTitle || '');
  const [description, setDescription] = useState(initialDescription || '');
  const [loading, setLoading] = useState(false);

  const isEditing = !!todoId;

  useEffect(() => {
    if (isEditing) {
      navigation.setOptions({ headerTitle: 'Edit Todo' });
    }
  }, [isEditing, navigation]);

  const saveNewTodo = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Todo title cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const url = isEditing ? `${API_BASE_URL}/todos/${todoId}` : `${API_BASE_URL}/todos`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      Alert.alert('Success', `Todo ${isEditing ? 'updated' : 'added'} successfully!`);
      navigation.goBack();
      if (isEditing) {
        // If editing and navigating back, the detail screen might need to refresh.
        // We can leverage useFocusEffect in the detail screen for this.
      }

    } catch (error: any) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} todo:`, error);
      Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'add'} todo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.container}>
        <Header title={isEditing ? 'Edit Todo' : 'Add Todo'} color={theme.primary} />
        <ScrollView contentContainerStyle={styles.content}>
          <TextInput
            label="Title"
            placeholder="Enter todo title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextArea
            label="Description"
            placeholder="Enter todo description (optional)"
            value={description}
            onChangeText={setDescription}
            style={styles.textArea}
          />
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            label={isEditing ? 'Save Changes' : 'Save Todo'}
            onPress={saveNewTodo}
            disabled={loading}
          />
          {loading && <ActivityIndicator size="small" color={theme.primary} style={styles.activityIndicator} />}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
  input: {
    marginBottom: 15,
  },
  textArea: {
    marginBottom: 20,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    marginLeft: 10,
  },
});

export default AddTodoScreen;
