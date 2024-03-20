import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,

} from 'react-native';



import {
    colors,
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    RenderOkDialog,
    width,
    sendData,
    navigation,
} from '../../../App';

import OtpInputs from 'react-native-otp-inputs';
import CardView from 'react-native-cardview';
import Constants from '../../../common/Constants';
import APIUrlConstants from '../../../common/APIUrlConstants';
import Snackbar from 'react-native-snackbar';




class OfflineOtpScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {

            otpInput: '',
            RefId: this.props.RefId,
            UserId: this.props.UserId,
            MobNo: this.props.MobNo,
            Loginpin: this.props.Loginpin,
            TranPin: this.props.TranPin,
            OTPcount : 0,
        };

    }

    componentDidMount() {

    }

    OtpSubmit() {

        // this.props.onSubmit(this.state.otpInput)

        const simid = '00000000-05ec-ff6b-0000-00005659f38b';

        const Headers = APIUrlConstants.Headers("VERIOTP");

        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: "{\"BNK_CODE\":\"" + Constants.BankCode + "\",\"REF_ID\":\"" + this.state.RefId + "\",\"USR_ID\":\"" + this.state.UserId + "\",\"LPIN\":\"" + this.state.Loginpin + "\",\"TPIN\":\"" + this.state.TranPin + "\",\"OTP\":\"" + this.state.otpInput + "\",\"DEVICE_ID\":\"" + this.props.DeviceId + "\",\"SIMNO\":\"" + simid + "\",\"REG_MODE\":\"" + "OFFLINE" + "\",\"MOB\":\"" + this.state.MobNo + "\",\"AC_TYPE\":\"" + "" + "\"}"
        }

        console.log("OfflineRegistration_OTPVerify URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("OfflineRegistration_OTPVerify Json:- " + JSON.stringify(Body));
        console.log("");

        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                var responseData = response

                console.log("OfflineRegistration_OTPVerify Response:- " + JSON.stringify(responseData));
                let res = response.SUCCESS
                if (res === "FALSE") 
                {

                    const ErrorMsg = response.RESULT
                    Snackbar.show({
                        text: ErrorMsg,
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'red'
                    });

                    this.setState((prevState) => ({ OTPcount: prevState.OTPcount + 1 }))

                    if(this.state.OTPcount > 2)
                    {
                        this.props.onSubmit("FAILED")
                    }

                }
                else {

                    this.props.onSubmit(this.state.otpInput)
                }

            })

    }

    OTPReSend = () => {

        this.OTPResendApi()

    }

    OTPResendApi() {
        // const Headers =
        // {
        //     ProdCD: Constants.ProdCD,
        //     BankCD: Constants.BankCode,
        //     OprCD: 'VERIOTP',
        //     Content_Type: 'application/json',
        //     REQ_TYPE: 'POST'
        // };
        // const Body =
        // {
        //     PARACNT: "1",
        //     PARA1_TYP: "STR",
        //     PARA1_VAL: "{\"BNK_CODE\":\"" + Constants.BankCode + "\",\"ACC_NO\":\"" + this.state.accon + "\",\"ADHAR_PAN\":\"" + this.state.panOrAadharNo + "\",\"MOB\":\"" + this.state.mobile + "\",\"DOB\":\"" +moment(this.state.selectedDate).format("DD-MMM-YYYY")+ "\",\"KYC_TYPE\":\"" + this.state.VerifType_key + "\",\"ACC_TYPE\":\"" + this.state.AccType_Key + "\",\"OPR_TYPE\":\"NEWREG\"}",
        //     PARA1_VAL: "{\"BNK_CODE\":\""+Constants.BankCode+"\",\"REF_ID\":\"3736\",\"USR_ID\":\"3736\",\"LPIN\":\"123456\",\"TPIN\":\"1234567\",\"OTP\":\"339348\",\"DEVICE_ID\":\""+this.props.DeviceId+"\",\"SIMNO\":\"00000000-05ec-ff6b-0000-00005659f67b\",\"REG_MODE\":\"ONLINE\",\"MOB\":\"9890015741\"}"
        // }
        // console.log("ReSendOTP URL:- " + APIUrlConstants.BASE_URL);
        // console.log("");
        // console.log("ReSendOTP:- " + JSON.stringify(Body));
        // console.log("");

        // sendData(this,
        //     'post',
        //     APIUrlConstants.BASE_URL,
        //     Headers,
        //     JSON.stringify(Body),
        //     async (obj, response) => {
        //         var responseData = response

        //         console.log("ReSendOTP Response:- " + JSON.stringify(responseData));

        //         let res = response.SUCCESS
        //         if (res === "FALSE") {

        //         }
        //         else if (res === "TRUE") 
        //         {

        //         }

        //     })

    }

    render() {
        return (

            <View style={styles.ViewFlexOne}>
                <View
                    style={styles.MainView}>

                    <Text style={styles.MainText}>Enter OTP </Text>

                    <View style={styles.OTPMainView}>

                        <View style={styles.OTPSubView} >

                            <OtpInputs
                                style={styles.OTPInpuytStyle}
                                handleChange={(code) => { this.setState({ otpInput: code }) }}
                                numberOfInputs={6}
                                inputContainerStyles={styles.OTPInputContainer}
                                focusStyles={{ borderColor: this.props.SecondaryColor, }}
                                keyboardType="numeric"
                                secureTextEntry={true}
                                inputStyles={[styles.OTPInputStyle, { color: this.props.textColor, }]}
                                selectionColor={this.props.SecondaryColor}
                                autofillFromClipboard={false}
                            />
                        </View>


                        <CardView
                            cardElevation={this.state.otpInput.length == 6 ? 4 : 0}
                            cardMaxElevation={3}
                            cornerRadius={12}
                            style={styles.CardViewStyle}>

                            <TouchableOpacity
                                style={[styles.CardViewTouchableStyle, {
                                    backgroundColor: this.props.PrimaryColor,
                                    backgroundColor: this.state.otpInput.length > 4 ? this.props.PrimaryColor : colors.btnDisable,
                                }]}
                                disabled={this.state.otpInput.length > 4 ? false : true}
                                onPress={() => { this.OtpSubmit() }}>


                                <Text style={[styles.BtnText, { color: this.state.otpInput.length > 4 ? colors.white : colors.btnDisableTextColor, }]}>
                                    {strings.submit}
                                </Text>
                            </TouchableOpacity>

                        </CardView>


                        {/* Resend OTP */}
                        {/* <TouchableOpacity
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 10,
                            }}

                            onPress={() => { this.OTPReSend() }}

                        >
                            <Text style={{
                                color: this.props.textColor

                            }}> Not Recived? Resend Otp </Text>


                        </TouchableOpacity> */}

                    </View>
                    <RenderOkDialog />
                </View>
            </View>
        );
    }
}
const styles = {

    ViewFlexOne:
    {
        flex: 1
    },

    MainView:
    {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: 50
    },
    MainText:
    {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginLeft: 20,
        marginBottom: 5
    },

    OTPMainView:
    {
        alignItems: 'center',
        justifyContent: 'center',
    },
    OTPSubView:
    {
        height: 60,
        width: width - 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },

    OTPInpuytStyle:
    {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    OTPInputContainer:
    {
        height: 45,
        width: 45,
        margin: 5,
        borderWidth: 1,
        justifyContent: 'center',
        backgroundColor: colors.otpBackColor,
        borderColor: colors.otpBorderColor,
        borderRadius: 8,
    },
    OTPInputStyle:
    {
        fontSize: 15,
        textAlign: 'center',
    },
    CardViewStyle:
    {
        backgroundColor: 'white',
        justifyContent: 'center',
        marginVertical: 10,
    },
    CardViewTouchableStyle:
    {
        padding: 15,
        width: width - 40,
        justifyContent: 'center',
        borderRadius: 12,
    },
    BtnText:
    {
        alignSelf: 'center',
        fontFamily: strings.fontRegular,
        fontSize: 15
    }

}
export default connect(mapStateToProps, mapDispatchToProps)(OfflineOtpScreen);
