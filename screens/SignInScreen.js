import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Auth } from 'aws-amplify';
import SignOutButton from '../Components/SignOutButton';

const SignInScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignIn() { 
    try {
      const user = await Auth.signIn(username, password);
      console.log('Sign-in successful:', user);
      // Use the navigation to go to the next screen
      // Pass any required parameters to the next screen, if necessary
      navigation.navigate('GateWayConfig');
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Sign-in Error', error.message || JSON.stringify(error, null, 2));
    }
  }
  


  return (
    <View style={styles.container}>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign In" onPress={handleSignIn} />
      <SignOutButton />
      
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

export default SignInScreen;
