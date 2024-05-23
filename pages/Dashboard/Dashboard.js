import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import MarketIcon from '../../assets/common/dashboard.png';
import ExpenceIcon from '../../assets/common/wallet.png';
import { postRequest } from '../../src/utils';
import { BASE_URL, DASHBOARD } from '../../src/constant';
import Loader from '../../src/components/Loader';


const Dashboard = ({ route }) => {
  const { userId } = route.params || {};
  const [dashboardData, setDashboardData] = useState({})
  const [loader, setLoader] = useState(true)

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
  }, [])

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

        <View style={styles.gridRow}>
          <Text style={styles.gridHeaderText}>Work</Text>
          <Text style={styles.gridHeaderText}>Total</Text>
          <Text style={styles.gridHeaderText}>Counter</Text>
          <Text style={styles.gridHeaderText}>Market</Text>
        </View>

        {Object.keys(dashboardData).map((work) => { return <RowItem work={work} key={work} /> })}
      </View>
      <View style={{ marginVertical: 16 }}>
        <TouchableOpacity style={styles.cardContainer} >
          <Image source={MarketIcon} style={styles.cardImage} />
          <Text style={styles.cardText}>Marketing Man Wise Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cardContainer}>
          <Image source={ExpenceIcon} style={styles.cardImage} />
          <Text style={styles.cardText}>Daily Expenses Report</Text>
        </TouchableOpacity>

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
    marginBottom: 16,
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
