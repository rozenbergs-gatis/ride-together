import {Pressable, StyleSheet, Text, View} from "react-native";

function Section({ children }) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionText}>{children}</Text>
            <Pressable>
                <Text style={styles.buttonText}>See more</Text>
            </Pressable>
        </View>
    );
}

export default Section;

const styles = StyleSheet.create({
    section: {
        flex: 1,
        backgroundColor: 'grey',
        elevation: 4
    },
    sectionText: {
        fontWeight: 'bold',
        fontSize: 14
    },
    buttonText: {
        color: '#FF6464'
    }
});