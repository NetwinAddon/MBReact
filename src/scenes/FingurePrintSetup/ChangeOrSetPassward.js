import React, { Component } from 'react';
import {
    Text,
    View,
    ImageBackground,
    Platform,
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
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview'
import TrasnsperantFixedHeader from '../../components/TrasnperantFixedHeader';
import DropDown from '../../assets/icons/DropDown.svg'
import Password from '../../assets/icons/fi-rr-password.svg'
import Fingerprint from '../../assets/icons/Ico-fingerPrint.svg'
import ChngTrsPin from '../../assets/icons/Ico-UpDownArrow.svg'
import Lock from '../../assets/icons/Ico-lock.svg'
import Colors from '../../common/Colors';
import FaceIdImg from '../../assets/icons/ic_faceId.svg'


class ChangeOrSetPassward extends Component {
    constructor(props) {
        super(props);
    }

    changeFingreprint() {
        navigation.navigate(this, 'enableFingurePrint')
    }

    ChangeLoginPassword() {
        navigation.navigate(this, 'ChangeLoginPassword')
    }

    ChangeMpin() {
        this.props.navigation.navigate('ForgetMpinOptionScreen')
    }

    ChangeTransactionPin() {
        navigation.navigate(this, 'ChangeTransactionPassword')
    }

    ChangeUserId() {
        this.props.navigation.navigate('ChangeUserId')
    }

    onBackAction() {
        navigation.goBack(this)
    }

    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg2

    render() {

        let BiomatricIcon;
        let Biomatric_Text;

        if (Platform.OS === 'ios') {
            BiomatricIcon = (<FaceIdImg height={18} width={22} color={this.props.SecondaryColor} />)
            Biomatric_Text = 'Face ID Login'
        }
        else {
            BiomatricIcon = (<Fingerprint height={18} width={22} color={this.props.SecondaryColor} />)
            Biomatric_Text = 'Fingerprint Login'
        }



        return (
            <View style={styles.mainView}>
                <ImageBackground style={styles.mainView}
                    source={this.bgImage}
                    resizeMode='cover'>
                    <View style={styles.passwordView}>
                        <TrasnsperantFixedHeader
                            backAction={() => this.onBackAction()} />
                        <Text style={styles.passwordText}>Passwords</Text>
                        <Text style={styles.setOrChangePasswordText}>Set Or Change Passwords</Text>
                    </View>
                    <View style={styles.mainSubView}>
                        <ScrollView >
                            <CardView
                                cardElevation={2}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.CardStyle}>
                                <TouchableOpacity onPress={() => {
                                    this.ChangeLoginPassword();
                                }}>
                                    <View
                                        style={styles.Touchablestyle}>
                                        <View style={styles.changeLoginPasswordView}>
                                            <View style={styles.ViewStyle}>
                                                <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                    <Password height={18} width={22} color={this.props.SecondaryColor} />
                                                </View>
                                            </View>
                                            <Text style={styles.MainTextStyle}>
                                                Change Login Password
                                            </Text>
                                        </View>
                                        <View
                                            style={styles.ArrowIcon}>
                                            <DropDown width={15} height={15} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </CardView>
                            <CardView
                                cardElevation={2}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.CardStyle}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.ChangeMpin();
                                    }}>
                                    <View
                                        style={styles.Touchablestyle}>
                                        <View style={styles.changeLoginPasswordView}>
                                            <View style={styles.ViewStyle}>
                                                <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                    <Lock height={18} width={22} color={this.props.SecondaryColor} />
                                                </View>
                                            </View>
                                            <Text style={styles.MainTextStyle}>
                                                Reset MPIN
                                            </Text>
                                        </View>
                                        <View
                                            style={styles.ArrowIcon}>
                                            <DropDown width={15} height={15} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </CardView>
                            <CardView
                                cardElevation={2}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.CardStyle}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.ChangeTransactionPin();
                                    }}>
                                    <View
                                        style={styles.Touchablestyle}>
                                        <View style={styles.changeLoginPasswordView}>
                                            <View style={styles.ViewStyle}>
                                                <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                    <ChngTrsPin height={18} width={22} color={this.props.SecondaryColor} />
                                                </View>
                                            </View>
                                            <Text style={styles.MainTextStyle}>
                                                Change Transaction Pin
                                            </Text>
                                        </View>
                                        <View
                                            style={styles.ArrowIcon}>
                                            <DropDown width={15} height={15} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </CardView>
                            {this.props.userId != null && this.props.userId != undefined && this.props.userId.trim() != "" &&
                                <CardView
                                    cardElevation={2}
                                    cardMaxElevation={3}
                                    cornerRadius={12}
                                    style={styles.CardStyle}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.changeFingreprint()
                                        }}>
                                        <View
                                            style={styles.Touchablestyle}>
                                            <View style={styles.changeLoginPasswordView}>
                                                <View style={styles.ViewStyle}>
                                                    <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >

                                                        {BiomatricIcon}
                                                    </View>
                                                </View>
                                                <Text style={styles.MainTextStyle}>
                                                    {this.props.FingerPrint ? " Disable "+Biomatric_Text : " Enabling "+Biomatric_Text}
                                                </Text>
                                            </View>
                                            <View
                                                style={styles.ArrowIcon}>
                                                <DropDown width={15} height={15} />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </CardView>
                            }
                            <CardView
                                cardElevation={2}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.CardStyle}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.ChangeUserId();
                                    }}>
                                    <View
                                        style={styles.Touchablestyle}>
                                        <View style={styles.changeLoginPasswordView}>
                                            <View style={styles.ViewStyle}>
                                                <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                    <Password height={18} width={22} color={this.props.SecondaryColor} />
                                                </View>
                                            </View>
                                            <Text style={styles.MainTextStyle}>
                                                Change User ID
                                            </Text>
                                        </View>
                                        <View
                                            style={styles.ArrowIcon}>
                                            <DropDown width={15} height={15} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </CardView>
                        </ScrollView>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = {

    CardStyle:
    {
        backgroundColor: 'white',
        marginTop: 15,
        marginBottom: 5,
        width: width - 40,
        marginHorizontal: 5,
        alignItems: 'center'
    },
    Touchablestyle:
    {

        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        alignItems: 'center',
        width: width - 40,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: '#cdcdce',
        borderRadius: 12,

    },

    IconBgStyle:
    {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: Colors.themeColorOrange + '1A',
        alignItems: 'center',
        justifyContent: 'center'
    },
    MainTextStyle:
    {
        fontSize: 15,
        includeFontPadding: false,
        color: Colors.boldTextColor,
        fontFamily: strings.fontMedium
    },

    ViewStyle:
    {
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },

    ArrowIcon:
    {
        width: 20,
        height: 20,
        justifyContent: 'flex-end',
        transform: [{ rotate: '-90deg' },],
    },
    mainView:
    {
        flex: 1
    },
    passwordView:
    {
        flex: 0.3,
        justifyContent: 'flex-start'
    },
    passwordText:
    {
        marginLeft: 15,
        color: 'white',
        fontSize: 24,
        fontFamily: strings.fontBold
    },
    setOrChangePasswordText:
    {
        marginLeft: 15,
        color: 'white',
        fontSize: 15,
        fontFamily: strings.fontRegular
    },
    mainSubView:
    {
        flex: 0.9,
        alignItems: 'center',
        backgroundColor: '#fbfcfc',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column',
        paddingTop: 30,
    },
    changeLoginPasswordView:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeOrSetPassward);