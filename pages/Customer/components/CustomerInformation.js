import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import CustomerJob from './CustomerJob';
import JobRate from './Children/JobRate';
import CustomerPayment from './CustomerPayment';

const CustomerInformation = ({ route }) => {
  const { cust_id, name, due, received, pageName } = route.params || {};

  const renderMainContent = () => {
    switch (pageName) {
      case 'customerRate':
        return <CustomerJob customer_id={cust_id} />;
      case 'jobRate':
        return <JobRate customer_id={cust_id} />;
      case 'customerPayment':
        return <CustomerPayment customer_id={cust_id} />;
      default:
        return null;
    }
  };
  const getHeading = () => {
    switch (pageName) {
      case 'customerRate':
        return "Customer Job";
      case 'jobRate':
        return "Customer Rate";
      case 'customerPayment':
        return "Customer Payments";
      default:
        return null;
    }
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.headerText}>{getHeading()}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.boldFont}>{name}</Text>
          {[{ label: 'Received', value: received }, { label: 'Due', value: due }].map((item, index) => (
            <View key={index}>
              <Text style={styles.boldFont}>{item.label}</Text>
              <Text style={styles.textStyle}>{parseFloat(item.value).toFixed(2)}</Text>
            </View>
          ))}
        </View>
        <View style={styles.amountContainer}>
          <View>
            <Text style={styles.boldFont}>Bank</Text>
            <Text style={styles.textStyle}>1000</Text>
          </View>
          <View>
            <Text style={styles.boldFont}>Cash</Text>
            <Text style={styles.textStyle}>2000</Text>
          </View>
        </View>
      </View>
      {renderMainContent()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 6,
  },
  boldFont: {
    fontSize: 16,
    fontWeight: '500',
  },
  textStyle: {
    textAlign: 'center',
    color: 'blue',
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    justifyContent: 'center',
    gap: 32,
  },
});

export default CustomerInformation;
