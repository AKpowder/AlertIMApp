import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}> {/* Wrap all fields in a View */}
          <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} style={styles.input} />
          <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} style={styles.input} />
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
          <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={styles.input} />
          <TextInput placeholder="Cellphone" value={cellphone} onChangeText={setCellphone} style={styles.input} keyboardType="phone-pad" />
          <View style={styles.input}>
            <Picker selectedValue={selectedItem} onValueChange={setSelectedItem} style={{width: '100%', height: 50}}>
              <Picker.Item label="Enterprise" value="Enterprise" />
              <Picker.Item label="Home Care" value="HomeCare" />
              <Picker.Item label="Dev" value="Dev" />
            </Picker>
          </View>
          <Button title="Sign Up" onPress={() => {/* Handle sign up logic here */}} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: { // Style for the new View
    width: '100%', // Ensure it fills the container for proper alignment
  },
  input: {
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  picker: {
    width: '100%',
    marginBottom: 15,
  },
});
