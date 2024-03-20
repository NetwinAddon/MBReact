import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Keyboard,
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
    constants,
    sendData,
} from '../../../App';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview'
import TrasnsperantFixedHeader from '../../../components/TrasnperantFixedHeader';
import { TextInput } from 'react-native-paper';
import EyeOpen from '../../../assets/icons/formIcons/ico-eye.svg';
import EyeSlash from '../../../assets/icons/formIcons/ico-eye-slash.svg';
import MyValidator from '../../../common/MyValidator';
import APIUrlConstants from '../../../common/APIUrlConstants';
import Snackbar from 'react-native-snackbar';


class MpinAndPasswordCreation extends Component {
    constructor(props) {
        super(props);



        this.OTP = props.route.params.OTP
        this.MobileNo = props.route.params.MobileNo
        this.USERID = props.route.params.USERID



        this.state = {
            mpin: '',
            confirmMpin: '',
            isSubmit: false,
            loginPass: '',
            confirmloginPass: '',
            isloginPass: true,
            isConfirmloginPass: true,
            isTransactionPin: true,
            transPass: '',
            confirmTransPass: '',
            loginPin_error: '',
            transactionPin_error: '',

        };
    }

    componentDidMount() {

    }


    onBackAction() {
        navigation.goBack(this)
    }


    Submit() {

        const result = this.ValidateForm();

        if (result) {

            this.VerifyOTPApi()
        }

    }

    ValidateForm() {

        var result = true;

        this.setState({ transactionPin_error: '', loginPin_error: '' });


        if (!MyValidator.isConfirmPassword(this.state.loginPass, this.state.confirmloginPass).isValid) {
            this.setState({ loginPin_error: MyValidator.isConfirmPassword(this.state.loginPass, this.state.confirmloginPass).Response });

            result = false;
        }

        if (!MyValidator.isConfirmTrasactionPassword(this.state.transPass, this.state.confirmTransPass).isValid) {
            this.setState({ transactionPin_error: MyValidator.isConfirmTrasactionPassword(this.state.transPass, this.state.confirmTransPass).Response });
            result = false;
        }

        const regex = /(.)(\1{3,})/g;

        if (this.state.loginPass.match(regex)) {
            this.setState({ loginPin_error: "Can't enter 4 consecutive variable" });
            result = false
        }

        if (this.state.transPass.match(regex)) {
            this.setState({ transactionPin_error: "Can't enter 4 consecutive variable" });
            result = false
        }

        if (this.state.loginPass.trim() === '') {
            this.setState({ loginPin_error: "Password can't be blank" });
            result = false
        }

        if (this.state.transPass.trim() === '') {
            this.setState({ transactionPin_error: "Password can't be blank" });
            result = false
        }





        return result;
    };


    VerifyOTPApi() {

        const simid = '00000000-05ec-ff6b-0000-00005659f38b';

        const Headers = APIUrlConstants.Headers("VERIOTP");

        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: "{\"BNK_CODE\":\"" + constants.BankCode + "\",\"REF_ID\":\"" + this.USERID + "\",\"USR_ID\":\"" + this.USERID + "\",\"LPIN\":\"" + this.state.confirmloginPass + "\",\"TPIN\":\"" + this.state.confirmTransPass + "\",\"OTP\":\"" + this.OTP + "\",\"DEVICE_ID\":\"" + this.props.DeviceId + "\",\"SIMNO\":\"" + simid + "\",\"REG_MODE\":\"ONLINE\",\"MOB\":\"" + this.MobileNo + "\"}"
        }

        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {

                let res = response.SUCCESS
                if (res === "FALSE") {
                    const ErrorMsg = response.RESULT

                    navigation.replace(this, 'RegistrationFail')
                    Snackbar.show({
                        text: ErrorMsg,
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'red'
                    });

                }
                else if (res === "TRUE") {
                    navigation.replace(this, 'registrationSuccess', { USERID: this.USERID })

                }

            })

    }


    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg
    render() {
        return (
            <View style={styles.FlexOne}>
                <ImageBackground style={styles.FlexOne}

                    source={this.bgImage}
                    resizeMode='cover'
                >

                    <View style={styles.HeaderViewStyle}>

                        <TrasnsperantFixedHeader
                            backAction={() => this.onBackAction()}
                        />


                        <View style={styles.ImageViewStyle}>

                            <Image source={assets.onSuccess} style={styles.ImageStyle} />

                        </View>
                    </View>


                    <KeyboardAvoidingView
                        style={styles.KeyboardViewStyle}
                        behavior={Platform.OS === 'ios' ? 'padding' : ''}
                        enabled={true}>
                        <ScrollView>

                            <View style={styles.ScrollViewViewStyle}>

                                <Text style={[styles.HeadingText, { color: this.props.PrimaryColor, }]}>Create Password</Text>

                                <View
                                    style={styles.TextViewStyle}>

                                    <TextInput
                                        style={styles.TextInputStyle}
                                        theme={{
                                            colors: {
                                                placeholder: '#DFE1E8',
                                                text: this.props.textColor,
                                                primary: this.props.PrimaryColor,
                                                underlineColor: 'transparent',
                                            },
                                            roundness: 8,
                                        }}
                                        label="Login Password"
                                        value={this.state.loginPass}
                                        keyboardType='default'
                                        onChangeText={loginPass => { this.setState({ loginPass }); }}
                                        mode='outlined'
                                        maxLength={20}
                                        secureTextEntry={true}
                                        placeholder='Login Password'
                                        returnKeyType='next'
                                        onSubmitEditing={() => { this.confirmLoginpass.focus(); }}
                                        blurOnSubmit={false}

                                    />
                                </View>


                                <View
                                    style={styles.JustifycenterStyle}>

                                    <TextInput
                                        style={styles.TextInputStyle}
                                        theme={{
                                            colors: {
                                                placeholder: '#DFE1E8',
                                                text: this.props.textColor,
                                                primary: this.props.PrimaryColor,
                                                underlineColor: 'transparent',
                                            },
                                            roundness: 8,
                                        }}
                                        label="Confirm Login Password"
                                        value={this.state.confirmloginPass}
                                        keyboardType='default'
                                        onChangeText={confirmloginPass => { this.setState({ confirmloginPass }); }}
                                        mode='outlined'
                                        secureTextEntry={this.state.isConfirmloginPass}
                                        maxLength={20}
                                        right={
                                            <TextInput.Icon
                                                forceTextInputFocus={false}
                                                onPress={() => {
                                                    this.setState({ isConfirmloginPass: !this.state.isConfirmloginPass })
                                                    Keyboard.dismiss();
                                                }}
                                                icon={() =>
                                                    <View
                                                        style={styles.EyeIconStyle} >
                                                        {this.state.isConfirmloginPass ?
                                                            <EyeSlash height={20} width={20} color={'#000000'} />
                                                            : <EyeOpen height={20} width={20} color={'#000000'} />}
                                                    </View>}
                                            />
                                        }
                                        ref={(input) => { this.confirmLoginpass = input; }}
                                        placeholder='Confirm Login Password'
                                        returnKeyType='next'
                                        onSubmitEditing={() => { this.transactionpass.focus(); }}
                                        blurOnSubmit={false}

                                    />

                                    {this.state.loginPin_error !== '' && (<Text style={styles.ErrorDisplay}>{this.state.loginPin_error}</Text>)}

                                </View>


                                <View style={styles.PassViewStyle}>
                                    <TextInput
                                        style={styles.TextInputStyleTwo}
                                        theme={{
                                            colors: {
                                                placeholder: '#DFE1E8',
                                                text: this.props.textColor,
                                                primary: this.props.PrimaryColor,
                                                underlineColor: 'transparent',
                                            },
                                            roundness: 8,
                                        }}
                                        label="Transaction password"
                                        value={this.state.transPass}
                                        keyboardType='default'
                                        onChangeText={transPass => { this.setState({ transPass }); }}
                                        mode='outlined'
                                        secureTextEntry={true}
                                        ref={(input) => { this.transactionpass = input; }}
                                        maxLength={20}
                                        placeholder='Transaction password'
                                        returnKeyType='next'
                                        onSubmitEditing={() => { this.Confirmtransactionpass.focus(); }}
                                        blurOnSubmit={false}
                                    />

                                </View>

                                <View style={styles.JustifycenterStyle}>
                                    <TextInput
                                        style={styles.TextInputStyleTwo}
                                        theme={{
                                            colors: {
                                                placeholder: '#DFE1E8',
                                                text: this.props.textColor,
                                                primary: this.props.PrimaryColor,
                                                underlineColor: 'transparent',
                                            },
                                            roundness: 8,
                                        }}
                                        label="Confirm Transaction Password"
                                        value={this.state.confirmTransPass}
                                        keyboardType='default'
                                        onChangeText={confirmTransPass => { this.setState({ confirmTransPass }); }}
                                        mode='outlined'
                                        maxLength={20}
                                        secureTextEntry={this.state.isTransactionPin}
                                        right={
                                            <TextInput.Icon
                                                forceTextInputFocus={false}
                                                onPress={() => {
                                                    this.setState({ isTransactionPin: !this.state.isTransactionPin })
                                                    Keyboard.dismiss();
                                                }}
                                                icon={() =>
                                                    <View
                                                        style={styles.EyeIconStyle} >
                                                        {this.state.isTransactionPin ?
                                                            <EyeSlash height={20} width={20} color={'#000000'} />
                                                            : <EyeOpen height={20} width={20} color={'#000000'} />}
                                                    </View>}
                                            />
                                        }
                                        ref={(input) => { this.Confirmtransactionpass = input; }}
                                        placeholder='Confirm Transaction Password'
                                    />

                                    {this.state.transactionPin_error !== '' && (<Text style={styles.ErrorDisplay}>{this.state.transactionPin_error}</Text>)}

                                </View>


                                <View style={styles.BtnViewStyle}>
                                    <CardView
                                        cardElevation={3}
                                        cardMaxElevation={3}
                                        cornerRadius={12}
                                        style={styles.BtnCardViewStyle}>

                                        <TouchableOpacity
                                            style={styles.BtnTouchableStyle}
                                            onPress={() => this.Submit()} >

                                            <Text style={styles.BtnTextStyle}> {strings.submit} </Text>

                                        </TouchableOpacity>

                                    </CardView>

                                </View>

                            </View>

                        </ScrollView>

                    </KeyboardAvoidingView>
                </ImageBackground>
            </View>


        );
    }
}

const styles = {

    FlexOne:
    {
        flex: 1
    },
    HeaderViewStyle:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ImageViewStyle:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    ImageStyle:
    {
        height: 250,
        width: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },

    KeyboardViewStyle:
    {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },

    ScrollViewViewStyle:
    {
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column'
    },

    HeadingText:
    {
        width: width - 50,
        marginTop: 30,
        fontSize: 22,
        textAlign: 'center',
        fontFamily: strings.fontBold,
    },

    TextViewStyle:
    {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },

    TextInputStyle:
    {
        lineHeight: 40,
        height: 48,
        justifyContent: 'space-between',
        alignItems: 'stretch',
        width: width - 50,
    },

    TextInputStyleTwo:
    {
        lineHeight: 40,
        height: 48,
        width: width - 50,
    },

    JustifycenterStyle:
    {
        justifyContent: 'center',
    },

    EyeIconStyle:
    {
        height: 30,
        width: 30,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    PassViewStyle:
    {
        alignItems: 'center',
        justifyContent: 'center',
    },

    BtnViewStyle:
    {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    BtnCardViewStyle:
    {
        backgroundColor: 'white',
        justifyContent: 'center',
        marginVertical: 10,
        marginBottom: 30
    },

    BtnTouchableStyle:
    {
        padding: 15,
        width: width - 50,
        backgroundColor: colors.btnColor,
        justifyContent: 'center',
        borderRadius: 12,
    },

    BtnTextStyle:
    {
        alignSelf: 'center',
        color: colors.white,
        fontFamily: strings.fontRegular,
        fontSize: 15
    },

    ErrorDisplay: { color: "#FF0000", marginLeft: 5, fontSize: 12 }
}

export default connect(mapStateToProps, mapDispatchToProps)(MpinAndPasswordCreation);
