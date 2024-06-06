import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import TabButton from '../../components/creatorsSpace/TabButton';
import colors from '../../constants/colors';
import { getAllForumPosts } from '../../utilities/forumController';
import SmallButton from '../../components/SmallButton';
import { setTutorialDisplayData } from '../../store/tutorialStates/globalTutorials';
import * as news from '../../data/news.json';

function NewsScreen({ navigation }) {
  const [contestsActive, setContestsActive] = useState(false);
  const [partsActive, setpartsActiveActive] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const newsItems = (itemData) => (
    <View
      style={
        itemData.item.media_urls
          ? styles.forumItemContainer
          : { ...styles.forumItemContainer, ...{ height: 230 } }
      }
    >
      {/* Tutorial item title view */}
      <View
        style={{
          marginLeft: 8,
          flexDirection: 'row',
          height: 75,
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 5 }}>
          <Text style={styles.newsHeaderText} numberOfLines={1}>
            {itemData.item.title}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.timestampHeaderText}>
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
        <Text style={styles.descriptionText}>{itemData.item.content}</Text>
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
  return (
    <View style={styles.root}>
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
          onPress={() => {}}
        />
        <SmallButton
          buttonTitle="Contests"
          rippleColor={colors.whiteDefault}
          style={
            selectedFilter === 'Favorite'
              ? { backgroundColor: colors.secondary500, height: 40 }
              : { backgroundColor: colors.backDrop, height: 40 }
          }
          outerContainerStyle={{ height: 40 }}
          buttonTextStyle={styles.cancelButtonText}
          onPress={() => {}}
        />

        <SmallButton
          buttonTitle="Parts"
          rippleColor={colors.whiteDefault}
          style={
            selectedFilter === 'In Progress'
              ? { backgroundColor: colors.secondary500, height: 40 }
              : { backgroundColor: colors.backDrop, height: 40 }
          }
          outerContainerStyle={{ height: 40 }}
          buttonTextStyle={styles.cancelButtonText}
          onPress={() => {}}
        />
      </View>

      {/* Trick tutorials list view */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={news.default}
          renderItem={newsItems}
          keyExtractor={(item) => item.news_id}
        />
      </View>
    </View>
  );
}

export default NewsScreen;

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
  newsHeaderText: {
    fontSize: 22,
    color: colors.whiteDefault,
  },
  timestampHeaderText: {
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
