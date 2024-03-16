// apiServices.js
import { post } from 'aws-amplify/api';

export async function sendDataToApi(data) {
  const apiName = 'AlertWetRest'; // Replace with your actual API name
  const path = '/items'; // Replace with your actual API path
  const myInit = {
    body: data, // Data to send
    headers: {}, // Optional headers
  };

  try {
    const response = await post(apiName, path, myInit);
    console.log('API response:', response);
    return response;
  } catch (error) {
    console.error('Error sending data to API:', error);
    throw error; // Rethrowing the error is useful if you want calling components to handle it
  }
}
