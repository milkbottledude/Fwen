import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createRef } from 'react';
export const navigationRef = createRef();

import Chat from './Chat';
import Alerts from './Alerts';
import Scan from './tess';
import Alarm from './Alarm'

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarIcon: () => null,
        }}
      >
        <Tab.Screen name="Chat" component={Chat} />
        <Tab.Screen name="Alerts" component={Alerts} />
        <Tab.Screen name="Scan" component={Scan} />
        <Tab.Screen name="Alarm" component={Alarm} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}