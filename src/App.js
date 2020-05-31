import 'react-native-gesture-handler';
import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import SplashScreen from './modules/SplashScreen'
import LoginScreen from './modules/LoginScreen'
import HomeScreen from './modules/HomeScreen'

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
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
      }

      //TODO: Validate token

      setTimeout(function () { }, 30000);

      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    setTimeout(function () { bootstrapAsync(); }, 3000);
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        //TODO: send clientId and clientSecret and retrieve the accessToken

        await AsyncStorage.setItem('userToken', 'dummy-auth-token');

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: async () => {
        await AsyncStorage.removeItem('userToken');

        dispatch({ type: 'SIGN_OUT' })
      },
      signUp: async data => {
        //TODO: send clientId and clientSecret and retrieve the accessToken

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

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
