import {Alert, Button, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {authenticate} from "../../utilities/authController";
import {resetState, setEmail, setPassword} from "../../store/authStates/auth";
import {colors} from "../../constants/colors";
import {setAuthToken} from "../../store/authStates/login";

function LoginScreen({ navigation }) {
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');

    const emailValid = useSelector((state) => state.validRegisterForm.validEmail);
    const passwordValid = useSelector((state) => state.validRegisterForm.validPassword);

    const dispatch = useDispatch();
    async function loginHandler() {
        console.log(inputEmail)
        console.log(inputPassword)
        authenticate(inputEmail, inputPassword)
            .then((userCredential) => {
                dispatch((resetState({})))
                dispatch((setAuthToken({ token: userCredential._tokenResponse.idToken })));
            })
            .catch((exception) => {
                dispatch((resetState({})))
                switch (exception.code) {
                    case 'auth/invalid-email':
                        dispatch((setEmail({ email: false })));
                        break;
                    case 'auth/user-not-found':
                        dispatch((setEmail({ email: false })));
                        dispatch((setPassword({ password: false })));
                        break;
                    case 'auth/wrong-password':
                        dispatch((setEmail({ email: false })));
                        dispatch((setPassword({ password: false })));
                        break;
                    default:
                        Alert.alert('Unknown Error', 'Please try again later!');
                }
                console.log(exception.code)
            });
    }

    return (
        <>
            <View style={styles.titleContainer}>
                <Text style={styles.appTitle}>Ride Together</Text>
                {/*Add logo*/}
            </View>
            <View style={styles.inputFieldContainers}>
                <View style={styles.inputContainer}>
                    <TextInput placeholder={'Email'}
                               placeholderTextColor={colors.placeholderDefault}
                               style={[styles.input, !emailValid && styles.error]}
                               value={inputEmail}
                               autoCapitalize={'none'}
                               onChangeText={(enteredValue) => {setInputEmail(enteredValue)}}/>
                    { !emailValid && passwordValid && <Text style={styles.textError}>Invalid email</Text> }
                </View>
                <View style={styles.inputContainer}>
                    <TextInput placeholder={'Password'}
                               placeholderTextColor={colors.placeholderDefault}
                               secureTextEntry={true}
                               style={[styles.input, !passwordValid && styles.error]}
                               value={inputPassword}
                               autoCapitalize={'none'}
                               onChangeText={(enteredValue) => {setInputPassword(enteredValue)}}/>
                    { !emailValid && !passwordValid && <Text style={styles.textError}>Invalid email and/or password</Text> }
                </View>
            </View>
            <View style={styles.forgotPasswordContainer}>
                <Pressable>
                    <Text style={styles.textButton}>Forgot password?</Text>
                </Pressable>
            </View>
            <View style={styles.titleContainer}>
                <Button title={'Login'}
                        color={'#543864'}
                        onPress={loginHandler}/>
                <Text style={styles.text}>Don't have an account?</Text>
                <Pressable onPress={() => navigation.push('RegisterScreen')}>
                    <Text style={styles.textButton}>Sign up</Text>
                </Pressable>
            </View>
        </>


    );
}

export default LoginScreen;

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
    forgotPasswordContainer: {
        backgroundColor: colors.primary700,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 80
    },
    appTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: 'white',
        paddingBottom: 10
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
        color: colors.whiteDefault
    },
    text: {
        color: colors.whiteDefault
    },
    textButton: {
        color: colors.secondary500
    },
    error: {
        borderColor: colors.redDefault,
        borderWidth: 2
    },
    textError: {
        color: colors.redDefault,
        padding: 4
    }
});
