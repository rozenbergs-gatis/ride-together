import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { onValue, ref } from 'firebase/database';
import colors from '../../constants/colors';
import Spinner from '../../components/Spinner';
import {
  acceptIncomingFriendRequest,
  getAllUserFriendIds,
  getUserById,
} from '../../utilities/userController';
import { getCurrentUser } from '../../utilities/authController';
import PrimaryButton from '../../components/PrimaryButton';
import { database } from '../../firebase/firebaseConfig';
import SmallButton from '../../components/SmallButton';

function MyFriendsScreen({ navigation }) {
  const [searchInput, setSearchInput] = useState('');
  const [screenLoading, setScreenLoading] = useState(true);
  const [friendsList, setFriendsList] = useState([]);
  const [incomingFriendRequests, setIncomingFriendRequests] = useState([]);
  const [snapShot, setSnapshot] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Friends');

  useEffect(() => {
    async function fetchFriends() {
      const user = await getCurrentUser();
      const userFriends = await getAllUserFriendIds(user);
      // TODO get all user friends
    }

    // fetchFriends();
  }, []);

  useEffect(() => {
    async function unsubscribe() {
      const user = await getCurrentUser();
      const refIncomingFriends = ref(database, `users/${user.uid}/incomingFriendRequests`);
      onValue(refIncomingFriends, (ss) => {
        const data = ss.val();
        setSnapshot(data);
      });
    }
    unsubscribe();
  }, []);

  useEffect(() => {
    if (snapShot === null || snapShot === undefined) {
      console.log('setting messages the first time');
      if (snapShot !== null && snapShot !== undefined) {
        setIncomingFriendRequests(snapShot.docs);
      }
    } else {
      console.log('updating messages');
      console.log(snapShot);
      setIncomingFriendRequests(Object.values(snapShot));
    }
  }, [snapShot]);

  const friendsItems = (itemData) => {
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
        {/* </Pressable> */}
      </View>
    );
  };

  const friendRequests = async (itemData) => {
    console.log(itemData);
    // if (screenLoading) {
    //   return <Spinner deps={[]} />;
    // }
    const friend = (await getUserById(itemData)).val();
    return (
      <View style={styles.friendContainer}>
        <View
          style={{
            alignItems: 'flex-start',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            flex: 5,
          }}
        >
          <Text style={styles.friendText}>{friend.username}</Text>
        </View>

        <View
          style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            flex: 1,
          }}
        >
          <Pressable
            style={styles.actionButton}
            onPress={async () => {
              const user = await getCurrentUser();
              await acceptIncomingFriendRequest(user.uid, itemData.item, null);
            }}
          >
            <AntDesign name="check" size={24} color="black" />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={async () => {}}>
            <AntDesign name="close" size={24} color="black" />
          </Pressable>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.root}>
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
          buttonTitle="Friends"
          rippleColor={colors.whiteDefault}
          style={
            selectedTab === 'Friends'
              ? { backgroundColor: colors.secondary500, height: 40 }
              : { backgroundColor: colors.backDrop, height: 40 }
          }
          outerContainerStyle={{ width: '25%', height: 40 }}
          buttonTextStyle={styles.cancelButtonText}
          onPress={() => {
            setSelectedTab('Friends');
          }}
        />
        <SmallButton
          buttonTitle="Pending friends"
          rippleColor={colors.whiteDefault}
          style={
            selectedTab === 'Pending friends'
              ? { backgroundColor: colors.secondary500, height: 40 }
              : { backgroundColor: colors.backDrop, height: 40 }
          }
          outerContainerStyle={{ height: 40 }}
          buttonTextStyle={styles.cancelButtonText}
          onPress={() => {
            setSelectedTab('Pending friends');
          }}
        />
      </View>

      {/* Trick tutorials list view */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={selectedTab === 'Friends' ? friendsList : incomingFriendRequests}
          renderItem={selectedTab === 'Friends' ? friendsItems : friendRequests}
          keyExtractor={(item) =>
            selectedTab === 'Friends' ? friendsList[item] : incomingFriendRequests[item]
          }
          contentContainerStyle={{ alignItems: 'center' }}
        />
      </View>

      {/* Add New Friend button */}
      <View style={styles.addNewTutorial}>
        <PrimaryButton
          buttonTitle="Add New Friend"
          style={{ backgroundColor: colors.secondary500 }}
          rippleColor={colors.secondary400}
          onPress={() => navigation.navigate('AddNewFriend')}
        />
      </View>
    </SafeAreaView>
  );
}

export default MyFriendsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
  },
  friendContainer: {
    width: 300,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary800,
    marginBottom: 8,
    paddingLeft: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  friendText: {
    fontSize: 16,
    color: colors.whiteDefault,
    marginLeft: 4,
  },
  pressableContainer: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  info: {
    flexDirection: 'column',
    width: '100%',
  },
  friendInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  input: {
    backgroundColor: colors.primary400,
    borderRadius: 16,
    fontSize: 16,
    width: '90%',
    elevation: 6,
    color: colors.whiteDefault,
  },
  addNewTutorial: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  modalView: {
    // width: '80%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  searchContainer: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 10,
  },
  buttonsContainer: {
    flexShrink: 1,
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
  },
  actionButton: {
    marginLeft: 8,
    marginRight: 8,
  },
});
