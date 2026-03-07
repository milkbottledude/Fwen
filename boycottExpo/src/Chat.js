import {useState, useRef} from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, KeyboardAvoidingView, Pressable } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context' 

export default function Chat() {
  const [msgArr, addMsg] = useState([])
  const [userMsg, setUserMsg] = useState("")
  async function submitInput() {
    console.log('ENTER BUTTON PRESSEDDDDD')
    addMsg([...msgArr, userMsg])
    setUserMsg('')     
    try {
      const response = await fetch('http://192.168.1.24:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gooba5.2_temu', // goggins5
          messages: [{role: 'user', content: userMsg}],
          stream: false
        })
      });
      
      const reply = await response.json()
      addMsg([...msgArr, userMsg, reply.message.content])      
      console.log('SUCCESS:', reply);
      
    } catch (error) {
      console.log('ERROR:', error);
    }    
    
    // const reply = await response.json()
    // addMsg([...msgArr, userMsg, reply.message.content])
  }
  const scrollRef = useRef(null)
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#2f2d2d'}} edges={['top']}>    
      <KeyboardAvoidingView style={styles.container} behavior="height">
        {/* <StatusBar barStyle="dark-content" /> */}
        {msgArr.length === 0 && (
          <View style={styles.notice}>
            <Text style={styles.chatText}>First reponse may take 1-2mins</Text>
          </View>
        )}
        <View style={styles.scrollable}>
          <ScrollView
            ref={scrollRef}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({animated:true})}
            // contentContainerStyle={{paddingBottom: 90}}
          >
            {msgArr.map((msg, index) => (
              <View key={index} style={[styles.chatBubble, index % 2 ? styles.leftBubble : styles.rightBubble]}>
                <Text style={styles.chatText}>{msg}</Text>
              </View>            
            ))}
          </ScrollView>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.inputText]}
            value={userMsg}
            onChangeText={setUserMsg}
            placeholder='talk to Gooba...'
            placeholderTextColor={'#585454'}
            multiline
            maxLength={86}
          />
          <Pressable
            onPress={submitInput}
            style={[styles.submitButton, userMsg.length === 0 && styles.disabledButton]}
            disabled={userMsg.length === 0}
          >
            <Text>Enter</Text>
          </Pressable>
        </View>   
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2f2d2d',
  },
  chatText: {
    color: "aliceblue"
  },
  notice: {
    alignSelf: 'center',
    marginVertical: 50
  },
  chatBubble: {
    maxWidth: '69%',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginHorizontal: 20,
    borderWidth: 2,
  }, 
  rightBubble: {
    borderColor: "#dfeca1",
    margin: 20,
    alignSelf: 'flex-end'
  },
  leftBubble: {
    borderColor: "#0866cb",    
    alignSelf: 'flex-start'
  },
  scrollable: {
    flex: 1
  },
  inputContainer: {
    // flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    paddingBottom: 14,
    // borderWidth: 2,
    // borderColor: 'white',    
  },
  inputText: {
    alignSelf: 'center',
    width: '90%',
    borderRadius: 7,
    backgroundColor: 'darkgrey',
    paddingHorizontal: 12
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
});
