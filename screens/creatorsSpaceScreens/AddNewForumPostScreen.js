import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { ResizeMode, Video } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';
import colors from '../../constants/colors';
import TabButton from '../../components/creatorsSpace/TabButton';
import PrimaryButton from '../../components/PrimaryButton';
import SmallButton from '../../components/SmallButton';
import { deleteMedia, uploadMedia } from '../../utilities/fileController';
import {
  addBuildTutorial,
  addTrickTutorial,
  addTutorialToCurrentUser,
  updateTutorial,
} from '../../utilities/tutorialController';
import Spinner from '../../components/Spinner';
import { setRefreshData, setTutorialDisplayData } from '../../store/tutorialStates/userTutorials';
import { getCurrentUser } from '../../utilities/authController';
import { mediaConstants } from '../../constants/types';
import { addDiscussionsPost, addForumPostToCurrentUser } from '../../utilities/forumController';
import { setRefreshPostData } from '../../store/forumStates/userForumPosts';

function AddNewForumPostScreen({ navigation, route }) {
  const [inputTitle, setInputTitle] = useState('');
  const [inputPrice, setInputPrice] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [selectedForumType, setSelectedForumType] = useState('Discussions');
  const [selectedType, setSelectedType] = useState('Sell');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [snackBarMessage, setSnackBarMessage] = useState('Error, something went wrong!');
  const [uploading, setUploading] = useState(false);
  const [_playBackStatus, setPlayBackStatus] = useState({});
  const [showSnackbarMessage, setShowSnackbarMessage] = useState(false);
  const video = useRef(null);
  const dispatch = useDispatch();
  const tutorialData = route.params;

  useFocusEffect(
    useCallback(() => {
      if (tutorialData) {
        setInputTitle(tutorialData.title);
        setSelectedForumType(tutorialData.type);
        if (tutorialData.level) setSelectedType(tutorialData.level);
        setInputDescription(tutorialData.description);
        setSelectedMedia(tutorialData.media_urls);
      } else {
        setInputTitle('');
        setSelectedForumType('Discussions');
        setSelectedType('Sell');
        setInputDescription('');
        setSelectedMedia([]);
        setInputPrice('');
      }
    }, [tutorialData])
  );

  function millisToMinutesAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return parseInt(seconds, 10) === 60
      ? `${minutes + 1}:00`
      : `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  const selectMedia = async () => {
    launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: MediaTypeOptions.All,
    })
      .then((result) => {
        const source = [...selectedMedia, ...result.assets];

        if (source.length > 5) {
          setSnackBarMessage('Maximum of 5 files can be uploaded!');
          throw Error();
        }

        setSelectedMedia(source);
      })
      .catch((error) => {
        if (error instanceof TypeError) setSnackBarMessage('No files selected!');

        if (selectedMedia.length === 0) {
          setShowSnackbarMessage(true);
        }
      });
  };

  const displayMedia = (itemData) => {
    console.log(itemData.item.uri);
    return (
      <View style={{ margin: 2, height: 100, width: 100 }}>
        <Image
          style={{
            width: 100,
            height: 100,
            borderColor: colors.placeholderDefault,
            borderWidth: 2,
            borderRadius: 16,
          }}
          source={{ uri: itemData.item.uri }}
        />
        <Pressable
          style={styles.removeVideoButton}
          onPress={() => {
            setSelectedMedia(
              selectedMedia.filter((item) => item.assetId !== itemData.item.assetId)
            );
          }}
        >
          <AntDesign name="closecircle" size={24} color={colors.secondary500} />
        </Pressable>
        {itemData.item.duration && (
          <View style={{ position: 'absolute', bottom: 2, right: 4 }}>
            <Text style={{ color: colors.whiteDefault }}>
              {millisToMinutesAndSeconds(itemData.item.duration)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const saveAndPublish = async () => {
    if (inputTitle !== '' && inputDescription !== '' && selectedMedia) {
      setUploading(true);

      const promises = [];
      const urls = [];
      selectedMedia.forEach((file) => {
        const videoUrl = uploadMedia(mediaConstants.forums, file.uri, {
          customMetadata: { duration: file.duration },
        }).then((result) => urls.push(result));
        promises.push(videoUrl);
      });

      await Promise.all(promises);
      console.log(promises);
      console.log(urls);

      const data = {
        createdBy: (await getCurrentUser()).uid,
        title: inputTitle,
        description: inputDescription,
        mediaUrls: urls,
        forumType: selectedForumType,
      };
      if (selectedForumType === 'Market') {
        data.type = selectedType;
        data.price = inputPrice;
      }
      const forumUrl =
        selectedForumType === 'Discussions'
          ? await addDiscussionsPost(data)
          : await addBuildTutorial(data);
      const forumId = forumUrl.toString().split('/').pop();
      await addForumPostToCurrentUser(forumId, selectedForumType);
      setUploading(false);
      dispatch(setRefreshPostData({ refreshPostData: true }));
      navigation.navigate('CreatorsSpace');
    } else {
      Alert.alert('Missing fields', 'Please fill out all the fields and add a video!');
    }
  };

  // async function saveChanges() {
  //   if (inputTitle !== '' && inputDescription !== '' && selectedVideo) {
  //     setUploading(true);
  //     let videoUrl = selectedVideo.uri;
  //     if (tutorialData.video_url !== selectedVideo.uri) {
  //       await deleteMedia(mediaConstants.tutorials, tutorialData.video_url);
  //       videoUrl = await uploadMedia(mediaConstants.tutorials, selectedVideo.uri);
  //     }
  //     tutorialData.title = inputTitle;
  //     tutorialData.description = inputDescription;
  //     if (tutorialData.level) tutorialData.level = selectedLevel;
  //     tutorialData.video_url = videoUrl;
  //     const tutorialId = tutorialData.id;
  //     ['id', 'userTutorialId'].forEach((e) => delete tutorialData[e]);
  //     await updateTutorial(selectedType, tutorialId, tutorialData);
  //
  //     setUploading(false);
  //     dispatch(setTutorialDisplayData({ displayTutorials: [] }));
  //     dispatch(setRefreshData({ refreshData: true }));
  //     navigation.navigate('CreatorsSpace');
  //   } else {
  //     Alert.alert('Missing fields', 'Please try fill out all the fields and add a video!');
  //   }
  // }

  if (uploading) {
    return <Spinner deps={[uploading]} />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView nestedScrollEnabled contentContainerStyle={{ flexGrow: 1 }}>
        {/* Cancel button section */}
        <View style={styles.outerCancelButtonContainer}>
          <Pressable
            android_ripple={{ color: colors.secondary400 }}
            style={styles.innerCancelButtonContainer}
            onPress={() => {
              Alert.alert('Are you sure you want exit ?', '', [
                {
                  text: 'No',
                  onPress: () => {},
                  style: 'cancel',
                },
                { text: 'Yes', onPress: () => navigation.navigate('CreatorsSpace') },
              ]);
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>

        {/* Forum Post Title section */}
        <View style={styles.inputContainer}>
          <Text style={styles.buttonText}>Title</Text>
          <TextInput
            placeholder="Title"
            placeholderTextColor={colors.placeholderDefault}
            style={styles.input}
            value={inputTitle}
            maxLength={50}
            onChangeText={(enteredValue) => {
              setInputTitle(enteredValue);
            }}
          />
        </View>

        {/* Forum Post Type selection section */}
        {!tutorialData && (
          <View style={styles.inputContainer}>
            <Text style={styles.buttonText}>Select Forum Section</Text>
            <View style={styles.buttonsContainer}>
              <SmallButton
                buttonTitle="Discussions"
                rippleColor={colors.whiteDefault}
                style={
                  selectedForumType === 'Discussions'
                    ? { backgroundColor: colors.secondary500 }
                    : { backgroundColor: colors.backDrop }
                }
                buttonTextStyle={styles.cancelButtonText}
                onPress={() => {
                  setSelectedForumType('Discussions');
                }}
              />
              <SmallButton
                buttonTitle="Market"
                rippleColor={colors.whiteDefault}
                style={
                  selectedForumType === 'Market'
                    ? { backgroundColor: colors.secondary500 }
                    : { backgroundColor: colors.backDrop }
                }
                buttonTextStyle={styles.cancelButtonText}
                onPress={() => {
                  setSelectedForumType('Market');
                }}
              />
            </View>
          </View>
        )}

        {/* Tutorial Level selection section */}
        {selectedForumType === 'Market' && (
          <View style={styles.inputContainer}>
            <Text style={styles.buttonText}>Select Type</Text>
            <View style={styles.buttonsContainer}>
              <SmallButton
                buttonTitle="Sell"
                rippleColor={colors.whiteDefault}
                style={
                  selectedType === 'Sell'
                    ? { backgroundColor: colors.secondary500 }
                    : { backgroundColor: colors.backDrop }
                }
                buttonTextStyle={styles.cancelButtonText}
                onPress={() => {
                  setSelectedType('Sell');
                }}
              />
              <SmallButton
                buttonTitle="Buy"
                rippleColor={colors.whiteDefault}
                style={
                  selectedType === 'Buy'
                    ? { backgroundColor: colors.secondary500 }
                    : { backgroundColor: colors.backDrop }
                }
                buttonTextStyle={styles.cancelButtonText}
                onPress={() => {
                  setSelectedType('Buy');
                }}
              />
            </View>
          </View>
        )}

        {/* Market Post Price section */}
        {selectedForumType === 'Market' && (
          <View style={styles.inputContainer}>
            <Text style={styles.buttonText}>Price</Text>
            <TextInput
              placeholder="Price"
              placeholderTextColor={colors.placeholderDefault}
              style={styles.input}
              value={inputPrice}
              maxLength={50}
              onChangeText={(enteredValue) => {
                setInputPrice(enteredValue);
              }}
            />
          </View>
        )}

        {/* Tutorial description section */}
        <View style={styles.inputContainer}>
          <Text style={styles.buttonText}>Description</Text>
          <TextInput
            placeholder="Description here"
            placeholderTextColor={colors.placeholderDefault}
            style={[styles.input, styles.inputMultiline]}
            value={inputDescription}
            multiline
            maxLength={1000}
            onChangeText={(enteredValue) => {
              setInputDescription(enteredValue);
            }}
          />
        </View>

        {/* Tutorial Add Video section */}
        <View style={styles.addVideoContainer}>
          <PrimaryButton
            buttonTitle={tutorialData ? 'Change Video' : 'Add Files'}
            style={
              !tutorialData && selectedMedia.length >= 5
                ? { backgroundColor: colors.placeholderDefault }
                : { backgroundColor: colors.secondary500 }
            }
            rippleColor={colors.secondary400}
            outerContainerStyle={{ width: '90%' }}
            onPress={selectMedia}
            disabled={!tutorialData && selectedMedia.length >= 5}
          />
          <FlatList
            data={selectedMedia}
            renderItem={displayMedia}
            scrollEnabled={false}
            numColumns={3}
            keyExtractor={(item) => item.assetId}
          />
        </View>

        {/* Informative message if the end user does not select a video */}
        <View style={{ flex: 1 }}>
          <Snackbar
            visible={showSnackbarMessage}
            onDismiss={() => {
              setShowSnackbarMessage(false);
            }}
            wrapperStyle={{ borderRadius: 16, elevation: 6 }}
            duration={3000}
          >
            {snackBarMessage}
          </Snackbar>
        </View>

        {/* Save tutorial section */}
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={styles.buttonsContainer}>
            <TabButton
              buttonTitle={tutorialData ? 'Save Changes' : 'Save & Publish'}
              rippleColor={colors.secondary400}
              style={{
                backgroundColor: colors.secondary500,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                height: 60,
              }}
              selectedContainerStyle={styles.selectedTutorialType}
              // onPress={tutorialData ? saveChanges : saveAndPublish}
              onPress={saveAndPublish}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AddNewForumPostScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.secondary900,
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  outerCancelButtonContainer: {
    flexShrink: 1,
    alignItems: 'flex-end',
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    overflow: 'hidden',
  },
  innerCancelButtonContainer: {
    backgroundColor: colors.secondary500,
    elevation: 6,
    borderBottomLeftRadius: 24,
  },
  cancelButtonText: {
    fontSize: 15,
    color: colors.whiteDefault,
    margin: 8,
  },
  inputContainer: {
    flexShrink: 1,
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    marginLeft: 12,
  },
  input: {
    backgroundColor: colors.whiteDefault,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginVertical: 8,
    fontSize: 16,
    width: '95%',
    color: colors.blackDefault,
  },
  inputMultiline: {
    minHeight: 100,
    maxHeight: 120,
    textAlignVertical: 'top',
  },
  buttonText: {
    fontSize: 20,
    color: colors.whiteDefault,
  },
  buttonsContainer: {
    flexShrink: 1,
    flexDirection: 'row',
    marginTop: 10,
  },
  addVideoContainer: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  videoContainer: {
    flexDirection: 'row',
    width: 150,
    height: 150,
    paddingTop: 14,
  },
  removeVideoButton: {
    position: 'absolute',
    paddingTop: 14,
    width: 24,
    height: 48,
  },
});
