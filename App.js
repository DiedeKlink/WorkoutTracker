import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WorkoutScreen from './screens/WorkoutScreen';
import WorkoutEditScreen from './screens/WorkoutEditScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Calendar">
       
        <Stack.Screen name="Workout" component={WorkoutScreen} />
        <Stack.Screen name="WorkoutEdit" component={WorkoutEditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
