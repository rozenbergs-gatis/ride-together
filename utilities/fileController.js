import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/firebaseConfig';

export async function uploadMedia(mediaDirectory, mediaUri, metadata = {}) {
  const response = await fetch(mediaUri);
  const blob = await response.blob();
  const fileName = mediaUri.split('/').pop();
  return uploadBytes(ref(storage, `${mediaDirectory}/${fileName}`), blob, metadata)
    .then((snapshot) => getDownloadURL(snapshot.ref))
    .then((downloadUrl) => downloadUrl);
}

export async function deleteMedia(mediaDirectory, mediaUrl) {
  const fileName = mediaUrl.match(
    /https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/ride-together-f8d4e\.appspot\.com\/o\/(?:tutorials|forums)%2F(.*)\?/
  )[1];
  return deleteObject(ref(storage, `${mediaDirectory}/${fileName}`));
}
