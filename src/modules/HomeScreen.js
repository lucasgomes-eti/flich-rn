import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { AuthContext } from '../App'

export default function HomeScreen() {

    const { signOut } = useContext(AuthContext);

    return (
        <>
            <View style={{ flex: 1, justifyContent: 'center'}}>
                <Text style={{ textAlign: 'center' }}>Home</Text>
                <Button mode='contained' onPress={signOut}>Sign Out</Button>
            </View>
        </>
    );
}