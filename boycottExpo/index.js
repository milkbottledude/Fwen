/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import {navigationRef} from './src/App'

notifee.onBackgroundEvent(async ({ type, deets }) => {
  if (type === EventType.DELIVERED) {
    setTimeout(() => {
    // const {title, body} = deets.notification
      navigationRef.current?.navigate('Alarm');
    }, 500);    
  }
})

AppRegistry.registerComponent(appName, () => App);
