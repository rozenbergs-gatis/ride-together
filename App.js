import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import LoginScreen from "./screens/authScreens/LoginScreen";
import RegisterScreen from "./screens/authScreens/RegisterScreen";

export default function App() {
    return (
        <>
            <StatusBar style={'light'}/>
            {/*<LoginScreen/>*/}
            <RegisterScreen />
        </>
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
