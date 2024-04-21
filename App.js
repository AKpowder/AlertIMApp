import 'react-native-get-random-values';
import React, { useEffect, useRef } from 'react'; // Updated to include useEffect
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications'; // Import Notifications

import LandingScreen from './screens/LandingScreen';
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import NotificationTestScreen from './screens/NotificationTestScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChangeEmailScreen from './screens/ChangeEmailScreen';
import StatusScreen from './screens/StatusScreen';
import SetupScreen from './screens/SetupScreen';
import DeleteAccountScreen from './screens/DeleteAccountScreen.js';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen.js';

import { Amplify } from 'aws-amplify';
import awsmobile from './src/aws-exports.js';
import { Alert } from 'react-native';

Amplify.configure(awsmobile);

const Stack = createStackNavigator();

function App() {

  const navigationRef = useRef(); // Create the ref for the navigation container


  useEffect(() => {
    // Listener for notifications received while the app is in the foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      // Here you could handle the notification (e.g., update state or display a modal)
    });

    // Listener for responses to notifications received (i.e., the user interacts with the notification)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(async response => {
      console.log('Notification clicked:', response);
    
      try {
        // Check if the user is authenticated
        const currentUser = await Auth.currentAuthenticatedUser();
        console.log('Current user:', currentUser);
    
        // If authenticated, navigate to the desired screen
        navigationRef.current?.navigate('StatusScreen');
      } catch (error) {
        console.error('User is not authenticated:', error);
        // Optionally navigate to the SignIn screen or show an alert
        navigationRef.current?.navigate('SignInScreen');
        Alert.alert("Please Log in before viewing the status screen.");
        // Or show an alert
        // Alert.alert("Please log in to view this screen");
      }
    });

    return () => {
      // Clean up listeners
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen name="LandingScreen" component={LandingScreen} options={{ title: 'AlertWet', headerTitleAlign: 'center' }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'AlertWet', headerTitleAlign: 'center' }} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ title: 'Sign Up' }} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ title: 'Sign In' }} />
        <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} options={{ title: 'Confirm Sign Up' }} />
        <Stack.Screen name="NotificationTest" component={NotificationTestScreen} options={{ title: 'Test Notifications' }} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="ChangeEmailScreen" component={ChangeEmailScreen} options={{ title: 'Change Email' }} />
        <Stack.Screen name="StatusScreen" component={StatusScreen} options={{ title: 'AlertPad Status' }} />
        <Stack.Screen name="SetupScreen" component={SetupScreen} options={{ title: 'Setup Gateway' }} />
        <Stack.Screen name="DeleteAccountScreen" component={DeleteAccountScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ title: 'Forgot Password' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
