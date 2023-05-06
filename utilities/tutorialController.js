import {get, push, ref, remove} from "firebase/database";
import {database} from "../firebase/firebaseConfig";
import {getCurrentUser} from "./authController";

export async function getTutorial(ids) {
    return get(ref(database, `trick_tutorials/${ids.id}`)).then((snapshot) => {
        return {...snapshot.val(), ...ids}
    })
}

export async function addTrickTutorial(data) {
    const user = await getCurrentUser();
    if (user) {
        return push(ref(database, 'trick_tutorials/'), {
            title: data.title,
            timestamp: Date.now(),
            type: data.type,
            level: data.level,
            description: data.description,
            video_url: data.videoUrl
        });
    }
}

export async function addBuildTutorial(data) {
    const user = await getCurrentUser();
    if (user) {
        return push(ref(database, 'build_tutorials/'), {
            title: data.title,
            timestamp: Date.now(),
            type: data.type,
            description: data.description,
            video_url: data.videoUrl
        });
    }
}

export async function deleteTutorial(type, id) {
    await remove(ref(database, `${type}_tutorials/${id}`))
}

export async function addTutorialToCurrentUser(id, type) {
    const user = await getCurrentUser();
    if (user) {
        await push(ref(database, `users/${user.uid}/my_${type.toLowerCase()}_tutorials/`), {
            tutorial_id: id
        });
    }
}
