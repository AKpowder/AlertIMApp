import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { fetchUserAttributes, updateUserAttributes } from 'aws-amplify/auth';
import LogoComponent from '../Components/LogoComponent';

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [clipNumber, setClipNumber] = useState('');

  useEffect(() => {
    // Simulated fetching user attributes
    const fetchUserProfile = async () => {
      try {
        // In real implementation, replace with actual fetching logic
        const userInfo = await fetchUserAttributes();
        console.log(userInfo);
        setName(userInfo.name);
        setEmail(userInfo.email);
        setPhoneNumber(userInfo['custom:Phone-Number']); // Adjust according to the actual attribute key
        setAddress(userInfo.address);
        setClipNumber(userInfo['custom:Clip-Number']); // Adjust according to the actual attribute key
      } catch (error) {
        console.error('Error fetching user information:', error);
        Alert.alert('Error fetching user information');
      }
    };
    fetchUserProfile();
  }, []);

  async function handleUpdateProfile() {
    try {
      const updateResult = await updateUserAttributes({
        userAttributes: {
          email: email, // updatedEmail from the form
          name: name, // updatedName from the form
          // Add additional attributes as necessary
          'custom:Phone-Number': phoneNumber,
          'address': address,
          'custom:clipNumber': clipNumber,
        },
      });
  
      // Process the update result if necessary
      console.log('Update result:', updateResult);
  
      // You might want to handle next steps depending on the result
      // For example, informing the user about the necessity to confirm the new email
      if (updateResult === 'SUCCESS') {
        Alert.alert('Profile Updated Successfully!');
      } else {
        // Handle other statuses accordingly
      }
    } catch (error) {
      console.error('Error updating user attributes:', error);
      Alert.alert('Error updating profile', error.message || JSON.stringify(error));
    }
  }
  

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <LogoComponent />
        <TextInput value={name} onChangeText={setName} placeholder="Full Name" autoCapitalize="none" style={styles.input} />
        <TextInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" style={styles.input} />
        <TextInput value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Phone Number" keyboardType="phone-pad" style={styles.input} />
        <TextInput value={address} onChangeText={setAddress} placeholder="Address" style={styles.input} />
        <TextInput value={clipNumber} onChangeText={setClipNumber} placeholder="Clip Number" style={styles.input} />
        <Button title="Update Profile" onPress={handleUpdateProfile} />
      </View>
    </ScrollView>
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
  errorInput: {
    borderColor: 'red',
  },
});

export default ProfileScreen;
