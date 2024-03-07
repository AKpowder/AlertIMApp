import 'react-native-get-random-values';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import LandingScreen from './screens/LandingScreen';
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import GateWayConfig from './screens/GateWayConfig';
import ConfirmationScreen from './screens/ConfirmationScreen';
import NotificationTestScreen from './screens/NotificationTestScreen'; // Import NotificationTestScreen
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen'
import ChangeEmailScreen from './screens/ChangeEmailScreen'

import { Amplify } from 'aws-amplify';
import awsExports from './src/aws-exports';

Amplify.configure(awsExports);

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="LandingScreen" 
          component={LandingScreen} 
          options={{
            title: 'AlertWet',
            headerTitleAlign: 'center',
          }} 
        />
        <Stack.Screen 
          name="HomeScreen" 
          component={HomeScreen}
          options={{
            title: 'AlertWet',
            headerTitleAlign: 'center',
          }} 
        />
        <Stack.Screen 
          name="SignUpScreen" 
          component={SignUpScreen} 
          options={{ title: 'Sign Up' }}
        />
        <Stack.Screen 
          name="SignInScreen" 
          component={SignInScreen} 
          options={{ title: 'Sign In' }}
        />
        <Stack.Screen 
          name="GateWayConfig"
          component={GateWayConfig} 
          options={{ title: 'Setup Gateway' }}
        />
        <Stack.Screen 
          name="ConfirmationScreen" 
          component={ConfirmationScreen} 
          options={{ title: 'Confirm Sign Up' }}
        />
        <Stack.Screen 
          name="NotificationTest" // Define the route name
          component={NotificationTestScreen} 
          options={{ title: 'Test Notifications' }} // Set the options such as the title
        />
        <Stack.Screen 
          name="ProfileScreen" // Define the route name
          component={ProfileScreen} 
          options={{ title: 'Profile' }} // Set the options such as the title
        />
        <Stack.Screen 
          name="ChangeEmailScreen" // Define the route name
          component={ChangeEmailScreen} 
          options={{ title: 'Change Email' }} // Set the options such as the title
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
