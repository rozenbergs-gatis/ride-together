import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { EvilIcons, FontAwesome5 } from '@expo/vector-icons';
import colors from '../constants/colors';
import { getCurrentUser } from '../utilities/authController';
import PrimaryButton from '../components/PrimaryButton';

function MyProfileScreen() {
  const [user, setUser] = useState(Object);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setUsername(currentUser.displayName);
      setEmail(currentUser.email);
    }

    fetchUser();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <View
        style={{
          flex: 2,
          backgroundColor: colors.primary700,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <EvilIcons name="user" size={250} color="rgba(255, 255, 255, 0.7)" />

        <Pressable>
          <Text style={styles.textButton}>Change picture</Text>
        </Pressable>
      </View>
      <View style={{ flex: 4, alignItems: 'center', justifyContent: 'top-center' }}>
        <View style={styles.inputContainer}>
          <Text style={{ color: 'black', fontSize: 15, marginLeft: 8 }}>username</Text>
          <TextInput
            placeholder="Title"
            placeholderTextColor={colors.placeholderDefault}
            style={styles.input}
            value={username}
            readOnly
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={{ color: 'black', fontSize: 15, marginLeft: 8 }}>email</Text>
          <TextInput
            placeholder="Title"
            placeholderTextColor={colors.placeholderDefault}
            style={styles.input}
            value={email}
            readOnly
          />
        </View>
        <View style={{ width: '60%', alignItems: 'center', justifyContent: 'center' }}>
          <PrimaryButton
            buttonTitle="Change Password"
            style={{ backgroundColor: colors.secondary500 }}
            rippleColor={colors.secondary400}
            outerContainerStyle={{ width: '90%' }}
            onPress={() => {}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default MyProfileScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
  },
  inputContainer: {
    flexShrink: 1,
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    marginTop: 10,
    marginLeft: 12,
    width: '75%',
  },
  input: {
    backgroundColor: colors.whiteDefault,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginVertical: 8,
    fontSize: 16,
    width: '90%',
    color: colors.blackDefault,
    height: 75,
  },
  textButton: {
    color: colors.secondary500,
    paddingTop: 16,
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
