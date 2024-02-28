import React from 'react';
import { Auth } from 'aws-amplify';
import { Button } from 'react-native';

const SignOutButton = () => {
  const handleSignOut = async () => {
    try {
      await Auth.signOut({ global: true });
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return <Button title="Sign Out" onPress={handleSignOut} />;
};

export default SignOutButton;
