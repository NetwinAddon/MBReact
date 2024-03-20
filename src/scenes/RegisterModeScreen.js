import React, { Component } from 'react';
import {
    Text,
    View,
} from 'react-native';
import {
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    navigation,
} from '../App';
import Footer from '../assets/icons/footer.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FixedHeader from '../components/FixedHeader';
import OnlineRegister from '../assets/icons/ico-online.svg';
import OffileRegister from '../assets/icons/ico-offline.svg';
import RegisterModeImg from '../assets/images/bwink_edu_02_single_02.svg';

class RegisterModeScreen extends Component {
    constructor(props) {
        super(props);
    }

    onBackAction() {
        navigation.goBack(this)
    }

    toOnlineRegisterMode() {
        navigation.navigate(this, 'onlineFormStepHeader')
    }

    toOfflineRegisterMode() {
        navigation.navigate(this, 'offlineFormStepHeader')
    }

    render() {
        return (
            <View style={[styles.mainView, { backgroundColor: 'white' }]}>
                <FixedHeader
                    backAction={() => this.onBackAction()}
                    color={this.props.textColor} />
                <View style={styles.mainView}>
                    <View style={[styles.mainView, { alignItems: 'center', justifyContent: 'center' }]}>
                        <View style={styles.imagView}>
                            <RegisterModeImg />
                        </View>
                    </View>
                    <View
                        style={[styles.mainView, { justifyContent: 'space-between' }]}>
                        <Text style={[styles.selectRegModeText, { color: this.props.PrimaryColor, }]}>{strings.strSelectRegisterMode}
                        </Text>
                        <View
                            style={[styles.mainView, { marginBottom: 20 }]}>
                            <TouchableOpacity style={styles.registerModeTouchable}
                                onPress={() => this.toOnlineRegisterMode()}>
                                <View
                                    style={[styles.mainView, { marginLeft: 10, justifyContent: 'center' }]}>
                                    <Text style={[styles.onlineText, { color: this.props.PrimaryColor, }]}>{strings.strOnline}
                                    </Text>
                                    <Text style={[styles.directReg, { color: this.props.textColor, }]}>{strings.strDirectRegistration}
                                    </Text>
                                </View>
                                <View>
                                    <OnlineRegister color={this.props.SecondaryColor} height={48} width={48} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.offlineTouchable}
                                onPress={() => { this.toOfflineRegisterMode() }}>
                                <View style={[styles.mainView, { marginLeft: 10, justifyContent: 'center' }]}>
                                    <Text style={[styles.onlineText, { color: this.props.PrimaryColor, }]}>{strings.strOffline}</Text>
                                    <Text style={[styles.directReg, { color: this.props.textColor, }]}>{strings.strBranchVisitRegistration}</Text>
                                </View>
                                <View>
                                    <OffileRegister color={this.props.SecondaryColor} height={48} width={48} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.footerConatiner}>
                        <View style={styles.footerInnerContainer}>
                            <Footer height={70} width={300} />
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = {
    mainView:
    {
        flex: 1,
        backgroundColor: 'white'
    },
    imagView:
    {
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectRegModeText:
    {
        fontSize: 25,
        textAlign: 'left',
        marginLeft: 10,
        padding: 20,
        fontFamily: strings.fontBold,
    },
    registerModeTouchable:
    {
        marginLeft: 25,
        marginRight: 25,
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#F3F8FF",
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    onlineText:
    {
        fontSize: 18,
        textAlign: 'left',
        fontFamily: strings.fontBold,
    },
    directReg:
    {
        marginTop: 10,
        fontSize: 12,
        color: 'black',
        textAlign: 'left',
        fontFamily: strings.fontRegular,

    },
    offlineTouchable:
    {
        marginLeft: 25,
        marginRight: 25,
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#F3F8FF",
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerConatiner:
    {
        alignItems: 'center',
    },
    footerInnerContainer:
    {
        justifyContent: 'flex-end'
    },
};
export default connect(mapStateToProps, mapDispatchToProps)(RegisterModeScreen);
