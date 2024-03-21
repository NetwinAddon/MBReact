import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Keyboard,
    StyleSheet,
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
    RenderLoader
} from '../../App';
import Footer from '../../assets/icons/footer.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview'
import NetInfo from '@react-native-community/netinfo';
import { TextInput } from 'react-native-paper';
import TrasnsperantFixedHeader from '../../components/TrasnperantFixedHeader';
import { _toEncrypt, decryptData, sendData } from '../../common/util';
import APIUrlConstants from '../../common/APIUrlConstants';
import Constants from '../../common/Constants';
import DeviceInfo from 'react-native-device-info';
import EyeOpen from '../../assets/icons/formIcons/ico-eye.svg';
import EyeSlash from '../../assets/icons/formIcons/ico-eye-slash.svg';
import CheckBox from '@react-native-community/checkbox';
import Colors from '../../common/Colors';
import Snackbar from 'react-native-snackbar';
import { RFValue } from "react-native-responsive-fontsize";
import ReloadIcon from '../../assets/icons/ic_reload.svg'
import { isCancel } from 'axios';


class ExistingUserLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: '',
            loginPass: '',
            loader: false,
            isloginPass: true,
            isChecked: false,
            captchaText: '',
            captchaTotal: '',
            CaptchaEntered: '',
            isButtonclick: false,



            temp_Url: '',
            temp_BankCd: '',
        };
    }

    async componentDidMount() {


        this.state.temp_Url = APIUrlConstants.TempLink
        this.state.temp_BankCd = APIUrlConstants.TempBankcode


        console.log('this.state.temp_Url : ', this.state.temp_Url);
        console.log('this.state.temp_BankCd: ', this.state.temp_BankCd);

        console.log('Device Id  Existing : ', this.props.DeviceId);
        console.log('SimID Existing : ', this.props.SimId);

        this.GenerateRandomCaptcha();
        const isConnected = await this.checkInternetConnection();
        if (!isConnected) {
            console.log("Not connected to the internet");
            Snackbar.show({ text: 'Check Internet Connection', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
        }
    }


    async componentDidUpdate() {
        const isConnected = await this.checkInternetConnection();
        if (!isConnected) {
            console.log("Not connected to the internet");
            Snackbar.show({ text: 'Check Internet Connection', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
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



    handleCheckBox = () => {
        this.setState({ isChecked: !this.state.isChecked });
    };

    ForgetPassword() {
        this.props.navigation.navigate('ForgetOptionScreen')
    }

    toValidation = async () => {
        Keyboard.dismiss();
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {
            const { userid, loginPass } = this.state;
            if (userid == '' && loginPass == '') {
                Snackbar.show({ text: 'Enter User Id  & Password', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'orange' });
            }
            else if (userid == '') {
                Snackbar.show({ text: 'Enter User Id', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'orange' });
            }
            else if (loginPass == '') {
                Snackbar.show({ text: 'Enter Password', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'orange' });
            }
            else {
                if (this.state.CaptchaEntered === '' && Constants.AUTOMATION_MODE === 'N') {
                    Snackbar.show({ text: 'Enter Captcha', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'orange' });
                }
                else if (this.state.CaptchaEntered != this.state.captchaTotal && Constants.AUTOMATION_MODE === 'N') {
                    Snackbar.show({ text: 'Invalid Captcha !', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                }
                else {
                    this.LoginWith_IdPass();
                }
            }

        } else {
            console.log("Not connected to the internet");
            Snackbar.show({ text: 'Check Internet Connection', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
        }
    }

    LoginWith_IdPass = async () => {
        this.setState({ isButtonclick: true })
        setTimeout(() => {
            this.setState({ isButtonclick: false })
        }, 1500);


        const simid = '00000000-05ec-ff6b-0000-00005659f38b';
        let userName = await _toEncrypt(this.state.userid)
        let Password = await _toEncrypt(this.state.loginPass)



        if (this.state.userid.trim() === 'google' || this.state.userid.trim() === 'GOOGLE' || this.state.userid.trim() === 'Google') {
            Constants.BankCode = Constants.GoogleBankCode
            APIUrlConstants.BASE_URL = APIUrlConstants.Google_Rest_Url
        }
        else 
        {
            APIUrlConstants.BASE_URL = this.state.temp_Url
            Constants.BankCode = this.state.temp_BankCd
        }


        const Headers = APIUrlConstants.Headers("LOGIN");
        const Body =
        {
            PARACNT: "5",
            PARA1_TYP: "STR",
            PARA1_VAL: userName,
            PARA2_TYP: "STR",
            PARA2_VAL: Password,
            PARA3_TYP: "STR",
            PARA3_VAL: this.props.DeviceId,
            PARA4_TYP: "STR",
            PARA4_VAL: simid,
            PARA5_TYP: "STR",
            PARA5_VAL: "{\"DEVICE_LATTIDUTE\":\"\",\"DEVICE_LONGITUDE\":\"\",\"DEVICE_LOCAL_IP\":\"\",\"DEVICE_PUBLIC_IP\":\"\",\"DEVICE_ISP_OPERATOR\":\"\",\"BANK_CODE\":\"" + Constants.BankCode + "\",\"RESTRICTION_VER\":\"98\",\"REGULAR_VER\":\"98\"}",

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

                console.log("responseData SignUp================", response)

                var responseData = await decryptData(response)
                var newRes = responseData.slice(16)
                var finalRes = JSON.parse(newRes)
                console.log("responseData SignUp================", finalRes)
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
                    Constants.UserId = this.state.userid;
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
                    this.props.setBranchCode(finalRes.BRANCH_CODE)
                    const MpinPresent = finalRes.MPIN_PRESENT

                    if (this.state.isChecked) {
                        this.props.setGmstCode(finalRes.GMST_CODE)
                        this.props.setSecretKey(finalRes.SK)
                        this.props.setNAME(finalRes.NAME)
                        this.props.setUserId(this.state.userid)
                        this.props.setLoginPass(this.state.loginPass)

                        if (MpinPresent === 'Y') {
                            this.props.navigation.replace('bottomNavigator', { userData: finalRes })
                        }
                        else {
                            this.props.navigation.replace('createMpin', { CustomerId: finalRes.GMST_CODE, BRANCH_CODE: finalRes.BRANCH_CODE, SECRETKEY: finalRes.SK, userData: finalRes })
                        }

                    }
                    else {
                        if (MpinPresent === 'Y') {
                            this.props.navigation.replace('bottomNavigator', { userData: finalRes })
                        }
                        else {
                            this.props.navigation.replace('createMpin', { CustomerId: finalRes.GMST_CODE, BRANCH_CODE: finalRes.BRANCH_CODE, SECRETKEY: finalRes.SK, userData: finalRes })
                        }
                    }
                }
            })
    }

    onBackAction() {
        navigation.goBack(this)
    }

    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg

    render() {
        return (
            <View style={styles.mainContainer}>
                <ImageBackground style={styles.mainContainer}
                    source={this.bgImage}
                    resizeMode='cover'>
                    <KeyboardAvoidingView
                        style={styles.mainContainer}
                        behavior={Platform.OS === 'ios' ? 'padding' : ''}
                        enabled={true}>
                        <View style={[styles.mainContainer, { alignItems: 'center', justifyContent: 'center' }]}>
                            <TrasnsperantFixedHeader backAction={() => this.onBackAction()} />
                            <View style={[styles.mainContainer, { alignItems: 'center', justifyContent: 'center' }]}>
                                <Image
                                    source={require('../../assets/images/graphic-img-02.png')}
                                    style={styles.imgContainer}
                                    resizeMode={Platform.OS === "android" ? 'center' : 'contain'} />
                            </View>
                        </View>

                        <View style={styles.signInContainer}>
                            <Text style={[styles.signInText, { color: this.props.PrimaryColor }]}>{strings.signIn}
                            </Text>
                            <TextInput
                                testID='UserId'
                                style={styles.signInTextInput}
                                theme={{
                                    colors: {
                                        placeholder: '#99686868',
                                        text: this.props.textColor,
                                        primary: this.props.SecondaryColor,
                                        underlineColor: 'transparent',
                                        background: 'white',
                                        fontFamily: strings.fontRegular,
                                    },
                                    fonts: strings.fontRegular,
                                    roundness: 8,
                                }}
                                label="User ID"
                                value={this.userid}
                                onChangeText={userid => {
                                    this.setState({ userid });
                                }}
                                mode='outlined'
                                placeholder='User ID'
                                returnKeyType='next'
                                onSubmitEditing={() => { this.Pass.focus(); }}
                                blurOnSubmit={false} />
                            <TextInput
                                testID='Password'
                                style={styles.passwordTextInput}
                                theme={{
                                    colors: {
                                        placeholder: '#99686868',
                                        text: this.props.textColor,
                                        primary: this.props.SecondaryColor,
                                        underlineColor: 'transparent',
                                        background: 'white',
                                        fontFamily: strings.fontRegular,
                                    },
                                    roundness: 8,
                                }}
                                font
                                label="Password"
                                placeholder='Password'
                                value={this.loginPass}
                                onChangeText={loginPass => {
                                    this.setState({ loginPass });
                                }}
                                mode='outlined'
                                secureTextEntry={this.state.isloginPass}
                                ref={(input) => { this.Pass = input; }}
                                right={
                                    <TextInput.Icon
                                        forceTextInputFocus={false}
                                        onPress={() => {
                                            this.setState({ isloginPass: !this.state.isloginPass })
                                            Keyboard.dismiss();
                                        }}
                                        icon={() =>
                                            <View style={styles.eyeContainer}>
                                                {this.state.isloginPass ?
                                                    <EyeSlash height={20} width={20} color={'#000000'} />
                                                    : <EyeOpen height={20} width={20} color={'#000000'} />}
                                            </View>}
                                    />
                                }
                            />
                            <Text style={[styles.captchaText, { color: this.props.PrimaryColor, }]}>Captcha</Text>
                            <View style={styles.captchaMainContainer}>
                                <View style={styles.captchaInnerContainer}>
                                    <View style={styles.mainContainer}>
                                        <Text style={styles.captchaTextValue}>{this.state.captchaText}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => this.GenerateRandomCaptcha()}>
                                        <ReloadIcon height={30} width={30} />
                                    </TouchableOpacity>
                                </View>
                                <TextInput style={styles.captchaAnsTextInput}
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
                            <CardView
                                testID='Submit'
                                cardElevation={3}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.loginCard}>
                                <TouchableOpacity
                                    style={[styles.loginTouchable, { backgroundColor: this.props.PrimaryColor }]}
                                    disabled={this.state.isButtonclick}
                                    onPress={() => this.toValidation()}
                                ><Text style={styles.loginText}>{strings.logIn}</Text>
                                </TouchableOpacity>
                            </CardView>
                            <View style={styles.checkboxContainer}>
                                <CheckBox
                                    value={this.state.isChecked}
                                    onValueChange={this.handleCheckBox}
                                    style={[styles.checkbox, { borderColor: this.props.PrimaryColor }]}
                                    tintColors={{ true: this.props.PrimaryColor, false: Colors.inActiveIcon }}
                                />
                                <Text style={[styles.label, { color: this.props.PrimaryColor, }]}>Remember Me</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => { this.ForgetPassword() }}>
                                <Text style={[styles.forgotPasswordText, { color: this.props.SecondaryColor }]}>{strings.forgotPass}
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.footerView}>
                                <Footer height={70} width={300} />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </ImageBackground>
                <RenderLoader />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 10,
    },
    checkbox: {
        alignSelf: 'center',
        borderStyle: 'dotted'
    },
    label: {
        margin: 8,
        fontFamily: strings.fontBold,
    },
    mainContainer:
    {
        flex: 1
    },
    imgContainer:
    {
        height: 250,
        width: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    signInContainer:
    {
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column'
    },
    signInText:
    {
        width: width - 50,
        marginTop: 20,
        fontSize: RFValue(25),
        textAlign: 'left',
        fontFamily: strings.fontBold,
    },
    signInTextInput:
    {
        lineHeight: 40,
        height: 45,
        width: width - 50,
        marginBottom: 15,
        marginTop: 10,
        fontFamily: strings.fontRegular,
    },
    passwordTextInput:
    {
        lineHeight: 40,
        height: 45,
        width: width - 50,
        fontFamily: strings.fontRegular,
    },
    eyeContainer:
    {
        height: 30,
        width: 30,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    captchaText:
    {
        width: width - 50,
        marginTop: 10,
        fontSize: RFValue(15),
        textAlign: 'left',
        fontFamily: strings.fontBold,
    },
    captchaMainContainer:
    {
        flexDirection: 'row',
        marginTop: 9,
        marginHorizontal: 25
    },
    captchaInnerContainer:
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
    captchaTextValue:
    {
        fontWeight: '500',
        fontSize: RFValue(15),
        alignSelf: 'center',
        color: "#686868",
    },
    captchaAnsTextInput:
    {
        lineHeight: 45,
        height: 40,
        width: width - 40,
        fontFamily: strings.fontRegular,
        flex: 1.2,
        marginLeft: 5,
    },
    loginCard:
    {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginTouchable:
    {
        padding: 15,
        width: width - 50,
        justifyContent: 'center',
        borderRadius: 12,
    },
    loginText:
    {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: RFValue(15)
    },
    forgotPasswordText:
    {
        fontSize: RFValue(13),
        textAlign: 'left',
        fontFamily: strings.fontMedium,
    },
    footerView:
    {
        alignItems: 'flex-end',
    }

});
export default connect(mapStateToProps, mapDispatchToProps)(ExistingUserLogin);
