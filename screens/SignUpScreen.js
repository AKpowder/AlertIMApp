import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Modal, Text, TouchableOpacity } from 'react-native';
import { signUp } from 'aws-amplify/auth';
import LogoComponent from '../Components/LogoComponent';
import moment from 'moment-timezone'; // Add this line to import moment-timezone
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const timezone = moment.tz.guess(); // Get the user's timezone

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState(''); // New state for verifying password
  const [passwordVisible, setPasswordVisible] = useState(false); // New state for password visibility
  const [verifyPasswordVisible, setVerifyPasswordVisible] = useState(false); // New state for verify password visibility
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [clipNumbers, setClipNumbers] = useState(['']);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentClipNumber, setCurrentClipNumber] = useState('');

  //Request notifications permissions
  const requestNotificationPermission = async () => {
    if (!Device.isDevice) {
      Alert.alert("Error", "Must use a physical device for Push Notifications.");
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert("Error", "Failed to get push token for push notification!");
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
    return token;
  };

  async function handleSignUp() {
    // Check if passwords match; update state accordingly
    if (password !== verifyPassword) {
      setPasswordsMatch(false); // Update state to indicate mismatch
      Alert.alert('Password Mismatch', 'The passwords do not match. Please try again.');
      return;
    } else {
      setPasswordsMatch(true); // Ensure state is reset if corrected
      try {
        const notificationToken = await requestNotificationPermission();
        const clipNumbersString = clipNumbers.join(',');
        const fullName = `${firstName} ${lastName}`; // Combine first and last names
        const sanitizedPhoneNumber = phoneNumber.replace(/\D/g, '');
        const { user } = await signUp({
          username,
          password,
          options: {
            userAttributes: {
              'custom:firstName': firstName,
              'custom:lastName': lastName,
              'custom:clipNumber': clipNumbersString,
              'custom:phoneNumber': sanitizedPhoneNumber,
              email,
              'name': fullName,
              address,
              ...(notificationToken && { 'custom:phoneToken': notificationToken }),
            },
          }
        });
        console.log('Sign-up successful!', user);
        Alert.alert('Please Verify your Email');
        navigation.navigate('ConfirmationScreen', { username, email });
      } catch (error) {
        console.error('Error signing up:', error);
        Alert.alert('Error signing up', error.message);
      }
    }
  }

  const handleClipNumberChange = (text, index) => {
    const newClipNumbers = [...clipNumbers];
    newClipNumbers[index] = text;
    setClipNumbers(newClipNumbers);
    if (text.length === 4) { // Check if 4 digits were entered
      setCurrentClipNumber(text);
      setModalVisible(true); // Show the modal for confirmation
    }
  };

  const confirmClipNumber = () => {
    setModalVisible(false); // Close the modal after confirmation
  };

  const addClipNumber = () => {
    if (clipNumbers.length < 5) {
      setClipNumbers([...clipNumbers, '']);
    } else {
      Alert.alert('Maximum of 5 clip numbers can be added.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <LogoComponent />
          <TextInput value={username} onChangeText={setUsername} placeholder="Username" autoCapitalize="none" style={styles.input} />
          <TextInput value={firstName} onChangeText={setFirstName} placeholder="First Name" autoCapitalize="none" style={styles.input} />
          <TextInput value={lastName} onChangeText={setLastName} placeholder="Last Name" autoCapitalize="none" style={styles.input} />
          <TextInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" style={styles.input} />


          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            style={styles.input}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.showButton}>
            <Text style={styles.showButtonText}>{passwordVisible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>

          <TextInput
            value={verifyPassword}
            onChangeText={setVerifyPassword}
            placeholder="Verify Password"
            secureTextEntry={!verifyPasswordVisible}
            style={styles.input}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setVerifyPasswordVisible(!verifyPasswordVisible)} style={styles.showButton}>
            <Text style={styles.showButtonText}>{verifyPasswordVisible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>


          <TextInput value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Phone Number" keyboardType="phone-pad" style={styles.input} />
          <TextInput value={address} onChangeText={setAddress} placeholder="Address" style={styles.input} />
          {/* <TextInput value={timezone} placeholder="Timezone" style={styles.input} /> */}
          {clipNumbers.map((clipNumber, index) => (
            <TextInput 
              key={index}
              value={clipNumber} 
              onChangeText={(text) => handleClipNumberChange(text, index)} 
              placeholder="Clip Number" 
              keyboardType="numeric"
              maxLength={4}
              style={styles.input} 
            />
          ))}
          <Button title="Add another Clip Number" onPress={addClipNumber} />
          <View style={styles.buttonContainer}>
            <Button title="Sign Up" onPress={handleSignUp} />
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <Text style={styles.modalText}>
                  Is <Text style={styles.boldText}>{currentClipNumber}</Text> your correct clip number?
              </Text>
                <View style={styles.modalButtonContainer}>
                  <Button
                    title="Yes, Confirm"
                    onPress={confirmClipNumber}
                  />
                  <View style={styles.spaceHorizontal} />
                  <Button
                    title="No, Edit"
                    onPress={() => setModalVisible(false)}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    // marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    width: '75%',
    marginVertical: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  spaceHorizontal: {
    width: 20, // Adjust the space between the modal buttons
  },
  //password styles
  passwordFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  showButton: {
    alignSelf: 'flex-start',
    marginBottom: 7,
    marginTop: -13,
  },
  showButtonText: {
    color: '#007AFF',
    fontSize: 11,
  },
});

export default SignUpScreen;
