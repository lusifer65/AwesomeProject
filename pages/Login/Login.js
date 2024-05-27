import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import LoginIcon from '../../assets/common/Login.png';
import InputField from '../../src/components/InputField/InputFields';
import {useEffect, useState} from 'react';
import {retrieveUserId, storeUserId} from '../../src/utils';
import Loader from '../../src/components/Loader';
import {BASE_URL, LOGIN} from '../../src/constant';

const defaultErrorState = {
  phone: false,
  password: false,
};

export const Login = ({navigation}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [inputError, setInputError] = useState({...defaultErrorState});

  useEffect(() => {
    const getUserId = async () =>
      await retrieveUserId().then(id => {
        if (id != null) {
          setLoading(false);
          navigation.navigate('dashboard', {userId: id});
        } else {
          setLoading(false);
        }
      });
    getUserId();
  }, []);

  const getLogin = () => {
    setLoading(true);
    const bodyFormData = new FormData();
    bodyFormData.append('phone', phone);
    bodyFormData.append('password', password);
    axios({
      method: 'post',
      url: `${BASE_URL}${LOGIN}`,
      data: bodyFormData,
      headers: {'Content-Type': 'multipart/form-data'},
    })
      .then(response => {
        const {data} = response;
        const {message, myData, status} = data;
        if (status == 0) {
          console.log('Invalid credentials');
          setInputError({phone: true, password: true});
        } else {
          console.log('Login Success');
          console.log(myData);
          const {user_id,user_type} = myData;
          storeUserId(`${user_id}`);
          storeUserId(user_type,'user_type');
          navigation.navigate('dashboard');
        }
      })
      .catch(error => {
        console.error('Error submitting form:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSignIn = () => {
    setInputError({...defaultErrorState});
    if (!phone || !password || phone.length < 10) {
      setInputError({
        password: !password,
        phone: !phone || phone.length < 10,
      });
      //
    } else {
      getLogin();
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Image source={LoginIcon} style={styles.imageConatiner} />
      <Text style={styles.headerText}>Login</Text>
      <InputField
        showLabel
        label={'Phone Number'}
        onChangeText={text => {
          setInputError({...inputError, phone: false});
          setPhone(text);
        }}
        isNumber
        isError={inputError.phone}
        maxLength={10}
      />
      <InputField
        showLabel
        label={'Password'}
        isPassword={true}
        onChangeText={text => {
          setInputError({...inputError, password: false});
          setPassword(text);
        }}
        isError={inputError.password}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleSignIn();
        }}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    gap: 16,
    justifyContent: 'center',
  },
  imageConatiner: {
    alignSelf: 'center',
    width: 60,
    height: 60,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  button: {
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#088',
    padding: 10,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Login;
