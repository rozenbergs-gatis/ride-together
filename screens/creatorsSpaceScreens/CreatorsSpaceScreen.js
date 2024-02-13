import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IconButton, TextInput } from 'react-native-paper';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../constants/colors';
import { forumConstants, mediaConstants, tutorialConstants } from '../../constants/types';
import TabButton from '../../components/creatorsSpace/TabButton';
import PrimaryButton from '../../components/PrimaryButton';
import {
  deleteUserForumPost,
  deleteUserTutorial,
  getAllUserForumPostsByType,
  getAllUserTutorialsByType,
} from '../../utilities/userController';
import { getCurrentUser } from '../../utilities/authController';
import { deleteTutorial, getTutorial } from '../../utilities/tutorialController';
import Spinner from '../../components/Spinner';
import { deleteMedia, uploadMedia } from '../../utilities/fileController';
import {
  setRefreshData,
  setTutorialDisplayData,
  setUserBuildTutorials,
  setUserTrickTutorials,
} from '../../store/tutorialStates/userTutorials';
import {
  setPostsDisplayData,
  setRefreshPostData,
  setUserDiscussionsPosts,
  setUserMarketPosts,
} from '../../store/forumStates/userForumPosts';
import { deleteForumPost, getForumPost } from '../../utilities/forumController';

function CreatorsSpaceScreen({ navigation }) {
  const [screenLoading, setScreenLoading] = useState(true);
  const [myTutorialsActive, setMyTutorialsActive] = useState(true);
  const [trickTutorialsActive, setTrickTutorialsActive] = useState(true);
  const [buildTutorialsActive, setBuildTutorialsActive] = useState(false);
  const [myForumsActive, setMyForumsActive] = useState(false);
  // const [myDiscussionsPostsActive, setMyDiscussionsPostsActive] = useState(!route.params.market);
  // const [myMarketPostsActive, setMyMarketPostsActive] = useState(!!route.params.market);
  const [myDiscussionsPostsActive, setMyDiscussionsPostsActive] = useState(true);
  const [myMarketPostsActive, setMyMarketPostsActive] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const userTrickTutorials = useSelector((state) => state.userTutorials.userTrickTutorials);
  const userBuildTutorials = useSelector((state) => state.userTutorials.userBuildTutorials);
  const displayTutorials = useSelector((state) => state.userTutorials.displayTutorials);
  const reloadData = useSelector((state) => state.userTutorials.refreshData);

  const userDiscussionsPosts = useSelector((state) => state.userForumPosts.userDiscussionsPosts);
  const userMarketPosts = useSelector((state) => state.userForumPosts.userMarketPosts);
  const displayPosts = useSelector((state) => state.userForumPosts.displayPosts);
  const refreshPostData = useSelector((state) => state.userForumPosts.refreshPostData);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchTutorials(type) {
      setTrickTutorialsActive(true);
      setBuildTutorialsActive(false);
      setSearchInput('');
      const user = await getCurrentUser();
      let userTutorialIds = [];
      await getAllUserTutorialsByType(user, type)
        .then((userTutorials) => {
          const userTutorialList = userTutorials.val();
          const keys = Object.keys(userTutorialList);
          keys.forEach((key) => {
            userTutorialIds.push({ id: userTutorialList[key].tutorial_id, userTutorialId: key });
          });
        })
        .catch((_e) => {
          userTutorialIds = [];
        });
      if (userTutorialIds.length > 0) {
        Promise.all(userTutorialIds.map((tutorialIds) => getTutorial(tutorialIds, type))).then(
          (resp) => {
            if (type === tutorialConstants.trick) {
              dispatch(setUserTrickTutorials({ userTrickTutorials: resp }));
              dispatch(setTutorialDisplayData({ displayTutorials: resp }));
            } else {
              dispatch(setUserBuildTutorials({ userBuildTutorials: resp }));
            }
          }
        );
      } else if (userTutorialIds.length === 0) {
        if (type === tutorialConstants.trick) {
          dispatch(setUserTrickTutorials({ userDiscussionsPosts: [] }));
          dispatch(setTutorialDisplayData({ displayPosts: [] }));
        } else {
          dispatch(setUserBuildTutorials({ userMarketPosts: [] }));
        }
      }
      setScreenLoading(false);
      dispatch(setRefreshData({ refreshData: false }));
    }

    fetchTutorials(tutorialConstants.trick);
    fetchTutorials(tutorialConstants.build);
  }, [dispatch, reloadData]);

  useEffect(() => {
    async function fetchForumPosts(type) {
      // setMyDiscussionsPostsActive(true);
      // setMyMarketPostsActive(false);
      setSearchInput('');
      const user = await getCurrentUser();
      let userPostIds = [];
      await getAllUserForumPostsByType(user, type)
        .then((userPosts) => {
          const userPostList = userPosts.val();
          const keys = Object.keys(userPostList);
          keys.forEach((key) => {
            userPostIds.push({ id: userPostList[key].tutorial_id, userForumPostId: key });
          });
        })
        .catch((_e) => {
          userPostIds = [];
        });
      if (userPostIds.length > 0) {
        Promise.all(userPostIds.map((postIds) => getForumPost(postIds, type))).then((resp) => {
          if (type === forumConstants.discussions) {
            dispatch(setUserDiscussionsPosts({ userDiscussionsPosts: resp }));
            if (myDiscussionsPostsActive) dispatch(setPostsDisplayData({ displayPosts: resp }));
          } else {
            dispatch(setUserMarketPosts({ userMarketPosts: resp }));
            if (myMarketPostsActive) dispatch(setPostsDisplayData({ displayPosts: resp }));
          }
        });
      } else if (userPostIds.length === 0) {
        if (type === forumConstants.discussions) {
          dispatch(setUserDiscussionsPosts({ userDiscussionsPosts: [] }));
          dispatch(setPostsDisplayData({ displayPosts: [] }));
        } else {
          dispatch(setUserMarketPosts({ userMarketPosts: [] }));
        }
      }
      setScreenLoading(false);
      dispatch(setRefreshPostData({ refreshPostData: false }));
    }

    fetchForumPosts(forumConstants.discussions);
    fetchForumPosts(forumConstants.market);
  }, [dispatch, myDiscussionsPostsActive, myMarketPostsActive, refreshPostData]);

  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const searchDelay = setTimeout(() => {
      if (myTutorialsActive) {
        const dataToFilter = trickTutorialsActive ? userTrickTutorials : userBuildTutorials;
        if (!dataToFilter?.length) return;

        const filteredData = dataToFilter.filter((tutorial) =>
          tutorial.title.toLowerCase().includes(searchInput.toLowerCase())
        );
        setSearchInput(searchInput);
        dispatch(setTutorialDisplayData({ displayTutorials: filteredData }));
      } else {
        const dataToFilter = myDiscussionsPostsActive ? userDiscussionsPosts : userMarketPosts;
        if (!dataToFilter?.length) return;

        const filteredData = dataToFilter.filter((tutorial) =>
          tutorial.title.toLowerCase().includes(searchInput.toLowerCase())
        );
        setSearchInput(searchInput);
        dispatch(setPostsDisplayData({ displayPosts: filteredData }));
      }
    }, 1000);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(searchDelay);
    // eslint-disable-next-line
  }, [dispatch, searchInput]);

  const myTutorials = (itemData) => (
    <View style={styles.tutorialContainer}>
      <View style={{ flexShrink: 1 }}>
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
                    await deleteMedia(mediaConstants.tutorials, itemData.item.video_url);
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
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={styles.tutorialText}>{itemData.item.title}</Text>
      </View>
      <View style={{ flexShrink: 1 }}>
        <Pressable
          style={styles.editActionButton}
          onPress={() => {
            navigation.navigate('EditTutorial', itemData.item);
          }}
        >
          <FontAwesome5 name="edit" size={36} color={colors.secondary500} />
        </Pressable>
      </View>
    </View>
  );

  // eslint-disable-next-line no-unused-vars
  const myForums = (itemData) => (
    <View style={styles.tutorialContainer}>
      <View style={{ flexShrink: 1 }}>
        <Pressable
          style={styles.deleteActionButton}
          onPress={() => {
            Alert.alert(
              'Delete Forum Post',
              `Are you sure you want to delete post with name ${itemData.item.title}?`,
              [
                {
                  text: 'No',
                  onPress: () => {},
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: async () => {
                    await deleteUserForumPost(
                      await getCurrentUser(),
                      itemData.item.forum_type,
                      itemData.item.userForumPostId
                    );
                    await deleteForumPost(itemData.item.forum_type.toLowerCase(), itemData.item.id);

                    if (itemData.item.media_urls && itemData.item.media_urls?.length) {
                      const promises = [];
                      itemData.item.media_urls.forEach((url) => {
                        const media = deleteMedia(mediaConstants.forums, url);
                        promises.push(media);
                      });
                      await Promise.all(promises);
                    }

                    dispatch(setRefreshPostData({ refreshPostData: true }));
                    setSearchInput('');
                  },
                },
              ]
            );
          }}
        >
          <AntDesign name="closecircle" size={36} color={colors.secondary500} />
        </Pressable>
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={styles.tutorialText}>{itemData.item.title}</Text>
      </View>
      <View style={{ flexShrink: 1 }}>
        <Pressable
          style={styles.editActionButton}
          onPress={() => {
            navigation.navigate('EditForumPost', itemData.item);
          }}
        >
          <FontAwesome5 name="edit" size={36} color={colors.secondary500} />
        </Pressable>
      </View>
    </View>
  );

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
            const activeData = trickTutorialsActive ? userTrickTutorials : userBuildTutorials;
            dispatch(setTutorialDisplayData({ displayTutorials: activeData }));
            setSearchInput('');
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
            const activeData = myDiscussionsPostsActive ? userDiscussionsPosts : userMarketPosts;
            dispatch(setPostsDisplayData({ displayPosts: activeData }));
            setSearchInput('');
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
          right={
            <TextInput.Icon
              icon="close"
              iconColor={colors.secondary500}
              size={36}
              style={styles.icon}
              onPress={() => setSearchInput('')}
            />
          }
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.buttonsContainer}>
          <TabButton
            buttonTitle={myTutorialsActive ? 'Tricks' : 'Discussions'}
            onPress={() => {
              setSearchInput('');
              if (myTutorialsActive) {
                setTrickTutorialsActive(true);
                setBuildTutorialsActive(false);
                dispatch(setTutorialDisplayData({ displayTutorials: userTrickTutorials }));
              } else {
                setMyDiscussionsPostsActive(true);
                setMyMarketPostsActive(false);
                dispatch(setPostsDisplayData({ displayPosts: userDiscussionsPosts }));
              }
            }}
            style={{
              backgroundColor: colors.placeholderDefault,
              borderTopLeftRadius: 16,
              height: 50,
            }}
            rippleColor={colors.secondary500}
            selectedContainerStyle={
              ((myTutorialsActive && trickTutorialsActive) ||
                (myForumsActive && myDiscussionsPostsActive)) &&
              styles.selectedTutorialType
            }
          />
          <TabButton
            buttonTitle={myTutorialsActive ? 'Builds' : 'Market'}
            rippleColor={colors.secondary500}
            style={{
              backgroundColor: colors.placeholderDefault,
              borderTopRightRadius: 16,
              height: 50,
            }}
            selectedContainerStyle={
              ((myTutorialsActive && buildTutorialsActive) ||
                (myForumsActive && myMarketPostsActive)) &&
              styles.selectedTutorialType
            }
            onPress={async () => {
              setSearchInput('');
              if (myTutorialsActive) {
                setTrickTutorialsActive(false);
                setBuildTutorialsActive(true);
                dispatch(setTutorialDisplayData({ displayTutorials: userBuildTutorials }));
              } else {
                setMyDiscussionsPostsActive(false);
                setMyMarketPostsActive(true);
                dispatch(setPostsDisplayData({ displayPosts: userMarketPosts }));
              }
            }}
          />
        </View>
        <View style={styles.tutorialList}>
          <FlatList
            data={myTutorialsActive ? displayTutorials : displayPosts}
            renderItem={myTutorialsActive ? myTutorials : myForums}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
      <View style={styles.addNewTutorial}>
        <PrimaryButton
          buttonTitle={myTutorialsActive ? 'Add New Tutorial' : 'Add New Post'}
          style={{ backgroundColor: colors.secondary500 }}
          rippleColor={colors.secondary400}
          onPress={() => {
            if (myTutorialsActive) {
              navigation.navigate('AddNewTutorial');
            } else {
              navigation.navigate('AddNewForumPost');
            }
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
