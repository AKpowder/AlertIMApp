// ReconnectWifiScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button, Platform, Linking } from 'react-native';

const ReconnectWifiScreen = () => {
  const openWifiSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openURL('android.settings.WIFI_SETTINGS');
    } else {
      // For iOS, direct linking to WiFi settings is not supported; provide instructions instead.
      alert('Please open Settings > Wi-Fi to reconnect to your preferred network.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>
        Configuration is complete. Please reconnect to your preferred WiFi network.
      </Text>
      <Button title="Open WiFi Settings" onPress={openWifiSettings} />
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
  instructions: {
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ReconnectWifiScreen;