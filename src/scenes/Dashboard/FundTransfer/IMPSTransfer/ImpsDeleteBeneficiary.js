import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    Platform,
    BackHandler,
    Keyboard
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
import { TextInput } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import MyValidator from '../../../../common/MyValidator';
import { QuickPayCustomPopupDropDownForLoan } from '../../../../components/QuickPayCustomPopupDropDownForLoan';
import APIUrlConstants from '../../../../common/APIUrlConstants';
import { _toEncrypt, decryptData } from '../../../../common/util';
import Constants from '../../../../common/Constants';
import Snackbar from 'react-native-snackbar';
import EyeOpen from '../../../../assets/icons/formIcons/ico-eye.svg'
import EyeSlash from '../../../../assets/icons/formIcons/ico-eye-slash.svg';
import { KeyboardAvoidingView } from 'react-native';
import TrasnperantFixedHomeHeader from '../../../../components/TrasnperantFixedHomeHeader';
import NetInfo from '@react-native-community/netinfo';
import { DialogBeneficiaryPopup } from '../../../../components/DialogBeneficiaryPopup';
import { DialogAddBeneficiaryConfirmPopup } from '../../../../components/DialogAddBeneficiaryConfirmPopup';
import CardView from 'react-native-cardview';

class ImpsDeleteBeneficiary extends Component {
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
            benificiaryId: '',
            isClick: '',
            error_beneficiaryAccType: '',
            error_transactionPin: '',
            callFrom: 'Close Beneficiary',
            accounList: props.route.params.accList,
            myJsonArray: [],
            isConfirmPopup: false,
            isBeneficiaryPopupVisible: false,
            fromAcMastCode: '',
            isTransactionPin: true,
            transPin: '',
            searchTerm: '',
            filteredData: [],
        };
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
                this.setState({ myJsonArray: person, accType: Constants.Selected_AC_NO, fromAcMastCode: Constants.Selected_ACMASTCODE })
                this.GetBeneficiaryList(Constants.Selected_AC_NO, Constants.Selected_ACMASTCODE)
            }
            else {
                this.setState({ myJsonArray: person, accType: person[index].data[index].label, fromAcMastCode: person[index].data[index].acmastcode })
                this.GetBeneficiaryList(person[index].data[index].label, person[index].data[index].acmastcode)
            }
        })

    }
    toggleModal = () => {
        this.setState({ isBeneficiaryPopupVisible: false })
    };
    PressYes = (item1, item2) => {
        this.toggleModal();
        if (item1.BENF009 === null || item1.BENF009 === undefined || item1.BENF009.trim() === "") {
            this.setState({ benificiaryAcc: '', beneficiaryAccType: 'Search or Select Beneficiary A/c' })
        }
        else {
            this.setState({ benificiaryAcc: item1.BENF008, beneficiaryAccType: item1.BENF008, isClick: item2, benificiaryAccTitle: item1.BENF009, benificiaryId: item1.BENF001 })
        }
    }

    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg


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

    onSelectAccount = (value, bal, acmastcode, acName) => {
        this.setState({ isQuickModalVisible: false })
        if (acmastcode === null || acmastcode === undefined || acmastcode.trim() === "") {
        }
        else {
            this.setState({ accType: value, fromAcc: value, fromAcMastCode: acmastcode })
            this.GetBeneficiaryList(value, acmastcode)
        }

    }
    toggleModalConfirmPopup = () => {
        this.setState({ isConfirmPopup: false })
    };
    toggleModalConfirmYesPopup = () => {
        this.toggleModalConfirmPopup()
        this.SubmitRequest()
    };
    async toCallSubmit() {
        const result = this.ValidateForm();
        if (result) {
            const isConnected = await this.checkInternetConnection();
            if (isConnected) {
                this.setState({ isConfirmPopup: true })
            }
            else {
                Snackbar.show({
                    text: 'Check Internet Connection',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'red'

                });
            }

        }
    }

    ValidateForm() {
        var result = true;
        this.setState({ error_beneficiaryAccType: '', error_transactionPin: '' });
        if (this.state.beneficiaryAccType === 'Search or Select Beneficiary A/c') {
            this.setState({ error_beneficiaryAccType: 'Select Beneficiary A/c' });
            result = false;
        }
        if (this.state.transPin.length <= 3) {
            this.setState({ error_transactionPin: 'Please enter valid transaction pin' });
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
                        }>
                        {part}
                    </Text>
                ))}
            </Text>
        );
    };


    GetBeneficiaryList = async (fromAcc, acmastcode) => {
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {
            try {
                const Headers = APIUrlConstants.Headers("GETIMPSBNFLIST");
                const jsonReq =
                {
                    customerId: Constants.GMST_CODE,
                    acMastCode: acmastcode,
                    acNo: fromAcc,
                    branchCd: Constants.BRANCH_CODE,
                    secKey: Constants.SecretKey,
                    divId: this.props.DeviceId,
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
                        //var responseData = response
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
                text: 'Check Internet Connection',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red'

            });
        }

    }

    SubmitRequest = async () => {
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {
            try {
                const Headers = APIUrlConstants.Headers("CANCELBENF");
                const jsonReq =
                {
                    customerId: Constants.GMST_CODE,
                    acMastCode: this.state.fromAcMastCode,
                    acNo: this.state.accType,
                    branchCd: Constants.BRANCH_CODE,
                    secKey: Constants.SecretKey,
                    divId: this.props.DeviceId,
                    bnfId: this.state.benificiaryId,
                    bnfOtp: this.state.transPin,
                    bankCode: Constants.BankCode,

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
                            navigation.navigate(this, 'ImpsTransferSuccess', { from: 'Close Beneficiary' })
                        }
                    })
            } catch (e) {
                console.log('Error: ', e)
            }
        }
        else {
            Snackbar.show({
                text: 'Check Internet Connection',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red'

            });
        }
    }

    render() {
        return (
            <View style={styles.mainView}>
                <ImageBackground style={styles.mainView}
                    source={this.bgImage}
                    resizeMode='cover'>
                    <KeyboardAvoidingView
                        style={styles.mainView}
                        behavior={Platform.OS === 'ios' ? 'padding' : ''}
                        enabled={true}>
                        <TrasnperantFixedHomeHeader
                            backAction={() => this.onBackAction()} />
                        <View style={styles.lableHeader}>
                            <View style={styles.lableHeaderView}>
                                <Text style={styles.verifyBeneficiaryTitle}>Close Beneficiary
                                </Text>
                                <Text style={styles.verifyBeneficiaryDescription}>Close Your Linked Beneficiary.
                                </Text>
                            </View>
                        </View>
                        <View style={styles.subMainView}>
                            <ScrollView showsVerticalScrollIndicator={false}>
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
                                        <View style={styles.dropDownView}>
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
                                                    if (this.state.filteredData.length != 0) {
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
                                            <View style={styles.dropDownView}></View>
                                        </TouchableOpacity>
                                    </View>

                                </CardView>
                                {this.state.error_beneficiaryAccType !== '' && (<Text style={styles.ErrorDisplay}>{this.state.error_beneficiaryAccType}</Text>)}
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
                                                        A/c No:{this.state.benificiaryAcc}
                                                    </Text>
                                                </View>

                                            </View>
                                        </View>
                                    </View> : null}
                                <TouchableOpacity style={styles.transactionPinTouchable}
                                    onPress={() => {
                                        if (this.state.benificiaryAcc === '') {
                                            Snackbar.show({
                                                text: 'Select Beneficiary A/c',
                                                duration: Snackbar.LENGTH_SHORT,
                                                backgroundColor: 'red'
                                            });
                                        }
                                    }}>
                                    <TextInput
                                        style={styles.transactionPinTextInput}
                                        theme={{
                                            colors: {
                                                placeholder: '#DFE1E8',
                                                text: this.props.textColor,
                                                primary: this.props.themeColor,
                                                underlineColor: 'transparent',
                                            },
                                            roundness: 8,
                                        }}
                                        label="Enter Transaction pin"
                                        value={this.state.transPin}
                                        keyboardType='default'
                                        onChangeText={transPin => {
                                            this.setState({ transPin: transPin });
                                        }}
                                        mode='outlined'
                                        secureTextEntry={this.state.isTransactionPin}
                                        right={
                                            <TextInput.Icon
                                                forceTextInputFocus={false}
                                                onPress={() => {
                                                    this.setState({ isTransactionPin: !this.state.isTransactionPin })
                                                    Keyboard.dismiss();
                                                }}
                                                icon={() =>
                                                    <View
                                                        style={{
                                                            // backgroundColor: 'red',
                                                            height: 30,
                                                            width: 30,
                                                            marginTop: 10,
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }} >
                                                        {this.state.isTransactionPin ?
                                                            <EyeSlash height={20} width={20} color={'#000000'} />
                                                            : <EyeOpen height={20} width={20} color={'#000000'} />}
                                                    </View>}
                                            />
                                        }
                                        ref={(input) => { this.Confirmtransactionpass = input; }}
                                        editable={this.state.benificiaryAcc === '' ? false : true}
                                        placeholder='Enter Transaction Pin'
                                    />

                                </TouchableOpacity>
                                {this.state.error_transactionPin !== '' && (<Text style={styles.ErrorDisplay}>{this.state.error_transactionPin}</Text>)}
                                <TouchableOpacity
                                   style={[styles.submitButtonTouchable, { backgroundColor: this.props.PrimaryColor,}]}
                                    onPress={() => this.toCallSubmit()}
                                ><Text style={styles.submitButtonText}>Submit
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
                            {
                                DialogAddBeneficiaryConfirmPopup(
                                    this.state.isConfirmPopup,
                                    this.toggleModalConfirmPopup,
                                    this.toggleModalConfirmYesPopup,
                                    null,
                                    this.state.benificiaryAccTitle,
                                    this.state.benificiaryAcc,
                                    null,
                                    'IMPS Edit Beneficiary'
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
    accNoText:
    {
        color: '#252525', 
        fontFamily: strings.fontMedium, 
        fontSize: 12,
        marginBottom:10
    },
    transactionPinTouchable:
    {
        marginTop: 10,
        justifyContent: 'center',
    },
    transactionPinTextInput:
    {
        lineHeight: 40,
        height: 48,
        width: width - 50,
    },

    transactionPinEyeView:
    {
        height: 30,
        width: 30,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    forgetTransactionPinText: {
        fontSize: 10,
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        color: '#1F3C66',
    },
    forgetTransactionPinTouchable: {
        flexDirection: 'row',
        marginTop: 12,
        justifyContent: 'flex-end'
    },
    checkTouchable:
    {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 10,
        marginTop: 12,
        width: width - 50,
    },
    closeBeneficiaryDottedView:
    {
        borderStyle: 'dotted',
        borderWidth: 1,
        borderRadius: 8,
        height: 50,
        borderColor: '#93B1C8',
        marginBottom: 10,
        marginTop: 16,
        width: width - 50,
    },
    closeBeneficiaryTouchable:
    {
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: 19,
    },
    closeBeneficiaryText:
    {
        fontFamily: strings.fontRegular,
        fontSize: 15,
        alignSelf: 'center',
    },
    checkBoxStyle:
    {
        width: 20,
        height: 20,
        marginRight: 15,
        alignSelf: 'center',
    },
    submitButtonTouchable:
    {
        padding: 15,
        width: width - 50,
        justifyContent: 'center',
        borderRadius: 12,
        marginTop: 24,
        marginBottom: 10
    },
    submitButtonText:
    {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15
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

export default connect(mapStateToProps, mapDispatchToProps)(ImpsDeleteBeneficiary);
