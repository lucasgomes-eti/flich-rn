import React, { useState } from "react";
import { View, Text, SectionList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider, Checkbox, TouchableRipple, Title } from "react-native-paper";

export default function TasksScreen() {

    const DATA = [
        {
            title: "Today",
            data: ["Fix Bux EM-811", "Daily", "Code Review"]
        },
        {
            title: "Tomorrow",
            data: ["Daily", "Onion Rings", "Planning"]
        },
        {
            title: "Friday, 29 May 2020",
            data: ["Create CI/CD Pipeline", "Push the app to the stores"]
        }
    ];

    const [checked, setChecked] = useState(true)

    const Item = ({ description }) => (
        <TouchableRipple
            onPress={() => setChecked(!checked)}>
            <View>
                <View style={styles.item}>
                    <Text style={styles.description}>{description}</Text>
                    <Checkbox.Android
                        style={styles.checkbox}
                        status={checked ? 'checked' : 'unchecked'}
                        color={'#FF9800'}
                        onPress={() => setChecked(!checked)}
                    />
                </View>
                <Divider />
            </View>
        </TouchableRipple>

    );

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <SectionList
                    sections={DATA}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Item description={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <Title style={styles.header}>{title}</Title>
                    )}
                    stickySectionHeadersEnabled={false}
                />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    header: {
        marginHorizontal: 16,
        marginTop: 16
    },
    description: {
        fontSize: 14,
        margin: 16,
        flex: .96,
    },

})