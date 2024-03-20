import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    ImageBackground,
    Platform,
    KeyboardAvoidingView,
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
    config,
} from '../../App';
import Footer from '../../assets/icons/footer.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview'
import TrasnsperantFixedHeader from '../../components/TrasnperantFixedHeader';
import OtpInputs from 'react-native-otp-inputs';


class ExistingUserOtpConfirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: ''
        };
    }

    onBackAction() {
        navigation.goBack(this)
    }

    toSucess() {
        navigation.navigate(this, 'existingUserLoginSuccess')
    }
    bgImage = appThemeConfiguration(config.themeColor).bgImg
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
                        <View style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                            <TrasnsperantFixedHeader
                                backAction={() => this.onBackAction()}/>
                            <View style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                                <Image
                                    source={require('../../assets/images/graphic-img-03.png')}
                                    style={styles.imgContainer}
                                    resizeMode={Platform.OS === "android" ? 'center' : 'contain'}/>
                            </View>
                        </View>
                        <View style={styles.enterOtpView}>
                            <Text style={[styles.otpConfirmText, { color: this.props.textColor }]}>{strings.entrOtpToconfirm}</Text>
                            <View style={styles.otpView}>
                                    <OtpInputs
                                    caretHidden={false}
                                    handleChange={(code) => {
                                        this.setState({ otp: code })
                                        console.log(code)
                                    }}
                                    numberOfInputs={6}
                                    inputContainerStyles={{
                                        height: 45,
                                        width: 45,
                                        margin: 5,
                                        borderWidth: 1,
                                        justifyContent : 'center',
                                        backgroundColor: colors.otpBackColor,
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
                                    secureTextEntry={true}
                                    autofillFromClipboard={false}
                                />
                            </View>
                            <CardView
                                cardElevation={this.state.otp.length == 6 ? 3 : 0}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.cardSubmit}>
                                <TouchableOpacity
                                    style={[styles.cardTouchable, {  backgroundColor: this.state.otp.length == 6 ? colors.btnColor : colors.btnDisable,}]}
                                    disabled={this.state.otp.length == 6 ? false : true}
                                    onPress={() => this.toSucess()}
                                ><Text style={[styles.submitText, {  color: this.state.otp.length == 6 ? colors.white : colors.btnDisableTextColor,}]}>
                                        {strings.submit}
                                    </Text>
                                </TouchableOpacity>
                            </CardView>
                            <TouchableOpacity
                                style={styles.resenTouchable}>
                                <Text style={[styles.resenOtpText, { color: this.props.themeColor,}]}>{strings.notRecivedResendOtp}
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.footerView}>
                                <Footer height={70} width={300} />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer:
    {
        flex: 1
    },
    imgContainer:
    {
        height: 106,
        width: 106,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    enterOtpView:
    {
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column'
    },
    otpConfirmText:
    {
        width: width - 50,
        marginTop: 30,
        fontSize: 25,
        textAlign: 'center',
        fontFamily: strings.fontBold,
    },
    otpView:
    {
        height: 60,
        width: width - 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    cardSubmit:
    {
        backgroundColor: 'white',
        justifyContent: 'center',
        marginVertical: 10,
    },
    cardTouchable:
    {
        padding: 15,
        width: width - 40,
        backgroundColor: colors.btnColor,
        justifyContent: 'center',
        borderRadius: 12,
    },
    submitText:
    {
        alignSelf: 'center',
        fontFamily: strings.fontRegular,
        fontSize: 15
    },
    resenTouchable:
    {
        marginVertical: 10,
    },
    resenOtpText:
    {
        fontSize: 15,
        textAlign: 'left',
        fontFamily: strings.fontMedium,
    },
    footerView:
    {
        alignItems: 'flex-end',
    }


});
export default connect(mapStateToProps, mapDispatchToProps)(ExistingUserOtpConfirmation);
