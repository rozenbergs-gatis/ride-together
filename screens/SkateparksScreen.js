import {Text, View, StyleSheet, Button, Pressable} from "react-native";
import {colors} from "../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import {TextInput, } from 'react-native-paper';

function SkateparksScreen() {
    return (
        <View style={styles.root}>
            <View style={styles.searchContainer}>
                <TextInput placeholder={'Search'}
                           placeholderTextColor={colors.placeholderDefault}
                           style={styles.input}
                           underlineColor={'transparent'}
                           activeUnderlineColor={'transparent'}
                           autoCapitalize={'none'}
                           theme={{ roundness: 16 }}
                           left={<TextInput.Icon
                               icon={'magnify'}
                               iconColor={colors.secondary500}
                               size={36}
                               style={styles.icon}
                           />}/>
            </View>
            <View style={styles.filterButtonsContainer}>
                <View style={styles.buttonContainer}>
                    <Pressable onPress={() => {}}>
                        <Text style={styles.buttonText}>All</Text>
                    </Pressable>
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable onPress={() => {}}>
                        <Text style={styles.buttonText}>Newest</Text>
                    </Pressable>
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable onPress={() => {}}>
                        <Text style={styles.buttonText}>Favorite</Text>
                    </Pressable>
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable onPress={() => {}}>
                        <Text style={styles.buttonText}>Visited</Text>
                    </Pressable>
                </View>
            </View>
            <View style={{flex: 5}}>

            </View>
        </View>
    );
}

export default SkateparksScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    searchContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: colors.primary400,
        borderRadius: 16,
        fontSize: 16,
        width: '75%',
        color: colors.whiteDefault,
    },
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterButtonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttonContainer: {
        alignItems: 'center',
        backgroundColor: colors.secondary800,
        padding: 8,
        margin: 10,
        borderRadius: 16,
        width: '20%'
    },
    buttonText: {
        color: colors.whiteDefault,
        fontSize: 16,
    }
})