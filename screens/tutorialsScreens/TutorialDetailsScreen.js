import React, { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLayoutEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { ResizeMode, Video } from 'expo-av';
import colors from '../../constants/colors';
import types from '../../constants/tutorialTypes';
import {
  addFavorite,
  addTutorialsInProgress,
  addTutorialsLearned,
  removeFavorite,
  removeTutorialsInProgress,
} from '../../store/tutorialStates/userFavoriteTutorials';
import PrimaryButton from '../../components/PrimaryButton';
import {
  addTutorialToCurrentUser,
  deleteTutorialFromCurrentUser,
} from '../../utilities/tutorialController';

function TutorialDetailsScreen({ navigation, route }) {
  const tutorialData = route.params.tutorial;
  const userFavoriteTutorials = useSelector((state) => state.userFavoriteTutorials.favoriteIds);
  const userTutorialsInProgress = useSelector(
    (state) => state.userFavoriteTutorials.tutorialsInProgress
  );
  const userTutorialsLearned = useSelector((state) => state.userFavoriteTutorials.tutorialsLearned);
  const dispatch = useDispatch();
  const tutorialIsFavorite = !!userFavoriteTutorials.find(
    (tutorial) => tutorial.id === tutorialData.id
  );
  const tutorialIsLearned = !!userTutorialsLearned.find(
    (tutorial) => tutorial.id === tutorialData.id
  );
  const tutorialInProgress = !!userTutorialsInProgress.find(
    (tutorial) => tutorial.id === tutorialData.id
  );
  const [_playBackStatus, setPlayBackStatus] = useState({});
  const video = useRef(null);

  useLayoutEffect(() => {
    const changeFavoriteHandler = async () => {
      if (tutorialIsFavorite) {
        const selectedTutorial = userFavoriteTutorials.find(
          (favorite) => favorite.id === tutorialData.id
        );
        await deleteTutorialFromCurrentUser(
          selectedTutorial.userFavoriteTutorialId,
          types.favorite
        );
        dispatch(removeFavorite({ id: tutorialData.id }));
      } else {
        const key = await addTutorialToCurrentUser(tutorialData.id, types.favorite).then((r) => r);
        dispatch(
          addFavorite({
            id: { id: tutorialData.id, userFavoriteTutorialId: key.toString().split('/').pop() },
          })
        );
      }
    };

    function favoriteButton() {
      return (
        <Ionicons
          name={tutorialIsFavorite ? 'star' : 'star-outline'}
          size={36}
          color={colors.secondary500}
          onPress={changeFavoriteHandler}
        />
      );
    }

    navigation.setOptions({
      headerRight: favoriteButton,
      headerTitle: 'Tutorial',
    });
  }, [dispatch, navigation, tutorialData.id, tutorialIsFavorite, userFavoriteTutorials]);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView nestedScrollEnabled>
        {/* Difficulty level label view */}
        {tutorialData.level && (
          <View style={styles.difficultyContainer}>
            <View style={styles.difficultyInnerContainer}>
              <Text style={styles.difficultyText}>{tutorialData.level}</Text>
            </View>
          </View>
        )}

        {/* Title container view */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{tutorialData.title}</Text>
        </View>

        {/* Created by and Description view */}
        <View style={styles.aboutTutorialContainer}>
          <View
            style={{
              flexShrink: 1,
              backgroundColor: colors.secondary900,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <Text style={styles.difficultyText}>User</Text>
          </View>
          <ScrollView nestedScrollEnabled>
            <View
              style={{
                flex: 2,
                backgroundColor: colors.backDrop,
                height: '100%',
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
              }}
            >
              <Text>{tutorialData.description}</Text>
            </View>
          </ScrollView>
        </View>

        {/* Video container view */}
        <View
          style={{
            flex: 0,
            height: 550,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Video
            ref={video}
            style={{ width: '100%', height: '100%' }}
            source={{
              uri: tutorialData.video_url,
            }}
            useNativeControls
            shouldPlay={false}
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            onPlaybackStatusUpdate={(status) => setPlayBackStatus(() => status)}
          />
        </View>

        {/* Action buttons view */}
        {tutorialData.type === 'Trick' && (
          <View style={styles.actionButtonContainer}>
            {!tutorialIsLearned && (
              <>
                <PrimaryButton
                  buttonTitle="Learned"
                  style={{ backgroundColor: colors.secondary500 }}
                  rippleColor={colors.secondary400}
                  outerContainerStyle={{ width: '75%' }}
                  onPress={() => {
                    Alert.alert(
                      'Add trick to portfolio?',
                      'This action cannot be undone and the tutorial will be completed!',
                      [
                        {
                          text: 'No',
                          onPress: () => {},
                          style: 'cancel',
                        },
                        {
                          text: 'Yes',
                          onPress: async () => {
                            const key = await addTutorialToCurrentUser(
                              tutorialData.id,
                              types.learned
                            ).then((r) => r);
                            const selectedTutorial = userTutorialsInProgress.find(
                              (tutorial) => tutorial.id === tutorialData.id
                            );
                            await deleteTutorialFromCurrentUser(
                              selectedTutorial.userInProgressTutorialId,
                              types.in_progress
                            );
                            dispatch(removeTutorialsInProgress({ id: tutorialData.id }));
                            dispatch(
                              addTutorialsLearned({
                                id: {
                                  id: tutorialData.id,
                                  userFavoriteTutorialId: key.toString().split('/').pop(),
                                },
                              })
                            );
                            navigation.goBack();
                          },
                        },
                      ]
                    );
                  }}
                />
                <PrimaryButton
                  buttonTitle="In Progress"
                  style={
                    tutorialInProgress
                      ? { backgroundColor: colors.placeholderDefault }
                      : { backgroundColor: 'transparent', elevation: 0 }
                  }
                  rippleColor={colors.secondary400}
                  outerContainerStyle={
                    !tutorialInProgress
                      ? {
                          width: '75%',
                          elevation: 0,
                          borderWidth: 2,
                          borderColor: colors.secondary500,
                        }
                      : { width: '75%', borderWidth: 0 }
                  }
                  onPress={async () => {
                    const key = await addTutorialToCurrentUser(
                      tutorialData.id,
                      types.in_progress
                    ).then((r) => r);
                    dispatch(
                      addTutorialsInProgress({
                        id: {
                          id: tutorialData.id,
                          userFavoriteTutorialId: key.toString().split('/').pop(),
                        },
                      })
                    );
                  }}
                  buttonTextStyle={{ color: colors.secondary500 }}
                  disabled={tutorialInProgress}
                />
              </>
            )}
            {tutorialIsLearned && (
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>
                You have already mastered this trick!
              </Text>
            )}
          </View>
        )}
        {tutorialData.type === 'Build' && (
          <View style={styles.actionButtonContainer}>
            <PrimaryButton
              buttonTitle="Done"
              style={{ backgroundColor: colors.secondary500 }}
              rippleColor={colors.secondary400}
              outerContainerStyle={{ width: '75%' }}
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default TutorialDetailsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  titleContainer: {
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  difficultyContainer: {
    flexShrink: 1,
    alignSelf: 'flex-start',
    width: '50%',
    height: 50,
    marginTop: 10,
    padding: 6,
    paddingRight: 20,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 10,
    backgroundColor: colors.labelGreen,
  },
  difficultyInnerContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  difficultyText: {
    fontSize: 18,
    color: colors.whiteDefault,
  },
  aboutTutorialContainer: {
    flexShrink: 1,
    maxHeight: 350,
    margin: 20,
    borderRadius: 16,
    elevation: 10,
  },
  actionButtonContainer: {
    flex: 1,
    height: 150,
    alignItems: 'center',
  },
});
