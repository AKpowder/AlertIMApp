import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import LogoComponent from '../Components/LogoComponent';
import moment from 'moment';

const StatusScreen = ({ navigation }) => {
  const [clipNumbers, setClipNumbers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [showClipMessage, setShowClipMessage] = useState(false);

  useEffect(() => {
    fetchUserProfileAndStatus();
  }, []);

  const fetchUserProfileAndStatus = async () => {
    try {
      // Get Username
      const cognitoUser = await getCurrentUser();
      const username = cognitoUser.username;

      const userInfo = await fetchUserAttributes();
      const userClipNumbers = userInfo['custom:clipNumber'] ? userInfo['custom:clipNumber'].split(',') : [];
      if (userClipNumbers.length === 0) {
        // If there are no clip numbers, show the message and do not fetch clip status
        setShowClipMessage(true);
        return;
      } else {
        // If there are clip numbers, proceed to fetch clip status and hide the message if previously shown
        setShowClipMessage(false);
        await fetchClipStatus(username, userClipNumbers);
      }
    } catch (error) {
      console.error('Error fetching user information:', error);
      Alert.alert('Error fetching user information');
    }
  };

  const fetchClipStatus = async (username, clipNums) => {
    try {  
      const numRec = 1;
      // Make a GET request with the username in the header
      const response = await fetch('https://ga9ek43t9c.execute-api.us-east-1.amazonaws.com/dev/padStatus', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User': username, // Pass the username in the request header
          'Numrec': numRec
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const responseBody = await response.json();
      
      // Initialize statuses array with empty data for each user clip number
      let newStatuses = clipNums.map(num => ({ clipNumber: num, padstatus: 'No Data', timestamp: 'N/A' }));

      // Check if responseBody.clips exists and is an array
      if (responseBody.clips && Array.isArray(responseBody.clips)) {
        responseBody.clips.forEach((clip) => {
          const index = newStatuses.findIndex(status => status.clipNumber === clip.clip);
          if (index !== -1) {
            const latestData = clip.data && clip.data.length > 0 ? clip.data[0] : { timestamp: 'N/A', padstatus: 'Unknown' };
            newStatuses[index] = {
              clipNumber: clip.clip,
              padstatus: latestData.padstatus,
              timestamp: latestData.timestamp !== 'N/A' ? moment(latestData.timestamp, "DD-MMM-YYYY HH:mm:ss").format('LLL') : 'N/A',
            };
          }
        });
      }
      
      setStatuses(newStatuses);
    
    } catch (error) {
      console.error('Error fetching clip statuses:', error);
      Alert.alert('Error fetching clip statuses', error.message);
      setStatuses([]); // Clear statuses on error
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Conn':
        return { color: 'blue' };
      case 'DisConn':
        return { color: 'grey' };
      case 'Dry':
        return { color: 'green' };
      case 'Damp':
        return { color: 'orange' };
      case 'Wet':
        return { color: 'purple' };
      case 'Soaked':
        return { color: 'red' };
      default:
        return { color: 'black' }; // Default color
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
          <LogoComponent />
          {showClipMessage && (
            <Text style={styles.noClipsText}>
              No clips linked to your account, please go to your profile and add your clip.
            </Text>
          )}
          {statuses.map((item, index) => (
            <View key={index} style={styles.statusRow}>
              <Text style={styles.statusText}>
                Clip {item.clipNumber}:
                <Text style={getStatusColor(item.padstatus)}> 
                  {` ${item.padstatus}`}
                </Text>
              </Text>
              <Text style={styles.divider}> - </Text>
              <Text style={styles.timestamp}>
                {item.timestamp}
              </Text>
            </View>
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
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'center', // Align children in the center of the container
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  statusText: {
    flex: 1, // Allow flexible space around the text
    textAlign: 'right', // Align the text to the right of the flexible space
    paddingRight: 10, // Optional: adjust space between text and divider
  },
  divider: {
    paddingHorizontal: 5, // Adjust the padding to suit your design
  },
  timestamp: {
    flex: 1, // Allow flexible space around the text
    textAlign: 'left', // Align the text to the left of the flexible space
    paddingLeft: 10, // Optional: adjust space between divider and timestamp
  },
  noClipsText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16
  },
});

export default StatusScreen;
