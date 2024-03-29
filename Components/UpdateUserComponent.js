import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { updateUserAttributes } from 'aws-amplify/auth';

const UpdateUserComponent = ({ userData, onUpdated }) => {
    const [name, setName] = useState(userData.name || '');
    // const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(userData.phoneNumber || '');
    const [address, setAddress] = useState(userData.address || '');
    const [clipNumbers, setClipNumbers] = useState(userData.clipNumbers || ['']);
    const [phoneToken, setPhoneToken] = useState(userData.phoneToken || ['']);

    async function handleUpdateProfile() {
        try {
            const clipNumbersString = clipNumbers.join(',');
            const updateResult = await updateUserAttributes({
                userAttributes: {
                    name,
                    'custom:phoneNumber': phoneNumber,
                    address,
                    'custom:clipNumber': clipNumbersString,
                    'custom:phoneToken': phoneToken,
                },
            });
            console.log('User attributes update result:', updateResult);

            const userUpdateData = {
                name,
                email: userData.email, // Assuming email is not editable but required for backend
                phoneNumber,
                address,
                clipNumbers: clipNumbersString,
            };

            const response = await fetch('https://ga9ek43t9c.execute-api.us-east-1.amazonaws.com/dev/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userUpdateData),
            });

            const responseBody = await response.json();
            if (response.ok) {
                Alert.alert('Profile Updated Successfully!');
                onUpdated(responseBody); // Callback function after successful update
            } else {
                Alert.alert('Profile Update Error', responseBody.error || 'Failed to update profile in backend.');
            }
        } catch (error) {
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
        <View>
            <TextInput value={name} onChangeText={setName} placeholder="Full Name" autoCapitalize="none" style={styles.input} />
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
            <Button title="Update Profile" onPress={handleUpdateProfile} />
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        width: '100%',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    }
});

export default UpdateUserComponent;
