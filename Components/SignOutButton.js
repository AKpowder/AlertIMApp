import React from 'react';
import { signOut } from 'aws-amplify/auth';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const SignOutButton = () => {
  const navigation = useNavigation(); // Use the useNavigation hook to get access to the navigation object

  const handleSignOut = async () => {
    try {
      await signOut({ global: true });
      console.log('Signed out successfully');
      // Reset the navigation state so there's no way to go back
      navigation.reset({
        index: 0,
        routes: [{ name: 'LandingScreen' }],
      });
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return <Button title="Sign Out" onPress={handleSignOut} />;
};

export default SignOutButton;
