import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createRef, useEffect } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons'
import notifee, {EventType} from '@notifee/react-native';

export const navigationRef = createRef();

import Chat from './Chat';
import Alerts from './Alerts';
import Scan from './tess';
import Alarm from './Alarm'
import Add from './Add'

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    return notifee.onForegroundEvent(({ type }) => {
      if (type === EventType.DELIVERED) {
        navigationRef.current?.navigate('Alarm');
      }
    });
  }, []);  
  return (
    <NavigationContainer ref={navigationRef}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarIcon: ({color, size}) => {
            const icons = {
              Chat: 'chatbubble-outline',
              Alerts: 'notifications-outline',
              Scan: 'scan-outline',
              Add: 'notifications-outline',
            }
            return <Ionicons name={icons[route.name]} size={size} color={color} />
          },
        })}
      >
        <Tab.Screen name="Chat" component={Chat} />
        <Tab.Screen name="Alerts" component={Alerts} />
        <Tab.Screen name="Scan" component={Scan} />
        <Tab.Screen name="Add" component={Add} />
        <Tab.Screen name="Alarm" component={Alarm} />
        {/* <Tab.Screen name="Alarm" component={Alarm} options={{ tabBarItemStyle: { display: 'none' } }} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}