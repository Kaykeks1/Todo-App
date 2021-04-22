import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
// import console = require("console");

class Header extends Component{
    render(){
        const { value, onChange, onAddItem, onToggleAllComplete }= this.props;
        console.log("value:", value)
        return(
            <View style={styles.header}>
                <TouchableOpacity onPress={onToggleAllComplete}>
                    <Text style={styles.toogleIcon}>
                        {String.fromCharCode(10003)}
                    </Text>
                </TouchableOpacity>
                <TextInput 
                    value={value}
                    onChangeText={onChange}
                    onSubmitEditing={onAddItem}
                    placeholder="What neeeds to be done"
                    blurOnSubmit={false}
                    returnKeyType="done"
                    style={styles.input}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    toogleIcon: {
        fontSize: 30,
        color: "#CCC",
    },
    input: {
        flex: 1,
        height: 50,
        marginLeft: 16,
    },
})

export default Header;