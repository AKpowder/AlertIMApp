import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// AWS Amplify imports
import { Amplify } from 'aws-amplify';
import awsExports from './src/aws-exports';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
// Screen imports
import HomeScreen from './screens/HomeScreen';
import GateWayConfig from './screens/GateWayConfig';

// Configure Amplify
// Amplify.configure(amplifyconfig);
Amplify.configure(awsExports);

const Stack = createStackNavigator();

function AppContent() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Welcome',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="GateWayConfig"
          component={GateWayConfig}
          options={{ title: 'Setup Gateway' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
function SignOutButton() {
  const { signOut } = useAuthenticator();
  return <Button title="Sign Out" onPress={signOut} />;
}

// Wrap your app's content with the Authenticator component
function App() {
  return (
    <Authenticator.Provider>
      <Authenticator loginMechanisms={['email']}>
        <SignOutButton />
      </Authenticator>
    </Authenticator.Provider>
  );
}

export default App;
