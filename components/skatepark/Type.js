import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../constants/colors';

function Type({ typeName, icon, highlightType }) {
  return (
    <View style={styles.typeContainer}>
      {icon}
      <Text style={[styles.typeText, highlightType === typeName && styles.highlightType]}>
        {typeName}
      </Text>
    </View>
  );
}

export default Type;

const styles = StyleSheet.create({
  typeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary400,
    paddingVertical: 4,
    marginVertical: 10,
    borderRadius: 16,
    width: '17%',
    height: '80%',
  },
  typeText: {
    color: colors.whiteDefault,
  },
  highlightType: {
    color: colors.secondary500,
  },
});
