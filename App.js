import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import GateWayConfig from './screens/GateWayConfig';
import ConfirmationScreen from './screens/ConfirmationScreen';

import { Amplify } from 'aws-amplify';
import awsExports from './src/aws-exports'

Amplify.configure(awsExports);


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            title: 'Alert Wet', // Custom title for HomeScreen
            headerTitleAlign: 'center', // Centers the title
          }} 
        />
        <Stack.Screen 
          name="SignUpScreen" 
          component={SignUpScreen} 
          options={{ title: 'Sign Up' }}  // Custom title for SignUpScreen
        />
        <Stack.Screen 
          name="SignInScreen" 
          component={SignInScreen} 
          options={{ title: 'Sign In' }}  // Custom title for SignInScreen
        />
        <Stack.Screen 
          name="GateWayConfig"
          component={GateWayConfig} 
          options={{ title: 'Setup Gateway' }}  // Custom title for gateway setup
        />
        <Stack.Screen 
          name="ConfirmationScreen" 
          component={ConfirmationScreen} 
          options={{ title: 'Confirm Sign Up' }} // Add your ConfirmationScreen to the navigator
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
