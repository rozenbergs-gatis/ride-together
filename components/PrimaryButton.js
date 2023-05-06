import {Pressable, StyleSheet, Text, View} from "react-native";
import {colors} from "../constants/colors";

function PrimaryButton({buttonTitle, rippleColor, style, buttonTextStyle, outerContainerStyle, onPress, disabled}) {
    return (
        <View style={[styles.outerContainer, outerContainerStyle]}>
            <Pressable
                disabled={disabled}
                android_ripple={{color: rippleColor}}
                style={[styles.buttonContainer, style]}
                onPress={onPress}
            >
                <Text style={[styles.buttonText, buttonTextStyle]}>{buttonTitle}</Text>
            </Pressable>
        </View>
    );
}

export default PrimaryButton;

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: colors.secondary900,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        height: 50,
        paddingHorizontal: 16
    },
    buttonText: {
        fontSize: 20,
        color: colors.whiteDefault
    },
    outerContainer: {
        width: '55%',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 6,
        marginHorizontal: 16,
        marginVertical: 8,
    },
});