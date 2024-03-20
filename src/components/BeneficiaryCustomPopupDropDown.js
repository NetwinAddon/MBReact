import React, { Component, useEffect, useState } from 'react';
import Modal from 'react-native-modal'

import { FlatList, View, Image, TouchableOpacity, Platform, Linking, Text, SectionList } from "react-native";
import CardView from 'react-native-cardview';
import Arrowdown from '../assets/icons//dashboardIcons/arrow_down.svg'
// import Arrowdown from '../../assets/icons/dashboardIcons/arrow_down.svg'
import { colors, strings, width } from '../App';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
// import Colors from '../common/Colors';

export function BeneficiaryCustomPopupDropDown(isVisible, accTypes, onSelectAccount, labelText, labelValue, availableBalance) {
    //  console.log("AccType===========111: ", JSON.stringify(accTypes))
    return (
        <Modal isVisible={isVisible}
            backdropOpacity={0.8}
            onBackdropPress={() => onSelectAccount()}
            onBackButtonPress={() => onSelectAccount()}
            
            animationIn={'fadeIn'}
            animationInTiming={500}
            animationOut={'fadeOut'}
            animationOutTiming={100}
        >
            <View
                style={{
                    //  height: 100, 
                    borderRadius: 8,
                    backgroundColor: "#f3f3f3",
                    // padding: 12,

                }}>

                <CardView
                    style={{
                        // overflow: 'hidden',
                        height: 45,
                        width: '100%',
                        borderRadius: 8,
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
                                Credit A/c
                            </Text>
                            <Text style={{
                                color: '#252525',
                                marginLeft: 15,
                                fontSize: 15,
                                fontFamily: strings.fontMedium
                            }}>
                                Select Credit A/c
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
                <FlatList
                    data={accTypes}
                    style={{
                        width: '100%',
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingBottom: 10,
                    }}
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
                    contentContainerStyle={{ justifyContent: 'center' }}
                    renderItem={({ item, index }) => (
                        <View>
                            <Text style={{
                                color: '#252525',
                                marginTop:10,
                                paddingLeft: 2,
                                fontSize: 12,
                                fontFamily: strings.fontMedium
                            }}>{item.title}</Text>
                            <FlatList
                                data={item.data}
                                renderItem={({ item, index }) => <View
                                    style={{
                                        backgroundColor: colors.white,
                                        justifyContent: 'center',
                                        marginRight: 10,
                                        marginTop: 10
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            console.log(isVisible)
                                            onSelectAccount(item.label, item.bal, item.acmastcode, item.acName, item.CREDIT_GL_TYPE, item.AC_TYPE, item.bBranchCode, item.AC_DUE_DT)
                                        }}

                                    >
                                        <View style={{
                                            flexDirection: 'row',

                                        }}>
                                            <View style={{
                                                flex: 1
                                            }}>
                                                <Text style={{ color: '#252525', padding: 10 }}>
                                                    {item.label}
                                                </Text>
                                            </View>

                                            {/* {item.bal && <View style={{
                                                alignItems: 'center',
                                                alignContent: 'center',
                                                justifyContent: 'center',
                                                marginHorizontal: 10
                                            }} >
                                                <Text style={{ color: 'black' }} >{item.bal}</Text>
                                            </View>} */}
                                        </View>
                                    </TouchableOpacity>
                                </View>}
                            />
                        </View>)}
                />
            </View>
        </Modal>
    );
}