import React from 'react';
import { View, Button, StyleSheet, Linking } from 'react-native';
import LogoComponent from './LogoComponent';

export default function SignInScreen({ navigation }) {
  // Function to handle URL opening
  const handlePress = async (url) => {
    // Check if the URL can be opened
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Open the URL
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open this URL: " + url);
    }
  };

  return (
    <View style={styles.container}>
      <LogoComponent />
      <View style={styles.buttonContainer}>
        <Button
          title="Enterprise"
          onPress={() => handlePress('https://example.com')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Home Care"
          onPress={() => handlePress('https://example2.com')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Demo"
          onPress={() => handlePress('https://example3.com')}
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
