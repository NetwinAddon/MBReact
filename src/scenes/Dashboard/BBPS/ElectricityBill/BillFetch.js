
//  RGP

import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    FlatList,
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
    RenderLoader,
} from '../../../../App';
import Arrowdown from '../../../../assets/icons/dashboardIcons/arrow_down.svg';
import { TextInput } from 'react-native-paper';
import Balance from '../../../../assets/icons/Balance.svg'
import MyValidator from '../../../../common/MyValidator.js';
import TrasnsperantFixedHeader from '../../../../components/TrasnperantFixedHeader';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';
import { CustomPopupsRecharge } from '../../../../components/CustomPopupsRecharge.js';
import BBPS from '../../../../assets/icons/BBPS_Logo.svg'
import Constants from '../../../../common/Constants.js';
import Snackbar from 'react-native-snackbar';
import APIUrlConstants from '../../../../common/APIUrlConstants.js';
import { _toEncrypt, decryptData } from '../../../../common/util.js';
import { ConfirmBillPopup } from './ConfirmBillPopup.js';
import TrasnperantFixedHeader from '../../../../components/TrasnperantFixedHeader';

class BillFetch extends Component {


    constructor(props) {
        super(props);

        this.AccountList = []
        this.TempAcc = []
        this.SavingAccountList = []
        this.RemainingAccountList = []
        this.state = {
            FinalBillerParaList: [],
            SERVICE_TYPE: 'BILLFETCH',
            ProviderName: this.props.route.params.ProviderName,
            ID: this.props.route.params.ID,
            LOGO: this.props.route.params.LOGO,
            BILLERSRNO: this.props.route.params.BILLERSRNO,
            BillerFetchRequirement: this.props.route.params.BILLERFETCHREQUIREMET,
            BillerParaList: [],
            isModalVisible: false,
            MobNumError: '',
            BillUnitError: '',
            ConsumerNumError: '',
            BillAmtError: '',
            MobNum: Constants.MobileNumber,
            BillAmt: '',
            BillUnit: '',
            ConsumerNo: '',
            labelText: '',
            amount: '',
            ParametersAlert: false,
            searchTerm: '',
            confirmDialog: false,
            Selected_ACMASTCODE: '',
            Selected_AC_NO: '',
            Selected_Balance: '',
        };

    }



    componentDidMount() {
        this.GetAccountDetailsApi()
        this.getBillParamsList()
    }

    getBillParamsList = async () => {
        const Headers =
        {
            ProdCD: Constants.ProdCD,
            BankCD: Constants.BankCode,
            OprCD: 'GETBILLPARALIST',
            Content_Type: 'application/json',
            REQ_TYPE: 'POST'
        };
        const jsonReq =
        {
            CUSTOMER_ID: Constants.GMST_CODE,
            BILLERID: this.state.ID,
            CORPID: Constants.BankCode,
            SEC_KEY: Constants.SecretKey,
            divId: this.props.DeviceId,
            secKey: Constants.SecretKey
        }
        console.log('finalRes--' + JSON.stringify(jsonReq))
        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq))

        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: JSON.stringify(jsonValue),
        }
        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {

                var responseData = await decryptData(response)
                var newRes = responseData.slice(16)

                var finalRes = JSON.parse(newRes)
                console.log('finalRes--' + JSON.stringify(finalRes.BILLERPARA))


                if (finalRes.SUCCESS === "TRUE") {



                    if (finalRes.hasOwnProperty("BILLERPARA")) {

                        console.log('tur' + finalRes.BILLERPARA)
                        this.setState({ BillerParaList: finalRes.BILLERPARA })



                        if (finalRes.length === 0) {
                            Snackbar.show({
                                text: 'No Record found',
                                duration: Snackbar.LENGTH_SHORT,
                                backgroundColor: 'red'
                            });
                        }


                    }
                }



                else {

                    const Msg = finalRes.RESULT
                    // // ToastAndroid.show(Msg, ToastAndroid.SHORT)
                    Snackbar.show({
                        text: 'Something went to wrong',
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'red'
                    });

                    // this.props.navigation.replace('loginTypeSelectScreen')


                }

            })
    }



    GetAccountDetailsApi() {


        //const Headers = APIUrlConstants.Headers("GETACSUM");
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
        console.log("GetAccountDetailsApi URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("GetAccountDetailsApi Json:- " + JSON.stringify(Body));
        console.log("");

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

                            console.log(acTypeVariable)

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
                            Selected_Balance: Constants.Selected_BALANCE,
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

        console.log("GetAllowableBalance URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("GetAllowableBalance Api:- " + JSON.stringify(Body));
        console.log("");

        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                var responseData = response

                console.log("GetAllowableBalance Response:- " + JSON.stringify(responseData));

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


    hideDialog = () => {
        this.setState({ confirmDialog: false })
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
        console.log('hellooooo')
    }

    toReview() {
        navigation.navigate(this, 'quickPayWithinBankOtherAccount')
    }

    onSelectAccount = (value) => {


        this.setState({ isModalVisible: false, })

        if (value.AC_NO === null || value.AC_NO === undefined || value.AC_NO.trim() === "") {

        }
        else {
            this.setState({
                Selected_AC_NO: value.AC_NO,
                Selected_ACMASTCODE: value.ACMASTCODE,
                Selected_Balance: value.BALANCE,

            })

            this.GetAllowableBalance(value.AC_NO, value.ACMASTCODE)

        }

    }

    fetchBilAPI = async () => {
        const Headers =
        {
            ProdCD: Constants.ProdCD,
            BankCD: Constants.BankCode,
            OprCD: 'PUTBILLFETCHREQ',
            Content_Type: 'application/json',
            REQ_TYPE: 'POST'
        };

        const finalJSON = {
            'BILLERPARA': this.state.FinalBillerParaList,
            CUSTOMER_ID: Constants.GMST_CODE,
            BILLERID: this.state.ID,
            BILLERSRNO: this.state.BILLERSRNO,
            CORP_ID: Constants.BankCode,
            SEC_KEY: Constants.SecretKey,
            ACMASTCODE: this.state.Selected_ACMASTCODE,
            AC_NO: this.state.Selected_AC_NO,
            GMSTCODE: Constants.GMST_CODE,
            MOBILENO: this.state.MobNum,
            BRANCHCODE: Constants.BRANCH_CODE,
            REQ_TYPE: this.state.SERVICE_TYPE,
            BILLAMT: this.state.BillAmt,
            divId: this.props.DeviceId,
            secKey: Constants.SecretKey
        };


        let jsonValue = await _toEncrypt(JSON.stringify(finalJSON))

        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: JSON.stringify(jsonValue),
        }

       
        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                var responseData = await decryptData(response)
                var newRes = responseData.slice(16)
                var finalRes = JSON.parse(newRes)
                console.log("finalRes" + JSON.stringify(finalRes))
                if (finalRes.SUCCESS === "TRUE") {

                    this.props.navigation.navigate('billPayment', {
                        ProviderName: this.state.ProviderName,
                        ID: this.state.ID,
                        LOGO: this.state.LOGO,
                        ACC_NO: this.state.Selected_AC_NO,
                        ResJSON: finalRes,
                        MobNum: this.state.MobNum,
                        BillerFetchRequirement: this.state.BillerFetchRequirement,
                        BILLERSRNO: this.state.BILLERSRNO,
                        BILLERID: this.state.ID,
                        ACMASTCODE: this.state.Selected_ACMASTCODE,
                        BillerParaList: this.state.FinalBillerParaList,
                        Selected_Balance: this.state.Selected_Balance
                    })

                }
                else {

                    const Msg = finalRes.RESULT
                    Snackbar.show({
                        text: Msg,
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'red'
                    });


                }

            })
    }
    onClearAll = () => {
        this.setState({ MobNum: '', BillUnit: '', ConsumerNo: '', MobNumError: '', BillUnitError: '', ConsumerNumError: '' })
    }
    PressYes = () => {

        this.setState({ confirmDialog: false })

        this.fetchBilAPI();

    }

    PressNo = () => {

        this.setState({ confirmDialog: false })

    }

    onSubmitClick = () => {

        var result = this.isValidate()

        if (result) {
            // this.fetchBilAPI()


            this.setState({ confirmDialog: true })

        }
    }


    isValidate() {

        var result = true;
        var billAmt = this.state.BillAmt
        const amtS = parseFloat(billAmt.includes('.') ? billAmt : billAmt + '.0');

        // Now, 'amtS' holds the converted double value

        console.log('----' + this.state.FinalBillerParaList.length !== 0 && this.state.BillerParaList.length === 0)
        if (this.state.FinalBillerParaList.length !== this.state.BillerParaList.length) {
            this.setState({ ParametersAlert: true });
            result = false;
        }

        this.setState({ MobNumError: '', BillAmtError: '', });
        if (this.state.BillerFetchRequirement === 'NOT_SUPPORTED') {
            if (!MyValidator.isEmptyField(billAmt).isValid) {
                this.setState({ BillAmtError: "Please Enter Bill Amount!" });
                result = false;
            }
        }
        if (this.state.MobNum.length < 10 || !MyValidator.isEmptyField(this.state.MobNum).isValid) {
            this.setState({ MobNumError: "Please enter a valid mobile number!" });
            result = false;
        }

        // if (!MyValidator.isEmptyField(this.state.BillUnit).isValid) {
        //     this.setState({ BillUnitError: "Please Enter Billing Unit!" });
        //     result = false;
        // }

        // if (!MyValidator.isEmptyField(this.state.ConsumerNo).isValid) {
        //     this.setState({ ConsumerNumError: "Please Enter Consumer Number!" });
        //     result = false;
        // }

        return result;
    }


    renderTextInputItem = ({ item }) => {
        const Paralist = JSON.parse(item);
        const updateParalist = (text) => {
            const updatedParalist = { ...Paralist, BILLERPARAVALUE: text };
            console.log('updatedParalist' + updatedParalist)
            const index = this.state.FinalBillerParaList.findIndex(item => item.BILLERPARASRNO === Paralist.BILLERPARASRNO);
            console.log(index)
            if (index !== -1) {
             
                this.setState(prevState => ({
                    FinalBillerParaList: prevState.FinalBillerParaList.map((item, idx) => {
                        if (idx === index) {
                            return updatedParalist; 
                        }
                        return item; 
                    })
                }));
            } else {
                this.setState(prevState => ({
                    FinalBillerParaList: [...prevState.FinalBillerParaList, updatedParalist]
                }));
            }
        };

        return (
            <View style={styles.textInputView}>
                <TextInput
                   style={styles.billAmtInput}
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
                    label={Paralist.PARAMNAME}
                    keyboardType={Paralist.DATATYPE}
                    maxLength={parseInt(Paralist.MAXLENGTH)}
                    manLength={parseInt(Paralist.MINLENGTH)}
                    value={item.value}
                    onChangeText={(text) => updateParalist(text)} // Call updateParalist function
                    mode='outlined'
                />

            </View>
        );
    };


    handleTextInputChange = (id, text) => {
        this.setState((prevState) => ({
            textInputsData: prevState.textInputsData.map((item) =>
                item.id === id ? { ...item, value: text } : item
            ),
        }));
    };

    render() {


        return (

            <View style={styles.mainContainer}>
                <ImageBackground style={styles.mainContainer} source={this.bgImage} resizeMode='cover'>
                    <TrasnperantFixedHeader backAction={() => this.onBackAction()} />
                    <View style={styles.headingContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.title}>Electricity Bill Pay
                            </Text>
                            <Text style={styles.subTitle}>Select Your Electricity Provider
                            </Text>
                        </View>
                    </View>


                    <View style={styles.containerView1}>
                        <View style={styles.headerView}>
                            <View style={styles.textContainer}>
                                <Text style={styles.username}>{'Bill Fetch'}</Text>
                            </View>
                            <View>
                                <BBPS />
                            </View>
                        </View>


                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                        >
                            <View style={styles.containerView}>
                                <View style={styles.InputBoxDesign}
                                >
                                    <TouchableOpacity style={styles.touchableOpacity}
                                        onPress={() => this.setState({ isModalVisible: true, labelText: 'Select Account' })}
                                    >
                                        <View style={styles.mainContainer}>
                                            <Text style={styles.selectAccountText}>
                                                Select Account
                                            </Text>
                                            <Text style={styles.selectedAccountNumberText}>
                                                {this.state.Selected_AC_NO}
                                            </Text>
                                        </View>
                                        <View style={styles.iconView}>
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

                                <View style={styles.balanceView}>
                                    <View style={styles.balIconContainer}>
                                        <Balance width={35} height={35} />
                                    </View>

                                    <View>
                                        <Text style={styles.balanceText}>
                                            Available Balance
                                        </Text>

                                        <Text style={styles.amountText}>
                                            {strings.rupee + this.state.Selected_Balance}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.textInputView}>
                                    <TextInput
                                        style={styles.input}
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
                                        label="Registered Mobile Number"
                                        keyboardType='numeric'
                                        maxLength={10}
                                        value={this.state.MobNum}
                                        onChangeText={MobNum => {
                                            this.setState({ MobNum });
                                        }}
                                        mode='outlined'
                                    />
                                    {this.state.MobNumError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.MobNumError}</Text>)}
                                </View>
                                <View style={styles.billerInputContainer}>
                                    <View style={styles.billerInputView}>
                                        <View style={styles.iconContainer}>
                                            <View style={styles.simIcon}>
                                                <Image source={this.state.LOGO} style={styles.iconStyle}/>
                                            </View>
                                        </View>
                                        <View style={styles.textContainer}>
                                            <Text style={styles.providerName}>{this.state.ProviderName}</Text>
                                            <Text style={styles.idText}>ID: {this.state.ID}</Text>
                                        </View>
                                    </View>
                                    <FlatList
                                        data={this.state.BillerParaList}
                                        renderItem={this.renderTextInputItem}
                                        keyExtractor={(item) => item.id}
                                    />
                                    {
                                        this.state.ParametersAlert === true &&
                                        (<Text style={styles.alertText}>Please Confirm the parameters</Text>)

                                    }
                                    {this.state.BillerFetchRequirement === 'NOT_SUPPORTED' ? (
                                        <View style={styles.textInputView}>
                                            <TextInput
                                                style={styles.billAmtInput}
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
                                                value={this.state.BillAmt}
                                                onChangeText={BillAmt => {
                                                    this.setState({ BillAmt });
                                                }}
                                                mode='outlined'
                                            />
                                            {this.state.BillAmtError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.BillAmtError}</Text>)}
                                        </View>
                                    ) : (
                                        null
                                    )}
                                    <View>
                                        <Text></Text>
                                    </View>
                                </View>
                                <CardView
                                    cardElevation={2}
                                    cardMaxElevation={2}
                                    cornerRadius={12}
                                    style={styles.buttonCardContainer}>
                                    <TouchableOpacity
                                        style={styles.button}
                                        //onPress={() => this.props.navigation.navigate('billPayment', { ProviderName: this.props.route.params.ProviderName, ID: this.props.route.params.ID })}
                                        onPress={this.onSubmitClick}
                                    >
                                        <Text style={styles.buttonText}>
                                            Fetch Bill
                                        </Text>
                                    </TouchableOpacity>
                                </CardView>

                            </View>

                        </ScrollView>

                    </View>

                </ImageBackground>
                {
                    ConfirmBillPopup(this.state.confirmDialog, this.PressNo, this.PressYes, this.props.PrimaryColor, this.props.SecondaryColor, this.state.ProviderName, this.state.LOGO, this.state.FinalBillerParaList, this.state.BillAmt)
                }
                <RenderLoader />
            </View>


        );

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BillFetch);


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    headingContainer: {
        flex: 0.15,
    },
    selectAccountText: {
        color: colors.accTextColor + '80',
        marginLeft: 15,
        fontSize: 10,
        fontFamily: strings.fontMedium
    },
    selectedAccountNumberText: {
        color: colors.accTextColor,
        marginLeft: 15,
        fontSize: 15,
        fontFamily: strings.fontMedium
    },
    iconView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },
    balanceView: {
        height: 75,
        width: width - 50,
        borderRadius: 10,
        borderColor: 'black',
        backgroundColor: '#e8f1f8',
        alignItems: 'center',
        marginTop: 15,
        flexDirection: 'row',
    },
    balIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: 'white',
        marginLeft: 10,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceText: {
        color: colors.accTextColor,
        fontSize: 14,
        fontFamily: strings.fontMedium,
    },
    amountText: {
        color: colors.accTextColor,
        fontSize: 16,
        fontFamily: strings.fontMedium,
        flexWrap: 'wrap',
        width: 245,
        fontWeight: 'bold',
        marginTop: 5,
    },
    textInputView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        lineHeight: 40,
        height: 48,
        width: width - 50,
        marginTop: 10,
    },
    billAmtInput: {
        lineHeight: 40,
        height: 48,
        width: width - 60,
        marginTop: 5,
    },
    billerInputContainer: {
        borderRadius: 12,
        backgroundColor: "#fff",
        shadowColor: "rgba(31, 60, 102, 1)",
        shadowRadius: 20,
        elevation: 10,
        shadowOpacity: 0.5,
        flex: 1,
        width: width - 30,
        marginTop: 20,
    },
    billerInputView: {
        flexDirection: 'row',
        padding: 10,
        // borderBottomWidth: 1,
        // borderBottomColor: '#ddd',
        width: width - 50,
    },
    innerContainer: {
        marginLeft: 25,
        marginTop: 15,
    },
    title: {
        fontSize: 22,
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: colors.white,
    },
    subTitle: {
        fontSize: 15,
        textAlign: 'left',
        fontFamily: strings.fontMedium,
        color: colors.white,
    },
    containerView1: {
        flex: 0.85,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    headerView: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        width: width - 50,
        marginTop: 5,
    },
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
    touchableOpacity: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    container: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        width: width - 50,
    },
    iconContainer: {
        flex: 1,
    },
    iconStyle: { width: '100%', height: '100%' },
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
        marginLeft: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
        flex: 3.5,
    },
    providerName: {
        fontSize: 14,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#000",
        textAlign: "left",
    },
    idText: {
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#929cac",
        textAlign: "left",
        width: 130,
    },
    alertText: {
        color: "#FF0000",
        marginLeft: 5,
        fontSize: 12,
        width: width - 50,
        textAlign: 'center',
    },
    username: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000'
    },
    scrollView: { width: '100%', flex: 1 },
    containerView: {
        width: width - 50,
        alignItems: 'center'
    },
    ErrorDisplay: {
        color: "#FF0000",
        marginLeft: 5,
        fontSize: 12,
        marginTop: 3,
    },

    buttonCardContainer: {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 20,
    },
    button: {
        padding: 15,
        width: width - 50,
        backgroundColor: colors.btnColor,
        justifyContent: 'center',
        borderRadius: 12,
    },
    buttonText: {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15,
    },
});
