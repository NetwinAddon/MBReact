import React, { Component } from 'react';
import Modal from 'react-native-modal'

import { FlatList, View, Image, TouchableOpacity, Platform, Linking, Text } from "react-native";
import CardView from 'react-native-cardview';
import Arrowdown from '../assets/icons//dashboardIcons/arrow_down.svg'
// import Arrowdown from '../../assets/icons/dashboardIcons/arrow_down.svg'
import { colors, strings } from '../App';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
// import Colors from '../common/Colors';

export function selectAccount(isVisible, accTypes, onSelectAccount, labelText, labelValue, from) {

    // { console.log("from:- " + from) 
    // console.log("accType:- " + JSON.stringify(accTypes)) 

    const Type = from

    return (

        <Modal isVisible={isVisible}
            backdropOpacity={0.8}
            onBackdropPress={() => onSelectAccount(labelValue)}
            onBackButtonPress={() => onSelectAccount(labelValue)}
            animationIn={'fadeIn'}
            animationInTiming={500}
            animationOut={'fadeOut'}
            animationOutTiming={100}
        >

            <View
                style={{
                    //  height: 100, 
                    borderRadius: 8,
                    backgroundColor: "#DCDCDC80",
                    // padding: 12,

                }}>

                <CardView
                    style={{
                        // overflow: 'hidden',
                        height: 45,
                        width: '100%',
                        borderRadius: 8,
                        // marginTop: -25,
                        backgroundColor: colors.white,
                        justifyContent: 'center',
                        alignItems: 'center',
                        // marginBottom : 10,

                    }}
                    cardElevation={2}
                    cardMaxElevation={2}
                    cornerRadius={8}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    // onPress={() => this.setState({ isModalVisible: true })}
                    >

                        <View style={{ flex: 1, }}>
                            <Text style={{
                                color: '#25252580',
                                marginLeft: 15,
                                fontSize: 10,
                                fontFamily: strings.fontMedium
                            }}>
                                {labelText}
                            </Text>
                            <Text style={{
                                color: '#252525',
                                marginLeft: 15,
                                fontSize: 15,
                                fontFamily: strings.fontMedium
                            }}>
                                {labelValue}
                            </Text>
                        </View>

                        <View style={{
                            alignItems: 'center',
                            alignContent: 'center',
                            justifyContent: 'center',
                            marginHorizontal: 10
                        }} >
                            <Arrowdown height={15} width={15} />
                        </View>
                    </View>
                </CardView>

                {
                    Type === 'ListTypeDesign' ?
                        (
                            // For Time Period Of Statement Download DropDown list
                            <FlatList
                                data={accTypes}
                                ItemSeparatorComponent={() => {
                                    return (
                                        // Flat List Item Separator
                                        <View
                                            style={{
                                                height: 0.5,
                                                width: '90%',
                                                backgroundColor: colors.backgroundColor,
                                                alignSelf: 'center'
                                            }}
                                        />
                                    );
                                }}
                                style={{
                                    backgroundColor: colors.white,
                                    borderRadius: 8,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    margin: 10
                                }}
                                renderItem={({ item }) =>

                                    <TouchableOpacity
                                        onPress={() => {
                                            console.log(isVisible)
                                            onSelectAccount(item.label)

                                        }}
                                    >

                                        <View style={{
                                            flexDirection: 'row',
                                        }}>
                                            <View style={{ flex: 1 }}>

                                                <Text style={{ color: '#252525', padding: 10 }}>
                                                    {item.label}
                                                </Text>
                                            </View>
                                        </View>

                                    </TouchableOpacity>
                                }
                            />)
                        :
                        (
                            // For Banking Home Screen DropDown list
                            <FlatList
                                data={accTypes}
                                ItemSeparatorComponent={() => {
                                    return (
                                        // Flat List Item Separator
                                        <View
                                            style={{
                                                height: 0.5,
                                                width: '90%',
                                                backgroundColor: colors.backgroundColor,
                                                alignSelf: 'center'
                                            }}
                                        />
                                    );
                                }}
                                style={{
                                    backgroundColor: colors.white,
                                    borderRadius: 8,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    margin: 10
                                }}

                                renderItem={({ item }) =>
                                    <TouchableOpacity
                                        onPress={() => {
                                            console.log(isVisible)
                                            onSelectAccount(item.ACTYPE.toLowerCase(), item.GMST_CODE, item.AC_NO, item.ACMASTCODE, item.BALANCE, item)

                                        }}
                                    >
                                        {/* <Text style={{backgroundColor : 'gray', padding : 10}}> Submit</Text> */}


                                        <View style={{
                                            flexDirection: 'row',
                                        }}>
                                            <View style={{ flex: 1 }}>

                                                <Text style={{ color: '#252525', padding: 10 }}>
                                                    {item.ACTYPE.split(' ')[0]?.charAt(0).toUpperCase() + item.ACTYPE.split(' ')[0]?.slice(1).toLowerCase() || ''} A/c ****{item.AC_NO.slice(-4)}
                                                </Text>
                                            </View>

                                            {item.BALANCE && <View style={{
                                                alignItems: 'center',
                                                alignContent: 'center',
                                                justifyContent: 'center',
                                                marginHorizontal: 10
                                            }} >
                                                <Text style={{ color: 'black' }} >{item.BALANCE.startsWith('-') ? ("₹" + item.BALANCE.replace('-', '') + " Cr") : ("₹" + item.BALANCE + " Dr")}</Text>

                                            </View>}
                                        </View>

                                    </TouchableOpacity>
                                }
                            />)}




            </View>
        </Modal>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        itemkk: {
            padding: 10,
            fontSize: 18,
            height: 44,
        },
    })
}