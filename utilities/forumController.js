import { get, push, ref, remove } from 'firebase/database';
import { database } from '../firebase/firebaseConfig';
import { getCurrentUser } from './authController';

export async function getForumPost(ids, type) {
  return get(ref(database, `${type}_forum_posts/${ids.id}`)).then((snapshot) => ({
    ...snapshot.val(),
    ...ids,
  }));
}

export async function getAllForumPosts(type) {
  return get(ref(database, `${type.toLowerCase()}_forum_posts/`)).then((snapshot) =>
    Object.entries(snapshot.val()).map(([id, obj]) => ({ id, ...obj }))
  );
}

export async function addDiscussionsPost(data) {
  const user = await getCurrentUser();
  if (user) {
    return push(ref(database, 'discussions_forum_posts/'), {
      created_by: data.createdBy,
      title: data.title,
      timestamp: Date.now(),
      forum_type: data.forumType,
      description: data.description,
      media_urls: data.mediaUrls,
    });
  }
  return false;
}

export async function addMarketPost(data) {
  const user = await getCurrentUser();
  if (user) {
    return push(ref(database, 'market_forum_posts/'), {
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

export async function addForumPostToCurrentUser(id, type) {
  const user = await getCurrentUser();
  if (user) {
    return push(ref(database, `users/${user.uid}/my_${type.toLowerCase()}_forum_posts/`), {
      tutorial_id: id,
    });
  }
  return false;
}

export async function deleteForumPost(type, id) {
  await remove(ref(database, `${type}_forum_posts/${id}`));
}
