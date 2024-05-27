import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import DateRangePicker from '../../src/components/DateRangePicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BASE_URL, GET_REPORT1 } from '../../src/constant';
import Loader from '../../src/components/Loader';
import { postRequest } from '../../src/utils';

export const d = {
    status: 1,
    message: 'Data Found',
    data: [
        {
            salesman_id: 1,
            name: 'Suman Das',
            phone: '9785825410',
            del_flg: 'N',
            entry_date_time: '2024-05-14 13:46:01',
        },
        {
            salesman_id: 2,
            name: 'Biju Jana',
            phone: '9875841236',
            del_flg: 'N',
            entry_date_time: '2024-05-14 13:46:20',
        },
        {
            salesman_id: 3,
            name: 'Gita Pal',
            phone: '78965412',
            del_flg: 'N',
            entry_date_time: '2024-05-18 15:42:37',
        },
    ],
};

const ManWiseReport = ({navigation}) => {

    const [modal, setModal] = useState(false)
    const [selectedId, setSelectedId] = useState("")
    const [salesData, setSalesData] = useState({})
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        setLoader(true)
        postRequest(`${BASE_URL}${GET_REPORT1}`, JSON.stringify({}), (res, error) => {
            if (error) {
                console.log(error)
            }
            else {
                setSalesData(res.data)
            }
            setLoader(false)
        })
    }, [])

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.row} onPress={() => {
            setModal(true)
            setSelectedId(item.salesman_id)
        }}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.phone}</Text>
            <Text style={styles.cell}>{item.entry_date_time.split(" ")[0]}</Text>
        </TouchableOpacity>
    );

    if (loader) {
        return <Loader />
    }
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.headerText}>Man Wise Report</Text>
                <View style={styles.tableHeader}>
                    <Text style={styles.headerCell}>Name</Text>
                    <Text style={styles.headerCell}>Phone</Text>
                    <Text style={styles.headerCell}>Date Time</Text>
                </View>
                <FlatList
                    data={salesData}
                    renderItem={renderItem}
                    keyExtractor={item => item.salesman_id.toString()}
                />
            </View>
            <DateRangePicker visible={modal} onClose={() => {
                setModal(false);
                setSelectedId('');
            }} salesman_id={selectedId} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        height: 400,
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

export default ManWiseReport;
