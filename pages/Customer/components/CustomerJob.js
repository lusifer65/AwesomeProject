import {
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Modal,
} from 'react-native';

import React, { useEffect, useState } from 'react';

import JobReceivedIcon from '../../../assets/common/JobReceived.png';
import AddJob from './AddJob';
import { BASE_URL, DELETE_JOB, GET_CUSTOMER_JOBS } from '../../../src/constant';
import axios from 'axios';
import Loader from '../../../src/components/Loader';
import ShareButton from '../../../src/components/ShareButton';
import ConfirmPopup from '../../../src/components/ConfirmPopup';


const CustomerJob = ({ customer_id, isAdmin }) => {
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [salesman, setSalesman] = useState([]);
    const [isPopup, setPopup] = useState(false);
    const [selectCustomer, setSelectCustomer] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);

    const getJobs = async () => {
        setLoading(true);
        try {
            const bodyFormData = new FormData();
            bodyFormData.append('customer_id', customer_id);
            const response = await axios.post(`${BASE_URL}${GET_CUSTOMER_JOBS}`, bodyFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const { data } = response;
            const { message, data: JsonData, status } = data;
            if (status === 0) {
                console.log('Invalid Customer Id');
            } else {
                setSalesman(JsonData.salesman || []);
                setJobs(JsonData.jobs || []);
            }
        } catch (error) {
            console.error('Unable to get Jobs', error);
        } finally {
            setLoading(false);
            setIsEdit(false);
            setPopup(false);
        }
    };

    useEffect(() => {
        getJobs();
    }, []);

    const handleDelete = async () => {

        setLoading(true);
        try {
            const bodyFormData = new FormData();
            bodyFormData.append('slno', selectCustomer.slno);
            const response = await axios.post(`${BASE_URL}${DELETE_JOB}`, bodyFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const { data } = response;
            const { status } = data;
            if (status === 0) {
                console.log('Invalid Customer Id');
            } else {
                console.log('Job deleted successfully');
                getJobs();
            }
        } catch (error) {
            console.error('Unable to delete Job', error);
        } finally {
            setDeletePopup(false);
            setLoading(false);
            setPopup(false);
        }
    };

    const onClose = () => {
        setPopup(false);
    };

    const Row = isAdmin ? TouchableOpacity : View;
    const TableRow = ({ item }) => {
        const { entry_date_time, qty, category } = item;
        return (
            <Row
                style={styles.tableRow}
                onPress={() => {
                    if (isAdmin) {
                        setPopup(true);
                        setSelectCustomer(item);
                    }
                }}>
                <Text style={styles.cellText}>{category}</Text>
                <Text style={styles.cellText}>{qty}</Text>
                <Text style={styles.cellText}>{entry_date_time}</Text>
            </Row>
        );
    };

    if (loading) {
        return <Loader />;
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
                    {jobs.map((item, index) => (
                        <TableRow key={index} item={item} />
                    ))}
                </View>
            </ScrollView>
            <AddJob
                allSalesman={salesman}
                setLoading={setLoading}
                customerId={customer_id}
                onSubmit={getJobs}
                selectCustomer={selectCustomer}
                isEdit={isEdit}
                setSelectCustomer={setSelectCustomer}
            />
            {isPopup && (
                <Modal
                    animationType="slide"
                    transparent
                    visible={isPopup}
                    onRequestClose={onClose}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>Select for Job</Text>
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
                                    onPress={() => setDeletePopup(true)}
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
