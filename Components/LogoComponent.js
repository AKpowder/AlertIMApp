// LogoComponent.js
import React from 'react';
import { Image, StyleSheet } from 'react-native';

const LogoComponent = () => {
  return (
    <Image
      source={require('../assets/AlertWet-Trans.png')} // Update the path to your logo
      resizeMode="contain" // Adjusts the image to fit while maintaining aspect ratio
      style={styles.logo}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 200, // Adjust the size as needed
    width: '100%', // Adjust the width as needed
    marginBottom: 20, // Adjust the spacing as needed
  },
});

export default LogoComponent;