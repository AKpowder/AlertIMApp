import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { signIn } from 'aws-amplify/auth';

const SignInScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignIn() { 
    try {
      const { isSignedIn, nextStep } = await signIn({ username: 'test1', password:'Snowskate1!'});
      console.log('Sign-in successful:', user);
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Sign-in Error', JSON.stringify(error, null, 2));
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
