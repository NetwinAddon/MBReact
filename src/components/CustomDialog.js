import React, { Component } from 'react';
import Modal from 'react-native-modal'

import { FlatList, View, Image, TouchableOpacity, Platform, Linking, Text, StyleSheet } from "react-native";
import CardView from 'react-native-cardview';
import Arrowdown from '../assets/icons//dashboardIcons/arrow_down.svg'
import { colors, strings } from '../App';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export function selectAccount(isVisible, accTypes, onSelectAccount, labelText, labelValue, from) {

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
                style={{ borderRadius: 8, backgroundColor: "#DCDCDC80", marginVertical: 40}}>

                {/* Heading */}
                <CardView
                    style={styles.cardStyle}
                    cardElevation={2}
                    cardMaxElevation={2}
                    cornerRadius={8}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}
                    // onPress={() => this.setState({ isModalVisible: true })}
                    >

                        <View style={{ flex: 1, }}>

                            <Text style={styles.SmallText}> {labelText} </Text>

                            <Text style={styles.MainText}>  {labelValue} </Text>
                        </View>

                        <View style={styles.IconStyle} >

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
                                        <View
                                            style={styles.ItemSepraterr}
                                        />
                                    );
                                }}
                                style={styles.FlatListStyle}

                                renderItem={({ item }) =>

                                    <TouchableOpacity
                                        onPress={() => {
                                            console.log(isVisible)
                                            onSelectAccount(item.label, item.value)

                                        }}
                                    >

                                        <View style={{ flexDirection: 'row', }}>

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

                        Type === 'Theme' ?
                            (
                                <FlatList
                                    data={accTypes}
                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View
                                                style={styles.ItemSepraterr} />);
                                    }}
                                    style={styles.FlatListStyle}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity
                                            onPress={() => {
                                                console.log(isVisible)
                                                onSelectAccount(item.label)

                                            }}>


                                            <View style={{ flexDirection: 'row', }}>

                                                <View style={{ flex: 1 }}>

                                                    <Text style={{ color: '#252525', padding: 10 }}>

                                                        {item.label}

                                                    </Text>
                                                </View>


                                            </View>

                                        </TouchableOpacity>
                                    }
                                />
                            )
                            :

                            Type === 'Account' ?
                                (
                                    <FlatList
                                        data={accTypes}
                                        ItemSeparatorComponent={() => {
                                            return (
                                                <View
                                                    style={styles.ItemSepraterr} />);
                                        }}
                                        style={styles.FlatListStyle}
                                        renderItem={({ item }) =>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    console.log(isVisible)
                                                    onSelectAccount(item)

                                                }}>


                                                <View style={{ flexDirection: 'row', }}>

                                                    <View style={{ flex: 1, }}>

                                                        <Text style={{ color: '#252525', padding: 10 }}>

                                                            {item.ACTYPE.split(' ')[0]?.charAt(0).toUpperCase() + item.ACTYPE.split(' ')[0]?.slice(1).toLowerCase() || ''} A/c -- {item.AC_NO}

                                                        </Text>





                                                    </View>


                                                </View>

                                            </TouchableOpacity>
                                        }
                                    />
                                )
                                :

                                Type === 'Circle' ?
                                    (
                                        <FlatList
                                            data={accTypes}
                                            ItemSeparatorComponent={() => {
                                                return (
                                                    <View
                                                        style={styles.ItemSepraterr} />);
                                            }}
                                            style={styles.FlatListStyle}
                                            renderItem={({ item }) =>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        console.log(isVisible)
                                                        onSelectAccount(item)

                                                    }}>


                                                    <View style={{ flexDirection: 'row', }}>

                                                        <View style={{ flex: 1 }}>

                                                            <Text style={{ color: '#252525', padding: 10 }}>

                                                                {item.circle_name}

                                                            </Text>
                                                        </View>


                                                    </View>

                                                </TouchableOpacity>
                                            }
                                        />
                                    )
                                    :


                                    (
                                        <FlatList
                                            data={accTypes}
                                            ItemSeparatorComponent={() => {
                                                return (
                                                    // Flat List Item Separator
                                                    <View
                                                        style={styles.ItemSepraterr}
                                                    />
                                                );
                                            }}
                                            style={styles.FlatListStyle}
                                            renderItem={({ item }) =>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        console.log(isVisible)
                                                        onSelectAccount(item.label)

                                                    }}
                                                >
                                                    {/* <Text style={{backgroundColor : 'gray', padding : 10}}> Submit</Text> */}


                                                    <View style={{ flexDirection: 'row', }}>

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
                                                            <Text style={{ color: 'black' }} >{item.BALANCE}</Text>
                                                        </View>}
                                                    </View>

                                                </TouchableOpacity>
                                            }
                                        />

                                    )}




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
    SmallText:
    {
        color: '#25252580',
        marginLeft: 15,
        fontSize: 10,
        fontFamily: strings.fontMedium
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
    }
})