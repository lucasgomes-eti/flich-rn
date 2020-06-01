import React, { useState, useContext } from 'react';
import {
    TextInput,
    Button,
    Divider
} from 'react-native-paper';
import {
    View,
    StyleSheet,
    ImageBackground,
    Text,
    StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../styles/Typography'
import { AuthContext } from '../App'

const loginBg = require('../assets/login_bg.png');

export default function LoginScreen() {

    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { signIn, signUp } = useContext(AuthContext);

    return (
        <>
            <ImageBackground style={styles.backgroundImage} source={loginBg}>
                <StatusBar barStyle={'light-content'}
                    translucent={true}
                    backgroundColor={'transparent'} />
                <View style={styles.container}>
                    <Text style={[Typography.H2, styles.appName, { paddingTop: insets.top + 72 }]}>Flich</Text>
                    <TextInput
                        style={{ marginTop: 72 }}
                        label='Email'
                        placeholder='email@yourdomain.com'
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={{ marginTop: 16 }}
                        secureTextEntry
                        label='Password'
                        value={password}
                        onChangeText={setPassword}
                    />
                    <Button
                        style={styles.button}
                        mode="contained"
                        onPress={() => { signIn({ email, password }) }}>
                        Login
                    </Button>
                    <Button
                        style={styles.button}
                        mode="contained"
                        onPress={() => { signUp({ email, password }) }}>
                        Sign Up
                    </Button>
                </View>
            </ImageBackground>
        </>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        paddingStart: 16,
        paddingEnd: 16,
    },
    appName: {
        color: 'white',
        textAlign: 'center',
    },
    button: {
        marginTop: 16,
    }
})