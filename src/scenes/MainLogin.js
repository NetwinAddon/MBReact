import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    BackHandler,
    StyleSheet,
    FlatList,
    ScrollView,
    KeyboardAvoidingView,

} from 'react-native';
import {
    colors,
    strings,
    assets,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    navigation,
    RenderLoader,

} from '../App';
import { RFValue } from "react-native-responsive-fontsize";
import Footer from '../assets/icons/footer.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview'
import FixedHeader from '../components/FixedHeader';
import Rupee from '../assets/icons/rupee.svg'
import Swiper from 'react-native-swiper';
import ArrowLeftViewBal from '../assets/icons/ArrowLeftViewBal.svg';
import ArrowRightViewBal from '../assets/icons/ArrowRightViewBal.svg';
import OtpInputs from 'react-native-otp-inputs';
import Snackbar from 'react-native-snackbar';
import { _toEncrypt, decryptData, sendData } from '../common/util';

import APIUrlConstants from '../common/APIUrlConstants';
import FlipCard from 'react-native-flip-card';
import TouchID from 'react-native-touch-id';
import NetInfo from '@react-native-community/netinfo';
import FavoriteIcon from '../assets/icons/dashboardIcons/ico-favorite.svg';
import AddToFavorites from '../assets/icons/AddToFavorites.svg';


import MyAccount from '../assets/icons/dashboardIcons/ico-my-account.svg';
import MiniStatements from '../assets/icons/dashboardIcons/ico-mini-statements.svg';
import DownloadStatemet from '../assets/icons/dashboardIcons/ico-download-statement.svg';
import MPassbook from '../assets/icons/dashboardIcons/ico-m-passbook.svg';
import OpenAcc from '../assets/icons/dashboardIcons/ico-open-account.svg';
import Renew from '../assets/icons/dashboardIcons/ico-renew.svg';
import PrematuredEnqiry from '../assets/icons/dashboardIcons/ico-prematured-enquiry.svg';
import CloseAcc from '../assets/icons/dashboardIcons/ico-close-account.svg'

import OwnAcc from '../assets/icons/dashboardIcons/ico-own-account.svg';
import SameBankOtrAcc from '../assets/icons/dashboardIcons/same-bank-transfer.svg';
import QuickTransfer from '../assets/icons/dashboardIcons/ico-24x7-quick-transfer.svg';
import NeftEreq from '../assets/icons/dashboardIcons/ico-neft-e-request.svg';
import AddSI from '../assets/icons/dashboardIcons/ico-add-standing-instructions.svg';
import ViewSI from '../assets/icons/dashboardIcons/ico-view-standing-instructions.svg';
import ImpsStatus from '../assets/icons/dashboardIcons/ico-imps-txt-status.svg'

import AtmBal from '../assets/icons/dashboardIcons/ico-atm-card-balance.svg';
import AtmCardFT from '../assets/icons/dashboardIcons/ico-atm-card-fund-transf.svg';
import AtmLinkMobile from '../assets/icons/dashboardIcons/ico-atm-link-mobile.svg';
import CardBlk from '../assets/icons/dashboardIcons/ico-card-block.svg';
import CardUnblock from '../assets/icons/dashboardIcons/ico-card-unblock.svg';
import AtmMiniState from '../assets/icons/dashboardIcons/ico-atm-mini-statement.svg';
import AtmCardInfo from '../assets/icons/dashboardIcons/ico-atm-card-information.svg'

import Prepaid from '../assets/icons/dashboardIcons/ico-prepaid.svg';
import Postpaid from '../assets/icons/dashboardIcons/ico-postpaid.svg';
import BillDTH from '../assets/icons/dashboardIcons/ico-dth.svg';
import DataCard from '../assets/icons/dashboardIcons/ico-data-card.svg';
import Landline from '../assets/icons/dashboardIcons/ico-landline.svg';
import History from '../assets/icons/dashboardIcons/ico-history.svg';


import ElectricityBill from '../assets/icons/dashboardIcons/ico-electricity-bill.svg';
import MobileBill from '../assets/icons/dashboardIcons/ico-mobile-bill.svg';
import TxnHistory from '../assets/icons/dashboardIcons/ico-txn-history.svg';
import ComplainHistory from '../assets/icons/dashboardIcons/ico-complaint-history.svg';
import AgntComplaint from '../assets/icons/dashboardIcons/ico-agent-complaint.svg';
import BillerComplaint from '../assets/icons/dashboardIcons/ico-biller-complaints.svg';
import OwnFundTransfer from '../assets/icons/dashboardIcons/own_fund_transfer.svg';
import TransactionImps from '../assets/icons/dashboardIcons/transaction_imps.svg';
import FavMenuNotFound from '../assets/icons/dashboardIcons/FavMenuNotFound.svg';
import { RemoveFromFavPopup } from '../components/RemoveFromFavPopup';
import Constants from '../common/Constants';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'



class MainLogin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewBal: false,
            checkBal: true,
            FlipCardStatus: false,
            FavFlipCardStatus: false,
            FlipCardClicable: true,

            FavFlipCardClicable: true,
            UserName: this.props.NAME,
            MPin: '',
            innerViewHeight: 0,
            doubleBackToExitPressedOnce: false,
            isType: '',
            FavMenu: true,
            FavMenuButton: true,
            MenuName: '',
            MenuList: '',
            OutterViewFlex: 0.8,
            userData: '',
            confirmDialog: false,
            SelectedeAccountList: [],
            totalAmount: 0,
            positionNo: 0,
            perVal: [],
            colors: [],
            data4: [],
            labels4: [],
            combinedData: [],
            myTempData: [],
            ACNO: '',
            accountTypeBalances: {},


            isYesNoModalVisible: false,

        };
        this.DashboardAcc = []
        this.dynamicDegrees = []



        console.log("finget " + this.props.FingerPrint)


        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);


    }





    componentWillMount() {

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {

        if (this.state.doubleBackToExitPressedOnce) {

            BackHandler.exitApp();
            return true;
        }

        this.setState({ doubleBackToExitPressedOnce: true });

        Snackbar.show({
            text: 'Press back again to exit',
            duration: Snackbar.LENGTH_SHORT,
        });

        setTimeout(() => {
            this.setState({ doubleBackToExitPressedOnce: false });
        }, 2000);

        return true;

    }

    optionalConfigObject = {
        title: 'Authentication Required', // Android
        imageColor: this.props.SecondaryColor, // Android
        imageErrorColor: '#ff0000', // Android
        sensorDescription: 'Touch sensor', // Android
        sensorErrorDescription: 'Failed', // Android
        cancelText: 'Cancel', // Android
        fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
        unifiedErrors: false, // use unified error messages (default false)
        passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
    };

    toLogin() {
        this.setState({
            viewBal: false,
            checkBal: true,
            FlipCardStatus: false,
            FlipCardClicable: true,
            FavMenu: true,
            FavFlipCardStatus: false,
            FavMenuButton: true
        })

        this.props.navigation.navigate('loginTypeSelectScreen')

    }



    handleFlipCardClick = () => {
        this.setState(prevState => ({
            FlipCardStatus: !prevState.FlipCardStatus,
            FavFlipCardStatus: false // Ensure the second card is unflipped
        }));
    }

    // Function to handle flipping for the second card
    handleFavFlipCardClick = () => {
        this.setState(prevState => ({
            FavFlipCardStatus: !prevState.FavFlipCardStatus,
            FlipCardStatus: false // Ensure the first card is unflipped
        }));
    }

    onFavMenuBtn() {


        this.setState({
            checkBal: true,
            FavFlipCardStatus: false,
            FavFlipCardClicable: true,
            FlipCardStatus: false,
            isType: 'Fav Menu',

        })
        console.log("FlipCardStatus st" + this.props.FlipCardStatus)
        console.log("Fingerprint st" + this.props.FingerPrint)

        if (this.props.FingerPrint) {
            this.OpenFingerPrint();
        }
        else {
            this.setState({ FavFlipCardStatus: true })
        }

    }

    sendRequest = async (obj) => {
        try {
            console.log('ImageName : ' + Constants.GMST_CODE);
            const Headers = {
                ProdCD: Constants.ProdCD,
                BankCD: Constants.BankCode,
                OprCD: 'GETFMENU',
                Content_Type: 'application/json',
                REQ_TYPE: 'POST'
            };
            const reqParams = {
                GMST_CODE: Constants.GMST_CODE
            };

            console.log('reqParams : ' + JSON.stringify(reqParams));

            console.log('url : ' + APIUrlConstants.BASE_URL);
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

                    if (response.hasOwnProperty('fmenulist')) {
                        var responseData = response.fmenulist.map(item => JSON.parse(item.replace(/\\/g, '')));
                        console.log(response.fmenulist.length)
                        this.setState({ FavMenu: false, MenuList: responseData, OutterViewFlex: response.fmenulist.length === 5 ? 0.5 : 0.8 })
                    }
                    else {
                        console.log('responseData---' + JSON.stringify(response))
                        this.setState({ FavMenu: false, MenuList: '' })
                    }




                });


        } catch (error) {
            console.error('Error in API:', error);
        }
    };


    toQuickPay() {
        this.setState({
            viewBal: false,
            checkBal: true,
            FlipCardStatus: false,
            FlipCardClicable: true,
            isType: 'Quick Pay',
            FavFlipCardStatus: false,
            FavMenuButton: true
        })


        if (this.props.FingerPrint) {
            this.OpenFingerPrint();
        }
        else {
            this.props.navigation.navigate('quickPayMpin')
        }


    }


    ViewBalance() {

        this.setState({
            viewBal: false,
            checkBal: true,
            FlipCardStatus: false,
            FlipCardClicable: true,
            isType: 'Balance',
            FavFlipCardStatus: false,
            FavMenu: true,

        })
        console.log("FlipCardStatus" + this.state.FlipCardStatus)
        // console.log("Fingerprint st" + this.props.FingerPrint)

        if (this.props.FingerPrint) {
            this.OpenFingerPrint();
        }
        else {
            this.setState({ FlipCardStatus: true })
        }


    }





    OpenFingerPrint = async () => {

        const rnBiometrics = new ReactNativeBiometrics()
        rnBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
            .then((resultObject) => {
                const { success } = resultObject
                if (success) {
                    this.LoginWith_FingerPrint();
                } else {
                    console.log('user cancelled biometric prompt')
                }
            })
            .catch((e) => {
                console.log('biometrics failed' + e)
            })

    }

    checkInternetConnection = async () => {
        try {
            const state = await NetInfo.fetch();

            const isConnected = state.isConnected;
            console.log("Internet status:", isConnected);

            return isConnected;
        } catch (error) {
            console.error("Error checking internet connection:", error);
            return false;
        }
    };




    LoginWith_Mpin = async () => {

        const isConnected = await this.checkInternetConnection();

        if (isConnected) {



            if (this.props.userId.toLowerCase() === 'google') {
                Constants.BankCode = 'GOOGLE'
                APIUrlConstants.BASE_URL = APIUrlConstants.Google_Rest_Url

            }

            let userId = await _toEncrypt(this.props.userId)

            const simid = '00000000-05ec-ff6b-0000-00005659f38b';

            const Headers = APIUrlConstants.Headers("LOGIN");

            const jsonReq =
            {
                MPIN: this.state.MPin,
            }

            let jsonValue = JSON.stringify(jsonReq)
            console.log("Json " + jsonValue);

            let Mpin = await _toEncrypt(jsonValue)
            console.log("Json " + Mpin);
            const Body =
            {
                PARACNT: "5",
                PARA1_TYP: "STR",
                PARA1_VAL: userId,
                PARA2_TYP: "STR",
                PARA2_VAL: Mpin,
                PARA3_TYP: "STR",
                PARA3_VAL: this.props.DeviceId,
                PARA4_TYP: "STR",
                PARA4_VAL: simid,
                PARA5_TYP: "STR",
                PARA5_VAL: Constants.BankCode + "#98#98",

            }
            console.log("LoginWithMpin URL:- " + APIUrlConstants.BASE_URL);
            console.log("");
            console.log("LoginWithMpin Body:- " + JSON.stringify(Body));
            console.log("");

            sendData(this,
                'post',
                APIUrlConstants.BASE_URL,
                Headers,
                JSON.stringify(Body),
                async (obj, response) => {
                    var responseData = await decryptData(response)
                    var newRes = responseData.slice(16)
                    var finalRes = JSON.parse(newRes)

                    console.log("LoginWithMpin Response:- " + JSON.stringify(finalRes));

                    let res = finalRes.SUCCESS
                    if (res === "FALSE") {

                        const ErrorMsg = finalRes.RESULT
                        // ToastAndroid.show(ErrorMsg, ToastAndroid.SHORT)
                        Snackbar.show({
                            text: ErrorMsg,
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: 'red'
                        });

                    }
                    else if (res === "TRUE") {

                        Constants.Name = finalRes.NAME;
                        Constants.BRANCH_CODE = finalRes.BRANCH_CODE;
                        Constants.GMST_CODE = finalRes.GMST_CODE;
                        Constants.DEPOSIT_CBSVER = finalRes.DEPOSIT_CBSVER;
                        Constants.SecretKey = finalRes.SK;
                        Constants.MobileNumber = finalRes.TELE;
                        Constants.LAST_LOGIN = finalRes.LAST_LOGIN;
                        Constants.UserId = this.props.userId;
                        Constants.BNK_SRV_CHRG = finalRes.BNK_SRV_CHRG;
                        Constants.BNK_SRV_CHRG_BILL = finalRes.BNK_SRV_CHRG_BILL;
                        Constants.BNK_SRV_CHRG_DTH = finalRes.BNK_SRV_CHRG_DTH;
                        Constants.BNK_SRV_CHRG_ELE = finalRes.BNK_SRV_CHRG_ELE;
                        Constants.IMPS_HISTORY_INCREMENT = finalRes.IMPS_HISTORY_INCREMENT;
                        Constants.IS_ATM = finalRes.IS_ATM;
                        Constants.IS_BBPS = finalRes.IS_BBPS;
                        Constants.IS_CHQ = finalRes.IS_CHQ;
                        Constants.IS_ELEC = finalRes.IS_ELEC;
                        Constants.IS_IMPS = finalRes.IS_IMPS;
                        Constants.IS_IMPSFAST = finalRes.IS_IMPSFAST;
                        Constants.IS_NEFT = finalRes.IS_NEFT;
                        Constants.IS_RCHG = finalRes.IS_RCHG;
                        Constants.NEFTIMPSFRMTS = finalRes.NEFTIMPSFRMTS;
                        Constants.NET_SRV_CHRG = finalRes.NET_SRV_CHRG;
                        Constants.NET_SRV_CHRG_ELE = finalRes.NET_SRV_CHRG_ELE;
                        Constants.OTP_RESEND_COUNTER = finalRes.OTP_RESEND_COUNTER;
                        Constants.PASSBOOK_INCREMENT = finalRes.PASSBOOK_INCREMENT;
                        Constants.RD_ALLOWDY = finalRes.RD_ALLOWDY;
                        Constants.RECHARGE_OPTIONS_CODE = finalRes.RECHARGE_OPTIONS_CODE;
                        Constants.SERVICE_PROVIDER = finalRes.SERVICE_PROVIDER;
                        Constants.UPI_MAIN_MENU_CODE = finalRes.UPI_MAIN_MENU_CODE;
                        Constants.UPI_OPTIONS_CODE = finalRes.UPI_OPTIONS_CODE;
                        Constants.UPI_SCAN_AND_PAY_OPTION = finalRes.UPI_SCAN_AND_PAY_OPTION;
                        Constants.UPI_SUB_MENU_CODE = finalRes.UPI_SUB_MENU_CODE;


                        // console.log("Fetched Data:- Name", finalRes.NAME)
                        // console.log("Fetched Data:- SecretKey", Constants.SecretKey)

                        this.props.setGmstCode(finalRes.GMST_CODE)
                        // console.log("GMST_CODE: ", this.props.gmstCode)

                        this.props.setSecretKey(finalRes.SK)
                        // console.log("SecretKey: ", this.props.SecretKey)

                        this.props.setNAME(finalRes.NAME)
                        // console.log("Name: ", this.props.NAME)
                        const MpinPresent = finalRes.MPIN_PRESENT

                        //HRP Task No - 106764 -5-Dec-2023
                        this.setState({ customData: finalRes })


                        let userAccArray = finalRes.Acdtls


                        // DAA - for showing only saving and current a/c 
                        if (userAccArray.length > 0) {

                            this.DashboardAcc.splice(0, this.DashboardAcc.length);

                            userAccArray.map((item) => {

                                this.DashboardAcc.push(JSON.parse(item))

                            })
                            this.state.SelectedeAccountList = this.DashboardAcc[0]

                        }
                        this.AccData = this.DashboardAcc.map(item => ({
                            ACTYPE: item.ACTYPE,
                            BALANCE: item.BALANCE,
                            AC_NO: item.AC_NO
                        }));


                        if (userAccArray.length > 0) {

                            this.DashboardAcc.splice(0, this.DashboardAcc.length);

                            userAccArray.map((item) => {

                                this.DashboardAcc.push(JSON.parse(item))

                            })
                            this.state.SelectedeAccountList = this.DashboardAcc[0]

                        }

                        //Setting oth position of account details if exists
                        if (this.DashboardAcc.length > 0) {
                            this.state.Selected_ACTYPE = this.DashboardAcc[0].ACTYPE.toLowerCase()
                            Constants.Selected_ACTYPE = this.DashboardAcc[0].ACTYPE
                            Constants.Selected_GMST_CODE = this.DashboardAcc[0].GMST_CODE
                            Constants.Selected_AC_NO = this.DashboardAcc[0].AC_NO
                            Constants.Selected_ACMASTCODE = this.DashboardAcc[0].ACMASTCODE
                            Constants.Selected_BALANCE = this.DashboardAcc[0].BALANCE
                        }


                        this.DashboardAcc.forEach(element => {
                            if (element.ACTYPE === 'CURRENT ACCOUNT' || element.ACTYPE === 'SAVING ACCOUNT') {
                                console.log("In")
                                this.state.totalAmount = this.state.totalAmount + Math.abs((element.BALANCE))
                            }

                        });

                        this.DashboardAcc.forEach(element => {

                            if (element.ACTYPE === 'CURRENT ACCOUNT' || element.ACTYPE === 'SAVING ACCOUNT') {
                                const existing = this.state.myTempData.find(e => e.ACTYPE == element.ACTYPE);
                                if (existing) {
                                    existing.time += element.BALANCE;
                                } else {
                                    this.state.myTempData.push({ BALANCE: element.BALANCE, ACTYPE: element.ACTYPE });
                                }

                            }
                            return null;
                        });








                        console.log("=====" + JSON.stringify(this.state.customData))
                        this.sendRequest(obj);







                    }

                })


        } else {
            Snackbar.show({ text: 'Check Internet Connection', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });



        }


    }

    LoginWith_FingerPrint = async () => {

        const isConnected = await this.checkInternetConnection();

        if (isConnected) {



            if (this.props.userId.toLowerCase() === 'google') {
                Constants.BankCode = 'GOOGLE'
                APIUrlConstants.BASE_URL = APIUrlConstants.Google_Rest_Url

            }


            const simid = '00000000-05ec-ff6b-0000-00005659f38b';

            let userId = await _toEncrypt(this.props.userId)
            let Password = await _toEncrypt(this.props.LoginPass)

            const Headers = APIUrlConstants.Headers("LOGIN");

            const Body =
            {
                PARACNT: "5",
                PARA1_TYP: "STR",
                PARA1_VAL: userId,
                PARA2_TYP: "STR",
                PARA2_VAL: Password,
                PARA3_TYP: "STR",
                PARA3_VAL: this.props.DeviceId,
                PARA4_TYP: "STR",
                PARA4_VAL: simid,
                PARA5_TYP: "STR",
                PARA5_VAL: "{\"DEVICE_LATTIDUTE\":\"" + this.state.Latitude + "\",\"DEVICE_LONGITUDE\":\"" + this.state.Longitude + "\",\"DEVICE_LOCAL_IP\":\"\",\"DEVICE_PUBLIC_IP\":\"\",\"DEVICE_ISP_OPERATOR\":\"\",\"BANK_CODE\":\"" + Constants.BankCode + "\",\"RESTRICTION_VER\":\"98\",\"REGULAR_VER\":\"98\"}",

            }
            console.log("LoginWithIdPass URL:- " + APIUrlConstants.BASE_URL);
            console.log("");
            console.log("LoginWithIdPass Body:- " + JSON.stringify(Body));
            console.log("");

            sendData(this,
                'post',
                APIUrlConstants.BASE_URL,
                Headers,
                JSON.stringify(Body),
                async (obj, response) => {
                    var responseData = await decryptData(response)
                    var newRes = responseData.slice(16)
                    var finalRes = JSON.parse(newRes)

                    console.log("ViewBalance Response:- " + JSON.stringify(finalRes));

                    let res = finalRes.SUCCESS
                    if (res === "FALSE") {

                        const ErrorMsg = finalRes.RESULT
                        Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });

                    }
                    else if (res === "TRUE") {


                        if (this.state.isType === 'Balance') {

                            let userAccArray = finalRes.Acdtls


                            // DAA - for showing only saving and current a/c 
                            if (userAccArray.length > 0) {
                                this.DashboardAcc.splice(0, this.DashboardAcc.length);

                                userAccArray.forEach((item) => {
                                    const parsedData = JSON.parse(item);
                                    // Check if the account type is either "SAVING ACCOUNT" or "CURRENT ACCOUNT"
                                    if (parsedData.ACTYPE === "SAVING ACCOUNT" || parsedData.ACTYPE === "CURRENT ACCOUNT" || parsedData.ACTYPE === 'LOAN ACCOUNT' && (parsedData.SUB_TYPE === '2' || parsedData.SUB_TYPE === '6' || parsedData.SUB_TYPE === '7')) {
                                        this.DashboardAcc.push(parsedData);
                                    }
                                });
                            }

                            this.AccData = this.DashboardAcc.map(item => ({
                                ACTYPE: item.ACTYPE,
                                BALANCE: item.BALANCE,
                                AC_NO: item.AC_NO
                            }));

                            console.log("AccountList === ", this.AccData)

                            this.setState({ checkBal: false, FlipCardClicable: false, FavMenuButton: false })

                        }
                        else if (this.state.isType === 'Fav Menu') {


                            Constants.Name = finalRes.NAME;
                            Constants.BRANCH_CODE = finalRes.BRANCH_CODE;
                            Constants.GMST_CODE = finalRes.GMST_CODE;
                            Constants.DEPOSIT_CBSVER = finalRes.DEPOSIT_CBSVER;
                            Constants.SecretKey = finalRes.SK;
                            Constants.MobileNumber = finalRes.TELE;
                            Constants.LAST_LOGIN = finalRes.LAST_LOGIN;
                            Constants.UserId = this.props.userId;
                            Constants.BNK_SRV_CHRG = finalRes.BNK_SRV_CHRG;
                            Constants.BNK_SRV_CHRG_BILL = finalRes.BNK_SRV_CHRG_BILL;
                            Constants.BNK_SRV_CHRG_DTH = finalRes.BNK_SRV_CHRG_DTH;
                            Constants.BNK_SRV_CHRG_ELE = finalRes.BNK_SRV_CHRG_ELE;
                            Constants.IMPS_HISTORY_INCREMENT = finalRes.IMPS_HISTORY_INCREMENT;
                            Constants.IS_ATM = finalRes.IS_ATM;
                            Constants.IS_BBPS = finalRes.IS_BBPS;
                            Constants.IS_CHQ = finalRes.IS_CHQ;
                            Constants.IS_ELEC = finalRes.IS_ELEC;
                            Constants.IS_IMPS = finalRes.IS_IMPS;
                            Constants.IS_IMPSFAST = finalRes.IS_IMPSFAST;
                            Constants.IS_NEFT = finalRes.IS_NEFT;
                            Constants.IS_RCHG = finalRes.IS_RCHG;
                            Constants.NEFTIMPSFRMTS = finalRes.NEFTIMPSFRMTS;
                            Constants.NET_SRV_CHRG = finalRes.NET_SRV_CHRG;
                            Constants.NET_SRV_CHRG_ELE = finalRes.NET_SRV_CHRG_ELE;
                            Constants.OTP_RESEND_COUNTER = finalRes.OTP_RESEND_COUNTER;
                            Constants.PASSBOOK_INCREMENT = finalRes.PASSBOOK_INCREMENT;
                            Constants.RD_ALLOWDY = finalRes.RD_ALLOWDY;
                            Constants.RECHARGE_OPTIONS_CODE = finalRes.RECHARGE_OPTIONS_CODE;
                            Constants.SERVICE_PROVIDER = finalRes.SERVICE_PROVIDER;
                            Constants.UPI_MAIN_MENU_CODE = finalRes.UPI_MAIN_MENU_CODE;
                            Constants.UPI_OPTIONS_CODE = finalRes.UPI_OPTIONS_CODE;
                            Constants.UPI_SCAN_AND_PAY_OPTION = finalRes.UPI_SCAN_AND_PAY_OPTION;
                            Constants.UPI_SUB_MENU_CODE = finalRes.UPI_SUB_MENU_CODE;


                            // console.log("Fetched Data:- Name", finalRes.NAME)
                            // console.log("Fetched Data:- SecretKey", Constants.SecretKey)

                            this.props.setGmstCode(finalRes.GMST_CODE)
                            // console.log("GMST_CODE: ", this.props.gmstCode)

                            this.props.setSecretKey(finalRes.SK)
                            // console.log("SecretKey: ", this.props.SecretKey)

                            this.props.setNAME(finalRes.NAME)
                            // console.log("Name: ", this.props.NAME)
                            const MpinPresent = finalRes.MPIN_PRESENT

                            //HRP Task No - 106764 -5-Dec-2023
                            this.setState({ customData: finalRes })


                            let userAccArray = finalRes.Acdtls


                            // DAA - for showing only saving and current a/c 
                            if (userAccArray.length > 0) {

                                this.DashboardAcc.splice(0, this.DashboardAcc.length);
                                userAccArray.map((item) => {

                                    this.DashboardAcc.push(JSON.parse(item))

                                })
                                this.state.SelectedeAccountList = this.DashboardAcc[0]

                            }
                            this.AccData = this.DashboardAcc.map(item => ({
                                ACTYPE: item.ACTYPE,
                                BALANCE: item.BALANCE,
                                AC_NO: item.AC_NO
                            }));
                            if (userAccArray.length > 0) {

                                this.DashboardAcc.splice(0, this.DashboardAcc.length);

                                userAccArray.map((item) => {

                                    this.DashboardAcc.push(JSON.parse(item))

                                })
                                this.state.SelectedeAccountList = this.DashboardAcc[0]

                            }

                            //Setting oth position of account details if exists
                            if (this.DashboardAcc.length > 0) {
                                this.state.Selected_ACTYPE = this.DashboardAcc[0].ACTYPE.toLowerCase()
                                Constants.Selected_ACTYPE = this.DashboardAcc[0].ACTYPE
                                Constants.Selected_GMST_CODE = this.DashboardAcc[0].GMST_CODE
                                Constants.Selected_AC_NO = this.DashboardAcc[0].AC_NO
                                Constants.Selected_ACMASTCODE = this.DashboardAcc[0].ACMASTCODE
                                Constants.Selected_BALANCE = this.DashboardAcc[0].BALANCE
                            }


                            this.DashboardAcc.forEach(element => {
                                if (element.ACTYPE === 'CURRENT ACCOUNT' || element.ACTYPE === 'SAVING ACCOUNT') {
                                    console.log("In")
                                    this.state.totalAmount = this.state.totalAmount + Math.abs((element.BALANCE))
                                }

                            });

                            this.DashboardAcc.forEach(element => {

                                if (element.ACTYPE === 'CURRENT ACCOUNT' || element.ACTYPE === 'SAVING ACCOUNT') {
                                    const existing = this.state.myTempData.find(e => e.ACTYPE == element.ACTYPE);
                                    if (existing) {
                                        existing.time += element.BALANCE;
                                    } else {
                                        this.state.myTempData.push({ BALANCE: element.BALANCE, ACTYPE: element.ACTYPE });
                                    }

                                }
                                return null;
                            });








                            // console.log("11111" + JSON.stringify(this.state.customData))
                            this.sendRequest(obj);



                        }
                        else {


                            Constants.Name = finalRes.NAME;
                            Constants.BRANCH_CODE = finalRes.BRANCH_CODE;
                            Constants.GMST_CODE = finalRes.GMST_CODE;
                            Constants.DEPOSIT_CBSVER = finalRes.DEPOSIT_CBSVER;
                            Constants.SecretKey = finalRes.SK;
                            Constants.MobileNumber = finalRes.TELE //HRP 107514

                            this.props.setGmstCode(finalRes.GMST_CODE)

                            this.props.setSecretKey(finalRes.SK)

                            this.props.setNAME(finalRes.NAME)

                            this.props.navigation.navigate('quickPayScreen', { accList: finalRes.Acdtls.map(item => JSON.parse(item.replace(/\\/g, ''))) })



                        }

                    }

                })


        } else {
            Snackbar.show({ text: 'Check Internet Connection', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
        }
    }

    ViewBalance_Mpin = async () => {

        if (this.state.MPin.length === 4) {


            if (this.props.userId.toLowerCase() === 'google') {
                Constants.BankCode = 'GOOGLE'
                APIUrlConstants.BASE_URL = APIUrlConstants.Google_Rest_Url

            }

            let userId = await _toEncrypt(this.props.userId)

            const simid = '00000000-05ec-ff6b-0000-00005659f38b';


            const Headers = APIUrlConstants.Headers("LOGIN");


            const jsonReq =
            {
                MPIN: this.state.MPin,
            }

            let jsonValue = JSON.stringify(jsonReq)
            console.log("Json " + jsonValue);

            let Mpin = await _toEncrypt(jsonValue)
            console.log("Json " + Mpin);

            const Body =
            {
                PARACNT: "5",
                PARA1_TYP: "STR",
                PARA1_VAL: userId,
                PARA2_TYP: "STR",
                PARA2_VAL: Mpin,
                PARA3_TYP: "STR",
                PARA3_VAL: this.props.DeviceId,
                PARA4_TYP: "STR",
                PARA4_VAL: simid,
                PARA5_TYP: "STR",
                PARA5_VAL: Constants.BankCode + "#98#98",

            }
            console.log("ViewBalance URL:- " + APIUrlConstants.BASE_URL);
            console.log("");
            console.log("ViewBalance Body:- " + JSON.stringify(Body));
            console.log("");

            sendData(this,
                'post',
                APIUrlConstants.BASE_URL,
                Headers,
                JSON.stringify(Body),
                async (obj, response) => {
                    var responseData = await decryptData(response)
                    var newRes = responseData.slice(16)
                    var finalRes = JSON.parse(newRes)

                    console.log("ViewBalance Response:- " + JSON.stringify(finalRes));

                    let res = finalRes.SUCCESS
                    if (res === "FALSE") {

                        const ErrorMsg = finalRes.RESULT
                        Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });

                    }
                    else if (res === "TRUE") {

                        let userAccArray = finalRes.Acdtls


                        // DAA - for showing only saving and current a/c 
                        if (userAccArray.length > 0) {
                            this.DashboardAcc.splice(0, this.DashboardAcc.length);

                            userAccArray.forEach((item) => {
                                const parsedData = JSON.parse(item);
                                // Check if the account type is either "SAVING ACCOUNT" or "CURRENT ACCOUNT"
                                if (parsedData.ACTYPE === "SAVING ACCOUNT" || parsedData.ACTYPE === "CURRENT ACCOUNT" || parsedData.ACTYPE === 'LOAN ACCOUNT' && (parsedData.SUB_TYPE === '2' || parsedData.SUB_TYPE === '6' || parsedData.SUB_TYPE === '7')) {
                                    this.DashboardAcc.push(parsedData);
                                }
                            });
                        }


                        this.AccData = this.DashboardAcc.map(item => ({
                            ACTYPE: item.ACTYPE,
                            BALANCE: item.BALANCE,
                            AC_NO: item.AC_NO
                        }));

                        console.log("AccountList  -------------- ", this.AccData)

                        this.setState({ checkBal: false, FlipCardClicable: false, })

                    }

                })

        }
        else {
            Snackbar.show({ text: "Enter Mpin", duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });

        }

    }






    onBackAction() {
        if (this.state.doubleBackToExitPressedOnce) {

            BackHandler.exitApp();
            return true;
        }

        this.setState({ doubleBackToExitPressedOnce: true });

        Snackbar.show({ text: 'Press back again to exit', duration: Snackbar.LENGTH_SHORT, });

        setTimeout(() => {
            this.setState({ doubleBackToExitPressedOnce: false });
        }, 2000);

    }

    toCheckBal() {
        navigation.navigate(this, 'mainLoginViewBal')
        console.log('onpress')
    }

    CustomNextButton = () => (
        <View style={{ height: 20, width: 20, }}>
            <ArrowRightViewBal height={20} width={20} />

        </View>
    );

    CustomPrevButton = () => (
        <View style={{ height: 20, width: 20, }}>
            <ArrowLeftViewBal height={20} width={20} />
        </View>
    );
    hideDialog = () => {
        this.setState({ confirmDialog: false })
        this.sendRequest(this)
    }

    handleInnerViewLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ innerViewHeight: height });
    };


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <KeyboardAvoidingView
                    keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : ''}
                    enabled={true}>

                    {this.state.confirmDialog === true ? (

                        <RemoveFromFavPopup
                            isVisible={this.state.confirmDialog}
                            isDisabled={this.hideDialog}
                            MenuName={this.state.MenuName}
                            onConfirm={this.onConfirm}
                            obj={this}
                        />
                    ) : null}

                    <FixedHeader
                        backAction={() => this.onBackAction()}
                        color={colors.btnColor} />


                    <View style={{ flex: this.state.OutterViewFlex, alignItems: 'center', }}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Image
                                source={assets.companyImage}
                                style={{
                                    height: 72,
                                    width: 196,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingBottom: 10,
                                    marginBottom: 5,
                                }}
                            />
                            <Text style={{
                                color: colors.btnColor,
                                textAlign: 'center',
                                fontFamily: strings.fontMedium,
                                marginTop: 21
                            }}>
                                {strings.companyName}</Text>
                        </View>

                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                        }}>
                            <View style={{
                                marginLeft: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <Text style={{
                                    fontSize: 17,
                                    textAlign: 'left',
                                    fontFamily: strings.fontMedium,
                                    color: this.props.PrimaryColor,
                                }}>{strings.strHi}
                                </Text>

                                <Text style={{
                                    fontSize: 17,
                                    color: 'black',
                                    textAlign: 'left',
                                    paddingLeft: 2,
                                    fontFamily: strings.fontBold,
                                    color: this.props.PrimaryColor,
                                }}>{this.state.UserName}
                                </Text>

                            </View>

                            {/* Login & QuickPay Button */}
                            <View style={{
                                width: width - 20,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <CardView
                                    cardElevation={3}
                                    cardMaxElevation={3}
                                    cornerRadius={12}
                                    style={{
                                        margin: 15,
                                        backgroundColor: 'gray',
                                        justifyContent: 'center',
                                        flex: 1,
                                    }}>
                                    <TouchableOpacity
                                        style={[styles.ButtonStyle, { backgroundColor: this.props.PrimaryColor, }]}
                                        onPress={() => this.toLogin()} >
                                        <Text style={styles.ButtonTextStyle}>{strings.logIn}</Text>
                                    </TouchableOpacity>
                                </CardView>

                                <CardView
                                    cardElevation={3}
                                    cardMaxElevation={3}
                                    cornerRadius={12}
                                    style={{
                                        margin: 15,
                                        flex: 1,
                                        // height: 45,
                                        backgroundColor: 'gray',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <TouchableOpacity
                                        style={[styles.ButtonStyle, { backgroundColor: this.props.PrimaryColor, }]}
                                        onPress={() => this.toQuickPay()}
                                    >
                                        <Text style={styles.ButtonTextStyle}> {strings.strQuickPay}</Text>

                                    </TouchableOpacity>
                                </CardView>

                            </View>


                            <View style={{ height: this.state.innerViewHeight, }}>

                                {this.state.checkBal ?

                                    <FlipCard
                                        flipHorizontal={true}
                                        flipVertical={false}
                                        clickable={this.state.FlipCardClicable}
                                        flip={this.state.FlipCardStatus}
                                        onFlipEnd={() => {
                                            console.log(this.state.FlipCardStatus);
                                        }}
                                    >


                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                margin: 15,
                                                marginTop: 5,
                                                padding: 15,
                                                backgroundColor: colors.white,
                                                borderWidth: 2,
                                                borderColor: this.props.PrimaryColor,
                                                borderRadius: 12,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                Height: 'wrap-content',
                                                flexWrap: "wrap"
                                            }}

                                            onPress={() => this.ViewBalance()}
                                            onLayout={this.handleInnerViewLayout}
                                        >
                                            <Rupee color={this.props.PrimaryColor} height={20} width={20} />
                                            <Text style={{
                                                marginLeft: 10,
                                                alignSelf: 'center',
                                                color: this.props.PrimaryColor,
                                                fontFamily: strings.fontMedium,
                                                fontSize: 15
                                            }}>
                                                {strings.checkBal}
                                            </Text>
                                        </TouchableOpacity>


                                        < View style={{ marginHorizontal: 10, }}
                                            onLayout={this.handleInnerViewLayout}
                                        >

                                            <CardView
                                                cardElevation={3}
                                                cardMaxElevation={3}
                                                cornerRadius={12}
                                                style={{ backgroundColor: 'white' }}
                                            >

                                                <View style={{ paddingVertical: 15, alignItems: 'center', paddingHorizontal: 5, }}>

                                                    <Text style={[styles.MainText, { color: this.props.PrimaryColor }]}>Enter Mpin</Text>

                                                    <OtpInputs
                                                        style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' }}
                                                        handleChange={(code) => {
                                                            this.setState({ MPin: code })
                                                            console.log("mpin " + code)
                                                        }}
                                                        numberOfInputs={4}
                                                        keyboardType="numeric"
                                                        secureTextEntry={true}
                                                        inputContainerStyles={{
                                                            flex: 1,
                                                            height: 45,
                                                            width: 50,
                                                            marginHorizontal: 5,
                                                            borderWidth: 1,
                                                            justifyContent: 'center',
                                                            backgroundColor: colors.otpBackColor,
                                                            borderColor: colors.otpBorderColor,
                                                            borderRadius: 8,
                                                        }}
                                                        focusStyles={{ borderColor: this.props.SecondaryColor, }}
                                                        inputStyles={{
                                                            fontSize: 15,
                                                            color: this.props.textColor,
                                                            fontFamily: strings.fontMedium,
                                                            textAlign: 'center',
                                                        }}
                                                        selectionColor={this.props.SecondaryColor}
                                                        autofillFromClipboard={false}
                                                    />

                                                    <TouchableOpacity
                                                        style={[styles.ButtonStyle, { backgroundColor: this.props.PrimaryColor, marginTop: 15, alignItems: 'stretch', }]}
                                                        onPress={() => this.ViewBalance_Mpin()}>
                                                        <Text style={styles.ButtonTextStyle}>View Balance</Text>
                                                    </TouchableOpacity>



                                                </View>



                                            </CardView>

                                        </View>






                                    </FlipCard>

                                    :
                                    <View style={{
                                        width: width - 40,
                                        marginLeft: 10,
                                        marginBottom: 10,
                                        alignItems: 'center',
                                        borderWidth: 0.1,
                                        height: 130,
                                        justifyContent: 'center',
                                        borderRadius: 12,
                                    }}
                                        onLayout={this.handleInnerViewLayout}
                                    >
                                        <CardView
                                            cardElevation={3}
                                            cardMaxElevation={3}
                                            cornerRadius={12}
                                            style={{ backgroundColor: 'white' }}

                                        >
                                            <Swiper
                                                key={this.AccData.length}
                                                showsButtons={true}
                                                scrollEnabled={false}
                                                nextButton={<this.CustomNextButton />}
                                                prevButton={<this.CustomPrevButton />}
                                                loop={false}
                                                showsPagination={false}>
                                                {this.AccData.map((object, i) => {
                                                    return (
                                                        <View
                                                            key={i}
                                                            style={{
                                                                height: 130,
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}>
                                                            <Text
                                                                style={{
                                                                    fontSize: 14,
                                                                    color: colors.accBalTextColor,
                                                                    fontFamily: strings.fontRegular,
                                                                    textTransform: 'capitalize'
                                                                }}
                                                            >{object.ACTYPE}{strings.mainBal}</Text>


                                                            <Text
                                                                style={{
                                                                    fontSize: 12,
                                                                    color: colors.accBalTextColor,
                                                                    fontFamily: strings.fontRegular
                                                                }}
                                                            >{strings.mainAvailBal}</Text>



                                                            <View style={{
                                                                flexDirection: 'row',
                                                                justifyContent: 'center',
                                                                alignItems: 'center'
                                                            }}>
                                                                <Text style={{
                                                                    fontSize: 33,
                                                                    color: this.props.PrimaryColor,
                                                                    fontFamily: strings.fontBold
                                                                }}>{strings.mainRsSymbol}</Text>
                                                                <Text style={{
                                                                    fontSize: 33,
                                                                    color: this.props.PrimaryColor,
                                                                    fontFamily: strings.fontBold,
                                                                    marginLeft: 2
                                                                }}>{object.BALANCE.startsWith('-') ? (object.BALANCE.replace('-', '') + " Cr") : (object.BALANCE + " Dr")}</Text>
                                                            </View>
                                                            <Text style={{
                                                                fontSize: 10,
                                                                color: colors.accBalTextColor,
                                                                fontFamily: strings.fontMedium
                                                            }}>A/c No: {object.AC_NO}</Text>

                                                        </View>
                                                    )
                                                })

                                                }
                                            </Swiper>
                                        </CardView>
                                    </View>

                                }

                            </View>


                            {this.state.FavMenuButton ? (
                                <View style={{ marginTop: 20 }}>

                                    {this.state.FavMenu ? (
                                        <FlipCard
                                            flipHorizontal={true}
                                            flipVertical={false}
                                            clickable={this.state.FavFlipCardClickable}
                                            flip={this.state.FavFlipCardStatus}
                                            onFlipEnd={() => {
                                                console.log(this.state.FlipCardStatus)

                                            }}
                                        >

                                            <TouchableOpacity
                                                onPress={() => { this.onFavMenuBtn() }}
                                                style={{
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >

                                                <View style={{ height: 63, width: 184, backgroundColor: this.props.SecondaryColor, borderRadius: 50, justifyContent: 'center' }}>
                                                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                                        <FavoriteIcon height={25} width={25} color={'white'} />
                                                        <Text style={{
                                                            marginLeft: 10,
                                                            fontSize: 14,
                                                            textAlign: 'center',
                                                            color: 'white',
                                                            fontFamily: strings.fontBold,
                                                            fontWeight: '700',
                                                            alignSelf: 'center'
                                                        }}>
                                                            Favourite Menu </Text>
                                                    </View>
                                                </View>

                                            </TouchableOpacity>

                                            <View style={{ marginHorizontal: 10, }}>
                                                <CardView
                                                    cardElevation={3}
                                                    cardMaxElevation={3}
                                                    cornerRadius={12}
                                                    style={{ backgroundColor: 'white' }}
                                                >

                                                    <View style={{ paddingVertical: 15, alignItems: 'center', paddingHorizontal: 5, }}>

                                                        <Text style={[styles.MainText, { color: this.props.PrimaryColor }]}>Enter Mpin</Text>

                                                        <OtpInputs
                                                            style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' }}
                                                            handleChange={(code) => {
                                                                this.setState({ MPin: code })
                                                                console.log("mpin " + code)
                                                            }}
                                                            numberOfInputs={4}
                                                            keyboardType="numeric"
                                                            secureTextEntry={true}
                                                            inputContainerStyles={{
                                                                flex: 1,
                                                                height: 45,
                                                                width: 50,
                                                                marginHorizontal: 5,
                                                                borderWidth: 1,
                                                                justifyContent: 'center',
                                                                backgroundColor: colors.otpBackColor,
                                                                borderColor: colors.otpBorderColor,
                                                                borderRadius: 8,
                                                            }}
                                                            focusStyles={{ borderColor: this.props.SecondaryColor, }}
                                                            inputStyles={{
                                                                fontSize: 15,
                                                                color: this.props.textColor,
                                                                fontFamily: strings.fontMedium,
                                                                textAlign: 'center',
                                                            }}
                                                            selectionColor={this.props.SecondaryColor}
                                                            autofillFromClipboard={false}
                                                        />

                                                        <TouchableOpacity
                                                            style={[styles.ButtonStyle, { backgroundColor: this.props.PrimaryColor, marginTop: 15, alignItems: 'stretch', }]}
                                                            onPress={() => this.LoginWith_Mpin()}>
                                                            <Text style={styles.ButtonTextStyle}>View Favorite Menus</Text>
                                                        </TouchableOpacity>

                                                    </View>

                                                </CardView>
                                            </View>

                                        </FlipCard>
                                    ) : (

                                        this.state.MenuList === '' ? (

                                            <View style={{ alignItems: 'center', justifyContent: 'center', alignItems: 'center' }}>

                                                <FavMenuNotFound style={{ width: width - 50 }} />


                                            </View>

                                        ) : (
                                            <View >
                                                <View style={{ alignItems: 'center', }}>
                                                    <CardView
                                                        cardElevation={3}
                                                        cardMaxElevation={3}
                                                        cornerRadius={15}
                                                        style={{ backgroundColor: colors.white, width: width - 26, marginTop: 5 }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 15,
                                                                fontWeight: "500",
                                                                fontFamily: "SF UI Display",
                                                                color: "#1f3c66",
                                                                paddingLeft: 15,
                                                                paddingTop: 10,
                                                            }}
                                                        >
                                                            Favourite Menu List
                                                        </Text>
                                                        <FlatList
                                                            data={this.state.MenuList}
                                                            numColumns={4}
                                                            keyExtractor={(item, index) => index.toString()}
                                                            renderItem={({ item }) => {
                                                                const menuComponentMappings = {
                                                                    'My Account': <MyAccount height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Mini Statements': <MiniStatements height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Download Statement': <DownloadStatemet height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'M-Passbook': <MPassbook height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Within Bank Own A/c': <OwnFundTransfer height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Within Bank Other A/c': <SameBankOtrAcc height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'IMPS Transfer': <QuickTransfer height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'NEFT': <NeftEreq height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'IMPS TXT. Status': <TransactionImps height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Prepaid': <Prepaid height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Postpaid': <Postpaid height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'DTH': <BillDTH height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Data Card': <DataCard height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Landline': <Landline height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'History': <History height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Electricity Bill': <ElectricityBill height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Mobile Bill': <MobileBill height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Txn History': <TxnHistory height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Complaint History': <ComplainHistory height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Agent Complaint': <AgntComplaint height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Biller Complaints': <BillerComplaint height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Open A/c': <OpenAcc height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Renew': <Renew height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Prematured Enquiry': <PrematuredEnqiry height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Close A/c': <CloseAcc height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Add Standing Instructions': <AddSI height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'View Standing Instructions': <ViewSI height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'ATM Card Balance': <AtmBal height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'ATM Card Fund Transf.': <AtmCardFT height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'ATM Link Mobile': <AtmLinkMobile height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Card Block': <CardBlk height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'Card Unblock': <CardUnblock height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'ATM Mini Statement': <AtmMiniState height={22} width={22} color={this.props.SecondaryColor} />,
                                                                    'ATM Card Information': <AtmCardInfo height={22} width={22} color={this.props.SecondaryColor} />,
                                                                };




                                                                const defaultComponent = <MyAccount height={22} width={22} color={this.props.SecondaryColor} />;
                                                                const renderedComponent = menuComponentMappings[item.MENU_NAME] || defaultComponent;

                                                                return (
                                                                    <TouchableOpacity
                                                                        style={styles.FlatListTouchableStyle}
                                                                        activeOpacity={0.5}
                                                                        onLongPress={() => {
                                                                            this.setState({ confirmDialog: true });
                                                                            this.setState({ MenuName: item });
                                                                        }}
                                                                        onPress={() => {
                                                                            console.log("item click is", this.state.SelectedeAccountList)
                                                                            if (item.MENU_NAME == 'My Account') {
                                                                                navigation.navigate(this, 'myAccountList', this.DashboardAcc)
                                                                            }
                                                                            else if (item.MENU_NAME == 'Mini Statements') {
                                                                                navigation.navigate(this, 'myAccountMiniStatement', this.DashboardAcc)

                                                                            }
                                                                            else if (item.MENU_NAME == 'Download Statement') {
                                                                                navigation.navigate(this, 'downloadStatement', this.DashboardAcc)

                                                                            }
                                                                            else if (item.MENU_NAME == 'M-Passbook') {
                                                                                navigation.navigate(this, 'mpassBook', this.state.SelectedeAccountList)
                                                                            }
                                                                            else if (item.MENU_NAME == 'Open A/c') {
                                                                                navigation.navigate(this, 'newDepositAccountOpening')
                                                                            }
                                                                            else if (item.MENU_NAME == 'Within Bank Own A/c') {
                                                                                navigation.navigate(this, 'quickPayOwnAccTransfer', { from: 'dashboard', dashboardArray: this.DashboardAcc })
                                                                            }
                                                                            else if (item.MENU_NAME == 'Within Bank Other A/c') {
                                                                                navigation.navigate(this, 'sameBankOtherAcc', { from: 'dashboard', dashboardArray: this.DashboardAcc })
                                                                            }
                                                                            else if (item.MENU_NAME == 'IMPS Transfer') {
                                                                                navigation.navigate(this, 'IMPSTransferMenu', { from: 'dashboard', dashboardArray: this.DashboardAcc })
                                                                            }
                                                                            else if (item.MENU_NAME == 'Prepaid') {
                                                                                navigation.navigate(this, 'prepaid')
                                                                            }
                                                                            else if (item.MENU_NAME == 'Postpaid') {
                                                                                navigation.navigate(this, 'postpaidScreen')
                                                                            }
                                                                            else if (item.MENU_NAME == 'DTH') {
                                                                                navigation.navigate(this, 'DTHHomeScreen')
                                                                            }

                                                                            else if (item.MENU_NAME == 'Landline') {
                                                                                navigation.navigate(this, 'landlineBill')
                                                                            }
                                                                            else if (item.MENU_NAME == 'History') {
                                                                                navigation.navigate(this, 'billsPaymentHistory')
                                                                            }
                                                                            else if (item.MENU_NAME == 'Data Card') {
                                                                                navigation.navigate(this, 'dataCard')
                                                                            }
                                                                            else if (item.MENU_NAME == 'Electricity Bill') {
                                                                                navigation.navigate(this, 'electricityBillScreen')
                                                                            }
                                                                            else if (item.MENU_NAME == 'NEFT') {
                                                                                navigation.navigate(this, 'neftMenu', { from: 'dashboard', dashboardArray: this.DashboardAcc })
                                                                            }
                                                                            else if (item.MENU_NAME == 'IMPS TXT. Status') {
                                                                                navigation.navigate(this, 'ImpsTxtStatus', { from: 'dashboard', dashboardArray: this.DashboardAcc })
                                                                            }
                                                                            else if (item.MENU_NAME == 'Agent Complaint') {
                                                                                navigation.navigate(this, 'complaintsHomeScreen')
                                                                            }
                                                                            else if (item.MENU_NAME == 'Complaint History') {
                                                                                navigation.navigate(this, 'historyHomeScreen')
                                                                            }
                                                                            else if (item.MENU_NAME == 'Txn History') {
                                                                                navigation.navigate(this, 'transHistoryHomeScreen')
                                                                            }
                                                                            else if (item.MENU_NAME == 'Biller Complaints') {
                                                                                navigation.navigate(this, 'billersComplaintsHomeScreen')
                                                                            }
                                                                            else if (item.MENU_NAME == 'Renew') {
                                                                                navigation.navigate(this, 'renewAccHomeScreen')
                                                                            }
                                                                            else if (item.MENU_NAME == 'Prematured Enquiry') {
                                                                                navigation.navigate(this, 'prematuredEnquiryHomeScreen')
                                                                            }
                                                                            else if (item.MENU_NAME == 'Close A/c') {
                                                                                navigation.navigate(this, 'closeDepositHomeScreen')
                                                                            }
                                                                        }
                                                                        }
                                                                    >
                                                                        {console.log("item is==", item.MENU_IMAGE)}
                                                                        <View
                                                                            style={[
                                                                                styles.ItemBg,
                                                                                { backgroundColor: this.props.SecondaryColor + '1A' }
                                                                            ]}
                                                                        >
                                                                            <View style={[styles.ItemBg, { backgroundColor: this.props.SecondaryColor + '1A' }]}>
                                                                                {renderedComponent}

                                                                            </View>

                                                                        </View>
                                                                        <Text
                                                                            style={[
                                                                                styles.Itemtext,
                                                                                { color: this.props.PrimaryColor }
                                                                            ]}
                                                                        >
                                                                            {item.MENU_NAME}
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            }}
                                                        />
                                                    </CardView>
                                                    <Text style={{
                                                        fontSize: 12,
                                                        fontFamily: strings.fontMedium,
                                                        color: "#ff0000",
                                                        textAlign: "center",
                                                        marginTop: 10
                                                    }}>*Long Press on menu to remove menu from Favourite list</Text>
                                                </View>
                                            </View>
                                        )

                                    )
                                    }

                                </View>
                            ) : (null)}


                        </View>

                    </View >

                    <RenderLoader />
                </KeyboardAvoidingView>
            </View >




        );
    }
}


const styles =
{
    MainText:
    {
        fontSize: 20,
        color: 'black',
        fontFamily: strings.fontMedium,

    },
    ButtonStyle:
    {
        padding: 15,
        justifyContent: 'center',
        borderRadius: 12,
    },
    ButtonTextStyle:
    {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontMedium,
        fontSize: 15
    },
    placeholderStyle: {
        fontSize: 14,
        color: 'black',
    },
    selectedTextStyle: {
        fontSize: 16,
        backgroundColor: 'red',
    },

    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,

    },
    dropdown: {
        width: '75%',
        borderColor: 'gray',
        marginTop: -45,
        borderRadius: 5,
        borderWidth: 0.2,
        paddingHorizontal: 8,
        backgroundColor: 'white',
        height: 40,
        paddingLeft: 15,

    },
    gauge: {
        position: 'absolute',
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        // backgroundColor: 'red'
    },
    gaugeText: {
        backgroundColor: 'transparent',
        color: '#ffffff',
        fontSize: 18,
        fontFamily: strings.fontMedium,

    },
    CircleShape: {

        width: 20,
        height: 20,
        borderRadius: 150 / 2,
        // colors: '#FF5936'
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,

    },

    ShowAccountStyle:
    {
        height: 45,
        width: '75%',
        borderRadius: 8,
        marginTop: -25,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center'

    },

    TitleText:
    {
        flex: 1,
        fontFamily: strings.fontMedium,
        fontSize: 15,
        marginTop: 10,
        marginLeft: 16,
        textAlign: 'left',

    },

    FlatListTouchableStyle:
    {
        width: (width - 26) / 4,
        alignItems: 'center',
        marginVertical: 10,
        marginBottom: 15,

    },
    ItemBg:
    {
        height: 54,
        width: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5
    },
    Itemtext:
    {
        width: 68,
        fontSize: 10,
        textAlign: 'center',
        fontFamily: strings.fontMedium
    },

    UserInitialBg:
    {
        width: 50,
        height: 50,
        borderRadius: 150 / 2,
        alignItems: 'center',
        justifyContent: 'center',

    },
    simIcon: {
        width: 100,
        height: 100,
        borderRadius: 55,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 0.5,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },


}

export default connect(mapStateToProps, mapDispatchToProps)(MainLogin);