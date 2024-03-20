import React, { useState,   } from 'react';
import Modal from 'react-native-modal'

import { View, TouchableOpacity, Platform, Linking, Text, StyleSheet, ScrollView, Image } from "react-native";
import CardView from 'react-native-cardview';
import { colors, strings, width } from '../App';
import { useNavigation } from '@react-navigation/native';
import Colors from '../common/Colors';
import Strings from '../common/Strings';

export function Dialog_DTH_Payment(isVisible, isNO, isYes, PrimaryColor, SecondaryColor,DTH_Name,DTH_Icon, BillAmt,PlatformCharges) {

    const charges = PlatformCharges;
    const TotalAmt = parseFloat(BillAmt) + parseFloat(charges);

    return (

        <Modal
            isVisible={isVisible}
            backdropOpacity={0.8}
            onBackdropPress={() => { isNO()}}
            onBackButtonPress={() => { isNO() }}
            animationIn={'fadeIn'}
            animationInTiming={500}
            animationOut={'fadeOut'}
            animationOutTiming={100}>

            <View>
                <View >
                    <View style={styles.modalContent}>
                        <CardView
                            style={styles.CardStyle}
                            cardElevation={2}
                            cardMaxElevation={2}
                            cornerRadius={8}>
                                
                            <View style={{  padding: 15 }}>



                                <View style={{flexDirection: 'row',alignItems: 'center',}}>


                                    <View style={styles.textContainer}>

                                        <Text style={styles.username}>{DTH_Name}</Text>

                                    </View>



                                    <View style={styles.container1}>
                                        <Image source={DTH_Icon} style={styles.image1} />
                                    </View>

                                </View>

                                <Text style={styles.TextStyle}>

                                Amount: { BillAmt +' + '+ charges +' = ' + TotalAmt}

                                </Text>

                                <View style={{ flexDirection: 'row', marginTop: 20 }}>

                                    <TouchableOpacity
                                        style={[styles.CancelBtnstyle, { borderColor: PrimaryColor, }]}

                                        onPress={() => { isNO() }}>

                                        <Text style={[styles.ButtonTextStyle, { color: PrimaryColor }]}> Cancel </Text>

                                    </TouchableOpacity>


                                    <TouchableOpacity
                                        style={[styles.CancelBtnstyle, { backgroundColor: PrimaryColor, borderColor: PrimaryColor, }]}

                                        onPress={() => { isYes() }}>

                                        <Text style={[styles.ButtonTextStyle, { color: 'white' }]}> Confirm </Text>

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

    modalContent: {
        padding: 8,
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: 'white',
    },
    CardStyle:
    {
        width: '100%',
        borderRadius: 8,
        backgroundColor: colors.white,
    },

    TextStyle: {
        marginTop: 14,
        fontSize: 11,
        fontFamily: strings.fontMedium,
        fontSize: 18,
        fontWeight: "500",
        color: "#252525",
        textAlign: "left",
        opacity: 0.8
    },
    CancelBtnstyle:
    {

        width: width - 50,
        justifyContent: 'center',
        borderRadius: 12,
        flex: 1,
        marginRight: 9,
        borderWidth: 1,
        height: 45

    },
    ButtonTextStyle:
    {
        alignSelf: 'center',
        color: colors.btnColor,
        fontFamily: strings.fontBold,
        fontSize: 15
    },
    textContainer: {
        flex: 2,

    },
    username: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000',
        textAlign:'center'
    },
    container1: {
        width: 50,
        height: 50,
        borderRadius: 50, // Half of the width and height to make it circular
        overflow: 'hidden',
        elevation: 5, // Set the elevation for the shadow effect
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    image1: {
        width: '100%', // 90% of the container width
        height: '100%', // 90% of the container height
        resizeMode: 'cover',

    },

});