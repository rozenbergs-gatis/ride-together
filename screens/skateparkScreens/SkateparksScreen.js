import {Text, View, StyleSheet, Button, Pressable, FlatList} from "react-native";
import {colors} from "../../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import {TextInput, } from 'react-native-paper';
import * as skateparks from '../../data/skateparks.json'
import {useNavigation} from "@react-navigation/native";

function SkateparksScreen() {
    const navigation = useNavigation();
    function skateparkItems(itemData) {
        return(
            <View style={styles.skateparkOuterContainer}>
                <Pressable android_ripple={{color: colors.secondary700}}
                           style={styles.skateparkContainer}
                            onPress={() => {navigation.navigate('SkateparkDetails', {skateparkId: itemData.item.skatepark_id})}}>
                            <View>
                                <Text style={styles.skateparkTitle}>{itemData.item.name}</Text>
                            </View>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <View style={styles.searchContainer}>
                <TextInput placeholder={'Search'}
                           placeholderTextColor={colors.placeholderDefault}
                           style={styles.input}
                           textColor={colors.whiteDefault}
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
                <FlatList
                    data={skateparks.default}
                    renderItem={skateparkItems}
                    keyExtractor={(item) => item.skatepark_id}/>
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
    },
    skateparkContainer: {
        flex: 1,
        padding: 16,
        height: 150,
        borderRadius: 16,
        elevation: 4,
        alignItems: 'center',
        backgroundColor: colors.secondary800,
        overflow: 'hidden'
    },
    skateparkOuterContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginVertical: 8,
    },
    skateparkTitle: {
        fontSize: 20,
        color: colors.whiteDefault
    }
})