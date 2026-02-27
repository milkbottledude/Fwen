import { StyleSheet, Text, View, StatusBar } from 'react-native';

export default function Chat() {
  return (
    <View style={styles.container}>
      <Text>im alarm</Text>
      <StatusBar barStyle="dark-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});