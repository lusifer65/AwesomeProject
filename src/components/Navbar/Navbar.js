import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import DashboardIcon from '../../../assets/common/dashboard.png';
import UserIcon from '../../../assets/common/user.png';
import WalletIcon from '../../../assets/common/wallet.png';
import { useNavigation } from '@react-navigation/native';


const Navbar = () => {
  return (
    <View style={styles.container}>
      <NavItem icon={DashboardIcon} label="Dashboard" />
      <NavItem icon={UserIcon} label="Customer" />
      <NavItem icon={WalletIcon} label="Expance" />
    </View>
  );
};

const NavItem = ({ icon, label, }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.navItem} onPress={() => {
      navigation.navigate(label.toLowerCase())
    }}>
      <Image
        source={icon}
        style={styles.imageContainer}
        accessibilityLabel={label}
      />
      <Text style={styles.navItemText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#9fb6c3',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  navItemText: {
    fontWeight: '500',
    marginTop: 5,
    color: '#fff',
  },
  imageContainer: {
    width: 40,
    height: 40,
  },
});

export default Navbar;
