import React, { Component, useEffect, useState } from 'react';
import Modal from 'react-native-modal'

import { FlatList, View, Image, TouchableOpacity, Platform, Linking, Text, SectionList } from "react-native";
import CardView from 'react-native-cardview';
import Arrowdown from '../assets/icons//dashboardIcons/arrow_down.svg'
// import Arrowdown from '../../assets/icons/dashboardIcons/arrow_down.svg'
import { colors, strings, width } from '../App';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
// import Colors from '../common/Colors';

export function QuickPayCustomPopupDropDownForLoan(isVisible, accTypes, onSelectAccount, labelText, labelValue, availableBalance) {
     console.log("AccType===========labelText: ", JSON.stringify(accTypes))
    //  console.log("AccType===========labelValue: ",labelValue)

    return (
        <Modal isVisible={isVisible}
            backdropOpacity={0.8}
            onBackdropPress={() => onSelectAccount(labelValue, availableBalance)}
            onBackButtonPress={() => onSelectAccount(labelValue, availableBalance)}

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
                                {labelText}

                            </Text>
                            <Text style={{
                                color: '#252525',
                                marginLeft: 15,
                                fontSize: 15,
                                fontFamily: strings.fontMedium
                            }}>
                                Select {labelText}
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
                    contentContainerStyle={{ justifyContent: 'center' }}
                    renderItem={({ item, index }) => (
                        <View>
                            {['SAVING ACCOUNT', 'LOAN ACCOUNT', 'CURRENT ACCOUNT'].includes(item.title) && (
                                <Text style={{
                                    color: '#252525',
                                    marginTop: 10,
                                    paddingLeft: 2,
                                    fontSize: 12,
                                    fontFamily: strings.fontMedium
                                }}>{item.title}</Text>
                            )}
                            
                            {['SAVING ACCOUNT', 'LOAN ACCOUNT', 'CURRENT ACCOUNT'].includes(item.title) && (
                            <FlatList
                                data={item.data}
                                renderItem={({ item, index }) => (
                                        <View
                                            style={{
                                                backgroundColor: colors.white,
                                                justifyContent: 'center',
                                                marginRight: 10,
                                                marginTop: 10
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    
                                                    onSelectAccount(item.label, item.bal, item.acmastcode, item.acName, item.debitStop, item.min_bal, item.min_bal_req, item.DEBIT_GL_TYPE, item.acType)
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

                                                    {item.bal && (
                                                        <View style={{
                                                            alignItems: 'center',
                                                            alignContent: 'center',
                                                            justifyContent: 'center',
                                                            marginHorizontal: 10
                                                        }} >
                                                            <Text style={{ color: 'black' }} >{item.bal}</Text>
                                                        </View>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    
                                )}
                            />
                            )}
                        </View>
                    )}
                />
            </View>
        </Modal>
    );
}