import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import InputField from '../../src/components/InputField/InputFields';
import { BASE_URL, GET_ALL_CUSTOMER, GET_LOGIN_DATA } from '../../src/constant';
import { postRequest, retrieveUserId } from '../../src/utils';
import Loader from '../../src/components/Loader';
import CustomModal from './components/CustomModal';
import axios from 'axios';

const Customer = ({ navigation }) => {
  const [customerData, setCustomerData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      const id = await retrieveUserId();
      setUserId(id);
      setLoading(false);
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      postRequest(`${BASE_URL}${GET_ALL_CUSTOMER}`, JSON.stringify({ id: userId }), (res, error) => {
        if (error) {
          console.log(error);
        } else {
          setCustomerData(res.data);
        }
        setLoading(false);
      });
      const bodyFormData = new FormData();
      bodyFormData.append('user_id', userId);
      axios({
        method: 'post',
        url: `${BASE_URL}${GET_LOGIN_DATA}`,
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then(response => {
          const { data } = response;
          const { message, data: userData, status } = data;
          console.log(data);
          if (status == 0) {
            console.log('Unable to add');
          } else {
            const { user_type } = userData
            setIsAdmin(user_type === 'admin');
          }
        })
        .catch(error => {
          console.error('Error submitting form:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  const filteredData = customerData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.rowItem}
      onPress={() => {
        setSelectedCustomer(item);
        setShowModal(true);
      }}>
      <Text style={styles.colItem}>{item.cust_id}</Text>
      <Text style={[styles.colItem, { flex: 2 }]}>{item.name}</Text>
      <Text style={styles.colItem}>{parseFloat(item.received).toFixed(2)}</Text>
      <Text style={styles.colItem}>{parseFloat(item.due).toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.headerText}>Customer</Text>

        <View style={styles.searchContainer}>
          <Text>Search Customer'</Text>
          <InputField
            customStyle={[styles.inputBox, isAdmin ? {} : { width: 150 }]}
            onChangeText={setSearchQuery}
            value={searchQuery}
            placeholder="Search by name"
          />
          {isAdmin &&
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('addCustomer')}>
              <Text style={styles.textStyle}>Add</Text>
            </TouchableOpacity>
          }
        </View>

        <View style={styles.rowItem}>
          <Text style={[styles.colItem, styles.itemHeader]}>Cust ID</Text>
          <Text style={[styles.colItem, styles.itemHeader, { flex: 2 }]}>Customer Name</Text>
          <Text style={[styles.colItem, styles.itemHeader]}>Received</Text>
          <Text style={[styles.colItem, styles.itemHeader]}>Due</Text>
        </View>
        {loading ? (
          <Loader />
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={({ cust_id }) => `${cust_id}`}
          />
        )}
      </View>
      <CustomModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        items={selectedCustomer}
        isAdmin={isAdmin}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 8,
    marginTop: 16,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    alignItems: 'center',
  },
  inputBox: {


  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  colItem: {
    flex: 1,
    textAlign: 'center',
  },
  itemHeader: {
    fontSize: 15,
    fontWeight: '500',
  },

  button: {
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 15,
    minWidth: 70,
    backgroundColor: "#0f0f07"
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

});

export default Customer;
