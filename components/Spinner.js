import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';

import assets from '../assets/spinner.json';

function Spinner({ deps }) {
  const animation = useRef(null);

  useEffect(() => {
    animation.current?.reset();
    setTimeout(() => {
      animation.current?.play();
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

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
        source={assets}
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
