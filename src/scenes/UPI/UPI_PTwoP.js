import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    ImageBackground,
    StyleSheet,
    BackHandler,
    TouchableOpacity,
} from 'react-native'
import {
    colors,
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    navigation,
    appThemeConfiguration,
    sendData,
} from '../../App';

import Constants from '../../common/Constants.js';
import APIUrlConstants from '../../common/APIUrlConstants.js';
import Snackbar from 'react-native-snackbar';
import { _toEncrypt, decryptData } from '../../common/util.js';
import TrasnsperantFixedHeader from '../../components/TrasnperantFixedHeader.js';
import CardView from 'react-native-cardview';
import QRCodeIcon from '../../assets/icons/ic_qrTwo.svg';
import { RFValue } from "react-native-responsive-fontsize";
import { FlatList } from 'react-native-gesture-handler';


class UPI_PTwoP extends Component {

    constructor(props) {
        super(props);

        this.state =
        {
            AccList: props.route.params.accList,
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {

    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        navigation.goBack(this)
        return true;
    }

    onBackAction() {
        navigation.goBack(this)
    }


    GetQRCode = async (item) => {

        const Headers = APIUrlConstants.Headers("GETUPIQRCD");

        const jsonReq =
        {
            customerId: Constants.GMST_CODE,
            acMastCode: item.ACMASTCODE,
            acNo: item.AC_NO,
            secKey: Constants.SecretKey,
            branchCd: Constants.BankCode,
            divId: this.props.DeviceId,
            CALLFROM: 'P2P',
        }

        console.log("P2P call--" + JSON.stringify(jsonReq))

        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));

        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: JSON.stringify(jsonValue),

        }


        console.log("P2P Body--" + JSON.stringify(Body))

        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                var responseData = await decryptData(response)
                var newRes = responseData.slice(16)
                var finalRes = JSON.parse(newRes)

                console.log("P2P finalRes--" + JSON.stringify(finalRes))

                let res = finalRes.SUCCESS
                if (res === "FALSE") {
                    const ErrorMsg = finalRes.RESULT
                    Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });

                }
                else if (res === "TRUE") {


                    let Data = finalRes.data

                    const QRCODE = Data[0].VPADETLS;
                    const Upi_Id = Data[0].STRVIRACNO;
                    const UPIMERSRNO= Data[0].UPIMERSRNO;
                    const STRTBLSRNO= Data[0].STRTBLSRNO;
                    const STRTERSRNO = Data[0].STRTERSRNO;

                    navigation.navigate(this, 'QRCodeDisplay', { 
                        AccDetails: item , 
                        QRCODE : QRCODE, 
                        Upi_Id : Upi_Id,
                        UPIMERSRNO: UPIMERSRNO,
                        STRTBLSRNO: STRTBLSRNO,
                        STRTERSRNO: STRTERSRNO,
                        UPIMode: '2'
                    })

                }

            })

    }




    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg3


    AccountListDesign = ({ item }) => {
        return (
            <CardView
                cardElevation={1}
                cardMaxElevation={1}
                cornerRadius={12}
                style={styles.CardStyle}
            >
                <TouchableOpacity
                    onPress={() => {

                        this.GetQRCode(item)


                    }}>
                    <View style={styles.Touchablestyle}>

                        <View style={styles.ParameterView}>


                            <Text style={styles.BalanceText}>Balance</Text>

                            <Text style={[styles.BalanceAmt, { color: this.props.PrimaryColor }]}> {item.BALANCE.startsWith('-') ? ("₹ " + item.BALANCE.replace('-', '') + " Cr") : ("₹ " + item.BALANCE + " Dr")}</Text>


                            <View style={styles.DirectionRow}>

                                <View>

                                    <Text style={styles.GreyInfoText}>A/C No</Text>

                                    <Text style={styles.InfoText}>{item.AC_NO}</Text>
                                </View>


                                <View>
                                    <Text style={styles.GreyInfoText}>A/C Type</Text>

                                    <Text style={styles.InfoText}>{item.ACTYPE === 'SAVING ACCOUNT' ? 'Saving A/c' : item.ACTYPE === 'CURRENT ACCOUNT' ? 'Current A/c' : item.ACTYPE === 'LOAN ACCOUNT' ? 'Loan A/c' : ''}</Text>


                                </View>

                            </View>


                        </View>


                        <View style={{ flex: 0.35, alignItems: 'center', justifyContent: 'center' }}>


                            <QRCodeIcon height={35} width={35} color={this.props.PrimaryColor} />

                        </View>


                    </View>
                </TouchableOpacity>
            </CardView>
        );
    };



    render() {

        return (

            <View style={styles.flexOne}>

                <ImageBackground style={styles.flexOne}
                    source={this.bgImage}
                    resizeMode='cover'>

                    <View style={styles.HeaderBg}>
                        <TrasnsperantFixedHeader
                            backAction={() => this.onBackAction()}
                        />

                        <Text style={styles.HeaderText}>P2P QR Code</Text>

                        <Text style={styles.HeaderSubText}>Select Account for P2P QR Code</Text>


                    </View>

                    <View style={styles.MainCurve}>


                        <Text style={styles.HolderName}>A/C Holder Name</Text>

                        <Text style={[styles.UserNameText, { color: this.props.PrimaryColor }]}>{Constants.Name}</Text>

                        <View style={styles.strightLine}></View>


                        <View style={styles.ScrollViewView}>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                            >

                                <FlatList
                                    style={styles.flatListStyle}
                                    data={this.state.AccList.filter(item => item.ACTYPE === 'SAVING ACCOUNT' || item.ACTYPE === 'CURRENT ACCOUNT')}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={this.AccountListDesign}
                                />



                            </ScrollView>


                        </View>


                    </View>



                </ImageBackground>



            </View>

        );

    }

}

export default connect(mapStateToProps, mapDispatchToProps)(UPI_PTwoP);

const styles = StyleSheet.create({

    flexOne:
    {
        flex: 1,
    },

    HeaderBg:
    {
        flex: 0.3,
        justifyContent: 'flex-start'
    },

    HeaderText:
    {
        marginLeft: 25,
        color: 'white',
        fontSize: RFValue(24),
        fontFamily: strings.fontBold
    },

    HeaderSubText:
    {
        marginLeft: 25,
        color: 'white',
        fontSize: RFValue(13),
        fontFamily: strings.fontRegular
    },

    MainCurve:
    {
        flex: 0.9,
        backgroundColor: '#fbfcfc',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        flexDirection: 'column',
        paddingHorizontal: 20,

    },

    ScrollViewView:
    {
        flex: 1,
        marginTop: 20,
    },

    HolderName:
    {
        color: '#929CAC',
        fontSize: RFValue(13),
        fontFamily: strings.fontRegular,
        marginTop: 30,
        marginLeft: 10,
    },

    UserNameText:
    {
        fontSize: RFValue(20),
        fontFamily: strings.fontBold,
        marginLeft: 10,
    },
    strightLine:
    {
        height: 0.5,
        backgroundColor: '#BEC8EC80',
        marginTop: 10,

    },

    CardStyle:
    {
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 5,
        marginHorizontal: 2,
    },

    Touchablestyle:
    {
        borderColor: '#cdcdce',
        flexWrap: 'wrap',
        paddingLeft: 20,
        paddingVertical: 10,
        flexDirection: 'row',
    },

    BalanceText:
    {
        color: colors.textColorForLight,
        fontSize: RFValue(12),
        fontFamily: strings.fontMedium,
        justifyContent: 'flex-start',
    },

    BalanceAmt:
    {
        fontSize: RFValue(18),
        fontFamily: strings.fontBold,
    },


    GreyInfoText:
    {
        color: '#757575',
        fontSize: RFValue(12),
        fontFamily: strings.fontMedium,
        justifyContent: 'flex-start',
    },
    InfoText:
    {
        color: '#252525',
        fontSize: RFValue(15),
        fontFamily: strings.fontBold,
    },
    DirectionRow:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },

    ParameterView:
    {
        width: '100%',
        flex: 0.65
    },


    flatListStyle:
    {
        marginBottom: 50
    },

})