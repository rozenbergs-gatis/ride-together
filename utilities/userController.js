import { ref, set, get, remove } from 'firebase/database';
import { database } from '../firebase/firebaseConfig';

export async function addUserToDb(user) {
  await set(ref(database, `users/${user.uid}`), {
    username: 'test user',
    email: user.email,
    profile_picture: null,
  });
}

export async function getAllUserCreatedTutorials(user, type) {
  return get(ref(database, `users/${user.uid}/my_${type.toLowerCase()}_tutorials/`)).then(
    (snapshot) => snapshot
  );
  // await get(query(ref(database, `users/${user.uid}/my_tutorials/`), orderByChild('tutorial_id'))).then((data) => {
  //         console.log(data);
  //     })
}

export async function deleteUserTutorial(user, type, tutorialId) {
  await remove(ref(database, `users/${user.uid}/my_${type.toLowerCase()}_tutorials/${tutorialId}`));
}
