import { StyleSheet, Text, View, TextInput, Pressable, KeyboardAvoidingView, Switch } from "react-native";
import {useState} from 'react'

export default function Add() {
    const [name, setName] = useState()
    const [timesPerDay, set_timesPerDay] = useState()
    const [tablet, setTablet] = useState(true)
    const [amt, setAmt] = useState()
    const [purpose, setPurpose] = useState('')
    let freq = null
    async function addMedicine() {
        if (timesPerDay == 1) freq = '10'
        else if (timesPerDay === 2) freq = '10,17'
        else if (timesPerDay === 3) freq = '8,15,22'
        else if (timesPerDay === 4) freq = '8,11,19,22'     
        else if (timesPerDay === 5) freq = '7,11,15,19,23'
        console.log('medicine added')
    }
    return (
        <KeyboardAvoidingView behavior='height' style={{flex: 1, backgroundColor: '#2f2d2d', paddingTop: 20, justifyContent: 'center'}} edges={['top']}>
            <View style={{padding: 22, width: '80%', alignSelf: 'center'}}>
                <Text style={styles.inputHeader}>Medicine Name</Text>
                <TextInput onChangeText={setName} style={styles.inputText}></TextInput>
                <Text style={styles.inputHeader}>Times Per Day</Text>
                <TextInput onChangeText={set_timesPerDay} keyboardType='numeric' style={[styles.inputText, {width: '25%'}]}></TextInput>
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
                    <TextInput onChangeText={setAmt} keyboardType='numeric' style={[styles.inputText, {width: '35%'}]}></TextInput>
                    <Text style={[styles.inputHeader, {marginLeft: 7, marginTop: 10}]}>
                        {tablet ? 'Tablet(s)' : 'ml'}
                    </Text>
                </View>
                <Text style={styles.inputHeader}>Purpose (optional)</Text>
                <TextInput onChangeText={setPurpose} style={styles.inputText}></TextInput>
                <Pressable
                    onPress={addMedicine}
                    style={[styles.submitButton, !(name && timesPerDay && amt) && styles.disabledButton]}
                    disabled={!(name && timesPerDay && amt)}
                >
                    <Text>Add Medicine</Text>
                </Pressable>                
            </View>
        </KeyboardAvoidingView>
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
    }    
})