import React, { createContext, useContext, useState } from 'react';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState({});

  const addWorkout = (date, workout) => {
    setWorkouts(prevWorkouts => ({
      ...prevWorkouts,
      [date]: [...(prevWorkouts[date] || []), workout]
    }));
  };

  const updateWorkout = (date, updatedWorkout) => {
    setWorkouts(prevWorkouts => ({
      ...prevWorkouts,
      [date]: prevWorkouts[date].map(workout =>
        workout.date === updatedWorkout.date ? updatedWorkout : workout
      )
    }));
  };

  return (
    <WorkoutContext.Provider value={{ workouts, addWorkout, updateWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkouts = () => useContext(WorkoutContext);
