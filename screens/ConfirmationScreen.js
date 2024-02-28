import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Auth } from 'aws-amplify';

const ConfirmationScreen = ({ navigation, route }) => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const username = route.params.username; // Retrieve the passed username

  
  async function handleConfirmation() {
    try {
      await Auth.confirmSignUp({username, confirmationCode});
      Alert.alert('Confirmation successful!');
      navigation.navigate('SignInScreen'); // Navigate to sign-in screen upon successful confirmation
    } catch (error) {
      console.error('Error confirming sign up:', error);
      Alert.alert('Error confirming sign up', error.message);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={username}
        placeholder="Username"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        value={confirmationCode}
        onChangeText={setConfirmationCode}
        placeholder="Confirmation Code"
        keyboardType="number-pad"
        style={styles.input}
      />
      <Button title="Confirm Sign Up" onPress={handleConfirmation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});

export default ConfirmationScreen;
