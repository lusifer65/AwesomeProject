import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import MarketIcon from '../../assets/common/dashboard.png';
import ExpenceIcon from '../../assets/common/wallet.png';
import { postRequest, retrieveUserId } from '../../src/utils';
import { BASE_URL, DASHBOARD, GET_LOGIN_DATA } from '../../src/constant';
import Loader from '../../src/components/Loader';
import axios from 'axios';


const Dashboard = ({ navigation, route }) => {
  const { userId, name, phoneNumber } = route.params || {};
  const [user, setUser] = useState({})
  const [dashboardData, setDashboardData] = useState({})
  const [loader, setLoader] = useState(true)
  const [isAdmin, setAdmin] = useState(false)

  useEffect(() => {
    postRequest(`${BASE_URL}${DASHBOARD}`, JSON.stringify({ id: userId }), (res, error) => {
      if (error) {
        console.log(error)
      }
      else {
        setDashboardData(res.data)
      }
      setLoader(false)
    })
    getUserType();
  }, [])

  useEffect(() => {
    if (userId) {
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
          // console.log(data);
          if (status == 0) {
            console.log('Unable to add');
          } else {
            const { user_type } = userData
            setAdmin(user_type === 'admin');
            setUser(userData)
          }
        })
        .catch(error => {
          console.error('Error submitting form:', error);
        })
        .finally(() => {
          setLoader(false);
        });
    }
  }, [])

  const getUserType = async () =>
    await retrieveUserId('user_type').then(User_type => {
      if (User_type != null) {
        setLoader(false);
        setAdmin(User_type === 'admin');
      } else {
        setLoader(false);
      }
    });

  const RowItem = ({ work }) => {
    const [total, counter, market] = dashboardData[work]
    return (
      <View style={styles.gridRow}>
        <Text style={styles.gridText}>{work}</Text>
        <Text style={styles.gridText}>{total}</Text>
        <Text style={styles.gridText}>{counter}</Text>
        <Text style={styles.gridText}>{market}</Text>
      </View>
    );
  }

  if (loader) {
    return <Loader />
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.headerText}>Dashboard</Text>

        {user.name && <View style={[styles.gridRow, { paddingHorizontal: 48, gap: 16, paddingBottom: 16 }]}>
          <Text style={[{ fontWeight: '600' }]}>{user.name}</Text>
          <Text>Phone No. {user.phone}</Text>
        </View>
        }
        <View style={styles.gridRow}>
          <Text style={styles.gridHeaderText}>Work</Text>
          <Text style={styles.gridHeaderText}>Total</Text>
          <Text style={styles.gridHeaderText}>Counter</Text>
          <Text style={styles.gridHeaderText}>Market</Text>
        </View>

        {Object.keys(dashboardData).map((work) => { return <RowItem work={work} key={work} /> })}
      </View>
      <View style={{ marginVertical: 16 }}>
        <TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate('report1')}>
          <Image source={MarketIcon} style={styles.cardImage} />
          <Text style={styles.cardText}>Marketing Man Wise Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cardContainer}>
          <Image source={ExpenceIcon} style={styles.cardImage} />
          <Text style={styles.cardText}>Daily Expenses Report</Text>
        </TouchableOpacity>

        {isAdmin && <TouchableOpacity style={styles.cardContainer}>
          <Image source={MarketIcon} style={styles.cardImage} />
          <Text style={styles.cardText}>Report for Admin only</Text>
        </TouchableOpacity>}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: 16,
    gap: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
    color: '#000'
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
  },
  gridHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000'
  },
  gridText: {
    flex: 1,
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  cardImage: {
    width: 40,
    height: 40,
    marginRight: 16,
    opacity: 0.8

  },
  cardText: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontWeight: '600',
  },
});

export default Dashboard;
