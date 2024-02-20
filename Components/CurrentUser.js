import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { Auth } from 'aws-amplify';

const CurrentAppUser = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const userInfo = await Auth.currentAuthenticatedUser();
        setUsername(userInfo.username);
      } catch (error) {
        console.log('error getting user info:', error);
      }
    }
    getCurrentUser();
  }, []);

  return <Text>Logged in as: {username}</Text>;
};

export default CurrentAppUser;
