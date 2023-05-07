import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import TabButton from '../../components/creatorsSpace/TabButton';
import colors from '../../constants/colors';
import PrimaryButton from '../../components/PrimaryButton';

function TutorialsScreen() {
  const [learnTricksActive, setLearnTricksActive] = useState(true);
  const [learnBuildActive, setLearnBuildActive] = useState(false);

  return (
    <View style={styles.root}>
      {/* Top Tab buttons */}
      <View style={styles.buttonsContainer}>
        <TabButton
          buttonTitle="Learn new tricks!"
          style={{ backgroundColor: colors.secondary900 }}
          rippleColor={colors.secondary850}
          selectedContainerStyle={learnTricksActive && styles.selectedButton}
          onPress={() => {
            setLearnTricksActive(true);
            setLearnBuildActive(false);
          }}
        />
        <TabButton
          buttonTitle="Build your bike!"
          rippleColor={colors.secondary700}
          style={{ backgroundColor: colors.secondary800 }}
          selectedContainerStyle={learnBuildActive && styles.selectedButton}
          onPress={() => {
            setLearnTricksActive(false);
            setLearnBuildActive(true);
          }}
        />
      </View>

      {/* Trick filter selection buttons */}
      <View style={styles.difficultyFilterContainer}>
        <View style={styles.levelOuterContainer}>
          <Pressable
            android_ripple={styles.rippleColor}
            style={styles.levelInnerContainer}
            onPress={() => {}}
          >
            <View>
              <Text style={styles.levelTitle}>BEGINNER</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.levelOuterContainer}>
          <Pressable
            android_ripple={styles.rippleColor}
            style={styles.levelInnerContainer}
            onPress={() => {}}
          >
            <View>
              <Text style={styles.levelTitle}>INTERMEDIATE</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.levelOuterContainer}>
          <Pressable
            android_ripple={styles.rippleColor}
            style={styles.levelInnerContainer}
            onPress={() => {}}
          >
            <View>
              <Text style={styles.levelTitle}>EXPERT</Text>
            </View>
          </Pressable>
        </View>
      </View>
      <View style={styles.difficultyAllFilterContainer}>
        <PrimaryButton
          buttonTitle="See all"
          style={{ backgroundColor: colors.blackDefault }}
          outerContainerStyle={{ width: '80%' }}
          rippleColor={colors.secondary400}
          onPress={() => {}}
        />
      </View>
    </View>
  );
}

export default TutorialsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  buttonsContainer: {
    flexShrink: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
  selectedButton: {
    borderBottomWidth: 5,
    borderBottomColor: colors.secondary500,
  },
  difficultyFilterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyAllFilterContainer: {
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelOuterContainer: {
    flex: 1,
    width: '90%',
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  levelInnerContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary800,
    overflow: 'hidden',
  },
  levelTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.whiteDefault,
  },
  rippleColor: {
    color: colors.secondary700,
  },
});
