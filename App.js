import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { WorkoutProvider } from './context/WorkoutContext'; // Zorg ervoor dat dit pad correct is
import WorkoutScreen from './screens/WorkoutScreen';
import WorkoutEditScreen from './screens/WorkoutEditScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <WorkoutProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="WorkoutScreen" component={WorkoutScreen} />
          <Stack.Screen name="WorkoutEditScreen" component={WorkoutEditScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </WorkoutProvider>
  );
};

export default App;
