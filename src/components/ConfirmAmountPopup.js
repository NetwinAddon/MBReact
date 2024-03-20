import React, { useState } from 'react';
import Modal from 'react-native-modal'

import { View, TouchableOpacity, Platform, Linking, Text, StyleSheet, ScrollView } from "react-native";
import CardView from 'react-native-cardview';
// import Arrowdown from '../../assets/icons/dashboardIcons/arrow_down.svg'
import { colors, strings, width } from '../App';
import { useNavigation } from '@react-navigation/native';
// import Colors from '../common/Colors';

export const ConfirmAmountPopup = ({ isVisible, isDisabled, MobileNumber,BillAmt, charges, from }) => {
    const navigation = useNavigation();
    console.log("from:  ",from )
    console.log("Param:  ", MobileNumber, BillAmt, charges)
    const TotalAmt = BillAmt + charges;
    return (

        <Modal isVisible={isVisible}
            backdropOpacity={0.8}
            onBackdropPress={() => isDisabled()}
            onBackButtonPress={() => isDisabled()}
            animationIn={'fadeIn'}
            animationInTiming={500}
            animationOut={'fadeOut'}
            animationOutTiming={100}
        // backdropColor='#DCDCDC'
        >

            <View>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <CardView
                            style={{
                                // overflow: 'hidden',
                                height: 185,
                                width: '100%',
                                borderRadius: 8,
                                backgroundColor: colors.white,

                                // marginBottom : 10,
                            }}
                            cardElevation={2}
                            cardMaxElevation={2}
                            cornerRadius={8}>
                            <View style={{ marginTop: 20, marginHorizontal: 19 }}>

                                <Text style={{
                                    marginTop: 14,
                                    fontSize: 11,
                                    fontFamily: strings.fontMedium,
                                    fontSize: 18,
                                    fontWeight: "500",
                                    color: "#252525",
                                    textAlign: "left",
                                    opacity: 0.8
                                }}>
                                    Mobile Number : {MobileNumber}
                                </Text>
                                <Text style={{
                                   marginTop: 12,
                                   fontSize: 11,
                                   fontFamily: strings.fontMedium,
                                   fontSize: 18,
                                   fontWeight: "500",
                                   color: "#252525",
                                   textAlign: "left",
                                   opacity: 0.8
                                   
                                }}>
                                   Amount: { BillAmt +' + '+ charges +' = ' + TotalAmt}
                                </Text>
                                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                    <TouchableOpacity
                                        style={{

                                            width: width - 50,
                                            borderColor: colors.btnColor,
                                            justifyContent: 'center',
                                            borderRadius: 12,
                                            flex: 1,
                                            marginRight: 9,
                                            borderWidth: 1,
                                            height: 45

                                        }}
                                        // onPress={() =>  this.setState({termsAndCondition : true})}
                                        onPress={() => isDisabled()}
                                    ><Text style={{
                                        alignSelf: 'center',
                                        color: colors.btnColor,
                                        fontFamily: strings.fontBold,
                                        fontSize: 15
                                    }}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{

                                            width: width - 50,
                                            backgroundColor: colors.btnColor,
                                            justifyContent: 'center',
                                            borderRadius: 12,
                                            flex: 1,
                                            marginLeft: 9,
                                            height: 45
                                        }}
                                        // onPress={() =>  this.setState({termsAndCondition : true})}
                                        onPress={() => {
                                            isDisabled()
                                            if (from === 'Add') {
                                                navigation.navigate('postpaidBillPaySuccess', { from: from });
                                            } else if (from === 'DTH') {
                                                navigation.navigate('DTHRechargeSuccess');
                                            }else if (from === 'DataCard') {
                                                navigation.navigate('dataCardPaymentSuccess');
                                            }
                                            else if (from === 'Landline') {
                                                navigation.navigate('landlineBillSuccess');
                                            }
                                        }}
                                    ><Text style={{
                                        alignSelf: 'center',
                                        color: 'white',
                                        fontFamily: strings.fontBold,
                                        fontSize: 15
                                    }}>
                                            Confirm
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </CardView>
                    </View>
                </View>
            </View>
        </Modal>
    );

}
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContainer: {
        // flex: 1,
        // backgroundColor : 'red',
        // justifyContent: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {

        // backgroundColor : 'green',
        padding: 8,
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: 'white',
    },

});