import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { signIn } from 'aws-amplify/auth';

const SignInScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState(route.params?.email || '');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  async function handleSignIn() { 
    try {
      const user = await signIn({username: email, password}); // Use email as the username for sign-in
      console.log('Sign-in successful:', user);
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      });
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Sign-in Error', error.message || JSON.stringify(error, null, 2));
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry={!passwordVisible}
        style={styles.input}
      />
      <TouchableOpacity
        onPress={() => setPasswordVisible(!passwordVisible)}
        style={styles.toggle}
      >
        <Text style={styles.showButtonText}>{passwordVisible ? 'Hide' : 'Show'}</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <Button title="Sign In" onPress={handleSignIn} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={() => navigation.navigate('SignUpScreen')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Forgot Password?"
          onPress={() => navigation.navigate('ForgotPasswordScreen')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  buttonContainer: {
    width: '75%',
    marginVertical: 10,
  },
  toggle: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  showButtonText: {
    color: '#007AFF', // Apply blue color
    fontSize: 12,     // Apply smaller font size
  },
});

export default SignInScreen;
