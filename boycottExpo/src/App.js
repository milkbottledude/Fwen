import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Chat from './Chat';
import Alerts from './Alerts';
import Scan from './tess';
// import Alarm from './Alarm'

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
        <Tab.Screen name="Alerts" component={Alerts} />
        <Tab.Screen name="Scan" component={Scan} />
        {/* <Tab.Screen name="Alarm" component={Alarm} options={{ tabBarButton: () => null }} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}