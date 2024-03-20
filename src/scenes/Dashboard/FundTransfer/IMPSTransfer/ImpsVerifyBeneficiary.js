import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    BackHandler,
    KeyboardAvoidingView,
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
    RenderLoader,
} from '../../../../App';
import Arrowdown from '../../../../assets/icons/dashboardIcons/arrow_down.svg';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';
import MyValidator from '../../../../common/MyValidator';
import OtpInputs from 'react-native-otp-inputs';
import { QuickPayCustomPopupDropDownForLoan } from '../../../../components/QuickPayCustomPopupDropDownForLoan';
import APIUrlConstants from '../../../../common/APIUrlConstants';
import { _toEncrypt, decryptData } from '../../../../common/util';
import Constants from '../../../../common/Constants';
import Snackbar from 'react-native-snackbar';
import TrasnperantFixedHomeHeader from '../../../../components/TrasnperantFixedHomeHeader';
import NetInfo from '@react-native-community/netinfo';
import { DialogBeneficiaryPopup } from '../../../../components/DialogBeneficiaryPopup';

class ImpsVerifyBeneficiary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isQuickModalVisible: false,
            accType: '',
            beneficiaryAccType: 'Search or Select Beneficiary A/c',
            labelText: '',
            fromAcc: '',
            benificiaryAcc: '',
            benificiaryAccTitle: '',
            fromAccAcmastCode: '',
            isClick: '',
            callFrom: 'Verify Beneficiary',
            accounList: props.route.params.accList,
            myJsonArray: [],
            isBeneficiaryPopupVisible: false,
            myJsonArrayforBeneficiaryList: [],
            otp: '',
            error_beneficiaryAcc: '',
            searchTerm: '',
            filteredData: [],
            bnfId: '',
            timer: 45,
            OTPcount: 0,
            selectdBenAcNo: '',
            bnfIfsc: '',
            otp_length: '',
            errorCount: 0,
        };
        this.interval = null;
        this.shwoingData = []
    }
    componentDidMount() {
        const formattedData = [];
        this.state.accounList.forEach(item => {
            if (['SAVING ACCOUNT', 'LOAN ACCOUNT', 'CURRENT ACCOUNT'].includes(item.ACTYPE)) {
                const existingType = formattedData.find(data => data.title === item.ACTYPE);
                if (existingType) {
                    existingType.data.push({ label: `${item.AC_NO}`, bal: `${item.BALANCE.startsWith('-') ? ("₹" + item.BALANCE.replace('-', '') + " Cr") : ("₹" + item.BALANCE + " Dr")}`, acmastcode: `${item.ACMASTCODE}` });
                } else {
                    formattedData.push({
                        title: item.ACTYPE,
                        data: [{ label: `${item.AC_NO}`, bal: `${item.BALANCE.startsWith('-') ? ("₹" + item.BALANCE.replace('-', '') + " Cr") : ("₹" + item.BALANCE + " Dr")}`, acmastcode: `${item.ACMASTCODE}` }],
                    });
                }
            }

        });
        this.shwoingData.push(formattedData)
        this.shwoingData.map((person, index) => {
            if (['saving account', 'loan account', 'current account'].includes(Constants.Selected_ACTYPE)) {
                this.setState({ myJsonArray: person, accType: Constants.Selected_AC_NO, fromAccAcmastCode: Constants.Selected_ACMASTCODE, })
                this.GetBeneficiaryList(Constants.Selected_ACMASTCODE, Constants.Selected_AC_NO)
            }
            else {
                this.setState({ myJsonArray: person, accType: person[index].data[index].label, fromAccAcmastCode: person[index].data[index].acmastcode, })
                this.GetBeneficiaryList(person[index].data[index].acmastcode, person[index].data[index].label)
            }
        })

    }
    toggleModal = () => {
        this.setState({ isBeneficiaryPopupVisible: false })
    };
    PressYes = (item1, item2) => {
        this.toggleModal();
        this.setState({ beneficiaryAccType: item1.BENF003, benificiaryAcc: item1.BENF003, benificiaryAccTitle: item1.BENF009, isClick: item2, bnfId: item1.BENF001, bnfMobNo: item1.BENF016, selectdBenAcNo: item1.BENF008, bnfIfsc:item1.BENF007 })
        this.SendOtpRequest(item1.BENF001, '4', item1.BENF016);
    }
    componentDidUpdate() {
        if (this.state.timer === 0) {
            clearInterval(this.interval);
        }
    }
    checkInternetConnection = async () => {
        try {
            const state = await NetInfo.fetch();
            const isConnected = state.isConnected;
            return isConnected;
        } catch (error) {
            console.error("Error checking internet connection:", error);
            return false;
        }
    };
    componentWillUnmount() {
        clearInterval(this.interval);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    startTimer = () => {
        this.timerInterval = setInterval(this.updateTimer, 1000);
    };

    updateTimer = () => {
        this.setState((prevState) => ({
            timer: prevState.timer - 1,
        }), () => {
            if (this.state.timer === 0) {
                clearInterval(this.timerInterval);
                this.setState({ timer: "00" })
            }
        });
    };
    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg

    onBackAction() {
        navigation.goBack(this)
    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        navigation.goBack(this)
        return true;
    };

    onSelectAccount = (value, title, acmastcode, acName) => {

        this.setState({ isQuickModalVisible: false })
        if (acmastcode === null || acmastcode === undefined || acmastcode.trim() === "") {

        }
        else {
            this.setState({ accType: value, fromAcc: value, fromAccAcmastCode: acmastcode })
            this.GetBeneficiaryList(acmastcode, value)
        }
    }

    toCallSubmit() {
        const result = this.ValidateForm();
        if (result) {
            this.SubmitRequest()
        }
    }

    handleSearch = searchTerm => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filteredData = this.state.myJsonArrayforBeneficiaryList
            .filter(item => {
                const lowerCaseName = item.BENF009.toLowerCase();
                return lowerCaseName.includes(lowerCaseSearchTerm);
            })
            .map(item => {
                return {
                    ...item,
                    highlightedName: (
                        <this.HighlightedText
                            text={item.BENF009}
                            searchTerm={lowerCaseSearchTerm}
                            highlightColor='Yellow'
                        />
                    ),
                };
            });

        this.setState({
            searchTerm,
            filteredData,
        });
    };


    HighlightedText = ({ text, searchTerm, highlightColor }) => {
        const lowerCaseText = text.toLowerCase();
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        const parts = lowerCaseText.split(new RegExp(`(${lowerCaseSearchTerm})`, 'gi'));

        return (
            <Text>
                {parts.map((part, index) => (
                    <Text
                        key={index}
                        style={
                            part.toLowerCase() === lowerCaseSearchTerm
                                ? { color: highlightColor, fontWeight: 'bold' }
                                : {}
                        }
                    >
                        {part}
                    </Text>
                ))}
            </Text>
        );
    };


    ValidateForm() {

        var result = true;
        this.setState({ error_beneficiaryAcc: '' });
        if (this.state.beneficiaryAccType === 'Search or Select Beneficiary A/c') {
            this.setState({ error_beneficiaryAcc: 'Select Beneficiary A/c' });
            result = false;
        }
        if (!MyValidator.isEmptyField(this.state.otp).isValid) {
            Snackbar.show({
                text: 'Please enter valid otp',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red'
            });
            result = false;
        }
        if (!MyValidator.isEmptyField(this.state.benificiaryAccTitle).isValid) {
            Snackbar.show({
                text: 'Please select beneficiary a/c number',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red'
            });
            result = false;
        }
        return result;
    };

    GetBeneficiaryList = async (acmastcode, acNo) => {
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {
            try {
                const Headers = APIUrlConstants.Headers("GETIMPSLIST");
                const jsonReq =
                {
                    customerId: Constants.GMST_CODE,
                    CORPID: Constants.BRANCH_CODE,
                    SEC_KEY: Constants.SecretKey,
                    divId: this.props.DeviceId,
                    secKey: Constants.SecretKey,
                    acMastCode: acmastcode,
                    acNo: acNo,
                }

                let jsonValue = await _toEncrypt(JSON.stringify(jsonReq))

                const Body =
                {
                    PARACNT: "1",
                    PARA1_TYP: "STR",
                    PARA1_VAL: jsonValue,

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
                        if (finalRes != null) {
                            const acdtlsArray = finalRes.Acdtls.map(item => JSON.parse(item.replace(/\\/g, '')));
                            this.setState({ myJsonArrayforBeneficiaryList: acdtlsArray, filteredData: acdtlsArray, isClick: '', benificiaryAccTitle: '' })
                        }
                        else {
                            this.setState({ myJsonArrayforBeneficiaryList: [], isClick: '', benificiaryAccTitle: '' })
                        }
                    })
            } catch (e) {
                console.log('Error: ', e)
            }
        }
        else {
            Snackbar.show({
                text: 'Internet not avaialable',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red'

            });
        }
    }

    SendOtpRequest = async (bnfId, NMODE, mob) => {
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {
            try {
                const Headers = APIUrlConstants.Headers("PUTIMPSBENFOTP");
                const jsonReq =
                {
                    customerId: Constants.GMST_CODE,
                    CORP_ID: Constants.BankCode,
                    SEC_KE: Constants.SecretKey,
                    GMSTCODE: this.state.fromAccAcmastCode,
                    MOBILENO: mob,
                    BRANCHCODE: Constants.BRANCH_CODE,
                    divId: this.props.DeviceId,
                    secKey: Constants.SecretKey,
                    bnfId: bnfId,
                    NMODE: NMODE,
                    acNo: this.state.accType,
                    bnfIfsc: this.state.bnfIfsc,
                    bnfAcno: this.state.selectdBenAcNo,
                    CALLFROM: 'IMPS'
                }

                let jsonValue = await _toEncrypt(JSON.stringify(jsonReq))

                const Body =
                {
                    PARACNT: "1",
                    PARA1_TYP: "STR",
                    PARA1_VAL: jsonValue,

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
                        if (finalRes.SUCCESS === "FALSE") {
                            const ErrorMsg = finalRes.RESULT
                            Snackbar.show({
                                text: ErrorMsg,
                                duration: Snackbar.LENGTH_SHORT,
                                backgroundColor: 'red'
                            });

                        }
                        else if (finalRes.SUCCESS === "TRUE") {
                            const SuccessMsg = finalRes.RESULT
                            Snackbar.show({
                                text: 'OTP sent successfully...',
                                duration: Snackbar.LENGTH_SHORT,
                                backgroundColor: 'green'
                            });
                            this.setState((prevState) => ({ OTPcount: prevState.OTPcount + 1 }))
                            clearInterval(this.timerInterval);
                            this.setState({ timer: 45 }, this.startTimer);

                        }

                    })
            } catch (e) {
                console.log('Error: ', e)
            }
        }
        else {
            Snackbar.show({
                text: 'Internet not avaialable',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red'

            });
        }
    }

    SubmitRequest = async () => {
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {
            try {
                const Headers = APIUrlConstants.Headers("VERIMPSBENFOTP");
                const jsonReq =
                {
                    customerId: Constants.GMST_CODE,
                    acMastCode: this.state.fromAccAcmastCode,
                    acNo: this.state.accType,
                    branchCd: Constants.BRANCH_CODE,
                    secKey: Constants.SecretKey,
                    divId: this.props.DeviceId,
                    bnfId: this.state.bnfId,
                    bnfOtp: this.state.otp,
                }

                let jsonValue = await _toEncrypt(JSON.stringify(jsonReq))

                const Body =
                {
                    PARACNT: "4",
                    PARA1_TYP: "STR",
                    PARA1_VAL: jsonValue,

                }
                console.log("SubmitOtpApi URL:- " + APIUrlConstants.BASE_URL);
                console.log("");
                console.log("SubmitOtpApi:- " + JSON.stringify(Body));
                console.log("");
                sendData(this,
                    'post',
                    APIUrlConstants.BASE_URL,
                    Headers,
                    JSON.stringify(Body),
                    async (obj, response) => {
                        var responseData = await decryptData(response)
                        var newRes = responseData.slice(16)
                        var finalRes = JSON.parse(newRes)
                        console.log("SubmitOtpApi Response:- " + JSON.stringify(finalRes));

                        if (finalRes.SUCCESS === "FALSE") {
                            this.setState(prevState => ({ errorCount: prevState.errorCount + 1 }));
                            const ErrorMsg = finalRes.RESULT
                            if (this.state.errorCount === 3) {
                                Snackbar.show({
                                  text: ErrorMsg,
                                  duration: Snackbar.LENGTH_SHORT,
                                  backgroundColor: 'red',
                                });
                                navigation.navigate(this, 'IMPSTransferMenu')
                                               
                              }
                              else
                              {
                                Snackbar.show({
                                  text: ErrorMsg + " " + "Attempts Left:-" + (Number(3) - Number(this.state.errorCount)),
                                  duration: Snackbar.LENGTH_SHORT,
                                  backgroundColor: 'red',
                                });
                              }

                        }
                        else if (finalRes.SUCCESS === "TRUE") {
                            this.setState({ errorCount: 0 });
                            const SuccessMsg = finalRes.RESULT
                            navigation.navigate(this, 'ImpsTransferSuccess', { from: this.state.callFrom })
                        }
                        else {
                            this.setState(prevState => ({ errorCount: prevState.errorCount + 1 }));
                            let res = finalRes.Acdtls;
                            let mainArry = [];
                            mainArry = res.map((jsonStr) => JSON.parse(jsonStr));
                            if (this.state.errorCount === 3) {
                                Snackbar.show({
                                  text: mainArry[0].MSGDESCR,
                                  duration: Snackbar.LENGTH_SHORT,
                                  backgroundColor: 'red',
                                });
                                navigation.navigate(this, 'IMPSTransferMenu')
                                               
                              }
                              else
                              {
                                Snackbar.show({
                                  text: mainArry[0].MSGDESCR + " " + "Attempts Left:-" + (Number(3) - Number(this.state.errorCount)),
                                  duration: Snackbar.LENGTH_SHORT,
                                  backgroundColor: 'red',
                                });
                              }
                        }

                    })
            } catch (e) {
                console.log('Error: ', e)
            }
        }
        else {
            Snackbar.show({
                text: 'Internet not avaialable',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red'

            });
        }
    }

    render() {
        const { timer } = this.state;
        return (
            <View style={styles.mainView}>

                <ImageBackground style={styles.mainView}
                    source={this.bgImage}
                    resizeMode='cover'>

                    <KeyboardAvoidingView
                        style={styles.mainView}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        enabled={true}>

                        <TrasnperantFixedHomeHeader
                            backAction={() => this.onBackAction()} />
                        <View style={styles.lableHeader}>
                            <View style={styles.lableHeaderView}>
                                <Text style={styles.verifyBeneficiaryTitle}>Verify Beneficiary
                                </Text>
                                <Text style={styles.verifyBeneficiaryDescription}>Verify Your Newly Added Beneficiary.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.subMainView}>
                            <ScrollView>
                                <View style={styles.mainSubView}>
                                    <TouchableOpacity style={styles.fromAccTouchable}
                                        onPress={() => {
                                            if (this.state.myJsonArray != null && this.state.myJsonArray.length > 0) {
                                                this.setState({ isQuickModalVisible: true, labelText: 'From A/c' })
                                            }
                                            else {
                                                Snackbar.show({
                                                    text: 'No record available..!!',
                                                    duration: Snackbar.LENGTH_SHORT,
                                                    backgroundColor: 'red'
                                                });
                                            }
                                        }}>

                                        <View style={styles.mainView}>
                                            <Text style={styles.fromAccText}>
                                                From A/c
                                            </Text>
                                            <Text style={styles.fromAccTextValue}>
                                                {this.state.accType}
                                            </Text>
                                        </View>
                                        <View style={styles.fromAccDropDown}>
                                            <Arrowdown height={15} width={15} />
                                        </View>
                                    </TouchableOpacity>
                                    {QuickPayCustomPopupDropDownForLoan(
                                        this.state.isQuickModalVisible,
                                        this.state.myJsonArray,
                                        this.onSelectAccount,
                                        this.state.labelText,
                                        this.state.accType,
                                    )}
                                </View>
                                <CardView
                                     style={styles.cardViewStyle}
                                     cardElevation={2}
                                     cardMaxElevation={2}
                                     cornerRadius={8}>
                                    <View style={styles.benficiaryAccView}>
                                        <TouchableOpacity style={styles.fromAccTouchable}
                                            onPress={() => {
                                                if (this.state.myJsonArray != null && this.state.myJsonArray.length > 0) {
                                                    if (this.state.filteredData != null && this.state.filteredData.length > 0) {
                                                        this.setState({ isBeneficiaryPopupVisible: true, labelText: 'Beneficiary A/c' })
                                                    }
                                                    else {
                                                        Snackbar.show({
                                                            text: 'No beneficiary record available..!!',
                                                            duration: Snackbar.LENGTH_SHORT,
                                                            backgroundColor: 'red'
                                                        });
                                                    }
                                                }
                                                else {
                                                    Snackbar.show({
                                                        text: 'Select From A/c',
                                                        duration: Snackbar.LENGTH_SHORT,
                                                        backgroundColor: 'red'
                                                    });
                                                }
                                            }}>
                                            <View style={styles.mainView}>
                                                <Text style={styles.fromAccTextValue}>
                                                    Search or Select Beneficiary A/c
                                                </Text>
                                            </View>
                                            <View style={styles.fromAccDropDown}>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </CardView>
                                {this.state.error_beneficiaryAcc !== '' && (<Text style={styles.ErrorDisplay}>{this.state.error_beneficiaryAcc}</Text>)}
                                {this.state.isClick === 'isClick' ?
                                    <View style={styles.dottedClickView}>
                                        <View>
                                            <View style={styles.dottedClickMainView}>
                                                <View style={styles.dottedClickMainSubView}>
                                                    <Text style={styles.beneficiaryAccDetailsText}>
                                                        Beneficiary A/c Details
                                                    </Text>
                                                    <Text style={styles.beneficiaryAccTitleText}>
                                                        {this.state.benificiaryAccTitle}
                                                    </Text>
                                                    <View style={styles.horizontalLineView} />
                                                    <Text style={styles.accNoText}>
                                                        A/c No:{this.state.selectdBenAcNo}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View> : null}
                                <Text style={[styles.enterOTPText, { color: this.props.textColor, }]}>{strings.enterOTP}
                                </Text>
                                <View style={styles.otpView}>
                                    <OtpInputs
                                        caretHidden={false}
                                        handleChange={(code) => {
                                            this.setState({ otp: code.replace(/[^0-9]/g, '') })
                                            this.setState({ otp_length: code })

                                        }}
                                        numberOfInputs={6}
                                        keyboardType="numeric"
                                        secureTextEntry={true}
                                        inputContainerStyles={{
                                            height: 45,
                                            width: 45,
                                            margin: 5,
                                            borderWidth: 1,
                                            justifyContent: 'center',
                                            backgroundColor: colors.otpBackColor,
                                            borderColor: colors.otpBorderColor,
                                            borderRadius: 8,
                                        }}
                                        focusStyles={{
                                            borderColor: this.props.themeColor,
                                        }}
                                        inputStyles={{
                                            fontSize: 15,
                                            textAlign: 'center',

                                            color: this.props.textColor,
                                        }}
                                        selectionColor={this.props.themeColor}
                                        editable={this.state.benificiaryAcc === '' ? false : true}
                                        autofillFromClipboard={false}
                                    />
                                </View>
                                {this.state.OTPcount < 3 ? (
                                    <View style={styles.resendOtpView}>
                                        {this.state.timer === "00" ?
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({ otp: '' })
                                                    this.SendOtpRequest(this.state.bnfId, "4", this.state.bnfMobNo)
                                                }}>
                                                <Text style={[styles.ResendOTPStyle, { color: this.props.PrimaryColor }]}>Resend OTP</Text>

                                            </TouchableOpacity>
                                            :
                                            <Text style={[styles.ResendOTPStyle, { color: colors.Red, marginLeft: 5 }]}>{'00.' + this.state.timer}</Text>
                                        }
                                    </View>

                                ) : null
                                }
                                <TouchableOpacity
                                    style={[styles.submitButtonTouchable, { backgroundColor: this.state.otp_length.length >= 3 ? this.props.PrimaryColor : colors.btnDisable, }]}
                                    disabled={this.state.otp_length.length >= 3 ? false : true}
                                    onPress={() => this.toCallSubmit()}
                                ><Text style={[styles.submitButtonText, { color: this.state.otp_length.length >= 3 ? colors.white : colors.btnDisableTextColor, }]}>
                                        Submit
                                    </Text>
                                </TouchableOpacity>
                            </ScrollView>
                            {
                                DialogBeneficiaryPopup(
                                    this.state.isBeneficiaryPopupVisible,
                                    this.toggleModal,
                                    this.PressYes,
                                    this.state.filteredData,
                                    this.props.SecondaryColor,
                                    this.handleSearch,
                                    this.state.searchTerm,
                                    null,
                                    'IMPS Beneficiary'
                                )
                            }
                        </View>
                        
                    </KeyboardAvoidingView>

                </ImageBackground>
                <RenderLoader />
            </View>
        );
    }
}
const styles = {
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
        marginBottom: 10,
    },
    verifyBeneficiaryTitle:
    {
        fontSize: 20,
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: colors.white,
    },
    verifyBeneficiaryDescription:
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
    mainSubView:
    {
        marginTop: 50,
        height: 48,
        width: width - 50,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DFE1E8',
        marginBottom: 10,
    },
    fromAccTouchable:
    {
        flexDirection: 'row',
        alignItems: 'center'
    },
    fromAccText:
    {
        color: colors.accTextColor + '80',
        marginLeft: 15,
        fontSize: 10,
        fontFamily: strings.fontMedium
    },
    fromAccTextValue:
    {
        color: colors.accTextColor,
        marginLeft: 15,
        fontSize: 15,
        fontFamily: strings.fontMedium
    },
    fromAccDropDown:
    {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },
    allowableBalanceText:
    {
        color: '#000000',
        marginLeft: 15,
        fontSize: 12,
        fontFamily: strings.fontMedium,
        marginTop: 10
    },
    allowableBalanceValue:
    {
        color: '#000000',
        marginLeft: 15,
        fontSize: 26,
        fontFamily: strings.fontBold
    },
    cardViewStyle:
    {
        marginTop: 5,
        marginHorizontal: 1,
        backgroundColor: colors.white,
    },
    benficiaryAccView:
    {
        height: 48,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.white,
        marginVertical: 1,
    },
    dottedClickView:
    {
        borderStyle: 'dotted',
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#93B1C8',
        marginBottom: 10,
        marginTop: 10,
    },
    dottedClickMainView:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 12,
    },
    dottedClickMainSubView:
    {
        flexDirection: 'column',
        flex: 1
    },
    beneficiaryAccDetailsText:
    {
        color: '#686868',
        marginTop: 13,
        fontFamily: strings.fontMedium,
        fontSize: 10
    },
    beneficiaryAccTitleText:
    {
        color: '#252525',
        marginTop: 2,
        fontFamily: strings.fontBold,
        fontSize: 15,
        marginBottom: 6,
    },
    horizontalLineView:
    {
        borderColor: 'black',
        borderTopWidth: 1,
        marginBottom: 6,
        height: 1,
        opacity: 0.1,
        borderStyle: 'solid',
    },
    horzontalView:
    {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    accNoText:
    {
        color: '#252525',
        fontFamily: strings.fontMedium,
        fontSize: 12,
        marginBottom:10
    },
    enterOTPText:
    {
        width: width - 50,
        marginTop: 30,
        fontSize: 25,
        textAlign: 'center',
        fontFamily: strings.fontBold,
    },
    otpView:
    {
        height: 60,
        width: width - 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    resendOtpView:
    {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    ResendOTPStyle: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: strings.fontMedium,
    },
    submitButtonTouchable:
    {
        padding: 15,
        width: width - 50,
        justifyContent: 'center',
        borderRadius: 12,
        position: 'relative',
        bottom: 0,
        marginTop: 24,
    },
    submitButtonText:
    {
        alignSelf: 'center',
        fontFamily: strings.fontRegular,
        fontSize: 15,
    },
    ErrorDisplay:
    {
        color: "#FF0000",
        marginLeft: 5,
        fontSize: 12
    },
    dropDownView:
    {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
};

export default connect(mapStateToProps, mapDispatchToProps)(ImpsVerifyBeneficiary);