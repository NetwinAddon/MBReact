import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';


import {
    colors, strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    RenderOkDialog,
    width,
} from '../../../App';

import OtpInputs from 'react-native-otp-inputs';
import CardView from 'react-native-cardview';

class OnlineRegOTP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otpInput: '',


        };

    }


    alertText = () => {
        const { otpInput = '' } = this.state;
        if (otpInput) {
            Alert.alert(otpInput);
        }
    };

    clear = () => {
        this.input1.clear();
    };

    updateOtpText = () => {
        this.input1.setValue(this.state.inputText);
    };

    componentDidMount() {

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
                    style={styles.ViewMainView}>

                    <Text style={styles.EnterOTPText}>Enter OTP </Text>

                    <View style={styles.OTPInputMainView}>

                        <View style={styles.OTPInputSubView} >

                            <OtpInputs
                                style={styles.OTPInputStyle}
                                handleChange={(code) => {
                                    this.setState({ otpInput: code })
                                }}
                                numberOfInputs={6}
                                inputContainerStyles={styles.InputContainerStyle}
                                focusStyles={{ borderColor: this.props.SecondaryColor, }}
                                keyboardType="numeric"
                                secureTextEntry={true}
                                inputStyles={[styles.InputSTyle, { color: this.props.textColor, }]}
                                selectionColor={this.props.SecondaryColor}
                                autofillFromClipboard={false}
                            />
                        </View>


                        <CardView
                            cardElevation={this.state.otpInput.length == 6 ? 4 : 0}
                            cardMaxElevation={3}
                            cornerRadius={12}
                            style={styles.CardViewButtonStyle}>

                            <TouchableOpacity
                                style={[styles.CardTouchableStyle, {
                                    backgroundColor: this.props.PrimaryColor,
                                    backgroundColor: this.state.otpInput.length > 4 ? this.props.PrimaryColor : colors.btnDisable,
                                }]}
                                disabled={this.state.otpInput.length > 4 ? false : true}
                                onPress={() => { this.props.onSubmit(this.state.otpInput) }}

                            >
                                <Text style={[styles.SubmitTextStyle, { color: this.state.otpInput.length > 4 ? colors.white : colors.btnDisableTextColor, }]}>
                                    {strings.submit}
                                </Text>
                            </TouchableOpacity>
                        </CardView>


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
const styles = StyleSheet.create({

    ViewFlexOne:
    {
        flex: 1
    },

    ViewMainView:
    {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: 50
    },

    EnterOTPText:
    {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginLeft: 20,
        marginBottom: 5
    },

    OTPInputMainView:
    {
        alignItems: 'center',
        justifyContent: 'center',
    },

    OTPInputSubView:
    {
        height: 60,
        width: width - 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },

    OTPInputStyle:
    {
        flexDirection: 'row',
        justifyContent: 'center'
    },

    InputContainerStyle:
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
    InputSTyle:
    {
        fontSize: 15,
        textAlign: 'center',
    },

    CardViewButtonStyle:
    {
        backgroundColor: 'white',
        justifyContent: 'center',
        marginVertical: 10,
    },

    CardTouchableStyle:
    {
        padding: 15,
        width: width - 40,
        justifyContent: 'center',
        borderRadius: 12,
    },

    SubmitTextStyle:
    {
        alignSelf: 'center',
        fontFamily: strings.fontRegular,
        fontSize: 15
    }
})


export default connect(mapStateToProps, mapDispatchToProps)(OnlineRegOTP);
