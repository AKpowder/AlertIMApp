import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { fetchUserAttributes, updateUserAttributes } from 'aws-amplify/auth';
import LogoComponent from '../Components/LogoComponent';

const ProfileScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [clipNumbers, setClipNumbers] = useState(['']);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userInfo = await fetchUserAttributes();
                setName(userInfo.name || '');
                setEmail(userInfo.email || '');
                setPhoneNumber(userInfo['custom:Phone-Number'] || '');
                setAddress(userInfo.address || '');
                const clipNumbersArray = userInfo['custom:clipNumber'] ? userInfo['custom:clipNumber'].split(',') : [''];
                setClipNumbers(clipNumbersArray);
            } catch (error) {
                console.error('Error fetching user information:', error);
                Alert.alert('Error fetching user information');
            }
        };
        fetchUserProfile();
    }, []);

    async function handleUpdateProfile() {
        try {
            const clipNumbersString = clipNumbers.join(',');
            const updateResult = await updateUserAttributes({
                userAttributes: {
                    name,
                    'custom:Phone-Number': phoneNumber,
                    address,
                    'custom:clipNumber': clipNumbersString,
                },
            });

            console.log('User attributes update result:', updateResult);

            const userUpdateData = {
                name,
                email, // Even if not editable, still include for backend consistency
                phoneNumber,
                address,
                clipNumbers: clipNumbers.join(','), // Ensure this matches your API expectation
            };
            console.log('Sending user update data:', JSON.stringify(userUpdateData));

            const response = await fetch('https://ga9ek43t9c.execute-api.us-east-1.amazonaws.com/dev/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userUpdateData),
            });

            const responseBody = await response.json();
            console.log('Backend update result:', responseBody);

            if (response.ok) { // Check only HTTP status code for success
                Alert.alert('Profile Updated Successfully!');
            } else {
                console.error('Error updating profile in backend:', responseBody.error);
                Alert.alert('Profile Update Error', responseBody.error || 'Failed to update profile in backend.');
            }
        } catch (error) {
            console.error('Error during the update process:', error);
            Alert.alert('Profile Update Error', error.message || 'An error occurred during the update.');
        }
    }

    const handleClipNumberChange = (text, index) => {
        const newClipNumbers = [...clipNumbers];
        newClipNumbers[index] = text;
        setClipNumbers(newClipNumbers);
    };

    const addClipNumber = () => {
        if (clipNumbers.length < 5) {
            setClipNumbers([...clipNumbers, '']);
        } else {
            Alert.alert('Limit reached', 'You can only add up to 5 clip numbers.');
        }
    };

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <LogoComponent />
                    <TextInput value={name} onChangeText={setName} placeholder="Full Name" autoCapitalize="none" style={styles.input} />
                    <TextInput value={email} editable={false} onChangeText={setEmail} placeholder="Email" style={[styles.input, styles.nonEditableInput]} />
                    <TextInput value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Phone Number" keyboardType="phone-pad" style={styles.input} />
                    <TextInput value={address} onChangeText={setAddress} placeholder="Address" style={styles.input} />
                    {clipNumbers.map((clipNumber, index) => (
                        <TextInput
                            key={index}
                            value={clipNumber}
                            onChangeText={(text) => handleClipNumberChange(text, index)}
                            placeholder="Clip Number"
                            keyboardType="numeric"
                            maxLength={4}
                            style={styles.input}
                        />
                    ))}
                    <Button title="Add another Clip Number" onPress={addClipNumber} />
                    <View style={styles.buttonContainer}>
                        <Button title="Update Profile" onPress={handleUpdateProfile} />
                    </View>
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
    },
    nonEditableInput: {
        backgroundColor: '#f3f3f3',
    },
    buttonContainer: {
        width: '75%',
        marginVertical: 10,
    },
});

export default ProfileScreen;
