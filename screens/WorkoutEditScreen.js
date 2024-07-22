import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, Modal } from 'react-native';

const WorkoutEditScreen = ({ route, navigation }) => {
  const { date, split } = route.params;
  const [workout, setWorkout] = useState({ split, exercises: [] });
  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

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

    setWorkout(prevWorkout => ({
      ...prevWorkout,
      exercises: [...prevWorkout.exercises, newExercise],
    }));

    setExerciseName('');
    setReps('');
    setWeight('');
    setModalVisible(false);
  };

  const renderExercise = ({ item, index }) => (
    <View key={index} style={styles.exerciseContainer}>
      <Text style={styles.exerciseText}>{item.name} - {item.reps} reps - {item.weight} kg</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout for {date}</Text>
      <Text style={styles.splitText}>Split: {split}</Text>
      <FlatList
        data={workout.exercises}
        renderItem={renderExercise}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button title="Add Exercise" onPress={() => setModalVisible(true)} style={styles.button} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add New Exercise</Text>
            <TextInput
              style={styles.input}
              placeholder="Exercise Name"
              value={exerciseName}
              onChangeText={setExerciseName}
            />
            <TextInput
              style={styles.input}
              placeholder="Reps"
              keyboardType="numeric"
              value={reps}
              onChangeText={setReps}
            />
            <TextInput
              style={styles.input}
              placeholder="Weight (kg)"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <View style={styles.buttonContainer}>
              <Button title="Add Exercise" onPress={addExercise} />
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
    marginBottom: 10,
  },
  splitText: {
    fontSize: 18,
    marginBottom: 10,
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
    height: 45,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#F8F8F8',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
});

export default WorkoutEditScreen;
