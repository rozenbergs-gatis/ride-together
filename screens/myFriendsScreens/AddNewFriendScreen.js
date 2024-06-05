import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import colors from '../../constants/colors';
import {
  addIncomingFriendRequest,
  addUserToPendingList,
  getAllUsernames,
  getUserPendingList,
} from '../../utilities/userController';
import Spinner from '../../components/Spinner';
import { getCurrentUser } from '../../utilities/authController';

function AddNewFriendScreen() {
  const [searchInput, setSearchInput] = useState('');
  const [allUsernames, setAllUsernames] = useState({});
  const [filteredUsernames, setFilteredUsernames] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);

  useEffect(() => {
    async function fetchUsernames() {
      const usernames = (await getAllUsernames()).val();
      const user = await getCurrentUser();
      let pendingFriends;
      try {
        pendingFriends = await getUserPendingList(user.uid);
        pendingFriends = Object.values(pendingFriends.val());
        setAddedUsers((users) => [...users, ...pendingFriends]);
      } catch (e) {
        pendingFriends = [];
      }
      console.log(pendingFriends);
      delete usernames[user.displayName];
      setAllUsernames(usernames);
    }

    fetchUsernames();
  }, []);

  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const searchDelay = setTimeout(async () => {
      if (searchInput === '') {
        setFilteredUsernames([]);
      } else {
        setFilteredUsernames(
          Object.keys(allUsernames).filter((username) => username.startsWith(searchInput))
        );
      }
    }, 1000);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(searchDelay);
    // eslint-disable-next-line
  }, [searchInput]);

  const searchUsers = (itemData) => (
    <View style={styles.userContainer}>
      <Text style={styles.textStyle}>{itemData.item}</Text>
      <View style={{ flexShrink: 1, marginRight: 12 }}>
        <Pressable
          style={styles.editActionButton}
          onPress={async () => {
            if (!addedUsers.includes(itemData.item)) {
              const user = await getCurrentUser();
              setAddedUsers([...addedUsers, itemData.item]);
              await addUserToPendingList(user.uid, itemData.item);
              await addIncomingFriendRequest(allUsernames[itemData.item], user.uid);
            }
          }}
        >
          {addedUsers.includes(itemData.item) ? (
            <Feather name="user-check" size={32} color={colors.secondary500} />
          ) : (
            <AntDesign name="adduser" size={36} color={colors.secondary500} />
          )}
        </Pressable>
      </View>
    </View>
  );
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
          onChangeText={setSearchInput}
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
      <View style={{ flex: 1, alignContent: 'center' }}>
        <FlatList
          data={filteredUsernames}
          renderItem={searchUsers}
          keyExtractor={(item) => item}
          contentContainerStyle={{ alignItems: 'center' }}
        />
      </View>
    </SafeAreaView>
  );
}

export default AddNewFriendScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
  },
  searchContainer: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 10,
  },
  userContainer: {
    width: 300,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.placeholderDefault,
    marginBottom: 8,
    marginLeft: 10,
    marginRight: 8,
    paddingLeft: 8,
  },
  input: {
    backgroundColor: colors.primary400,
    borderRadius: 16,
    fontSize: 16,
    width: '90%',
    elevation: 6,
    color: colors.whiteDefault,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 8,
  },
});
