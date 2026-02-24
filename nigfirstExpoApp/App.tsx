import { NavigationContainer } from "@react-navigation/native";
import Chat from './Chat'
import Alarm from './Alarm'
import Meds from './tess'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import {Ionicons, MaterialIcons} from '@expo/vector-icons'

const Tab = createBottomTabNavigator()

export default function App() {
  
  return (
    <NavigationContainer children={
      <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarPosition: "top"
      }}>
        <Tab.Screen
          name="Chat"
          component={Chat}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubbles-outline" size={24} color="black" />
            )
          }}
        />
        <Tab.Screen
          name="Alarm"
          component={Alarm}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="alarm" size={24} color="black" />
            )
          }}
        />
        <Tab.Screen
          name="Meds"
          component={Meds}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="alarm" size={24} color="black" />
            )
          }}
        />
      </Tab.Navigator>
    }/>
  )
}