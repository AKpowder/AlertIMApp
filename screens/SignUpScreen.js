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
  const [inputErrors, setInputErrors] = useState({
    username: false,
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    verifyPassword: false,
  });

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

    const token = (await Notifications.getExpoPushTokenAsync({"projectId": "12e14139-6d43-4572-b4f1-fcab1ee23e81"})).data;
    console.log("Expo Push Token:", token);
    return token;
  };

  async function handleSignUp() {

    
    let newInputErrors = {
      username: false,
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      verifyPassword: false,
    };
  
    // Set errors to true if fields are empty (or for mismatched passwords)
    newInputErrors.username = !username.trim();
    newInputErrors.firstName = !firstName.trim();
    newInputErrors.lastName = !lastName.trim();
    newInputErrors.email = !email.trim();
    newInputErrors.password = !password.trim();
    newInputErrors.verifyPassword = password !== verifyPassword;
  
    // Update the input errors state
    setInputErrors(newInputErrors);
  
    // Check if there are any errors
    const hasErrors = Object.values(newInputErrors).some(error => error);
  
    // If there are errors, do not proceed with sign-up
    if (hasErrors) {
      Alert.alert('Validation', 'Please fill in all required fields correctly.');
      return;
    }
  
    // If passwords do not match, set the passwordsMatch state to false and return early
    if (newInputErrors.verifyPassword) {
      setPasswordsMatch(false);
      Alert.alert('Password Mismatch', 'The passwords do not match. Please try again.');
      return;
    }
  
    // Proceed with sign-up since there are no errors
    setPasswordsMatch(true);
    try {
      const notificationToken = await requestNotificationPermission();
      const clipNumbersString = clipNumbers.join(',');
      const fullName = `${firstName} ${lastName}`; // Combine first and last names
      const sanitizedPhoneNumber = phoneNumber.replace(/\D/g, '');
      const defaultAddress = address.trim() === '' ? "Address" : address;
      const { user } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            'custom:firstName': firstName,
            'custom:lastName': lastName,
            'custom:clipNumber': clipNumbersString,
            'custom:phoneNumber': sanitizedPhoneNumber,
            'custom:userTimezone': timezone,
            email,
            'name': fullName,
            'address': defaultAddress,
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
          <Text style={styles.requiredNote}>* Required field</Text>
          <Text style={styles.inputHeader}>Username *</Text>
          <TextInput
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setInputErrors(prevErrors => ({ ...prevErrors, username: false }));
            }}
            placeholder="Username *"
            autoCapitalize="none"
            style={[styles.input, inputErrors.username && styles.errorInput]}
          />

          <Text style={styles.inputHeader}>First Name *</Text>
          <TextInput
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setInputErrors(prevErrors => ({ ...prevErrors, firstName: false }));
            }}
            placeholder="First Name *"
            style={[styles.input, inputErrors.firstName && styles.errorInput]}
          />

          <Text style={styles.inputHeader}>Last Name *</Text>
          <TextInput 
            value={lastName} 
            onChangeText={(text) => {
              setLastName(text);
              setInputErrors(prevErrors => ({ ...prevErrors, lastName: false }));
            }} 
            placeholder="Last Name *" 
            style={[styles.input, inputErrors.lastName && styles.errorInput]} 
          />

          <Text style={styles.inputHeader}>Email *</Text>
          <TextInput 
            value={email} 
            onChangeText={(text) => {
              setEmail(text);
              setInputErrors(prevErrors => ({ ...prevErrors, email: false }));
            }} 
            placeholder="Email *" 
            autoCapitalize="none"
            keyboardType="email-address" 
            style={[styles.input, inputErrors.email && styles.errorInput]}
          />
          <Text style={styles.inputHeader}>Password Requirements:</Text>
            <Text style={styles.inputBullet}>• Minimum of 7 characters</Text>
            <Text style={styles.inputBullet}>• At least one capital letter</Text>
            <Text style={styles.inputBullet}>• At least one number</Text>
            <Text style={styles.inputBullet}>• At least one special character</Text>
          <Text style={styles.inputHeader}>Password *</Text>
          <TextInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setInputErrors(prevErrors => ({ ...prevErrors, password: false }));
            }}
            placeholder="Password *"
            secureTextEntry={!passwordVisible}
            style={[styles.input, inputErrors.password && styles.errorInput]}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.showButton}>
            <Text style={styles.showButtonText}>{passwordVisible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>

          <Text style={styles.inputHeader}>Verify Password *</Text>
          <TextInput
            value={verifyPassword}
            onChangeText={(text) => {
              setVerifyPassword(text);
              setInputErrors(prevErrors => ({ ...prevErrors, verifyPassword: false }));
            }}
            placeholder="Verify Password"
            secureTextEntry={!verifyPasswordVisible}
            style={[styles.input, inputErrors.verifyPassword && styles.errorInput]}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setVerifyPasswordVisible(!verifyPasswordVisible)} style={styles.showButton}>
            <Text style={styles.showButtonText}>{verifyPasswordVisible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>

          <Text style={styles.inputHeader}>Phone Number</Text>
          <TextInput value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Phone Number" keyboardType="phone-pad" style={styles.input} />

          <Text style={styles.inputHeader}>Address</Text>
          <TextInput value={address} onChangeText={setAddress} placeholder="Address" style={styles.input} />
          {/* <TextInput value={timezone} placeholder="Timezone" style={styles.input} /> */}
          <Text style={styles.inputHeader}>Clip Number(s)</Text>
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
  inputHeader: {
    alignSelf: 'flex-start', // Align to the start of the container
    marginVertical: 5,
    fontSize: 13,
  },
  inputBullet: {
    alignSelf: 'flex-start', // Align to the start of the container
    marginVertical: 2, // Slightly less vertical margin than the header
    fontSize: 13, // Same font size for consistency
    marginLeft: 10, // Indent bullets to distinguish them from the header
  },
  requiredNote: {
    alignSelf: 'flex-start', // Align to the start of the form
    marginVertical: 8, // Adjust the vertical margin as needed
    fontSize: 12, // Adjust the font size as needed
    color: '#666', // Adjust the color as needed (for example, a less prominent color)
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
  errorInput: {
    borderColor: 'red', // Use a color that indicates an error
    borderWidth: 1, // You can adjust the borderWidth if necessary
  },
});

export default SignUpScreen;
