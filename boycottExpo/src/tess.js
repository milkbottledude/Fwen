import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import MlkitOcr from 'react-native-mlkit-ocr';


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
        } else {
          setMessage('Camera permission denied.');
        }
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
      setMessage('Photo taken YAHOO');
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
          if (toJSON.freq) { // 'purpose' comes right after 'freq'
            toJSON.purpose = txt
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
      //TIME TO SEND REQ, AND setMessage('TEXT PARSED')
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
        <Text style={{ color: 'white' }}>Take Photo</Text>
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