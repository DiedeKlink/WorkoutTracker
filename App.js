// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { WorkoutProvider } from './context/WorkoutContext';
import WorkoutScreen from './screens/WorkoutScreen';
import WorkoutEditScreen from './screens/WorkoutEditScreen';
import SettingsScreen from './screens/SettingsScreen'; // Import SettingsScreen

const Stack = createStackNavigator();

const App = () => {
  return (
    <WorkoutProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Workouts" component={WorkoutScreen} />
          <Stack.Screen name="Edit workout" component={WorkoutEditScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </WorkoutProvider>
  );
};

export default App;
