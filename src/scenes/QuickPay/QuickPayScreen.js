import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    BackHandler,
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
} from '../../App';
import QuickTransfer from '../../assets/icons/dashboardIcons/ico-24x7-quick-transfer.svg';
import FundTransferToOwnAcc from '../../assets/icons/fundTransferToOwnAcc.svg'
import Footer from '../../assets/icons/footer.svg';
import CardView from 'react-native-cardview'
import TrasnsperantFixedHeader from '../../components/TrasnperantFixedHeader';
import Upi from '../../assets/icons/dashboardIcons/ico-upi.svg'

class QuickPayScreen extends Component {
    constructor(props) {
        super(props);
        this.AccountList = []
        this.TempAcc = []
        this.SavingAccountList = []
        this.RemainingAccountList = []
        this.state = {
            accounList: props.route.params.accList,
        };
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    componentDidMount() {
        let userAccArray = this.state.accounList;
        console.log('userAccArray: '+JSON.stringify(userAccArray))
        if (userAccArray.length > 0) {
            userAccArray.map((item) => {
                this.TempAcc.push(item)
            })
            this.TempAcc.forEach(element => {
                if (element.ACTYPE === 'SAVING ACCOUNT') {
                    this.SavingAccountList.push(element)  // 3- sort to Saving & Remaining List
                }
                else {
                    this.RemainingAccountList.push(element)
                }
            });
            if (this.SavingAccountList.length > 0 || this.RemainingAccountList.length > 0) {
                this.SavingAccountList.map((item) => {
                    this.AccountList.push(item)
                })
                this.RemainingAccountList.map((item) => {
                    this.AccountList.push(item)
                })
            }
        }

    }

    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg

    onBackAction() {
        navigation.goBack(this)
    }

    toOwnAccTransfer() {
        navigation.navigate(this, 'ownAccTransferScreen')
    }

    render() {
        return (
            <View style={styles.mainView}>
                <ImageBackground style={styles.mainView}
                    source={this.bgImage}
                    resizeMode='cover'>
                    <TrasnsperantFixedHeader
                        backAction={() => this.onBackAction()} />

                    <View style={styles.lableHeader}>
                        <View style={styles.lableHeaderView}>
                            <Text style={styles.quickPayTextStyle}>
                                {strings.strQuickPay}
                            </Text>
                            <Text style={styles.selectModeTextStyle}>
                                {strings.strSelectModeOfTranser}
                            </Text>
                        </View>
                    </View>


                    <View style={styles.cardsMainView}>
                        <View style={styles.cardsSubView}>
                            <CardView
                                cardElevation={3}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.impsCard}>
                                <TouchableOpacity style={styles.impsTouchableOptacity}
                                    onPress={() => {
                                        navigation.navigate(this, 'ImpsTransfer', { accList: this.AccountList, from: 'QuickPay' })
                                    }}
                                    activeOpacity={0.5}>
                                    <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]}>
                                        <QuickTransfer height={21} width={21} color={this.props.SecondaryColor} /></View>
                                    <Text style={[styles.impsTransferText, { color: this.props.textColor, }]}>
                                        {strings.strQucikTranser}</Text>
                                </TouchableOpacity>
                            </CardView>
                            {/* NEFT */}
                            <CardView
                                cardElevation={3}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.neftCard}>
                                <TouchableOpacity style={styles.neftTouchableOptacity}
                                    onPress={() => {
                                        navigation.navigate(this, 'NeftTransfer', { accList: this.AccountList, from: 'QuickPay' })
                                    }}
                                    activeOpacity={0.5}>
                                    <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]}>
                                        <QuickTransfer height={21} width={21} color={this.props.SecondaryColor} /></View>
                                    <Text style={[styles.neftTransferText, { color: this.props.textColor, }]}>
                                        {strings.strNEFT}</Text>
                                </TouchableOpacity>
                            </CardView>
                        </View>
                        <View style={styles.rowSubMainView}>
                            <CardView
                                cardElevation={3}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.ownCard}>
                                <TouchableOpacity style={styles.ownTouchableOpacity}
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        navigation.navigate(this, 'quickPayOwnAccTransfer', { accList: this.AccountList, from: 'QuickPay' })
                                    }}>
                                    <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]}>
                                        <FundTransferToOwnAcc height={21} width={21} color={this.props.SecondaryColor} /></View>
                                    <Text style={[styles.ownText, { color: this.props.textColor, }]}>
                                        Within Bank Own A/c</Text>
                                </TouchableOpacity>
                            </CardView>
                            <CardView
                                cardElevation={3}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.otherCard}>
                                <TouchableOpacity style={styles.otherTouchableOpacity}
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        navigation.navigate(this, 'fundTransfer', { accList: this.AccountList, from: 'QuickPay' })
                                    }}>
                                    <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]}>
                                        <QuickTransfer height={21} width={21} color={this.props.SecondaryColor} /></View>
                                    <Text style={[styles.otherText, { color: this.props.textColor, }]}>
                                        {strings.strWithinBank}</Text>
                                </TouchableOpacity>
                            </CardView>
                        </View>
                        <View
                            style={styles.upiMainView}>
                            {/* scan and pay */}
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate(this, 'UPIDashboard', { accList: this.AccountList})}}>
                                <CardView
                                    cardElevation={3}
                                    cardMaxElevation={3}
                                    cornerRadius={10}
                                    style={styles.scanAndPayCard}>
                                    <View style={styles.scanAndPaySubView}>
                                        <View>
                                            <Upi height={60} width={100} />
                                        </View>
                                    </View>
                                </CardView>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.footerMainView}>
                        <View style={styles.footerSubView}>
                            <Footer height={70} width={300} />
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}
const styles = {
    IconBgStyle:
    {
        height: 70,
        width: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20
    },
    mainView:
    {
        flex: 1
    },
    lableHeader:
    {
        flex: 0.2
    },
    lableHeaderView:
    {
        marginLeft: 25,
        marginBottom: 10,
    },
    quickPayTextStyle:
    {
        fontSize: 20,
        color: 'black',
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: colors.white,
    },
    selectModeTextStyle:
    {
        fontSize: 15,
        color: 'black',
        textAlign: 'left',
        fontFamily: strings.fontMedium,
        color: colors.white,
    },
    cardsMainView:
    {
        flex: 0.7,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    cardsSubView:
    {
        marginLeft: 30,
        marginRight: 35,
        flexDirection: 'row',
        marginTop: -50,
    },
    impsCard:
    {
        backgroundColor: 'white',
        height: 180, width: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    impsTouchableOptacity:
    {
        alignItems: 'center',
        height: 180,
        width: 120,
    },
    impsTransferText:
    {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: strings.fontMedium,
    },
    neftCard:
    {
        marginLeft: 25,
        backgroundColor: 'white',
        height: 180,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    neftTouchableOptacity:
    {
        alignItems: 'center',
        height: 180, width: 120,
    },
    neftTransferText:
    {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: strings.fontMedium,
    },
    rowSubMainView:
    {
        flexDirection: 'row',
        marginTop: 25,
    },
    ownCard:
    {
        backgroundColor: 'white',
        height: 180, width: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ownTouchableOpacity:
    {
        alignItems: 'center',
        height: 180, width: 120,
    },
    ownText:
    {
        fontSize: 12,
        textAlign: 'center',

        fontFamily: strings.fontMedium,
    },
    otherCard:
    {
        marginLeft: 25,
        backgroundColor: 'white',
        height: 180, width: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    otherTouchableOpacity:
    {
        alignItems: 'center',
        height: 180, width: 120,
    },
    otherText:
    {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: strings.fontMedium,
    },
    upiMainView:
    {
        flex: 1,

        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    scanAndPayCard:
    {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    scanAndPaySubView:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    footerMainView:
    {
        flex: 0.1,
        backgroundColor: 'white',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    footerSubView:
    {
        alignItems: 'flex-end'

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuickPayScreen);
