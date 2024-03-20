
//  RGP

import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
    BackHandler,
} from 'react-native';
import {
    colors,
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    navigation,
    appThemeConfiguration,

    sendData,
} from '../../../../App';

import Arrowdown from '../../../../assets/icons/dashboardIcons/arrow_down.svg';
import { TextInput } from 'react-native-paper';
import Balance from '../../../../assets/icons/Balance.svg'
import CheckBox from '@react-native-community/checkbox';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import TrasnsperantFixedHeader from '../../../../components/TrasnperantFixedHeader';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';

import DownArrow from '../../../../assets/icons/down-arrow.svg'
import { Dialog_SimOperator } from '../../../../components/Dialog_SimOperator.js';
import { Dialog_SelectCircle } from '../../../../components/Dialog_SelectCircle.js';
import { selectAccount } from '../../../../components/CustomDialog.js';
import Constants from '../../../../common/Constants.js';
import APIUrlConstants from '../../../../common/APIUrlConstants.js';
import MyValidator from '../../../../common/MyValidator';
import { Dialog_DTH_Payment } from '../../../../components/Dialog_DTH_Payment.js';
import { DialogInsufficientBalance } from '../../../../components/Dialog_InsufficientBalance.js';
import Snackbar from 'react-native-snackbar';


class DataCardPayments extends Component {


    constructor(props) {
        super(props);



        this.AccountList = []
        this.TempAcc = []
        this.SavingAccountList = []  // To show Saving Account On Top
        this.RemainingAccountList = [] // To show Remaining Account below of Saving A/c


        this.OperatorList = [
            {
                OperatorName: 'Aircel DataCard',
                Logo: require('../../../../assets/icons/datacard_Aircel.png'),
                operator_code: 'AD',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                OperatorName: 'BSNL DataCard',
                Logo: require('../../../../assets/icons/datacard_BSNL.png'),
                operator_code: 'BD',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                OperatorName: 'MTNL Delhi DataCard',
                Logo: require('../../../../assets/icons/datacard_MTNL.png'),
                operator_code: 'MDD',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                OperatorName: 'MTNL Mumbai DataCard',
                Logo: require('../../../../assets/icons/datacard_MTNL.png'),
                operator_code: 'MMD',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                OperatorName: 'MTS Mblaze',
                Logo: require('../../../../assets/icons/datacard_MTSBlaze.png'),
                operator_code: 'MTZ',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                OperatorName: 'MTS Mbrowse',
                Logo: require('../../../../assets/icons/datacard_MTSbrowse.png'),
                operator_code: 'MTW',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                OperatorName: 'Reliance NetConnect 1X',
                Logo: require('../../../../assets/icons/datacard_Reliance.png'),
                operator_code: 'RN',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                OperatorName: 'Reliance NetConnect 3G',
                Logo: require('../../../../assets/icons/datacard_Reliance.png'),
                operator_code: 'RNG',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                OperatorName: 'Reliance NetConnect+',
                Logo: require('../../../../assets/icons/datacard_Reliance.png'),
                operator_code: 'RNC',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                OperatorName: 'Tata Photon Whiz',
                Logo: require('../../../../assets/icons/datacard_TataPhoton.png'),
                operator_code: 'TPW',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                OperatorName: 'Tata Photon Whiz',
                Logo: require('../../../../assets/icons/datacard_TataPhoton.png'),
                operator_code: 'TPW',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                OperatorName: 'Tata Photon+',
                Logo: require('../../../../assets/icons/datacard_TataPhoton.png'),
                operator_code: 'TPW',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
        ];

        this.CircleList = [
            { circle_code: '1', circle_name: 'Andhra Pradesh' },
            { circle_code: '2', circle_name: 'Assam' },
            { circle_code: '3', circle_name: 'Bihar' },
            { circle_code: '4', circle_name: 'Chennai' },
            { circle_code: '5', circle_name: 'Delhi' },
            { circle_code: '6', circle_name: 'Gujarat' },
            { circle_code: '7', circle_name: 'Haryana' },
            { circle_code: '8', circle_name: 'Himachal Pradesh' },
            { circle_code: '9', circle_name: 'Jammu & Kashmir' },
            { circle_code: '24', circle_name: 'Jharkhand' },
            { circle_code: '10', circle_name: 'Karnataka' },
            { circle_code: '11', circle_name: 'Kerala' },
            { circle_code: '12', circle_name: 'Kolkata' },
            { circle_code: '13', circle_name: 'Maharashtra & Goa (except Mumbai)' },
            { circle_code: '14', circle_name: 'Madhya Pradesh & Chhattisgarh' },
            { circle_code: '15', circle_name: 'Mumbai' },
            { circle_code: '16', circle_name: 'North East' },
            { circle_code: '17', circle_name: 'Orissa' },
            { circle_code: '18', circle_name: 'Punjab' },
            { circle_code: '19', circle_name: 'Rajasthan' },
            { circle_code: '20', circle_name: 'Tamil Nadu' },
            { circle_code: '21', circle_name: 'Uttar Pradesh -East' },
            { circle_code: '22', circle_name: 'Uttar Pradesh -West' },
            { circle_code: '23', circle_name: 'West Bengal' },

        ];

        this.state = {

            DataCard_Name: this.props.route.params.name,
            DataCard_Icon: this.props.route.params.Logo,
            DataCard_OperatorCode: this.props.route.params.OperatorCode,


            isOperatorVisible: false,
            isAccountListVisible: false,
            isCircleVisible: false,

            Selected_CircleID: this.CircleList.length > 0 ? this.CircleList[0].circle_code : '',
            Selected_CircleName: this.CircleList.length > 0 ? this.CircleList[0].circle_name : '',
            CircleName: 'Select Circle',


            Selected_ACMASTCODE: '',
            Selected_AC_NO: '',
            Selected_Balance: '',

            PlatformCharges: 1.50,

            SubscriberNumber: '',
            BillAmount: this.props.route.params.Amount,
            ConfirmBillAmount: '',
            AccountNumber: '',

            Subscriber_error: '',
            BillAmountError: '',
            ConfirmBillAmountError: '',
            AccountNumberError: '',


            confirmDialog: false,
            InsufficientBalanceDialog: false,

            isChecked: false,



        };

    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        navigation.goBack(this)
        return true;
    };


    componentDidMount() {

        this.GetAccountDetailsApi()
    }



    onBackAction() {
        navigation.goBack(this)
    }

    onSelectOperator = (item) => {

        this.setState({ isOperatorVisible: false, });

        if (item.OperatorName === null || item.OperatorName === undefined || item.OperatorName.trim() === "") {

        }
        else {
            this.setState({ Landline_Name: item.OperatorName, Landline_Icon: item.Logo, Landline_OperatorCode: item.operator_code })
        }


    }


    onSelectCircle = (item) => {

        this.setState({ isCircleVisible: false, });

        if (item.circle_name === null || item.circle_name === undefined || item.circle_name.trim() === "") {

        }
        else {
            this.setState({ Selected_CircleID: item.circle_code, Selected_CircleName: item.circle_name, CircleName: item.circle_name })
        }

    }

    onSelectAccount = (value) => {


        this.setState({ isAccountListVisible: false, });

        if (value.AC_NO === null || value.AC_NO === undefined || value.AC_NO.trim() === "") {

        }
        else {
            this.setState({
                Selected_AC_NO: value.AC_NO,
                Selected_ACMASTCODE: value.ACMASTCODE,
                // Selected_Balance: value.BALANCE,
            })

            this.GetAllowableBalance(value.AC_NO, value.ACMASTCODE)

        }


    }


    onSubmitClick = () => {

        const result = this.ValidateForm();

        if (result) {

            this.setState({ confirmDialog: true })

        }

        // this.props.navigation.navigate('dataCardPaymentSuccess')
    };

    ValidateForm() {


        var result = true;

        this.setState({ Subscriber_error: '', BillAmountError: '', ConfirmBillAmountError: '', AccountNumberError: '', });

        const MOB_number = this.state.SubscriberNumber;

        if (!MyValidator.isEmptyField(this.state.SubscriberNumber).isValid) {
            this.setState({ Subscriber_error: "Please Enter Data Card Number" });
            result = false;
        }


        if (MOB_number === "0000000000" || MOB_number.length !== 10 || MOB_number === "0") {
            this.setState({ Subscriber_error: "Please Enter 10 digit Data Card Number" });
            result = false;
        }



        if (this.state.BillAmount < 10) {
            this.setState({ BillAmountError: "Amount should be Grater than 10" });
            result = false;
        }


        if (this.state.BillAmount != this.state.ConfirmBillAmount) {
            this.setState({ ConfirmBillAmountError: "Amount not match" });

            result = false;
        }

        if (!MyValidator.isEmptyField(this.state.BillAmount).isValid) {
            this.setState({ BillAmountError: "Please Enter Bill Amount" });
            result = false;
        }


        if (!MyValidator.isEmptyField(this.state.ConfirmBillAmount).isValid) {
            this.setState({ ConfirmBillAmountError: "Please Enter Confirm Bill Amount" });
            result = false;
        }


        if (this.state.isChecked) {
            if (!MyValidator.isEmptyField(this.state.AccountNumber).isValid) {
                this.setState({ AccountNumberError: "Please Enter Account Number" });
                result = false;
            }

        }

        if (this.state.CircleName === 'Select Circle') {
            Snackbar.show({ text: "Please Select Operator Circle", duration: Snackbar.LENGTH_SHORT, backgroundColor: 'orange' });
            result = false;
        }



        return result;
    };


    PressNo = () => {

        this.setState({ confirmDialog: false })


    }

    PressYes = () => {

        this.setState({ confirmDialog: false })

        var acBalance = 0;

        acBalance = this.state.Selected_Balance.replace('-', '');

        const TotalAmt = parseFloat(this.state.BillAmount) + parseFloat(this.state.PlatformCharges);


        if (acBalance < TotalAmt) {
            this.setState({ InsufficientBalanceDialog: true });
        }
        else {


            setTimeout(() => {

                this.DataCardRechargeApi();


            }, 500);

        }


    }

    PressOK = () => {
        this.setState({ InsufficientBalanceDialog: false })
    }



    GetAccountDetailsApi() {


        const Headers = APIUrlConstants.Headers("GETACSUM");

        const Body =
        {
            PARACNT: "3",
            PARA1_TYP: "STR",
            PARA1_VAL: Constants.GMST_CODE,
            PARA2_TYP: "STR",
            PARA2_VAL: Constants.BankCode,
            PARA3_TYP: "STR",
            PARA3_VAL: Constants.SecretKey,

        }

        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                var finalRes = response


                let res = finalRes.SUCCESS
                if (res === "FALSE") {

                    const ErrorMsg = finalRes.RESULT
                    Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });

                }
                else {

                    let userAccArray = finalRes.Acdtls

                    if (userAccArray.length > 0) {


                        userAccArray.map((item) => {

                            const acTypeVariable = JSON.stringify(item);


                            this.TempAcc.push(JSON.parse(item))

                        })


                        this.TempAcc.forEach(element => {
                            if (element.ACTYPE === 'SAVING ACCOUNT') {

                                this.SavingAccountList.push(element)  // 3- sort to Saving & Remaining List

                            }
                            else {
                                this.RemainingAccountList.push(element)
                            }
                        });


                        if (this.SavingAccountList.length > 0 || this.RemainingAccountList.length > 0) {

                            // 4- Addded Saving in Top List & Remaining in Below List

                            this.SavingAccountList.map((item) => {

                                this.AccountList.push(item)

                            })

                            this.RemainingAccountList.map((item) => {


                                this.AccountList.push(item)

                            })

                        }

                        this.GetAllowableBalance(Constants.Selected_AC_NO, Constants.Selected_ACMASTCODE)

                        this.setState({
                            Selected_ACMASTCODE: Constants.Selected_ACMASTCODE,
                            Selected_AC_NO: Constants.Selected_AC_NO,
                            // Selected_Balance: Constants.Selected_BALANCE,
                        })




                    }


                }


            })

    }



    GetAllowableBalance = async (AC_NO, ACMASTCODE) => {

        const Headers = APIUrlConstants.Headers("GETALLBAL");

        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: "{\"ACMASTCODE\":\"" + ACMASTCODE + "\",\"AC_NO\":\"" + AC_NO + "\"}"
        }

        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                var responseData = response

                let res = response.SUCCESS
                if (res === "FALSE") {
                    const ErrorMsg = response.RESULT
                    Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                    this.setState({ Selected_Balance: '0.0' })


                }
                else if (res === "TRUE") {
                    this.setState({ Selected_Balance: response['ALLOWABLE BALANCE'] })
                }

            })

    }


    DataCardRechargeApi() {

        const simid = '00000000-05ec-ff6b-0000-00005659f38b';

        const Headers = APIUrlConstants.Headers("RECHARGE");

        const jsonReq =
        {
            CADRE_ID: Constants.GMST_CODE,
            AMT: this.state.ConfirmBillAmount,
            RNO: this.state.SubscriberNumber,
            RACNO: this.state.AccountNumber,
            OPR_CD: this.state.DataCard_OperatorCode,
            OPR_NM: this.state.DataCard_Name,
            CIRC_CD: this.state.Selected_CircleID,
            CIRC_NM: this.state.Selected_CircleName,
            RTYPE: 'Datacard',
            SEC_KEY: Constants.SecretKey,
            CUS_SAV_GL: this.state.Selected_ACMASTCODE,
            CUS_SAV_AC: this.state.Selected_AC_NO,
            BRNCH_CD: Constants.BRANCH_CODE,
            NET_SRV_CHRG: Constants.NET_SRV_CHRG,
            BNK_SRV_CHRG: Constants.BNK_SRV_CHRG_DTH,
            CMOBNO: Constants.MobileNumber,
            DEVICE_LATTIDUTE: '',
            DEVICE_LONGITUDE: '',
            DEVICE_LOCAL_IP: '',
            DEVICE_PUBLIC_IP: '',
            DEVICE_ISP_OPERATOR: '',
            SIMNO: simid,
            bankCode: Constants.BankCode,
            customerId: Constants.GMST_CODE,
            divId: this.props.DeviceId,


        }
        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: JSON.stringify(jsonReq),

        }

        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                var finalRes = response


                let res = finalRes.SUCCESS

                if (res === "FALSE") {

                    const ErrorMsg = finalRes.RESULT


                    Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });

                }
                else if (res === "TRUE") {

                    Snackbar.show({ text: "Data Card Recharge Successfull", duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green' });

                    this.props.navigation.navigate('dataCardPaymentSuccess')
                }
                else {

                    Snackbar.show({ text: "Error To Recharge, Retry !!", duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });


                }



            })

    }


    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg3

    render() {

        return (
            <View style={styles.flexone}>

                <ImageBackground style={styles.flexone}
                    source={this.bgImage}
                    resizeMode='cover'
                >
                    <TrasnsperantFixedHeader
                        backAction={() => this.onBackAction()}
                    />

                    <View style={styles.flexpointFifteen}>
                        <View style={styles.HeadingView}>

                            <Text style={styles.HeadingTitle}>Data Card </Text>
                            <Text style={styles.SubHeadTitle}> Internet Data Recharge or Bill Pay </Text>

                        </View>
                    </View>


                    <View style={styles.SeacrhBarView}>

                        {/* DataCard Name & ICON */}
                        <View style={styles.DatacardSubView}>

                            <View style={styles.textContainer}>

                                <Text style={styles.username}>{this.state.DataCard_Name}</Text>

                            </View>



                            <View style={styles.container1}>
                                <Image source={this.state.DataCard_Icon} style={styles.image1} />
                            </View>

                        </View>


                        {/* Operator & Circle Selection */}

                        <View style={styles.CircleSelect}>

                            <TouchableOpacity
                                style={styles.SelectionStyle}
                                onPress={() => this.setState({ isOperatorVisible: true })}>

                                <Text style={styles.OptionSelectionTextStyle} numberOfLines={1}>{this.state.DataCard_Name}</Text>

                                <DownArrow height={12} width={12} color={this.props.themeColor} />

                            </TouchableOpacity>


                            {Dialog_SimOperator(
                                this.state.isOperatorVisible,
                                this.OperatorList,
                                this.onSelectOperator,
                                this.state.DataCard_Name,
                            )}



                            <TouchableOpacity
                                style={styles.SelectionStyle}
                                onPress={() => this.setState({ isCircleVisible: true, })}>

                                <Text style={styles.OptionSelectionTextStyle} numberOfLines={1}>{this.state.CircleName}</Text>

                                <DownArrow height={12} width={12} flex={0.25} color={this.props.themeColor} />

                            </TouchableOpacity>

                            {Dialog_SelectCircle(
                                this.state.isCircleVisible,
                                this.CircleList,
                                this.onSelectCircle,
                                this.state.Selected_CircleName,
                            )}



                        </View>



                        <ScrollView>


                            <View style={styles.ScrollViewStyle}>

                                {/* Account Type */}
                                <View style={[styles.InputBoxDesign, { marginTop: 10 }]}>

                                    <TouchableOpacity style={styles.AccountTypeTouchable}
                                        onPress={() => this.setState({ isAccountListVisible: true, })}>


                                        <View style={styles.flexone}>

                                            <Text style={styles.AccTypeMainText}> Select Account </Text>

                                            <Text style={styles.AccTypeSubText}> {this.state.Selected_AC_NO} </Text>
                                        </View>

                                        <View style={styles.AccTypeIconStyle} >

                                            <Arrowdown height={15} width={15} />

                                        </View>


                                    </TouchableOpacity>

                                    {
                                        selectAccount(
                                            this.state.isAccountListVisible,
                                            this.AccountList.filter(item => item.ACTYPE !== 'LOAN ACCOUNT' && item.ACTYPE !== 'FIXED DEPOSIT ACCOUNT'),
                                            this.onSelectAccount,
                                            "Select Account",
                                            this.state.Selected_AC_NO,
                                            "Account",
                                        )
                                    }
                                </View>


                                {/* Available Balance */}
                                <View
                                    style={styles.AvailableBalanceMainViewStyle}>

                                    <View
                                        style={styles.AvailableBalanceSubViewStyle}>

                                        <Balance width={32} height={32} />

                                    </View>

                                    <View>
                                        <Text style={styles.AvailableBalanceTxt}>Available Balance</Text>

                                        <Text style={styles.AvailableBalanceTypetxt}>
                                            {this.state.Selected_Balance.startsWith('-') ? ("₹ " + this.state.Selected_Balance.replace('-', '') + " Cr") : ("₹ " + this.state.Selected_Balance + " Dr")}

                                        </Text>
                                    </View>
                                </View>

                                {/* DataCard Number */}
                                <View style={styles.DataCardViewStyle}>
                                    <TextInput
                                        style={styles.DatacardTextInput}
                                        theme={{
                                            colors: {
                                                placeholder: '#DFE1E8',
                                                text: this.props.textColor,
                                                primary: this.props.SecondaryColor,
                                                underlineColor: 'transparent',
                                                background: 'white',
                                            },
                                            roundness: 8,
                                        }}
                                        value={this.state.SubscriberNumber}
                                        onChangeText={SubscriberNumber => { this.setState({ SubscriberNumber, }); }}
                                        maxLength={10}
                                        label="Subscriber Number"
                                        keyboardType='numeric'
                                        mode='outlined'
                                        autoComplete='off'
                                        contextMenuHidden={Constants.AUTOMATION_MODE === 'Y' ? false : true}
                                        autoCorrect={false}
                                        autoCompleteType="off"
                                        selectable={false}
                                        placeholder='Subscriber Number'
                                        returnKeyType='next'
                                        onSubmitEditing={() => { this.BillAmt.focus(); }}
                                        blurOnSubmit={false}
                                    />

                                    {this.state.Subscriber_error !== '' && (<Text style={styles.ErrorDisplay}>{this.state.Subscriber_error}</Text>)}

                                </View>


                                {/* Bill Amount */}
                                <View style={styles.DataCardViewStyle}>
                                    <TextInput
                                        style={styles.DatacardTextInput}
                                        theme={{
                                            colors: {
                                                placeholder: '#DFE1E8',
                                                text: this.props.textColor,
                                                primary: this.props.SecondaryColor,
                                                underlineColor: 'transparent',
                                                background: 'white',
                                            },
                                            roundness: 8,
                                        }}
                                        label="Enter Bill Amount"
                                        keyboardType='numeric'
                                        maxLength={10}
                                        contextMenuHidden={Constants.AUTOMATION_MODE === 'Y' ? false : true}
                                        autoCorrect={false}
                                        autoCompleteType="off"
                                        value={this.state.BillAmount}
                                        onChangeText={BillAmount => {
                                            this.setState({ BillAmount });
                                        }}
                                        mode='outlined'
                                        ref={(input) => { this.BillAmt = input; }}
                                        placeholder='Enter Bill Amount'
                                        returnKeyType='next'
                                        onSubmitEditing={() => { this.confirmBill.focus(); }}
                                        blurOnSubmit={false}

                                    />

                                    {this.state.BillAmountError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.BillAmountError}</Text>)}

                                </View>


                                <View style={styles.ConfirmBillView}>

                                    <TextInput
                                        style={styles.DatacardTextInput}
                                        theme={{
                                            colors: {
                                                placeholder: '#DFE1E8',
                                                text: this.props.textColor,
                                                primary: this.props.SecondaryColor,
                                                underlineColor: 'transparent',
                                                background: 'white',
                                            },
                                            roundness: 8,
                                        }}
                                        label="Confirm Bill Amount"
                                        keyboardType='numeric'
                                        maxLength={5}
                                        mode='outlined'
                                        contextMenuHidden={true}
                                        autoCorrect={false}
                                        autoCompleteType="off"
                                        value={this.state.ConfirmBillAmount}
                                        onChangeText={ConfirmBillAmount => {
                                            this.setState({ ConfirmBillAmount, });
                                        }}
                                        ref={(input) => { this.confirmBill = input; }}
                                        placeholder="Confirm Bill Amount"

                                    />

                                    {this.state.ConfirmBillAmountError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.ConfirmBillAmountError}</Text>)}

                                </View>


                                <View style={styles.PlatformChargesStyle}>
                                    <Text
                                        style={styles.PlatformChargesTextStyle}>Platform Charges : ₹ {this.state.PlatformCharges} </Text>
                                </View>

                                <TouchableOpacity style={[styles.rectangleView, { backgroundColor: this.state.isChecked ? 'rgba(147, 177, 200, .3)' : 'white', }]}

                                    onPress={
                                        () => this.setState({ isChecked: !this.state.isChecked })
                                    }>


                                    <CheckBox
                                        style={styles.CheckBoxStyle}
                                        lineWidth={0.5}
                                        hideBox={false}
                                        boxType={'square'}
                                        // tintColors={'#9E663C'}
                                        tintColors={{ true: '#1F3C66' }}
                                        //   onCheckColor={'#6F763F'}
                                        //   onFillColor={'#4DABEC'}
                                        //   onTintColor={'#F4DCF8'}
                                        animationDuration={0.5}
                                        disabled={false}
                                        onAnimationType={'bounce'}
                                        offAnimationType={'stroke'}
                                        value={this.state.isChecked}
                                        onValueChange={newValue =>
                                            this.setState({ isChecked: newValue })
                                        }
                                    />


                                    <Text style={styles.Textstyletwo}>Postpaid</Text>
                                </TouchableOpacity>

                                {this.state.isChecked === true ?
                                    <View style={styles.AccNoViewStyle}>
                                        <TextInput
                                            style={styles.AccNoTextInputStyle}
                                            theme={{
                                                colors: {
                                                    placeholder: '#DFE1E8',
                                                    text: this.props.textColor,
                                                    primary: this.props.themeColor,
                                                    underlineColor: 'transparent',
                                                    background: 'white',
                                                },
                                                roundness: 8,
                                            }}
                                            label="Account number"
                                            keyboardType='numeric'
                                            mode='outlined'
                                            value={this.state.AccountNumber}
                                            onChangeText={AccountNumber => {
                                                this.setState({ AccountNumber, });
                                            }}
                                            placeholder="Account number"

                                        />


                                        {this.state.AccountNumberError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.AccountNumberError}</Text>)}

                                    </View>
                                    : null
                                }



                                {/* Button */}
                                <CardView
                                    cardElevation={2}
                                    cardMaxElevation={2}
                                    cornerRadius={12}
                                    style={styles.BtnStyle}>
                                    <TouchableOpacity
                                        style={[styles.BtnTouchableStyle, { backgroundColor: this.props.PrimaryColor, }]}
                                        onPress={this.onSubmitClick} >

                                        <Text style={styles.BtnTextStyle}>  Submit </Text>
                                    </TouchableOpacity>
                                </CardView>

                            </View>

                        </ScrollView>
                    </View>

                    {
                        /* DTH Dialog */
                        Dialog_DTH_Payment(this.state.confirmDialog, this.PressNo, this.PressYes, this.props.PrimaryColor, this.props.SecondaryColor, this.state.DataCard_Name, this.state.DataCard_Icon, this.state.ConfirmBillAmount, this.state.PlatformCharges)
                    }


                    {
                        /* InsufficentBalance Dialog */
                        DialogInsufficientBalance(this.state.InsufficientBalanceDialog, this.PressOK, this.props.SecondaryColor,)
                    }


                </ImageBackground>

            </View>


        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataCardPayments);


const styles = StyleSheet.create({

    InputBoxDesign: {

        height: 48,
        width: width - 50,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DFE1E8',

    },
    container: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        width: width - 50,
    },

    textContainer: {
        flex: 2,
    },
    username: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000'
    },


    rectangleView: {
        borderRadius: 8,
        borderStyle: "dashed",
        borderColor: "#93b1c8",
        borderWidth: 1,
        flex: 1,
        width: "100%",
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,

    },
    container1: {
        width: 50,
        height: 50,
        borderRadius: 50,
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
    SelectionStyle:
    {
        borderRadius: 15,
        backgroundColor: "#fff",
        borderStyle: "solid",
        borderColor: "#d2d2d2",
        borderWidth: 0.5,
        flex: 1,
        marginRight: 10, // Add margin to create a gap
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    OptionSelectionTextStyle:
    {
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#000",
        textAlign: 'center',
        marginRight: 5,
        flex: 0.85

    },

    flexone:
    {
        flex: 1
    },
    flexpointFifteen:
    {
        flex: 0.15
    },

    HeadingView:
    {
        marginLeft: 25,
        marginTop: 15,
    },

    HeadingTitle:
    {
        fontSize: 22,
        color: 'black',
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: colors.white,
    },

    SubHeadTitle:
    {
        fontSize: 15,
        color: 'black',
        textAlign: 'left',
        fontFamily: strings.fontMedium,
        color: colors.white,
    },

    SeacrhBarView:
    {
        flex: 0.85,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },

    DatacardSubView:
    {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        width: width - 50,
        marginTop: 20,
    },

    CircleSelect:
    {
        width: width - 50,
        height: 30,
        marginBottom: 10,
        flexDirection: 'row'
    },

    ScrollViewStyle:
    {
        width: width - 50,
        alignItems: 'center'
    },
    AccountTypeTouchable:
    {
        flexDirection: 'row',
        alignItems: 'center'
    },
    AccTypeMainText:
    {
        color: colors.accTextColor + '80',
        marginLeft: 15,
        fontSize: 10,
        fontFamily: strings.fontMedium
    },
    AccTypeSubText:
    {
        color: colors.accTextColor,
        marginLeft: 15,
        fontSize: 15,
        fontFamily: strings.fontMedium
    },
    AccTypeIconStyle:
    {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },

    AvailableBalanceMainViewStyle:
    {
        height: 80,
        width: width - 50,
        borderRadius: 10,
        borderColor: 'black',
        backgroundColor: '#e8f1f8',
        alignItems: 'center',
        marginTop: 15,
        flexDirection: 'row',
    },
    AvailableBalanceSubViewStyle:
    {
        width: 55,
        height: 55,
        borderRadius: 10,
        backgroundColor: 'white',
        marginLeft: 18,
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    AvailableBalanceTxt:
    {
        color: colors.accTextColor,
        fontSize: 15,
        fontFamily: strings.fontMedium
    },
    AvailableBalanceTypetxt:
    {
        color: colors.accTextColor,
        fontSize: 17,
        fontFamily: strings.fontMedium,
        flexWrap: 'wrap',
        width: width - 50,
        fontWeight: 'bold',
        marginTop: 2
    },

    DataCardViewStyle:
    {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 5,
    },

    DatacardTextInput:
    {
        lineHeight: 40,
        height: 48,
        width: width - 50,
    },

    ConfirmBillView:
    {
        flexDirection: 'column',
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 5,
    },

    PlatformChargesStyle:
    {
        marginTop: 5,
        width: width - 60
    },

    PlatformChargesTextStyle:
    {
        fontSize: 14,
        color: "#1f3c66",
        textAlign: "left"
    },

    CheckBoxStyle:
    {
        width: 20,
        height: 20,
        marginRight: 20,
        alignSelf: 'center',
        marginLeft: 10
    },

    Textstyletwo:
    {
        fontSize: 14,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#1f3c66",
    },

    AccNoViewStyle:
    {
        flexDirection: 'column',
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },

    AccNoTextInputStyle:
    {
        lineHeight: 40,
        height: 48,
        width: width - 50,
        marginTop: 10,
    },

    BtnStyle:
    {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 20,
    },

    BtnTouchableStyle:
    {
        padding: 15,
        width: width - 50,
        justifyContent: 'center',
        borderRadius: 12,
    },
    BtnTextStyle:
    {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15
    },

    ErrorDisplay: { color: "#FF0000", marginLeft: 5, fontSize: 12 }


});
