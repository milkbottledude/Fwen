import React, { useState } from 'react';
import { Button, Text, View, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';

export default function RelayMeds() {
    // const [ocrText, setOcrText] = useState('no fuckin text');
    const [ocrText, setOcrText] = useState('hey boiii');

    const takePhotoAndScan = async () => {
        console.log('pt1')

      //GET GODDAMN IMAGE URI HERE
      
        try {
            const sending = await fetch('http://192.168.1.24:11434/api/chat', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ocrText})
            });                
        } catch (error) {
            console.log('ERROR:', error);
        }    
    };
  return (
    <View style={{ padding: 20 }}>
      <Button title="Take Photo & Scan" onPress={() => {
        takePhotoAndScan()
      }}/> 
      <Text style={{ marginTop: 20, fontSize: 16 }}>{ocrText}</Text>
    </View>
  );
}