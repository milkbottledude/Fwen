import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Chat from './Chat';
import Alarm from './Alarm';
import Scan from './tess';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarIcon: () => null,
        }}
      >
        <Tab.Screen name="Chat" component={Chat} />
        <Tab.Screen name="Alarm" component={Alarm} />
        <Tab.Screen name="Scan" component={Scan} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}