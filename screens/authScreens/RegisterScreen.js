import {Button, Pressable, StyleSheet, Text, TextInput, View} from "react-native";

function RegisterScreen() {
    return (
        <>
            <View style={styles.titleContainer}>
                <Text style={styles.appTitle}>Ride Together</Text>
                {/*Add logo*/}
            </View>
            <View style={styles.inputFieldContainers}>
                <View style={styles.inputContainer}>
                    <TextInput placeholder={'Email'} placeholderTextColor={'#747373'} style={styles.input}/>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput placeholder={'Password'} placeholderTextColor={'#747373'} secureTextEntry={true}
                               style={styles.input}/>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput placeholder={'Repeat Password'} placeholderTextColor={'#747373'} secureTextEntry={true}
                               style={styles.input}/>
                </View>
            </View>
            <View style={styles.titleContainer}>
                <Button title={'Register'} color={'#543864'}/>
                <Text style={styles.text}>Already have an account?</Text>
                <Pressable>
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
        backgroundColor: '#01024E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputFieldContainers: {
        backgroundColor: '#01024E',
        alignItems: 'center',
        justifyContent: 'center',
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
        backgroundColor: '#313380',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 6,
        fontSize: 16,
        width: 250

    },
    loginButton: {
        backgroundColor: '#543864'
    },
    text: {
        color: 'white'
    },
    textButton: {
        color: '#FF6464'
    }
});
