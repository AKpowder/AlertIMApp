import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device'; // Ensure this is imported
import CurrentAppUser from '../Components/CurrentUser';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationTestScreen = () => {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        console.log(`Token set in state: ${token}`);
      } else {
        console.log('No token received after permissions granted.');
      }
    });
  }, []);

  async function registerForPushNotificationsAsync() {
    console.log('Requesting notification permissions...');
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log(`Existing permission status: ${existingStatus}`);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log(`New permission status: ${finalStatus}`);
    }
    if (finalStatus === 'granted' && Device.isDevice) {
      try {
        const tokenResponse = await Notifications.getExpoPushTokenAsync();
        const token = tokenResponse.data;
        console.log("Here is the token: " + token);

        // Send the token to your server for registration.
        fetch('https://ga9ek43t9c.execute-api.us-east-1.amazonaws.com/dev/register-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: token,
            userEmail: CurrentAppUser.email,
          }),
        })
        .then(response => response.json())
        .then(data => console.log('Token registered with server:', data))
        .catch((error) => {
          console.error('Error registering token with server:', error);
        });

        return token;
      } catch (error) {
        console.error('Error fetching push token', error);
        Alert.alert('Error', 'Failed to get push token!');
      }
    } else {
      Alert.alert('Notification Permissions', 'Failed to get push token for push notification or not on real device!');
    }
  }

  const sendTestNotification = async () => {
    console.log(`Sending notification with token: ${expoPushToken}`);
    if (!expoPushToken) {
      console.error('No Expo Push Token available to send notification.');
      Alert.alert('Token Error', 'No Expo Push Token available to send notification.');
      return;
    }
    
    // Send the notification.
    fetch('https://ga9ek43t9c.execute-api.us-east-1.amazonaws.com/dev/sendNotification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: expoPushToken,
        title: "Test Notification",
        body: "This is a test notification from your React Native app!",
      }),
    })
    .then(response => response.json())
    .then(data => console.log('Notification sent:', data))
    .catch((error) => {
      console.error('Error sending notification:', error);
      Alert.alert('Send Error', 'Error sending notification. Check console for more details.');
    });
  };

  return (
    <View style={styles.container}>
      <CurrentAppUser />
      <Text style={styles.title}>Push Notification Test</Text>
      <Text style={styles.tokenLabel}>Expo Push Token:</Text>
      <Text selectable style={styles.token}>{expoPushToken}</Text>
      <Button title="Send Test Notification" onPress={sendTestNotification} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tokenLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  token: {
    fontSize: 14,
    marginBottom: 20,
    color: 'blue',
    textAlign: 'center',
  },
});

export default NotificationTestScreen;
