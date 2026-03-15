import { StyleSheet, Text, View, TextInput, Pressable, KeyboardAvoidingView, Switch } from "react-native";
import {useState} from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {SafeAreaView} from 'react-native-safe-area-context' 

export default function Add() {
    const [name, setName] = useState()
    const [timesPerDay, set_timesPerDay] = useState()
    const [tablet, setTablet] = useState(true)
    const [amt, setAmt] = useState()
    const [purpose, setPurpose] = useState('')
    const [newMed, setNewMed] = useState()
    async function addMedicine() {
        let freq = null
        const rawmeds = await AsyncStorage.getItem('meds')
        const meds = rawmeds ? JSON.parse(rawmeds) : {}
        const rawtimes = await AsyncStorage.getItem('times')
        const times = rawtimes ? JSON.parse(rawtimes) : {
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
        if (timesPerDay == 1) freq = '10'
        else if (timesPerDay == 2) freq = '10,17'
        else if (timesPerDay == 3) freq = '8,15,22'
        else if (timesPerDay == 4) freq = '8,11,19,22'     
        else if (timesPerDay == 5) freq = '7,11,15,19,23'
        for (const timeStr of freq.split(',')) {
            console.log(timeStr)
            times[timeStr].push(name)
        }
        console.log(times)
        if (purpose !== '') {
            if (purpose.slice(0, 3).toLowerCase() !== 'for') {
                setPurpose(prev => 'For' + prev)
            }
        }
        await AsyncStorage.setItem('times', JSON.stringify(times))
        const medDict = {
            'name': name,
            'amt': 'Take ' + amt + (tablet ? ' tablet(s)' : ' ml'),
            'freq': freq,
            'purpose': purpose
        }
        meds[name] = medDict
        console.log(meds)
        await AsyncStorage.setItem('meds', JSON.stringify(meds))
        console.log('medicine added')
        setName()
        set_timesPerDay()
        setTablet(true)
        setAmt()
        setPurpose('') 
    }
    return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#2f2d2d'}} edges={['top']}>    
        <View style={[styles.msgBox, !newMed && {display: 'none'}]}>
            <Text style={styles.inputHeader}>{newMed} added!</Text>
        </View>
        <KeyboardAvoidingView behavior='height' style={{flex: 1, backgroundColor: '#2f2d2d', paddingTop: 90, justifyContent: 'center'}} edges={['top']}>
            <View style={{padding: 22, width: '80%', alignSelf: 'center'}}>
                <Text style={styles.inputHeader}>Medicine Name</Text>
                <TextInput value={name} onChangeText={setName} style={styles.inputText} placeholderTextColor="rgba(232, 224, 224)" placeholder="e.g, Paracetamol"></TextInput>
                <Text style={styles.inputHeader}>Times Per Day</Text>
                <TextInput value={timesPerDay} onChangeText={set_timesPerDay} keyboardType='numeric' maxLength={1} style={[styles.inputText, {width: '25%'}]}></TextInput>
                <Text style={styles.inputHeader}>Medicine Type</Text>
                <View style={{display: 'flex', flexDirection: 'row', borderRadius: 9, backgroundColor: 'grey', width: '60%', justifyContent: 'center', margin: 8, padding: 5}}>
                    <Text style={[styles.inputHeader, {fontSize: 17}]}>Liquid</Text>
                    <Switch
                        value={tablet}
                        onValueChange={newVal => setTablet(newVal)}
                    />   
                    <Text style={[styles.inputHeader, {fontSize: 17}]}>Tablet</Text>                 
                </View>
                <Text style={styles.inputHeader}>Dosage</Text>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <TextInput value={amt} onChangeText={setAmt} keyboardType='numeric' maxLength={1} style={[styles.inputText, {width: '35%'}]}></TextInput>
                    <Text style={[styles.inputHeader, {marginLeft: 7, marginTop: 10}]}>
                        {tablet ? 'Tablet(s)' : 'ml'}
                    </Text>
                </View>
                <Text style={styles.inputHeader}>Purpose (optional)</Text>
                <TextInput placeholderTextColor="rgb(232, 224, 224)" placeholder="e.g, For fever" value={purpose} onChangeText={setPurpose} style={styles.inputText}></TextInput>
                <Pressable
                    onPress={() => {
                        setNewMed(name)
                        setTimeout(() => setNewMed(null), 2100)
                        addMedicine()
                    }}
                    style={[styles.submitButton, !(name && timesPerDay && amt) && styles.disabledButton]}
                    disabled={!(name && timesPerDay && amt)}
                >
                    <Text>Add Medicine</Text>
                </Pressable>                
            </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    inputHeader: {
        fontSize: 20,
        color: 'white',
        margin: 2
    },
    inputText: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: 'darkgrey',
        marginBottom: 20,   
        color: 'black',
        height: 42,
        paddingHorizontal: 10
    },
    submitButton: {
        alignSelf: 'flex-end',
        marginHorizontal: 25,
        marginVertical: 18,
        borderRadius: 7,
        paddingVertical: 7,
        paddingHorizontal: 10,
        backgroundColor: '#7ede3e'
    },
    disabledButton: {
        backgroundColor: '#676d4c'
    },
    msgBox: {
        padding: 10,
        backgroundColor: 'rgba(255, 253, 253, 0.5)',
        borderRadius: 10,
        alignItems: 'center'
    },    
})