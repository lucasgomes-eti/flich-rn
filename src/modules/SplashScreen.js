import React from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function SplashScreen() {
    return (
        <>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator animating={true} />
            </View>
        </>
    );
}