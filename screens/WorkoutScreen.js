import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, Modal, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CalendarPicker from 'react-native-calendar-picker';
import { Picker } from '@react-native-picker/picker';
import popularExercises from '../data/popularExercises'; // Correct path

const WorkoutScreen = ({ route }) => {
  const { date } = route.params || {}; // Destructure date and provide fallback if route.params is undefined
  const [workout, setWorkout] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    reps: '',
    weight: '',
    split: 'Push'
  });
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedDate, setSelectedDate] = useState(date ? new Date(date) : new Date());

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

  useEffect(() => {
    if (newExercise.name === '') {
      setFilteredExercises([]);
    } else {
      const regex = new RegExp(`^${newExercise.name}`, 'i');
      setFilteredExercises(popularExercises.filter(exercise => regex.test(exercise)));
    }
  }, [newExercise.name]);

  const addWorkout = async () => {
    if (newExercise.name.trim() === '' || newExercise.reps.trim() === '' || newExercise.weight.trim() === '') {
      alert('Please enter exercise name, reps, and weight');
      return;
    }

    const newExerciseEntry = { 
      name: newExercise.name, 
      reps: parseInt(newExercise.reps), 
      weight: parseFloat(newExercise.weight)
    };

    const dateString = selectedDate.toISOString().split('T')[0];
    const updatedWorkout = { 
      ...workout,
      [dateString]: {
        split: newExercise.split,
        exercises: [
          ...(workout[dateString]?.exercises || []),
          newExerciseEntry
        ]
      }
    };

    setWorkout(updatedWorkout);
    setNewExercise({
      name: '',
      reps: '',
      weight: '',
      split: 'Push'
    });
    setModalVisible(false);

    try {
      await AsyncStorage.setItem('workout', JSON.stringify(updatedWorkout));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const dateString = selectedDate.toISOString().split('T')[0];

  return (
    <View style={styles.container}>
      <CalendarPicker
        onDateChange={handleDateChange}
        selectedDate={selectedDate}
        style={styles.calendar}
      />
      <Text style={styles.dateText}>Selected Date: {dateString}</Text>
      <Button title="Add Workout" onPress={() => setModalVisible(true)} />
      <FlatList
        data={Object.keys(workout)}
        renderItem={({ item: itemDateString }) => (
          itemDateString === dateString && workout[itemDateString] ? (
            <View style={styles.workoutContainer}>
              <Text style={styles.dateText}>Date: {itemDateString}</Text>
              <Text style={styles.splitText}>Split: {workout[itemDateString].split}</Text>
              {(workout[itemDateString].exercises || []).map((exercise, index) => (
                <View key={index} style={styles.exerciseContainer}>
                  <Text style={styles.exerciseText}>
                    {exercise.name} - {exercise.reps} reps - {exercise.weight} kg
                  </Text>
                </View>
              ))}
            </View>
          ) : null
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
          <TextInput
            style={styles.input}
            placeholder="Exercise Name"
            value={newExercise.name}
            onChangeText={(text) => setNewExercise(prev => ({ ...prev, name: text }))}
          />
          {filteredExercises.length > 0 && (
            <View style={styles.autocompleteContainer}>
              <ScrollView>
                {filteredExercises.map((item, index) => (
                  <TouchableOpacity key={index} onPress={() => setNewExercise(prev => ({ ...prev, name: item }))}>
                    <Text style={styles.autocompleteItem}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          <TextInput
            style={styles.input}
            placeholder="Reps"
            value={newExercise.reps}
            onChangeText={(text) => setNewExercise(prev => ({ ...prev, reps: text }))}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            value={newExercise.weight}
            onChangeText={(text) => setNewExercise(prev => ({ ...prev, weight: text }))}
            keyboardType="numeric"
          />
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Split:</Text>
            <Picker
              selectedValue={newExercise.split}
              style={styles.picker}
              onValueChange={(itemValue) => setNewExercise(prev => ({ ...prev, split: itemValue }))}
            >
              <Picker.Item label="Push" value="Push" />
              <Picker.Item label="Pull" value="Pull" />
              <Picker.Item label="Legs" value="Legs" />
            </Picker>
          </View>
          <Button title="Add Exercise" onPress={addWorkout} />
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
  calendar: {
    width: '100%',
    marginBottom: 20,
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
  input: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
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
  autocompleteContainer: {
    width: '80%',
    maxHeight: 150,
    marginBottom: 10,
  },
  autocompleteItem: {
    padding: 10,
    fontSize: 16,
  },
});

export default WorkoutScreen;
