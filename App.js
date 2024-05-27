/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Navbar from './src/components/Navbar/Navbar';
import Customer from './pages/Customer/Customer';
import Expance from './pages/Expance/Expance';
import CustomerJob from './pages/Customer/components/CustomerJob';
import CustomerInformation from './pages/Customer/components/CustomerInformation';
import AddCustomer from './pages/Customer/components/AddCustomer';
import ManWiseReport from './pages/Reports/ManWiseReport';
import SalesReport from './pages/Reports/SalersReport';



const Stack = createStackNavigator();
function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'login'}
        screenOptions={{
          header: Navbar
        }}
      >
        <Stack.Screen name="dashboard" component={Dashboard} />
        <Stack.Screen name="customer" component={Customer} />
        <Stack.Screen name="expance" component={Expance} />
        <Stack.Screen name="customerInformation" component={CustomerInformation} />
        <Stack.Screen name="customerJob" component={CustomerJob} />
        <Stack.Screen name="addCustomer" component={AddCustomer} />
        <Stack.Screen name="report1" component={ManWiseReport} />
        <Stack.Screen name="sales_report1" component={SalesReport} />





        <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
