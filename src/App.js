import 'react-native-gesture-handler';
import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import { http } from './services/http'
import { URLS as urls } from './resources/urls'

import SplashScreen from './modules/SplashScreen'
import LoginScreen from './modules/LoginScreen'
import HomeScreen from './modules/HomeScreen'
import JwtDecode from 'jwt-decode';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#673AB7',
    accent: '#FF9800',
  },
};

const Stack = createStackNavigator();

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
          alert(e);
        }
      },
      signOut: async () => {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('auth');

        dispatch({ type: 'SIGN_OUT' })
      },
      signUp: async data => {
        try {
          const { data: resultUserCreation } = await http.post(urls.USERS(), data);
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
          alert(e);
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
              <Stack.Navigator>
                {state.userToken == null ? (
                  <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                      headerShown: false,
                      animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                    }} />
                ) : (
                    <Stack.Screen
                      name="Home"
                      component={HomeScreen}
                      options={{ headerShown: false }} />
                  )}
              </Stack.Navigator>
            </AuthContext.Provider>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </>
  );
}
