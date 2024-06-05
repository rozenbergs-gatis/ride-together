import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import TabButton from '../../components/creatorsSpace/TabButton';
import colors from '../../constants/colors';
import { forumConstants } from '../../constants/types';
import Spinner from '../../components/Spinner';
import {
  setDiscussionPosts,
  setDisplayPosts,
  setMarketPosts,
  setRefreshData,
} from '../../store/forumStates/globalPosts';
import { getAllForumPosts } from '../../utilities/forumController';

function NewsScreen({ navigation }) {
  const [screenLoading, setScreenLoading] = useState(true);
  const [discussionsActive, setDiscussionsActive] = useState(true);
  const [marketActive, setMarketActive] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const discussionPosts = useSelector((state) => state.globalPosts.discussionPosts);
  const marketPosts = useSelector((state) => state.globalPosts.marketPosts);
  const displayPosts = useSelector((state) => state.globalPosts.displayPosts);
  const reloadData = useSelector((state) => state.globalPosts.refreshData);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchForumPosts(type) {
      setDiscussionsActive(true);
      setMarketActive(false);
      await getAllForumPosts(type)
        .then((posts) => {
          if (type === forumConstants.discussions) {
            dispatch(setDiscussionPosts({ discussionPosts: posts }));
            dispatch(setDisplayPosts({ displayPosts: posts }));
          } else {
            dispatch(setMarketPosts({ marketPosts: posts }));
          }
        })
        .catch(() => {
          Alert.alert('Unable to fetch data', 'Please try again later');
        });
      setScreenLoading(false);
      dispatch(setRefreshData({ refreshData: false }));
    }

    fetchForumPosts(forumConstants.discussions);
    fetchForumPosts(forumConstants.market);
  }, [dispatch, reloadData]);

  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const searchDelay = setTimeout(() => {
      if (discussionsActive) {
        if (!discussionPosts?.length) return;

        const filteredData = discussionPosts.filter((post) =>
          post.title.toLowerCase().includes(searchInput.toLowerCase())
        );
        setSearchInput(searchInput);
        dispatch(setDisplayPosts({ displayPosts: filteredData }));
      } else {
        if (!marketPosts?.length) return;

        const filteredData = marketPosts.filter((post) =>
          post.title.toLowerCase().includes(searchInput.toLowerCase())
        );
        setSearchInput(searchInput);
        dispatch(setDisplayPosts({ displayPosts: filteredData }));
      }
    }, 1000);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(searchDelay);
    // eslint-disable-next-line
  }, [dispatch, searchInput]);

  const postItems = (itemData) => {
    if (screenLoading) {
      return <Spinner deps={[]} />;
    }

    return (
      <View
        style={
          itemData.item.media_urls
            ? styles.forumItemContainer
            : { ...styles.forumItemContainer, ...{ height: 230 } }
        }
      >
        {/* Tutorial item title view */}
        <View style={{ marginLeft: 8, flexDirection: 'row' }}>
          <Ionicons name="person-circle" size={36} color={colors.whiteDefault} />
          <View style={{ marginLeft: 8, flexDirection: 'column' }}>
            <Text style={styles.forumPostHeaderText} numberOfLines={1}>
              {itemData.item.created_by}
            </Text>
            <Text style={styles.forumPostHeaderText} numberOfLines={1}>
              {new Date(+itemData.item.timestamp).toDateString()}
            </Text>
          </View>
        </View>

        {/* Forum item Description view */}
        <View
          style={
            itemData.item.media_urls
              ? styles.descriptionContainerWithMedia
              : styles.descriptionContainerWithoutMedia
          }
        >
          <Text style={styles.forumTitle}>{itemData.item.title}</Text>
          <Text style={styles.descriptionText} numberOfLines={2}>
            {itemData.item.description}
          </Text>
        </View>

        {/* Forum post item media preview */}
        {itemData.item.media_urls && (
          <View style={styles.videoContainer}>
            <Swiper>
              {itemData.item.media_urls.map((img) => (
                <Pressable
                  onPress={() => navigation.navigate('FullScreenMediaOverlay', { imageUrl: img })}
                  key={
                    img.match(
                      /https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/ride-together-f8d4e\.appspot\.com\/o\/(?:tutorials|forums)%2F(.*)\.jpeg\?/
                    )[1]
                  }
                >
                  <View style={{ alignItems: 'center' }}>
                    <Image style={styles.imageStyle} source={{ uri: img }} />
                  </View>
                </Pressable>
              ))}
            </Swiper>
          </View>
        )}

        <View style={styles.contentContainer}>
          <View style={styles.buttonsContainer}>
            <TabButton
              buttonTitle="See More"
              onPress={() => {
                console.log('See More pressed!');
              }}
              style={{
                backgroundColor: colors.backDrop,
                borderBottomLeftRadius: 16,
                height: 50,
              }}
              textStyle={{
                color: colors.secondary400,
              }}
              rippleColor={colors.secondary500}
            />
            <TabButton
              buttonTitle="Comment"
              rippleColor={colors.secondary500}
              style={{
                backgroundColor: colors.secondary400,
                borderBottomRightRadius: 16,
                height: 50,
              }}
              onPress={async () => {
                console.log('Comment pressed!');
              }}
            />
          </View>
        </View>
        {/* </Pressable> */}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {/* Top Tab buttons */}
      <View style={styles.buttonsContainer}>
        <TabButton
          buttonTitle="Discussions"
          style={{ backgroundColor: colors.secondary900 }}
          rippleColor={colors.secondary850}
          selectedContainerStyle={discussionsActive && styles.selectedButton}
          onPress={() => {
            setDiscussionsActive(true);
            setMarketActive(false);
            dispatch(setDisplayPosts({ displayPosts: discussionPosts }));
          }}
        />
        <TabButton
          buttonTitle="Market"
          rippleColor={colors.secondary700}
          style={{ backgroundColor: colors.secondary800 }}
          selectedContainerStyle={marketActive && styles.selectedButton}
          onPress={() => {
            setDiscussionsActive(false);
            setMarketActive(true);
            dispatch(setDisplayPosts({ displayPosts: marketPosts }));
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

      {/* Trick tutorials list view */}
      <View style={{ flex: 1 }}>
        <FlatList data={displayPosts} renderItem={postItems} keyExtractor={(item) => item.id} />
      </View>
      {/* <Modal visible={modalVisible} onDismiss={hideModal}> */}
      {/*  <Image style={styles.imageStyle} source={{ uri: pictureUrl }} /> */}
      {/* </Modal> */}
    </View>
  );
}

export default ForumScreen;

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
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
  },
  forumItemContainer: {
    borderRadius: 16,
    height: 450,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: colors.secondary900,
  },
  forumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blackDefault,
  },
  descriptionContainerWithMedia: {
    flexShrink: 1,
    backgroundColor: colors.backDrop,
    width: '100%',
    height: 55,
    padding: 4,
  },
  descriptionContainerWithoutMedia: {
    flex: 1,
    backgroundColor: colors.backDrop,
    width: '100%',
    padding: 4,
  },
  forumPostHeaderText: {
    fontSize: 14,
    color: colors.whiteDefault,
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
  imageStyle: {
    width: '100%',
    height: '100%',
  },
});
