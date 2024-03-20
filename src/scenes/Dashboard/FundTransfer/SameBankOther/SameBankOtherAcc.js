import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ImageBackground, BackHandler, } from 'react-native';
import Footer from '../../../../assets/icons/footer.svg';
import FundTransferIcon from '../../../../assets/icons/dashboardIcons/same-bank-transfer.svg';
import AddBeneficiaryIcon from '../../../../assets/icons/user-add.svg';
import VerifyBeneficiaryIcon from '../../../../assets/icons/user-check.svg';
import EditBeneficiaryIcon from '../../../../assets/icons/user-pen.svg';
import CardView from 'react-native-cardview';
import {
    colors,
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    navigation,
    appThemeConfiguration,
} from '../../../../App';
import TrasnperantFixedHeader from '../../../../components/TrasnperantFixedHeader';

class SameBankOtherAcc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accounList: props.route.params.dashboardArray,
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    }
    componentDidMount() { }
    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg;

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    onBackAction() {
        navigation.goBack(this)
    }

    handleBackButtonClick() {
        navigation.goBack(this)
        return true;
    }
    toOwnAccTransfer() {
        navigation.navigate(this, 'ownAccTransferScreen');
        console.log('hellooooo');
    }

    render() {
        return (
            <View style={styles.mainView}>
                <ImageBackground style={styles.mainView} source={this.bgImage} resizeMode='cover'>
                    <TrasnperantFixedHeader backAction={() => this.onBackAction()} />

                    <View style={styles.lableHeader}>
                        <View
                            style={styles.lableHeaderView}>
                            <Text
                                style={styles.WithinOtherTextStyle}>
                                {strings.samebankotheracc}
                            </Text>
                            <Text
                                style={styles.OtherAccTextStyle}>
                                {strings.otheraccfundtrans}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={styles.cardsMainView}>
                        <View
                            style={styles.cardsSubView}>
                            <CardView
                                cardElevation={3}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.fundTransferCardCard}>
                                <TouchableOpacity
                                    style={styles.fundTransferTouchableOptacity}
                                    onPress={() => {
                                        navigation.navigate(this, 'fundTransfer', {
                                            accList: this.state.accounList,
                                            from: 'Dashboard',
                                        });
                                    }}
                                    activeOpacity={0.5}>
                                    <View
                                        style={[styles.fundTransferIconView, { backgroundColor: this.props.SecondaryColor + '1A' }]}>
                                        <FundTransferIcon height={21} width={21} color={this.props.SecondaryColor} />
                                    </View>
                                    <Text
                                        style={[styles.fundTransferText, { color: this.props.textColor }]}>
                                        {strings.fundTransfer}
                                    </Text>
                                </TouchableOpacity>
                            </CardView>
                            <CardView
                                cardElevation={3}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.addBeneficiaryCard}>
                                <TouchableOpacity
                                    style={styles.fundTransferTouchableOptacity}
                                    onPress={() => {
                                        navigation.navigate(this, 'addBeneficiary', {
                                            accList: this.state.accounList,
                                            from: 'Dashboard',
                                        });
                                    }}
                                    activeOpacity={0.5}>
                                    <View
                                        style={[styles.fundTransferIconView, { backgroundColor: this.props.SecondaryColor + '1A' }]}>
                                        <AddBeneficiaryIcon height={21} width={21} color={this.props.SecondaryColor} />
                                    </View>
                                    <Text
                                        style={[styles.fundTransferText, { color: this.props.textColor }]}>
                                        {strings.addBeneficiary}
                                    </Text>
                                </TouchableOpacity>
                            </CardView>
                        </View>
                        <View
                            style={styles.rowSubMainView}>
                            <CardView
                                cardElevation={3}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.fundTransferCardCard}>
                                <TouchableOpacity
                                    style={styles.fundTransferTouchableOptacity}
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        navigation.navigate(this, 'verifyBeneficiary', {
                                            accList: this.state.accounList,
                                            from: 'Dashboard',
                                        });
                                    }}>
                                    <View
                                        style={[styles.fundTransferIconView, { backgroundColor: this.props.SecondaryColor + '1A' }]}>
                                        <VerifyBeneficiaryIcon height={21} width={21} color={this.props.SecondaryColor} />
                                    </View>
                                    <Text
                                        style={[styles.fundTransferText, { color: this.props.textColor }]}>
                                        {strings.verifyBeneficiary}
                                    </Text>
                                </TouchableOpacity>
                            </CardView>
                            <CardView
                                cardElevation={3}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.addBeneficiaryCard}>
                                <TouchableOpacity
                                    style={styles.fundTransferTouchableOptacity}
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        navigation.navigate(this, 'editBeneficiary', {
                                            accList: this.state.accounList,
                                            from: 'Dashboard',
                                        });
                                    }}>
                                    <View
                                        style={[styles.fundTransferIconView, { backgroundColor: this.props.SecondaryColor + '1A' }]}>
                                        <EditBeneficiaryIcon height={21} width={21} color={this.props.SecondaryColor} />
                                    </View>
                                    <Text
                                        style={[styles.fundTransferText, { color: this.props.textColor }]}>
                                        {strings.modifyBeneficiary}
                                    </Text>
                                </TouchableOpacity>
                            </CardView>
                        </View>
                    </View>
                    <View
                        style={styles.footerMainView}>
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
    WithinOtherTextStyle:
    {
        fontSize: 20,
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: colors.white,
    },
    OtherAccTextStyle:
    {
        fontSize: 15,
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
    fundTransferCardCard:
    {
        backgroundColor: 'white',
        height: 180,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fundTransferTouchableOptacity:
    {
        alignItems: 'center',
        height: 180,
        width: 120,
    },
    fundTransferIconView:
    {
        height: 70,
        width: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    fundTransferText:
    {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: strings.fontMedium,
    },
    addBeneficiaryCard:
    {
        marginLeft: 25,
        backgroundColor: 'white',
        height: 180,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowSubMainView:
    {
        flexDirection: 'row',
        marginTop: 25,
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
export default connect(mapStateToProps, mapDispatchToProps)(SameBankOtherAcc);
