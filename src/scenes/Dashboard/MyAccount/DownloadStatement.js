import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    SafeAreaView,
    Animated,
    Image,
    ImageBackground,
    LayoutAnimation,
    BackHandler,
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
    themeImage,
    appThemeConfiguration,
    config,
} from '../../../App';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview'
import TrasnsperantFixedHeader from '../../../components/TrasnperantFixedHeader';
import OnlineServies from '../../../assets/icons/dashboardIcons/ico-online-services.svg'
import DropDown from '../../../assets/icons/DropDown.svg'
import RightArrow from '../../../assets/icons/RightArrow.svg'
import Colors from '../../../common/Colors';

import SavingAcIcon from '../../../assets/icons/Icon_savingAc.svg'
import LoanImg from '../../../assets/icons/AccLoan.svg'
import DepositImg from '../../../assets/icons/AccDeposit.svg'
import CurrentImg from '../../../assets/icons/AccCurrent.svg'
import SmallSavImg from '../../../assets/icons/AccSmallSaving.svg'
import ShareImage from '../../../assets/icons/Accshare.svg'


class DownloadStatement extends Component {
    constructor(props) {
        super(props);

        console.log("props are======", props.route.params)

        this.state = {
            mpin: '',
            confirmMpin: '',
            isSubmit: false,
            savingsExpanded: false,
            LoanExpanded: false,
            depositExpanded: false,
            currentExpanded: false,
            smallsavingExpanded: false,
            shareAcExpanded: false,
            showView: false,
        };



        this.accDetails = props.route.params

        this.SavingAccList = []

        this.LoanAccList = []

        this.DepositAccList = []

        this.CurrentAccList = []

        this.SmallSavingAccList = []

        this.ShareAccountList = []

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    }

    componentDidMount() {


        this.accDetails.forEach(element => {
            console.log("AccountList  ", element.ACTYPE)

            if (element.ACTYPE === 'SAVING ACCOUNT') {
                this.SavingAccList.push(element)
            }

            if (element.ACTYPE === 'LOAN ACCOUNT') {
                this.LoanAccList.push(element)
            }

            if (element.ACTYPE === 'FIXED DEPOSIT ACCOUNT') {
                this.DepositAccList.push(element)
            }

            if (element.ACTYPE === 'CURRENT ACCOUNT') {
                this.CurrentAccList.push(element)
            }

            if (element.ACTYPE === 'SMALL SAVING ACCOUNT') {
                this.SmallSavingAccList.push(element)
            }

            if (element.ACTYPE === 'SHARE ACCOUNT') {
                this.ShareAccountList.push(element)
            }
        });

        setTimeout(() => {
            this.setState({ showView: true }); // After 2 seconds, set showView to true
        }, 10);

    }

    changeLayout() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        navigation.goBack(this)
        return true;
    }

    onBackAction() {
        navigation.goBack(this)
    }





    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg3

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground style={{ flex: 1 }}
                    source={this.bgImage}
                    resizeMode='cover'
                >
                    <View style={{ flex: 0.25, justifyContent: 'flex-start' }}>
                        <TrasnsperantFixedHeader
                            backAction={() => this.onBackAction()}
                        />
                        <Text
                            style={{
                                marginLeft: 15,
                                color: 'white',
                                fontSize: 24,
                                fontFamily: strings.fontBold
                            }}
                        >{strings.downloadStatemant}</Text>
                        <Text
                            style={{
                                marginLeft: 15,
                                color: 'white',
                                fontSize: 15,
                                fontFamily: strings.fontRegular
                            }}
                        >{strings.downloadSubStr}</Text>

                    </View>
                    <View style={{
                        flex: 0.75,
                        // alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fbfcfc',
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        flexDirection: 'column'
                    }}>

                        {this.state.showView &&

                            <View style={{ flex: 1, marginTop: 20 }}>
                                <ScrollView
                                    style={{
                                        flex: 1,

                                    }}
                                    contentContainerStyle={{
                                        alignItems: 'center',
                                        paddingBottom: 40,
                                    }}

                                >



                                    {/* Savings Account */}

                                    {this.SavingAccList.length > 0 &&
                                        <CardView
                                            cardElevation={2}
                                            cardMaxElevation={3}
                                            cornerRadius={12}
                                            style={styles.CardStyle}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.changeLayout();
                                                    this.setState({ savingsExpanded: !this.state.savingsExpanded });
                                                }}>
                                                <View
                                                    style={styles.Touchablestyle}
                                                >
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                                        <View style={{

                                                            marginRight: 10,
                                                            alignItems: 'center',
                                                            backgroundColor: 'white'
                                                        }}>
                                                            <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                                <SavingAcIcon height={18} width={22} fill={this.props.SecondaryColor} />
                                                            </View>
                                                        </View>
                                                        <Text style={styles.MainTextStyle}>
                                                            {strings.myAccSaving}
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            justifyContent: 'flex-end',
                                                            transform: [
                                                                { rotate: this.state.savingsExpanded ? '0deg' : '-90deg' },
                                                            ],
                                                        }}>
                                                        <DropDown width={15} height={15} />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </CardView>
                                    }

                                    <View
                                        style={
                                            {
                                                zIndex: -1,
                                                marginTop: -15,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: width - 40,
                                                height: this.state.savingsExpanded ? null : 0,
                                                padding: this.state.savingsExpanded ? 15 : 0,
                                                overflow: 'hidden',
                                                marginHorizontal: 15,
                                                marginBottom: 8,
                                                backgroundColor: colors.white,
                                                borderColor: 'rgba(0,0,0,0.1)',
                                                borderLeftWidth: this.state.savingsExpanded ? 1 : 0,
                                                borderBottomWidth: this.state.savingsExpanded ? 1 : 0,
                                                borderRightWidth: this.state.savingsExpanded ? 1 : 0,
                                                borderBottomEndRadius: 12,
                                                borderBottomStartRadius: 12,
                                            }}>
                                        {this.SavingAccList.map((object, i) => {
                                            return (
                                                <TouchableOpacity
                                                    key={i}
                                                    style={
                                                        {
                                                            marginTop: 12,
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            marginHorizontal: 15,
                                                            alignItems: 'center',
                                                            width: width - 60,
                                                            paddingTop: 5,
                                                            paddingBottom: 5,
                                                            paddingLeft: 5,
                                                            paddingRight: 15,
                                                            borderWidth: 0.4,
                                                            borderRadius: 10,
                                                            borderColor: '#cdcdce'
                                                        }
                                                    }

                                                    onPress={() => navigation.navigate(this, 'myAccountDownloadStatement', this.SavingAccList[i])}

                                                >
                                                    <View style={{
                                                        marginLeft: 10,
                                                        flexDirection: 'column',
                                                        paddingTop: 10,
                                                        paddingBottom: 10,
                                                    }} >

                                                        <Text style={{
                                                            fontSize: 12,
                                                            includeFontPadding: false,
                                                            color: this.props.textColor,
                                                        }}>
                                                            {strings.myAccno} {object.AC_NO}
                                                        </Text>
                                                        <Text style={{
                                                            fontSize: 15,
                                                            color: object.BALANCE.startsWith('-') ? Colors.Green : Colors.Red,
                                                            fontFamily: strings.fontMedium
                                                        }}>
                                                            {/* {"₹" + object.BALANCE} */}
                                                            {object.BALANCE.startsWith('-') ? ("₹ " + object.BALANCE.replace('-', '') + " Cr") : ("₹ " + object.BALANCE + " Dr")}
                                                        </Text>
                                                    </View>


                                                    <View
                                                        style={{
                                                            // backgroundColor: 'red',
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <RightArrow height={15} width={15} color={this.props.themeColor} />
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })
                                        }
                                    </View>

                                    {/* Loan Account */}

                                    {this.LoanAccList.length > 0 &&
                                        <CardView
                                            cardElevation={2}
                                            cardMaxElevation={3}
                                            cornerRadius={12}
                                            style={styles.CardStyle}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.changeLayout();
                                                    this.setState({ LoanExpanded: !this.state.LoanExpanded });
                                                }}>
                                                <View
                                                    style={styles.Touchablestyle}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                                        <View style={{

                                                            marginRight: 10,
                                                            alignItems: 'center',
                                                            backgroundColor: 'white'
                                                        }}>
                                                            <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                                <LoanImg height={18} width={22} fill={this.props.SecondaryColor} />
                                                            </View>
                                                        </View>
                                                        <Text style={styles.MainTextStyle}>
                                                        {strings.myLoanAccount}
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            justifyContent: 'flex-end',
                                                            transform: [
                                                                { rotate: this.state.LoanExpanded ? '0deg' : '-90deg' },
                                                            ],
                                                        }}>
                                                        <DropDown width={15} height={15} />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </CardView>
                                    }


                                    <View
                                        style={
                                            {
                                                zIndex: -1,
                                                marginTop: -15,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: width - 40,
                                                height: this.state.LoanExpanded ? null : 0,
                                                padding: this.state.LoanExpanded ? 15 : 0,
                                                overflow: 'hidden',
                                                marginHorizontal: 15,
                                                marginBottom: 8,
                                                backgroundColor: colors.white,
                                                borderColor: 'rgba(0,0,0,0.1)',
                                                borderLeftWidth: this.state.LoanExpanded ? 1 : 0,
                                                borderBottomWidth: this.state.LoanExpanded ? 1 : 0,
                                                borderRightWidth: this.state.LoanExpanded ? 1 : 0,
                                                borderBottomEndRadius: 12,
                                                borderBottomStartRadius: 12,
                                            }}>
                                        {this.LoanAccList.map((object, i) => {
                                            return (
                                                <TouchableOpacity
                                                    key={i}
                                                    style={
                                                        {
                                                            marginTop: 12,
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            marginHorizontal: 15,
                                                            alignItems: 'center',
                                                            width: width - 60,
                                                            paddingTop: 5,
                                                            paddingBottom: 5,
                                                            paddingLeft: 5,
                                                            paddingRight: 15,
                                                            borderWidth: 0.4,
                                                            borderRadius: 10,
                                                            borderColor: '#cdcdce'
                                                        }
                                                    }

                                                    onPress={() => navigation.navigate(this, 'myAccountDownloadStatement', this.LoanAccList[i])}


                                                >
                                                    <View style={{
                                                        marginLeft: 10,
                                                        flexDirection: 'column',
                                                        paddingTop: 10,
                                                        paddingBottom: 10,
                                                    }} >

                                                        <Text style={{
                                                            fontSize: 12,
                                                            includeFontPadding: false,
                                                            color: this.props.textColor,

                                                        }}>
                                                            {strings.myAccno} {object.AC_NO}
                                                        </Text>
                                                        <Text style={{
                                                            fontSize: 15,
                                                            color: object.BALANCE.startsWith('-') ? Colors.Green : Colors.Red,
                                                            fontFamily: strings.fontMedium

                                                        }}>
                                                            {object.BALANCE.startsWith('-') ? ("₹ " + object.BALANCE.replace('-', '') + " Cr") : ("₹ " + object.BALANCE + " Dr")}

                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <RightArrow height={15} width={15} color={this.props.themeColor} />

                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })
                                        }
                                    </View>



                                    {/* Deposit Account */}
                                    {this.DepositAccList.length > 0 &&
                                        <CardView
                                            cardElevation={2}
                                            cardMaxElevation={3}
                                            cornerRadius={12}
                                            style={styles.CardStyle}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.changeLayout();
                                                    this.setState({ depositExpanded: !this.state.depositExpanded });
                                                }}>
                                                <View
                                                    style={styles.Touchablestyle}>

                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                                        <View style={{
                                                            marginRight: 10,
                                                            alignItems: 'center',
                                                            backgroundColor: 'white'
                                                        }}>
                                                            <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                                <DepositImg height={18} width={22} fill={this.props.SecondaryColor} />
                                                            </View>
                                                        </View>

                                                        <Text style={styles.MainTextStyle}>

                                                            {strings.myAccDeposit}
                                                        </Text>
                                                    </View>


                                                    <View
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            justifyContent: 'flex-end',
                                                            transform: [
                                                                { rotate: this.state.depositExpanded ? '0deg' : '-90deg' },
                                                            ],
                                                        }}>
                                                        <DropDown width={15} height={15} />
                                                    </View>


                                                </View>
                                            </TouchableOpacity>
                                        </CardView>

                                    }

                                    <View
                                        style={
                                            {
                                                zIndex: -1,
                                                marginTop: -15,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: width - 40,
                                                height: this.state.depositExpanded ? null : 0,
                                                padding: this.state.depositExpanded ? 15 : 0,
                                                overflow: 'hidden',
                                                marginHorizontal: 15,
                                                marginBottom: 8,
                                                backgroundColor: colors.white,
                                                borderColor: 'rgba(0,0,0,0.1)',
                                                borderLeftWidth: this.state.depositExpanded ? 1 : 0,
                                                borderBottomWidth: this.state.depositExpanded ? 1 : 0,
                                                borderRightWidth: this.state.depositExpanded ? 1 : 0,
                                                borderBottomEndRadius: 12,
                                                borderBottomStartRadius: 12,
                                            }}>
                                        {this.DepositAccList.map((object, i) => {
                                            return (
                                                <TouchableOpacity
                                                    key={i}
                                                    style={
                                                        {
                                                            marginTop: 12,
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            marginHorizontal: 15,
                                                            alignItems: 'center',
                                                            width: width - 60,
                                                            paddingTop: 5,
                                                            paddingBottom: 5,
                                                            paddingLeft: 5,
                                                            paddingRight: 15,
                                                            borderWidth: 0.4,
                                                            borderRadius: 10,
                                                            borderColor: '#cdcdce'
                                                        }
                                                    }
                                                    onPress={() => navigation.navigate(this, 'myAccountDownloadStatement', this.DepositAccList[i])}



                                                >
                                                    <View style={{
                                                        marginLeft: 10,
                                                        flexDirection: 'column',
                                                        paddingTop: 10,
                                                        paddingBottom: 10,
                                                    }} >

                                                        <Text style={{
                                                            fontSize: 12,
                                                            includeFontPadding: false,
                                                            // alignSelf: 'flex-start',
                                                            color: this.props.textColor,
                                                            // backgroundColor : 'red'
                                                        }}>
                                                            {strings.myAccno} {object.AC_NO}
                                                        </Text>
                                                        <Text style={{
                                                            fontSize: 15,
                                                            // includeFontPadding: false,
                                                            // alignSelf: 'flex-start',
                                                            color: object.BALANCE.startsWith('-') ? Colors.Green : Colors.Red,
                                                            fontFamily: strings.fontMedium
                                                            // backgroundColor : 'red'
                                                        }}>
                                                            {object.BALANCE.startsWith('-') ? ("₹ " + object.BALANCE.replace('-', '') + " Cr") : ("₹ " + object.BALANCE + " Dr")}

                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            // backgroundColor: 'red',
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <RightArrow height={15} width={15} color={this.props.themeColor} />
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })
                                        }
                                    </View>


                                    {/* Current Account */}

                                    {this.CurrentAccList.length > 0 &&
                                        <CardView
                                            cardElevation={2}
                                            cardMaxElevation={3}
                                            cornerRadius={12}
                                            style={styles.CardStyle}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.changeLayout();
                                                    this.setState({ currentExpanded: !this.state.currentExpanded });
                                                }}>
                                                <View
                                                    style={styles.Touchablestyle}>

                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                                        <View style={{
                                                            marginRight: 10,
                                                            alignItems: 'center',
                                                            backgroundColor: 'white'
                                                        }}>
                                                            <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                                <CurrentImg height={18} width={22} fill={this.props.SecondaryColor} />
                                                            </View>
                                                        </View>

                                                        <Text style={styles.MainTextStyle}>
                                                        {strings.myAccCurrentAccount}
                                                        </Text>
                                                    </View>


                                                    <View
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            justifyContent: 'flex-end',
                                                            transform: [
                                                                { rotate: this.state.currentExpanded ? '0deg' : '-90deg' },
                                                            ],
                                                        }}>
                                                        <DropDown width={15} height={15} />
                                                    </View>


                                                </View>
                                            </TouchableOpacity>
                                        </CardView>

                                    }

                                    <View
                                        style={
                                            {
                                                zIndex: -1,
                                                marginTop: -15,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: width - 40,
                                                height: this.state.currentExpanded ? null : 0,
                                                padding: this.state.currentExpanded ? 15 : 0,
                                                overflow: 'hidden',
                                                marginHorizontal: 15,
                                                marginBottom: 8,
                                                backgroundColor: colors.white,
                                                borderColor: 'rgba(0,0,0,0.1)',
                                                borderLeftWidth: this.state.currentExpanded ? 1 : 0,
                                                borderBottomWidth: this.state.currentExpanded ? 1 : 0,
                                                borderRightWidth: this.state.currentExpanded ? 1 : 0,
                                                borderBottomEndRadius: 12,
                                                borderBottomStartRadius: 12,
                                            }}>
                                        {this.CurrentAccList.map((object, i) => {
                                            return (
                                                <TouchableOpacity
                                                    key={i}
                                                    style={
                                                        {
                                                            marginTop: 12,
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            marginHorizontal: 15,
                                                            alignItems: 'center',
                                                            width: width - 60,
                                                            paddingTop: 5,
                                                            paddingBottom: 5,
                                                            paddingLeft: 5,
                                                            paddingRight: 15,
                                                            borderWidth: 0.4,
                                                            borderRadius: 10,
                                                            borderColor: '#cdcdce'
                                                        }
                                                    }
                                                    onPress={() => navigation.navigate(this, 'myAccountDownloadStatement', this.CurrentAccList[i])}



                                                >
                                                    <View style={{
                                                        marginLeft: 10,
                                                        flexDirection: 'column',
                                                        paddingTop: 10,
                                                        paddingBottom: 10,
                                                    }} >

                                                        <Text style={{
                                                            fontSize: 12,
                                                            includeFontPadding: false,
                                                            // alignSelf: 'flex-start',
                                                            color: this.props.textColor,
                                                            // backgroundColor : 'red'
                                                        }}>
                                                            {strings.myAccno} {object.AC_NO}
                                                        </Text>
                                                        <Text style={{
                                                            fontSize: 15,
                                                            color: object.BALANCE.startsWith('-') ? Colors.Green : Colors.Red,
                                                            fontFamily: strings.fontMedium
                                                        }}>
                                                            {object.BALANCE.startsWith('-') ? ("₹ " + object.BALANCE.replace('-', '') + " Cr") : ("₹ " + object.BALANCE + " Dr")}

                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <RightArrow height={15} width={15} color={this.props.themeColor} />
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })
                                        }
                                    </View>


                                    {/* Small Saving Account */}

                                    {this.SmallSavingAccList.length > 0 &&
                                        <CardView
                                            cardElevation={2}
                                            cardMaxElevation={3}
                                            cornerRadius={12}
                                            style={styles.CardStyle}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.changeLayout();
                                                    this.setState({ smallsavingExpanded: !this.state.smallsavingExpanded });
                                                }}>
                                                <View
                                                    style={styles.Touchablestyle}>

                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                                        <View style={{
                                                            marginRight: 10,
                                                            alignItems: 'center',
                                                            backgroundColor: 'white'
                                                        }}>
                                                            <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                                <SmallSavImg height={18} width={22} fill={this.props.SecondaryColor} />
                                                            </View>
                                                        </View>

                                                        <Text style={styles.MainTextStyle}>
                                                        {strings.mySmallSavingAccount}
                                                        </Text>
                                                    </View>


                                                    <View
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            justifyContent: 'flex-end',
                                                            transform: [
                                                                { rotate: this.state.smallsavingExpanded ? '0deg' : '-90deg' },
                                                            ],
                                                        }}>
                                                        <DropDown width={15} height={15} />
                                                    </View>


                                                </View>
                                            </TouchableOpacity>
                                        </CardView>
                                    }

                                    <View
                                        style={
                                            {
                                                zIndex: -1,
                                                marginTop: -15,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: width - 40,
                                                height: this.state.smallsavingExpanded ? null : 0,
                                                padding: this.state.smallsavingExpanded ? 15 : 0,
                                                overflow: 'hidden',
                                                marginHorizontal: 15,
                                                marginBottom: 8,
                                                backgroundColor: colors.white,
                                                borderColor: 'rgba(0,0,0,0.1)',
                                                borderLeftWidth: this.state.smallsavingExpanded ? 1 : 0,
                                                borderBottomWidth: this.state.smallsavingExpanded ? 1 : 0,
                                                borderRightWidth: this.state.smallsavingExpanded ? 1 : 0,
                                                borderBottomEndRadius: 12,
                                                borderBottomStartRadius: 12,
                                            }}>
                                        {this.SmallSavingAccList.map((object, i) => {
                                            return (
                                                <TouchableOpacity
                                                    key={i}
                                                    style={
                                                        {
                                                            marginTop: 12,
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            marginHorizontal: 15,
                                                            alignItems: 'center',
                                                            width: width - 60,
                                                            paddingTop: 5,
                                                            paddingBottom: 5,
                                                            paddingLeft: 5,
                                                            paddingRight: 15,
                                                            borderWidth: 0.4,
                                                            borderRadius: 10,
                                                            borderColor: '#cdcdce'
                                                        }
                                                    }
                                                    onPress={() => navigation.navigate(this, 'myAccountDownloadStatement', this.SmallSavingAccList[i])}



                                                >
                                                    <View style={{
                                                        marginLeft: 10,
                                                        flexDirection: 'column',
                                                        paddingTop: 10,
                                                        paddingBottom: 10,
                                                    }} >

                                                        <Text style={{
                                                            fontSize: 12,
                                                            includeFontPadding: false,
                                                            color: this.props.textColor,
                                                        }}>
                                                            {strings.myAccno} {object.AC_NO}
                                                        </Text>
                                                        <Text style={{
                                                            fontSize: 15,
                                                            color: object.BALANCE.startsWith('-') ? Colors.Green : Colors.Red,
                                                            fontFamily: strings.fontMedium
                                                        }}>
                                                            {object.BALANCE.startsWith('-') ? ("₹ " + object.BALANCE.replace('-', '') + " Cr") : ("₹ " + object.BALANCE + " Dr")}

                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <RightArrow height={15} width={15} color={this.props.themeColor} />
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })
                                        }
                                    </View>


                                    {/* Share Account */}

                                    {this.ShareAccountList.length > 0 &&
                                        <CardView
                                            cardElevation={2}
                                            cardMaxElevation={3}
                                            cornerRadius={12}
                                            style={styles.CardStyle}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.changeLayout();
                                                    this.setState({ shareAcExpanded: !this.state.shareAcExpanded });
                                                }}>
                                                <View
                                                    style={styles.Touchablestyle}>

                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                                        <View style={{
                                                            marginRight: 10,
                                                            alignItems: 'center',
                                                            backgroundColor: 'white'
                                                        }}>
                                                            <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                                <ShareImage height={18} width={22} color={this.props.SecondaryColor} />
                                                            </View>
                                                        </View>

                                                        <Text style={styles.MainTextStyle}>
                                                        {strings.myAccShareAcc}
                                                        </Text>
                                                    </View>


                                                    <View
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            justifyContent: 'flex-end',
                                                            transform: [
                                                                { rotate: this.state.shareAcExpanded ? '0deg' : '-90deg' },
                                                            ],
                                                        }}>
                                                        <DropDown width={15} height={15} />
                                                    </View>


                                                </View>
                                            </TouchableOpacity>
                                        </CardView>
                                    }

                                    <View
                                        style={
                                            {
                                                zIndex: -1,
                                                marginTop: -15,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: width - 40,
                                                height: this.state.shareAcExpanded ? null : 0,
                                                padding: this.state.shareAcExpanded ? 15 : 0,
                                                overflow: 'hidden',
                                                marginHorizontal: 15,
                                                marginBottom: 8,
                                                backgroundColor: colors.white,
                                                borderColor: 'rgba(0,0,0,0.1)',
                                                borderLeftWidth: this.state.shareAcExpanded ? 1 : 0,
                                                borderBottomWidth: this.state.shareAcExpanded ? 1 : 0,
                                                borderRightWidth: this.state.shareAcExpanded ? 1 : 0,
                                                borderBottomEndRadius: 12,
                                                borderBottomStartRadius: 12,
                                            }}>
                                        {this.ShareAccountList.map((object, i) => {
                                            return (
                                                <TouchableOpacity
                                                    key={i}
                                                    style={
                                                        {
                                                            marginTop: 12,
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            marginHorizontal: 15,
                                                            alignItems: 'center',
                                                            width: width - 60,
                                                            paddingTop: 5,
                                                            paddingBottom: 5,
                                                            paddingLeft: 5,
                                                            paddingRight: 15,
                                                            borderWidth: 0.4,
                                                            borderRadius: 10,
                                                            borderColor: '#cdcdce'
                                                        }
                                                    }
                                                    onPress={() => navigation.navigate(this, 'myAccountDownloadStatement', this.ShareAccountList[i])}



                                                >
                                                    <View style={{
                                                        marginLeft: 10,
                                                        flexDirection: 'column',
                                                        paddingTop: 10,
                                                        paddingBottom: 10,
                                                    }} >

                                                        <Text style={{
                                                            fontSize: 12,
                                                            includeFontPadding: false,
                                                            color: this.props.textColor,
                                                        }}>
                                                            {strings.myAccno} {object.AC_NO}
                                                        </Text>
                                                        <Text style={{
                                                            fontSize: 15,
                                                            color: object.BALANCE.startsWith('-') ? Colors.Green : Colors.Red,
                                                            fontFamily: strings.fontMedium
                                                        }}>
                                                            {object.BALANCE.startsWith('-') ? ("₹ " + object.BALANCE.replace('-', '') + " Cr") : ("₹ " + object.BALANCE + " Dr")}

                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <RightArrow height={15} width={15} color={this.props.themeColor} />
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })
                                        }
                                    </View>




                                </ScrollView>

                            </View>

                        }

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
        marginTop: 25,
        marginBottom: 5,
        width: width - 40,
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
    MainTextStyle:
    {
        fontSize: 15,
        includeFontPadding: false,
        color: Colors.boldTextColor,
        fontFamily: strings.fontMedium
    },
    IconBgStyle:
    {
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadStatement);
