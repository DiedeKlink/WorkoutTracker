import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';

const WorkoutScreen = ({ route, navigation }) => {
  // Verkrijg de datum uit route params met een standaardwaarde als deze niet beschikbaar is
  const { date } = route.params || {};
  const [workouts, setWorkouts] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [split, setSplit] = useState('');
  const [selectedDate, setSelectedDate] = useState(date || new Date().toISOString().split('T')[0]); // Standaard naar vandaag

  // Update de geselecteerde datum indien de route-params veranderen
  useEffect(() => {
    if (date) {
      setSelectedDate(date);
    }
  }, [date]);

  const addWorkout = () => {
    if (!split) {
      alert('Please select a split option.');
      return;
    }

    const newWorkout = {
      date: selectedDate,
      split: split,
    };

    setWorkouts(prevWorkouts => ({
      ...prevWorkouts,
      [selectedDate]: [...(prevWorkouts[selectedDate] || []), newWorkout],
    }));

    setModalVisible(false);
    navigation.navigate('WorkoutEdit', { date: selectedDate, split: split, workout: newWorkout });
  };

  const removeWorkout = (workoutToRemove) => {
    setWorkouts(prevWorkouts => {
      const updatedWorkouts = (prevWorkouts[selectedDate] || []).filter(workout => workout !== workoutToRemove);
      return {
        ...prevWorkouts,
        [selectedDate]: updatedWorkouts,
      };
    });
  };

  const renderWorkout = ({ item }) => (
    <View style={styles.workoutContainer}>
      <Text style={styles.workoutText}>Split: {item.split}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Edit"
          onPress={() => navigation.navigate('WorkoutEdit', { date: selectedDate, split: item.split, workout: item })}
        />
        <Button
          title="Remove"
          onPress={() => removeWorkout(item)}
          color="#FF6347"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          navigation.setParams({ date: day.dateString });
        }}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#00BFFF' }
        }}
      />
      <FlatList
        data={workouts[selectedDate] || []}
        renderItem={renderWorkout}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />
      <Button title="Add Workout" onPress={() => setModalVisible(true)} />

      {/* Modal for Adding Workout */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add New Workout</Text>
            <Text style={styles.modalLabel}>Select Split</Text>
            <Picker
              selectedValue={split}
              style={styles.picker}
              onValueChange={(itemValue) => setSplit(itemValue)}
            >
              <Picker.Item label="Select Split" value="" />
              <Picker.Item label="Push" value="Push" />
              <Picker.Item label="Pull" value="Pull" />
              <Picker.Item label="Legs" value="Legs" />
            </Picker>
            <View style={styles.buttonContainer}>
              <Button title="Create Workout" onPress={addWorkout} />
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
  list: {
    marginTop: 20,
  },
  workoutContainer: {
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
  workoutText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
  modalLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 15,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 10,
  },
});

export default WorkoutScreen;
