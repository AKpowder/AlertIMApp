import React, { useEffect } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import LogoComponent from '../Components/LogoComponent';
import CurrentAppUser from '../Components/CurrentUser';
import SignOutButton from '../Components/SignOutButton';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen({ navigation }) {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus === 'granted' && Device.isDevice) {
      try {
        const tokenResponse = await Notifications.getExpoPushTokenAsync();
        const token = tokenResponse.data;
        
        // Here you send the token to your server
        fetch('https://ga9ek43t9c.execute-api.us-east-1.amazonaws.com/dev/register-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: token,
            userEmail: CurrentAppUser.email,
          }),
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to get push token!');
      }
    } else {
      Alert.alert('Notification Permissions', 'Failed to get push token for push notification or not on real device!');
    }
  }

  return (
    <View style={styles.container}>
      <CurrentAppUser />
      <LogoComponent />
      <View style={styles.buttonContainer}>
        <Button title="Setup Gateway" onPress={() => navigation.navigate('GateWayConfig')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="NotificationTest" onPress={() => navigation.navigate('NotificationTest')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Alert Wet Pad Status" onPress={() => navigation.navigate('StatusScreen')} />
      </View>
      <View style={styles.buttonContainer}>
        <SignOutButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '75%', // Make buttons take up 75% of the page width
    marginVertical: 10, // Add some vertical spacing between buttons
  }
});
