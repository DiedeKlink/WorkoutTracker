import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars'; 
import { useNavigation } from '@react-navigation/native';

const CalendarScreen = ({ workout = {} }) => {
  const navigation = useNavigation();

  const handleDayPress = (day) => {
    navigation.navigate('Workout', { date: day.dateString });
  };

  const workoutDates = Object.keys(workout).map(date => ({
    dateString: date,
    split: workout[date]?.split || 'N/A', // Retrieve the split option for the day
  }));

  const markedDates = workoutDates.reduce((acc, date) => {
    acc[date.dateString] = { marked: true };
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        style={styles.calendar}
      />
      <FlatList
        data={workoutDates}
        renderItem={({ item }) => (
          <View style={styles.dayContainer}>
            <Text style={styles.dayText}>Date: {item.dateString}</Text>
            <Text style={styles.splitText}>Split: {item.split}</Text>
            <Button 
              title="Add Workouts" 
              onPress={() => handleDayPress({ dateString: item.dateString })}
            />
          </View>
        )}
        keyExtractor={item => item.dateString}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  calendar: {
    marginBottom: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  dayText: {
    fontSize: 16,
    marginRight: 10,
  },
  splitText: {
    fontSize: 16,
    color: 'blue',
    marginRight: 10,
  },
});

export default CalendarScreen;
