import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AddExpance from './AddExpance/AddExpance';
import { postRequest, retrieveUserId } from '../../src/utils';
import { BASE_URL, GET_ALL_EXPANCE } from '../../src/constant';
import Loader from '../../src/components/Loader';


const Expance = () => {
    const [expanceData, setExpanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [isUpdateExpance, setIsUpdateExpression] = useState(true)

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await retrieveUserId();
            setUserId(id);
            setLoading(false);
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId && isUpdateExpance) {
            postRequest(`${BASE_URL}${GET_ALL_EXPANCE}`, JSON.stringify({ id: userId }), (res, error) => {
                if (error) {
                    console.error(error);
                } else {
                    setExpanceData(res.data);
                }
                setLoading(false);
                setIsUpdateExpression(false)
            });
        }
    }, [userId, isUpdateExpance]);

    const TableRow = ({ item, index }) => {
        const { entry_date_time: dateTime, amount, purpose, description } = item;
        if (amount <= 0) return null;

        const [date, time] = dateTime.split(" ");
        const [hh, mm] = time.split(":");

        return (
            <View style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                <Text style={[styles.cellText, { flex: 3 }]}>{`${date} ${hh}:${mm}`}</Text>
                <Text style={[styles.cellText, { flex: 2 }]}>{amount}</Text>
                <Text style={[styles.cellText, { flex: 2 }]}>{purpose}</Text>
                <Text style={[styles.cellText, { flex: 3 }]}>{description}</Text>
            </View>
        );
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <View style={styles.container}>
            <AddExpance setIsUpdateExpression={setIsUpdateExpression} />
            {expanceData.length > 0 && (
                <FlatList
                    data={expanceData}
                    refreshing={loading}
                    ListHeaderComponent={() => (
                        <View style={{
                            borderTopWidth: 1,
                            borderStyle: "dotted",
                            marginBottom: 8,
                        }}>
                            <Text style={styles.headerText}>Misc. Expense</Text>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.cellText, { flex: 3 }]}>Date</Text>
                                <Text style={[styles.cellText, { flex: 2 }]}>Amount</Text>
                                <Text style={[styles.cellText, { flex: 2 }]}>Purpose</Text>
                                <Text style={[styles.cellText, { flex: 3 }]}>Description</Text>
                            </View>
                        </View>
                    )}
                    renderItem={({ item, index }) => <TableRow item={item} index={index} />}
                    keyExtractor={({ entry_date_time }) => entry_date_time}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f7f7f7',
        borderBottomWidth: 2,
        borderColor: '#ddd',
        paddingVertical: 8,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    evenRow: {
        backgroundColor: '#f9f9f9',
    },
    oddRow: {
        backgroundColor: '#fff',
    },
    cellText: {
        fontSize: 14,
        textAlign: 'center',
        padding: 4,
        flexWrap: 'wrap',
    },
});

export default Expance;
