import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import DashboardIcon from '../../../assets/common/dashboard.png';
import UserIcon from '../../../assets/common/user.png';
import WalletIcon from '../../../assets/common/wallet.png';
import LogoutIcon from '../../../assets/common/logoutIcon.png';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmPopup from '../ConfirmPopup';

const Navbar = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);

  const logoutHandler = () => {
    // AsyncStorage.clear();
    setShowModal(false)
    navigation.navigate('login');

  };
  return (
    <>
      <View style={styles.container}>
        <NavItem icon={DashboardIcon} label="Dashboard" />
        <NavItem icon={UserIcon} label="Customer" />
        <NavItem icon={WalletIcon} label="Expance" />
        <NavItem icon={LogoutIcon} label="Logout" setShowModal={setShowModal} />
      </View>

      {
        showModal && (
          <ConfirmPopup
            showModal={showModal}
            setShowModal={setShowModal}
            onPressHandler={logoutHandler}
            btnText={'Logout'}
          />
        )
      }
    </>
  );
};

const NavItem = ({ icon, label, setShowModal = () => { } }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={() => {
        if (label === 'Logout') {
          // AsyncStorage.clear();
          setShowModal(true);
          // navigation.navigate('login')
        } else {
          navigation.navigate(label.toLowerCase());
        }
      }}>
      <Image
        source={icon}
        style={styles.imageContainer}
        accessibilityLabel={label}
      />
      <Text style={styles.navItemText}>{label}</Text>
    </TouchableOpacity>
  );
};

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
