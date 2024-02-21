import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

const NotificationTestScreen = () => {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  }, []);

  async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token for push notification!');
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  
    // Send the token to your server.
    fetch('https://your-server.com/api/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        // userId: 'user123',
      }),
    })
    .then(response => response.json())
    .then(data => console.log('Token registered with server:', data))
    .catch((error) => {
      console.error('Error registering token with server:', error);
    });
  
    return token;
  }
  

  // Dummy function to illustrate where you'd trigger a notification.
  // This would need to be connected to a backend or use a tool like Expo's notification tool.
  const sendTestNotification = () => {
    Alert.alert(
      'Trigger Notification',
      'Placeholder Use server or Expo\'s Push Notification Tool to send a test notification.',
    );
  };

  return (
    <View style={styles.container}>
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
