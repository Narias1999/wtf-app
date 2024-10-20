import { useEffect, useRef, useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, View as TransparentView, TouchableOpacity, TextInput as RNTextInput } from 'react-native';

import { TextInput, Text, Button, useTheme, Divider } from 'react-native-paper';
import { View } from '../components/Themed';
import { useLoginMutation, useGetUserQuery } from '../api/auth';
import { setAuth } from '../store/features/auth';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';

interface LoginForm {
  email: string;
  password: string;
}

const defaultFormValues = {
  email: '',
  password: '',
};

export default function Login() {
  const theme = useTheme();
  const passwordInput = useRef<RNTextInput | null>(null);
  const [login, { data, isError, isSuccess, error: loginError, isLoading }] = useLoginMutation();
  const { data: allUser, refetch: getUser  } = useGetUserQuery('', {
    skip: !data
  });
  const dispatch = useDispatch();
  const router = useRouter();

  const [form, setForm] = useState<LoginForm>({... defaultFormValues });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isError) {
      console.log(loginError);
      setError('Your email or password is wrong, please try again');
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setAuth(data));
      getUser()
    }
  }, [isSuccess]);

  useEffect(() => {
    if (allUser && data) {
      dispatch(setAuth({...data, user: allUser}));
      router.replace('/');
    }
  }, [allUser]);

  const handleUpdateForm = (key: keyof LoginForm) => (value: string) => {
    setForm({
      ...form,
      [key]: value,
    });
    setError('');
  }

  const handleLogin = () => {
    if (!form.email) {
      return setError('Please enter your email');
    }

    if (!form.password) {
      return setError('Please enter your password');
    }

    console.log("logging with", form)

    login({
      identifier: form.email,
      password: form.password,
    });
  };


  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container} >
      <View style={[styles.background, { backgroundColor: theme.colors.primary }]}>
        <TransparentView style={styles.titleContainer}>
          <Text variant="headlineMedium" style={{ color: '#fff' }}>World Tour Fantasy</Text>
        </TransparentView>
        <View style={styles.card}>
          <View style={styles.inputsContainer}>
            <TextInput
              onChangeText={handleUpdateForm('email')}
              mode="outlined"
              keyboardType="email-address"
              returnKeyType="next"
              label="Email"
              blurOnSubmit={false}
              onSubmitEditing={() => passwordInput?.current?.focus()}
              style={styles.input}
            />
            <TextInput
              ref={passwordInput}
              onChangeText={handleUpdateForm('password')}
              mode="outlined"
              label="Password"
              secureTextEntry={!showPassword}
              right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
              style={styles.input}
              onSubmitEditing={handleLogin}
            />
            <Button mode="elevated" style={styles.button} onPress={handleLogin} disabled={isLoading}>Log In</Button>
          </View>
          <View style={[styles.errorMessage, { opacity: error ? 1 : 0 }]}>
            <Text style={{ color: theme.colors.error, textAlign: 'center' }}>{error}</Text>
          </View>
          <Divider />
          <View style={styles.registerMessage}>
            <Text variant="bodyMedium">Don't you have an account?</Text>
            <TouchableOpacity onPress={()=> router.push('/register')}>
              <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: 80,
  },
  card: {
    flex: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 30,
    paddingTop: 0,
    justifyContent: 'center',
  },
  container: {
    flex: 1
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50
  },
  inputsContainer: {
    marginVertical: 30
  },
  input: {
    marginVertical: 10,
  },
  button: {
    marginTop: 15,
  },
  registerMessage: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    paddingTop: 20,
  },
  errorMessage: {
    paddingBottom: 30,
  }
});