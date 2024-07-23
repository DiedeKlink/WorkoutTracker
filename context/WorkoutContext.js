import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom function to generate unique IDs
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState({});
  const [currentWorkout, setCurrentWorkout] = useState(null);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const storedWorkouts = await AsyncStorage.getItem('workouts');
        if (storedWorkouts) {
          setWorkouts(JSON.parse(storedWorkouts));
        }
      } catch (error) {
        console.error('Failed to load workouts', error);
      }
    };

    loadWorkouts();
  }, []);

  useEffect(() => {
    const saveWorkouts = async () => {
      try {
        await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
      } catch (error) {
        console.error('Failed to save workouts', error);
      }
    };

    saveWorkouts();
  }, [workouts]);

  const addWorkout = (date, workout) => {
    const newWorkout = { ...workout, id: generateUUID() };
    setWorkouts(prevWorkouts => ({
      ...prevWorkouts,
      [date]: [...(prevWorkouts[date] || []), newWorkout]
    }));
    setCurrentWorkout(newWorkout);
  };

  const updateWorkout = (date, workoutId, updatedWorkout) => {
    setWorkouts(prevWorkouts => ({
      ...prevWorkouts,
      [date]: prevWorkouts[date].map(workout =>
        workout.id === workoutId ? { ...updatedWorkout, id: workoutId } : workout
      )
    }));
  };

  const removeWorkout = (date, workoutId) => {
    setWorkouts(prevWorkouts => ({
      ...prevWorkouts,
      [date]: prevWorkouts[date].filter(workout => workout.id !== workoutId)
    }));
  };

  useEffect(() => {
    if (currentWorkout) {
      updateWorkout(currentWorkout.date, currentWorkout.id, currentWorkout);
    }
  }, [currentWorkout]);

  return (
    <WorkoutContext.Provider value={{ workouts, currentWorkout, addWorkout, updateWorkout, removeWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkouts = () => useContext(WorkoutContext);
