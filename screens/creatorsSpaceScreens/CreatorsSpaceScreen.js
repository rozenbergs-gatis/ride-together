import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../constants/colors';
import TabButton from '../../components/creatorsSpace/TabButton';
import PrimaryButton from '../../components/PrimaryButton';
import { deleteUserTutorial, getAllUserCreatedTutorials } from '../../utilities/userController';
import { getCurrentUser } from '../../utilities/authController';
import { deleteTutorial, getTutorial } from '../../utilities/tutorialController';
import Spinner from '../../components/Spinner';
import { deleteTutorialVideo } from '../../utilities/fileController';
import {
  setRefreshData,
  setTutorialDisplayData,
  setUserBuildTutorials,
  setUserTrickTutorials,
} from '../../store/tutorialStates/userTutorials';

function CreatorsSpaceScreen({ navigation }) {
  const [screenLoading, setScreenLoading] = useState(true);
  const [myTutorialsActive, setMyTutorialsActive] = useState(true);
  const [myForumsActive, setMyForumsActive] = useState(false);
  const [trickTutorialsActive, setTrickTutorialsActive] = useState(true);
  const [buildTutorialsActive, setBuildTutorialsActive] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const userTrickTutorials = useSelector((state) => state.userTutorials.userTrickTutorials);
  const userBuildTutorials = useSelector((state) => state.userTutorials.userBuildTutorials);
  const displayTutorials = useSelector((state) => state.userTutorials.displayTutorials);
  const reloadData = useSelector((state) => state.userTutorials.refreshData);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchTutorials(type) {
      setTrickTutorialsActive(true);
      setBuildTutorialsActive(false);
      const user = await getCurrentUser();
      let userTutorialIds = [];
      await getAllUserCreatedTutorials(user, type)
        .then((userTutorials) => {
          const userTutorialList = userTutorials.val();
          const keys = Object.keys(userTutorialList);
          keys.forEach((key) => {
            userTutorialIds.push({ id: userTutorialList[key].tutorial_id, userTutorialId: key });
          });
        })
        // eslint-disable-next-line no-unused-vars
        .catch((_e) => {
          userTutorialIds = [];
        });
      if (userTutorialIds.length > 0) {
        Promise.all(userTutorialIds.map((tutorialIds) => getTutorial(tutorialIds, type))).then(
          (resp) => {
            if (type === 'trick') {
              dispatch(setUserTrickTutorials({ userTrickTutorials: resp }));
              dispatch(setTutorialDisplayData({ displayTutorials: resp }));
            } else {
              dispatch(setUserBuildTutorials({ userBuildTutorials: resp }));
            }
          }
        );
      }
      setScreenLoading(false);
      dispatch(setRefreshData({ refreshData: false }));
    }

    fetchTutorials('trick');
    fetchTutorials('build');
  }, [dispatch, reloadData]);

  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const searchDelay = setTimeout(() => {
      const filteredData = userTrickTutorials.filter((tutorial) =>
        tutorial.title.toLowerCase().includes(searchInput.toLowerCase())
      );
      setSearchInput(searchInput);
      dispatch(setTutorialDisplayData({ displayTutorials: filteredData }));
    }, 1000);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(searchDelay);
    // eslint-disable-next-line
  }, [dispatch, searchInput]);

  const myTutorials = (itemData) => (
    <View style={styles.tutorialContainer}>
      <Pressable
        style={styles.deleteActionButton}
        onPress={() => {
          Alert.alert(
            'Delete tutorial',
            `Are you sure you want to delete tutorial with name ${itemData.item.title}?`,
            [
              {
                text: 'No',
                onPress: () => {},
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: async () => {
                  await deleteUserTutorial(
                    await getCurrentUser(),
                    itemData.item.type,
                    itemData.item.userTutorialId
                  );
                  await deleteTutorial(itemData.item.type.toLowerCase(), itemData.item.id);
                  await deleteTutorialVideo(itemData.item.video_url);
                  dispatch(setRefreshData({ refreshData: true }));
                  setSearchInput('');
                },
              },
            ]
          );
        }}
      >
        <AntDesign name="closecircle" size={36} color={colors.secondary500} />
      </Pressable>
      <Text style={styles.tutorialText}>{itemData.item.title}</Text>
      <Pressable
        style={styles.editActionButton}
        onPress={() => {
          navigation.navigate('EditTutorial', itemData.item);
        }}
      >
        <FontAwesome5 name="edit" size={36} color={colors.secondary500} />
      </Pressable>
    </View>
  );

  // TODO Implement MyForums page tab
  // eslint-disable-next-line no-unused-vars
  function myForums() {}

  if (screenLoading) {
    return <Spinner deps={[]} />;
  }

  return (
    <View style={styles.root}>
      <View style={styles.buttonsContainer}>
        <TabButton
          buttonTitle="My Tutorials"
          style={{ backgroundColor: colors.secondary900 }}
          rippleColor={colors.secondary850}
          selectedContainerStyle={myTutorialsActive && styles.selectedButton}
          onPress={() => {
            setMyTutorialsActive(true);
            setMyForumsActive(false);
          }}
        />
        <TabButton
          buttonTitle="My Forums"
          rippleColor={colors.secondary700}
          style={{ backgroundColor: colors.secondary800 }}
          selectedContainerStyle={myForumsActive && styles.selectedButton}
          onPress={() => {
            setMyTutorialsActive(false);
            setMyForumsActive(true);
          }}
        />
      </View>
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
      <View style={styles.contentContainer}>
        <View style={styles.buttonsContainer}>
          <TabButton
            buttonTitle="Tricks"
            style={{
              backgroundColor: colors.placeholderDefault,
              borderTopLeftRadius: 16,
              height: 50,
            }}
            rippleColor={colors.secondary500}
            selectedContainerStyle={trickTutorialsActive && styles.selectedTutorialType}
            onPress={() => {
              setTrickTutorialsActive(true);
              setBuildTutorialsActive(false);
              setSearchInput('');
              dispatch(setTutorialDisplayData({ displayTutorials: userTrickTutorials }));
            }}
          />
          <TabButton
            buttonTitle="Builds"
            rippleColor={colors.secondary500}
            style={{
              backgroundColor: colors.placeholderDefault,
              borderTopRightRadius: 16,
              height: 50,
            }}
            selectedContainerStyle={buildTutorialsActive && styles.selectedTutorialType}
            onPress={async () => {
              setTrickTutorialsActive(false);
              setBuildTutorialsActive(true);
              setSearchInput('');
              dispatch(setTutorialDisplayData({ displayTutorials: userBuildTutorials }));
            }}
          />
        </View>
        <View style={styles.tutorialList}>
          <FlatList
            data={displayTutorials}
            renderItem={myTutorials}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
      <View style={styles.addNewTutorial}>
        <PrimaryButton
          buttonTitle="Add New Tutorial"
          style={{ backgroundColor: colors.secondary500 }}
          rippleColor={colors.secondary400}
          onPress={() => {
            navigation.navigate('AddNewTutorial');
          }}
        />
      </View>
    </View>
  );
}

export default CreatorsSpaceScreen;

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
  selectedTutorialType: {
    backgroundColor: colors.secondary500,
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
    width: '75%',
    elevation: 6,
    color: colors.whiteDefault,
  },
  tutorialList: {
    flex: 1,
  },
  tutorialContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '90%',
    height: 75,
    backgroundColor: colors.secondary900,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 24,
    elevation: 8,
  },
  tutorialText: {
    color: colors.whiteDefault,
    fontSize: 16,
  },
  deleteActionButton: {
    marginLeft: 8,
  },
  editActionButton: {
    marginRight: 8,
  },
  addNewTutorial: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 4,
    backgroundColor: colors.backDrop,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 10,
    elevation: 6,
    overflow: 'hidden',
  },
});
