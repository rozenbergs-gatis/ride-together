import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authStates/auth';
import loginReducer from './authStates/login';
import userTutorialReducer from './tutorialStates/userTutorials';
import globalTutorialReducer from './tutorialStates/globalTutorials';
import userFavoriteTutorialsReducer from './tutorialStates/userFavoriteTutorials';
import userForumPostsReducer from './forumStates/userForumPosts';

const store = configureStore({
  reducer: {
    validRegisterForm: authReducer,
    userAuth: loginReducer,
    userTutorials: userTutorialReducer,
    globalTutorials: globalTutorialReducer,
    userFavoriteTutorials: userFavoriteTutorialsReducer,
    userForumPosts: userForumPostsReducer,
  },
});

export default store;
