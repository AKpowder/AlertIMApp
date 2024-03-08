// Add any necessary imports for icons or images
import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useNavigation } from '@react-navigation/native';
import ProfileIcon from '../assets/Profile_Picture.png'

const CurrentAppUser = () => {
  const [username, setUsername] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const userInfo = await fetchUserAttributes();
        setUsername(userInfo.name); // Adjust according to your attribute keys
      } catch (error) {
        console.log('Error getting user info:', error);
      }
    }
    getCurrentUser();
  }, []);

  return (
    <TouchableOpacity style={styles.userButton} onPress={() => navigation.navigate('ProfileScreen')}>
      <Image
        source={ProfileIcon} // Replace with user's actual image or a default icon
        style={styles.avatar}
        resizeMode="contain"
      />
      <Text style={styles.username}>{username}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.8)', // Semi-transparent white background
    borderRadius: 20,
    padding: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15, // Makes it circular
    marginRight: 8,
  },
  username: {
    color: '#333', // Dark text color for contrast
    fontWeight: 'bold',
  },
});

export default CurrentAppUser;
