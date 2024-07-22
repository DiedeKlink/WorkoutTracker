import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const WorkoutScreen = ({ route }) => {
  const { date } = route.params || {};
  const [workout, setWorkout] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [split, setSplit] = useState('Push');
  const [selectedDate, setSelectedDate] = useState(date ? new Date(date) : new Date());
  const navigation = useNavigation();

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const savedWorkout = await AsyncStorage.getItem('workout');
        if (savedWorkout !== null) {
          setWorkout(JSON.parse(savedWorkout));
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadWorkout();
  }, []);

  const addWorkout = () => {
    const dateString = selectedDate.toISOString().split('T')[0];

    // Create a new workout entry
    const newWorkout = {
      split,
      exercises: [] // Initialize exercises as an empty array
    };

    // Update the workout state with the new workout entry
    const updatedWorkout = {
      ...workout,
      [dateString]: [...(workout[dateString] || []), newWorkout]
    };

    setWorkout(updatedWorkout);
    setModalVisible(false);

    try {
      AsyncStorage.setItem('workout', JSON.stringify(updatedWorkout));
    } catch (e) {
      console.error(e);
    }

    navigation.navigate('WorkoutEdit', { date: dateString, split });
  };

  const dateString = selectedDate.toISOString().split('T')[0];

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>Selected Date: {dateString}</Text>
      <Button title="Add Workout" onPress={() => setModalVisible(true)} />
      <FlatList
        data={workout[dateString] || []} // Ensure data is always an array
        renderItem={({ item, index }) => (
          <View key={index} style={styles.workoutContainer}>
            <Text style={styles.dateText}>Date: {dateString}</Text>
            <Text style={styles.splitText}>Split: {item.split}</Text>
            {(item.exercises || []).map((exercise, idx) => (
              <View key={idx} style={styles.exerciseContainer}>
                <Text style={styles.exerciseText}>
                  {exercise.name} - {exercise.reps} reps - {exercise.weight} kg
                </Text>
              </View>
            ))}
            <Button
              title="Edit Workout"
              onPress={() => navigation.navigate('WorkoutEdit', { date: dateString, split: item.split, index })}
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Workout</Text>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Split:</Text>
            <Picker
              selectedValue={split}
              style={styles.picker}
              onValueChange={(itemValue) => setSplit(itemValue)}
            >
              <Picker.Item label="Push" value="Push" />
              <Picker.Item label="Pull" value="Pull" />
              <Picker.Item label="Legs" value="Legs" />
            </Picker>
          </View>
          <Button title="Create Workout" onPress={addWorkout} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  workoutContainer: {
    width: '100%',
    padding: 10,
  },
  splitText: {
    fontSize: 16,
    marginBottom: 10,
  },
  exerciseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseText: {
    fontSize: 16,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  pickerContainer: {
    width: '80%',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default WorkoutScreen;
