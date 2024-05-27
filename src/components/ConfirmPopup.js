import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const ConfirmPopup = ({ showModal, setShowModal, onPressHandler, text, btnText }) => {
    return (
        <Modal
            animationType="slide"
            transparent
            visible={showModal}
            onRequestClose={() => setShowModal(false)}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Are You Sure?</Text>
                        <TouchableOpacity onPress={() => { setShowModal(false) }}>
                            <Text style={styles.closeButton}>x</Text>
                        </TouchableOpacity>
                    </View>
                    {text && <Text style={{ fontSize: 18, }}>{text}</Text>}
                    <TouchableOpacity style={styles.button} onPress={() => onPressHandler()}>
                        <Text style={styles.textStyle}>{btnText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default ConfirmPopup

const styles = StyleSheet.create({

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        alignItems: 'center',
        elevation: 5, // Android shadow
        gap:12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        marginLeft:20
    },
    closeButton: {
        fontSize: 22,
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        width: '100%',
        marginVertical: 5,
    },
    button: {
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 15,
        minWidth: 70,
        backgroundColor: '#0f0f0f',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
})