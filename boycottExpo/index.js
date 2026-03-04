/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.DELIVERED || type === EventType.PRESS) {
    console.log('notification fired');
  }
});

AppRegistry.registerComponent(appName, () => App);
