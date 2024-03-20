import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import {
    strings,
    width,
} from '../App';
import { connect, mapDispatchToProps, mapStateToProps } from '../redux';
import { RadioButton } from 'react-native-paper';


class CustomRadioGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: null,
        };
    }

    handleOptionSelect = (option) => {
        this.setState({ selectedOption: option });
        this.props.onSelect(option); // Pass the selected option to parent component if needed
    };

    render() {
        const { options } = this.props;
        const { selectedOption } = this.state;

        return (
            <View style={styles.container}>
                {options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.optionButton,
                            selectedOption === option.value && styles.optionButtonSelected,
                        ]}
                        onPress={() => {
                            this.handleOptionSelect(option.value)
                            console.log("index is================ ", index, option.value)
                        }}
                    >
                        <View
                            style={{
                                marginTop: 15,
                                width : width -50
                            }}
                        >
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                // marginBottom: 10,
                                // backgroundColor : 'red',
                                padding: 8,
                                paddingLeft: 7,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: '#d9d9d9',
                                
                            }}>
                                <RadioButton
                                    value={option.label}
                                    disabled={option.value != this.state.selectedOption ? true : false}
                                    status={option.value == this.state.selectedOption ? 'checked' : 'unchecked'}
                                    // onPress={() => this.handleOptionSelect(option.value)}
                                    borderColor='black'
                                    color={this.props.themeColor} // Set the fill color to black
                                    theme={{
                                        colors: 'primary'
                                    }}
                                />
                                <View>
                                    <Text style={{
                                        color: 'black',
                                        fontFamily: strings.fontBold,
                                        padding: 3
                                    }}>{option.label}</Text>
                                    <Text style={{
                                        color: 'black',
                                        fontFamily: strings.fontRegular,
                                        paddingBottom: 3,
                                        paddingLeft: 3
                                    }}>{option.number}</Text>
                                </View>
                            </View>

                        </View>

                    </TouchableOpacity>
                ))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // flex : 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginVertical: 10,

    },
    optionButton: {
        // flex : 1,
        width: width - 40,
        // paddingHorizontal: 16,
        // marginTop: 10,
        // paddingVertical: 10,
        borderRadius: 8,
        marginHorizontal: 5,
        // backgroundColor: '#f0f0f0',
    },
    optionButtonSelected: {
        // backgroundColor: '',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomRadioGroup);
