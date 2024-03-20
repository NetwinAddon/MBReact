import React, { useState } from 'react';
import Modal from 'react-native-modal'

import { View, TouchableOpacity, Platform, Linking, Text, StyleSheet, ScrollView } from "react-native";
import CardView from 'react-native-cardview';
import { colors, strings, width } from '../App';
import { useNavigation } from '@react-navigation/native';
import Colors from '../common/Colors';
import Strings from '../common/Strings';

export function DialogLogout(isVisible, isNO, isYes, themecolor) {

    const color = themecolor;

    return (

        <Modal
            isVisible={isVisible}
            backdropOpacity={0.8}
            onBackdropPress={() => { isNO() }}
            onBackButtonPress={() => { isNO()  }}
            animationIn={'fadeIn'}
            animationInTiming={500}
            animationOut={'fadeOut'}
            animationOutTiming={100}>

            <View style={styles.cardViewstyle}>

                <Text
                    style={[styles.TextHeadingStyle,{ backgroundColor: color}]}>
                    {Strings.okdialogHeader}
                </Text>

                <Text
                    style={styles.TextMessageStyle}>
                    Are you sure you want to  {'\n'}log-out?
                </Text>


                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
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

                    </TouchableOpacity>
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
    },


    TextHeadingStyle:
    {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 12,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        fontSize: 18,
    },

    TextMessageStyle:
    {
        textAlign: 'center',
        paddingVertical: 16,
        paddingHorizontal: 15,
        color: colors.themeColorBlue,
        fontSize: 16,
        fontWeight: '500'

    },

    TextOptionStyle:
    {
        textAlign: 'center',
        color: colors.themeColorBlue,
        fontSize: 16,
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