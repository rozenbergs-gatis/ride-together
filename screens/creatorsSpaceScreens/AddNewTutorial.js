import {Alert, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {colors} from "../../constants/colors";
import {useRef, useState} from "react";
import TabButton from "../../components/creatorsSpace/TabButton";
import PrimaryButton from "../../components/PrimaryButton";
import SmallButton from "../../components/SmallButton";
import {launchImageLibraryAsync, MediaTypeOptions} from 'expo-image-picker'
import {Video, ResizeMode} from 'expo-av';
import {AntDesign} from '@expo/vector-icons';
import {uploadTutorialVideo} from "../../utilities/fileController";
import {addBuildTutorial, addTrickTutorial, addTutorialToCurrentUser} from "../../utilities/tutorialController";
import Spinner from "../../components/Spinner";

function AddNewTutorial({navigation}) {
    const [inputTitle, setInputTitle] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const [selectedType, setSelectedType] = useState('Trick');
    const [selectedLevel, setSelectedLevel] = useState('Beginner');
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState({});
    const video = useRef(null);

    async function selectVideo() {
        let result = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Videos,
        })
        const source = result.assets[0];
        setSelectedVideo(source);
    }

    async function saveAndPublish() {
        if (inputTitle !== '' && inputDescription !== '' && selectedVideo) {
            setUploading(true);
            const videoUrl = await uploadTutorialVideo(selectedVideo.uri);
            const data = {
                title: inputTitle,
                type: selectedType,
                description: inputDescription,
                videoUrl: videoUrl
            };
            if (selectedType === 'Trick') {
                data.level = selectedLevel
            }
            const trickUrl = selectedType === 'Trick' ?
                await addTrickTutorial(data) : await addBuildTutorial(data);
            const tutorialId = trickUrl.toString().split('/').pop();
            await addTutorialToCurrentUser(tutorialId, selectedType);
            setUploading(false);
            navigation.navigate('CreatorsSpace');
        }
        else {
            Alert.alert('Missing fields', 'Please try fill out all the fields and add a video!');
        }
    }

    if (uploading) {
        return (<Spinner deps={[uploading]}/>);
    }

    return (
        <View style={styles.root}>
            {/*Cancel button section*/}
            <View style={styles.outerCancelButtonContainer}>
                <Pressable
                    android_ripple={{color: colors.secondary400}}
                    style={styles.innerCancelButtonContainer}
                    onPress={() => {
                        Alert.alert('Are you sure you want exit ?', '', [
                            {
                                text: 'No',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            {text: 'Yes', onPress: () => navigation.navigate('CreatorsSpace')},
                        ]);
                    }}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
            </View>

            {/*Tutorial Title section*/}
            <View style={styles.inputContainer}>
                <Text style={styles.buttonText}>Tutorial Title</Text>
                <TextInput
                    placeholder={'Title'}
                    placeholderTextColor={colors.placeholderDefault}
                    style={styles.input}
                    value={inputTitle}
                    maxLength={50}
                    onChangeText={(enteredValue) => {
                        setInputTitle(enteredValue)
                    }}
                />
            </View>

            {/*Tutorial Type selection section*/}
            <View style={styles.inputContainer}>
                <Text style={styles.buttonText}>Select Type</Text>
                <View style={styles.buttonsContainer}>
                    <SmallButton
                        buttonTitle={'Trick'}
                        rippleColor={colors.whiteDefault}
                        style={
                            selectedType === 'Trick' ? {backgroundColor: colors.secondary500} : {backgroundColor: colors.backDrop}
                        }
                        buttonTextStyle={styles.cancelButtonText}
                        onPress={() => {
                            setSelectedType('Trick')
                        }}
                    />
                    <SmallButton
                        buttonTitle={'Build'}
                        rippleColor={colors.whiteDefault}
                        style={
                            selectedType === 'Build' ? {backgroundColor: colors.secondary500} : {backgroundColor: colors.backDrop}
                        }
                        buttonTextStyle={styles.cancelButtonText}
                        onPress={() => {
                            setSelectedType('Build')
                        }}
                    />
                </View>
            </View>

            {/*Tutorial Level selection section*/}
            {selectedType === 'Trick' && <View style={styles.inputContainer}>
                <Text style={styles.buttonText}>Select Level</Text>
                <View style={styles.buttonsContainer}>
                    <SmallButton
                        buttonTitle={'Beginner'}
                        rippleColor={colors.whiteDefault}
                        style={
                            selectedLevel === 'Beginner' ? {backgroundColor: colors.secondary500} : {backgroundColor: colors.backDrop}
                        }
                        buttonTextStyle={styles.cancelButtonText}
                        onPress={() => {
                            setSelectedLevel('Beginner')
                        }}
                    />
                    <SmallButton
                        buttonTitle={'Intermediate'}
                        rippleColor={colors.whiteDefault}
                        style={
                            selectedLevel === 'Intermediate' ? {backgroundColor: colors.secondary500} : {backgroundColor: colors.backDrop}
                        }
                        buttonTextStyle={styles.cancelButtonText}
                        onPress={() => {
                            setSelectedLevel('Intermediate')
                        }}
                    />
                    <SmallButton
                        buttonTitle={'Expert'}
                        rippleColor={colors.whiteDefault}
                        style={
                            selectedLevel === 'Expert' ? {backgroundColor: colors.secondary500} : {backgroundColor: colors.backDrop}
                        }
                        buttonTextStyle={styles.cancelButtonText}
                        onPress={() => {
                            setSelectedLevel('Expert')
                        }}
                    />
                </View>
            </View>}

            {/*Tutorial description section*/}
            <View style={styles.inputContainer}>
                <Text style={styles.buttonText}>Description</Text>
                <TextInput
                    placeholder={'Description here'}
                    placeholderTextColor={colors.placeholderDefault}
                    style={[styles.input, styles.inputMultiline]}
                    value={inputDescription}
                    multiline={true}
                    maxLength={250}
                    onChangeText={(enteredValue) => {
                        setInputDescription(enteredValue)
                    }}
                />
            </View>

            {/*Tutorial Add Video section*/}
            <View style={styles.addVideoContainer}>
                <PrimaryButton
                    buttonTitle={'Add Video'}
                    style={!!selectedVideo ? {backgroundColor: colors.placeholderDefault} : {backgroundColor: colors.secondary500}}
                    rippleColor={colors.secondary400}
                    outerContainerStyle={{width: '90%'}}
                    onPress={selectVideo}
                    disabled={!!selectedVideo}
                />
                {/*<Video*/}
                {/*    ref={video}*/}
                {/*    style={{width: 150, height: 150}}*/}
                {/*    source={{*/}
                {/*        uri: 'https://firebasestorage.googleapis.com/v0/b/ride-together-f8d4e.appspot.com/o/tutorials%2F420bf8db-615b-4fb0-a921-08b280d4e0b3.mp4?alt=media',*/}
                {/*    }}*/}
                {/*    useNativeControls*/}
                {/*    shouldPlay*/}
                {/*    resizeMode={ResizeMode.COVER}*/}
                {/*    isLooping*/}
                {/*    onPlaybackStatusUpdate={status => setStatus(() => status)}*/}
                {/*/>*/}
                {selectedVideo &&
                    <View style={styles.videoContainer}>
                        <Video
                            ref={video}
                            style={{width: 150, height: 150}}
                            source={{
                                uri: selectedVideo.uri,
                            }}
                            // useNativeControls
                            shouldPlay
                            resizeMode={ResizeMode.COVER}
                            isLooping
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                        />
                        <Pressable style={styles.removeVideoButton}
                                   onPress={() => {
                                       setSelectedVideo(null);
                                   }}>
                            <AntDesign name="closecircle" size={24} color={colors.secondary500}/>
                        </Pressable>
                    </View>
                }
            </View>

            {/*Save tutorial section*/}
            <View style={{flex: 1, justifyContent: 'flex-end',}}>
                <View style={styles.buttonsContainer}>
                    <TabButton
                        buttonTitle={'Save as draft'}
                        style={{backgroundColor: colors.backDrop, borderBottomLeftRadius: 16, height: 60}}
                        textStyle={{color: colors.secondary500}}
                        rippleColor={colors.whiteDefault}
                        selectedContainerStyle={styles.selectedTutorialType}
                        onPress={() => {

                        }}/>
                    <TabButton
                        buttonTitle={'Save & Publish'}
                        rippleColor={colors.secondary400}
                        style={{backgroundColor: colors.secondary500, borderBottomRightRadius: 16, height: 60}}
                        selectedContainerStyle={styles.selectedTutorialType}
                        onPress={saveAndPublish}/>
                </View>
            </View>
        </View>
    );
}

export default AddNewTutorial;

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
        margin: 8
    },
    inputContainer: {
        flexShrink: 1,
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
        marginLeft: 12
    },
    input: {
        backgroundColor: colors.whiteDefault,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 6,
        marginVertical: 8,
        fontSize: 16,
        width: '95%',
        color: colors.blackDefault
    },
    inputMultiline: {
        minHeight: 100,
        maxHeight: 120,
        textAlignVertical: 'top'
    },
    buttonText: {
        fontSize: 20,
        color: colors.whiteDefault,
    },
    buttonsContainer: {
        flexShrink: 1,
        flexDirection: 'row',
        marginTop: 10
    },
    addVideoContainer: {
        flexShrink: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    videoContainer: {
        flexDirection: 'row',
        width: 150,
        height: 150,
        paddingTop: 14
    },
    removeVideoButton: {
        position: 'absolute',
        paddingTop: 14,
        width: 24,
        height: 48
    }
});