import {Alert, FlatList, Pressable, StyleSheet, Text, View} from "react-native";
import {colors} from "../../constants/colors";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import TabButton from "../../components/creatorsSpace/TabButton";
import {TextInput} from "react-native-paper";
import PrimaryButton from "../../components/PrimaryButton";
import {deleteUserTutorial, getAllUserCreatedTutorials} from "../../utilities/userController";
import {getCurrentUser} from "../../utilities/authController";
import {deleteTutorial, getTutorial} from "../../utilities/tutorialController";
import Spinner from "../../components/Spinner";
import {AntDesign, FontAwesome5} from "@expo/vector-icons";
import {deleteTutorialVideo} from "../../utilities/fileController";
import {useDispatch} from "react-redux";

function CreatorsSpaceScreen({navigation}) {
    const [screenLoading, setScreenLoading] = useState(true);
    const [myTutorialsActive, setMyTutorialsActive] = useState(true);
    const [myForumsActive, setMyForumsActive] = useState(false);
    const [tutorialsPublishedActive, setTutorialsPublishedActive] = useState(true);
    const [tutorialsDraftActive, setTutorialsDraftActive] = useState(false);
    const [userTutorials, setUserTutorials] = useState([]);
    const [displayTutorials, setDisplayTutorials] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [deleteTutorialStatus, setDeleteTutorialStatus] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchTutorials() {
            const user = await getCurrentUser();
            let userTutorialIds = [];
            await getAllUserCreatedTutorials(user, 'trick').then((userTutorials) => {
                const userTutorialList = userTutorials.val()
                const keys = Object.keys(userTutorialList);
                keys.forEach((key) => {
                    userTutorialIds.push({id: userTutorialList[key].tutorial_id, userTutorialId: key});
                })
            }).catch(_e => {
                userTutorialIds = []
            })
            if (userTutorialIds.length > 0) {
                Promise.all(
                    userTutorialIds.map(tutorialIds => {
                        return getTutorial(tutorialIds)
                    })
                ).then(resp => {
                    setUserTutorials(resp);
                    setDisplayTutorials(resp);
                });
            }
            setScreenLoading(false);
            setDeleteTutorialStatus(false);
        }

        fetchTutorials();
    }, [deleteTutorialStatus])

    const firstUpdate = useRef(true);
    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        const searchDelay = setTimeout(() => {
            let filteredData = userTutorials.filter((tutorial) => {
                return tutorial.title.toLowerCase().includes(searchInput.toLowerCase());
            })
            setSearchInput(searchInput);
            setDisplayTutorials(filteredData);
        }, 1000);

        return () => clearTimeout(searchDelay);

    }, [searchInput])

    function myTutorials(itemData) {
        return (
            <View style={styles.tutorialContainer}>
                <Pressable
                    style={styles.deleteActionButton}
                    onPress={() => {
                        Alert.alert('Delete tutorial', `Are you sure you want to delete tutorial with name ${itemData.item.title}?`, [
                            {
                                text: 'No',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            {text: 'Yes', onPress: async () => {
                                await deleteUserTutorial(await getCurrentUser(), itemData.item.type, itemData.item.userTutorialId);
                                await deleteTutorial(itemData.item.type.toLowerCase(), itemData.item.id);
                                await deleteTutorialVideo(itemData.item.video_url);
                                setDeleteTutorialStatus(true);
                                setSearchInput('');
                            }},
                        ]);
                    }}>
                    <AntDesign name="closecircle" size={36} color={colors.secondary500}/>
                </Pressable>
                <Text style={styles.tutorialText}>{itemData.item.title}</Text>
                <Pressable
                    style={styles.editActionButton}
                    onPress={() => {
                    }}>
                    <FontAwesome5 name="edit" size={36} color={colors.secondary500}/>
                </Pressable>
            </View>
        );
    }

    function myForums() {

    }

    if (screenLoading) {
        return <Spinner deps={[]}/>
    }

    return (
        <View style={styles.root}>
            <View style={styles.buttonsContainer}>
                <TabButton
                    buttonTitle={'My Tutorials'}
                    style={{backgroundColor: colors.secondary900}}
                    rippleColor={colors.secondary850}
                    selectedContainerStyle={myTutorialsActive && styles.selectedButton}
                    onPress={() => {
                        setMyTutorialsActive(true);
                        setMyForumsActive(false);
                    }}/>
                <TabButton
                    buttonTitle={'My Forums'}
                    rippleColor={colors.secondary700}
                    style={{backgroundColor: colors.secondary800}}
                    selectedContainerStyle={myForumsActive && styles.selectedButton}
                    onPress={() => {
                        setMyTutorialsActive(false);
                        setMyForumsActive(true);
                    }}/>
            </View>
            <View style={styles.searchContainer}>
                <TextInput placeholder={'Search'}
                           placeholderTextColor={colors.placeholderDefault}
                           style={styles.input}
                           textColor={colors.whiteDefault}
                           underlineColor={'transparent'}
                           activeUnderlineColor={'transparent'}
                           autoCapitalize={'none'}
                           value={searchInput}
                           onChangeText={(enteredValue) => {setSearchInput(enteredValue)}}
                           theme={{roundness: 16}}
                           left={<TextInput.Icon
                               icon={'magnify'}
                               iconColor={colors.secondary500}
                               size={36}
                               style={styles.icon}
                           />}
                />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.buttonsContainer}>
                    <TabButton
                        buttonTitle={'Published'}
                        style={{backgroundColor: colors.placeholderDefault, borderTopLeftRadius: 16, height: 50}}
                        rippleColor={colors.secondary500}
                        selectedContainerStyle={tutorialsPublishedActive && styles.selectedTutorialType}
                        onPress={() => {
                            setTutorialsPublishedActive(true);
                            setTutorialsDraftActive(false);
                        }}/>
                    <TabButton
                        buttonTitle={'Drafts'}
                        rippleColor={colors.secondary500}
                        style={{backgroundColor: colors.placeholderDefault, borderTopRightRadius: 16, height: 50}}
                        selectedContainerStyle={tutorialsDraftActive && styles.selectedTutorialType}
                        onPress={async () => {
                            setTutorialsPublishedActive(false);
                            setTutorialsDraftActive(true);
                        }}/>
                </View>
                <View style={styles.tutorialList}>
                    <FlatList
                        data={displayTutorials}
                        renderItem={myTutorials}
                        keyExtractor={(item) => item.id}/>
                </View>
            </View>
            <View style={styles.addNewTutorial}>
                <PrimaryButton
                    buttonTitle={'Add New Tutorial'}
                    style={{backgroundColor: colors.secondary500}}
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
        marginBottom: 10
    },
    selectedButton: {
        borderBottomWidth: 5,
        borderBottomColor: colors.secondary500
    },
    selectedTutorialType: {
        backgroundColor: colors.secondary500
    },
    searchContainer: {
        flexShrink: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        margin: 10
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
        elevation: 8
    },
    tutorialText: {
      color: colors.whiteDefault,
      fontSize: 16
    },
    deleteActionButton: {
        marginLeft: 8
    },
    editActionButton: {
        marginRight: 8
    },
    addNewTutorial: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
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
