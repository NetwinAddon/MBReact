import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    StyleSheet,
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
    RenderLoader,
} from '../../App';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';
import OtpInputs from 'react-native-otp-inputs';
import Constants from '../../common/Constants';
import { _toEncrypt, decryptData, sendData } from '../../common/util';
import APIUrlConstants from '../../common/APIUrlConstants';
import Snackbar from 'react-native-snackbar';
import TrasnperantFixedHeader from '../../components/TrasnperantFixedHeader';

class CreateMpin extends Component {
    constructor(props) {
        super(props);

        this.CustomerId = props.route.params.CustomerId;
        this.BRANCH_CODE = props.route.params.BRANCH_CODE;
        this.SECRETKEY = props.route.params.SECRETKEY;
        this.finalRes = props.route.params.userData;

        this.state = {
            mpin: '',
            confirmMpin: '',
            isSubmit: false,
        };
    }

    componentDidMount() { }

    onBackAction() {
        navigation.goBack(this);
    }

    checkpaas() { }

    toSuccess() {
        this.CreateMpinApi();
    }

    CreateMpinApi = async () => {
        const deviceId = this.props.DeviceId;

        const Headers = APIUrlConstants.Headers('CALLAPI');

        const jsonReq = {
            customerId: this.CustomerId,
            branchCd: this.BRANCH_CODE,
            secKey: this.SECRETKEY,
            divId: deviceId,
            MPIN: this.state.confirmMpin,
            BANK_CODE: Constants.BankCode,
        };

        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));


        const Body = {
            PARACNT: '2',
            PARA1_TYP: 'STR',
            PARA1_VAL: 'setMPIN',
            PARA2_TYP: 'STR',
            PARA2_VAL: jsonValue,
        };


        sendData(
            this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                var responseData = await decryptData(response);
                var newRes = responseData.slice(16);
                var finalRes = JSON.parse(newRes);

                if (finalRes.SUCCESS === 'FALSE') {
                    const ErrorMsg = finalRes.RESULT;
                    Snackbar.show({
                        text: ErrorMsg,
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'red',
                    });
                } else {

                    this.props.navigation.replace('bottomNavigator', { userData: this.finalRes });
                }
            }
        );
    };

    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg;
    render() {
        return (
            <View style={styles.ViewFlexOne}>

                <ImageBackground style={styles.ViewFlexOne} source={this.bgImage} resizeMode='cover'>

                    <View style={styles.HeaderStyle}>

                        <TrasnperantFixedHeader backAction={() => this.onBackAction()} />

                        <View style={styles.ImageBg} >

                            <Image
                                source={assets.onSuccess}
                                style={styles.ImageStyle}
                            />
                        </View>
                    </View>

                    <KeyboardAvoidingView
                        style={styles.KeyBoardViewStyle}
                        behavior={Platform.OS === 'ios' ? 'padding' : ''}
                        enabled={true}>

                        <View style={styles.KeyboardSubView} >

                            <Text style={[styles.TextStyle, { color: this.props.textColor, }]} >  {strings.entrMpin} </Text>

                            <View
                                style={styles.OTPViewBg}>

                                <OtpInputs
                                    style={styles.OTPStyle}
                                    handleChange={(code) => {
                                        this.setState({
                                            mpin: code,
                                            isSubmit: this.state.confirmMpin == code && this.state.confirmMpin != '' ? true : false,
                                        });
                                    }}
                                    keyboardType='numeric'
                                    numberOfInputs={4}
                                    inputContainerStyles={styles.OTPInputContainerStyle}
                                    focusStyles={{ borderColor: this.props.themeColor }}
                                    inputStyles={[styles.OTPInputStyle, { color: this.props.textColor }]}
                                    selectionColor={this.props.themeColor}
                                    secureTextEntry={true}
                                    autofillFromClipboard={false}
                                />
                            </View>

                            <Text
                                style={[styles.ConfMpinTxt, { color: this.props.textColor, }]}>
                                {strings.confMpin}
                            </Text>

                            <View
                                pointerEvents={this.state.mpin.length >= 4 ? 'auto' : 'none'}
                                style={styles.OTPViewBg} >

                                <OtpInputs
                                    style={{ flexDirection: 'row' }}
                                    handleChange={(value) => {this.setState({ isSubmit: this.state.mpin == value ? true : false, confirmMpin: value }); }}
                                    numberOfInputs={4}
                                    keyboardType='numeric' 
                                    inputContainerStyles={styles.OTPInputContainerStyle}
                                    focusStyles={{ borderColor: this.props.themeColor }}
                                    inputStyles={[styles.OTPInputStyle, { color: this.props.textColor }]}
                                    selectionColor={this.props.themeColor}
                                    secureTextEntry={true}
                                    autofillFromClipboard={false}
                                />
                            </View>

                            <CardView
                                cardElevation={this.state.isSubmit == true ? 3 : 0}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.CardViewStyle}>

                                <TouchableOpacity
                                    style={[styles.BtnTouchableStyle,{backgroundColor: this.state.isSubmit == true ? colors.btnColor : colors.btnDisable,}]}
                                    disabled={this.state.isSubmit == true ? false : true}
                                    onPress={() => this.toSuccess()}
                                >
                                    <Text
                                        style={[styles.BtnTextStyle,{ color: this.state.isSubmit == true ? colors.white : colors.btnDisableTextColor,}]}
                                    >
                                        {strings.submit}
                                    </Text>
                                </TouchableOpacity>
                            </CardView>
                        </View>
                    </KeyboardAvoidingView>
                </ImageBackground>

                <RenderLoader />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    ViewFlexOne:
    {
        flex: 1
    },

    HeaderStyle:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    ImageBg:
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
    KeyBoardViewStyle:
    {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },

    KeyboardSubView:
    {
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column',
    },

    TextStyle:
    {
        width: width - 50,
        marginTop: 30,
        fontSize: 22,
        textAlign: 'center',
        fontFamily: strings.fontBold,

    },

    OTPViewBg:
    {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },

    OTPStyle:
    {
        flexDirection: 'row'
    },
    OTPInputContainerStyle:
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
    ConfMpinTxt:
    {
        width: width - 50,
        fontSize: 22,
        textAlign: 'center',
        fontFamily: strings.fontBold,
    },
    CardViewStyle:
    {
        backgroundColor: 'white',
        justifyContent: 'center',
        marginVertical: 10,
        marginBottom: 30,
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
        fontFamily: strings.fontRegular,
        fontSize: 15,
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateMpin);
