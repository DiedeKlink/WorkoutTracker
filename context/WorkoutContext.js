import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [markedDates, setMarkedDates] = useState({});
  const [currentWorkout, setCurrentWorkout] = useState(null);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const storedWorkouts = await AsyncStorage.getItem('workouts');
        if (storedWorkouts) {
          setWorkouts(JSON.parse(storedWorkouts));
        }
        const storedMarkedDates = await AsyncStorage.getItem('markedDates');
        if (storedMarkedDates) {
          setMarkedDates(JSON.parse(storedMarkedDates));
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
        await AsyncStorage.setItem('markedDates', JSON.stringify(markedDates));
      } catch (error) {
        console.error('Failed to save workouts', error);
      }
    };

    saveWorkouts();
  }, [workouts, markedDates]);

  const addWorkout = (date, workout) => {
    const newWorkout = { ...workout, id: generateUUID() };
    setWorkouts(prevWorkouts => {
      const updatedWorkouts = {
        ...prevWorkouts,
        [date]: [...(prevWorkouts[date] || []), newWorkout],
      };
      updateMarkedDates(updatedWorkouts);
      return updatedWorkouts;
    });
    setCurrentWorkout(newWorkout);
  };

  const updateWorkout = (date, workoutId, updatedWorkout) => {
    if (!date || !workoutId || !updatedWorkout) return;

    setWorkouts(prevWorkouts => {
      const updatedWorkouts = {
        ...prevWorkouts,
        [date]: prevWorkouts[date]?.map(workout =>
          workout.id === workoutId ? { ...updatedWorkout, id: workoutId } : workout
        ) || [],
      };
      updateMarkedDates(updatedWorkouts);
      return updatedWorkouts;
    });
  };

  const removeWorkout = (date, workoutId) => {
    if (!date || !workoutId) return;

    setWorkouts(prevWorkouts => {
      const updatedWorkouts = {
        ...prevWorkouts,
        [date]: prevWorkouts[date]?.filter(workout => workout.id !== workoutId) || [],
      };

      // If there are no workouts left on the date, remove the date from the object
      if (updatedWorkouts[date].length === 0) {
        delete updatedWorkouts[date];
      }

      updateMarkedDates(updatedWorkouts);
      return updatedWorkouts;
    });
  };

  const updateMarkedDates = (workouts) => {
    const dates = {};
    for (const date in workouts) {
      if (workouts[date]?.length > 0) {
        dates[date] = { marked: true };
      }
    }
    setMarkedDates(dates);
  };

  useEffect(() => {
    if (currentWorkout) {
      updateWorkout(currentWorkout.date, currentWorkout.id, currentWorkout);
    }
  }, [currentWorkout]);

  return (
    <WorkoutContext.Provider value={{ workouts, markedDates, currentWorkout, addWorkout, updateWorkout, removeWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkouts = () => useContext(WorkoutContext);
