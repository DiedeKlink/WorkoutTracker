import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, Modal, TouchableOpacity } from 'react-native';
import popularExercises from '../data/popularExercises';
import { useWorkouts } from '../context/WorkoutContext';

const WorkoutEditScreen = ({ route, navigation }) => {
  const { date, workout } = route.params || {};
  const [exercises, setExercises] = useState(workout.exercises || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);
  const { updateWorkout } = useWorkouts();

  const addExercise = () => {
    if (!exerciseName || !reps || !weight) {
      alert('Please fill in all fields.');
      return;
    }

    const newExercise = {
      name: exerciseName,
      reps: parseInt(reps, 10),
      weight: parseFloat(weight),
    };

    setExercises(prevExercises => [...prevExercises, newExercise]);

    setExerciseName('');
    setReps('');
    setWeight('');
    setFilteredExercises([]);
    setModalVisible(false);
  };

  const handleExerciseNameChange = (text) => {
    setExerciseName(text);
    if (text) {
      setFilteredExercises(
        popularExercises.filter(exercise =>
          exercise.toLowerCase().includes(text.toLowerCase())
        )
      );
    } else {
      setFilteredExercises([]);
    }
  };

  const selectExercise = (exercise) => {
    setExerciseName(exercise);
    setFilteredExercises([]);
  };

  const renderExercise = ({ item, index }) => (
    <View key={index} style={styles.exerciseContainer}>
      <Text style={styles.exerciseText}>{item.name} - {item.reps} reps - {item.weight} kg</Text>
    </View>
  );

  useEffect(() => {
    if (updateWorkout) {
      const updatedWorkout = { ...workout, exercises };
      updateWorkout(date, updatedWorkout);
    }
  }, [exercises]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout for {date}</Text>
      <Text style={styles.splitText}>Split: {workout.split}</Text>
      <FlatList
        data={exercises}
        renderItem={renderExercise}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />
      <Button title="Add Exercise" onPress={() => setModalVisible(true)} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add Exercise</Text>
            <TextInput
              placeholder="Exercise Name"
              value={exerciseName}
              onChangeText={handleExerciseNameChange}
              style={styles.input}
            />
            {filteredExercises.length > 0 && (
              <View style={styles.dropdown}>
                {filteredExercises.map((exercise, index) => (
                  <TouchableOpacity key={index} onPress={() => selectExercise(exercise)}>
                    <Text style={styles.dropdownItem}>{exercise}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TextInput
              placeholder="Reps"
              value={reps}
              onChangeText={setReps}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Weight (kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.buttonContainer}>
              <Button title="Add" onPress={addExercise} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF6347" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F8FF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  splitText: {
    fontSize: 18,
    marginBottom: 10,
  },
  list: {
    marginTop: 20,
  },
  exerciseContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  exerciseText: {
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  dropdown: {
    width: '100%',
    maxHeight: 150,
    backgroundColor: '#FFFFFF',
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    zIndex: 1,
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
});

export default WorkoutEditScreen;
