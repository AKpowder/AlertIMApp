import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform, Modal, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { firestore } from '../configs/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import LogoComponent from './LogoComponent';


export default function SignUpScreen({ navigation }) {
    const [userName, setUserName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [cellphone, setCellphone] = useState('');
    const [environment, setEnvironment] = useState('HomeCare');
    const [missingField, setMissingField] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
  
    const validateFields = () => {
      const fields = [
        { name: 'userName', value: userName},
        { name: 'firstName', value: firstName },
        { name: 'lastName', value: lastName },
        { name: 'email', value: email },
        { name: 'address', value: address },
        { name: 'cellphone', value: cellphone }
      ];
      const missing = fields.find(field => !field.value);
      if (missing) {
        setMissingField(missing.name);
        return false;
      }
      setMissingField('');
      return true;
    };

  const handleSignUp = async () => {
    if (!validateFields()) return;
    try {
      await addDoc(collection(firestore, 'users'), {
        userName,
        firstName,
        lastName,
        email,
        address,
        cellphone,
        environment
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
    }
};

return (
    <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showSuccessModal}
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Account created successfully!</Text>
            <Button
              title="OK"
              onPress={() => {
                setShowSuccessModal(false); // Hide modal
                navigation.navigate('Home'); // Navigate to the home screen or login page
              }}
            />
          </View>
        </Modal>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <LogoComponent />
        <TextInput placeholder="Username" value={userName} onChangeText={setUserName} style={[styles.input, missingField === 'userName' && styles.errorInput]} />
        <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} style={[styles.input, missingField === 'firstName' && styles.errorInput]} />
        <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} style={[styles.input, missingField === 'lastName' && styles.errorInput]} />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={[styles.input, missingField === 'email' && styles.errorInput]} />
        <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={[styles.input, missingField === 'address' && styles.errorInput]} />
        <TextInput placeholder="Cellphone" value={cellphone} onChangeText={setCellphone} style={[styles.input, missingField === 'cellphone' && styles.errorInput]} keyboardType="phone-pad" />
        <View style={styles.input}>
          <Picker
              selectedValue={environment}
              onValueChange={setEnvironment}
              style={{width: '100%', height: 50}}>
                  <Picker.Item label="Home Care" value="HomeCare" />
                  <Picker.Item label="Enterprise" value="Enterprise" />
                  <Picker.Item label="Demo" value="Demo" />
          </Picker>
        </View>
        <Button title="Sign Up" onPress={() => handleSignUp()} />
        </KeyboardAvoidingView>
    </>    
  );
}

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
    picker: {
      width: '100%',
      marginBottom: 15,
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
      errorText: {
        marginBottom: 15,
        textAlign: "center",
      },
      errorInput: {
        borderColor: 'red', // Highlight input fields with errors
      },
  });
  
