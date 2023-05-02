import {Pressable, StyleSheet, Text, View} from "react-native";
import Section from "../components/Section";
import {getUser} from "../utilities/auth";

function HomeScreen() {
    console.log(getUser())
    return(
        <View style={styles.root}>
            <Section>Edits</Section>
            <View style={{flex: 2}}/>
            <Section>Tutorials</Section>
            <View style={{flex: 2}}/>
            <Section>Contests</Section>
            <View style={{flex: 2}}/>
            <Section>News</Section>
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'column'
    }
});