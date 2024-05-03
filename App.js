import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, StyleSheet, Alert, TouchableWithoutFeedback,Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const initialTasks = [
  {
    id: 1,
    title: 'Update Website Content',
    description: 'Update the "About Us" page on the company website with recent achievements and team member information.',
  },
  {
    id: 2,
    title: 'Prepare Monthly Report',
    description: 'Compile data and statistics from various departments to create the monthly report for May. Include sales figures, expenses, and any notable achievements.',
  },
  {
    id: 3,
    title: 'Organize Team Meeting',
    description: 'Schedule and organize a team meeting for next week to discuss the upcoming project deadlines and any challenges team members are facing.',
  },
  {
    id: 4,
    title: 'Research Market Trends',
    description: 'Conduct research on current market trends in the industry and prepare a report highlighting potential opportunities and threats.',
  },
  {
    id: 5,
    title: 'Review and Approve Budget',
    description: 'Review the proposed budget for the next quarter and provide feedback. Once approved, communicate any necessary changes to the finance department.',
  },
  {
    id: 6,
    title: 'Plan Employee Training',
    description: 'Develop a training program for new employees covering company policies, procedures, and job-specific training.',
  },
  {
    id: 7,
    title: 'Coordinate with Vendors',
    description: 'Reach out to vendors to negotiate prices and finalize contracts for upcoming projects. Ensure all necessary materials and services are secured on time.',
  },
  {
    id: 8,
    title: 'Conduct Performance Reviews',
    description: 'Schedule and conduct performance reviews for team members. Provide feedback on their performance and set goals for the upcoming months.',
  },
];

const TaskList = () => {


  const [tasks, setTasks] = useState(initialTasks);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    saveTasks()
  },[]);

  const saveTasks = async () => {
    try {
      let a = await (AsyncStorage.getItem('tasks'))

      if (JSON.parse(a)?.length == null) {

        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      } else {
        let b = await AsyncStorage.getItem('tasks');
        setTasks(JSON.parse(b))
      }

    } catch (error) {
      console.error('Error saving tasks to AsyncStorage:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const tasksFromStorage = await AsyncStorage.getItem('tasks');
      if (tasksFromStorage !== null) {
        setTasks(JSON.parse(tasksFromStorage));
        console.log('Tasks loaded from AsyncStorage:', JSON.parse(tasksFromStorage));
      }
    } catch (error) {
      console.error('Error loading tasks from AsyncStorage:', error);
    }
  };







  // console.log(tasks,"tasks");

  const handleAddTask = () => {


    if (title.trim() === '' || description.trim() === '') {

      Alert.alert('Error', 'Please enter a title and description for the task.');
      return;
    }

    if (editMode && editTaskId) {
      const editedTasks = tasks.map((task) =>
        task.id === editTaskId ? { ...task, title, description } : task
      );
      setTasks(editedTasks);
      setEditMode(false);
      setEditTaskId(null);
      newFunction(editedTasks)

    } else {
      const newTask = {
        id: tasks.length + 1,
        title: title,
        description: description,
      };
      let addedData = [...tasks, newTask]
      newFunction(addedData)
      setTasks([...tasks, newTask]);
    }
    setTitle('');
    setDescription('');
    setModalVisible(false);
  };

  const newFunction = async (data) => {
    await AsyncStorage.setItem('tasks', JSON.stringify(data));
  }

  const handleEditTask = (id, title, description) => {
    setEditMode(true);
    setEditTaskId(id);
    setTitle(title);
    setDescription(description);
    setModalVisible(true);
    
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    newFunction(updatedTasks)

    setTasks(updatedTasks);
  };

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => handleEditTask(item.id, item.title, item.description)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDeleteTask(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );



  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}

        onRequestClose={() => {
          setModalVisible(false);
        }}

      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView} onPress={() => setModalVisible(false)}>
              <TextInput
                style={styles.input}
                placeholder="Enter title"
                value={title}
                onChangeText={(text) => setTitle(text)}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter description"
                value={description}
                onChangeText={(text) => setDescription(text)}
                multiline
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                <Text style={styles.buttonText}>{editMode ? 'Update Task' : 'Add Task'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Add Task</Text>
        
      </TouchableOpacity>

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  taskItem: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginTop: 5,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    minHeight: 40,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 300,
  },
});

export default TaskList;
