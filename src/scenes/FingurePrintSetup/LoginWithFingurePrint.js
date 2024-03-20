import React, { Component } from 'react';
import {
    Text,
    View,
} from 'react-native';
import {
    colors,
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    navigation,
} from '../../App';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FixedHeader from '../../components/FixedHeader';
import Fingerprint from '../../assets/icons/Ico-fingerPrint.svg'
import FaceIdImg from '../../assets/icons/ic_faceId.svg'
import Iicon from '../../assets/icons/I-icon.svg';
import { RFValue } from "react-native-responsive-fontsize";


class LoginWithFingurePrint extends Component {
    
    constructor(props) {
        super(props);

        let BiomatricIcon;
        let Biomatric_Text;
        if (Platform.OS === 'ios') {
            BiomatricIcon = ( <FaceIdImg color={this.props.SecondaryColor } height={70} width={70} />)
            Biomatric_Text = 'Face ID'
        }
        else {
            BiomatricIcon = ( <Fingerprint color={this.props.SecondaryColor} height={70} width={70} />)
            Biomatric_Text = 'Fingerprint'
        }

       
        this.state = {

            Biomatric_Text: Biomatric_Text,
            BiomatricIcon : BiomatricIcon,
        };
    }
 
    BulletPoint = ({ text }) => {
        return (
            <View style={styles.bulletPointView}>
                <Text style={styles.bulletPointText}>&bull;</Text>
                <Text style={styles.bulletPointTextValue}>{text}</Text>
            </View>
        );
    };

    onBackAction() {
        navigation.goBack(this)
    }

    toLoginPage() {
        navigation.navigate(this, 'loginTypeSelectScreen')
    }

    render() {
        return (
            <View style={styles.mainView}>
                <FixedHeader backAction={() => this.onBackAction()} color={colors.btnColor} />
                <View style={styles.headerView}>
                    <View style={styles.fingerprintView}>
                        <View style={styles.fingerprintSubView}>
                           {this.state.BiomatricIcon}
                        </View>
                        <Text style={styles.enableFingureprintText}>{'Steps for Enabling \n'+this.state.Biomatric_Text+' Login'}</Text>
                    </View>
                    <View style={styles.bulletView}>
                        <this.BulletPoint text="Log in to your mobile banking account using your MPIN, or username and password." />
                        <this.BulletPoint text="Click on the profile photo located at the top right/left corner of the screen." />
                        <this.BulletPoint text='Select "Set or Change Passwords"' />
                        <this.BulletPoint text={'Choose the fourth option to enable the '+this.state.Biomatric_Text+' login option.'} />
                        <this.BulletPoint text={'Click on the first option to activate the '+this.state.Biomatric_Text+' login.'} />
                        <this.BulletPoint text={'Place your '+this.state.Biomatric_Text+' on the '+this.state.Biomatric_Text+' sensor.'} />
                        <this.BulletPoint text="You will receive an OTP for confirmation. Enter the OTP and transaction PIN to confirm." />
                        <this.BulletPoint text={'Once you enabled '+this.state.Biomatric_Text+' login, you will be logged out and need to log in again to continue using the mobile banking app'} />
                    </View>
                    <TouchableOpacity style={styles.loginTouchable}
                        onPress={() => {
                            this.toLoginPage()
                        }}
                    ><Text style={styles.goToLoginPage}>Go To Login Page</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.termsAndConditionTouchable}>
                        <Iicon height={15} width={15} color={this.props.PrimaryColor} />
                        <Text style={[styles.termsAndConditionText, { color: this.props.textColor }]}
                        >Terms & Conditions Apply</Text>
                    </TouchableOpacity>
                </View>
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
        flex: 1,
        backgroundColor: 'white'
    },
    headerView:
    {
        flex: 1,
        alignItems: 'center',
    },
    fingerprintView:
    {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    fingerprintSubView:
    {
        justifyContent: 'flex-end',
        marginTop: 20
    },
    enableFingureprintText:
    {
        color: colors.btnColor,
        fontSize: RFValue(20),
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 15
    },
    bulletView:
    {
        flex: 1,
        flexDirection: 'column',
        width: width - 60,
        marginBottom: 20,
        justifyContent: 'center',
    },
    loginTouchable: {
        padding: 15,
        width: width - 50,
        alignItems: 'center',
        backgroundColor: colors.btnColor,
        justifyContent: 'center',
        borderRadius: 12,
    },
    goToLoginPage:
    {
        color: 'white',
        fontFamily: strings.fontBold,
        fontSize: RFValue(12)
    },
    termsAndConditionTouchable:
    {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 5,
    },
    termsAndConditionText:
    {
        marginLeft: 10,
        fontFamily: strings.fontMedium,
        fontSize: RFValue(12)
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginWithFingurePrint);
