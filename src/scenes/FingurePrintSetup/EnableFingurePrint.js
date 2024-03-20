import React, { Component } from 'react';
import {
    Text,
    View,
    ImageBackground,
} from 'react-native';
import {
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    navigation,
    appThemeConfiguration,
} from '../../App';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TrasnsperantFixedHeader from '../../components/TrasnperantFixedHeader';
import Fingerprint from '../../assets/icons/Ico-fingerPrint.svg'
import FaceIdImg from '../../assets/icons/ic_faceId.svg'
import CheckBox from '@react-native-community/checkbox';
import { RFValue } from "react-native-responsive-fontsize";
import Snackbar from 'react-native-snackbar';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'

class EnableFingurePrint extends Component {
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
            checked: false,
            Biomatric_Text: Biomatric_Text
        };
    }


    onBackAction() {
        navigation.goBack(this)
    }

    ActivateFingerPrint = async () => {
        const rnBiometrics = new ReactNativeBiometrics()


        rnBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
            .then((resultObject) => {
                const { success } = resultObject
                if (success) {
                    if (this.props.FingerPrint) {
                        if(Platform.OS === 'ios')
                        {
                            Snackbar.show({
                                text: 'Face ID Disabled Successfully..!',
                                duration: Snackbar.LENGTH_SHORT,
                                backgroundColor: 'green'
                            });
                        }
                        else{
                            Snackbar.show({
                                text: 'Finger Print Disabled Successfully..!',
                                duration: Snackbar.LENGTH_SHORT,
                                backgroundColor: 'green'
                            });
                        }
                        this.props.setFingerPrint(false)
                    }
                    else {
                        if(Platform.OS === 'ios')
                        {
                            Snackbar.show({
                                text: 'Face ID Enabled Successfully..!',
                                duration: Snackbar.LENGTH_SHORT,
                                backgroundColor: 'green'
                            });
                        }
                        else{
                            Snackbar.show({
                                text: 'Finger Print Enabled Successfully..!',
                                duration: Snackbar.LENGTH_SHORT,
                                backgroundColor: 'green'
                            });
                        }
                        
                        this.props.setFingerPrint(true)
                    }
                    this.props.navigation.navigate('mainLogin')
                } else {
                    console.log('user cancelled biometric prompt')
                }
            })
            .catch((e) => {
                Snackbar.show({
                    text: 'Please Enable '+this.state.Biomatric_Text+' of Device',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'orange'
                });
            })

    }

    handleCheckBox = () => {
        this.setState({ checked: !this.state.checked })
    };


    BulletPoint = ({ text }) => {
        return (
            <View style={styles.bulletPointView}>
                <Text style={styles.bulletPointText}>&bull;</Text>
                <Text style={styles.bulletPointTextValue}>{text}</Text>
            </View>
        );
    };


    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg
    render() {



        let BiomatricIcon;
        if (Platform.OS === 'ios') {
            BiomatricIcon = ( <FaceIdImg color={this.state.checked ? this.props.SecondaryColor : 'gray'} height={20} width={20} />)

        }
        else {
            BiomatricIcon = ( <Fingerprint color={this.state.checked ? this.props.SecondaryColor : 'gray'} height={20} width={20} />)
        }



        return (
            <View style={styles.mainView}>
                <ImageBackground style={styles.mainView}
                    source={this.bgImage}
                    resizeMode='cover'>
                    <View style={styles.headerView}>
                        <TrasnsperantFixedHeader backAction={() => this.onBackAction()} />
                        <Text
                            style={styles.fingerPrintText}>{this.state.Biomatric_Text}</Text>
                        <Text style={styles.fingerPrintDisableText}>
                            {this.props.FingerPrint ? "Disable " + this.state.Biomatric_Text + " Login" : " Enabling " + this.state.Biomatric_Text + " Login"}
                        </Text>
                    </View>
                    <View style={styles.passwordView}>
                        <Text style={styles.readCarefullyText}>Please read carefully before {this.props.FingerPrint ? "deactivation" : "activation"}</Text>
                        <View style={styles.booletTextMainView}>
                            <View style={styles.booletTextSubView}>
                                <Text style={styles.disclaimerText}>Disclaimer:</Text>

                                <this.BulletPoint text={'Easily access your device by placing your '+this.state.Biomatric_Text+' on the sensor for a quick login.'} />
                                <this.BulletPoint text={'Utilize the convenience of '+this.state.Biomatric_Text+' login by registering your biometric data on the device.'} />
                                <this.BulletPoint text={'It is important to ensure that you are the only user registered with '+this.state.Biomatric_Text+' biometric on your device as the bank and Netwin cannot be held responsible for transactions made using a different '+this.state.Biomatric_Text+'.'} />


                            </View>
                        </View>
                        <View style={styles.checkboxMainView}>
                            <View style={styles.checkboxSubView}>

                                <CheckBox
                                    style={[styles.checkbox, { borderColor: this.props.PrimaryColor }]}
                                    lineWidth={0.5}
                                    hideBox={false}
                                    tintColors={{ true: this.props.SecondaryColor }}
                                    animationDuration={0.5}
                                    disabled={false}
                                    onAnimationType={'bounce'}
                                    offAnimationType={'stroke'}
                                    onValueChange={this.handleCheckBox}
                                    value={this.state.checked} />

                                <TouchableOpacity style={styles.checkboxTouchable}
                                    onPress={
                                        () => this.setState({ checked: !this.state.checked })
                                    }>

                                    <Text style={[styles.agreeText, { color: this.props.PrimaryColor }]}>I Agree to the Terms and Conditions</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={[styles.fingerPrintActivateTouchable, { borderColor: this.state.checked ? this.props.PrimaryColor : 'gray', }]}
                                disabled={this.state.checked == true ? false : true}
                                onPress={() => this.ActivateFingerPrint()}>
                                <View style={[styles.fingerprintView, { backgroundColor: this.props.themeColor + '1A', }]}>
                                    {BiomatricIcon}
                                </View>

                                <Text style={[styles.deactivateText, { color: this.state.checked ? this.props.textColor : 'gray', }]}>
                                    {this.props.FingerPrint ? " Deactivate "+this.state.Biomatric_Text+" Login" : " Activate "+this.state.Biomatric_Text+" Login"}
                                </Text>

                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}
const styles = {
    checkbox: {
        alignSelf: 'center',
        borderStyle: 'dotted'
    },
    mainView:
    {
        flex: 1
    },
    headerView:
    {
        flex: 0.35,
        justifyContent: 'flex-start'
    },
    fingerPrintText:
    {
        marginLeft: 25,
        color: 'white',
        fontSize: 24,
        fontFamily: strings.fontBold
    },
    fingerPrintDisableText:
    {
        marginLeft: 25,
        color: 'white',
        fontSize: RFValue(14),
        fontFamily: strings.fontRegular,
        marginTop: 5,
    },
    passwordView:
    {
        flex: 0.65,
        alignItems: 'center',
        backgroundColor: '#fbfcfc',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column'
    },
    readCarefullyText:
    {
        marginTop: 35,
        fontFamily: strings.fontRegular,
        fontSize: RFValue(14),
        color: '#EB5757',
        textAlign: 'center'
    },
    booletTextMainView: {
        marginTop: 40,
    },
    booletTextSubView:
    {
        flexDirection: 'column',
        width: width - 65,
        marginBottom: 20,
    },
    disclaimerText:
    {
        fontFamily: strings.fontRegular,
        fontSize: RFValue(14),
        color: '#252525',
        marginBottom: 15
    },
    checkboxMainView:
    {

        flex: 1,
        width: width - 40,
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 20,
    },
    checkboxSubView:
    {
        marginTop: 20,
        width: width - 40,
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    checkboxTouchable:
    {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    agreeText:
    {
        fontFamily: strings.fontRegular,
        fontSize: RFValue(13),
        marginBottom: 3,
        fontWeight: 'bold',
        marginLeft: 10
    },
    fingerPrintActivateTouchable:
    {
        width: width - 40,
        flexDirection: 'row',
        margin: 15,
        padding: 5,
        backgroundColor: '#f4f5fa',
        borderWidth: 2,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fingerprintView:
    {
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
        alignItems: 'center',
        justifyContent: 'center'

    },
    deactivateText:
    {
        marginLeft: 10,
        alignSelf: 'center',
        fontFamily: strings.fontMedium,
        fontSize: RFValue(14),
        marginBottom: 3
    },
    bulletPointView:
    {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    bulletPointText:
    {
        color: 'black',
        marginRight: 5,
        marginTop: 2,
        fontSize: RFValue(14),
    },
    bulletPointTextValue:
    {
        color: '#686868',
        fontFamily: strings.fontRegular,
        fontSize: RFValue(14)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EnableFingurePrint);