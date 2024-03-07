import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { confirmUserAttribute, sendUserAttributeVerificationCode, updateUserAttributes, fetchUserAttributes, handleUpdateUserAttributeNextSteps } from 'aws-amplify/auth';


const ChangeEmailScreen = ({ navigation }) => {
    const [newEmail, setNewEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    const handleChangeEmail = async () => {
        try {
            // Get the current authenticated user object
            const user = await fetchUserAttributes();
    
            // Update the user's email attribute
                await updateUserAttributes({
                  userAttributes: {
                    email: newEmail
                  },
                });
    
            // Request a verification code for the new email
            // Assuming sendUserAttributeVerificationCode does not require an object based on your provided info
            await sendUserAttributeVerificationCode('email');
    
            Alert.alert("Verification Code Sent", "Please check your new email for the verification code.");
        } catch (error) {
            console.error('Error updating email and sending verification code:', error);
            Alert.alert("Failed to update email and send verification code", error.message || JSON.stringify(error));
        }
    };
    

    const handleVerifyNewEmail = async () => {
        try {
            // Confirm the new email with the provided verification code
            // The API might vary; ensure you're using it as per v6 documentation
            await verifyCurrentUserAttributeSubmit('email', verificationCode);
    
            Alert.alert("Email Verified", "Your email has been updated successfully.");
            // Optionally, navigate back or refresh user data
        } catch (error) {
            console.error('Error verifying new email:', error);
            Alert.alert("Verification Failed", error.message || JSON.stringify(error));
        }
    };
    

    return (
        <View style={styles.container}>
            <TextInput
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="New Email"
                keyboardType="email-address"
                style={styles.input}
            />
            <Button title="Send Verification Code" onPress={handleChangeEmail} />
            <TextInput
                value={verificationCode}
                onChangeText={setVerificationCode}
                placeholder="Verification Code"
                keyboardType="number-pad"
                style={styles.input}
            />
            <Button title="Verify Email" onPress={handleVerifyNewEmail} />
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
});

export default ChangeEmailScreen;
