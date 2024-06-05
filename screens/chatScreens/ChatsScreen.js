import { StyleSheet, View, Text, FlatList, Pressable, SafeAreaView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as chats from '../../data/chats.json';
import colors from '../../constants/colors';

function ChatsScreen() {
  // const navigation = useNavigation();
  console.log(chats.default.friends);
  const friendsList = (itemData) => (
    <View style={styles.friendContainer}>
      <Pressable
        android_ripple={{ color: colors.secondary700 }}
        style={styles.pressableContainer}
        onPress={() => {
          // navigation.navigate('SkateparkDetails', { skateparkId: itemData.item.skatepark_id });
          console.log('Pressed on Friend!');
        }}
      >
        {/* <View style={styles.friendContainer}> */}
        {/*  <Text style={styles.friendContainer}>{itemData.item.friendId}</Text> */}
        {/* </View> */}
        <View>
          <Ionicons name="person-circle" size={48} color={colors.whiteDefault} />
        </View>
        <View style={styles.info}>
          <View style={styles.friendInfo}>
            <View style={{ flex: 3, justifyContent: 'flex-start' }}>
              <Text>Username goes here</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <Text>Date</Text>
            </View>
          </View>
          <Text>Last Message goes here and it can be loooooong</Text>
        </View>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={chats.default.friends}
        renderItem={friendsList}
        keyExtractor={(item) => item.chatRoomId}
      />
    </SafeAreaView>
  );
}

export default ChatsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
  },
  friendContainer: {
    width: '100%',
    height: 100,
    backgroundColor: colors.placeholderDefault,
    marginBottom: 8,
    paddingLeft: 8,
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
});
