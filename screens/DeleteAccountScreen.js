import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import LogoComponent from '../Components/LogoComponent';
import { deleteUser, signOut, getCurrentUser } from 'aws-amplify/auth';

const DeleteAccountScreen = ({ navigation }) => {

  const [userName, setUserName] = useState('');

  async function handleUpdateProfile() {
    try {
        const cognitoUser = await getCurrentUser();
        setUserName(cognitoUser.username);
        const userUpdateData = {
          userName: userName, // Assuming userName is required; replace with actual handling logic
          firstName: null,
          lastName: null,
          name: null,
          email: null, // Even if not editable, still include for backend consistency
          phoneNumber: null,
          userTimezone: null,
          address: null,
          phoneToken: null,
          clipNumbers: null,
        };
        console.log('Sending user update data:', JSON.stringify(userUpdateData));

        const response = await fetch('https://ga9ek43t9c.execute-api.us-east-1.amazonaws.com/dev/updateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userUpdateData),
        });

        const responseBody = await response.json();
        console.log('Backend update result:', responseBody);

        if (response.ok) { // Check only HTTP status code for success
            Alert.alert('Profile Updated Successfully!');
        } else {
            console.error('Error updating profile in backend:', responseBody.error);
            Alert.alert('Profile Update Error', responseBody.error || 'Failed to update profile in backend.');
        }
    } catch (error) {
        console.error('Error during the update process:', error);
        Alert.alert('Profile Update Error', error.message || 'An error occurred during the update.');
    }
  }

  const handleDeleteAccount = async () => {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete your account? This action cannot be undone.",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Yes, Delete It", onPress: () => confirmDeleteAccount() }
        ]
      );
    };
  const confirmDeleteAccount = async () => {
    try {
      handleUpdateProfile();
      await deleteUser();
      // If the deletion is successful, sign the user out and redirect them to the welcome screen
      await signOut();
      navigation.navigate('LandingScreen');
      Alert.alert("Account Deleted", "Your account has been successfully deleted.");
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert("Deletion Error", "Failed to delete your account. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <LogoComponent />
      <Text style={styles.warningText}>
        Deleting your account will remove all your data from our servers. This action cannot be undone.
      </Text>
      
      {/* Mimic the "Delete Account" button from the profile screen */}
      <TouchableOpacity
        onPress={handleDeleteAccount}
        style={styles.deleteButton}
      >
        <Text style={styles.buttonText}>DELETE MY ACCOUNT</Text>
      </TouchableOpacity>
      
      {/* Mimic the "Cancel" button from the profile screen */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.cancelButton}
      >
        <Text style={styles.buttonText}>CANCEL</Text>
      </TouchableOpacity>
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
    warningText: {
        marginBottom: 20,
        textAlign: 'center',
        color: '#FF6347', // Text color emphasizing caution
        fontWeight: 'bold',
    },
    deleteButton: {
      backgroundColor: '#FF6347', // Red for delete, similar to your profile screen
      padding: 5,
      borderRadius: 10,
      width: '75%', // Match to the width of buttons on the profile screen
      marginBottom: 10, // Space between this button and the next
    },
    cancelButton: {
      backgroundColor: '#007bff', // Light background for cancel, similar to your profile screen
      padding: 5,
      borderRadius: 10,
      width: '75%', // Match to the width of buttons on the profile screen
    },
    buttonText: {
      textAlign: 'center',
      color: 'black', // Text color for buttons, adjust as necessary
      fontWeight: 'bold',
    },
    // Add any additional styles as needed
  });

export default DeleteAccountScreen;
