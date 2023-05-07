import { Alert, Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../utilities/authController';
import { setEmail, setPassword, resetState } from '../../store/authStates/auth';
import colors from '../../constants/colors';

function RegisterScreen({ navigation }) {
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputRepeatPassword, setInputRepeatPassword] = useState('');

  const [emailErrorText, setEmailErrorText] = useState('');

  const emailValid = useSelector((state) => state.validRegisterForm.validEmail);
  const passwordValid = useSelector((state) => state.validRegisterForm.validPassword);

  const dispatch = useDispatch();

  const registerFormHandler = async () => {
    if (inputPassword === inputRepeatPassword) {
      try {
        await register(inputEmail, inputPassword);
        dispatch(resetState({}));
        navigation.replace('LoginScreen');
      } catch (exception) {
        dispatch(resetState({}));
        switch (exception.code) {
          case 'auth/invalid-email':
            dispatch(setEmail({ email: false }));
            setEmailErrorText('Email is invalid');
            break;
          case 'auth/email-already-in-use':
            dispatch(setEmail({ email: false }));
            setEmailErrorText('Email already exists');
            break;
          case 'auth/weak-password':
            dispatch(setPassword({ password: false }));
            break;
          default:
            console.log(exception.code);
            console.log(exception.message);
            Alert.alert('Unknown Error', 'Please try again later!');
        }
      }
    } else {
      Alert.alert('Error', 'Passwords do not match.');
    }
  };

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.appTitle}>Ride Together</Text>
        {/* Add logo */}
      </View>
      <View style={styles.inputFieldContainers}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.placeholderDefault}
            style={[styles.input, !emailValid && styles.error]}
            value={inputEmail}
            onChangeText={(enteredValue) => {
              setInputEmail(enteredValue);
            }}
            autoCapitalize="none"
          />
          {!emailValid && <Text style={styles.textError}>{emailErrorText}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.placeholderDefault}
            secureTextEntry
            style={[styles.input, !passwordValid && styles.error]}
            value={inputPassword}
            onChangeText={(enteredValue) => {
              setInputPassword(enteredValue);
            }}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Repeat Password"
            placeholderTextColor={colors.placeholderDefault}
            secureTextEntry
            style={[styles.input, !passwordValid && styles.error]}
            value={inputRepeatPassword}
            onChangeText={(enteredValue) => {
              setInputRepeatPassword(enteredValue);
            }}
            autoCapitalize="none"
          />
        </View>
        {!passwordValid && (
          <Text style={styles.textError}>Password should be at least 6 characters long</Text>
        )}
      </View>
      <View style={styles.titleContainer}>
        <Button title="Register" color="#543864" onPress={registerFormHandler} />
        <Text style={styles.text}>Already have an account?</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.textButton}>Sign in</Text>
        </Pressable>
      </View>
    </>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  titleContainer: {
    flex: 2,
    backgroundColor: colors.primary700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputFieldContainers: {
    backgroundColor: colors.primary700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.whiteDefault,
    paddingBottom: 10,
  },
  inputContainer: {
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  input: {
    backgroundColor: colors.primary400,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    fontSize: 16,
    width: 250,
    color: colors.whiteDefault,
  },
  text: {
    color: colors.whiteDefault,
  },
  textButton: {
    color: colors.secondary500,
  },
  error: {
    borderColor: colors.redDefault,
    borderWidth: 2,
  },
  textError: {
    color: colors.redDefault,
    padding: 4,
  },
});
