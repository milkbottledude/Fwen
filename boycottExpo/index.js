/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import {navigationRef} from './src/App'

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.DELIVERED || type === EventType.PRESS) {
    // await notifee.cancelNotification(detail.notification.id)
    setTimeout(() => {
    // const {title, body} = deets.notification
      navigationRef.current?.navigate('Alarm');
    }, 1000);    
  }
})

AppRegistry.registerComponent(appName, () => App);
