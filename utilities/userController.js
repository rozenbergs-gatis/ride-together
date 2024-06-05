import {
  ref,
  set,
  get,
  remove,
  update,
  push,
  child,
  query,
  onValue,
  limitToFirst,
  orderByKey,
} from 'firebase/database';
import { updateProfile } from 'firebase/auth';
import { database } from '../firebase/firebaseConfig';

export async function addUserToDb(user) {
  await set(ref(database, `users/${user.uid}`), {
    username: user.displayName,
    email: user.email,
    profile_picture: null,
  });
}

export async function updateUsername(user, username) {
  await updateProfile(user, { displayName: username });
}

export async function addUsername(username, id) {
  return update(ref(database, `usernames/`), {
    [username]: id,
  });
}

export async function getAllUserTutorialsByType(user, type) {
  return get(ref(database, `users/${user.uid}/my_${type.toLowerCase()}_tutorials/`)).then(
    (snapshot) => snapshot
  );
  // await get(query(ref(database, `users/${user.uid}/my_tutorials/`), orderByChild('tutorial_id'))).then((data) => {
  //         console.log(data);
  //     })
}

export async function getAllUserForumPostsByType(user, type) {
  return get(ref(database, `users/${user.uid}/my_${type.toLowerCase()}_forum_posts/`)).then(
    (snapshot) => snapshot
  );
  // await get(query(ref(database, `users/${user.uid}/my_tutorials/`), orderByChild('tutorial_id'))).then((data) => {
  //         console.log(data);
  //     })
}

export async function getUserUsername(userId) {
  return get(ref(database, `users/${userId}/username`)).then((snapshot) => snapshot.val());
}

export async function deleteUserTutorial(user, type, tutorialId) {
  await remove(ref(database, `users/${user.uid}/my_${type.toLowerCase()}_tutorials/${tutorialId}`));
}

export async function deleteUserForumPost(user, type, forumId) {
  await remove(ref(database, `users/${user.uid}/my_${type.toLowerCase()}_forum_posts/${forumId}`));
}

export async function getAllUserFriendIds(user) {
  return get(ref(database, `users/${user.uid}/my_friends/`)).then((snapshot) => snapshot);
}

export async function getUserById(userId) {
  return get(ref(database, `users/${userId}/`)).then((snapshot) => snapshot);
}

export async function getAllUsernames() {
  return get(ref(database, `usernames/`)).then((snapshot) => snapshot);
}

export async function addUserToPendingList(userId, username) {
  return set(push(ref(database, `users/${userId}/pendingFriends`)), username).then(
    (snapshot) => snapshot
  );
}

export async function addIncomingFriendRequest(toUserId, fromUserId) {
  return set(push(ref(database, `users/${toUserId}/incomingFriendRequests`)), fromUserId).then(
    (snapshot) => snapshot
  );
}

export async function getUserPendingList(userId) {
  return get(ref(database, `users/${userId}/pendingFriends`)).then(
    (snapshot) => snapshot,
    (_) => []
  );
}

export async function acceptIncomingFriendRequest(userId, requestId, friendId, pendingFriendId) {
  const updates = {};
  // delete incoming friend request
  updates[`users/${userId}/incomingFriendRequests/${requestId}`] = null;

  // add new friend to user's friend list
  const newUserFriendKey = push(ref(database, `users/${userId}/my_friends`)).key;
  updates[`users/${userId}/my_friends/${newUserFriendKey}`] = friendId;

  // add user to friend's friend list
  const newFriendKey = push(ref(database, `users/${friendId}/my_friends`)).key;
  updates[`users/${friendId}/my_friends/${newFriendKey}`] = userId;

  // remove user from friend's pending list
  updates[`users/${friendId}/pendingFriends/${pendingFriendId}`] = null;
  return update(ref(database), updates);
}
