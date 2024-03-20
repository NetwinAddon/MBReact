import React, { Component } from 'react';
import Modal from 'react-native-modal'

import { FlatList, View, Image, TouchableOpacity, Platform, Linking, Text } from "react-native";
import CardView from 'react-native-cardview';
import Arrowdown from '../../../assets/icons//dashboardIcons/arrow_down.svg'
// import Arrowdown from '../../assets/icons/dashboardIcons/arrow_down.svg'
import { colors, strings } from '../../../App';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
// import Colors from '../common/Colors';

export function DropdownPopup(isVisible, accTypes, onSelectAccount, labelText, labelValue) {

    // { console.log("Label:- " + JSON.stringify(accTypes)) }

    const Type = labelText

    return (

        <Modal isVisible={isVisible}
            backdropOpacity={0.8}
            onBackdropPress={() =>  onSelectAccount(labelValue)}
            onBackButtonPress={() =>  onSelectAccount(labelValue)}
            animationIn={'fadeIn'}
            animationInTiming={500}
            animationOut={'fadeOut'}
            animationOutTiming={100}
        // backdropColor='#DCDCDC'

        >

            <View
                style={{
                  
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
                           
                                <React.Fragment>
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
                                </React.Fragment>
                        

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
                            ItemSeparatorComponent={() => (
                                // Flat List Item Separator
                                <View
                                    style={{
                                        height: 0.5,
                                        width: '90%',
                                        backgroundColor: colors.backgroundColor,
                                        alignSelf: 'center'
                                    }}
                                />
                            )}
                            style={{
                                backgroundColor: colors.white,
                                borderRadius: 8,
                                paddingLeft: 10,
                                paddingRight: 10,
                                margin: 10
                            }}
                            renderItem={({ item }) => (
                                
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log(isVisible);
                                        onSelectAccount(item.label, item);
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
                            )}
                        />
             



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