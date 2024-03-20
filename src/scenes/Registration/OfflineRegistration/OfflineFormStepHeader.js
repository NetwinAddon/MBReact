import React, { Component } from 'react';
import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Form from '../../../assets/icons/formIcons/ico-fill-from.svg';
import Verify from '../../../assets/icons/formIcons/ico-verify.svg';
import TrasnperantFixedHeader from '../../../components/TrasnperantFixedHeader';
import Done from '../../../assets/icons/formIcons/checkIcon.svg';
import OfflineRegistration from './OfflineRegistration';

import {
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    navigation,
    appThemeConfiguration,
} from '../../../App';
import OfflineRegistrationSuccess from './OfflineRegistrationSuccess';
import OfflineOtpScreen from './OfflineOtpScreen';

class OfflineFormStepHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ifOffline: true,
            isVerify: false,
            isDone: false,
            flagColorVerify: false,
            flagColorDone: false,
            UserId: '',
            RefId: '',
            MobNo: '',
            Loginpin: '',
            TranPin: '',
            SuccessStatus: true,
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
                    ifOffline: true,
                    isVerify: false,
                    isDone: false,
                    flagColorVerify: false,
                    flagColorDone: false,
                })
                break;
            case 2:
                this.setState({
                    ifOffline: false,
                    isVerify: true,
                    isDone: false,
                    flagColorVerify: true,
                    flagColorDone: false,
                })
                break;
            case 3:
                this.setState({
                    ifOffline: false,
                    isVerify: false,
                    isDone: true,
                    flagColorVerify: true,
                    flagColorDone: true,
                })
                setTimeout(() => {
                    this.props.navigation.replace("existingUserLogin")

                }, 2000);

                break;


            default:
                this.setState({
                    ifOffline: true,
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
                    title={this.state.ifOffline ?
                        strings.offlineForm : this.state.isVerify
                            ? strings.formVerify : strings.formDone}
                />

                <View style={[styles.capsuleNavigationContainer]}>
                    {/* step1 */}
                    <View style={styles.ViewStyle}>
                        <View style={styles.FlexOne}>
                            <View style={[styles.capsuleNavigation]}>
                                <View style={styles.CapsuleViewStyle}>
                                    <View
                                        style={styles.capsuleViewSubStyle} >

                                        <Form height={15} width={15} />
                                    </View>

                                    <Text
                                        style={styles.capsuleNavigationText}>

                                        {strings.fillForm}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.MarginEight}>
                            <Text style={[styles.ArrowStyle, {
                                color: this.state.flagColorVerify ? 'white' : '#ffffff66',
                            }]}>
                                {'>'} </Text>
                        </View>
                    </View>

                    {/* step2 */}
                    <View style={styles.ViewStyle}>
                        <View style={{ flex: 1 }}>
                            <View style={[styles.capsuleNavigation]}>
                                <View
                                    style={styles.CapsuleViewStyleTwo}>
                                    <View
                                        style={[styles.capsuleViewSubStyleTwo,{
                                            backgroundColor: this.state.flagColorVerify ? '#ffffff' : 'transperent',
                                            borderColor: this.state.flagColorVerify ? 'transperent' : '#ffffff66',
                                        }]}
                                    >
                                        <Verify height={15} width={15} color={this.state.flagColorVerify ? this.props.textColor : '#ffffff66'} />
                                    </View>
                                    <Text
                                        style={[
                                            styles.capsuleNavigationText,
                                            {
                                                color:  this.state.flagColorVerify ? 'white' : '#ffffff66',
                                            },
                                        ]} >

                                        {strings.formVerify}

                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.MarginEight}>
                            <Text style={[styles.ArrowStyle,{
                                color: this.state.flagColorDone ? 'white' : '#ffffff66',
                            }]}>{'>'} </Text>
                        </View>
                    </View>

                    {/* step3 */}
                    <View style={styles.FlexOne}>

                        <View style={[styles.capsuleNavigation]}>
                            <View
                                style={styles.CapsuleViewStyleTwo}>
                                <View
                                    style={[styles.capsuleViewSubStyleTwo,{
                                        backgroundColor: this.state.flagColorDone ? '#ffffff' : 'transperent',
                                        borderColor: this.state.flagColorDone ? 'transperent' : '#ffffff66',
                                    }]}>

                                    <Done height={15} width={15} color={this.state.flagColorDone ? this.props.textColor : '#ffffff66'} />
                                </View>

                                <Text
                                    style={[
                                        styles.capsuleNavigationText,
                                        {
                                            color: this.state.flagColorDone  ? 'white' : '#ffffff66',
                                        },
                                    ]}
                                >
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
                        style={styles.KevBoardViewStyle}>

                        {this.state.ifOffline && (
                            <OfflineRegistration
                                onSubmit={(RefId, UserId, MobNo, Lpin, TPin) => {
                                    this.state.RefId = RefId,
                                        this.state.UserId = UserId,
                                        this.state.MobNo = MobNo,
                                        this.state.Loginpin = Lpin,
                                        this.state.TranPin = TPin,
                                        this.checkView(2);
                                }}
                            />
                        )}
                        {this.state.isVerify && (

                            <OfflineOtpScreen onSubmit={(value) => { 
                                
                                if(value === 'FAILED')
                                {
                                    this.setState({ SuccessStatus : false})
                                }

                                this.checkView(3);
                            
                            }}

                                RefId={this.state.RefId}
                                UserId={this.state.UserId}
                                MobNo={this.state.MobNo}
                                Loginpin={this.state.Loginpin}
                                TranPin={this.state.TranPin}

                            />

                           
                        )}
                        {this.state.isDone && (
                            <OfflineRegistrationSuccess status={this.state.SuccessStatus} />
                        )}

                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    capsuleNavigationContainer: {
        flex: 0.1,
        marginBottom: 35,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginLeft: 10,
    },

    capsuleNavigation: {
        padding: 8,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginHorizontal: 5,
    },

    CapsuleViewStyle:
    {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 3,
        paddingTop: 3,
        paddingBottom: 3,
        justifyContent: 'flex-start',
    },

    CapsuleViewStyleTwo:
    {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 3,
        paddingTop: 3,
        paddingBottom: 3,
        justifyContent: 'center',
    },

    capsuleViewSubStyle:
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

    capsuleViewSubStyleTwo:
    {
        height: 25,
        width: 25,
        borderRadius: 25 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },


    capsuleNavigationText: {
        color: 'white',
        marginLeft: 7,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: strings.fontRegular
    },

    ViewStyle:
    {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },

    FlexOne:
    {
        flex: 1
    },

    MarginEight:
    {
        marginLeft: 8
    },

    ArrowStyle:
    {
        fontFamily: strings.fontRegular,
        fontSize: 18
    },

    KevBoardViewStyle:
    {
        flex: 1,
        backgroundColor: 'white',
        borderTopEndRadius: 30,
        borderTopStartRadius: 30,
    },

});

export default connect(mapStateToProps, mapDispatchToProps)(OfflineFormStepHeader);
