/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';

// for handling what happens when u press the notif
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  if (type === EventType.PRESS) {
    console.log('User pressed notification', notification);
  }
});

AppRegistry.registerComponent(appName, () => App);
