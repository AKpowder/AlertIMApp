import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { fetchUserAttributes } from 'aws-amplify/auth';
import LogoComponent from '../Components/LogoComponent';
import CurrentAppUser from '../Components/CurrentUser';

const StatusScreen = ({ navigation }) => {
  const [clipNumbers, setClipNumbers] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    fetchUserProfileAndStatus();
  }, []);

  const fetchUserProfileAndStatus = async () => {
    try {
      const userInfo = await fetchUserAttributes();
      const userClipNumbers = userInfo['custom:clipNumber'] ? userInfo['custom:clipNumber'].split(',') : [];
      setClipNumbers(userClipNumbers);
      await fetchClipStatus(userClipNumbers);
    } catch (error) {
      console.error('Error fetching user information:', error);
      Alert.alert('Error fetching user information');
    }
  };

  const fetchClipStatus = async (clipNums) => {
    try {
      const response = await fetch('https://ga9ek43t9c.execute-api.us-east-1.amazonaws.com/dev/padStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clipNumbers: clipNums }), // Change to send array
      });
      const responseBody = await response.json();
      setStatuses(responseBody); // Update to handle array of statuses
    } catch (error) {
      console.error('Error fetching clip statuses:', error);
      Alert.alert('Error fetching clip statuses');
      // Set error status for each clip number
      setStatuses(clipNums.map(() => ({ status: 'Error fetching status' })));
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <CurrentAppUser />
          <LogoComponent />
          {statuses.map((item, index) => (
            <Text key={index} style={styles.input}>
              Clip Number {item.clipNumber}: {item.status}
            </Text>
          ))}
          <Button title="Refresh Status" onPress={fetchUserProfileAndStatus} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%', 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5, 
    padding: 10,
    textAlign: 'center',
  },
});

export default StatusScreen;
