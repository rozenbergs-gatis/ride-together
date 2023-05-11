import { get, push, ref, remove, update } from 'firebase/database';
import { database } from '../firebase/firebaseConfig';
import { getCurrentUser } from './authController';

export async function getTutorial(ids, type) {
  return get(ref(database, `${type}_tutorials/${ids.id}`)).then((snapshot) => ({
    ...snapshot.val(),
    ...ids,
  }));
}

export async function getAllTutorials(type) {
  return get(ref(database, `${type.toLowerCase()}_tutorials/`)).then((snapshot) =>
    Object.entries(snapshot.val()).map(([id, obj]) => ({ id, ...obj }))
  );
}

export async function addTrickTutorial(data) {
  const user = await getCurrentUser();
  if (user) {
    return push(ref(database, 'trick_tutorials/'), {
      created_by: data.createdBy,
      title: data.title,
      timestamp: Date.now(),
      type: data.type,
      level: data.level,
      description: data.description,
      video_url: data.videoUrl,
    });
  }
  return false;
}

export async function addBuildTutorial(data) {
  const user = await getCurrentUser();
  if (user) {
    return push(ref(database, 'build_tutorials/'), {
      created_by: data.createdBy,
      title: data.title,
      timestamp: Date.now(),
      type: data.type,
      description: data.description,
      video_url: data.videoUrl,
    });
  }
  return false;
}

export async function deleteTutorial(type, id) {
  await remove(ref(database, `${type}_tutorials/${id}`));
}

export async function updateTutorial(type, id, data) {
  await update(ref(database, `${type.toLowerCase()}_tutorials/${id}`), data);
}

export async function addTutorialToCurrentUser(id, type) {
  const user = await getCurrentUser();
  if (user) {
    return push(ref(database, `users/${user.uid}/my_${type.toLowerCase()}_tutorials/`), {
      tutorial_id: id,
    });
  }
  return false;
}

export async function deleteTutorialFromCurrentUser(id, type) {
  const user = await getCurrentUser();
  if (user) {
    await remove(ref(database, `users/${user.uid}/my_${type.toLowerCase()}_tutorials/${id}`));
  }
}
