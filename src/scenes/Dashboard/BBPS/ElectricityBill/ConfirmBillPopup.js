import React, { useState, } from 'react';
import Modal from 'react-native-modal'

import { View, TouchableOpacity, Platform, Linking, Text, StyleSheet, ScrollView, Image, FlatList } from "react-native";
import CardView from 'react-native-cardview';
import { colors, strings, width } from '../../../../App';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../../common/Colors';
import Strings from '../../../../common/Strings';

export function ConfirmBillPopup(isVisible, isNO, isYes, PrimaryColor, SecondaryColor, DTH_Name, DTH_Icon, Paralist, BillAmount) {
    const renderItem = ({ item }) => {
        return (
            <View style={styles.item}>
                <Text style={styles.label}>{item.PARAMNAME}: {item.BILLERPARAVALUE} </Text>
            </View>
        );
    }

    return (
        <Modal
            isVisible={isVisible}
            backdropOpacity={0.8}
            onBackdropPress={() => { isNO() }}
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

                            <View style={styles.viewContainer}>
                                <Text style={styles.title}>
                                    Please Confirm the parameters!
                                </Text>
                                <View style={styles.itemContainer}>
                                    <View style={styles.textContainer}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.username}>{DTH_Name}</Text>
                                    </View>
                                    <View style={styles.container1}>
                                        <Image source={DTH_Icon} style={styles.image1} />
                                    </View>
                                </View>
                                <FlatList
                                    data={Paralist}
                                    renderItem={renderItem}
                                />
                                {BillAmount !== '' ?
                                    (
                                        <View style={styles.item}>
                                            <Text style={styles.label}>Bill Amount :  {Strings.rupee + BillAmount}</Text>
                                        </View>
                                    ) : null}

                                <View style={styles.buttonContainer}>

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
    viewContainer: {
        padding: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: '900',
        color: colors.btnColor,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 10
    },
    textContainer: {
        flex: 1
    },
    TextStyle: {
        fontSize: 16,
        fontFamily: strings.fontMedium,
        fontWeight: "500",
        color: "#252525",
        textAlign: "left",
        opacity: 0.8,
    },
    CancelBtnstyle:
    {
        width: width - 50,
        justifyContent: 'center',
        borderRadius: 12,
        flex: 1,
        marginRight: 9,
        borderWidth: 1,
        height: 40
    },
    ButtonTextStyle:
    {
        alignSelf: 'center',
        color: colors.btnColor,
        fontFamily: strings.fontBold,
        fontSize: 15
    },
    textContainer: {
        flex: 1,
        paddingRight: 10
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center'
    },
    container1: {
        width: 40,
        height: 40,
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    image1: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',

    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20
    },
});