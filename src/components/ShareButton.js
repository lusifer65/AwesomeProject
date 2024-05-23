import React from 'react';
import { Share, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ShareIcon from '../../assets/common/shareIcon.png'
import { formatTable } from '../utils';
const ShareButton = ({ message }) => {

    const shareContent = () => {
        Share.share({
            message: formatTable(message || []), // Your message to be shared
        });
    };

    return (

        <TouchableOpacity onPress={shareContent} style={[styles.container]} >
            <Image source={ShareIcon} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginVertical: 8,
    },
});

export default ShareButton;
