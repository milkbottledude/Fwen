import { StyleSheet, Text, View, StatusBar, Image, ScrollView, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // for storing med details n times

export default function Alerts() {

  const [meds, setMeds] = useState({})
  const [times, setTimes] = useState({})
  const [open, setOpen] = useState({})

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const rawmeds = await AsyncStorage.getItem('meds');
        setMeds(rawmeds ? JSON.parse(rawmeds) : {});
        const rawtimes = await AsyncStorage.getItem('times');
        setTimes(rawtimes ? JSON.parse(rawtimes) : {});
        console.log(JSON.parse(rawmeds))
        console.log(JSON.parse(rawtimes))
      };
      load();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container} style={{borderColor: 'black', borderWidth: 10}}>
      {Object.keys(meds).length === 0 && (
        <Text style={styles.title}>No meds for you to take right now :)</Text>
      )}
      <StatusBar barStyle="dark-content" />
      {Object.entries(times).map(([time, medArr]) => (
        medArr.length > 0 && (
          <View key={time}>
            <Pressable 
              style={[styles.Tile, styles.timeTile]} 
              onPress={() => setOpen(prev => ({...prev, [time]: !prev[time]}))}
            >
              {Number(time) > 12 ? (
                <Text style={styles.title}>{Number(time) - 12}pm</Text>
              ) : (
                <Text style={styles.title}>{time}am</Text>
              )}
              <View style={styles.alertNo}>
                <Text>{medArr.length}</Text>
              </View>
            </Pressable>       
            {open[time] && (
              <View>
                {medArr.map(medName => (
                  <View key={time + medName} style={styles.Tile}>
                    <View style={styles.tile_top}>
                      <Text>{medName}</Text>
                      <Image
                        source={require('../assets/Fig-6.3-snap_after_masking.jpg')}
                        style={{width: 20, height: 20}}
                      />
                    </View>
                    <Text>{meds[medName].amt}</Text>
                    <Text>{meds[medName].purpose}</Text>
                  </View>
                ))} 
              </View>              
            )}    

          </View>
        )
      ))}      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 35,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  Tile: {
    width: '82%',
    borderColor: 'black',
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  timeTile: {
    minWidth: '90%', 
    marginTop: 19, 
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tile_top: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  alertNo: {
    borderColor: 'blue',
    backgroundColor: 'dark-yellow',
    borderWidth: 2,
    paddingHorizontal: 4,
    height: 29,
    width: 22,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  }
});