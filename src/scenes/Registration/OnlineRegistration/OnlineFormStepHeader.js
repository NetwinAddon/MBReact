import React, { Component } from 'react';
import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import Form from '../../../assets/icons/formIcons/ico-fill-from.svg';
import Verify from '../../../assets/icons/formIcons/ico-verify.svg';
import TrasnperantFixedHeader from '../../../components/TrasnperantFixedHeader';
import Done from '../../../assets/icons/formIcons/checkIcon.svg';
import OnlineRegistration from './OnlineRegistration';

import {
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    navigation,
    appThemeConfiguration,
} from '../../../App';
import OnlineRegOTP from './OnlineRegOTP';
import OnlineRegistrationSuccess from './OnlineRegistrationSuccess';

class OnlineFormStepHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ifOnline: true,
            isVerify: false,
            isDone: false,
            flagColorVerify: false,
            flagColorDone: false,
            USERID: "",
            OTP: "",
            MobileNo: ""

        };
    }

    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg

    componentDidMount(type) {
        this.checkView(type)
    }

    onBackAction() {
        navigation.goBack(this)
    }

    checkView(type) {
        switch (type) {
            case 1:
                this.setState({
                    ifOnline: true,
                    isVerify: false,
                    isDone: false,
                    flagColorVerify: false,
                    flagColorDone: false,
                })
                break;
            case 2:
                this.setState({
                    ifOnline: false,
                    isVerify: true,
                    isDone: false,
                    flagColorVerify: true,
                    flagColorDone: false,
                })
                break;
            case 3:
                this.setState({
                    ifOnline: false,
                    isVerify: false,
                    isDone: true,
                    flagColorVerify: true,
                    flagColorDone: true,
                })
                setTimeout(() => {
                    this.props.navigation.replace('mpinAndPasswordCreation', {
                        OTP: this.state.OTP,
                        MobileNo: this.state.MobileNo,
                        USERID: this.state.USERID
                    });

                }, 3000);
                break;
            default:
                this.setState({
                    ifOnline: true,
                    isVerify: false,
                    isDone: false,
                    flagColorVerify: false,
                    flagColorDone: false,
                })
                break;
        }
    }

    render() {
        return (
            <ImageBackground source={this.bgImage} style={styles.FlexOne}>

                <TrasnperantFixedHeader
                    backAction={() => this.onBackAction()}
                    color={this.props.textColor}
                    title={this.state.ifOnline ? strings.onlineForm : this.state.isVerify ? strings.formVerify : strings.formDone}
                />

                <View style={[styles.capsuleNavigationContainer]}>

                    <View style={styles.CapsuleNavigationViewStyle}>

                        <View style={styles.FlexOne}>

                            <View style={[styles.capsuleNavigation]}>

                                <View
                                    style={styles.CapsuleNavigationSubViewStyle}>

                                    <View style={styles.IconViewStyle}>

                                        <Form height={15} width={15} />

                                    </View>
                                    <Text style={styles.capsuleNavigationText} >

                                        {strings.fillForm}

                                    </Text>

                                </View>

                            </View>

                        </View>

                        <View style={styles.MarginLeftEight}>

                            <Text style={[styles.ArrowStyle, {
                                color: this.state.flagColorVerify ? 'white' : '#ffffff66',
                            }]}>{'>'} </Text>

                        </View>
                    </View>

                    {/* step2 */}
                    <View style={styles.CapsuleNavigationViewStyle}>

                        <View style={styles.FlexOne}>
                            <View style={[styles.capsuleNavigation]}>

                                <View
                                    style={styles.ViewStyleThree} >

                                    <View
                                        style={[styles.IconViewStyleTwo, {
                                            backgroundColor: this.state.flagColorVerify ? '#ffffff' : 'transperent',
                                            borderColor: this.state.flagColorVerify ? 'transperent' : '#ffffff66',
                                        }]}>

                                        <Verify height={15} width={15} color={this.state.flagColorVerify ? this.props.textColor : '#ffffff66'} />
                                    </View>
                                    <Text
                                        style={[
                                            styles.capsuleNavigationText,
                                            {
                                                color: this.state.flagColorVerify ? 'white' : '#ffffff66',
                                            },
                                        ]}
                                    >
                                        {strings.formVerify}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.MarginLeftEight}>

                            <Text style={[styles.ArrowStyle, {
                                color: this.state.flagColorVerify ? 'white' : '#ffffff66',
                            }]}>{'>'} </Text>
                        </View>

                    </View>

                    {/* step3 */}
                    <View style={styles.FlexOne}>

                        <View style={[styles.capsuleNavigation]}>
                            <View
                                style={styles.ViewStyleThree}
                            >
                                <View
                                    style={[styles.IconViewStyleTwo, {
                                        backgroundColor: this.state.flagColorDone ? '#ffffff' : 'transperent',
                                        borderColor: this.state.flagColorDone ? 'transperent' : '#ffffff66',
                                    }]}
                                >
                                    <Done height={15} width={15} color={this.state.flagColorDone ? this.props.textColor : '#ffffff66'} />
                                </View>
                                <Text
                                    style={[
                                        styles.capsuleNavigationText,
                                        {
                                            color:  this.state.flagColorDone ? 'white': '#ffffff66',
                                        },
                                    ]}  >
                                    {strings.formDone}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <KeyboardAvoidingView
                    style={{ flex: 1, }}
                    behavior={Platform.OS === 'ios' ? 'padding' : ''}
                    enabled={true}>

                    <View
                        style={styles.KeyboardViewStyle}>
                        {this.state.ifOnline && (
                            <OnlineRegistration
                                onSubmit={(MobileNO, USERID) => {
                                    this.checkView(2);
                                    this.state.MobileNo = MobileNO
                                    this.state.USERID = USERID
                                }} />
                        )}
                        {this.state.isVerify && (
                            <OnlineRegOTP onSubmit={(OTP) => {
                                this.checkView(3),
                                    this.state.OTP = OTP
                            }} />
                        )}
                        {this.state.isDone && (
                            <OnlineRegistrationSuccess />
                        )}
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    capsuleNavigationContainer: {
        marginBottom: 35,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginLeft: 10,
    },

    CapsuleNavigationViewStyle:
    {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },

    capsuleNavigation: {
        padding: 8,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginHorizontal: 5,
    },

    CapsuleNavigationSubViewStyle:
    {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 3,
        paddingTop: 3,
        paddingBottom: 3,
        justifyContent: 'flex-start',
    },

    capsuleNavigationText: {
        color: 'white',
        marginLeft: 7,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: strings.fontRegular
    },
    FlexOne:
        { flex: 1 },

    IconViewStyle:
    {
        height: 25,
        width: 25,
        borderRadius: 25 / 2,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'white'
    },
    IconViewStyleTwo:
    {
        height: 25,
        width: 25,
        borderRadius: 25 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    MarginLeftEight:
    {
        marginLeft: 8,
    },

    ArrowStyle:
    {
        fontFamily: strings.fontRegular,
        fontSize: 18
    },

    ViewStyleThree:
    {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 3,
        paddingTop: 3,
        paddingBottom: 3,
        justifyContent: 'center',
    },
    KeyboardViewStyle:
    {
        flex: 1,
        backgroundColor: 'white',
        borderTopEndRadius: 30,
        borderTopStartRadius: 30,
    },


});

export default connect(mapStateToProps, mapDispatchToProps)(OnlineFormStepHeader);
