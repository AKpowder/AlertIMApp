import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Modal, Text, TouchableOpacity } from 'react-native';
import { signUp } from 'aws-amplify/auth';
import LogoComponent from '../Components/LogoComponent';
import moment from 'moment-timezone'; // Add this line to import moment-timezone
const timezone = moment.tz.guess(); // Get the user's timezone

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [clipNumbers, setClipNumbers] = useState(['']);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentClipNumber, setCurrentClipNumber] = useState('');

  async function handleSignUp() {
    try {
      const clipNumbersString = clipNumbers.join(',');
      const { user } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            'custom:clipNumber': clipNumbersString,
            'custom:phoneNumber': phoneNumber,
            email,
            name,
            address,
            'custom:userTimezone': timezone,
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
          <TextInput value={username} onChangeText={setUsername} placeholder="Username" autoCapitalize="none" style={styles.input} />
          <TextInput value={name} onChangeText={setName} placeholder="Full Name" autoCapitalize="none" style={styles.input} />
          <TextInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" style={styles.input} />
          <TextInput value={password} onChangeText={setPassword} placeholder="Password" autoCapitalize="none" secureTextEntry style={styles.input} />
          <TextInput value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Phone Number" keyboardType="phone-pad" style={styles.input} />
          <TextInput value={address} onChangeText={setAddress} placeholder="Address" style={styles.input} />
          <TextInput value={timezone} placeholder="Timezone" style={styles.input} />
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
  }
});

export default SignUpScreen;
