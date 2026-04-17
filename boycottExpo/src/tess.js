import { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import MlkitOcr from 'react-native-mlkit-ocr';
import AsyncStorage from '@react-native-async-storage/async-storage'; // for storing med details n times
import notifee, { RepeatFrequency, TriggerType, AndroidImportance, AndroidCategory } from '@notifee/react-native';
import levenshtein from 'fast-levenshtein'

export default function Scan() {

  const meds_db = { // will move this to a proper db soon
    'Domperidone Tab 10mg (Motilium)': 'For Nausea/Vomiting',
    'Hyoscine 10mg Tab (Buscopan)': 'For Stomach Pain/Cramps',
    'Nexium Tab 40mg (Esomeprazole)': 'For Gastric Acid',
    'Eviline Forte Susp 100ml': 'For Heartburn/Bloatedness'
  }


  // notifee pt 1, the channel, ignores if alr set up before
  notifee.createChannel({
    id: 'meds_alarms',
    name: 'Meds Alarms Channel',
    importance: AndroidImportance.HIGH
  }).then(() => console.log('channel set up'))


  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');
  const camera = useRef(null);

  const [message, setMessage] = useState();
  const [ready, setReady] = useState(false);
  const [hasPermission, setHasPermission] = useState(false); 
  const [camActive, setCamActive] = useState(true)

useEffect(() => {
  (async () => {
    const status = Camera.getCameraPermissionStatus();
    if (status === 'granted') {
      setHasPermission(true);
    } else {
      const newStatus = await Camera.requestCameraPermission();
      if (newStatus === 'granted') {
        setMessage('Permission granted, please restart the app.')
      }
    }
    await notifee.requestPermission();
    await notifee.openBatteryOptimizationSettings(); // new
    await notifee.openAlarmPermissionSettings(); // new
  })();
}, []);

useEffect(() => {
  if (device && hasPermission) {
    setReady(true);
  }
}, [device, hasPermission]);

  const takePhoto = async () => {
    // await AsyncStorage.clear()
    setMessage('Scanning... please hold still')
    try {
      const photo = await camera.current.takePhoto();
      const uri = `file://${photo.path}`
      const result = await MlkitOcr.detectFromUri(uri);
      console.log(result)
      let toJSON = {
        'name': null,
        'amt': null,
        'rawfreq': null,
        'freq': null,
        'purpose': null
      }
      for (const dict of result) {
        if (toJSON.purpose) break
        let sentence = dict['text']
        let smolArr = sentence.split('\n')
        for (let txt of smolArr) {
          if (toJSON.rawfreq) { // 'purpose' comes right after 'freq'
            toJSON.purpose = txt
            break
          } else if (txt === txt.toUpperCase()) { // narrows down 'name'
            if (txt.includes(' TAB ') || txt.includes(' ML')) {
              if (toJSON.name === null) toJSON.name = txt
            }
          } else if (txt.slice(0, 5) === 'Take ') {
            if (txt.includes('tablet')) { // narrows down amt and req
              let startInd = txt.indexOf('tablet')
              let end = startInd + 6
              toJSON.amt = txt.slice(0, end)
              toJSON.rawfreq = txt.slice(end)
            } else { // txt.includes('ml') || txt.includes('ML')
              txt = txt.toLowerCase()
              let startInd = txt.indexOf('ml')
              let end = startInd + 2
              toJSON.amt = txt.slice(0, end)
              toJSON.rawfreq = txt.slice(end)           
            }
          }
        }
      }

      // autocorrect with levenshtein
      let ril = [null, 999]
      Object.keys(meds_db).forEach(key => {
        const dist = levenshtein.get(key.toUpperCase(), toJSON.name)
        if (dist < ril[1]) {
          ril[0] = key
          ril[1] = dist
        }
      })      
      console.log(ril[1])
      console.log('FUCKERRRRRRRRRR')
      if (ril[1] < 8) {
        toJSON.name = ril[0]
        toJSON.purpose = meds_db[ril[0]]        
      }

      // now to convert rawfreq to freq
      let rawfreq = toJSON.rawfreq
      if (rawfreq.includes('once') || rawfreq.includes('daily')) {
        toJSON.freq = '10'
      } else {
        let times = Number(rawfreq.match(/\d/))
        if (times === 2) toJSON.freq = '10,17'
        else if (times === 3) toJSON.freq = '8,15,22'
        else if (times === 4) toJSON.freq = '8,11,19,22'
      }
      console.log(toJSON)
      // TIME TO SEND REQ, AND setMessage('TEXT PARSED')
      let successfully_scanned = true
      for (const val of Object.values(toJSON)) {
        if (val === null) {
          successfully_scanned = false
          break
        }
      }
      if (successfully_scanned) {
        setMessage('Label scanned successfully!');
        setTimeout(() => setMessage(), 4000)        
        // meds key
        const rawmeds = await AsyncStorage.getItem('meds')
        const meds = rawmeds ? JSON.parse(rawmeds) : {}
        const {name, ...no_name} = toJSON
        meds[toJSON.name] = no_name   
        await AsyncStorage.setItem('meds', JSON.stringify(meds)) 
        console.log('item set in "meds"')
        // times key
        let baseTimes = {
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
        }
        const raw = await AsyncStorage.getItem('times')
        const times = raw ? JSON.parse(raw) : baseTimes
        for (const num of toJSON.freq.split(',')) {
          console.log(num)
          if (!times[num].includes(toJSON.name)) times[num].push(toJSON.name)        
        }
        await AsyncStorage.setItem('times', JSON.stringify(times))    
        console.log('item set in "times"')

        // for testing
        let kill = false

        // Create a trigger notification for each timing
        for (let [timeKey, medsArr] of Object.entries(times)) {
          if (medsArr.length > 0 && kill === false) {
            console.log('killing')
            kill = true
            let timeStr;
            if (timeKey > 12) {
              timeStr = `${Number(timeKey) - 12}pm`
            } else {
              timeStr = `${timeKey}am`
            }
            await notifee.cancelNotification(`${timeKey}_notif`) // reset the ting
            let title_text = `Its ${timeStr}! Time to take your meds`
            let body_text =  `You have ${medsArr.length} type(s) of meds to take`

            const date = new Date(Date.now())
            // date.setHours(Number(timeKey)) // btw it takes 19 seconds after set up for the notif to appear, lil delayed

            // date.setMinutes(0) // 
            // date.setMinutes(date.getMinutes() + 1)
            date.setSeconds(date.getSeconds() + 10)

            // if (Number(timeKey) <= new Date().getHours()) {
            //   date.setDate(date.getDate() + 1)
            // } // for when time is not in future

            // Create a time-based trigger
            const trigger = {
              type: TriggerType.TIMESTAMP,
              timestamp: date.getTime(),
              repeatFrequency: RepeatFrequency.DAILY 
            };

            await notifee.createTriggerNotification(
              {
                id: `${timeKey}_notif`, // boi
                title: title_text,
                body: body_text,
                android: {
                  channelId: 'meds_alarms',
                  category: AndroidCategory.ALARM,
                  ongoing: true,
                  pressAction: {id: 'default'},
                  fullScreenAction: {id: 'default'}
                },
              },
              trigger,
            )
            console.log('notif set up')            
          }   
        }

        // for testing
        const raw1 = await AsyncStorage.getItem('meds')
        const raw2 = await AsyncStorage.getItem('times')
        console.log(JSON.parse(raw1))
        console.log(JSON.parse(raw2))

        try {
          const response = await fetch('http://192.168.1.24:5001/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(toJSON)
          });
          
          const reply = await response.json()
          console.log('SUCCESS:', reply);
          
        } catch (error) {
          console.log('ERROR:', error);
        }          
      } else {
        setMessage('Image slightly blurry, please scan again')
      }
    } catch (e) {
      console.log(`Error taking photo: ${e.message}`);
      setMessage('Please include the whole label and try again')
    }
  };

  if (!ready) {
    return (
      <View style={styles.top_msg}>
        <Text>{message}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera 
        ref={camera} 
        style={{ flex: 1 }} 
        device={device} 
        isActive={camActive} 
        photo={true} 
        onError={() => setCamActive(false)}
      />
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={{color: 'white', fontSize: 17}}>Scan</Text>
      </TouchableOpacity>

      <View style={[styles.msgBox, !message && {display: 'none'}]}>
        <Text style={{color: 'white', fontSize: 19}}>{message}</Text>
      </View>        
    </View>
  );
}

const styles = StyleSheet.create({
  top_msg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    padding: 5,
    // borderRadius: 10,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: 'white',
    width: 77,
    height: 77,
    justifyContent: 'center',
    alignItems: 'center'
  },
  msgBox: {
    position: 'absolute',
    top: 140,
    left: 10,
    right: 10,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
  },
});