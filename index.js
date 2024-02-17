import { AppRegistry } from 'react-native';
import App from './App'; // Adjust the path if your App component is located in a different directory
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
