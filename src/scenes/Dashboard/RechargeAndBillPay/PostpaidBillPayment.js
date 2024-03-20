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
import { TextInput } from 'react-native-paper';
import Balance from '../../../assets/icons/Balance.svg'
import TrasnsperantFixedHeader from '../../../components/TrasnperantFixedHeader';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';
import { CustomPopupsRecharge } from '../../../components/CustomPopupsRecharge.js';
import Constants from '../../../common/Constants.js';
import APIUrlConstants from '../../../common/APIUrlConstants.js';
import MyValidator from '../../../common/MyValidator.js';
import { Dialog_DTH_Payment } from '../../../components/Dialog_DTH_Payment.js';
import { DialogInsufficientBalance } from '../../../components/Dialog_InsufficientBalance.js';
import { Dialog_SimOperator } from '../../../components/Dialog_SimOperator.js';
import Snackbar from 'react-native-snackbar';
import Svg from 'react-native-svg';
import { Path } from 'react-native-svg';
import { Dialog_SelectCircle } from './Dialog_SelectCircle.js';


class PostpaidBillPayment extends Component {
    constructor(props) {
        super(props);
        this.RechargePlans = [
            {
                RechargeAmount: '151',
                Date: '5th Nov 2023',
                Time: '07:11 PM',
                validity: '3 day',
            },
            {
                RechargeAmount: '299',
                Date: '30th Dec 2023',
                Time: '08:19 AM',
                validity: '7 day',
            },
            {
                RechargeAmount: '666',
                Date: '15th Oct 2023',
                Time: '02:11 PM',
                validity: '27 day',
            },
        ];
        this.OperatorsList = [
            {
                "name": "Airtel Prepaid",
            },
            {
                "name": "Jio Prepaid",

            },
            {
                "name": "Vi Prepaid",

            },
            {
                "name": "BSNL Prepaid",

            },
            {
                "name": "MTLN Prepaid",

            }
        ];

        this.accData = [
            { label: '011445252360', value: '1' },
            { label: '012585252360', value: '2' },
            { label: '011445258460', value: '3' },

        ];
        this.AccountList = []
        this.TempAcc = []
        this.SavingAccountList = []
        this.RemainingAccountList = []
        this.OperatorList = [
            {
                OperatorName: 'Airtel Prepaid ',
                Logo: require('../../../assets/icons/AirtelLogo.png'),
                operator_code: 'AP',
                service_type: 'Prepaid',
                service_provider: 'CR',
            },
            {
                OperatorName: 'Jio Prepaid',
                Logo: require('../../../assets/icons/Jio-icon.png'),
                operator_code: 'JP',
                service_type: 'Prepaid',
                service_provider: 'CR',
            },
            {
                OperatorName: 'Vi Prepaid',
                Logo: require('../../../assets/icons/Vi-icon.png'),
                operator_code: 'VP',
                service_type: 'Prepaid',
                service_provider: 'CR',
            },
            {
                OperatorName: 'BSNL Prepaid',
                Logo: require('../../../assets/icons/datacard_BSNL.png'),
                operator_code: 'BSNL',
                service_type: 'Prepaid',
                service_provider: 'CR',
            },
            {
                OperatorName: 'MTLN Prepaid',
                Logo: require('../../../assets/icons/datacard_MTNL.png'),
                operator_code: 'MTP',
                service_type: 'Prepaid',
                service_provider: 'CR',
            },

        ];
        this.CircleList = [
            { circle_code: '1', circle_name: 'Andhra Pradesh' },
            { circle_code: '2', circle_name: 'Assam' },
            { circle_code: '3', circle_name: 'Bihar' },
            { circle_code: '4', circle_name: 'Chennai' },
            { circle_code: '5', circle_name: 'Delhi' },
            { circle_code: '6', circle_name: 'Gujarat' },
            { circle_code: '7', circle_name: 'Haryana' },
            { circle_code: '8', circle_name: 'Himachal Pradesh' },
            { circle_code: '9', circle_name: 'Jammu & Kashmir' },
            { circle_code: '24', circle_name: 'Jharkhand' },
            { circle_code: '10', circle_name: 'Karnataka' },
            { circle_code: '11', circle_name: 'Kerala' },
            { circle_code: '12', circle_name: 'Kolkata' },
            { circle_code: '13', circle_name: 'Maharashtra & Goa (except Mumbai)' },
            { circle_code: '14', circle_name: 'Madhya Pradesh & Chhattisgarh' },
            { circle_code: '15', circle_name: 'Mumbai' },
            { circle_code: '16', circle_name: 'North East' },
            { circle_code: '17', circle_name: 'Orissa' },
            { circle_code: '18', circle_name: 'Punjab' },
            { circle_code: '19', circle_name: 'Rajasthan' },
            { circle_code: '20', circle_name: 'Tamil Nadu' },
            { circle_code: '21', circle_name: 'Uttar Pradesh -East' },
            { circle_code: '22', circle_name: 'Uttar Pradesh -West' },
            { circle_code: '23', circle_name: 'West Bengal' },

        ];
        this.state = {
            isValidOpr: true,
            isValidCir: true,
            Landline_Name: this.props.route.params.OperatorName,
            Landline_Icon: this.props.route.params.Logo,
            Landline_OperatorCode: this.props.route.params.OperatorCode,
            Selected_CircleID: this.props.route.params.Circle_code,
            Selected_CircleName: this.props.route.params.CircleName,
            isOperatorVisible: false,
            isModalVisible: false,
            isModalVisible2: false,
            isModalVisible1: false,
            isStateModalVisible: false,
            selectedValue: 'option1',
            labelText: '',
            amount: '',
            accType: this.accData.length > 0 ? this.accData[0].label : '',
            remark: '',
            searchTerm: '',
            searchTermAct: 0,
            searchPerformed: false,
            constactsNumbers: [],
            confirmDialog: false,
            BillAmount: '',
            confirmBillAmount: '',
            InsufficientBalanceDialog: false,
            Selected_ACMASTCODE: '',
            Selected_AC_NO: '',
            Selected_Balance: '',
            PlateformCharges: 1.5,
            BillAmountError: '',
            ConfirmBillAmountError: '',
        };
    }

    PostpaidRechargeApi() {
        const simid = '00000000-05ec-ff6b-0000-00005659f38b';
        const Headers = APIUrlConstants.Headers("RECHARGE");
        const jsonReq =
        {
            CADRE_ID: Constants.GMST_CODE,
            AMT: this.props.route.params.confirmBillAmount,
            RNO: this.state.Recharge_Mbno,
            RACNO: '',
            OPR_CD: 'RA',
            OPR_NM: 'Airtel',
            CIRC_CD: '1',
            CIRC_NM: 'Andhra Pradesh',
            RTYPE: 'Postpaid-Mobile',
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

    PressNo = () => {
        this.setState({ confirmDialog: false })
    }

    PressYes = () => {
        this.setState({ confirmDialog: false })
        var acBalance = 0;
        acBalance = this.state.Selected_Balance.replace('-', '');
        var BillAmount = this.state.BillAmount
        const TotalAmt = parseFloat(BillAmount) + parseFloat(this.state.PlateformCharges);
        if (acBalance < TotalAmt) {
            this.setState({ InsufficientBalanceDialog: true });
        }
        else {
            setTimeout(() => {
                this.PostpaidRechargeApi();
            }, 500);

        }
    }

    PressOK = () => {
        this.setState({ InsufficientBalanceDialog: false })
    }

    onSubmitClick = () => {
        const result = this.ValidateForm();
        if (result) {
            this.setState({ confirmDialog: true })
        }
    };

    ValidateForm() {
        var result = true;
        this.setState({ BillAmountError: '', ConfirmBillAmountError: '' });
        if (this.state.BillAmount < 10) {
            this.setState({ BillAmountError: "Amount should be Grater than 10" });
            result = false;
        }
        if (this.state.BillAmount != this.state.confirmBillAmount) {
            this.setState({ ConfirmBillAmountError: "Amount not match" });
            result = false;
        }
        if (!MyValidator.isEmptyField(this.state.BillAmount).isValid) {
            this.setState({ BillAmountError: "Please Enter Bill Amount" });
            result = false;
        }
        if (!MyValidator.isEmptyField(this.state.confirmBillAmount).isValid) {
            this.setState({ ConfirmBillAmountError: "Please Enter Confirm Bill Amount" });
            result = false;
        }
        if (this.state.Landline_Name === 'Select Operator') {
            this.setState({ isValidOpr: false })
            Snackbar.show({ text: "Please Select Operator ", duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
            result = false;
        }
        if (this.state.Selected_CircleName === 'Select Circle') {
            this.setState({ isValidCir: false })
            Snackbar.show({ text: "Please Select Circle ", duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
            result = false;
        }
        return result;
    };

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

    onSelectCircle = (item) => {
        this.setState({ isCircleVisible: false, isValidCir: true });
        if (item.circle_name === null || item.circle_name === undefined || item.circle_name.trim() === "") {
        }
        else {
            this.setState({ Selected_CircleID: item.circle_code, Selected_CircleName: item.circle_name, CircleName: item.circle_name })
        }
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

    onSelectOperator = (item) => {
        this.setState({ isOperatorVisible: false, isValidOpr: true });
        if (item === undefined) { }
        else {
            if (item.OperatorName === null || item.OperatorName === undefined || item.OperatorName.trim() === "") {
            }
            else {
                this.setState({ Landline_Name: item.OperatorName, Landline_Icon: item.Logo, Landline_OperatorCode: item.operator_code })
            }
        }

    }

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

    render() {
        return (
            <View style={styles.mainContainer}>
                <ImageBackground style={styles.mainContainer}
                    source={this.bgImage}
                    resizeMode='cover'>
                    <TrasnsperantFixedHeader
                        backAction={() => this.onBackAction()} />
                    <View style={styles.lableHeader}>
                        <View style={styles.lableHeaderView}>
                            <Text style={styles.ftToOtherBankTitle}>Postpaid
                            </Text>
                            <Text style={styles.ftToOtherBankDescription}>Select Postpaid Number for Bill Payment
                            </Text>
                        </View>
                    </View>
                    <View style={styles.subMainView}>
                        <View style={styles.innerSubView}>
                            <View style={styles.textContainer}>
                                <Text style={styles.username}>{this.props.route.params.name}</Text>
                                <Text style={styles.mobileNumber}>{this.props.route.params.mobno}</Text>
                            </View>
                            <View style={styles.simIcon}>
                                <Image style={styles.landlineIcon} source={this.state.Landline_Icon} />
                            </View>
                        </View>
                        <View style={styles.landlineView}>
                            <TouchableOpacity
                                style={[styles.touchableLandLineView, {  borderColor: this.state.isValidOpr ? "#d2d2d2" : "red",}]}
                                onPress={() => this.setState({ isOperatorVisible: true })}>
                                <Text style={[styles.landlineName, { color: this.state.isValidOpr ? "#000" : "red", }]}>{this.state.Landline_Name} </Text>
                                <View style={styles.svgView} >
                                    <Svg width="10" height="10">
                                        <Path
                                            d="M0 0L5 5L10 0H0Z"
                                            fill={this.state.isValidOpr ? 'grey' : 'red'}
                                        />
                                    </Svg></View>
                            </TouchableOpacity>
                            {Dialog_SimOperator(
                                this.state.isOperatorVisible,
                                this.OperatorList,
                                this.onSelectOperator,
                                this.state.DataCard_Name,
                            )}
                            <TouchableOpacity
                                style={[styles.circleView, { borderColor: this.state.isValidCir ? "#d2d2d2" : "red", }]}
                                onPress={() => this.setState({ isCircleVisible: true, })}>
                                <Text style={[styles.circleNameText, { color: this.state.isValidCir ? "#000" : "red", }]} numberOfLines={1} ellipsizeMode="tail">{this.state.Selected_CircleName}</Text>
                                <View style={{ marginTop: 5 }} >
                                    <Svg width="10" height="10">
                                        <Path
                                            d="M0 0L5 5L10 0H0Z"
                                            fill={this.state.isValidCir ? 'grey' : 'red'}
                                        />
                                    </Svg></View>
                            </TouchableOpacity>
                            {Dialog_SelectCircle(
                                this.state.isCircleVisible,
                                this.CircleList,
                                this.onSelectCircle,
                                this.state.Selected_CircleName,
                            )}
                        </View>
                        <ScrollView>
                            <View style={styles.scrollViewInnerContainer}>
                                <View style={styles.InputBoxDesign}>
                                    <TouchableOpacity style={styles.selectAccTouchable}
                                        onPress={() => this.setState({ isModalVisible: true, labelText: 'Select Account' })}>
                                        <View style={styles.mainContainer}>
                                            <Text style={styles.selectAccText}>Select Account</Text>
                                            <Text style={styles.selectAccTextValue}>
                                                {this.state.Selected_AC_NO}
                                            </Text>
                                        </View>
                                        <View style={styles.arrowDropDown}>
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
                                <View style={styles.balanceMainContainer}>
                                    <View style={styles.balanceInnerContainer}>
                                        <Balance width={32} height={32} />
                                    </View>
                                    <View>
                                        <Text style={styles.availableBal}>Available Balance</Text>
                                        <Text style={styles.availableBalValue}>{strings.rupee + this.state.Selected_Balance}</Text>
                                    </View>
                                </View>
                                <View style={styles.billAmntView}>
                                    <TextInput
                                        style={styles.billAmntTextInput}
                                        theme={{
                                            colors: {
                                                placeholder: '#DFE1E8',
                                                text: this.props.textColor,
                                                primary: this.props.themeColor,
                                                underlineColor: 'transparent',
                                                background: 'white',
                                            },
                                            roundness: 8,
                                        }}
                                        label="Enter Bill Amount"
                                        keyboardType='numeric'
                                        value={this.state.BillAmount}
                                        onChangeText={BillAmount => {
                                            this.setState({ BillAmount, error: '' });
                                        }}
                                        mode='outlined'
                                    />
                                    {this.state.BillAmountError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.BillAmountError}</Text>)}
                                </View>
                                <View style={{ flexDirection: 'column', marginBottom: 8, justifyContent: 'center', alignItems: 'flex-start' }}>
                                    <TextInput
                                        style={styles.billAmntTextInput}
                                        theme={{
                                            colors: {
                                                placeholder: '#DFE1E8',
                                                text: this.props.textColor,
                                                primary: this.props.themeColor,
                                                underlineColor: 'transparent',
                                                background: 'white',
                                            },
                                            roundness: 8,
                                        }}
                                        label="Confirm Bill Amount"
                                        keyboardType='numeric'
                                        value={this.state.confirmBillAmount}
                                        onChangeText={confirmBillAmount => {
                                            this.setState({ confirmBillAmount, error: '' });
                                        }}
                                        mode='outlined'
                                    />
                                    {this.state.ConfirmBillAmountError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.ConfirmBillAmountError}</Text>)}
                                </View>
                                <View style={styles.platformChargesView}>
                                    <Text style={styles.platformChargesText}>Platform Charges : {this.state.PlateformCharges}</Text>
                                </View>
                                <CardView
                                    cardElevation={2}
                                    cardMaxElevation={2}
                                    cornerRadius={12}
                                    style={styles.submitCard}>
                                    <TouchableOpacity
                                        style={styles.submitTouchable}
                                        onPress={this.onSubmitClick}>
                                        <Text style={styles.submitText}>Submit</Text>
                                    </TouchableOpacity>
                                </CardView>
                            </View>
                        </ScrollView>
                    </View>
                </ImageBackground>
                {
                    Dialog_DTH_Payment(this.state.confirmDialog, this.PressNo, this.PressYes, this.props.PrimaryColor, this.props.SecondaryColor, this.state.Landline_Name, this.state.Landline_Icon, this.state.BillAmount, this.state.PlateformCharges)
                }
                {
                    DialogInsufficientBalance(this.state.InsufficientBalanceDialog, this.PressOK, this.props.SecondaryColor,)
                }
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostpaidBillPayment);


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
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 0.5,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
        flex: 2,
    },
    username: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000'
    },
    mobileNumber: {
        fontSize: 16,
    },
    ErrorDisplay: {
        color: "#FF0000",
        marginLeft: 5,
        fontSize: 12,
    },
    mainContainer:
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
        marginTop: 15,
    },
    ftToOtherBankTitle:
    {
        fontSize: 22,
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: colors.white,
    },
    ftToOtherBankDescription:
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
        borderTopRightRadius: 25
    },
    innerSubView:
    {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        width: width - 50,
        marginTop: 20,
    },
    landlineIcon:
    {
        width: 48,
        height: 48
    },
    landlineView:
    {
        width: width - 50,
        height: 30,
        marginBottom: 10,
        flexDirection: 'row'
    },
    touchableLandLineView:
    {
        borderRadius: 15,
        backgroundColor: "#fff",
        borderStyle: "solid",
        borderWidth: 0.5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    landlineName:
    {
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        textAlign: "left",
        marginRight: 5
    },
    svgView:
    {
        marginTop: 5
    },
    circleView:
    {
        borderRadius: 15,
        backgroundColor: "#fff",
        borderStyle: "solid",
        borderWidth: 0.5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    circleNameText:
    {
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        textAlign: "left",
        marginRight: 5
    },
    scrollViewInnerContainer: {
        width: width - 50,
        alignItems: 'center'
    },
    selectAccTouchable:
    {
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectAccText:
    {
        color: colors.accTextColor + '80',
        marginLeft: 15,
        fontSize: 10,
        fontFamily: strings.fontMedium
    },
    selectAccTextValue:
    {
        color: colors.accTextColor,
        marginLeft: 15,
        fontSize: 15,
        fontFamily: strings.fontMedium
    },
    arrowDropDown:
    {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },
    balanceMainContainer:
    {
        height: 80,
        width: width - 50,
        borderRadius: 10,
        borderColor: 'black',
        backgroundColor: '#e8f1f8',
        alignItems: 'center',
        marginTop: 15,
        flexDirection: 'row',
    },
    balanceInnerContainer:
    {
        width: 55,
        height: 55,
        borderRadius: 10,
        backgroundColor: 'white',
        marginLeft: 18,
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    availableBal:
    {
        color: colors.accTextColor,
        fontSize: 14,
        fontFamily: strings.fontMedium
    },
    availableBalValue:
    {
        color: colors.accTextColor,
        fontSize: 17,
        fontFamily: strings.fontMedium,
        flexWrap: 'wrap',
        width: width - 50,
        fontWeight: 'bold',
        marginTop: 2
    },
    billAmntView:
    {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    billAmntTextInput:
    {
        lineHeight: 40,
        height: 48,
        width: width - 50,
        marginTop: 10,
    },
    platformChargesView:
    {
        marginTop: 5,
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
        marginVertical: 20,
    },
    submitTouchable:
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
