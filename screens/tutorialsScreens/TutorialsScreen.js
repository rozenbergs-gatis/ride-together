import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { ResizeMode, Video } from 'expo-av';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import TabButton from '../../components/creatorsSpace/TabButton';
import colors from '../../constants/colors';
import { tutorialConstants } from '../../constants/types';
import SmallButton from '../../components/SmallButton';
import {
  addTutorialToCurrentUser,
  deleteTutorialFromCurrentUser,
  getAllTutorials,
} from '../../utilities/tutorialController';
import {
  setBuildTutorials,
  setRefreshData,
  setTrickTutorials,
  setTutorialDisplayData,
} from '../../store/tutorialStates/globalTutorials';
import {
  addFavorite,
  removeFavorite,
  setFavorite,
  setTutorialsInProgress,
  setTutorialsLearned,
} from '../../store/tutorialStates/userFavoriteTutorials';
import { getAllUserTutorialsByType } from '../../utilities/userController';
import { getCurrentUser } from '../../utilities/authController';
import Spinner from '../../components/Spinner';

function TutorialsScreen({ navigation }) {
  const [screenLoading, setScreenLoading] = useState(true);
  const [learnTricksActive, setLearnTricksActive] = useState(true);
  const [learnBuildActive, setLearnBuildActive] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const trickTutorials = useSelector((state) => state.globalTutorials.trickTutorials);
  const buildTutorials = useSelector((state) => state.globalTutorials.buildTutorials);
  const displayTutorials = useSelector((state) =>
    [...state.globalTutorials.displayTutorials].sort((a, b) => b.timestamp - a.timestamp)
  );
  const reloadData = useSelector((state) => state.globalTutorials.refreshData);
  const userFavoriteTutorials = useSelector((state) => state.userFavoriteTutorials.favoriteIds);
  const userTutorialsInProgress = useSelector(
    (state) => state.userFavoriteTutorials.tutorialsInProgress
  );
  const dispatch = useDispatch();
  const video = useRef(null);

  useEffect(() => {
    async function fetchTutorials(type) {
      setLearnTricksActive(true);
      setLearnBuildActive(false);
      await getAllTutorials(type)
        .then((tutorials) => {
          if (type === tutorialConstants.trick) {
            dispatch(setTrickTutorials({ trickTutorials: tutorials }));
            dispatch(setTutorialDisplayData({ displayTutorials: tutorials }));
          } else {
            dispatch(setBuildTutorials({ buildTutorials: tutorials }));
          }
        })
        .catch(() => {
          Alert.alert('Unable to fetch data', 'Please try again later');
        });
      setScreenLoading(false);
      dispatch(setRefreshData({ refreshData: false }));
    }

    fetchTutorials(tutorialConstants.trick);
    fetchTutorials(tutorialConstants.build);
  }, [dispatch, reloadData]);

  useEffect(() => {
    async function fetchFavorite() {
      const user = await getCurrentUser();
      let userFavoriteTutorialsList = [];
      await getAllUserTutorialsByType(user, tutorialConstants.favorite)
        .then((tutorials) => {
          const userTutorialList = tutorials.val();
          const keys = Object.keys(userTutorialList);
          keys.forEach((key) => {
            userFavoriteTutorialsList.push({
              id: userTutorialList[key].tutorial_id,
              userFavoriteTutorialId: key,
            });
          });
        })
        .catch((_e) => {
          userFavoriteTutorialsList = [];
        });
      dispatch(setFavorite({ ids: userFavoriteTutorialsList }));
    }
    fetchFavorite();
  }, [dispatch]);

  useEffect(() => {
    async function fetchInProgress() {
      const user = await getCurrentUser();
      let userInProgressTutorialsList = [];
      await getAllUserTutorialsByType(user, tutorialConstants.in_progress)
        .then((tutorials) => {
          const userTutorialList = tutorials.val();
          const keys = Object.keys(userTutorialList);
          keys.forEach((key) => {
            userInProgressTutorialsList.push({
              id: userTutorialList[key].tutorial_id,
              userInProgressTutorialId: key,
            });
          });
        })
        .catch((_e) => {
          userInProgressTutorialsList = [];
        });
      dispatch(setTutorialsInProgress({ ids: userInProgressTutorialsList }));
    }
    fetchInProgress();
  }, [dispatch]);

  useEffect(() => {
    async function fetchLearned() {
      const user = await getCurrentUser();
      let userLearnedTutorialsList = [];
      await getAllUserTutorialsByType(user, tutorialConstants.learned)
        .then((tutorials) => {
          const userTutorialList = tutorials.val();
          const keys = Object.keys(userTutorialList);
          keys.forEach((key) => {
            userLearnedTutorialsList.push({
              id: userTutorialList[key].tutorial_id,
              userLearnedTutorialId: key,
            });
          });
        })
        .catch((_e) => {
          userLearnedTutorialsList = [];
        });
      dispatch(setTutorialsLearned({ ids: userLearnedTutorialsList }));
    }
    fetchLearned();
  }, [dispatch]);

  const trickItems = (itemData) => {
    const tutorialIsFavorite = !!userFavoriteTutorials.find(
      (favorite) => favorite.id === itemData.item.id
    );

    const changeFavoriteHandler = async () => {
      if (tutorialIsFavorite) {
        const selectedTutorial = userFavoriteTutorials.find(
          (favorite) => favorite.id === itemData.item.id
        );
        await deleteTutorialFromCurrentUser(
          selectedTutorial.userFavoriteTutorialId,
          tutorialConstants.favorite
        );
        dispatch(removeFavorite({ id: itemData.item.id }));
      } else {
        const key = await addTutorialToCurrentUser(
          itemData.item.id,
          tutorialConstants.favorite
        ).then((r) => r);
        dispatch(
          addFavorite({
            id: { id: itemData.item.id, userFavoriteTutorialId: key.toString().split('/').pop() },
          })
        );
      }
    };

    if (screenLoading) {
      return <Spinner deps={[]} />;
    }

    return (
      <View style={styles.tutorialItemContainer}>
        <Pressable
          android_ripple={{ color: colors.secondary700 }}
          style={styles.tutorialItemPressable}
          onPress={() => {
            navigation.navigate('TutorialDetailsScreen', { tutorial: itemData.item });
          }}
        >
          {/* Favorite Icon view */}
          <View style={styles.favoriteContainer}>
            <Pressable style={styles.favoritePressable} onPress={changeFavoriteHandler}>
              <Ionicons
                name={tutorialIsFavorite ? 'star' : 'star-outline'}
                size={36}
                color={colors.secondary500}
              />
            </Pressable>
          </View>

          {/* Tutorial item level view */}
          {itemData.item.level && (
            <View style={styles.tutorialLevelContainer}>
              <Text style={styles.tutorialLevelText}>{itemData.item.level.toUpperCase()}</Text>
            </View>
          )}

          {/* Tutorial item title view */}
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.tutorialTitle} numberOfLines={1}>
              {itemData.item.title.length < 34
                ? itemData.item.title
                : `${itemData.item.title.substring(0, 31)}...`}
            </Text>
          </View>

          {/* Tutorial item description view */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText} numberOfLines={2}>
              {itemData.item.description}
            </Text>
          </View>

          {/* Tutorial item video preview */}
          <View style={styles.videoContainer}>
            <Video
              ref={video}
              style={styles.video}
              source={{
                uri: itemData.item.video_url,
              }}
              shouldPlay={false}
              resizeMode={ResizeMode.COVER}
            />
            <Pressable style={{ position: 'absolute' }}>
              <FontAwesome5 name="play-circle" size={96} color="grey" />
            </Pressable>
          </View>
        </Pressable>
      </View>
    );
  };

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
            setSelectedFilter('All');
            dispatch(setTutorialDisplayData({ displayTutorials: trickTutorials }));
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
            setSelectedFilter('All');
            dispatch(setTutorialDisplayData({ displayTutorials: buildTutorials }));
          }}
        />
      </View>

      {/* Search trick tutorial view */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          placeholderTextColor={colors.placeholderDefault}
          style={styles.input}
          textColor={colors.whiteDefault}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          autoCapitalize="none"
          value={searchInput}
          onChangeText={(enteredValue) => {
            setSearchInput(enteredValue);
          }}
          theme={{ roundness: 16 }}
          left={
            <TextInput.Icon
              icon="magnify"
              iconColor={colors.secondary500}
              size={36}
              style={styles.icon}
            />
          }
        />
      </View>

      {/* Filter button view */}
      <View style={styles.buttonsContainer}>
        <SmallButton
          buttonTitle="All"
          rippleColor={colors.whiteDefault}
          style={
            selectedFilter === 'All'
              ? { backgroundColor: colors.secondary500, height: 40 }
              : { backgroundColor: colors.backDrop, height: 40 }
          }
          outerContainerStyle={{ width: '25%', height: 40 }}
          buttonTextStyle={styles.cancelButtonText}
          onPress={() => {
            setSelectedFilter('All');
            dispatch(
              setTutorialDisplayData({
                displayTutorials: learnTricksActive ? trickTutorials : buildTutorials,
              })
            );
          }}
        />
        <SmallButton
          buttonTitle="Favorite"
          rippleColor={colors.whiteDefault}
          style={
            selectedFilter === 'Favorite'
              ? { backgroundColor: colors.secondary500, height: 40 }
              : { backgroundColor: colors.backDrop, height: 40 }
          }
          outerContainerStyle={{ height: 40 }}
          buttonTextStyle={styles.cancelButtonText}
          onPress={() => {
            setSelectedFilter('Favorite');
            dispatch(
              setTutorialDisplayData({
                displayTutorials: learnTricksActive
                  ? trickTutorials.filter((trick) =>
                      userFavoriteTutorials.find((favorite) => favorite.id === trick.id)
                    )
                  : buildTutorials.filter((trick) =>
                      userFavoriteTutorials.find((favorite) => favorite.id === trick.id)
                    ),
              })
            );
          }}
        />
        {learnTricksActive && (
          <SmallButton
            buttonTitle="In Progress"
            rippleColor={colors.whiteDefault}
            style={
              selectedFilter === 'In Progress'
                ? { backgroundColor: colors.secondary500, height: 40 }
                : { backgroundColor: colors.backDrop, height: 40 }
            }
            outerContainerStyle={{ height: 40 }}
            buttonTextStyle={styles.cancelButtonText}
            onPress={() => {
              setSelectedFilter('In Progress');
              dispatch(
                setTutorialDisplayData({
                  displayTutorials: learnTricksActive
                    ? trickTutorials.filter((trick) =>
                        userTutorialsInProgress.find((tutorial) => tutorial.id === trick.id)
                      )
                    : buildTutorials.filter((trick) =>
                        userTutorialsInProgress.find((tutorial) => tutorial.id === trick.id)
                      ),
                })
              );
            }}
          />
        )}
      </View>

      {/* Trick tutorials list view */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={displayTutorials}
          renderItem={trickItems}
          keyExtractor={(item) => item.id}
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
  selectedButton: {
    borderBottomWidth: 5,
    borderBottomColor: colors.secondary500,
  },
  searchContainer: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 10,
  },
  input: {
    backgroundColor: colors.primary400,
    borderRadius: 16,
    fontSize: 16,
    width: '90%',
    elevation: 6,
    color: colors.whiteDefault,
  },
  buttonsContainer: {
    flexShrink: 1,
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
  },
  tutorialItemContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  tutorialItemPressable: {
    flex: 1,
    paddingVertical: 8,
    height: 450,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: colors.secondary800,
  },
  tutorialTitle: {
    fontSize: 20,
    color: colors.whiteDefault,
  },
  descriptionContainer: {
    flexShrink: 1,
    backgroundColor: colors.backDrop,
    width: '100%',
    height: 55,
    padding: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.blackDefault,
  },
  favoriteContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    flex: 0,
    zIndex: 5,
  },
  favoritePressable: {
    position: 'absolute',
    top: 4,
    right: 8,
    width: 40,
    height: 40,
  },
  tutorialLevelContainer: {
    marginLeft: 8,
    backgroundColor: colors.labelGreen,
    alignSelf: 'flex-start',
    borderRadius: 16,
    padding: 2,
  },
  tutorialLevelText: {
    fontSize: 12,
    color: colors.whiteDefault,
  },
  videoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
