import { StyleSheet, Text, View, Button } from "react-native";

// plan for this script is to have it display the upcoming time to take meds. Then when meds time comes, tick off each one, when all are ticked then go back to default layout, which is showing when to take next meds"

export default function AlarmScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hey there</Text>
        </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});