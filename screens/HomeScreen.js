import React, { useEffect } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import LogoComponent from '../Components/LogoComponent';
import CurrentAppUser from '../Components/CurrentUser';
import SignOutButton from '../Components/SignOutButton';

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus === 'granted' && Device.isDevice) {
    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      // Your logic to handle the token, e.g., sending it to your server
      console.log("Expo Push Token:", token);
      // Optionally, inform the user that they will receive notifications
      return token;
    } catch (error) {
      console.error('Error during push token generation:', error);
      Alert.alert('Error', 'Failed to get push token for push notifications.');
    }
  } else {
    Alert.alert('Notification Permissions', 'Failed to get push token for push notification!');
  }
}

export default function HomeScreen({ navigation }) {
  useEffect(() => {
    registerForPushNotificationsAsync();
    // You may include other logic that needs to run once the component mounts
  }, []); // Empty dependency array means this effect runs once after initial render

  return (
    <View style={styles.container}>
      <CurrentAppUser />
      <LogoComponent />
      <View style={styles.buttonContainer}>
        <Button title="Setup Gateway" onPress={() => navigation.navigate('GateWayConfig')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="AlertPad Status" onPress={() => navigation.navigate('StatusScreen')} />
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
    width: '75%',
    marginVertical: 10,
  },
});
