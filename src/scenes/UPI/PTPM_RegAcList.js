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


class PTPM_RegAcList extends Component {

    constructor(props) {
        super(props);

        this.state =
        {
            AccList: props.route.params.accList,
            Type: props.route.params.Type,
            CallFrom: props.route.params.Type,
        }

        this.P2PM_MAP = [];
        this.UPISys_MAP = [];

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {

        this.LoadSysPara();

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


    push_P2PM_MAP(key, value) {
        this.P2PM_MAP.push({ [key]: value });
    }

    push_UPISys_MAP(key, value) {
        this.UPISys_MAP.push({ [key]: value });
    }

    getValueByKey(key) {
        for (const obj of this.UPISys_MAP) {
            if (obj.hasOwnProperty(key)) {
                return obj[key];
            }
        }
        return null; // Return null if the key is not found
    }

    LoadSysPara = async (item) => {

        const Headers = APIUrlConstants.Headers("GETUPIQRCD");

        const jsonReq =
        {
            CALLFROM: 'GET_SYSPARA',
            adharRefNo: '',
            customerId: Constants.GMST_CODE,
            branchCd: '',
            ACTYPE: '',
            secKey: Constants.SecretKey,
            acMastCode: '',
            divId: this.props.DeviceId,
        }

        console.log("GET_SYSPARA call--" + JSON.stringify(jsonReq))

        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: JSON.stringify(jsonReq),

        }


        console.log("GET_SYSPARA Body--" + JSON.stringify(Body))

        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {

                console.log("GET_SYSPARA response--" + JSON.stringify(response))

                let res = response.SUCCESS

                if (res === "FALSE") {
                    const ErrorMsg = response.RESULT
                    Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });

                }
                else if (res === "TRUE") {

                    this.UPISys_MAP = [];
                    // navigation.navigate(this, 'QRCodeDisplay', { AccDetails: item })

                    if (response.RESULT === 'BASIC DETAILS FOUND...!') {
                        // this.push_UPISys_MAP('GLNAME', finalRes.GLNAME);
                        // this.push_UPISys_MAP('ADHAR_REF', finalRes.ADHAR_REF);
                        this.UPISys_MAP = response;


                        if (this.state.CallFrom === 'P2P' && response.DMOREQ === 'Y') {

                            const ErrorMsg = 'P2P Registration Facility Is Available For Non-Dmo Customer Only..! Please Contact Your Branch...!'
                            Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'orange' });
                            navigation.goBack(this)

                        }
                        else {
                            const ErrorMsg = response.RESULT
                            Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });

                        }
                    }

                }
                else {
                    const ErrorMsg = 'Unable to fetch Syspara Details ..!'
                    Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                    navigation.goBack(this)

                }

            })

    }



    GetKYCInfo = async (item) => {

        const Headers = APIUrlConstants.Headers("GETUPIQRCD");

        const jsonReq =
        {
            customerId: Constants.GMST_CODE,
            acMastCode: item.ACMASTCODE,
            acNo: item.AC_NO,
            secKey: Constants.SecretKey,
            branchCd: Constants.BankCode,
            divId: this.props.DeviceId,
            CALLFROM: this.state.CallFrom.replace("P2M", 'P2M_REG').replace("P2P", 'P2P_REG'),
            ACTYPE: item.ACTYPE.replace("SAVING ACCOUNT", '10').replace("CURRENT ACCOUNT", '11'),
            UPITYPE: this.state.CallFrom.replace("P2M", '1').replace("P2P", '2'),
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

                    this.P2PM_MAP = [];
                    // navigation.navigate(this, 'QRCodeDisplay', { AccDetails: item })

                    if (finalRes.RESULT === 'VALID AC') {
                        this.push_P2PM_MAP('GLNAME', finalRes.GLNAME);
                        this.push_P2PM_MAP('ADHAR_REF', finalRes.ADHAR_REF);
                        this.push_P2PM_MAP('BRANCHCD', finalRes.BRANCHCD);
                        this.push_P2PM_MAP('CUSTID', finalRes.CUSTID);
                        this.push_P2PM_MAP('NAME', finalRes.NAME);
                        this.push_P2PM_MAP('MOBILE', finalRes.MOBILE);
                        this.push_P2PM_MAP('TELE', finalRes.TELE);
                        this.push_P2PM_MAP('EMAIL', finalRes.EMAIL);
                        this.push_P2PM_MAP('PANNO', finalRes.PANNO);
                        this.push_P2PM_MAP('ADDR', finalRes.ADDR);
                        this.push_P2PM_MAP('CITY', finalRes.CITY);
                        this.push_P2PM_MAP('DTOFBIRTH', finalRes.DTOFBIRTH);
                        this.push_P2PM_MAP('GSTIN', finalRes.GSTIN);
                        this.push_P2PM_MAP('STCODE', finalRes.STCODE);
                        this.push_P2PM_MAP('PIN_CODE', finalRes.PIN_CODE);
                        this.push_P2PM_MAP('MER_KYC', finalRes.MER_KYC);
                        this.push_P2PM_MAP('GLCODE', finalRes.GLCODE);
                        this.push_P2PM_MAP('ACTYPE', finalRes.ACTYPE);
                    }

                    if (this.UPISys_MAP.containsKey(DMOREQ) && this.getValueByKey('DMOREQ') === 'Y' && finalRes.MER_KYC === 'N') {

                        const ErrorMsg = 'KYC not Done for Selected Account. Please Contact Your Branch...!'
                        Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'orange' });
                        navigation.goBack(this)

                    }
                    else {

                        //Navigation Registration Page

                        navigation.navigate(this, 'PTPM_RegPage', { AccDetails: item})

                        

                    }
                }
                else {
                    const ErrorMsg = response.RESULT
                    Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                    navigation.goBack(this)

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

                        this.GetKYCInfo(item)


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

                        <Text style={styles.HeaderText}>{this.state.Type} Registration</Text>

                        <Text style={styles.HeaderSubText}>Select Account for {this.state.Type} Registration</Text>


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

export default connect(mapStateToProps, mapDispatchToProps)(PTPM_RegAcList);

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