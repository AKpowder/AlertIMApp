import React, { useEffect } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';

import LogoComponent from '../Components/LogoComponent';
import CurrentAppUser from '../Components/CurrentUser';
import SignOutButton from '../Components/SignOutButton';


export default function HomeScreen({ navigation }) {


  return (
    <View style={styles.container}>
      <CurrentAppUser />
      <LogoComponent />
      {/* <View style={styles.buttonContainer}>
        <Button title="Setup Gateway" onPress={() => navigation.navigate('SetupScreen')} />
      </View> */}
      <View style={styles.buttonContainer}>
        <Button title="AlertPad Status" onPress={() => navigation.navigate('StatusScreen')} />
      </View>
      <View style={styles.buttonContainer}>
        <SignOutButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '75%',
    marginVertical: 10,
  },
});
