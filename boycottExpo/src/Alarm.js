import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, BackHandler, KeyboardAvoidingView, Image } from "react-native";
import notifee from '@notifee/react-native';
import {navigationRef} from './App.js'

// plan: are yu still experiencing: {} ? ----> No more meds for now! <close app button>

// for med in time, extract purpose, add 'yes' 'no' button, if yes den display image, w info below n button 'Done'

// when done button pressed, move on to next med w purpose

export default function AlarmScreen() {
  const [times, setTimes] = useState({
    '7': [],
    '8': [],
    '9': [],
    '10': [],
    '11': [],
    '12': [],
    '13': [],
    '14': [],
    '15': [],
    '16': [],
    '17': [],
    '18': [],
    '19': [],
    '20': [],
    '21': [],
    '22': []
  })
  const [meds, setMeds] = useState({})
  const [check, setCheck] = useState(true)
  const [medIndex, setMedIndex] = useState(0)
  const [wait, setWait] = useState(true)
  const hour = '8' // String(new Date().getHours())

  const med_pics = {
    'Hyoscine': require('../assets/Hyoscine_pic.jpg'),
    'Domperidone': require('../assets/Domperidone_pic.jpg'),
  };

  const jic = require('../assets/jic_pic.jpg')


  useEffect(() => {
    async function getStuff() {
      const rawmeds = await AsyncStorage.getItem('meds')
      setMeds(rawmeds ? JSON.parse(rawmeds) : {})
      const rawtimes = await AsyncStorage.getItem('times')
      setTimes(rawtimes ? JSON.parse(rawtimes) : times)
      setWait(false)
    }
    getStuff()    
  }, [])



  const handleCheck = () => {
    if (wait) {
      return (
        <View style={{backgroundColor: 'black'}}>
          <Text>Loading...</Text>
        </View>
      )
    }

    let medName = ''
    if (Object.keys(times).length > 0) {
      medName = times[hour][medIndex]
      console.log(medName)
      console.log(meds)
    }
    if (check && Object.keys(times).length > 0) {
      if ((medIndex >= times[hour].length && medIndex > 0) ||times[hour].length === 0) {  
        return (
          <View style={styles.container}>
            <Text style={styles.title}>No more medicine to take for now :)</Text>
            <Pressable
              onPress={async () => {
                notifee.cancelNotification(`${hour}_notif`)
                await AsyncStorage.setItem('times', JSON.stringify(times))
                await AsyncStorage.setItem('meds', JSON.stringify(meds))
                navigationRef.current?.navigate('Chat')
                // setTimeout(() => BackHandler.exitApp(), 200)
                BackHandler.exitApp()
              }}
              style={styles.button}
            >
              <Text style={{fontSize: 19}}>Exit App</Text>
            </Pressable>
          </View>
        )
      } else {
        let purpose = meds[medName]['purpose']
        let problem;
        if (purpose.includes('FOR')) {
          problem = purpose.split('FOR ')[1]
        } else if (purpose.includes('With')) {
          problem = purpose.split('With')[1]
        } else if (purpose.includes('Anti')) {
          problem = purpose.split('Anti ')[1]
        } else if (purpose.includes('For')) {
          problem = purpose.split('For ')[1]
        } else if (purpose.includes('for')) {
          problem = purpose.split('for ')[1]
        } else {
          problem = purpose
        }
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Time to take your meds!</Text>
            <Text style={styles.supportText}>
              Do you still have {problem.toLowerCase()}?
            </Text>
            <View style={styles.yes_no}>
              <Pressable 
                // style={styles.yes}
                style={styles.button}
                onPress={() => setCheck(prev => !prev)}
              >
                <Text style={{fontSize: 19}}>Yes</Text>
              </Pressable>
              <Pressable 
                // style={styles.no}
                style={styles.button}
                onPress={async () => {
                  // setMedIndex(prev => prev + 1)
                  const medsCopy = {...meds}
                  const timesCopy = {...times}                  
                  // add logic here to remove medicine from times rotation
                  for (const [time2, medArr2] of Object.entries(timesCopy)) {
                    timesCopy[time2] = medArr2.filter(med => med !== medName)
                  }                                          
                  delete medsCopy[medName]
                  setMeds(medsCopy)
                  setTimes(timesCopy)
                  console.log('removed med from meds and times')
                }}
              >
                <Text style={{fontSize: 19}}>No</Text>
              </Pressable>              
            </View>
          </View>
        )
      }
    } else if (Object.keys(times).length > 0) {
      return (
        <View style={styles.container}>
          {/* insert medicine image here */}
          <Image
            source={med_pics[medName.split(' ')[0]] || jic}
            style={{width: 300, height: 400}}
          />
          {/* insert medicine image here */}          
          <Text style={[styles.supportText, {marginTop: 25}]}>{meds[medName]['amt']} of</Text>
          <Text style={styles.title}>{medName}</Text>
          <Pressable
            onPress={() => {
              setCheck(prev => !prev)
              setMedIndex(prev => prev + 1)
            }}
            style={styles.button}
          >
            <Text style={{fontSize: 19}}>Done</Text>
          </Pressable>
        </View>         
      )
    }
  }
  
  return (
    <KeyboardAvoidingView behaviour='height' style={{flex: 1}}>
      <Text style={{display: 'none'}}>test</Text>
      {handleCheck()}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    borderRadius: 5,
    // backgroundColor: '#007AFF',
    borderColor: '#007AFF',
    borderWidth: 2,
    paddingVertical: 3,
    paddingHorizontal: 5,
    margin: 21,
  },
  yes_no: {
    display: 'flex', 
    flexDirection: 'row', 
    // borderWidth: 2, 
    // borderColor: 'black', 
    // width: '60%', 
    // justifyContent: 'space-between'
  },
  supportText: {
    fontSize: 19, 
    margin: 17, 
    textAlign: 'center'
  }
});