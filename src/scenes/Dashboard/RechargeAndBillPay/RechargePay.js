import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
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
    config,
    sendData,
} from '../../../App';
import Arrowdown from '../../../assets/icons/dashboardIcons/arrow_down.svg';
import Balance from '../../../assets/icons/Balance.svg'
import TrasnsperantFixedHeader from '../../../components/TrasnperantFixedHeader';
import CardView from 'react-native-cardview';
import { DialogInsufficientBalance } from '../../../components/Dialog_InsufficientBalance.js';
import { CustomPopupsRecharge } from '../../../components/CustomPopupsRecharge';
import { ScrollView } from 'react-native-gesture-handler';
import APIUrlConstants from '../../../common/APIUrlConstants';
import Snackbar from 'react-native-snackbar';
import Constants from '../../../common/Constants';
import { Dialog_DTH_Payment } from '../../../components/Dialog_DTH_Payment.js';

class RechargeOffers extends Component {
    constructor(props) {
        super(props);
        this.AccountList = []
        this.TempAcc = []
        this.SavingAccountList = []
        this.RemainingAccountList = []
        this.accData = [
            { label: '011445252360', value: '1' },
            { label: '012585252360', value: '2' },
            { label: '011445258460', value: '3' },

        ];

        this.verifyData = [
            { label: 'Pan card Number', value: '1' },
            { label: 'Aadhar card Number', value: '2' },
        ]

        this.state = {
            isModalVisible: false,
            isStateModalVisible: false,
            selectedValue: 'option1',
            accType: this.accData.length > 0 ? this.accData[0].label : '',
            labelText: '',
            amount: '',
            remark: '',
            searchTerm: '',
            searchTermAct: 0,
            matchedBank: null,
            searchPerformed: false,
            constactsNumbers: [],
            Plateformcharges: '1.5',
            Selected_ACMASTCODE: '',
            Selected_AC_NO: '',
            Selected_Balance: '',
            InsufficientBalanceDialog: false,
            confirmDialog: false,
            OperatorLogo: this.props.route.params.Logo,
            Recharge_Name: this.props.route.params.name,
            Recharge_Mbno: this.props.route.params.MobileNumber,
            OperatorName: this.props.route.params.OperatorName,
            Status: 0
        };
    }

    PrepaidRechargeApi() {
        const simid = '00000000-05ec-ff6b-0000-00005659f38b';
        const Headers = APIUrlConstants.Headers("RECHARGE");
        const jsonReq =
        {
            CADRE_ID: Constants.GMST_CODE,
            AMT: this.props.route.params.RechargeAmount,
            RNO: this.state.Recharge_Mbno,
            RACNO: '',
            OPR_CD: 'RA',
            OPR_NM: this.state.OperatorName,
            CIRC_CD: '1',
            CIRC_NM: 'Andhra Pradesh',
            RTYPE: 'Prepaid-Mobile',
            SEC_KEY: Constants.SecretKey,
            CUS_SAV_GL: this.state.Selected_ACMASTCODE,
            CUS_SAV_AC: this.state.Selected_AC_NO,
            BRNCH_CD: Constants.BRANCH_CODE,
            NET_SRV_CHRG: Constants.NET_SRV_CHRG,
            BNK_SRV_CHRG: Constants.BNK_SRV_CHRG_DTH,
            CMOBNO: Constants.MobileNumber,
            DEVICE_LATTIDUTE: '',
            DEVICE_LONGITUDE: '',
            DEVICE_LOCAL_IP: '',
            DEVICE_PUBLIC_IP: '',
            DEVICE_ISP_OPERATOR: '',
            SIMNO: simid,
            bankCode: Constants.BankCode,
            customerId: Constants.GMST_CODE,
            divId: this.props.DeviceId,
        }
        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: JSON.stringify(jsonReq),

        }
        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                var finalRes = response
                let res = finalRes.SUCCESS
                if (res === "FALSE") {
                    const ErrorMsg = finalRes.RESULT
                    Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                }
                else if (res === "TRUE") {
                    Snackbar.show({ text: "Prepaid Recharge Successfully", duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green' });
                    this.props.navigation.navigate('prepaidRechargeSuccess')
                }
                else {
                    Snackbar.show({ text: "Error To Recharge, Retry !!", duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                }
            })
    }

    PressNo = () => {
        this.setState({ confirmDialog: false })
    }

    PressYes = () => {
        this.setState({ confirmDialog: false })
        var acBalance = 0;
        acBalance = this.state.Selected_Balance.replace('-', '');
        var RechargeAmt = this.props.route.params.RechargeAmount
        const TotalAmt = parseFloat(RechargeAmt) + parseFloat(this.state.Plateformcharges);
        if (acBalance < TotalAmt) {
            this.setState({ InsufficientBalanceDialog: true });
        }

        else {
            setTimeout(() => {
                this.PrepaidRechargeApi();
            }, 500);
        }
    }

    PressOK = () => {
        this.setState({ InsufficientBalanceDialog: false })
    }

    onSubmitClick = () => {
        if (true) {
            this.setState({ confirmDialog: true })
        }
    };

    onSelectAccount = (value) => {
        this.setState({ isModalVisible: false, })
        if (value.AC_NO === null || value.AC_NO === undefined || value.AC_NO.trim() === "") {
        }
        else {
            this.setState({
                Selected_AC_NO: value.AC_NO,
                Selected_ACMASTCODE: value.ACMASTCODE,
            })
            this.GetAllowableBalance(value.AC_NO, value.ACMASTCODE)
        }
    }

    componentDidMount() {
        this.GetAccountDetailsApi()
    }



    GetAccountDetailsApi() {
        const Headers =
        {
            ProdCD: Constants.ProdCD,
            BankCD: Constants.BankCode,
            OprCD: 'GETACSUM',
            Content_Type: 'application/json',
            REQ_TYPE: 'POST'
        };
        const Body =
        {
            PARACNT: "3",
            PARA1_TYP: "STR",
            PARA1_VAL: Constants.GMST_CODE,
            PARA2_TYP: "STR",
            PARA2_VAL: Constants.BankCode,
            PARA3_TYP: "STR",
            PARA3_VAL: Constants.SecretKey,

        }
        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                var finalRes = response
                let res = finalRes.SUCCESS
                if (res === "FALSE") {
                    const ErrorMsg = finalRes.RESULT
                    Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                }
                else {
                    let userAccArray = finalRes.Acdtls
                    if (userAccArray.length > 0) {
                        userAccArray.map((item) => {
                            const acTypeVariable = JSON.stringify(item);
                            this.TempAcc.push(JSON.parse(item))
                        })
                        this.TempAcc.forEach(element => {
                            if (element.ACTYPE === 'SAVING ACCOUNT') {
                                this.SavingAccountList.push(element)
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
                        this.GetAllowableBalance(Constants.Selected_AC_NO, Constants.Selected_ACMASTCODE)
                        this.setState({
                            Selected_ACMASTCODE: Constants.Selected_ACMASTCODE,
                            Selected_AC_NO: Constants.Selected_AC_NO,
                        })
                    }
                }
            })
    }

    GetAllowableBalance = async (AC_NO, ACMASTCODE) => {
        const Headers =
        {
            ProdCD: Constants.ProdCD,
            BankCD: Constants.BankCode,
            OprCD: 'GETALLBAL',
            Content_Type: 'application/json',
            REQ_TYPE: 'POST'
        };
        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: "{\"ACMASTCODE\":\"" + ACMASTCODE + "\",\"AC_NO\":\"" + AC_NO + "\"}"
        }
        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                let res = response.SUCCESS
                if (res === "FALSE") {
                    const ErrorMsg = response.RESULT
                    Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                    this.setState({ Selected_Balance: '0.0' })
                }
                else if (res === "TRUE") {
                    this.setState({ Selected_Balance: response['ALLOWABLE BALANCE'] })
                }
            })
    }

    bgImage = appThemeConfiguration(config.themeColor).bgImg

    onBackAction() {
        navigation.goBack(this)
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        navigation.goBack(this)
        return true;
    };

    render() {
        return (
            <View style={styles.mainView}>
                <ImageBackground style={styles.mainView}
                    source={this.bgImage}
                    resizeMode='cover'>
                    <TrasnsperantFixedHeader backAction={() => this.onBackAction()} />
                    {
                        DialogInsufficientBalance(this.state.InsufficientBalanceDialog, this.PressOK, this.props.SecondaryColor,)
                    }
                    <View style={styles.lableHeader}>
                        <View style={styles.lableHeaderView}>
                            <Text style={styles.prepaidTitle}>Prepaid</Text>
                            <Text style={styles.prepaidDescription}> Recharge Payment</Text>
                        </View>
                    </View>
                    <View style={styles.subMainView}>
                        <ScrollView>
                            <View style={styles.scrollInnerView}>
                                <View style={styles.simIcon}>
                                    <Image style={styles.operatorLogo} source={this.state.OperatorLogo}></Image>
                                </View>
                                <Text style={styles.operaterName}>{this.state.OperatorName}</Text>
                                <View style={styles.textContainer}>
                                    <Text style={styles.rechargeAmntText}>{strings.rupee + this.props.route.params.RechargeAmount + '.00'}</Text>
                                    <TouchableOpacity
                                        style={[styles.rechargeAmntTouchable, { borderColor: this.props.SecondaryColor }]}
                                        onPress={() => this.props.navigation.navigate('rechargeOffers', { name: this.props.route.params.UserName, mobno: this.props.route.params.MobileNumber })}>
                                        <Text style={[styles.changePlanText, { color: this.props.SecondaryColor }]}>Change Plan</Text></TouchableOpacity>
                                </View>
                                <View style={[styles.textContainer, { marginTop: 10 }]}>
                                    <Text style={styles.userName}>{this.props.route.params.UserName}</Text>
                                    <Text style={styles.mobileNumber}>{this.props.route.params.MobileNumber}</Text>
                                </View>
                            </View>
                            <View style={styles.InputBoxDesign}>
                                <TouchableOpacity style={styles.selectAccountTouchable}
                                    onPress={() => this.setState({ isModalVisible: true, labelText: 'Select Account' })}>
                                    <View style={styles.mainView}>
                                        <Text style={styles.selectAccountText}>Select Account</Text>
                                        <Text style={styles.selectAccountValue}>{this.state.Selected_AC_NO}</Text>
                                    </View>
                                    <View style={styles.dropDownArrow}>
                                        <Arrowdown height={15} width={15} />
                                    </View>
                                </TouchableOpacity>
                                {CustomPopupsRecharge(
                                    this.state.isModalVisible,
                                    this.AccountList,
                                    this.onSelectAccount,
                                    this.state.labelText,
                                    this.state.Selected_AC_NO
                                )}
                            </View>
                            <View style={styles.balanceMainView}>
                                <View style={styles.balanceInnerView}>
                                    <Balance width={35} height={35} />
                                </View>
                                <View>
                                    <Text style={styles.availableText}>Available Balance</Text>
                                    <Text style={styles.selectBalanceValue}>{strings.rupee + this.state.Selected_Balance} </Text>
                                </View>
                            </View>
                            <View style={styles.platformChargesView}>
                                <Text style={styles.platformChargesText}>Platform Charges : ₹ {this.state.Plateformcharges}</Text>
                            </View>
                            <CardView
                                cardElevation={2}
                                cardMaxElevation={2}
                                cornerRadius={12}
                                style={styles.submitCard}>
                                <TouchableOpacity
                                    style={styles.submitToucable}
                                    onPress={this.onSubmitClick}>
                                    <Text style={styles.submitText}>Submit</Text>
                                </TouchableOpacity>
                            </CardView>
                        </ScrollView>
                    </View>
                </ImageBackground>
                {
                    Dialog_DTH_Payment(this.state.confirmDialog, this.PressNo, this.PressYes, this.props.PrimaryColor, this.props.SecondaryColor, this.state.OperatorName, this.state.OperatorLogo, this.props.route.params.RechargeAmount, this.state.Plateformcharges)
                }

            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RechargeOffers);

const styles = StyleSheet.create({
    InputBoxDesign: {
        height: 48,
        width: width - 50,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DFE1E8',
    },
    simIcon: {
        width: 100,
        height: 100,
        borderRadius: 55,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 0.5,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    operaterName: {
        fontSize: 18,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#929cac",
        textAlign: "center",
        marginTop: 10
    },
    mainView:
    {
        flex: 1
    },
    lableHeader:
    {
        flex: 0.15
    },
    lableHeaderView:
    {
        marginLeft: 25,
        marginTop: 15
    },
    prepaidTitle:
    {
        fontSize: 22,
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: colors.white,
    },
    prepaidDescription:
    {
        fontSize: 15,
        textAlign: 'left',
        fontFamily: strings.fontMedium,
        color: colors.white,
    },
    subMainView:
    {
        flex: 0.85,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    scrollInnerView:
    {
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        width: width - 60,
        marginTop: 20,
    },
    operatorLogo:
    {
        width: 90,
        height: 90
    },
    rechargeAmntText:
    {
        fontSize: 44,
        fontWeight: "700",
        fontFamily: "SF UI Display",
        color: "#1f3c66",
        textAlign: "center"
    },
    rechargeAmntTouchable:
    {
        borderRadius: 14,
        borderWidth: 1,
        height: 20,
        width: 100,
        alignSelf: 'center',
        marginTop: 5
    },
    changePlanText:
    {
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        textAlign: "center"
    },
    userName:
    {
        fontSize: 18,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#000",
        textAlign: "center",
        width: 150
    },
    mobileNumber:
    {
        fontSize: 14,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#929cac",
        textAlign: "center",
        width: 150
    },
    selectAccountTouchable:
    {
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectAccountText:
    {
        color: colors.accTextColor + '80',
        marginLeft: 15,
        fontSize: 10,
        fontFamily: strings.fontMedium
    },
    selectAccountValue:
    {
        color: colors.accTextColor,
        marginLeft: 15,
        fontSize: 15,
        fontFamily: strings.fontMedium
    },
    dropDownArrow:
    {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },
    balanceMainView:
    {
        height: 75,
        width: width - 50,
        borderRadius: 10,
        borderColor: 'black',
        backgroundColor: '#e8f1f8',
        alignItems: 'center',
        marginTop: 10,
        flexDirection: 'row',
    },
    balanceInnerView:
    {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: 'white',
        marginLeft: 10,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    availableText:
    {
        color: colors.accTextColor,
        fontSize: 14,
        fontFamily: strings.fontMedium
    },
    selectBalanceValue:
    {
        color: colors.accTextColor,
        fontSize: 16,
        fontFamily: strings.fontMedium,
        flexWrap: 'wrap',
        width: 245,
        fontWeight: 'bold',
        marginTop: 5
    },
    platformChargesView:
    {
        marginTop: 10,
        width: width - 60
    },
    platformChargesText:
    {
        fontSize: 14,
        color: "#1f3c66",
        textAlign: "left"
    },
    submitCard:
    {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 10,
    },
    submitToucable:
    {
        padding: 15,
        width: width - 50,
        backgroundColor: colors.btnColor,
        justifyContent: 'center',
        borderRadius: 12,
    },
    submitText:
    {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15
    }

});
