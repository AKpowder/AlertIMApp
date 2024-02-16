import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const GateWayConfig = () => {
  const [isLoading, setIsLoading] = useState(true);

  // JavaScript code to inject
  const injectedJavaScript = `
  document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('username').value = 'yourUsername';
    document.getElementById('password').value = 'yourPassword';
    document.getElementById('loginButton').click(); // Assuming the button has an ID of 'loginButton'
  });
  true; // To avoid warning
`;

  return (
    <SafeAreaView style={styles.flexContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Gateway Configuration</Text>
      </View>
      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.activityIndicator}
        />
      )}
      <WebView
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        source={{ uri: 'http://192.168.1.1' }}
        style={styles.webViewContainer}
        onLoad={() => setIsLoading(false)}
        onLoadStart={() => setIsLoading(true)}
        injectedJavaScript={injectedJavaScript} // Inject the JavaScript code
        onMessage={(event) => {
          alert(event.nativeEvent.data); // Show debug information
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  headerContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontSize: 20,
    textAlign: 'center',
  },
  webViewContainer: {
    flex: 1,
  },
  activityIndicator: {
    position: 'absolute', // Ensure the spinner is centered
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default GateWayConfig;
