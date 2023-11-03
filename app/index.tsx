import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

import { useRouter } from 'expo-router';
import { TextInput, Text, Divider, Button } from 'react-native-paper';

export default function App() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/rooms');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container} >
      <View style={styles.titleContainer}>
        <Text variant="displayMedium">WTF</Text>
      </View>
      <Divider />
      <View style={styles.inputsContainer}>
        <TextInput
          mode="outlined"
          label="Email"
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label="Password"
          secureTextEntry
          right={<TextInput.Icon icon="eye" />}
          style={styles.input}
        />
        <Button mode="elevated" style={styles.button} onPress={handleLogin}>Log In</Button>
      </View>
    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  inputsContainer: {
    marginVertical: 30
  },
  input: {
    marginVertical: 10,
  },
  button: {
    marginTop: 15,
  }
});