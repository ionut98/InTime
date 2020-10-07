import React from 'react';
import { TouchableOpacity, View, StyleSheet, FlatList, Text } from 'react-native';

import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  option: {
    borderColor: '#fff',
    borderWidth: 2,
    borderStyle: 'solid',
    backgroundColor: '#000',
    width: 150,
    height: 30,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  question: {
    fontSize: 25,
    color: '#fff',
    marginBottom: 40,
  },
  view: {
    width: '100%',
  },
  optionText: {
    color: '#fff',
    fontSize: 15,
  }
});

const CustomOption = ({ option, handleSelection }) => {

  return(
    <TouchableOpacity
      style={styles.option}
      onPress={() => {
        handleSelection(option.id);
      }}
    >
      <Text style={styles.optionText}>
        {option.value}
      </Text>
    </TouchableOpacity>
  );

};

CustomOption.propTypes = {
  option: PropTypes.object.isRequired,
  handleSelection: PropTypes.func.isRequired,
};

const CustomSelect = ({
  handleSelection,
  options,
  question,
}) => {

  const renderOption = ({ item }) => ( 
    <CustomOption 
      option={item}
      handleSelection={handleSelection}
    />
  );

  return (
    <>
      <Text style={styles.question}>
        {question}
      </Text>
      <FlatList
        data={options}
        renderItem={renderOption}
        keyExtractor={item => item.id}
      />
    </>
  );

};

CustomSelect.propTypes = {
  handleSelection: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  question: PropTypes.string.isRequired,
};

export default CustomSelect;
