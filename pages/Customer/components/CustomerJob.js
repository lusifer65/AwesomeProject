import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';

import React, { useEffect, useState } from 'react';

import JobReceivedIcon from '../../../assets/common/JobReceived.png';
import AddJob from './AddJob';
import { BASE_URL, GET_CUSTOMER_JOBS } from '../../../src/constant';
import axios from 'axios';
import Loader from '../../../src/components/Loader';
import ShareButton from '../../../src/components/ShareButton';

const CustomerJob = ({ customer_id }) => {
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [salesman, setSalesman] = useState([])

    const getJobs = () => {
        setLoading(true);
        const bodyFormData = new FormData();
        bodyFormData.append('customer_id', customer_id);
        axios({
            method: 'post',
            url: `${BASE_URL}${GET_CUSTOMER_JOBS}`,
            data: bodyFormData,
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                const { data } = response;
                const { message, data: JsonData, status } = data;
                if (status == 0) {
                    console.log('Invalid Customer Id');
                } else {
                    setSalesman(JsonData.salesman || [])
                    setJobs(JsonData.jobs || []);
                }
            })
            .catch(error => {
                console.error('Unable to get Jobs', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getJobs();
    }, []);

    const TableRow = ({ item }) => {
        const { entry_date_time, qty, category } = item;
        return (
            <View style={styles.tableRow}>
                <Text style={styles.cellText}>{category}</Text>
                <Text style={styles.cellText}>{qty}</Text>
                <Text style={styles.cellText}>{entry_date_time}</Text>
            </View>
        );
    };

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image source={JobReceivedIcon} style={styles.image} />
                        <Text style={{ fontSize: 20, fontWeight: '500' }}>Job Received</Text>
                    </View>
                    <ShareButton message={jobs} />
                    <View style={styles.tableRow}>
                        <Text style={styles.cellText}>Type</Text>
                        <Text style={styles.cellText}>Qty</Text>
                        <Text style={styles.cellText}>Date</Text>
                    </View>
                    {jobs.map((item, index) => {
                        return <TableRow key={index} item={item} />;
                    })}
                </View>
            </ScrollView>
            <AddJob allSalesman={salesman} setLoading={setLoading} customerId={customer_id} onSubmit={getJobs} />
        </>
    );
};

export default CustomerJob;

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
        paddingVertical: 8,
    },
    headerRow: {
        marginTop: 8,
    },
    cellText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
    },
});
