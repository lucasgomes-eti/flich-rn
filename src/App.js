import 'react-native-gesture-handler';
import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import JwtDecode from 'jwt-decode';
import { http } from './services/http'
import { URLS as urls } from './resources/urls'

import SplashScreen from './modules/SplashScreen'
import LoginScreen from './modules/LoginScreen'
import TasksScreen from './modules/TasksScreen'
import CompletedScreen from './modules/CompletedScreen'
import InfoScreen from './modules/InfoScreen'
import { Alert } from 'react-native';


const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#673AB7',
    accent: '#FF9800',
  },
};

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export const AuthContext = createContext();

export default function App({ navigation }) {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        let user = JSON.parse(await AsyncStorage.getItem('user'));

        let decoded = JwtDecode(user.accessToken);

        let exp = new Date(decoded.exp * 1000);

        let timeDiff = exp - (new Date());

        let hours = timeDiff / (1000 * 60 * 60);

        if (hours < 1) {
          try {
            let auth = JSON.parse(await AsyncStorage.getItem('auth'));
            const { data: result } = await http.post(urls.AUHTENTICATION(), {
              strategy: 'local',
              email: auth.clientId,
              password: auth.clientSecret
            });

            await AsyncStorage.setItem('user', JSON.stringify(result));

            user = result;
          } catch (e) {
          }
        }

        userToken = user.accessToken;
      } catch (e) {
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        try {
          const { data: result } = await http.post(urls.AUHTENTICATION(), {
            strategy: 'local',
            email: data.email,
            password: data.password
          });

          await AsyncStorage.setItem('user', JSON.stringify(result));
          await AsyncStorage.setItem('auth', JSON.stringify({
            clientId: data.email,
            clientSecret: data.password
          }));

          dispatch({ type: 'SIGN_IN', token: result.accessToken });
        } catch (e) {
          const { code, message } = e.response.data
          Alert.alert(`Error code - ${code}`, message);
        }
      },
      signOut: async () => {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('auth');

        dispatch({ type: 'SIGN_OUT' })
      },
      signUp: async data => {
        try {
          await http.post(urls.USERS(), data);
          const { data: result } = await http.post(urls.AUHTENTICATION(), {
            strategy: 'local',
            email: data.email,
            password: data.password
          });


          await AsyncStorage.setItem('user', JSON.stringify(result));
          await AsyncStorage.setItem('auth', JSON.stringify({
            clientId: data.email,
            clientSecret: data.password
          }));

          dispatch({ type: 'SIGN_IN', token: result.accessToken });
        } catch (e) {
          const { code, message, errors } = e.response.data
          Alert.alert(`Error code - ${code}`, message + `\n${errors.email}`);
        }
      },
    }), []);

  if (state.isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <AuthContext.Provider value={authContext}>
              {state.userToken == null ? (
                <Stack.Navigator>
                  <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                      headerShown: false,
                      animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                    }} />
                </Stack.Navigator>
              ) : (
                  <Tab.Navigator
                    options={{ headerShown: false }}
                    shifting
                    barStyle={{ backgroundColor: theme.colors.primary }}>
                    <Tab.Screen
                      name="Tasks"
                      component={TasksScreen}
                      options={{
                        tabBarIcon: ({ color }) => (
                          <Icon name='playlist-edit' color={color} size={24} />
                        )
                      }}
                    />
                    <Tab.Screen
                      name="Completed"
                      component={CompletedScreen}
                      options={{
                        tabBarIcon: ({ focused, color }) => (
                          <Icon name={focused ? 'check-circle' : 'check-circle-outline'} color={color} size={24} />
                        )
                      }}
                    />
                    <Tab.Screen
                      name="Info"
                      component={InfoScreen}
                      options={{
                        tabBarIcon: ({ focused, color }) => (
                          <Icon name={focused ? 'information' : 'information-outline'} color={color} size={24} />
                        )
                      }}
                    />
                  </Tab.Navigator>
                )}
            </AuthContext.Provider>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </>
  );
}
