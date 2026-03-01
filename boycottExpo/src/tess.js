import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import MlkitOcr from 'react-native-mlkit-ocr';
import AsyncStorage from '@react-native-async-storage/async-storage'; // for storing med details n times


export default function Scan() {
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');
  const camera = useRef(null);

  const [message, setMessage] = useState('Loading cam...');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      setMessage('Checking camera permission...');
      const status = await Camera.getCameraPermissionStatus();
      setMessage(`Current permission status: ${status}`);

      if (status !== 'authorized') {
        setMessage('Requesting camera permission...');
        const newStatus = await Camera.requestCameraPermission();
        setMessage(`New permission status: ${newStatus}`);
        if (newStatus === 'authorized') {
          setMessage('Camera permission granted.');
        } // else {
        //   setMessage('Camera permission denied.');
        // }
      } else {
        setMessage('Camera permission already authorized.');
      }
    })();
  }, []);

  useEffect(() => {
    if (device) {
      setMessage(`Camera device found: ${device.name || 'Unnamed device'}`);
    } else {
      setMessage('No camera device available yet.');
    }

    if (device) {
      setReady(true);
      setMessage('Camera ready.');
    }
  }, [device]);

  const takePhoto = async () => {
    if (!camera.current) {
      setMessage('Camera reference not ready.');
      return;
    }
    try {
      setMessage('Label scanned successfully!');
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
            if (txt.includes('TAB') || txt.includes('ML')) {
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
      for (const val of Object.keys(toJSON)) {
        if (val === null) {
          successfully_scanned = false
          break
        }
      }
      if (successfully_scanned) {
        // add to localstorage here

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
        setMessage('Please scan again')
      }
    } catch (e) {
      setMessage(`Error taking photo: ${e.message}`);
    }
  };

  if (!ready) {
    return (
      <View style={styles.center}>
        <Text>{message}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera ref={camera} style={{ flex: 1 }} device={device} isActive={true} photo={true} />
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={{ color: 'white' }}>Take picture</Text>
      </TouchableOpacity>

      {/* Current message overlay */}
      <View style={styles.messageBox}>
        <Text style={{ color: 'white' }}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
  },
  messageBox: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
  },
});