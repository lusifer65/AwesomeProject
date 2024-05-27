import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { BASE_URL, FILTER_REPORT1 } from '../../src/constant';
import Loader from '../../src/components/Loader';

const SalesReport = ({ route }) => {
    const { fromDate, toDate, id } = route.params;
    const [salesData, setSalesData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const bodyFormData = new FormData();
        bodyFormData.append('salesman_id', id);
        bodyFormData.append('fromDate', fromDate);
        bodyFormData.append('toDate', toDate);

        axios({
            method: 'post',
            url: `${BASE_URL}${FILTER_REPORT1}`,
            data: bodyFormData,
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                const { data } = response;
                if (data.status === 0) {
                    console.log('Invalid Customer Id');
                } else {
                    // console.log(JSON.parse(data.split(")")[1]).data);
                    setSalesData(JSON.parse(data.split(")")[1])); // Set the data properly
                }
            })
            .catch(error => {
                console.error('Unable to get Jobs', error);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [fromDate, toDate, id]);

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.category}</Text>
            <Text style={styles.cell}>{item.qty}</Text>
            <Text style={styles.cell}>{item.amount}</Text>
        </View>
    );

    if (loading) {
        return <Loader />;
    }

    if (!salesData?.data) {
        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>No Data Found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Sales Man Report</Text>
            <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>Name</Text>
                <Text style={styles.headerCell}>Category</Text>
                <Text style={styles.headerCell}>Qty.</Text>
                <Text style={styles.headerCell}>Amount</Text>
            </View>
            <FlatList
                data={salesData.data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        height: '100%',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
        paddingBottom: 8,
        marginBottom: 8,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 8,
    },
    cell: {
        flex: 2,
        textAlign: 'center',
    },
});

export default SalesReport;
