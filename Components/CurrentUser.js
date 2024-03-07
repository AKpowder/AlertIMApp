import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useNavigation } from '@react-navigation/native';

const CurrentAppUser = () => {
  const [username, setUsername] = useState('');
  const navigation = useNavigation(); // Hook for navigation

  useEffect(() => {
    async function getCurrentUser() {
      try {
        // Assuming userInfo.name exists. Please adjust according to your user data structure
        const userInfo = await fetchUserAttributes();
        setUsername(userInfo.name);
      } catch (error) {
        console.log('error getting user info:', error);
      }
    }
    getCurrentUser();
  }, []);

  // Function to navigate to ProfileScreen
  const goToProfile = () => {
    navigation.navigate('ProfileScreen'); // Adjust 'ProfileScreen' as needed
  };

  return (
    <TouchableOpacity style={styles.userButton} onPress={goToProfile}>
      <Text style={styles.userText}>Logged in as: {username}</Text>
    </TouchableOpacity>
  );
};

// Styles for positioning and appearance
const styles = StyleSheet.create({
  userButton: {
    position: 'absolute', // Absolute positioning to place it on top of other content
    top: 10, // Adjust top and right as needed for your layout
    right: 10,
    backgroundColor: 'transparent', // Or any other background color
    padding: 10, // Adjust padding as needed
  },
  userText: {
    color: 'blue', // Adjust text color and other properties as needed
  },
});

export default CurrentAppUser;
