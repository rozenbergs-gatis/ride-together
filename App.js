import {StatusBar} from 'expo-status-bar';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import LoginScreen from "./screens/authScreens/LoginScreen";
import RegisterScreen from "./screens/authScreens/RegisterScreen";
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Provider} from "react-redux";
import { store } from './store/store'
import HomeScreen from "./screens/HomeScreen";
import {createDrawerNavigator} from "@react-navigation/drawer";
import { Dropdown } from 'react-native-element-dropdown';
import Ionicons from '@expo/vector-icons/Ionicons';
import {colors} from "./constants/colors";
import SkateparksScreen from "./screens/SkateparksScreen";
import SkateparkDetailsScreen from "./screens/skateparkScreens/SkateparkDetailsScreen";
import {getUser, logout} from "./utilities/auth";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
function DrawerNavigator() {
    const navigation = useNavigation();

    return (
        <Drawer.Navigator screenOptions={{
            headerTitleAlign: 'center',
            headerTintColor: colors.secondary500,
            headerStyle: {
                backgroundColor: colors.primary400
            },
            headerTitleStyle: {
                color: 'white',
                fontSize: 28
            },
            headerRight: () => (
                <Dropdown data={[
                    { label: 'My Profile', value: 1},
                    { label: 'Friends', value: 1},
                    { label: 'Roadmap', value: 1},
                    { label: 'My Media', value: 1},
                    { label: 'Logout', value: 1},
                ]}
                          labelField={"label"}
                          valueField={"value"}
                          onChange={async item => {
                              switch (item.label) {
                                  case 'My Profile':
                                      console.log(getUser());
                                      break;
                                  case 'Logout':
                                      await logout()
                                      navigation.replace('LoginScreen');
                                      break;
                                  default:
                                      console.log(item)
                              }
                          }}
                          style={{
                              width: 130
                          }}
                          placeholderStyle={{
                              opacity:0
                          }}
                          iconStyle={{
                              opacity: 0
                          }}
                          containerStyle={{
                              width: 150
                          }}
                          itemContainerStyle={{
                              width: 130,
                          }}
                          renderRightIcon={() => (
                              <Ionicons name={'person'} color={colors.secondary500} size={30} style={{paddingRight: 16}}/>
                          )}
                          selectedTextStyle={{
                              opacity: 0
                          }}
                />
            )
        }}>
            <Drawer.Screen name={'Home'}
                           component={HomeScreen}
                           options={{
                               title: 'Home',
                               headerTitle: 'Ride Together',
                               // drawerIcon: ({color, size}) => <Ionicons name={'list'} color={color} size={size}/>
                           }}
            />
            <Drawer.Screen name={'Skateparks'}
                           component={SkateparksScreen}
                           options={{
                               title: 'Skateparks',
                               // drawerIcon: ({color, size}) => <Ionicons name={'list'} color={color} size={size}/>
                           }}
            />
            <Drawer.Screen
                name={'Tutorials'}
                component={HomeScreen}
                options={{
                    title: 'Tutorials',
                    // drawerIcon: ({color, size}) => <Ionicons name={'star'} color={color} size={size}/>
                }}
            />
            <Drawer.Screen
                name={'News'}
                component={HomeScreen}
                options={{
                    title: 'News',
                    // drawerIcon: ({color, size}) => <Ionicons name={'star'} color={color} size={size}/>
                }}
            />
            <Drawer.Screen
                name={'Forum'}
                component={HomeScreen}
                options={{
                    title: 'Forum',
                    // drawerIcon: ({color, size}) => <Ionicons name={'star'} color={color} size={size}/>
                }}
            />
        </Drawer.Navigator>
    );
}
export default function App() {
    return (
        <>
            <StatusBar style={'light'}/>
            <Provider store={store}>
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            headerTitleAlign: 'center',
                            headerTintColor: colors.secondary500,
                            headerStyle: {
                                backgroundColor: colors.primary400
                            },
                            headerTitleStyle: {
                                color: 'white',
                                fontSize: 28
                            },
                            statusBarColor: colors.primary400,
                        }}>
                        <Stack.Screen name={'Drawer'}
                                      component={DrawerNavigator}
                                      options={{
                                          headerShown: false
                                      }}
                        />
                        <Stack.Screen
                            name="LoginScreen"
                            component={LoginScreen}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="RegisterScreen"
                            component={RegisterScreen}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="HomeScreen"
                            component={HomeScreen}
                            options={{
                                headerShown: true,
                                headerTitle: 'Ride Together',
                                headerTitleAlign: 'center'
                        }}
                        />
                        <Stack.Screen
                            name="SkateparkDetails"
                            component={SkateparkDetailsScreen}
                            options={{
                                headerShown: true,
                                headerTitle: 'Skatepark'
                            }}
                        />
                    </Stack.Navigator>
                    {/*<LoginScreen/>*/}
                    {/*<RegisterScreen/>*/}
                </NavigationContainer>
            </Provider>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.whiteDefault,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
