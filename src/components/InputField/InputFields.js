import { Text, View, StyleSheet, TextInput } from 'react-native';

import { useState } from 'react';

export const InputField = ({
  showLabel,
  label,
  placeholder,
  customStyle = {},
  onChangeText = (text) => { },
  isPassword = false,
  isNumber = false,
  isError = false,
  maxLength,
}) => {
  const [value, setValue] = useState('');

  const onChangeHandler = (text) => {
    setValue(text);
    onChangeText(text);
  };
  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.paragraph}>{label}</Text>}
      <TextInput
        placeholder={placeholder ? placeholder : ''}
        value={value}
        onChangeText={(text) => {
          onChangeHandler(text);
        }}
        style={[styles.inputField, customStyle, { borderColor: isError ? "red" : "black" }]}
        secureTextEntry={isPassword}
        {...(isNumber
          ? { keyboardType: 'numeric', maxLength: maxLength }
          : {})}
      />
      {isError && label && <Text style={[styles.paragraph, { color: 'red', fontSize: 12, fontWeight: '500' }]}>Invalid {label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputField: {
    borderWidth: 1,
    padding: 4,
    paddingHorizontal:8,
    height: 30,
    borderRadius: 4,
    fontWeight:"500"
  },
  container: {},
  paragraph: {
    marginLeft: 4,
    marginBottom: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default InputField;
