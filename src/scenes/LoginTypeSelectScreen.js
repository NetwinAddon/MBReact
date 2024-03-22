import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    ToastAndroid,
    PermissionsAndroid,
    BackHandler,
    Keyboard,
    StyleSheet,
    Linking,
    KeyboardAvoidingView,
    ScrollView,
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

import Footer from '../assets/icons/footer.svg';
import CardView from 'react-native-cardview'
import FixedHeader from '../components/FixedHeader';
import OtpInputs from 'react-native-otp-inputs';
import { TextInput, TouchableRipple } from 'react-native-paper';
import Fingerprint from '../assets/icons/Ico-fingerPrint.svg'
import FaceIdImg from '../assets/icons/ic_faceId.svg'
import Constants from '../common/Constants';
import APIUrlConstants from '../common/APIUrlConstants';
import Geolocation from '@react-native-community/geolocation';
import { _toEncrypt, decryptData, sendData } from '../common/util';
import EyeOpen from '../assets/icons/formIcons/ico-eye.svg';
import EyeSlash from '../assets/icons/formIcons/ico-eye-slash.svg';
import Snackbar from 'react-native-snackbar';

import ReloadIcon from '../assets/icons/ic_reload.svg'
import { RFValue } from "react-native-responsive-fontsize";
import NetInfo from '@react-native-community/netinfo';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'


class LoginTypeSelectScreen extends Component {
    constructor(props) {
        super(props);

        let Biomatric_Text;

        if (Platform.OS === 'ios') {
            Biomatric_Text = 'Face ID'
        }
        else {
            Biomatric_Text = 'Fingerprint'
        }

        this.state = {
            isMPINSelect: this.props.FingerPrint ? false : true,
            isUserId: false,
            isFingerPrint: this.props.FingerPrint ? true : false,
            UserName: this.props.NAME,
            MPin: '',
            UserId: '',
            Password: '',
            Latitude: '',
            Longitude: '',
            isloginVisible: true,
            submitText: this.props.FingerPrint ? Biomatric_Text : strings.submit,
            captchaText: '',
            captchaTotal: '',
            CaptchaEntered: '',
            firstTimeLogin: this.props.FirstTimeFingerPrint,
            isButtonDisabled: false,
            isButtonclick: true,
            Biomatric_Text: Biomatric_Text
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    }

    async componentDidMount() {
        this.GenerateRandomCaptcha();
        if (this.props.FingerPrint) {
            this.OpenFingerPrint();
        }
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {
            console.log("Connected to the internet");

        } else {
            Snackbar.show({ text: 'Check Internet Connection', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });

        }
        if (this.state.firstTimeLogin) {
            if (!this.props.FingerPrint) {
                const rnBiometrics = new ReactNativeBiometrics()
                rnBiometrics.simplePrompt({ promptMessage: 'Enable fingerprint' })
                    .then((resultObject) => {
                        const { success } = resultObject
                        if (success) {
                            if (Platform.OS === 'ios') {
                                Snackbar.show({
                                    text: 'Face ID Enabled Successfully..!',
                                    duration: Snackbar.LENGTH_SHORT,
                                    backgroundColor: 'green'
                                });
                            }
                            else {
                                Snackbar.show({
                                    text: 'Finger Print Enabled Successfully..!',
                                    duration: Snackbar.LENGTH_SHORT,
                                    backgroundColor: 'green'
                                });
                            }
                            this.props.setFingerPrint(true)
                            this.props.setFirstTimeFingerPrint(false)
                            this.setState({ firstTimeLogin: false })
                            this.setState({ isMPINSelect: false, isUserId: false, isFingerPrint: true, UserId: '', Password: '', MPin: '', submitText: Biomatric_Text })
                        } else {
                            console.log('user cancelled biometric prompt')
                        }
                    })
                    .catch((e) => {
                        console.log('biometrics failed' + e)
                    })
            }

            this.props.setFirstTimeFingerPrint(false)
        }
    }

    checkInternetConnection = async () => {
        try {
            const state = await NetInfo.fetch();
            const isConnected = state.isConnected;
            return isConnected;
        } catch (error) {
            console.error("Error checking internet connection:", error);
            return false;
        }
    };


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    onBackAction() {
        this.props.navigation.goBack(this)
    }

    setupFingurePrint() {
        navigation.navigate(this, 'loginWithFingurePrint')
    }

    requestLocationPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs location permission to provide accurate data.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    Geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;
                            this.state.Latitude = latitude;
                            this.state.Longitude = longitude;
                            this.props.setDeviceLatitude(latitude)
                            this.props.setDeviceLongitude(longitude)
                            console.log("Props are ==========", this.props)
                        },
                        (error) => {
                            console.log('Error obtaining location:', error);
                        },
                        { enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 }
                    );
                    this.props.setLocationPermission(true)
                } else {
                    console.log('Location permission denied');
                    Alert.alert(
                        'Location Permission Required',
                        'This app requires location permission to provide accurate data. Please grant the location permission in the app settings.',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    if (Platform.OS === 'android') {
                                        this.requestLocationPermission()

                                    } else if (Platform.OS === 'ios') {
                                        Linking.openSettings();
                                    }
                                },
                            },
                            {
                                text: 'Cancel',
                                style: 'cancel',
                                onPress: () => {
                                    Alert.alert('App Closure',
                                        'This app requires location permission to function properly. Please grant the permission or exit the app.',
                                        [{
                                            text: 'OK',
                                            onPress: () => {
                                                if (Platform.OS === 'android') {
                                                    this.requestLocationPermission()
                                                } else if (Platform.OS === 'ios') {
                                                    Linking.openSettings();
                                                }
                                            },
                                        },]
                                    );
                                }
                            },
                        ]
                    );
                }
            } else if (Platform.OS === 'ios') {
                const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
                if (status === RESULTS.GRANTED) {
                } else {
                    const requestStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
                    if (requestStatus === RESULTS.GRANTED) {
                    } else {
                        Alert.alert(
                            'Location Permission Required',
                            'This app requires location permission to provide accurate data. Please grant the location permission.',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        this.requestLocationPermission()
                                    },
                                },
                                {
                                    text: 'Cancel',
                                    style: 'cancel',
                                },
                            ]
                        );
                    }
                }
            }
        } catch (error) {
            console.log('Error requesting location permission:', error);
        }
    };

    OpenLink() {
        const url = 'https://www.google.com';
        Linking.openURL(url).catch((err) =>
            console.error('An error occurred', err));
    }

    LoginSubmit = async () => {
        if (this.state.isFingerPrint) {
            this.OpenFingerPrint();
        }
        else {

            if (this.state.CaptchaEntered === '' && Constants.AUTOMATION_MODE === 'N') {
                Snackbar.show({ text: 'Enter Captcha', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'orange' });
            }
            else if (this.state.CaptchaEntered != this.state.captchaTotal && Constants.AUTOMATION_MODE === 'N') {
                Snackbar.show({ text: 'Invalid Captcha !', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
            }
            else {
                if (this.state.isMPINSelect) {
                    this.LoginWith_Mpin();
                }
                else if (this.state.isUserId) {
                    this.LoginWith_IdPass();
                }
            }
        }
    }

    handleClick = () => {
        if (!this.state.isButtonDisabled) {
            this.setState({ isButtonDisabled: true });
            setTimeout(() => {
                this.setState({ isButtonDisabled: false });
            }, 1000);
        }
    };


    LoginWith_Mpin = async () => {
        this.setState({ isButtonclick: false })
        setTimeout(() => {
            this.setState({ isButtonclick: true })
        }, 1500);
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {


            if(this.props.userId === 'google' || this.props.userId === 'GOOGLE' || this.props.userId ==='Google')
            {
                Constants.BankCode = Constants.GoogleBankCode
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
            let Mpin = await _toEncrypt(jsonValue)
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
                        
            console.log("SubmitOtpApi URL:- " + APIUrlConstants.BASE_URL);
            console.log("");
            console.log("SubmitOtpApi:- " + JSON.stringify(Body));
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
                        if (ErrorMsg === 'USER IS BLOCKED...!!' || ErrorMsg === 'USER IS BLOCKED..!!') {
                            Snackbar.show({ text: 'USER IS BLOCKED. TRY AGAIN AFTER 2 MINUTES.', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                        }
                        else {
                            Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                        }
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
                        this.props.setGmstCode(finalRes.GMST_CODE)
                        this.props.setSecretKey(finalRes.SK)
                        this.props.setNAME(finalRes.NAME)
                        const MpinPresent = finalRes.MPIN_PRESENT
                        this.props.navigation.replace('bottomNavigator', { userData: finalRes })
                    }
                })
        } else {
            Snackbar.show({ text: 'Check Internet Connection', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
        }
    }

    LoginWith_IdPass = async () => {
        this.setState({ isButtonclick: false })
        setTimeout(() => {
            this.setState({ isButtonclick: true })
        }, 1500);
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {


            if(this.props.userId === 'google' || this.props.userId === 'GOOGLE' || this.props.userId ==='Google')
            {
                Constants.BankCode = Constants.GoogleBankCode
                APIUrlConstants.BASE_URL = APIUrlConstants.Google_Rest_Url
            }

            const simid = '00000000-05ec-ff6b-0000-00005659f38b';
            let userId = await _toEncrypt(this.props.userId)
            let Password = await _toEncrypt(this.state.Password)
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
            sendData(this,
                'post',
                APIUrlConstants.BASE_URL,
                Headers,
                JSON.stringify(Body),
                async (obj, response) => {
                    var responseData = await decryptData(response)
                    var newRes = responseData.slice(16)
                    var finalRes = JSON.parse(newRes)

                    console.log("Login---" + JSON.stringify(finalRes))

                    if (finalRes.SUCCESS === "FALSE") {
                        const ErrorMsg = finalRes.RESULT
                        if (ErrorMsg === 'USER IS BLOCKED...!!' || ErrorMsg === 'USER IS BLOCKED..!!') {
                            Snackbar.show({ text: 'USER IS BLOCKED. TRY AGAIN AFTER 2 MINUTES.', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });

                        }
                        else {
                            Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });

                        }

                    }
                    else {
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
                        this.props.setGmstCode(finalRes.GMST_CODE)
                        this.props.setSecretKey(finalRes.SK)
                        this.props.setNAME(finalRes.NAME)
                        this.props.setLoginPass(this.state.Password)
                        const MPIN_PRESENT = finalRes.MPIN_PRESENT
                        if (MPIN_PRESENT === 'Y') {
                            this.props.navigation.replace('bottomNavigator', { userData: finalRes })
                        }
                        else {
                            this.props.navigation.replace('createMpin', { CustomerId: finalRes.GMST_CODE, BRANCH_CODE: finalRes.BRANCH_CODE, SECRETKEY: finalRes.SK, userData: finalRes })
                        }
                    }
                })

        } else {
            Snackbar.show({ text: 'Check Internet Connection', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
        }
    }


    LoginWith_FingerPrint = async () => {
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {

            if(this.props.userId === 'google' || this.props.userId === 'GOOGLE' || this.props.userId ==='Google')
            {
                Constants.BankCode = Constants.GoogleBankCode
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
            sendData(this,
                'post',
                APIUrlConstants.BASE_URL,
                Headers,
                JSON.stringify(Body),
                async (obj, response) => {
                    var responseData = await decryptData(response)
                    var newRes = responseData.slice(16)
                    var finalRes = JSON.parse(newRes)
                    if (finalRes.SUCCESS === "FALSE") {
                        const ErrorMsg = finalRes.RESULT
                        if (ErrorMsg === 'USER IS BLOCKED...!!' || ErrorMsg === 'USER IS BLOCKED..!!') {
                            Snackbar.show({ text: 'USER IS BLOCKED. TRY AGAIN AFTER 2 MINUTES.', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                        }
                        else {
                            Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                        }
                    }
                    else {
                        Constants.Name = finalRes.NAME;
                        Constants.BRANCH_CODE = finalRes.BRANCH_CODE;
                        Constants.GMST_CODE = finalRes.GMST_CODE;
                        Constants.DEPOSIT_CBSVER = finalRes.DEPOSIT_CBSVER;
                        Constants.SecretKey = finalRes.SK;
                        Constants.MobileNumber = finalRes.TELE;
                        Constants.LAST_LOGIN = finalRes.LAST_LOGIN;
                        Constants.UserId = this.props.userId;
                        this.props.setGmstCode(finalRes.GMST_CODE)
                        this.props.setSecretKey(finalRes.SK)
                        this.props.setNAME(finalRes.NAME)
                        const MPIN_PRESENT = finalRes.MPIN_PRESENT
                        if (MPIN_PRESENT === 'Y') {
                            this.props.navigation.replace('bottomNavigator', { userData: finalRes })
                        }
                        else {
                            this.props.navigation.replace('createMpin', { CustomerId: finalRes.GMST_CODE, BRANCH_CODE: finalRes.BRANCH_CODE, SECRETKEY: finalRes.SK, userData: finalRes })
                        }
                    }
                })

        } else {
            Snackbar.show({ text: 'Check Internet Connection', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
        }
    }

    ForgetPassword() {
        if (this.state.isMPINSelect) {
            this.props.navigation.navigate('ForgetMpinOptionScreen')
        }
        else {
            navigation.navigate(this, 'ForgetPassword')
        }
    }


    OpenFingerPrint = async () => {
        console.log('biometrics click')
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


    GenerateRandomCaptcha() {
        let number1 = Math.floor(Math.random() * 20);
        let number2 = Math.floor(Math.random() * 20);
        const calculation = Math.floor(Math.random() * 3);
        if (calculation === 0) {
            const TotalAmt = parseFloat(number1) + parseFloat(number2);
            this.setState({ captchaText: number1 + " + " + number2 + " = ", captchaTotal: TotalAmt })
        }

        if (calculation === 1) {
            if (number2 > number1) {
                number2 = Math.floor(Math.random() * number1);
            }
            const TotalAmt = parseFloat(number1) - parseFloat(number2);
            this.setState({ captchaText: number1 + " - " + number2 + " = ", captchaTotal: TotalAmt })
        }

        if (calculation === 2) {
            const TotalAmt = parseFloat(number1) * parseFloat(number2);
            this.setState({ captchaText: number1 + " * " + number2 + " = ", captchaTotal: TotalAmt })
        }
    }

    render() {

        let BiomatricIcon;
        if (Platform.OS === 'ios') {
            BiomatricIcon = (<FaceIdImg color={this.props.SecondaryColor} height={22} width={22} />)

        }
        else {
            BiomatricIcon = (<Fingerprint color={this.props.SecondaryColor} height={22} width={22} />)
        }


        return (
            <View style={[styles.mainView, { backgroundColor: 'white' }]}>
                <KeyboardAvoidingView

                    style={[styles.mainView, { alignItems: 'center', justifyContent: 'center' }]}
                    behavior={Platform.OS === 'ios' ? 'padding' : ''}
                    enabled={true}>
                    <FixedHeader backAction={() => this.onBackAction()} color={this.props.PrimaryColor} />
                    <View style={[styles.mainView, { alignItems: 'center' }]}>

                        <ScrollView showsVerticalScrollIndicator={false}>

                            <View style={[styles.mainView, { alignItems: 'center', justifyContent: 'center' }]}>
                                <View style={styles.imgView}>
                                    <Image
                                        source={assets.companyImage}
                                        style={styles.imgStyle}
                                        resizeMode={'contain'}
                                    />
                                    <Text style={[styles.companyNameText, { color: this.props.PrimaryColor, }]}>
                                        {strings.companyName}</Text>
                                </View>

                                <View styles={styles.viewContainer}>
                                    <View style={styles.viewInnerConatiner}>
                                        <Text style={[styles.hiText, { color: this.props.PrimaryColor }]}>{strings.strHi}
                                        </Text>
                                        <Text style={[styles.userNameText, { color: this.props.PrimaryColor }]}
                                            numberOfLines={1}
                                        >{this.state.UserName}
                                        </Text>
                                    </View>


                                    <View style={styles.fingerPrinView}>
                                        {this.props.FingerPrint ?
                                            <TouchableOpacity style={[styles.fingerPrintTouchable, { backgroundColor: this.state.isFingerPrint == true ? colors.white : colors.cardView }]}
                                                onPress={() => {
                                                    this.setState({ isMPINSelect: false, isUserId: false, isFingerPrint: true, UserId: '', Password: '', MPin: '', submitText: this.state.Biomatric_Text })
                                                    this.OpenFingerPrint();
                                                }}>
                                                <Text style={[styles.fingerPrinText, { color: this.props.PrimaryColor, }]}>{this.state.Biomatric_Text}</Text>
                                            </TouchableOpacity>
                                            :
                                            <View />
                                        }
                                        <TouchableOpacity style={[styles.mPinTouchable, { backgroundColor: this.state.isMPINSelect == true ? colors.white : colors.cardView }]} onPress={() => this.setState({ isMPINSelect: true, isUserId: false, isFingerPrint: false, UserId: '', Password: '', MPin: '', submitText: strings.submit })}>
                                            <Text style={[styles.fingerPrinText, { color: this.props.PrimaryColor, }]}>{strings.strMPIN}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.userIdTouchable, { backgroundColor: this.state.isUserId == true ? colors.white : colors.cardView }]} onPress={() => this.setState({ isMPINSelect: false, isUserId: true, isFingerPrint: false, UserId: '', Password: '', MPin: '', submitText: strings.submit })}>
                                            <Text style={[styles.fingerPrinText, { color: this.props.PrimaryColor, }]}>{strings.strUserId}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {this.state.isMPINSelect ?
                                        <View style={styles.mPinView}>
                                            <OtpInputs
                                                style={styles.OtpInputsStyle}
                                                handleChange={(code) => {
                                                    this.setState({ MPin: code })
                                                }}
                                                numberOfInputs={4}
                                                keyboardType="numeric"
                                                secureTextEntry={true}
                                                inputContainerStyles={{
                                                    flex: 1,
                                                    marginHorizontal: 5,
                                                    height: 45,
                                                    width: 55,
                                                    borderWidth: 1,
                                                    justifyContent: 'center',
                                                    backgroundColor: colors.otpBackColor,
                                                    borderColor: colors.otpBorderColor,
                                                    borderRadius: 8,
                                                }}
                                                focusStyles={{ borderColor: this.props.SecondaryColor, }}
                                                inputStyles={{
                                                    fontSize: RFValue(15),
                                                    color: this.props.textColor,
                                                    fontFamily: strings.fontMedium,
                                                    textAlign: 'center',
                                                }}
                                                selectionColor={this.props.SecondaryColor}
                                                autofillFromClipboard={false}
                                                
                                            />
                                        </View>
                                        :
                                        this.state.isUserId ?
                                            <View style={styles.userIdView}>
                                                <TextInput
                                                    style={styles.userIdTextInput}
                                                    theme={{
                                                        colors: {
                                                            placeholder: '#99686868',
                                                            text: this.props.textColor,
                                                            primary: this.props.SecondaryColor,
                                                            underlineColor: 'transparent',
                                                            background: 'white',

                                                        },
                                                        fonts: {
                                                            regular: {
                                                                fontFamily: strings.fontRegular
                                                            }
                                                        },
                                                        roundness: 8,
                                                    }}
                                                    label="Password"
                                                    value={this.password}
                                                    onChangeText={password => {
                                                        this.setState({ Password: password });
                                                        console.log('Password ' + this.state.Password);
                                                    }}
                                                    mode='outlined'
                                                    secureTextEntry={this.state.isloginVisible}
                                                    right={
                                                        <TextInput.Icon
                                                            forceTextInputFocus={false}
                                                            onPress={() => {
                                                                this.setState({ isloginVisible: !this.state.isloginVisible })
                                                                Keyboard.dismiss();
                                                            }}
                                                            icon={() =>
                                                                <TouchableRipple
                                                                    disabled={true}
                                                                    rippleColor={'gray'}
                                                                    style={styles.eyeTouchable}>
                                                                    {this.state.isloginVisible ?
                                                                        <EyeSlash height={20} width={20} color={'#000000'} />
                                                                        : <EyeOpen height={20} width={20} color={'#000000'} />}
                                                                </TouchableRipple>}
                                                        />
                                                    }
                                                />
                                            </View>
                                            :
                                            this.state.isFingerPrint ?
                                                <View style={styles.eyeDownView}>
                                                </View>
                                                :
                                                <View />
                                    }
                                    {this.state.isFingerPrint ?
                                        <View />
                                        :
                                        <Text style={[styles.TextStyle, { color: this.props.PrimaryColor, marginTop: 9 }]}>
                                            Captcha
                                        </Text>
                                    }
                                    {this.state.isFingerPrint ?
                                        <View />
                                        :
                                        <View style={styles.capchaView}>
                                            <View style={styles.capchaInnerView}>
                                                <View style={styles.mainView}>
                                                    <Text style={styles.capchaTextValue}> {this.state.captchaText}</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => this.GenerateRandomCaptcha()}>
                                                    <ReloadIcon height={30} width={30} />
                                                </TouchableOpacity>
                                            </View>
                                            <TextInput style={styles.capchaTextInput}
                                                theme={{
                                                    colors: {
                                                        placeholder: '#99686868',
                                                        text: this.props.textColor,
                                                        primary: this.props.SecondaryColor,
                                                        underlineColor: 'transparent',
                                                        background: 'white',
                                                    },
                                                    fonts: {
                                                        regular: {
                                                            fontFamily: strings.fontRegular
                                                        }
                                                    },
                                                    roundness: 8,
                                                }}
                                                label="Enter Answer"
                                                keyboardType='numeric'
                                                value={this.CaptchaEntered}
                                                onChangeText={CaptchaEntered => {
                                                    this.setState({ CaptchaEntered: CaptchaEntered });
                                                }}
                                                mode='outlined'
                                                returnKeyType='done'
                                            />
                                        </View>
                                    }
                                    <CardView
                                        cardElevation={this.state.isFingerPrint || this.state.MPin.length == 4 && this.state.isMPINSelect && this.state.isButtonclick || this.state.Password.length > 0 && this.state.isButtonclick ? 3 : 0}
                                        cardMaxElevation={3}
                                        cornerRadius={12}
                                        style={styles.submitButtonCard}>
                                        <TouchableOpacity
                                            style={[styles.submitButtonTouchable, { backgroundColor: this.state.isFingerPrint || this.state.MPin.length == 4 && this.state.isMPINSelect && this.state.isButtonclick || this.state.Password.length > 0 && this.state.isButtonclick ? this.props.PrimaryColor : colors.btnDisable, }]}
                                            disabled={this.state.isFingerPrint || this.state.MPin.length == 4 && this.state.isMPINSelect && this.state.isButtonclick || this.state.Password.length > 0 && this.state.isButtonclick ? false : this.state.isButtonDisabled ? true : true}
                                            onPress={() => {
                                                this.handleClick()
                                                this.LoginSubmit()
                                            }}>
                                            <Text style={[styles.submitButtonText, { color: this.state.isFingerPrint || this.state.MPin.length == 4 && this.state.isMPINSelect && this.state.isButtonclick || this.state.Password.length > 0 && this.state.isButtonclick ? colors.white : colors.btnDisableTextColor, }]}>
                                                {this.state.submitText}
                                            </Text>
                                        </TouchableOpacity>
                                    </CardView>
                                    <View style={styles.forgetMpin}>
                                        <TouchableOpacity style={styles.forgetMpinTouchable}>
                                            <Text style={[styles.TextStyle, { color: this.props.SecondaryColor }]}
                                                onPress={() => this.ForgetPassword()} >
                                                {this.state.isMPINSelect == true ? strings.strForgetMPIN : strings.strForgetPassword}
                                            </Text>
                                        </TouchableOpacity>
                                        {this.state.isFingerPrint ?
                                            <View /> :
                                            <TouchableOpacity
                                                style={styles.fingerPrintTouchableTwo}
                                                onPress={() => this.setupFingurePrint()}>

                                                <Text style={[styles.TextStyle, { color: this.props.SecondaryColor, marginRight: 10 }]}

                                                >{this.state.Biomatric_Text}
                                                </Text>
                                                <View>
                                                    {BiomatricIcon}
                                                </View>
                                            </TouchableOpacity>}
                                    </View>
                                    <TouchableOpacity
                                        style={styles.openNewAcTouchable}>
                                        <Text style={[styles.TextStyle, { color: this.props.SecondaryColor, fontWeight: '700', fontSize: RFValue(14), marginTop: 10, }]}
                                            onPress={() => this.OpenLink()} >
                                            Open New Account
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>


                    </View >
                    <RenderLoader />
                </KeyboardAvoidingView>

                <Footer height={70} width={300} alignSelf={'center'} />
            </View >
        );
    }
}

const styles = {
    mainView:
    {
        flex: 1
    },
    imgView:
    {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    imgStyle:
    {
        height: 42 * width / 196,
        width: width - 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    companyNameText:
    {
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 21
    },
    viewContainer:
    {
        flex: 0.5,
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 10,
    },
    viewInnerConatiner:
    {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    hiText:
    {
        fontSize: RFValue(18),
        textAlign: 'left',
        fontFamily: strings.fontMedium,
    },
    userNameText:
    {
        fontSize: RFValue(18),
        color: 'black',
        textAlign: 'left',
        paddingLeft: 2,
        fontFamily: strings.fontBold,
    },
    fingerPrinView:
    {
        marginTop: 20,
        paddingVertical: 8,
        backgroundColor: colors.cardView,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    fingerPrintTouchable:
    {
        flex: 1,
        marginLeft: 8,
        backgroundColor: colors.cardView,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    fingerPrinText:
    {
        fontSize: RFValue(15),
        textAlign: 'center',
        fontFamily: strings.fontRegular,
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    mPinTouchable:
    {
        flex: 1,
        marginLeft: 8,
        backgroundColor: colors.lightWhite,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userIdTouchable:
    {
        flex: 1,
        marginLeft: 8,
        backgroundColor: colors.cardView,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    mPinView:
    {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
    },
    OtpInputsStyle:
    {
        flexDirection: 'row',
    },
    userIdView:
    {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
    },
    userIdTextInput:
    {
        lineHeight: 45,
        height: 50,
        width: width - 40,
        fontFamily: strings.fontRegular
    },
    eyeTouchable:
    {
        height: 30,
        width: 30,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eyeDownView:
    {
        marginTop: 18
    },
    Title:
    {
        fontSize: 20,
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: colors.white,
    },
    capchaView:
    {
        flexDirection: 'row',
        marginTop: 9
    },
    capchaInnerView:
    {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.otpBorderColor,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginRight: 15,
    },
    capchaTextValue:
    {
        fontWeight: '500',
        fontSize: RFValue(15),
        alignSelf: 'center',
        color: "#686868",
    },
    capchaTextInput:
    {
        lineHeight: 45,
        height: 40,
        width: width - 40,
        fontFamily: strings.fontRegular,
        flex: 1.2,
        marginLeft: 5,
    },
    submitButtonCard:
    {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    submitButtonTouchable:
    {
        paddingTop: 15,
        paddingBottom: 15,
        width: width - 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    submitButtonText:
    {
        alignSelf: 'center',
        fontFamily: strings.fontRegular,
        fontSize: RFValue(15)
    },
    forgetMpin:
    {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6
    },
    forgetMpinTouchable:
    {
        arginVertical: 10,
    },
    fingerPrintTouchableTwo:
    {
        flexDirection: 'row',
        alignItems: 'center',
    },
    openNewAcTouchable:
    {
        alignItems: 'center',
    },

};
export default connect(mapStateToProps, mapDispatchToProps)(LoginTypeSelectScreen);
