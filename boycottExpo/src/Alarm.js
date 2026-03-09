import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, BackHandler, KeyboardAvoidingView } from "react-native";

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
  const hour = '15' // String(new Date().getHours())


  useEffect(() => {
    async function getStuff() {
      const rawmeds = await AsyncStorage.getItem('meds')
      setMeds(rawmeds ? JSON.parse(rawmeds) : {})
      const rawtimes = await AsyncStorage.getItem('times')
      setTimes(rawtimes ? JSON.parse(rawtimes) : {})
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

    let medName = times[hour][medIndex]
    if (check) {
      if (medIndex >= times[hour].length && medIndex > 0) {
        return (
          <View style={styles.container}>
            <Text style={styles.title}>No more medicine to take for now :)</Text>
            <Pressable
              onPress={() => BackHandler.exitApp()}
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
                onPress={() => {
                  setMedIndex(prev => prev + 1)
                  // add logic here to remove medicine from times rotation
                }}
              >
                <Text style={{fontSize: 19}}>No</Text>
              </Pressable>              
            </View>
          </View>
        )
      }
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.supportText}>{meds[medName]['amt']} of</Text>
          {/* insert medicine image here */}
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