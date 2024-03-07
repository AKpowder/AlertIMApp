import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet,KeyboardAvoidingView, Platform, } from 'react-native';
import { signUp } from 'aws-amplify/auth';
import LogoComponent from '../Components/LogoComponent';

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [clipNumber, setClipNumber] = useState('');

  async function handleSignUp() {
    try {
      const { user } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            'custom:Clip-Number': clipNumber,
            'custom:Phone-Number': phoneNumber,
            email, // user's email
            name: name, // Add the user's full name here
            address: address // Add the user's address here
          },
        }
      });
      console.log('Sign-up successful!', user);
      Alert.alert('Sign-up successful!');

      navigation.navigate('ConfirmationScreen', { username }); // Adjust this as needed for your navigation logic

    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Error signing up', error.message);
    }
  }
  

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} // Ensures KeyboardAvoidingView takes the whole screen
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on platform
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Adjust vertical offset for iOS
    >
      <View style={styles.container}>
        <LogoComponent />
        <TextInput value={username} onChangeText={setUsername} placeholder="Username" autoCapitalize="none" style={styles.input} />
        <TextInput value={name} onChangeText={setName} placeholder="Full Name" autoCapitalize="none" style={styles.input} />
        <TextInput value={password} onChangeText={setPassword} placeholder="Password" autoCapitalize="none" secureTextEntry style={styles.input} />
        <TextInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" style={styles.input} />
        <TextInput value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Phone Number" keyboardType="phone-pad" style={styles.input} />
        <TextInput value={address} onChangeText={setAddress} placeholder="Address" style={styles.input} />
        <TextInput value={clipNumber} onChangeText={setClipNumber} placeholder="Clip Number" style={styles.input} />
        <Button title="Sign Up" onPress={handleSignUp} />
      </View>
    </KeyboardAvoidingView>
  );
};

// Styles updated based on the old file
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
  // Add errorInput style for future validation error visuals
  errorInput: {
    borderColor: 'red', 
  },
});

export default SignUpScreen;
