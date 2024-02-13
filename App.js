import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dropdown } from 'react-native-element-dropdown';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/authScreens/LoginScreen';
import RegisterScreen from './screens/authScreens/RegisterScreen';
import store from './store/store';
import HomeScreen from './screens/HomeScreen';
import colors from './constants/colors';
import SkateparksScreen from './screens/skateparkScreens/SkateparksScreen';
import SkateparkDetailsScreen from './screens/skateparkScreens/SkateparkDetailsScreen';
import { getCurrentUser, logout } from './utilities/authController';
import { removeAuthToken, setAuthToken } from './store/authStates/login';
import CreatorsSpaceScreen from './screens/creatorsSpaceScreens/CreatorsSpaceScreen';
import AddNewTutorialScreen from './screens/creatorsSpaceScreens/AddNewTutorialScreen';
import Spinner from './components/Spinner';
import TutorialsScreen from './screens/tutorialsScreens/TutorialsScreen';
import TutorialDetailsScreen from './screens/tutorialsScreens/TutorialDetailsScreen';
import AddNewForumPostScreen from './screens/creatorsSpaceScreens/AddNewForumPostScreen';

// AppRegistry.registerComponent('main', () => App);
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  function myProfileButton() {
    return (
      <Dropdown
        data={[
          { label: 'My Profile', value: 1 },
          { label: 'Friends', value: 1 },
          { label: 'Creators Space', value: 1 },
          { label: 'My Media', value: 1 },
          { label: 'Logout', value: 1 },
        ]}
        labelField="label"
        valueField="value"
        onChange={async (item) => {
          switch (item.label) {
            case 'My Profile':
              console.log(await getCurrentUser());
              break;
            case 'Creators Space':
              navigation.navigate('CreatorsSpace');
              break;
            case 'Logout':
              await logout();
              dispatch(removeAuthToken({}));
              break;
            default:
              console.log(item);
          }
        }}
        style={{
          width: 130,
        }}
        placeholderStyle={{
          opacity: 0,
        }}
        iconStyle={{
          opacity: 0,
        }}
        containerStyle={{
          width: 150,
          marginTop: 10,
        }}
        itemContainerStyle={{
          width: 130,
          borderColor: colors.placeholderDefault,
          borderBottomWidth: 1,
        }}
        renderRightIcon={() => (
          <Ionicons
            name="person"
            color={colors.secondary500}
            size={30}
            style={{ paddingRight: 16 }}
          />
        )}
        selectedTextStyle={{
          opacity: 0,
        }}
      />
    );
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: colors.secondary500,
        headerStyle: {
          backgroundColor: colors.primary400,
        },
        headerTitleStyle: {
          color: 'white',
          fontSize: 28,
        },
        drawerActiveTintColor: colors.secondary500,
        headerRight: myProfileButton,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerTitle: 'Ride Together',
          // drawerIcon: ({color, size}) => <Ionicons name={'list'} color={color} size={size}/>
        }}
      />
      <Drawer.Screen
        name="Skateparks"
        component={SkateparksScreen}
        options={{
          title: 'Skateparks',
          // drawerIcon: ({color, size}) => <Ionicons name={'list'} color={color} size={size}/>
        }}
      />
      <Drawer.Screen
        name="Tutorials"
        component={TutorialsScreen}
        options={{
          title: 'Tutorials',
          // drawerIcon: ({color, size}) => <Ionicons name={'star'} color={color} size={size}/>
        }}
      />
      <Drawer.Screen
        name="News"
        component={HomeScreen}
        options={{
          title: 'News',
          // drawerIcon: ({color, size}) => <Ionicons name={'star'} color={color} size={size}/>
        }}
      />
      <Drawer.Screen
        name="Forum"
        component={HomeScreen}
        options={{
          title: 'Forum',
          // drawerIcon: ({color, size}) => <Ionicons name={'star'} color={color} size={size}/>
        }}
      />
      <Drawer.Screen
        name="CreatorsSpace"
        component={CreatorsSpaceScreen}
        options={{
          title: 'Creators Space',
          drawerItemStyle: { display: 'none' },
          // drawerIcon: ({color, size}) => <Ionicons name={'star'} color={color} size={size}/>
        }}
      />
      <Drawer.Screen
        name="AddNewTutorial"
        component={AddNewTutorialScreen}
        options={{
          title: 'Add New Tutorial',
          drawerItemStyle: { display: 'none' },
          // drawerIcon: ({color, size}) => <Ionicons name={'star'} color={color} size={size}/>
        }}
      />
      <Drawer.Screen
        name="EditTutorial"
        component={AddNewTutorialScreen}
        options={{
          title: 'Edit Tutorial',
          drawerItemStyle: { display: 'none' },
          // drawerIcon: ({color, size}) => <Ionicons name={'star'} color={color} size={size}/>
        }}
      />
      <Drawer.Screen
        name="AddNewForumPost"
        component={AddNewForumPostScreen}
        options={{
          title: 'Add New Post',
          drawerItemStyle: { display: 'none' },
          // drawerIcon: ({color, size}) => <Ionicons name={'star'} color={color} size={size}/>
        }}
      />
      <Drawer.Screen
        name="EditForumPost"
        component={AddNewForumPostScreen}
        options={{
          title: 'Edit Forum Post',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: colors.secondary500,
        headerStyle: {
          backgroundColor: colors.primary400,
        },
        headerTitleStyle: {
          color: 'white',
          fontSize: 28,
        },
        statusBarColor: colors.primary400,
      }}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: colors.secondary500,
        headerStyle: {
          backgroundColor: colors.primary400,
        },
        headerTitleStyle: {
          color: 'white',
          fontSize: 28,
        },
        statusBarColor: colors.primary400,
      }}
    >
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: true,
          headerTitle: 'Ride Together',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="SkateparkDetails"
        component={SkateparkDetailsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Skatepark',
        }}
      />
      <Stack.Screen
        name="TutorialDetailsScreen"
        component={TutorialDetailsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Tutorial',
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const userAuthenticated = useSelector((state) => state.userAuth.isAuthenticated);
  return (
    <NavigationContainer>
      {!userAuthenticated && <AuthStack />}
      {userAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogIn, setIsTryingLogIn] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        dispatch(setAuthToken({ token: storedToken }));
      }
      setIsTryingLogIn(false);
    }

    fetchToken();
  }, [dispatch]);

  if (isTryingLogIn) {
    return <Spinner deps={[]} />;
  }

  return <Navigation />;
}

export default function App() {
  return (
    <>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="light" />
      <Provider store={store}>
        <Root />
      </Provider>
    </>
  );
}
