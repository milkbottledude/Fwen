import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // for storing med details n times

export default function Alerts() {

  const [meds, setMeds] = useState({})
  const [times, setTimes] = useState({})

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const rawmeds = await AsyncStorage.getItem('meds');
        setMeds(rawmeds ? JSON.parse(rawmeds) : {});
        const rawtimes = await AsyncStorage.getItem('times');
        setTimes(rawtimes ? JSON.parse(rawtimes) : {});
      };
      load();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text>im alarm</Text>
      <StatusBar barStyle="dark-content" />
      {Object.entries(meds).map(([name, dict]) => (
        <View key={name}>
          <Text>{name}</Text>
        </View>            
      ))}      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});