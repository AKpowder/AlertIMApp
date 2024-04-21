import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [verifyPasswordVisible, setVerifyPasswordVisible] = useState(false);

  const handleResetPassword = async () => {
    try {
      const output = await resetPassword({ username: email });
      handleResetPasswordNextSteps(output);
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert('Error', error.message || 'Failed to reset password');
    }
  };

  const handleResetPasswordNextSteps = (output) => {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
        Alert.alert('Code Sent', `Confirmation code was sent to ${email}`);
        break;
      case 'DONE':
        Alert.alert('Success', 'Password reset successfully');
        navigation.navigate('SignInScreen');
        break;
    }
  };

  const confirmResetPasswordFinalStep = async () => {
    if (newPassword !== verifyPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword
      });
      Alert.alert('Success', 'Password has been reset successfully');
      navigation.navigate('SignInScreen');
    } catch (error) {
      console.error('Error during password confirmation:', error);
      Alert.alert('Error', error.message || 'Failed to confirm new password');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1}}>
        <View style={styles.container}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Send Reset Code"
              onPress={handleResetPassword}
            />
          </View>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Enter your reset code"
            style={styles.input}
          />
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New Password"
            secureTextEntry={!passwordVisible}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.toggle}
          >
            <Text style={styles.showButtonText}>{passwordVisible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
          <TextInput
            value={verifyPassword}
            onChangeText={setVerifyPassword}
            placeholder="Verify New Password"
            secureTextEntry={!verifyPasswordVisible}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => setVerifyPasswordVisible(!verifyPasswordVisible)}
            style={styles.toggle}
          >
            <Text style={styles.showButtonText}>{verifyPasswordVisible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <Button
              title="Confirm New Password"
              onPress={confirmResetPasswordFinalStep}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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
    marginTop: 0,
    marginBottom: 15,
    marginVertical: 10,
    width: '75%', // Ensures the button fills the container
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

export default ForgotPasswordScreen;
