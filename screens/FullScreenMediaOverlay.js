import { StyleSheet, View, Image, StatusBar } from 'react-native';
import React from 'react';
import colors from '../constants/colors';

function FullScreenMediaOverlay({ route }) {
  return (
    <>
      {/* TODO Fix status bar color changing back to blue */}
      <StatusBar hidden backgroundColor={colors.blackDefault} />
      <View style={styles.root}>
        <Image style={styles.imageStyle} source={{ uri: route.params.imageUrl }} />
      </View>
    </>
  );
}

export default FullScreenMediaOverlay;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.blackDefault,
  },
  imageStyle: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
