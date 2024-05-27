import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    ToastAndroid,
} from 'react-native';
import AddExpance from './AddExpance/AddExpance';
import { postRequest, retrieveUserId } from '../../src/utils';
import { BASE_URL, DELETE_EXPANCE, GET_ALL_EXPANCE } from '../../src/constant';
import Loader from '../../src/components/Loader';
import ConfirmPopup from '../../src/components/ConfirmPopup';
import axios from 'axios';

const Expance = () => {
    const [expanceData, setExpanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);
    const [isUpdateExpance, setIsUpdateExpression] = useState(true);
    const [deletePopup, setDeletePopup] = useState(false);
    const [popup, setPopup] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectExpence, setSelectExpence] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            setLoading(true);
            const id = await retrieveUserId();
            setUserId(id);
            setLoading(false);
        };
        const fetchUserType = async () => {
            setLoading(true);
            const userType = await retrieveUserId('user_type');
            setIsAdmin(userType === 'admin');
            setLoading(false);
        };
        fetchUserId();
        fetchUserType();
    }, []);

    useEffect(() => {
        if (userId && isUpdateExpance) {
            getExpance();
        }
    }, [userId, isUpdateExpance]);
    const getExpance = () => {
        postRequest(
            `${BASE_URL}${GET_ALL_EXPANCE}`,
            JSON.stringify({ id: userId }),
            (res, error) => {
                if (error) {
                    console.error(error);
                } else {
                    setExpanceData(res.data);
                }
                setLoading(false);
                setIsUpdateExpression(false);
            },
        );
    };
    const TableRow = ({ item, index }) => {
        const { entry_date_time: dateTime, amount, purpose, description } = item;
        if (amount <= 0) return null;
        const [date, time] = dateTime.split(' ');
        const [hh, mm] = time.split(':');
        const Row = isAdmin ? TouchableOpacity : View;
        return (
            <Row
                style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.evenRow : styles.oddRow,
                ]}
                onPress={() => {
                    setIsEdit(false);
                    setSelectExpence(item);
                    setPopup(true);
                }}>
                <Text
                    style={[styles.cellText, { flex: 3 }]}>{`${date} ${hh}:${mm}`}</Text>
                <Text style={[styles.cellText, { flex: 2 }]}>{amount}</Text>
                <Text style={[styles.cellText, { flex: 2 }]}>{purpose}</Text>
                <Text style={[styles.cellText, { flex: 3 }]}>{description}</Text>
            </Row>
        );
    };

    const onClose = () => {
        setPopup(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const bodyFormData = new FormData();
            bodyFormData.append('slno', selectExpence?.slno);
            console.log(selectExpence.slno);
            const response = await axios.post(
                `${BASE_URL}${DELETE_EXPANCE}`,
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
                console.log('Expance deleted successfully');
                ToastAndroid.show(`Delete Expance successfully`, ToastAndroid.SHORT);
                getExpance();
            }
        } catch (error) {
            console.error('Unable to delete Job', error);
        } finally {
            setDeletePopup(false);
            setLoading(false);
            setPopup(false);
        }
    };
    if (loading) {
        return <Loader />;
    }

    return (
        <View style={styles.container}>
            <AddExpance
                setIsUpdateExpression={setIsUpdateExpression}
                isEdit={isEdit}
                selectExpence={selectExpence}
                setIsEdit={setIsEdit}
            />
            {expanceData.length > 0 && (
                <FlatList
                    data={expanceData}
                    refreshing={loading}
                    ListHeaderComponent={() => (
                        <View
                            style={{
                                borderTopWidth: 1,
                                borderStyle: 'dotted',
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
            {popup && (
                <Modal
                    animationType="slide"
                    transparent
                    visible={popup}
                    onRequestClose={onClose}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>Select for Expance</Text>
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

export default Expance;
