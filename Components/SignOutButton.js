import React from 'react';
import { signOut } from 'aws-amplify/auth';
import { Button } from 'react-native';

const SignOutButton = () => {
  const handleSignOut = async () => {
    try {
      await signOut({ global: true });
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return <Button title="Sign Out" onPress={handleSignOut} />;
};

export default SignOutButton;
