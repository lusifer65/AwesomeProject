import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';

import React, { useEffect, useState } from 'react';

import PaymentIcon from '../../../assets/common/Payment.png';

import AddPayment from './AddPayment';
import axios from 'axios';
import { BASE_URL, GET_PAYMENT } from '../../../src/constant';
import Loader from '../../../src/components/Loader';
import ShareButton from '../../../src/components/ShareButton';

const CustomerPayment = ({ customer_id }) => {
    const [paymentData, setPaymentData] = useState([]);
    const [isLoading, setLoading] = useState(false);

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
        return (
            <View style={styles.tableRow}>
                <Text style={[styles.cellText, { flex: 3 }]}>{entry_date_time}</Text>
                <Text style={[styles.cellText, { flex: 1 }]}>
                    {getModeValue(mode)}
                </Text>
                <Text style={[styles.cellText, { flex: 2 }]}>{amount}</Text>
            </View>
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
                    <ShareButton message={paymentData}/>
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
            />
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
});
