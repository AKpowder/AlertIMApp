import 'react-native-get-random-values';
import React, { useEffect } from 'react'; // Updated to include useEffect
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

import { Amplify } from 'aws-amplify';
import awsExports from './src/aws-exports';

Amplify.configure(awsExports);

const Stack = createStackNavigator();

function App() {
  useEffect(() => {
    // Listener for notifications received while the app is in the foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      // Here you could handle the notification (e.g., update state or display a modal)
    });

    // Listener for responses to notifications received (i.e., the user interacts with the notification)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification clicked:', response);
      // Here you could handle the notification response (e.g., navigate to a specific screen)
    });

    return () => {
      // Clean up listeners
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return (
    <NavigationContainer>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
