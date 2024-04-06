import React from 'react';
import { View, Text, StyleSheet, Image, Button, Linking } from 'react-native';
import WebView from 'react-native-webview';

const SetupScreen = () => {
  // Function to handle WiFi settings redirection (this might not work on iOS due to platform restrictions)
  const changeWifiSettings = () => {
    // Note: Directing to WiFi settings is not always allowed, especially on iOS
    Linking.openURL('App-Prefs:root=WIFI');
  };

  // Function to refresh the embedded page
  const refreshEmbeddedPage = () => {
    // Logic to refresh the embedded web page goes here
  };

  //const iosWifiSettingsImage = require('./path-to-ios-screenshot.png');
  //const androidWifiSettingsImage = require('./path-to-android-screenshot.png');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Setup Guide</Text>
      
      {/* Step 1 */}
      <Text style={styles.instructions}>
        1. Position the gateway in the room where you intend to utilize the AlertWet clips. After plugging it in, wait for the illumination of both the blue and green lights.
      </Text>

      {/* Step 2 */}
      <Text style={styles.instructions}>
        2. Change your WiFi to "BLE WIFI".
      </Text>
      {/* <Image
        source={Platform.OS === 'ios' ? iosWifiSettingsImage : androidWifiSettingsImage}
        style={styles.screenshot}
        resizeMode="contain"
      /> */}

      {/* Step 3 */}
      <Text style={styles.instructions}>
        3. Refresh the page below to access gateway setup.
      </Text>
      <WebView 
        source={{ uri: 'http://192.168.10.1' }}
        style={styles.webview}
      />

      <Button title="Refresh Page" onPress={refreshEmbeddedPage} />

      {/* Step 4 */}
      <Text style={styles.instructions}>
        4. Connect the gateway to your home WiFi, and click reboot.
      </Text>
      {/* <Image source={require('./path-to-another-screenshot.jpg')} style={styles.image} /> */}

      {/* Step 5 */}
      <Text style={styles.instructions}>
        5. Reconnect your phone to your home WiFi after setup.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200, // Adjust as needed
    resizeMode: 'contain',
    marginBottom: 18,
  },
  webview: {
    height: 250, // Adjust as needed
    marginBottom: 18,
  },
});

export default SetupScreen;
