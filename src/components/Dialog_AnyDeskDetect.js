import React, { useState } from 'react';
import Modal from 'react-native-modal'

import { View, TouchableOpacity, Platform, Linking, Text, StyleSheet, ScrollView, Image } from "react-native";
import CardView from 'react-native-cardview';
import { colors, strings, width } from '../App';
import { useNavigation } from '@react-navigation/native';
import Strings from '../common/Strings';
import Exclemation from '../assets/icons/exclamation_icon.svg';
import AnyDeskIcon from '../assets/icons/ic_anydeskicon.svg';

export function Dialog_AnyDeskDetect(isVisible, isUninstall, isOK, themecolor) {

    const color = themecolor;

    console.log("color" + color);
    return (

        <Modal
            isVisible={isVisible}
            backdropOpacity={0.8}
            // onBackdropPress={() => { isOK() }}
            // onBackButtonPress={() => { isOK() }}
            animationIn={'fadeIn'}
            animationInTiming={500}
            animationOut={'fadeOut'}
            animationOutTiming={100}>

            <View style={styles.cardViewstyle}>



                <Text
                    style={{ fontWeight: 'bold', color: 'black', fontSize: 24, textAlign: 'center', marginBottom: 14 }}>
                    Security Alert !
                </Text>


                <Exclemation height={35} width={35} color={'#FFBF00'} />


                <Text
                    style={styles.TextMessageStyle}>
                    Your phone has an application capable of recording screens and pilfering confidential data.
                </Text>


                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <AnyDeskIcon style={{ width: 40, height: 40, }} />


                    <Text
                        style={{ fontWeight: 'bold', color: 'black', fontSize: 18, marginLeft: 10 }}>
                        AnyDesk
                    </Text>


                </View>



                <View style={{ flexDirection: 'column', marginTop: 15, width: '100%' }}>
                    {/* <TouchableOpacity
                        style={styles.Touchablestyle}

                        onPress={() => { isYes() }}>


                        <Text style={styles.TextOptionStyle}>
                            Yes
                        </Text>
                        
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.Touchablestyle}

                        onPress={() => { isNO() }}>

                        <Text style={styles.TextOptionStyle}>
                            No
                        </Text>

                    </TouchableOpacity> */}


                    <CardView
                        cardElevation={3}
                        cardMaxElevation={3}
                        cornerRadius={10}
                        style={{ marginTop: 10, justifyContent: 'center',  }}>

                        <TouchableOpacity
                            style={{ borderRadius: 10, backgroundColor: themecolor, }}

                            onPress={() => { isOK() }}>

                            <Text style={styles.TextOptionStyle}>
                                Its Okay
                            </Text>


                        </TouchableOpacity>

                    </CardView>


                    <CardView
                        cardElevation={3}
                        cardMaxElevation={3}
                        cornerRadius={10}
                        style={{ marginTop: 10, justifyContent: 'center', }}>

                        <TouchableOpacity
                            style={{ borderRadius: 10, backgroundColor: themecolor, }}

                            onPress={() => { isUninstall() }}>

                            <Text style={styles.TextOptionStyle}>
                                Uninstall App
                            </Text>


                        </TouchableOpacity>

                    </CardView>



                </View>

            </View>

        </Modal>
    );

}
const styles = StyleSheet.create({


    cardViewstyle:
    {
        width: '100%',
        borderRadius: 8,
        backgroundColor: colors.white,
        padding: 15,
        flexDirection: 'column',
        alignItems: 'center'

    },

    TextMessageStyle:
    {
        paddingVertical: 16,
        paddingHorizontal: 15,
        color: colors.themeColorBlue,
        fontSize: 14,
        fontWeight: '400'

    },

    TextOptionStyle:
    {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginVertical: 10,

    },
    Touchablestyle:
    {
        borderTopColor: colors.themeColor,
        borderTopWidth: 1,
        paddingVertical: 12,
        flex: 1,
        borderLeftWidth: 1,
        borderLeftColor: colors.themeColor,
    }

});