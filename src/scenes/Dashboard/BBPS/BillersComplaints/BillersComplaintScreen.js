
//  RGP

import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    FlatList,
    StyleSheet,
    PermissionsAndroid,
    Alert,
    BackHandler,
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
    appThemeConfiguration,
    config,
    RenderOkDialog,
    sendData,
} from '../../../../App';

import Arrowdown from '../../../../assets/icons/dashboardIcons/arrow_down.svg';



import Smsicon from '../../../../assets/icons/smsicon.svg'


//import { TouchableOpacity } from 'react-native-gesture-handler';
import TrasnsperantFixedHeader from '../../../../components/TrasnperantFixedHeader.js';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';

import Arrow from '../../../../assets/icons/Vectorarrow.svg';


import { ConfirmAmountPopup } from '../../../../components/ConfirmAmountPopup.js';
import { CustomPopupsRecharge } from '../../../../components/CustomPopupsRecharge.js';
import BBPS from '../../../../assets/icons/BBPS_Logo.svg'
import { TextInput } from 'react-native-paper';
import OtpInputs from 'react-native-otp-inputs';

import Constants from '../../../../common/Constants.js';
import MyValidator from '../../../../common/MyValidator.js';
import APIUrlConstants from '../../../../common/APIUrlConstants.js';
import { _toEncrypt, decryptData } from '../../../../common/util.js';
import { ServiceReasonPopup } from '../../../../components/ServiceReasonPopup.js';

class BillersComplaintScreen extends Component {

    constructor(props) {
        super(props);


        this.accData = [
            { label: 'Biller available. unable to transact', value: '1' },
            { label: 'Multiple failure for same biller', value: '2' },
            { label: 'Denomination not availbale ', value: '3' },
            { label: 'incorrect bill details displayed ', value: '4' },
            { label: 'incomplete / no details reflecting ', value: '5' },

        ];

        this.PaymentsStatus = {
            PaymentMode: "Agent",
            TransactionId: this.props.route.params.BillerName,
            BBPS_AGID: Constants.BBPS_AGID,


        }


        this.state = {
            REQ_TYPE: 'COMPREG',
            Description: '',
            MobNum: Constants.MobileNumber,
            MobNumError: '',
            DescriptionError: '',
            ServReasonError: '',
            isModalVisible: false,
            isModalVisible1: false,
            isStateModalVisible: false,
            selectedValue: 'option1',

            labelText: '',
            amount: '',
            accType: this.accData.length > 0 ? this.accData[0].label : '',
            remark: '',
            searchTerm: '',
            searchTermAct: 0,
            searchPerformed: false,
            constactsNumbers: [],
            confirmDialog: false,
            otp_length: '',
            otp: '',
            timer: 45,
            // OTPcount: 0
        };

    }



    componentDidMount() {

        //this.getBillerName()
    }

    getBillerName = async () => {

        const Headers = APIUrlConstants.Headers("GETBILLLIST");

        const jsonReq = {

            CUSTOMER_ID: Constants.GMST_CODE,
            BILLERCATEGORY: 'ALL',
            CORP_ID: Constants.BankCode,
            SEC_KEY: Constants.SecretKey,
            divId: this.props.DeviceId,
            secKey: Constants.SecretKey
        }
        console.log("APIUrlConstants.BASE_URL:- " + APIUrlConstants.BASE_URL);
        console.log("jsonReq:- " + JSON.stringify(jsonReq));
        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));
        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: JSON.stringify(jsonValue)
        }

        console.log("ForgetMpin OTPcall URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("ForgetMpin OTPcall:- " + JSON.stringify(Body));
        console.log("");

        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {

                var responseData = await decryptData(response)
                //  console.log("GetDataCardRechargeApi Json:- " + JSON.stringify(finalRes));
                console.log("response Json:- " + responseData);
                // console.log("ForgetMpin OTPcall Response:- " + JSON.stringify(response));

                // let res = response.SUCCESS

                // if (res === "FALSE") {

                //     const ErrorMsg = response.RESULT
                //     // ToastAndroid.show(ErrorMsg, ToastAndroid.SHORT)
                //     Snackbar.show({
                //         text: ErrorMsg,
                //         duration: Snackbar.LENGTH_SHORT,
                //         backgroundColor: 'red'
                //     });

                // }
                // else if (res === "TRUE") {}
            })
    }

    bgImage = appThemeConfiguration(config.themeColor).bgImg


    hideDialog = () => {
        this.setState({ confirmDialog: false })
    }


    onBackAction() {
        navigation.goBack(this)
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


    toOwnAccTransfer() {
        navigation.navigate(this, 'ownAccTransferScreen')
        console.log('hellooooo')
    }

    toReview() {
        navigation.navigate(this, 'quickPayWithinBankOtherAccount')
    }


    onSelectOperator = (value) => {
        console.log('valueeeeeeeeee' + value)
        { value !== '' || value !== 'undefined' ? console.log('true') : console.log('false') }
        this.setState({ isModalVisible: false, operaterName: value })
        console.log("state.isModalVisible", this.state.isModalVisible, value);
        // renderWelcomeMsg()


    }

    SendOTPAPI = async () => {

        // navigation.replace(this, 'ForgetChangeMpin', { SecretKey: "8676"})

        const Headers = APIUrlConstants.Headers("GETBBPSOTP");

        const jsonReq = {
            REQ_TYPE: this.state.REQ_TYPE,
            CUSTOMER_ID: Constants.GMST_CODE,
            MOBILENO: this.state.MobNum,
            CORP_ID: Constants.BankCode,
            SEC_KEY: Constants.SecretKey,
            divId: this.props.DeviceId,
            secKey: Constants.SecretKey
        }
        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));
        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: JSON.stringify(jsonValue)
        }

        console.log("ForgetMpin OTPcall URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("ForgetMpin OTPcall:- " + JSON.stringify(Body));
        console.log("");

        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {

                var responseData = await decryptData(response)
                //  console.log("GetDataCardRechargeApi Json:- " + JSON.stringify(finalRes));
                console.log("response Json:- " + responseData);
                // console.log("ForgetMpin OTPcall Response:- " + JSON.stringify(response));

                // let res = response.SUCCESS

                // if (res === "FALSE") {

                //     const ErrorMsg = response.RESULT
                //     // ToastAndroid.show(ErrorMsg, ToastAndroid.SHORT)
                //     Snackbar.show({
                //         text: ErrorMsg,
                //         duration: Snackbar.LENGTH_SHORT,
                //         backgroundColor: 'red'
                //     });

                // }
                // else if (res === "TRUE") {

                //     this.setState((prevState) => ({ OTPcount: prevState.OTPcount + 1 }))

                //     this.setState({ isOTPPage: false, Title: 'Enter OTP' })
                //     const USERID = response.USERID


                //     if (this.state.OTPcount > 1) {

                //         Snackbar.show({ text: 'OTP Resend Successfully..!', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green' });
                //         clearInterval(this.timerInterval);
                //         this.setState({ timer: 45 }, this.startTimer);
                //     }
                //     else {

                //         Snackbar.show({ text: 'OTP Send Successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green' });
                //         this.startTimer();
                //     }
                // }

            })
    }


    onGetOTPClick = () => {
        var result = this.isValidate();

        if (result) {
            this.SendOTPAPI(); // Uncomment this line if you want to call the getOTPAPI function on successful validation
        }
    }
    onSubmitClick = () => {
        this.props.navigation.navigate('billerComplaintsSuccess', { SecretKey: "8676"})
        // var result = this.isValidate();

        // if (result) {
        //     this.onSubmitComp(); // Uncomment this line if you want to call the getOTPAPI function on successful validation
        // }
    }


    onSubmitComp = async () => {

        // navigation.replace(this, 'ForgetChangeMpin', { SecretKey: "8676"})

        const Headers = APIUrlConstants.Headers("GETBBPSTRANSTS");

        const jsonReq = {
            REQ_TYPE: this.state.REQ_TYPE,
            GMST_CODE: Constants.GMST_CODE,
            MOBILENO: this.state.MobNum,
            CORP_ID: Constants.BankCode,
            SEC_KEY: Constants.SecretKey,
            BBPSREQSRNO: '0',
            BBPS_REQ_NO: '0',
            BILLERID: '0',
            AMOUNT: '0',
            COMPLAINTTYPE: 'Service',
            PARTICIPATIONTYPE: 'AGENT',
            AGENTID: '',
            TXNREFID: '',
            COMPLAINTDESC: this.state.Description,
            SERVREASON: '',
            COMPLAINTDEPOSITION: '',
            CUSTOMERNAME: '',
            OTP: '',
            BRANCECODE: Constants.BRANCH_CODE,
            divId: this.props.DeviceId,
            secKey: Constants.SecretKey
        }
        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq), Constants.DeviceId, '#', Constants.SecretKey);
        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: JSON.stringify(jsonValue)
        }

        console.log("ForgetMpin OTPcall URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("ForgetMpin OTPcall:- " + JSON.stringify(Body));
        console.log("");

        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {

                var responseData = await decryptData(response)
                //  console.log("GetDataCardRechargeApi Json:- " + JSON.stringify(finalRes));
                console.log("response Json:- " + responseData);
                // console.log("ForgetMpin OTPcall Response:- " + JSON.stringify(response));

                // let res = response.SUCCESS

                // if (res === "FALSE") {

                //     const ErrorMsg = response.RESULT
                //     // ToastAndroid.show(ErrorMsg, ToastAndroid.SHORT)
                //     Snackbar.show({
                //         text: ErrorMsg,
                //         duration: Snackbar.LENGTH_SHORT,
                //         backgroundColor: 'red'
                //     });

                // }
                // else if (res === "TRUE") {

                //     this.setState((prevState) => ({ OTPcount: prevState.OTPcount + 1 }))

                //     this.setState({ isOTPPage: false, Title: 'Enter OTP' })
                //     const USERID = response.USERID


                //     if (this.state.OTPcount > 1) {

                //         Snackbar.show({ text: 'OTP Resend Successfully..!', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green' });
                //         clearInterval(this.timerInterval);
                //         this.setState({ timer: 45 }, this.startTimer);
                //     }
                //     else {

                //         Snackbar.show({ text: 'OTP Send Successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green' });
                //         this.startTimer();
                //     }
                // }

            })
    }



    onSelectState = (value) => {
        console.log('valueeeeeeeeee' + value)
        { value !== '' || value !== 'undefined' ? console.log('true') : console.log('false') }
        this.setState({ isModalVisible: false, operaterName: value })
        console.log("state.isModalVisible", this.state.isModalVisible, value);
        // renderWelcomeMsg()


    }
    isValidate() {
        var result = true;

        this.setState({ MobNumError: '', DescriptionError: '', ServReasonError: '' });

        if (!MyValidator.isEmptyField(this.state.MobNum).isValid) {
            this.setState({ MobNumError: "Please Enter correct mobile number!" });
            result = false;
        }
        if (!MyValidator.isEmptyField(this.state.accType).isValid) {
            this.setState({ ServReasonError: "Please Select correct service reason!" });
            result = false;
        }

        if (!MyValidator.isEmptyField(this.state.Description).isValid) {
            this.setState({ DescriptionError: "Please Enter correct Description!" });
            result = false;
        }

        return result;
    }


    onSelectAccount = (value) => {

        this.setState({ isModalVisible1: false, accType: value })

        console.log("state.isModalVisible1", this.state.isModalVisible1, value);
        // renderWelcomeMsg()

    }



    render() {

        return (
            <View style={styles.mainConatainer}>
                <ImageBackground style={styles.mainConatainer}
                    source={this.bgImage}
                    resizeMode='cover'
                >
                    <TrasnsperantFixedHeader
                        backAction={() => this.onBackAction()}
                    />

                    <View style={styles.headingContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.title}>Biller Complaints
                            </Text>
                            <Text style={styles.subtitle}>Register your complaints against the biller.
                            </Text>

                        </View>
                    </View>


                    <View style={styles.mainView}>
                        <View style={styles.iconView}>
                            <View style={styles.textContainer}>
                                <Text style={styles.username}>{""}</Text>
                            </View>

                            <View>
                                <BBPS />
                            </View>
                        </View>
                        {this.state.confirmDialog === true ?
                            <ConfirmAmountPopup isVisible={this.state.confirmDialog} isDisabled={this.hideDialog} MobileNumber={this.props.route.params.mobno} BillAmt={parseFloat(this.state.confirmDepositAmount)} charges={1.5} from={'DTH'} />
                            : null}
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                        >


                            <View style={styles.scrollContainer}>





                                <View style={styles.paymentContainer}>
                                    <View style={styles.paymentTextContainer}>
                                        <Text style={styles.paymentText}>Participation Type :</Text>
                                        <Text style={styles.paymentText}>
                                            {"Biller Name :\n"}
                                        </Text>

                                        <Text style={styles.paymentText}>Agent ID :</Text>
                                    </View>

                                    <View style={{ flex: 2 }}>
                                        <Text style={styles.paymentText}>
                                            {this.PaymentsStatus.PaymentMode}
                                        </Text>
                                        <Text style={styles.paymentText}>
                                            {this.PaymentsStatus.TransactionId}
                                        </Text>

                                        <Text style={styles.paymentText}>
                                            {this.PaymentsStatus.BBPS_AGID}
                                        </Text>
                                    </View>
                                </View>


                                <View style={styles.textInputContainer}>
                                    <TextInput
                                        style={styles.textInput}
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
                                        label="Mobile Number"
                                        keyboardType='numeric'
                                        maxLength={10}
                                        value={this.state.MobNum}
                                        onChangeText={MobNum => {
                                            this.setState({ MobNum });
                                        }}

                                        mode='outlined'
                                    />
                                    {this.state.MobNumError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.MobNumError}</Text>)}
                                </View>



                                <View style={styles.InputBoxDesign}>
                                    <TouchableOpacity
                                        style={styles.inputBox}
                                        onPress={() => this.setState({ isModalVisible1: true, labelText: 'Select Reason' })}
                                    >

                                        <View style={styles.mainConatainer}>
                                            <Text style={styles.labelText}>Select Reason</Text>
                                            <Text style={styles.inputValue}>
                                                {this.state.accType}
                                            </Text>
                                        </View>

                                        <View style={styles.arrowContainer}>
                                            <Arrowdown height={15} width={15} />
                                        </View>

                                    </TouchableOpacity>
                                    {ServiceReasonPopup(
                                        this.state.isModalVisible1,
                                        this.accData,
                                        this.onSelectAccount,
                                        this.state.labelText,
                                        this.state.accType
                                    )}
                                    {this.state.ServReasonError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.ServReasonError}</Text>)}

                                </View>
                                <View style={styles.textInputContainer}>
                                    <TextInput
                                        style={styles.textInput}
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
                                        label="Description"
                                        // keyboardType='numeric'
                                        value={this.state.Description}
                                        onChangeText={Description => {
                                            this.setState({ Description });
                                        }}

                                        mode='outlined'
                                    />
                                    {this.state.DescriptionError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.DescriptionError}</Text>)}
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.button}
                                        onPress={this.onGetOTPClick}
                                    >
                                        <Smsicon height={17} width={17} />
                                        <Text style={styles.buttonText}>Get OTP</Text>
                                    </TouchableOpacity>

                                </View>
                                <View style={styles.otpContainer}>
                                    <Text
                                        style={[styles.otpText, { color: this.props.textColor }]}
                                    >
                                        {strings.enterOTP}
                                    </Text>

                                    <View style={styles.otpInputsContainer}>

                                        <OtpInputs
                                            caretHidden={false}  // cusrsor
                                            handleChange={(code) => {
                                                this.setState({ otp: { code: code.replace(/[^0-9]/g, '') } })
                                                this.setState({ otp_length: code })
                                                console.log("Otp: ", code)
                                                console.log("otp_length: ", this.state.otp_length.length)

                                            }}
                                            numberOfInputs={6}
                                            //  keyboardType="numeric" 

                                            inputContainerStyles={{
                                                height: 45,
                                                width: 45,
                                                margin: 5,
                                                borderWidth: 1,
                                                justifyContent: 'center',
                                                // alignItems : 'center',
                                                backgroundColor: colors.otpBackColor,
                                                // backgroundColor : 'red',
                                                borderColor: colors.otpBorderColor,
                                                borderRadius: 8,
                                            }}
                                            focusStyles={{
                                                borderColor: this.props.themeColor,
                                            }}
                                            inputStyles={{
                                                fontSize: 15,
                                                textAlign: 'center',

                                                color: this.props.textColor,
                                            }}
                                            selectionColor={this.props.themeColor}
                                            autofillFromClipboard={false}
                                        />
                                    </View>

                                    <CardView
                                        cardElevation={this.state.otp.length >= 3 ? 3 : 0}
                                        cardMaxElevation={3}
                                        cornerRadius={12}
                                        style={styles.cardView}
                                    >


                                        <View style={styles.resendOtpContainer}>
                                            <Text style={styles.resendOtpText}>Resend OTP in</Text>
                                            <Text style={styles.resendOtpTimer}>
                                                {"00." + this.state.timer}
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            style={[
                                                styles.submitButton,
                                                {
                                                    backgroundColor:
                                                        this.state.otp_length.length >= 3
                                                            ? colors.btnColor
                                                            : colors.btnDisable,
                                                },
                                            ]}


                                            disabled={this.state.otp_length.length >= 3 ? false : true}
                                            onPress={() => this.onSubmitClick()}
                                        >
                                            <Text
                                                style={[
                                                    styles.submitButtonText,
                                                    {
                                                        color:
                                                            this.state.otp_length.length >= 3
                                                                ? colors.white
                                                                : colors.btnDisableTextColor,
                                                    },
                                                ]}
                                            >
                                                {strings.submit}
                                            </Text>
                                        </TouchableOpacity>
                                    </CardView>


                                </View>

                            </View>

                        </ScrollView>

                    </View>

                </ImageBackground>

            </View>


        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BillersComplaintScreen);


const styles = StyleSheet.create({
    ErrorDisplay: {
        color: "#FF0000",
        marginLeft: 5,
        fontSize: 12,
        marginTop: 3,
    },
    mainConatainer: { flex: 1 },
    InputBoxDesign: {
        padding: 5,
        width: width - 50,
        backgroundColor: colors.white,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#DFE1E8",
        marginTop: 15,
    },
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
    },
    labelText: {
        color: colors.accTextColor + "80",
        marginLeft: 5,
        fontSize: 10,
        fontFamily: strings.fontMedium,
    },
    inputValue: {
        color: colors.accTextColor,
        marginLeft: 5,
        fontSize: 15,
        fontFamily: strings.fontMedium,
    },
    arrowContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
    },
    textInputContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    textInput: {
        lineHeight: 40,
        height: 48,
        width: width - 50,
        marginTop: 10,
    },

    buttonContainer: {
        width: width - 50,
        marginTop: 15,
    },
    button: {
        borderRadius: 10,
        borderStyle: "solid",
        borderColor: "#1873B9",
        borderWidth: 2,
        flex: 1,
        width: 110,
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "700",
        fontFamily: "SF UI Display",
        color: "#1f3c66",
        marginLeft: 5,
    },
    otpContainer: {
        alignItems: "center",
        backgroundColor: "white",
        flexDirection: "column",
        paddingBottom: 20,
    },
    otpText: {
        width: width - 50,
        marginTop: 30,
        fontSize: 25,
        textAlign: "center",
        fontFamily: strings.fontBold,
    },
    otpInputsContainer: {
        height: 60,
        width: width - 40,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },
    resendOtpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 10,
    },
    cardView: {
        backgroundColor: "white",
        justifyContent: "center",
    },
    resendOtpText: {
        fontSize: 14,
        textAlign: "center",
        fontFamily: strings.fontMedium,
        color: "#1F3C66",
    },
    resendOtpTimer: {
        fontSize: 14,
        textAlign: "center",
        fontFamily: strings.fontMedium,
        color: "#FF5936",
        marginLeft: 3,
    },
    submitButton: {
        padding: 15,
        width: width - 40,
        justifyContent: "center",
        borderRadius: 12,
    },
    submitButtonText: {
        alignSelf: "center",
        fontFamily: strings.fontRegular,
        fontSize: 15,
    },
    container: {
        flexDirection: "row",
        padding: 10,

        alignItems: "center",
        width: width - 50,
    },

    textContainer: {
        flex: 3.5,
    },
    username: {
        fontSize: 18,
        fontWeight: "500",
        color: "#000",
    },
    scrollView: {
        width: "100%",
        flex: 1,
    },
    scrollContainer: {
        width: width - 50,
        alignItems: "center",
    },
    paymentContainer: {
        borderRadius: 8,
        backgroundColor: "#f3f8ff",
        borderStyle: "dashed",
        borderColor: "#93b1c8",
        borderWidth: 1,
        width: "100%",
        height: 100,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        padding: 10,
    },
    paymentTextContainer: {
        flex: 1.8,
    },
    paymentText: {
        style: {
            fontSize: 15,
            fontFamily: strings.fontMedium,
        },
    },


    paymentMode: {
        fontSize: 12.6,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
        lineHeight: 18,
    },
    headingContainer: {
        flex: 0.15,
    },
    innerContainer: {
        marginLeft: 25,
        marginTop: 15,
    },
    title: {
        fontSize: 22,
        color: "white",
        textAlign: "left",
        fontFamily: strings.fontBold,
    },
    subtitle: {
        fontSize: 15,
        color: "white",
        textAlign: "left",
        fontFamily: strings.fontMedium,
    },
    mainView: {
        flex: 0.85,
        alignItems: "center",
        backgroundColor: "white",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    iconView: {
        flexDirection: "row",
        padding: 5,
        alignItems: "center",
        marginBottom: 10,
        width: width - 50,
        marginTop: 10,
    },
});
