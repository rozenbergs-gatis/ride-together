import LottieView from "lottie-react-native";
import {StyleSheet, View} from "react-native";
import {useEffect, useRef} from "react";

function Spinner({deps}) {
    const animation = useRef(null);

    useEffect(() => {
        animation.current?.reset();
        setTimeout(() => {
            animation.current?.play();
        }, 100)
    }, deps)

    return (
        <View style={styles.animationContainer}>
            <LottieView
                autoPlay
                ref={animation}
                style={{
                    width: 300,
                    height: 300,
                    backgroundColor: 'transparent',
                }}
                source={require('../assets/spinner.json')}
            />
        </View>
    );
}

export default Spinner;

const styles = StyleSheet.create({
    animationContainer: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
});