import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, Modal, TouchableOpacity, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { format } from 'date-fns';
import popularExercises from '../data/popularExercises';
import { useWorkouts } from '../context/WorkoutContext';

const WorkoutEditScreen = ({ route, navigation }) => {
  const { date, workout } = route.params || {};
  const [exercises, setExercises] = useState(workout?.exercises || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(null);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const { updateWorkout, currentWorkout } = useWorkouts();

  const formattedDate = format(new Date(date), 'dd-MM-yyyy');

  const handleWeightChange = (text, index) => {
    const newExercises = [...exercises];
    newExercises[index] = {
      ...newExercises[index],
      weight: text
    };
    setExercises(newExercises);
    setWeight(text);
  };

  const handleRepsChange = (text, index) => {
    const newExercises = [...exercises];
    newExercises[index] = {
      ...newExercises[index],
      reps: text
    };
    setExercises(newExercises);
    setReps(text);
  };

  const addSet = (exerciseIndex) => {
    if (!reps || !weight) {
      alert('Please fill in all fields.');
      return;
    }

    const newSet = {
      weight: parseFloat(weight),
      reps: parseInt(reps, 10),
    };

    const updatedExercises = exercises.map((exercise, index) => {
      if (index === exerciseIndex) {
        return {
          ...exercise,
          sets: [...exercise.sets, newSet],
        };
      }
      return exercise;
    });

    setExercises(updatedExercises);
    setReps('');
    setWeight('');
    setCurrentExerciseIndex(null);

    const workoutId = workout?.id || currentWorkout?.id;
    if (workoutId) {
      updateWorkout(date, workoutId, { ...workout, exercises: updatedExercises });
    }
  };

  const addExercise = () => {
    if (!exerciseName) {
      alert('Please enter an exercise name.');
      return;
    }

    const newExercise = {
      name: exerciseName,
      sets: [],
    };

    const updatedExercises = [...exercises, newExercise];
    setExercises(updatedExercises);

    setExerciseName('');
    setFilteredExercises([]);
    setModalVisible(false);

    const workoutId = workout?.id || currentWorkout?.id;
    if (workoutId) {
      updateWorkout(date, workoutId, { ...workout, exercises: updatedExercises });
    }
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
    Keyboard.dismiss(); // Dismiss the keyboard
    setTimeout(() => {  // Ensure keyboard dismissal before updating state
      setExerciseName(exercise);
      setFilteredExercises([]);
      setModalVisible(false);  // Close the modal after selecting an exercise
    }, 200);
  };

  const renderExercise = ({ item, index }) => (
    <View key={index} style={styles.exerciseContainer}>
      <Text style={styles.exerciseText}>{item.name}</Text>
      {item.sets.map((set, setIndex) => (
        <Text key={setIndex} style={styles.setText}>Set {setIndex + 1}: {set.weight} kg x {set.reps} reps</Text>
      ))}
      <View style={styles.setInputContainer}>
        <TextInput
          placeholder="Weight"
          value={item.weight || ''}
          onChangeText={(text) => handleWeightChange(text, index)}
          keyboardType="numeric"
          style={styles.setInput}
        />
        <TextInput
          placeholder="Reps"
          value={item.reps || ''}
          onChangeText={(text) => handleRepsChange(text, index)}
          keyboardType="numeric"
          style={styles.setInput}
        />
        <Button title="Add Set" onPress={() => addSet(index)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout for {formattedDate}</Text>
      <Text style={styles.splitText}>Split: {workout?.split || 'Unknown'}</Text>
      <Text>workout.id: {workout?.id || 'N/A'}</Text>
      <Text>currentWorkout.id: {currentWorkout?.id || 'N/A'}</Text>

      <FlatList
        data={exercises}
        renderItem={renderExercise}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />
      <Button title="Add Exercise" onPress={() => setModalVisible(true)} />

      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='handled'
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
                  <View style={{ position: 'absolute', width: '100%', top: 105 }}>
                    <View style={styles.dropdown}>
                      <View>
                        {filteredExercises.map((exercise, index) => (
                          <TouchableOpacity key={index} onPress={() => [selectExercise(exercise), addExercise]}>
                            <Text style={styles.dropdownItem}>{exercise}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                )}
                <View style={styles.buttonContainer}>
                  <Button title="Add" onPress={addExercise} />
                  <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF6347" />
                </View>
              </View>
            </View>
          </ScrollView>
        </Modal>
      )}
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
  setText: {
    fontSize: 14,
    marginLeft: 10,
  },
  setInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  setInput: {
    width: '30%',
    height: 40,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
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
    zIndex: 2,
    marginTop: 50,  // Add this line to fix the modal position
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  dropdown: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderTopWidth: 0,
    maxHeight: 200,
    overflow: 'scroll',
    zIndex: 2,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default WorkoutEditScreen;
