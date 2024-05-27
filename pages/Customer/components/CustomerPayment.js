import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, ToastAndroid } from 'react-native';

import React, { useEffect, useState } from 'react';

import PaymentIcon from '../../../assets/common/Payment.png';

import AddPayment from './AddPayment';
import axios from 'axios';
import { BASE_URL, DELETE_PAYMENT, GET_PAYMENT } from '../../../src/constant';
import Loader from '../../../src/components/Loader';
import ShareButton from '../../../src/components/ShareButton';
import ConfirmPopup from '../../../src/components/ConfirmPopup';

const CustomerPayment = ({ customer_id, isAdmin }) => {
    const [paymentData, setPaymentData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [popup, setPopup] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectExpence, setSelectExpence] = useState(null);

    useEffect(() => {
        getPayment();
    }, []);

    const getPayment = () => {
        setLoading(true);
        const bodyFormData = new FormData();
        bodyFormData.append('customer_id', customer_id);
        axios({
            method: 'post',
            url: `${BASE_URL}${GET_PAYMENT}`,
            data: bodyFormData,
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                const { data } = response;
                const { message, data: JsonData, status } = data;
                if (status == 0) {
                    console.log('Invalid Customer Id');
                } else {
                    // console.log(JsonData);
                    setPaymentData(JsonData);
                }
            })
            .catch(error => {
                console.error('Unable to get Payment', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    const handleDelete = async () => {
        setLoading(true);
        try {
            const bodyFormData = new FormData();
            bodyFormData.append('slno', selectExpence?.slno);
            console.log(selectExpence.slno);
            const response = await axios.post(
                `${BASE_URL}${DELETE_PAYMENT}`,
                bodyFormData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                },
            );
            const { data } = response;
            const { status } = data;
            if (status === 0) {
                console.log('Invalid Customer Id');
            } else {
                ToastAndroid.show(`Delete Payment successfully`, ToastAndroid.SHORT);
                getPayment();
            }
        } catch (error) {
            console.error('Unable to delete Job', error);
        } finally {
            setDeletePopup(false);
            setLoading(false);
            setPopup(false);
        }
    }

    const onClose = () => {
        setPopup(false)
    }

    const getModeValue = modeText => {
        switch (modeText) {
            case 'B':
                return 'Bank';
            case 'O':
                return 'Online';
            default:
                return 'Cash';
        }
    };
    const TableRow = ({ item }) => {
        const { entry_date_time, amount, mode } = item;
        const Row = isAdmin ? TouchableOpacity : View
        return (
            <Row style={styles.tableRow}
                onPress={() => {
                    setIsEdit(false);
                    setSelectExpence(item);
                    setPopup(true);
                }}
            >
                <Text style={[styles.cellText, { flex: 3 }]}>{entry_date_time}</Text>
                <Text style={[styles.cellText, { flex: 1 }]}>
                    {getModeValue(mode)}
                </Text>
                <Text style={[styles.cellText, { flex: 2 }]}>{amount}</Text>
            </Row>
        );
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image source={PaymentIcon} style={styles.image} />
                        <Text style={{ fontSize: 20, fontWeight: '500' }}>
                            Payment Received
                        </Text>
                    </View>
                    <ShareButton message={paymentData} />
                    <View style={styles.tableRow}>
                        <Text style={[styles.cellText, { flex: 3, fontWeight: '500' }]}>
                            Date
                        </Text>
                        <Text style={[styles.cellText, { flex: 1, fontWeight: '500' }]}>
                            Mode
                        </Text>
                        <Text style={[styles.cellText, { flex: 2, fontWeight: '500' }]}>
                            Amount
                        </Text>
                    </View>
                    {paymentData.map((item, index) => {
                        return <TableRow key={index} item={item} />;
                    })}
                </View>
            </ScrollView>
            <AddPayment
                setLoading={setLoading}
                customerId={customer_id}
                onSubmit={getPayment}
                isEdit={isEdit}
                selectExpence={selectExpence}
                setSelectExpence={setSelectExpence}
                setIsEdit={setIsEdit}
            />

            {popup && (
                <Modal
                    animationType="slide"
                    transparent
                    visible={popup}
                    onRequestClose={onClose}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>Select</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Text style={styles.closeButton}>x</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 24 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsEdit(true);
                                        onClose();
                                    }}
                                    style={styles.button}>
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setDeletePopup(true)
                                        onClose()
                                    }}
                                    style={[styles.button, { backgroundColor: 'red' }]}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
            {deletePopup && (
                <ConfirmPopup
                    showModal={deletePopup}
                    setShowModal={setDeletePopup}
                    onPressHandler={handleDelete}
                    btnText={'Delete'}
                />
            )}
        </>
    );
};

export default CustomerPayment;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderStyle: 'dotted',
        paddingTop: 8,
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        gap: 8,
    },
    image: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
    },

    tableRow: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'space-between',
        paddingBottom: 8,
    },
    headerRow: {
        marginTop: 8,
    },
    cellText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
    },
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    closeButton: {
        fontSize: 22,
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 12,
        marginBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#0f0f0f',
        padding: 12,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
