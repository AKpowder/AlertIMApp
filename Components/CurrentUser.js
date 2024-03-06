import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { fetchUserAttributes } from 'aws-amplify/auth';

const CurrentAppUser = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const userInfo = await fetchUserAttributes();
        setUsername(userInfo.name);
      } catch (error) {
        console.log('error getting user info:', error);
      }
    }
    getCurrentUser();
  }, []);

  return <Text>Logged in as: {username}</Text>;
};

export default CurrentAppUser;
