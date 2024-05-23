import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';


export const CustomToggle = ({ value, onToggle }) => {
    const toggleButtonStyle = {
        transform: [{ translateX: value ? 0 : 2 }],
    };

    return (
        <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
            <View style={[styles.switchContainer, value && styles.switchContainerOn]}>
                {value && <Text style={[styles.switchText, value && styles.switchTextOn]}>On</Text>}
                <View style={styles.switchTrack} />
                <Animated.View style={[styles.switchButton, toggleButtonStyle]} />
                {!value && <Text style={[styles.switchText, !value && styles.switchTextoff]}>Off</Text>}
            </View>
        </TouchableOpacity>
    );
};

export default CustomToggle;


const styles = StyleSheet.create({
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#ccc',
        paddingHorizontal: 2,
        paddingVertical: 2,
    },
    switchContainerOn: {
        backgroundColor: '#767577',
        borderColor: '#0f0f0f',
    },
    switchText: {
        fontSize: 16,
        color: '#888',
        paddingHorizontal: 4,
    },
    switchTextOn: {
        color: '#fff',
    },
    switchTextoff: {
        color: '#0f0f0f',
    },
    switchButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#0f0f0f',
        marginVertical: 2,
        marginHorizontal: 4,
    },
    switchButtonOn: {
        backgroundColor: '#767577',
        marginLeft: 'auto',
    },
});