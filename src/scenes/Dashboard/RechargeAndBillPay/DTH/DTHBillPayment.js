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

    sendData,
} from '../../../../App';

import Arrowdown from '../../../../assets/icons/dashboardIcons/arrow_down.svg';
import { TextInput } from 'react-native-paper';
import Balance from '../../../../assets/icons/Balance.svg'

//import { TouchableOpacity } from 'react-native-gesture-handler';
import TrasnsperantFixedHeader from '../../../../components/TrasnperantFixedHeader';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';
import Arrow from '../../../../assets/icons/Vectorarrow.svg';

import { selectAccount } from '../../../../components/CustomDialog.js';

import Constants from '../../../../common/Constants.js';
import APIUrlConstants from '../../../../common/APIUrlConstants.js';
import { Dialog_DTH_Payment } from '../../../../components/Dialog_DTH_Payment.js';
import { DialogInsufficientBalance } from '../../../../components/Dialog_InsufficientBalance.js';
import Snackbar from 'react-native-snackbar';
import MyValidator from '../../../../common/MyValidator';






class DTHBillPayment extends Component {


    constructor(props) {
        super(props);


        this.AccountList = []
        this.TempAcc = []
        this.SavingAccountList = []
        this.RemainingAccountList = []


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

            DTH_Name: this.props.route.params.name,
            DTH_Icon: this.props.route.params.Logo,
            DTH_OperatorCode: this.props.route.params.OperatorCode,

            isModalVisible: false,
            isModalVisible1: false,
            isStateModalVisible: false,
            labelText: '',
            amount: '',

            PlatformCharges: 1.50,

            SubscriberNumber: '',
            confirmDialog: false,
            InsufficientBalanceDialog: false,

            SubscriberNumber: '',
            BillAmount: this.props.route.params.Amount,
            ConfirmBillAmount: '',

            Subscriber_error: '',
            BillAmountError: '',
            ConfirmBillAmountError: '',

            Selected_ACMASTCODE: '',
            Selected_AC_NO: '',
            Selected_Balance: '',

            Selected_CircleID: this.CircleList.length > 0 ? this.CircleList[0].circle_code : '',
            Selected_CircleName: this.CircleList.length > 0 ? this.CircleList[0].circle_name : '',
            Hide_Billamount: true,

        };


    }

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


    toOwnAccTransfer() {
        navigation.navigate(this, 'ownAccTransferScreen')
    }

    toReview() {
        navigation.navigate(this, 'quickPayWithinBankOtherAccount')
    }

    componentDidMount() {

        this.GetAccountDetailsApi()

    }


    handleValidation = () => {

        const result = this.ValidateForm();

        if (result) {

            this.setState({ confirmDialog: true })
        }
    };

    ValidateForm() {


        var result = true;

        this.setState({ Subscriber_error: '', BillAmountError: '', ConfirmBillAmountError: '', });


        if (!MyValidator.isEmptyField(this.state.SubscriberNumber).isValid) {
            this.setState({ Subscriber_error: "Please Enter Subscriber Number" });
            result = false;
        }

        if (this.state.BillAmount < 10) {
            this.setState({ BillAmountError: "Amount should be Grater than 10" });
            result = false;
        }


        if (this.state.BillAmount != this.state.ConfirmBillAmount) {
            this.setState({ ConfirmBillAmountError: "Amount not match" });

            result = false;
        }

        if (!MyValidator.isEmptyField(this.state.BillAmount).isValid) {
            this.setState({ BillAmountError: "Please Enter Bill Amount" });
            result = false;
        }


        if (!MyValidator.isEmptyField(this.state.ConfirmBillAmount).isValid) {
            this.setState({ ConfirmBillAmountError: "Please Enter Confirm Bill Amount" });
            result = false;
        }


        return result;
    };


    onSelectAccount = (value) => {

        if (value.AC_NO === null || value.AC_NO === undefined || value.AC_NO.trim() === "") {

        }
        else {
            this.setState({
                isModalVisible1: false,
                Selected_AC_NO: value.AC_NO,
                Selected_ACMASTCODE: value.ACMASTCODE,
                Selected_Balance: value.BALANCE,
            })
        }


    }


    onSelectCircle = (value) => {
        this.setState({ isModalVisible: false, Selected_CircleID: value.circle_code, Selected_CircleName: value.circle_name })
    }


    PressNo = () => {

        this.setState({ confirmDialog: false })
    }

    PressYes = () => {

        this.setState({ confirmDialog: false })

        var acBalance = 0;


        if (this.state.Selected_Balance.startsWith("-")) {
            acBalance = this.state.Selected_Balance.replace('-', '');
        }

        const TotalAmt = parseFloat(this.state.BillAmount) + parseFloat(this.state.PlatformCharges);


        if (acBalance < TotalAmt) {
            this.setState({ InsufficientBalanceDialog: true });
        }
        else {

            setTimeout(() => {

                this.DTHRechargeApi();


            }, 500);

        }


    }

    PressOK = () => {
        this.setState({ InsufficientBalanceDialog: false })
    }


    GetAccountDetailsApi() {


        const Headers = APIUrlConstants.Headers("GETACSUM");

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





                        this.setState({
                            Selected_ACMASTCODE: Constants.Selected_ACMASTCODE,
                            Selected_AC_NO: Constants.Selected_AC_NO,
                            Selected_Balance: Constants.Selected_BALANCE,
                        })


                    }


                }


            })

    }



    DTHRechargeApi() {

        const simid = '00000000-05ec-ff6b-0000-00005659f38b';

        const Headers = APIUrlConstants.Headers("RECHARGE");

        const jsonReq =
        {
            CADRE_ID: Constants.GMST_CODE,
            AMT: this.state.ConfirmBillAmount,
            RNO: this.state.SubscriberNumber,
            RACNO: '',
            OPR_CD: this.state.DTH_OperatorCode,
            OPR_NM: this.state.DTH_Name,
            CIRC_CD: this.state.Selected_CircleID,
            CIRC_NM: this.state.Selected_CircleName,
            RTYPE: 'DTH',
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
                else {

                    this.props.navigation.navigate('DTHRechargeSuccess')
                }


            })

    }




    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg

    render() {

        return (
            <View style={styles.flexOne}>

                <ImageBackground style={styles.flexOne}
                    source={this.bgImage}
                    resizeMode='cover' >

                    <TrasnsperantFixedHeader
                        backAction={() => this.onBackAction()} />


                    <View style={styles.flexpointFifteen}>

                        <View style={styles.HeadingView}>

                            <Text style={styles.HeadingTitle}>DTH </Text>

                            <Text style={styles.SubHeadTitle}> Select DTH Provider </Text>

                        </View>
                    </View>


                    <View style={styles.SeacrhBarView}>

                        {/* DTH Name & ICON */}
                        <View style={styles.DatacardSubView}>


                            <View style={styles.textContainer}>

                                <Text style={styles.username}>{this.state.DTH_Name}</Text>

                            </View>

                            <View style={styles.container1}>
                                <Image source={this.state.DTH_Icon} style={styles.image1} />
                            </View>

                        </View>


                        <ScrollView>


                            <View style={styles.ScrollViewStyle}>


                                {/* Operator Circle */}
                                <View style={styles.InputBoxDesign}
                                >
                                    <TouchableOpacity style={styles.AccountTypeTouchable}
                                        onPress={() => this.setState({ isModalVisible: true, labelText: 'Select Account' })}
                                    >

                                        <View style={styles.flexOne}>
                                            <Text style={styles.AccTypeMainText}> Select Circle </Text>

                                            <Text style={styles.AccTypeSubText}>  {this.state.Selected_CircleName} </Text>
                                        </View>

                                        <View style={styles.AccTypeIconStyle} >
                                            <Arrowdown height={15} width={15} />
                                        </View>


                                    </TouchableOpacity>
                                    {
                                        selectAccount(
                                            this.state.isModalVisible,
                                            this.CircleList,
                                            this.onSelectCircle,
                                            "Select Circle",
                                            this.state.Selected_CircleName,
                                            "Circle",

                                        )
                                    }

                                </View>


                                {/* Account Type */}
                                <View style={[styles.InputBoxDesign, { marginTop: 10 }]}
                                >
                                    <TouchableOpacity style={styles.AccountTypeTouchable}
                                        onPress={() => this.setState({ isModalVisible1: true, labelText: 'Select Account' })}
                                    >

                                        <View style={styles.flexOne}>
                                            <Text style={styles.AccTypeMainText}>
                                                Select Account
                                            </Text>

                                            <Text style={styles.AccTypeSubText}>
                                                {this.state.Selected_AC_NO}

                                            </Text>
                                        </View>

                                        <View style={styles.AccTypeIconStyle} >
                                            <Arrowdown height={15} width={15} />
                                        </View>


                                    </TouchableOpacity>

                                    {
                                        selectAccount(
                                            this.state.isModalVisible1,
                                            this.AccountList.filter(item => item.ACTYPE !== 'LOAN ACCOUNT' && item.ACTYPE !== 'FIXED DEPOSIT ACCOUNT'),
                                            this.onSelectAccount,
                                            "Select Account",
                                            this.state.Selected_AC_NO,
                                            "Account",
                                        )
                                    }
                                </View>

                                <View
                                    style={styles.AvailableBalanceMainViewStyle} >

                                    <View
                                        style={styles.AvailableBalanceSubViewStyle}>
                                        <Balance width={32} height={32} />
                                    </View>

                                    <View>
                                        <Text style={styles.AvailableBalanceTxt}>
                                            Available Balance
                                        </Text>

                                        <Text style={styles.AvailableBalanceTypetxt}>
                                            {this.state.Selected_Balance.startsWith('-') ? ("₹ " + this.state.Selected_Balance.replace('-', '') + " Cr") : ("₹ " + this.state.Selected_Balance + " Dr")}

                                        </Text>
                                    </View>
                                </View>

                                {/* Dish Number */}
                                <View style={styles.DataCardViewStyle}>
                                    <TextInput
                                        style={styles.DatacardTextInput}
                                        theme={{
                                            colors: {
                                                placeholder: '#DFE1E8',
                                                text: this.props.textColor,
                                                primary: this.props.SecondaryColor,
                                                underlineColor: 'transparent',
                                                background: 'white',
                                            },
                                            roundness: 8,
                                        }}
                                        value={this.state.SubscriberNumber}
                                        onChangeText={SubscriberNumber => {
                                            this.setState({ SubscriberNumber, });
                                        }}
                                        label="Subscriber Number"
                                        keyboardType='numeric'
                                        mode='outlined'
                                        autoComplete='off'
                                        placeholder='Subscriber Number'
                                        returnKeyType='next'
                                        onSubmitEditing={() => { this.BillAmt.focus(); }}
                                        blurOnSubmit={false}
                                    />

                                    {this.state.Subscriber_error !== '' && (<Text style={styles.ErrorDisplay}>{this.state.Subscriber_error}</Text>)}

                                </View>


                                {/* Bill Amount */}
                                <View style={styles.DataCardViewStyle}>
                                    <TextInput
                                        style={styles.DatacardTextInput}
                                        theme={{
                                            colors: {
                                                placeholder: '#DFE1E8',
                                                text: this.props.textColor,
                                                primary: this.props.SecondaryColor,
                                                underlineColor: 'transparent',
                                                background: 'white',
                                            },
                                            roundness: 8,
                                        }}
                                        label="Enter Bill Amount"
                                        keyboardType='numeric'
                                        // maxLength={5}
                                        value={this.state.BillAmount}
                                        onChangeText={BillAmount => {
                                            this.setState({ BillAmount });
                                        }}
                                        mode='outlined'
                                        // autoComplete='off'
                                        ref={(input) => { this.BillAmt = input; }}
                                        placeholder='Enter Bill Amount'
                                        returnKeyType='next'
                                        onSubmitEditing={() => { this.confirmBill.focus(); }}
                                        blurOnSubmit={false}

                                    />

                                    {this.state.BillAmountError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.BillAmountError}</Text>)}

                                </View>


                                <View style={styles.ConfirmBillView}>
                                    <TextInput
                                        style={styles.DatacardTextInput}
                                        theme={{
                                            colors: {
                                                placeholder: '#DFE1E8',
                                                text: this.props.textColor,
                                                primary: this.props.SecondaryColor,
                                                underlineColor: 'transparent',
                                                background: 'white',
                                            },
                                            roundness: 8,
                                        }}
                                        label="Confirm Bill Amount"
                                        keyboardType='numeric'
                                        maxLength={5}
                                        mode='outlined'
                                        value={this.state.ConfirmBillAmount}
                                        onChangeText={ConfirmBillAmount => {
                                            this.setState({ ConfirmBillAmount, });
                                        }}
                                        ref={(input) => { this.confirmBill = input; }}
                                        placeholder="Confirm Bill Amount"

                                    />

                                    {this.state.ConfirmBillAmountError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.ConfirmBillAmountError}</Text>)}

                                </View>


                                {/* PlatformCharge */}
                                <View style={styles.PlatformChargesStyle}>
                                    <Text
                                        style={styles.PlatformChargesTextStyle}
                                    >Platform Charges : ₹ {this.state.PlatformCharges} </Text>
                                </View>




                                {/* Button */}
                                <CardView
                                    cardElevation={2}
                                    cardMaxElevation={2}
                                    cornerRadius={12}
                                    style={styles.BtnStyle}>
                                    <TouchableOpacity
                                       style={[styles.BtnTouchableStyle, { backgroundColor: this.props.PrimaryColor, }]}
                                        onPress={this.handleValidation}
                                    >
                                            <Text style={styles.BtnTextStyle}>  Submit </Text>
                                    </TouchableOpacity>
                                </CardView>


                            </View>
                        </ScrollView>
                    </View>


                    {
                        /* DTH Dialog */
                        Dialog_DTH_Payment(this.state.confirmDialog, this.PressNo, this.PressYes, this.props.PrimaryColor, this.props.SecondaryColor, this.state.DTH_Name, this.state.DTH_Icon, this.state.ConfirmBillAmount, this.state.PlatformCharges)
                    }


                    {
                        /* InsufficentBalance Dialog */
                        DialogInsufficientBalance(this.state.InsufficientBalanceDialog, this.PressOK, this.props.SecondaryColor,)
                    }


                </ImageBackground>

            </View>


        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DTHBillPayment);


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
  

    
    textContainer: {
        flex: 2,
       
    },
    username: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000'
    },



    container1: {
        width: 50,
        height: 50,
        borderRadius: 50, // Half of the width and height to make it circular
        overflow: 'hidden',
        elevation: 2, // Set the elevation for the shadow effect
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    image1: {
        width: '100%', // 90% of the container width
        height: '100%', // 90% of the container height
        resizeMode: 'cover',

    },
    ErrorDisplay: { color: "#FF0000", marginLeft: 5, fontSize: 12 },

    flexOne:
        { flex: 1 },

    flexpointFifteen:
    {
        flex: 0.15
    },

    HeadingView:
    {
        marginLeft: 25,
        marginTop: 15,
    },

    HeadingTitle:
    {
        fontSize: 22,
        color: 'black',
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: colors.white,
    },

    SubHeadTitle:
    {
        fontSize: 15,
        color: 'black',
        textAlign: 'left',
        fontFamily: strings.fontMedium,
        color: colors.white,
    },

    SeacrhBarView:
    {
        flex: 0.85,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },

    DatacardSubView:
    {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        width: width - 50,
        marginTop: 20,
    },
    ScrollViewStyle:
    {
        width: width - 50,
        alignItems: 'center'
    },

    AccountTypeTouchable:
    {
        flexDirection: 'row',
        alignItems: 'center'
    },
    AccTypeMainText:
    {
        color: colors.accTextColor + '80',
        marginLeft: 15,
        fontSize: 10,
        fontFamily: strings.fontMedium
    },
    AccTypeSubText:
    {
        color: colors.accTextColor,
        marginLeft: 15,
        fontSize: 15,
        fontFamily: strings.fontMedium
    },
    AccTypeIconStyle:
    {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },

    AvailableBalanceMainViewStyle:
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
    AvailableBalanceSubViewStyle:
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

    AvailableBalanceTxt:
    {
        color: colors.accTextColor,
        fontSize: 15,
        fontFamily: strings.fontMedium
    },
    AvailableBalanceTypetxt:
    {
        color: colors.accTextColor,
        fontSize: 17,
        fontFamily: strings.fontMedium,
        flexWrap: 'wrap',
        width: width - 50,
        fontWeight: 'bold',
        marginTop: 2
    },

    DataCardViewStyle:
    {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 5,
    },

    DatacardTextInput:
    {
        lineHeight: 40,
        height: 48,
        width: width - 50,
    },

    ConfirmBillView:
    {
        flexDirection: 'column',
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 5,
    },

    PlatformChargesStyle:
    {
        marginTop: 5,
        width: width - 60
    },

    PlatformChargesTextStyle:
    {
        fontSize: 14,
        color: "#1f3c66",
        textAlign: "left"
    },

    BtnStyle:
    {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 20,
    },

    BtnTouchableStyle:
    {
        padding: 15,
        width: width - 50,
        justifyContent: 'center',
        borderRadius: 12,
    },
    BtnTextStyle:
    {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15
    },



});
