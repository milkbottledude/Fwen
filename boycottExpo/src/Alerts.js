import { StyleSheet, Text, View, StatusBar, Image } from 'react-native';
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
      {Object.keys(meds).length === 0 && (
        <Text style={styles.title}>No meds for you to take right now :)</Text>
      )}
      <StatusBar barStyle="dark-content" />
      {Object.entries(meds).map(([name, dict]) => (
        <View key={name} style={styles.medsTile}>
          <View key={`${name}_top`} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>{name}</Text>
            <Image
              source={require('../assets/Fig-6.3-snap_after_masking.jpg')}
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
          </View>
          <Text>Amt: {dict.amt}</Text>
          {/* {dict.freq.split(',').map(times => {
            console.log(times)
            if (Number(times) > 12) {
              <Text>{Number(times) - 12}pm</Text>
            } else {
              <Text>{times}am</Text>
            }
          })} */} 
          {/* above can console log the thing, but wont show up on phone */}
          <Text>When: {dict.freq}</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  medsTile: {
    width: '90%',
    borderColor: 'black',
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 5,
    paddingVertical: 3
  }
});