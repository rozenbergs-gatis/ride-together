import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../constants/colors';

function TabButton({
  onPress,
  selectedContainerStyle,
  buttonTitle,
  style,
  textStyle,
  rippleColor,
}) {
  return (
    <Pressable
      android_ripple={{ color: rippleColor }}
      style={[styles.buttonContainer, style, selectedContainerStyle]}
      onPress={onPress}
    >
      <View>
        <Text style={[styles.buttonText, textStyle]}>{buttonTitle}</Text>
      </View>
    </Pressable>
  );
}

export default TabButton;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    width: '100%',
    height: 75,
    backgroundColor: colors.secondary900,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    color: colors.whiteDefault,
  },
});
