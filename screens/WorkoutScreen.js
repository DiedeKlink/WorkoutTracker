// WorkoutScreen.js
import React, { useState } from 'react';
import { View, Text, Button, FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { useWorkouts } from '../context/WorkoutContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

const WorkoutScreen = ({ route, navigation }) => {
  const { date } = route.params || {};
  const initialDate = date || new Date().toISOString().split('T')[0];
  const [modalVisible, setModalVisible] = useState(false);
  const [split, setSplit] = useState('');
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const { workouts, addWorkout, removeWorkout } = useWorkouts();

  const addNewWorkout = () => {
    if (!split) {
      alert('Please select a split option.');
      return;
    }

    const newWorkout = {
      date: selectedDate,
      split: split,
      exercises: [],
    };

    addWorkout(selectedDate, newWorkout);

    setModalVisible(false);
    navigation.navigate('Edit workout', { date: selectedDate, workout: newWorkout });
  };

  const handleRemoveWorkout = (workoutId) => {
    removeWorkout(selectedDate, workoutId);
  };

  const renderWorkout = ({ item }) => (
    <View style={styles.workoutContainer} >
      <Text style={styles.workoutText}>Split: {item.split}</Text>
      <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", width: "50%"}}>
      <Button style={{marginRight: "10px", position: 'relative'}}
        title="Edit"
        onPress={() => navigation.navigate('Edit workout', { date: selectedDate, workout: item })}
      />
      <Button 
        title="Remove"
        onPress={() => handleRemoveWorkout(item.id)}
        color="#FF6347"
      />
      </View>
    </View>
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <FontAwesomeIcon icon={faCog} size={24} style={styles.cogIcon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <Button title="Add Workout" onPress={() => setModalVisible(true)} />

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
              <Button title="Create Workout" onPress={addNewWorkout} />
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
    flex: 1,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  workoutText: {
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  cogIcon: {
    marginRight: 15,
  },
});

export default WorkoutScreen;
