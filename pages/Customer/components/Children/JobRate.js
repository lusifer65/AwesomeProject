import {
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import JobRateIcon from '../../../../assets/common/JobRate.png';
import CustomToggle from '../../../../src/components/CustomToggle';
import axios from 'axios';
import {
    BASE_URL,
    GET_JOB_RATES,
    UPDATE_JOB_RATES,
} from '../../../../src/constant';
import Loader from '../../../../src/components/Loader';

const JobRate = ({ customer_id }) => {
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({
        work_h_qty: '',
        work_h_rate: '',
        work_h_rate_per_pice: '',
        work_m_rate_per_pice: '',
        work_t_rate_per_pice: '',
        work_c_rate_per_pice: '',
    });

    const getJobRate = () => {
        setLoading(true);
        const bodyFormData = new FormData();
        bodyFormData.append('id', customer_id);
        axios({
            method: 'post',
            url: `${BASE_URL}${GET_JOB_RATES}`,
            data: bodyFormData,
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                const { data: JsonData } = response;
                const { message, data, status } = JsonData;
                if (status == 0) {
                    console.log('Invalid Customer Id');
                } else {
                    // console.log(data);
                    setInputs({ ...inputs, ...data });
                }
            })
            .catch(error => {
                console.error('Unable to get Job Rate', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getJobRate();
    }, []);

    const handleInputChange = (text, column) => {
        if (/^\d*\.?\d*$/.test(text)) {
            setInputs({ ...inputs, [column]: text });
        }
    };

    const handleEdit = () => {
        const bodyFormData = new FormData();
        for (let field in inputs) {
            if (!['del_flg', 'entry_date_time', 'slno'].includes(field))
                bodyFormData.append(field, inputs[field]);
        }
        setLoading(true);
        axios({
            method: 'post',
            url: `${BASE_URL}${UPDATE_JOB_RATES}`,
            data: bodyFormData,
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                const { data } = response;
                const { status } = data;
                if (status == 0) {
                    console.log('unable to add Job');
                } else {
                    console.log('Add Job Successfully');
                    getJobRate();
                }
            })
            .catch(error => {
                console.error('Error submitting Job:', error);
            })
            .finally(() => {
                setLoading(false);
                setIsEdit(false);
            });
    };

    const formatValue = value => (value == 0 ? '' : value.toString());

    if (loading) {
        return <Loader />;
    }
    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image source={JobRateIcon} style={styles.image} />
                    <Text style={{ fontSize: 20, fontWeight: '500' }}>Job Rate</Text>
                </View>
                <View style={styles.textViewContainer}>
                    <CustomToggle
                        onToggle={() => setIsEdit(prev => !prev)}
                        value={isEdit}
                    />
                </View>
            </View>
            <View style={styles.tableContainer}>
                {['', 'h', 'm', 'c', 't'].map((job, index) => (
                    <View key={index} style={styles.row}>
                        {index !== 0 ? (
                            <>
                                <Text style={styles.text}>{job.toUpperCase()}</Text>
                                <View style={styles.inputContainer}>
                                    {job === 'h' ? (
                                        <>
                                            <TextInput
                                                style={styles.input}
                                                onChangeText={text =>
                                                    handleInputChange(text, `work_${job}_qty`)
                                                }
                                                editable={isEdit}
                                                keyboardType="numeric"
                                                value={formatValue(inputs[`work_${job}_qty`])}
                                            />
                                            <TextInput
                                                style={[styles.input]}
                                                onChangeText={text =>
                                                    handleInputChange(text, `work_${job}_rate`)
                                                }
                                                editable={isEdit}
                                                keyboardType="numeric"
                                                value={formatValue(inputs[`work_${job}_rate`])}
                                            />
                                        </>
                                    ) : (
                                        <View style={{ width: '66%', marginRight: 8 }}></View>
                                    )}
                                    <TextInput
                                        style={[styles.input, { alignSelf: 'flex-end' }]}
                                        onChangeText={text =>
                                            handleInputChange(text, `work_${job}_rate_per_pice`)
                                        }
                                        editable={isEdit}
                                        keyboardType="numeric"
                                        value={formatValue(inputs[`work_${job}_rate_per_pice`])}
                                    />
                                </View>
                            </>
                        ) : (
                            <View style={[styles.inputContainer, { paddingRight: 16 }]}>
                                <Text style={styles.text}>{job}</Text>
                                <Text>Min Qty</Text>
                                <Text>Rate Rs.</Text>
                                <Text>Rate Rs./Pice</Text>
                            </View>
                        )}
                    </View>
                ))}
                <TouchableOpacity
                    style={[
                        styles.buttonWrapper,
                        isEdit ? {} : { backgroundColor: 'gray' },
                    ]}
                    onPress={() => {
                        if (isEdit) {
                            handleEdit();
                        }
                    }}>
                    <Text style={{ color: '#0f0f0f', fontSize: 16, fontWeight: '600' }}>
                        Submit
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default JobRate;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderStyle: 'dotted',
        paddingTop: 8,
    },
    imageContainer: {
        flex: 3,
        alignItems: 'center',
        marginLeft: 50,
        gap: 8,
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    textViewContainer: {
        flex: 1,
        alignItems: 'flex-end',
        marginTop: 16,
    },
    tableContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 16,
    },
    text: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 3,
    },
    input: {
        width: '33%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    buttonWrapper: {
        backgroundColor: '#9fb6c3',
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 16,
    },
});
