import React, { useState } from 'react';
import Modal from 'react-native-modal'

import { View, TouchableOpacity, Platform, Linking, Text, StyleSheet, ScrollView, Image, } from "react-native";
import CardView from 'react-native-cardview';
// import Arrowdown from '../../assets/icons/dashboardIcons/arrow_down.svg'
import { assets, colors, strings, width } from '../App';
import { useNavigation } from '@react-navigation/native';
// import Colors from '../common/Colors';
import Warning from '../assets/icons/Warning.svg'

import AddToFavorites from '../assets/icons/AddToFavorites.svg'
import Constants from '../common/Constants';
import { _toEncrypt, sendData } from '../common/util';
import APIUrlConstants from '../common/APIUrlConstants';
import { RFValue } from "react-native-responsive-fontsize";



export const FavoriteMenuPopup = ({ isVisible, isDisabled, MenuName, obj }) => {
    const navigation = useNavigation();
    const [menuAdded, setMenuAdded] = useState(true);
    const [ResMSG, setResMSG] = useState('');
    const sendRequest = async () => {
        try {
            const Headers = {
                ProdCD: Constants.ProdCD,
                BankCD: Constants.BankCode,
                OprCD: 'ADDFMENU',
                Content_Type: 'application/json',
                REQ_TYPE: 'POST'
            };
            const reqParams = {
                Menu_ID: MenuName.Mid,
                Menu_Name: MenuName.name,
                Menu_Image: MenuName.name.replace(/[\s-]/g, ""),
                GMST_CODE: Constants.GMST_CODE
            };

            const Body = {
                PARACNT: "1",
                PARA1_TYP: "STR",
                PARA1_VAL: JSON.stringify(reqParams),
            }
            sendData(obj,
                'post',
                APIUrlConstants.BASE_URL,
                Headers,
                JSON.stringify(Body),
                async (obj, response) => {
                    var responseData = response

                    let res = response.SUCCESS
                    if (res === "FALSE") {
                        setResMSG(response.RESULT);
                        setMenuAdded(false);
                        setTimeout(() => {
                            isDisabled();
                        }, 2000);
                    }
                    else if (res === "TRUE") 
                    {
                        const resp = response.RESULT.replace("SUCCESSFULY","SUCCESSFULLY")
                        setResMSG(resp);
                        setMenuAdded(false);
                        setTimeout(() => {
                            isDisabled();
                        }, 2000);

                    }




                });


        } catch (error) {
        }
    };




    return (

        <Modal isVisible={isVisible}
            backdropOpacity={0.8}
            onBackdropPress={() => isDisabled()}
            onBackButtonPress={() => isDisabled()}
            animationIn={'fadeIn'}
            animationInTiming={500}
            animationOut={'fadeOut'}
            animationOutTiming={100}
        // backdropColor='#DCDCDC'
        >


            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <CardView
                        style={{
                            // overflow: 'hidden',
                            // height: 215,
                            width: '100%',
                            borderRadius: 8,
                            backgroundColor: colors.white,

                            // marginBottom : 10,
                        }}
                        cardElevation={2}
                        cardMaxElevation={2}
                        cornerRadius={8}>
                        {menuAdded ?
                            <View style={{ padding: 15, marginHorizontal: 19, alignItems: 'center' }}>
                                <View style={{
                                    width: 60,
                                    height: 60,
                                    backgroundColor: 'pink',
                                    borderRadius: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center'

                                }}>
                                    <AddToFavorites
                                        height={35}
                                        width={35}

                                    ></AddToFavorites>

                                </View>
                                <Text style={{
                                    fontSize: RFValue(15),
                                    fontWeight: "500",
                                    fontFamily: "SF UI Display",
                                    color: "#252525",
                                    textAlign: "left",
                                    opacity: 0.8,
                                    marginTop: 15,
                                    textAlign: 'center',
                                    width:width - 50
                                }}>Add "{MenuName.name}" to your Favourite?</Text>
                                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                    <TouchableOpacity
                                        style={{

                                            width: width - 50,
                                            borderColor: colors.btnColor,
                                            justifyContent: 'center',
                                            borderRadius: 12,
                                            flex: 1,
                                            marginRight: 9,
                                            borderWidth: 1,
                                            height: 45

                                        }}
                                        // onPress={() =>  this.setState({termsAndCondition : true})}
                                        onPress={() => isDisabled()}
                                    ><Text style={{
                                        alignSelf: 'center',
                                        color: colors.btnColor,
                                        fontFamily: strings.fontBold,
                                        fontSize: 15
                                    }}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{

                                            width: width - 50,
                                            backgroundColor: colors.btnColor,
                                            justifyContent: 'center',
                                            borderRadius: 12,
                                            flex: 1,
                                            marginLeft: 9,
                                            height: 45
                                        }}
                                        // onPress={() =>  this.setState({termsAndCondition : true})}
                                        onPress={() => sendRequest()}

                                    ><Text style={{
                                        alignSelf: 'center',
                                        color: 'white',
                                        fontFamily: strings.fontBold,
                                        fontSize:  15
                                    }}>
                                            Confirm
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View> :
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                              
                            }}>

                                {ResMSG === 'ADDED SUCCESSFULLY ..!' ?
                                    (<Image
                                        source={assets.success}
                                        style={{
                                            height: 85,
                                            width: 85,
                                            justifyContent: 'center',
                                            alignItems: 'center',

                                            marginVertical: 20,
                                            // backgroundColor: 'blue'


                                        }}
                                    />)
                                    : (
                                        <View style={{ marginHorizontal: 19, alignItems: 'center' }}>
                                            <Warning height={110}
                                                width={110}></Warning>
                                        </View>
                                    )}

                                <Text
                                    style={{
                                        width: width - 80,
                                        color: "#252525",
                                        // alignItems: 'flex-end',
                                        textAlign: 'center',
                                        fontFamily: strings.fontMedium,
                                        //  marginTop: 5,
                                        fontSize: RFValue(15),
                                        opacity: 0.8,
                                        marginBottom:15

                                    }}>
                                    "{MenuName.name}" {ResMSG.toLowerCase()}</Text>
                            </View>

                        }

                       
                    </CardView>
                </View>
            </View>

        </Modal>
    );

}
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContainer: {
        // flex: 1,
        // backgroundColor : 'red',
        // justifyContent: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {

        // backgroundColor : 'green',
        padding: 8,
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: 'white',
    },

});