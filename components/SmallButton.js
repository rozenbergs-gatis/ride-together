import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors';

function SmallButton({
  buttonTitle,
  rippleColor,
  style,
  buttonTextStyle,
  outerContainerStyle,
  onPress,
}) {
  return (
    <View style={[styles.outerContainer, outerContainerStyle]}>
      <Pressable
        android_ripple={{ color: rippleColor }}
        style={[styles.buttonContainer, style]}
        onPress={onPress}
      >
        <Text style={[styles.buttonText, buttonTextStyle]}>{buttonTitle}</Text>
      </Pressable>
    </View>
  );
}

export default SmallButton;

const styles = StyleSheet.create({
  buttonContainer: {
    height: 50,
    backgroundColor: colors.secondary900,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 20,
    color: colors.whiteDefault,
  },
  outerContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    marginHorizontal: 4,
    marginVertical: 4,
  },
});
