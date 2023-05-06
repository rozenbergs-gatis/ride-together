import {ref, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import {storage} from "../firebase/firebaseConfig";

export async function uploadTutorialVideo(videoUri) {
    const response = await fetch(videoUri);
    const blob = await response.blob();
    const fileName = videoUri.split('/').pop();
    return await uploadBytes(ref(storage, 'tutorials/' + fileName), blob).then((snapshot) => {
        return getDownloadURL(snapshot.ref)
    }).then(downloadUrl => {
        return downloadUrl;
    });
}

export async function deleteTutorialVideo(videoUrl) {
    const fileName = videoUrl
        .match(/https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/ride-together-f8d4e\.appspot\.com\/o\/tutorials%2F(.*)\?/)[1];
    return deleteObject(ref(storage, 'tutorials/' + fileName));
}