import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    Platform,
    BackHandler,
    FlatList,
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
    RenderLoader,
} from '../../../../App';
import Arrowdown from '../../../../assets/icons/dashboardIcons/arrow_down.svg';
import { TextInput } from 'react-native-paper';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';
import MyValidator from '../../../../common/MyValidator';
import Constants from '../../../../common/Constants';
import { _toEncrypt, decryptData, sendData } from '../../../../common/util';
import APIUrlConstants from '../../../../common/APIUrlConstants';
import SearchIcon from '../../../../assets/icons/Vector.svg'
import BankImg from '../../../../assets/icons/bank_img.svg'
import Snackbar from 'react-native-snackbar';
import { QuickPayCustomPopupDropDownForLoan } from '../../../../components/QuickPayCustomPopupDropDownForLoan';
import TrasnperantFixedHomeHeader from '../../../../components/TrasnperantFixedHomeHeader';
import NetInfo from '@react-native-community/netinfo';
import { DialogAddBeneficiaryConfirmPopup } from '../../../../components/DialogAddBeneficiaryConfirmPopup';
import { OKDialogFundTransfer } from '../../../../components/OKDialogFundTransfer';

class ImpsAddBeneficiary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isQuickModalVisible: false,
            accType: '',
            beneficiaryAccType: 'Search or Select Beneficiary A/c',
            labelText: '',
            confirmBeneficiaryAccNo: '',
            beneficiaryAccountNo: '',
            confirmBeneficiaryName: '',
            confirmBeneficiaryAddress: '',
            mobileNo: '',
            fromAcc: '',
            benificiaryAcc: '',
            isClick: '',
            error_mobileNo: '',
            error_confirmBeneficiaryAccNo: '',
            error_confirmBeneficiaryName: '',
            error_confirmBeneficiaryAddress: '',
            error_beneficiaryAccountNo: '',
            error_beneficiaryAcc: '',
            error_IfscCode: '',
            beneficiaryIfscCode: '',
            beneficiaryBankName: '',
            beneficiaryBranch: '',
            fromAccAcmastCode: '',
            callFrom: "Add Beneficiary",
            accounList: props.route.params.accList,
            myJsonArray: [],
            myJsonArrayforBeneficiaryList: [],
            isConfirmPopup: false,
            searchTerm: '',
            isMasked: true,
            isMasked1: true,
            isOkModalVisible: false,
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
                this.setState({ myJsonArray: person, accType: Constants.Selected_AC_NO, fromAccAcmastCode: Constants.Selected_ACMASTCODE, fromAcc: Constants.Selected_AC_NO })
            }
            else {
                this.setState({ myJsonArray: person, accType: person[index].data[index].label, fromAccAcmastCode: person[index].data[index].acmastcode, fromAcc: person[index].data[index].label })
            }
        })
    }
    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg

    toggleModalOkDialog = () => {
        this.setState({ isOkModalVisible: false })
    };
    toggleModalYesDialog = () => {
        if (this.state.isFromGoogle) {
            navigation.navigate(this, 'bottomNavigator');
        } else {
            this.setState({ searchTerm: '', myJsonArrayforBeneficiaryList: [] })
            this.toggleModalOkDialog();
        }
    };
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
    
    toggleModalConfirmPopup = () => {
        this.setState({ isConfirmPopup: false })
    };
    toggleModalConfirmYesPopup = () => {
        this.toggleModalConfirmPopup()
        this.AddBeneficiaryApi()
    };
    

    onSelectAccount = (value, title, acmastcode, isClick) => {
        this.setState({ isQuickModalVisible: false })
        if (acmastcode === null || acmastcode === undefined || acmastcode.trim() === "") {

        }
        else {
            if (this.state.labelText === 'From A/c') {
                this.setState({ accType: value, fromAcc: value, fromAccAcmastCode: acmastcode })
            }

        }

    }

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
        this.setState({ error_mobileNo: '', error_beneficiaryAcc: '', error_confirmBeneficiaryAccNo: '', error_confirmBeneficiaryAddress: '', error_confirmBeneficiaryName: '', error_beneficiaryAccountNo: '' });
        if (this.state.myJsonArrayforBeneficiaryList.length === 0) {
            this.setState({ error_IfscCode: 'Please search your bank IFSC code' });
            result = false;
        }

        if (this.state.beneficiaryAccountNo.trim().length < 9) {
            this.setState({ error_beneficiaryAccountNo: 'Please enter at least 9 digits for beneficiary A/c no' });
            result = false;
        }

        if (this.state.confirmBeneficiaryAccNo.trim().length < 9) {
            this.setState({ error_confirmBeneficiaryAccNo: 'Please enter at least 9 digits for beneficiary A/c no' });
            result = false;
        }

        if(this.state.confirmBeneficiaryAccNo != this.state.beneficiaryAccountNo)
        {
            this.setState({ error_confirmBeneficiaryAccNo: 'Confirm beneficiary account number does not match' });
            result = false;
        }


        if (!MyValidator.isEmptyField(this.state.beneficiaryAccountNo).isValid) {
            this.setState({ error_beneficiaryAccountNo: 'Please enter beneficiary A/c No' });
            result = false;
        }

        if (!MyValidator.isEmptyField(this.state.confirmBeneficiaryAccNo).isValid) {
            this.setState({ error_confirmBeneficiaryAccNo: 'Please enter confirm beneficiary A/c No' });
            result = false;
        }

        if (!MyValidator.isEmptyField(this.state.confirmBeneficiaryAccNo).isValid) {
            this.setState({ error_confirmBeneficiaryAccNo: 'Please enter confirm beneficiary A/c No' });
            result = false;
        }

        
        



        const isNotOnlyNumeric = /^(?=.*[a-zA-Z])[a-zA-Z0-9 ]+$/.test(this.state.confirmBeneficiaryName);

        if (!isNotOnlyNumeric) {
            this.setState({ error_confirmBeneficiaryName: 'Please enter valid beneficiary name' });
            result = false;
        }

        if (this.state.confirmBeneficiaryName.trim().length < 2) {
            this.setState({ error_confirmBeneficiaryName: 'Please enter at least 2 character for beneficiary name' });
            result = false;
        }

       
        const isNumber = /^\d+$/.test(this.state.confirmBeneficiaryAddress);

        if (isNumber) {
            this.setState({ error_confirmBeneficiaryAddress: 'Please enter valid address' });
            result = false;
        }

        if (this.state.confirmBeneficiaryAddress.trim().length < 2) {
            this.setState({ error_confirmBeneficiaryAddress: 'Please enter at least 2 character for beneficiary address' });
            result = false;
        }

        if (!MyValidator.isEmptyField(this.state.confirmBeneficiaryName).isValid) {
            this.setState({ error_confirmBeneficiaryName: 'Please enter beneficiary name' });
            result = false;
        }
        if (!MyValidator.isEmptyField(this.state.confirmBeneficiaryAddress).isValid) {
            this.setState({ error_confirmBeneficiaryAddress: 'Please enter beneficiary address' });
            result = false;
        }
        if (!MyValidator.isValidIndianMobile(this.state.mobileNo).isValid) {
            this.setState({ error_mobileNo: MyValidator.isValidIndianMobile(this.state.mobileNo).Response });
            result = false;
        }
      
        return result;
    };

    AddBeneficiaryApi = async () => {
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {
            try {
                const Headers = APIUrlConstants.Headers("PUTIMPSBENFOTP");
                const jsonReq =
                {
                    customerId: Constants.GMST_CODE,
                    CORP_ID: Constants.BankCode,
                    SEC_KEY: Constants.SecretKey,
                    acMastCode: this.state.fromAccAcmastCode,
                    acNo: this.state.fromAcc,
                    GMSTCODE: Constants.GMST_CODE,
                    MOBILENO: this.state.mobileNo,
                    BRANCHCODE: Constants.BRANCH_CODE,
                    divId: this.props.DeviceId,
                    secKey: Constants.SecretKey,
                    bnfBank: this.state.beneficiaryBankName.trim(),
                    bnfBr: this.state.beneficiaryBranch,
                    bnfIfsc: this.state.beneficiaryIfscCode,
                    bnfAcno: this.state.beneficiaryAccountNo,
                    bnfName: this.state.confirmBeneficiaryName,
                    bnfAddr: this.state.confirmBeneficiaryAddress,
                    bnfMob: this.state.mobileNo,
                    NMODE: '2'
                }

                console.log('Add Beneficiary---'+JSON.stringify(jsonReq))

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

                        console.log("finalRes-- "+JSON.stringify(finalRes))

                       

                        if (finalRes.SUCCESS === "TRUE") {
                            const SuccessMsg = finalRes.RESULT

                            if (SuccessMsg === 'Duplicate Beneficiary...') {
                                Snackbar.show({ text: 'Beneficiary Already Added', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                            }
                            else {
                                Snackbar.show({ text: 'Beneficiary Added Successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green' });
                                navigation.navigate(this, 'ImpsTransferSuccess', { from: 'Add Beneficiary' })

                            }
                        }
                        else {
                            let userAccArray = finalRes.Acdtls

                            let TempAcc = [];

                            if (userAccArray.length > 0) 
                            {
                                userAccArray.map((item) => {

                                    TempAcc.push(JSON.parse(item))

                                })
                            }


                            TempAcc.forEach(item => {

                                const Msg = item.MSGDESCR

                                if (Msg === 'Duplicate Beneficiary...') 
                                {
                                    Snackbar.show({ text: 'Beneficiary Already Added', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                                }
                                else 
                                {
                                    Snackbar.show({ text: Msg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });

                                }

                                navigation.goBack(this)
                            })


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

    GetIfsc = async (benfId) => {
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {
            try {
                const Headers = APIUrlConstants.Headers("GETIMPSIFSCLIST");
                const jsonReq =
                {
                    customerId: Constants.GMST_CODE,
                    CORPID: Constants.BRANCH_CODE,
                    SEC_KEY: Constants.SecretKey,
                    divId: this.props.DeviceId,
                    secKey: Constants.SecretKey,
                    acMastCode: this.state.fromAccAcmastCode,
                    acNo: this.state.fromAcc,
                    branchCd: "",
                    benfId: benfId,
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
                        if (finalRes.Acdtls.length === 0) {
                            this.setState({ isOkModalVisible: true, myJsonArrayforBeneficiaryList: []  })
                            this.props.setOkDialogText("no data available")
                        }
                        else {
                            const acdtlsArray = finalRes.Acdtls.map(item => JSON.parse(item.replace(/\\/g, '')));
                            this.setState({ myJsonArrayforBeneficiaryList: acdtlsArray })
                            this.setState({ error_IfscCode: '' })
                            { this.setState({ beneficiaryBankName: acdtlsArray[0].BENF005, beneficiaryIfscCode: acdtlsArray[0].BENF007, beneficiaryBranch: acdtlsArray[0].BENF006 }) }
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
    isAlphanumeric(input) {
        const regex = /^[a-zA-Z0-9]*$/;
        return regex.test(input);
    }
    render() {
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
                            backAction={() => this.onBackAction()}/>

                        <View style={styles.headerView}>
                            <View style={styles.headerLabelView}>
                                <Text style={styles.addBeneficiaryText}>Add Beneficiary
                                </Text>
                                <Text style={styles.addBeneficiaryTextDesciption}>Add Beneficiary for Fund Transfer
                                </Text>
                            </View>
                        </View>
                        <View style={styles.mainViewContainer}>
                            
                            <ScrollView
                                showsVerticalScrollIndicator={false}>
                                <View style={styles.fromAccView}>
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
                                        }}
                                    >

                                        <View style={styles.mainView}>
                                            <Text style={styles.fromAccText}>
                                                From A/c
                                            </Text>

                                            <Text style={styles.fromAccValue}>
                                                {this.state.accType}
                                            </Text>
                                        </View>

                                        <View style={styles.dropDownValue}>
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

                                <TouchableOpacity style={styles.searchIfscTouchable}
                                    onPress={() => {
                                        if (this.state.myJsonArray.length == 0) {
                                            Snackbar.show({
                                                text: 'Select from A/c',
                                                duration: Snackbar.LENGTH_SHORT,
                                                backgroundColor: 'red'
                                            });
                                        }

                                    }}
                                >
                                    <CardView
                                        cardElevation={3}
                                        cardMaxElevation={3}
                                        cornerRadius={6}
                                        style={styles.ifscCard}>
                                        <TextInput
                                            style={styles.searchTextInput}
                                            theme={{
                                                colors: {
                                                    placeholder: '#DFE1E8',
                                                    text: this.props.textColor,
                                                    primary: this.props.themeColor,
                                                    background: 'transparent',
                                                },
                                                roundness: 8,
                                            }}
                                            underlineColor='transparent'
                                            autoCapitalize='characters'
                                            onChangeText={text => {
                                                const regex = /^[a-zA-Z0-9 ]*$/;
                                                if (regex.test(text)) {
                                                    if (text.length >= 11) {
                                                        this.GetIfsc(text)
                                                    }
                                                    this.setState({ searchTerm: text.replace(/[^A-Z0-9]/g, '') });
                                                }
                                            }}
                                            value={this.state.searchTerm}
                                            placeholder='Search IFSC'
                                            editable={this.state.myJsonArray.length == 0 ? false : true}
                                            maxLength={11}
                                        />
                                        <TouchableOpacity
                                            style={styles.searchIconTouchable}
                                            onPress={() => {
                                                if (this.state.searchTerm.length < 11) {
                                                    this.setState({ isOkModalVisible: true })
                                                    this.props.setOkDialogText("Please enter correct IFSC No!!")
                                                }
                                                else {
                                                    this.GetIfsc(this.state.searchTerm)
                                                }

                                            }}
                                        >
                                            <SearchIcon height={20} width={20} color={'#ffffff'} />
                                        </TouchableOpacity>
                                    </CardView>
                                </TouchableOpacity>
                                <FlatList
                                    data={this.state.myJsonArrayforBeneficiaryList}
                                    renderItem={({ item, index }) =>
                                        <TouchableOpacity style={styles.ifscTouchable}>
                                            <View>
                                                <View style={styles.ifscMainView}>
                                                    <View style={styles.ifscOneView}>
                                                        <View style={styles.ifscIconView}>
                                                            <BankImg height={24} width={24} />
                                                        </View>
                                                    </View>
                                                    <View style={styles.ifscNameView}>
                                                        <Text style={styles.bankNameText}>
                                                            Bank Name
                                                        </Text>
                                                        <Text style={styles.bankNameValue}>
                                                            {item.BENF005 + ", " + item.BENF006}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                />
                                {this.state.error_IfscCode !== '' && (<Text style={styles.ErrorDisplay}>{this.state.error_IfscCode}</Text>)}
                                <TouchableOpacity style={styles.benficiaryAccNoTouchable}
                                    onPress={() => {
                                        if (this.state.myJsonArrayforBeneficiaryList == 0) {
                                            Snackbar.show({
                                                text: 'Search and select IFSC code',
                                                duration: Snackbar.LENGTH_SHORT,
                                                backgroundColor: 'red'
                                            });
                                        }
                                    }}>
                                    <TextInput
                                        style={styles.confirmBeneficiaryTextInput}
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
                                        label="Beneficiary A/c No"
                                        placeholder='Beneficiary A/c No'
                                        // autoCapitalize='characters'
                                        value={this.state.beneficiaryAccountNo}
                                        onChangeText={beneficiaryAccountNo => {
                                            this.setState({ beneficiaryAccountNo: beneficiaryAccountNo.replace(/[^0-9A-Z]/g, '') });
                                        }}
                                        mode='outlined'
                                        returnKeyType='next'
                                        maxLength={20}
                                        onSubmitEditing={() => {
                                            if (this.state.beneficiaryAccountNo.length < 9) {
                                                Snackbar.show({
                                                    text: 'Please enter at least 9 digits for beneficiary A/c no',
                                                    duration: Snackbar.LENGTH_SHORT,
                                                    backgroundColor: 'red'
                                                });
                                            }
                                            else {
                                                this.bencno.focus();
                                            }

                                        }}
                                        blurOnSubmit={false}
                                        editable={this.state.myJsonArrayforBeneficiaryList == 0 ? false : true}
                                        contextMenuHidden={true}
                                        secureTextEntry={this.state.isMasked}
                                        onFocus={() => 
                                            this.setState({ isMasked: false })}
                                        onBlur={() => this.setState({ isMasked: true })}
                                    />
                                    {this.state.error_beneficiaryAccountNo !== '' && (<Text style={styles.ErrorDisplay}>{this.state.error_beneficiaryAccountNo}</Text>)}
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.benficiaryAccNoTouchable}
                                   
                                    onPress={() => {
                                        if (this.state.beneficiaryAccountNo === '') {
                                            Snackbar.show({
                                                text: 'Enter beneficiary A/c no',
                                                duration: Snackbar.LENGTH_SHORT,
                                                backgroundColor: 'red'
                                            });
                                        }
                                    }}>
                                    <TextInput
                                        style={styles.confirmBeneficiaryTextInput}
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
                                        label="Confirm Beneficiary A/c No"
                                        placeholder='Confirm Beneficiary A/c No'
                                        // autoCapitalize='characters'
                                        value={this.state.confirmBeneficiaryAccNo}
                                        onChangeText={confirmBeneficiaryAccNo => {
                                            this.setState({ confirmBeneficiaryAccNo: confirmBeneficiaryAccNo.replace(/[^0-9A-Z]/g, '') });
                                        }}
                                        mode='outlined'
                                        returnKeyType='next'
                                        ref={(input) => { this.bencno = input; }}
                                        onSubmitEditing={() => {
                                            if (this.state.beneficiaryAccountNo == this.state.confirmBeneficiaryAccNo) {
                                                this.bename.focus();
                                            }
                                            else if (this.state.confirmBeneficiaryAccNo.length < 9) {
                                                Snackbar.show({
                                                    text: 'Please enter at least 9 digits for beneficiary A/c no',
                                                    duration: Snackbar.LENGTH_SHORT,
                                                    backgroundColor: 'red'
                                                });
                                            }
                                            else {
                                                Snackbar.show({
                                                    text: 'Beneficiary A/c number not match...',
                                                    duration: Snackbar.LENGTH_SHORT,
                                                    backgroundColor: 'red'
                                                });
                                            }
                                        }}
                                        secureTextEntry={this.state.isMasked1}
                                        onFocus={() => 
                                            this.setState({ isMasked1: false })
                                        }
                                        maxLength={20}
                                        onBlur={() => {
                                            this.setState({ isMasked1: true })
                                            if (this.state.beneficiaryAccountNo != this.state.confirmBeneficiaryAccNo) {
                                                Snackbar.show({
                                                    text: 'Beneficiary A/c number not match......',
                                                    duration: Snackbar.LENGTH_SHORT,
                                                    backgroundColor: 'red'
                                                });
                                            }
                                        }}
                                        blurOnSubmit={false}
                                        editable={this.state.beneficiaryAccountNo === '' ? false : true}
                                        contextMenuHidden={true}
                                    />
                                    {this.state.error_confirmBeneficiaryAccNo !== '' && (<Text style={styles.ErrorDisplay}>{this.state.error_confirmBeneficiaryAccNo}</Text>)}
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.benficiaryAccNoTouchable}
                                    onPress={() => {
                                        if (this.state.confirmBeneficiaryAccNo === '') {
                                            Snackbar.show({
                                                text: 'Enter confirm beneficiary A/c no',
                                                duration: Snackbar.LENGTH_SHORT,
                                                backgroundColor: 'red'
                                            });
                                        }
                                    }}>
                                    <TextInput
                                        style={styles.confirmBeneficiaryTextInput}
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
                                        label="Beneficiary Name"
                                        placeholder='Beneficiary Name'
                                        value={this.state.confirmBeneficiaryName}
                                        onChangeText={confirmBeneficiaryName => {
                                            const regex = /^[a-zA-Z0-9 ]*$/;
                                            if (regex.test(confirmBeneficiaryName)) {
                                                this.setState({ confirmBeneficiaryName: confirmBeneficiaryName });
                                            }
                                        }}
                                        mode='outlined'
                                        returnKeyType='next'
                                        ref={(input) => { this.bename = input; }}
                                        onSubmitEditing={() => {
                                            const hasLetter = /[a-zA-Z]/.test(this.state.confirmBeneficiaryName);
                                            const hasAlphanumeric = /^[a-zA-Z0-9\s]*$/.test(this.state.confirmBeneficiaryName);
                                            if (!hasLetter || !hasAlphanumeric) {
                                                Snackbar.show({
                                                    text: 'The beneficiary name should contain at least two characters and consist only of alphanumeric characters.',
                                                    duration: Snackbar.LENGTH_SHORT,
                                                    backgroundColor: 'red'
                                                });
                                            } else if (this.state.confirmBeneficiaryName.length < 2) {
                                                Snackbar.show({
                                                    text: 'Please enter at least 2 characters for beneficiary name.',
                                                    duration: Snackbar.LENGTH_SHORT,
                                                    backgroundColor: 'red'
                                                });
                                            } else {
                                                this.beaddr.focus();
                                            }
                                        }}
                                        blurOnSubmit={false}
                                        editable={this.state.confirmBeneficiaryAccNo === '' ? false : true}
                                        maxLength={50}
                                    />
                                    {this.state.error_confirmBeneficiaryName !== '' && (<Text style={styles.ErrorDisplay}>{this.state.error_confirmBeneficiaryName}</Text>)}
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.benficiaryAccNoTouchable}
                                    onPress={() => {
                                        if (this.state.confirmBeneficiaryName === '') {
                                            Snackbar.show({
                                                text: 'Enter beneficiary name',
                                                duration: Snackbar.LENGTH_SHORT,
                                                backgroundColor: 'red'
                                            });
                                        }
                                    }}>
                                    <TextInput
                                        style={styles.confirmBeneficiaryTextInput}
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
                                        label="Beneficiary Address"
                                        placeholder='Beneficiary Address'
                                        value={this.state.confirmBeneficiaryAddress}
                                        onChangeText={confirmBeneficiaryAddress => {
                                            const regex = /^[a-zA-Z0-9 ]*$/;
                                            if (regex.test(confirmBeneficiaryAddress)) {
                                                this.setState({ confirmBeneficiaryAddress: confirmBeneficiaryAddress });
                                            }
                                        }}
                                        maxLength={60}
                                        mode='outlined'
                                        returnKeyType='next'
                                        ref={(input) => { this.beaddr = input; }}
                                        onSubmitEditing={() => {
                                            const hasLetter = /[a-zA-Z]/.test(this.state.confirmBeneficiaryAddress);
                                            const hasAlphanumeric = /^[a-zA-Z0-9\s]*$/.test(this.state.confirmBeneficiaryAddress);
                                            if (!hasLetter || !hasAlphanumeric) {
                                                Snackbar.show({
                                                    text: 'The beneficiary address should contain at least two characters and consist only of alphanumeric characters.',
                                                    duration: Snackbar.LENGTH_SHORT,
                                                    backgroundColor: 'red'
                                                });
                                            } else if (this.state.confirmBeneficiaryAddress.length < 2) {
                                                Snackbar.show({
                                                    text: 'Please enter at least 2 characters for beneficiary address.',
                                                    duration: Snackbar.LENGTH_SHORT,
                                                    backgroundColor: 'red'
                                                });
                                            } else {
                                                this.mob.focus();
                                            }
                                        }}
                                        blurOnSubmit={false}
                                        editable={this.state.confirmBeneficiaryName === '' ? false : true}
                                    />
                                    {this.state.error_confirmBeneficiaryAddress !== '' && (<Text style={styles.ErrorDisplay}>{this.state.error_confirmBeneficiaryAddress}</Text>)}
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.benficiaryAccNoTouchable}
                                    onPress={() => {
                                        if (this.state.confirmBeneficiaryAddress === '') {
                                            Snackbar.show({
                                                text: 'Enter beneficiary address',
                                                duration: Snackbar.LENGTH_SHORT,
                                                backgroundColor: 'red'
                                            });
                                        }
                                    }}>
                                    <TextInput
                                        style={styles.confirmBeneficiaryTextInput}
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
                                        label="Beneficiary Mobile Number"
                                        placeholder='Beneficiary Mobile Number'
                                        value={this.state.mobileNo}
                                        onChangeText={mobileNo => {
                                            this.setState({ mobileNo: mobileNo.replace(/[^0-9]/g, ''), });
                                        }}
                                        keyboardType='number-pad'
                                        mode='outlined'
                                        maxLength={10}
                                        ref={(input) => { this.mob = input; }}
                                        editable={this.state.confirmBeneficiaryAddress === '' ? false : true}
                                    />
                                    {this.state.error_mobileNo !== '' && (<Text style={styles.ErrorDisplay}>{this.state.error_mobileNo}</Text>)}
                                </TouchableOpacity>
                                <CardView
                                    cardElevation={2}
                                    cardMaxElevation={2}
                                    cornerRadius={12}
                                    style={styles.submitButtonCard}>
                                    <TouchableOpacity
                                       style={[styles.submitButtonTouchable, { backgroundColor: this.props.PrimaryColor,}]}
                                        onPress={() => this.toCallSubmit()}
                                    ><Text style={styles.submitButtonText}>
                                            Submit
                                        </Text>
                                    </TouchableOpacity>
                                </CardView>
                                {
                                    DialogAddBeneficiaryConfirmPopup(
                                        this.state.isConfirmPopup,
                                        this.toggleModalConfirmPopup,
                                        this.toggleModalConfirmYesPopup,
                                        this.state.beneficiaryBankName,
                                        this.state.beneficiaryIfscCode,
                                        this.state.beneficiaryAccountNo,
                                        null,
                                        'IMPS Add Beneficiary',
                                        null
                                    )
                                }
                                {
                                    OKDialogFundTransfer(
                                        this.state.isOkModalVisible,
                                        this.toggleModalOkDialog,
                                        this.toggleModalYesDialog,
                                        this.props.okDialogText,
                                        this.props.SecondaryColor
                                    )
                                }
                            </ScrollView>
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
    headerView:
    {
        flex: 0.15
    },
    headerLabelView:
    {
        marginLeft: 25,
        marginBottom: 10,
    },
    addBeneficiaryText:
    {
        fontSize: 20,
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: colors.white,
    },
    addBeneficiaryTextDesciption:
    {
        fontSize: 15,
        textAlign: 'left',
        fontFamily: strings.fontMedium,
        color: colors.white,
    },
    mainViewContainer:
    {
        flex: 0.85,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    fromAccView: {
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
        alignItems: 'center',
    },
    fromAccText:
    {
        color: colors.accTextColor + '80',
        marginLeft: 15,
        fontSize: 10,
        fontFamily: strings.fontMedium,
    },
    fromAccValue:
    {

        color: colors.accTextColor,
        marginLeft: 15,
        fontSize: 15,
        fontFamily: strings.fontMedium,
    },
    dropDownValue:
    {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    searchIfscTouchable:
    {
        borderColor: '#DFE1E8',
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 10
    },
    ifscCard:
    {
        height: 48,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    searchTextInput:
    {
        lineHeight: 40,
        height: 48,
        flex: 0.85,
        backgroundColor: 'transparent',
    },
    searchIconTouchable:
    {

        flex: 0.15,
        height: 45,
        margin: 2,
        backgroundColor: '#FF5936',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5

    },
    ifscTouchable:
    {
        height: 73,
        marginTop: 16,
        borderRadius: 15,
        backgroundColor: '#9DD9F3'
    },
    ifscMainView:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        height: 73
    },
    ifscOneView:
    {
        width: 47, height: 51, backgroundColor: 'white', borderRadius: 10, alignItems: 'center', marginHorizontal: 13
    },
    ifscIconView:
    {
        alignSelf: 'center', flex: 1, justifyContent: 'center'
    },
    ifscNameView:
    {
        flexDirection: 'column', flex: 1,
    },
    bankNameText:
    {
        color: '#686868', fontFamily: strings.fontMedium, fontSize: 10, fontWeight: '500'
    },
    bankNameValue:
    {
        color: '#252525', fontFamily: strings.fontBold, fontSize: 15, fontWeight: '700'
    },
    benficiaryAccNoTouchable:
    {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 16
    },
    confirmBeneficiaryTextInput:
    {
        lineHeight: 40,
        height: 48,
        width: width - 50,
    },
    submitButtonCard:
    {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 20,
    },
    submitButtonTouchable:
    {
        padding: 15,
        width: width - 50,
        justifyContent: 'center',
        borderRadius: 12,
    },
    submitButtonText:
    {
        color: 'white',
        alignSelf: 'center',
        fontFamily: strings.fontRegular,
        fontSize: 15,
    },

    ErrorDisplay:
    {
        color: '#FF0000',
        marginLeft: 5,
        fontSize: 12
    },
};

export default connect(mapStateToProps, mapDispatchToProps)(ImpsAddBeneficiary);
