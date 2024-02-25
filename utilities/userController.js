import { ref, set, get, remove, update } from 'firebase/database';
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
  return get(ref(database, `users/${userId}/username`)).then((snapshot) => {
    console.log(snapshot.val());
    return snapshot.val();
  });
}

export async function deleteUserTutorial(user, type, tutorialId) {
  await remove(ref(database, `users/${user.uid}/my_${type.toLowerCase()}_tutorials/${tutorialId}`));
}

export async function deleteUserForumPost(user, type, forumId) {
  await remove(ref(database, `users/${user.uid}/my_${type.toLowerCase()}_forum_posts/${forumId}`));
}
