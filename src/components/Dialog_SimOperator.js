import React, { Component } from 'react';
import Modal from 'react-native-modal'

import { FlatList, View, Image, TouchableOpacity, Platform, Linking, Text, StyleSheet } from "react-native";
import CardView from 'react-native-cardview';
import Arrowdown from '../assets/icons/dashboardIcons/arrow_down.svg'
import { colors, strings, width } from '../App';



export function Dialog_SimOperator(isVisible, List, onSelectAccount, SelectedCircle) {

    console.log("SelectedCircle:- " +SelectedCircle)

    return (

        <Modal isVisible={isVisible}
            backdropOpacity={0.8}
            onBackdropPress={() => onSelectAccount(SelectedCircle)}
            onBackButtonPress={() => onSelectAccount(SelectedCircle)}
            animationIn={'fadeIn'}
            animationInTiming={500}
            animationOut={'fadeOut'}
            animationOutTiming={100}
        >

            <View
                style={{ borderRadius: 8, backgroundColor: "#DCDCDC80", marginVertical: 40 }}>


                {/* Heading */}
                <CardView
                    style={styles.cardStyle}
                    cardElevation={2}
                    cardMaxElevation={2}
                    cornerRadius={8}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}
                    >

                        <View style={{ flex: 1, }}>

                            <Text style={styles.MainText}> Select Operator </Text>

                        </View>

                        <View style={styles.IconStyle} >

                            <Arrowdown height={15} width={15} />

                        </View>
                    </View>
                </CardView>


                <FlatList
                    data={List}

                    style={styles.FlatListStyle}

                    renderItem={({ item }) => (

                        <TouchableOpacity
                            onPress={() => {
                                console.log(isVisible)
                                onSelectAccount(item)

                            }}
                        >

                            <View style={{ flexDirection: 'row', paddingHorizontal: 4, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#ddd', alignItems: 'center' }}>


                                <View style={styles.container1}>
                                    <Image source={item.Logo} style={styles.image1} />
                                </View>

                                <View style={{ flex: 4, marginLeft: 20 }}>

                                    <Text style={styles.username}>{item.OperatorName}</Text>


                                </View>

                            </View>


                        </TouchableOpacity>


                    )}
                />

            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    cardStyle:
    {
        height: 45,
        width: '100%',
        borderRadius: 8,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    MainText:
    {
        color: '#252525',
        marginLeft: 15,
        fontSize: 15,
        fontFamily: strings.fontMedium
    },
    IconStyle:
    {
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },
    ItemSepraterr:
    {
        height: 0.5,
        width: '90%',
        backgroundColor: colors.backgroundColor,
        alignSelf: 'center'
    },
    FlatListStyle:
    {
        backgroundColor: colors.white,
        borderRadius: 8,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 10
    },
    container1: {
        width: 25,
        height: 25,
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
    username: {
        fontSize: 12,
        fontWeight: '500',
        color: '#000'
    },
})