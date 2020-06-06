import React, { useContext } from 'react'
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { AuthContext } from '../App'

export default function InfoScreen() {

    const { signOut } = useContext(AuthContext);

    return (
        <>
        <View style={{ flex: 1, justifyContent: 'center'}}>
                <Button mode='contained' onPress={signOut}>Sign Out</Button>
            </View>
        </>
    );
}