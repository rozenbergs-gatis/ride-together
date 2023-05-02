import {Pressable, StyleSheet, Text, View} from "react-native";
import {colors} from "../constants/colors";

function Section({ children, hideButton }) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionText}>{children}</Text>
            { !hideButton && <Pressable>
                <Text style={styles.buttonText}>See more</Text>
            </Pressable>}
        </View>
    );
}

export default Section;

const styles = StyleSheet.create({
    section: {
        flex: 1,
        backgroundColor: 'grey',
        justifyContent: 'center',
        elevation: 4
    },
    sectionText: {
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 10
    },
    buttonText: {
        color: colors.secondary500,
        marginLeft: 10
    }
});