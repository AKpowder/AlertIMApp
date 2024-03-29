import React, { useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import LogoComponent from '../Components/LogoComponent';
import { fetchUserAttributes } from 'aws-amplify/auth';

export default function LandingScreen({ navigation }) {
  useEffect(() => {
    async function checkCurrentUser() {
      try {
        await fetchUserAttributes();
        // If the user is signed in, navigate to the HomeScreen
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        });
      } catch (error) {
        console.log('Not logged in:', error);
        // If not logged in, stay on this screen (no need to do anything)
      }
    }
    checkCurrentUser();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LogoComponent />
      <View style={styles.buttonContainer}>
        <Button
          title="Sign In"
          onPress={() => navigation.navigate('SignInScreen')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Sign Up"
          onPress={() => navigation.navigate('SignUpScreen')}
        />
      </View>
      {/* <View style={styles.buttonContainer}>
        <Button
          title="NotificationTest"
          onPress={() => navigation.navigate('NotificationTest')}
        />
      </View> */}
      <View style={styles.buttonContainer}>
        <Button
          title="HomeScreen"
          onPress={() => navigation.navigate('HomeScreen')}
        />
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
  }
});
