import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import LogoComponent from './LogoComponent';


export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <LogoComponent />
      <View style={styles.buttonContainer}>
        <Button
          title="Sign In"
          onPress={() => navigation.navigate('SignInScreen')} // Adjust as needed
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Sign Up"
          onPress={() => navigation.navigate('SignUpScreen')} // Adjust as needed
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Setup Gateway"
          onPress={() => navigation.navigate('GateWayConfig')} // Adjust as needed
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
    width: '75%', // Make buttons take up 75% of the page width
    marginVertical: 10, // Add some vertical spacing between buttons
  },
});
