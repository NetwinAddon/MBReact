import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    BackHandler,
    KeyboardAvoidingView
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
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';
import MyValidator from '../../../../common/MyValidator';
import APIUrlConstants from '../../../../common/APIUrlConstants';
import Constants from '../../../../common/Constants';
import { QuickPayCustomPopupDropDownForLoan } from '../../../../components/QuickPayCustomPopupDropDownForLoan';
import { _toEncrypt, decryptData } from '../../../../common/util';
import Snackbar from 'react-native-snackbar';
import TrasnperantFixedHomeHeader from '../../../../components/TrasnperantFixedHomeHeader';
import NetInfo from '@react-native-community/netinfo';
import { DialogBeneficiaryPopup } from '../../../../components/DialogBeneficiaryPopup';
import { DialogTermsAndCondition } from '../../../../components/DialogTermsAndCondition';
import { DialogYesNoModal } from '../../../../components/DialogYesNoModal';
import { OKDialogFundTransfer } from '../../../../components/OKDialogFundTransfer';
import { DialogAddBeneficiaryConfirmPopup } from '../../../../components/DialogAddBeneficiaryConfirmPopup';

class ImpsTransfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isQuickModalVisible: false,
            selectedValue: 'option1',
            accType: '',
            beneficiaryAccType: 'Search or Select Beneficiary A/c',
            labelText: '',
            amount: '',
            remark: '',
            fromAcc: '',
            benificiaryAcc: '',
            benificiaryAccTitle: '',
            isClick: '',
            error_amount: '',
            error_remark: '',
            error_beneficiaryAcc: '',
            acmastcode: '',
            isTermsConditionModalVisible: false,
            availableBalance: '0.0',
            isOkModalVisible: false,
            isYesNoModalVisible: false,
            confirmRequest: false,
            callFrom: this.props.route.params.from,
            accounList: props.route.params.accList,
            myJsonArray: [],
            isBeneficiaryPopupVisible: false,
            termsAndConditions: [
                'Transactions initiated through IMPS option are irrevocable; Bank shall not entertain any request for revocation of transaction or stop payment request for transaction initiated through IMPS as the transactions are completely instantaneous and are incapable of being reversed.',
                'The Customer solely shall be responsible for the safe custody and security of IMPS application downloaded on their mobile phones. The Customer shall immediately inform the bank about the loss or theft of mobile phone for disabling of the IMPS service to prevent unauthorized usage.',
                'The Customer shall operate within the maximum limit permitted by the Bank for IMPS. The Bank reserves the right to change the transaction limit at any time.',
                'The Bank shall not be responsible for any loss caused to the customer while using the IMPS service.',
                'The Bank shall be at liberty to modify/add/remove any of the extant terms and conditions governing the IMPS service',
                'The Bank reserves the right to reject a Customer’s request for IMPS without assigning any reasons.',
                'The Customer shall remain accountable for all the transactions on the designated account made prior to confirmation of any such cancellation request by the Bank. It shall be the Bank’s endeavor to give a reasonable notice for withdrawal or termination of the facility, but the Bank may at its discretion withdraw temporarily or terminate the facility, either wholly or partially, anytime without giving prior notice to the Customer. The facility may be suspended for any maintenance or repair work for any breakdown in the Hardware/Software of IMPS, any emergency or security reasons without prior notice and the bank shall not be responsible if such an action has to be taken for reasons of security or emergency.',
                'The services offered under the Facility will be automatically terminated if the primary account linked for the Mobile Banking Services is closed. The Bank may also terminate or suspend the services under the Facility without prior notice if the Customer has violated the terms and conditions laid down by the Bank or on the death of the Customer when brought to the notice of the Bank.',
            ],
            searchTerm: '',
            filteredData: [],
            bnfId: '',
            NEFT_DLY_LMT: '0',
            IMPS_TRN_LMT: '0',
            NEFT_USED_LMT: '',
            min_bal: '',
            min_bal_req: '',
            chrg_amt: '0.0',
            netchrg_amt: '0.0',
            imps_chrg_rq: '',
            charges_amt: '0.0',
            isConfirmPopup: false,
            isChargesConfirmPopup: false,
            bnfBrCd: '',
            isFromGoogle: false,
            NEFT_DLY_FLAG: 'N',
            myBalance: '',
            myJsonArrayforBeneficiaryList: [],
            debitStop: '',
            ChargesCheck: false,
        };
        this.shwoingData = []
    }
    componentDidMount() {
        console.log("this.state.accounList: " + JSON.stringify(this.state.accounList))
        const formattedData = [];
        this.state.accounList.forEach(item => {
            if (['SAVING ACCOUNT', 'CURRENT ACCOUNT'].includes(item.ACTYPE)) {
                const existingType = formattedData.find(data => data.title === item.ACTYPE);
                if (existingType) {
                    existingType.data.push({ label: `${item.AC_NO}`, bal: `${item.BALANCE.startsWith('-') ? ("₹" + item.BALANCE.replace('-', '') + " Cr") : ("₹" + item.BALANCE + " Dr")}`, acmastcode: `${item.ACMASTCODE}`, min_bal: item.MIN_BAL, min_bal_req: item.MIN_BAL_REQ, debitStop: item.DEBITSTOP });
                } else {
                    formattedData.push({
                        title: item.ACTYPE,
                        data: [{ label: `${item.AC_NO}`, bal: `${item.BALANCE.startsWith('-') ? ("₹" + item.BALANCE.replace('-', '') + " Cr") : ("₹" + item.BALANCE + " Dr")}`, acmastcode: `${item.ACMASTCODE}`, min_bal: item.MIN_BAL, min_bal_req: item.MIN_BAL_REQ, debitStop: item.DEBITSTOP }],
                    });
                }
            }
        });

        this.shwoingData.push(formattedData)
        this.shwoingData.map((person, index) => {
            if (['saving account', 'loan account', 'current account'].includes(Constants.Selected_ACTYPE)) {
                this.setState({ myJsonArray: person, accType: Constants.Selected_AC_NO, acmastcode: Constants.Selected_ACMASTCODE, min_bal: Constants.Selected_MIN_BAL, min_bal_req: Constants.Selected_MIN_BAL_REQ, myBalance: Constants.Selected_BALANCE })
                this.GetBeneficiaryList(Constants.Selected_AC_NO, Constants.Selected_ACMASTCODE)
                this.GetAccountDetails(Constants.Selected_AC_NO, Constants.Selected_ACMASTCODE)
            }
            else {
                this.setState({ myJsonArray: person, accType: person[index].data[index].label, acmastcode: person[index].data[index].acmastcode, min_bal: person[index].data[index].min_bal, min_bal_req: person[index].data[index].min_bal_req, myBalance: person[index].data[index].bal })
                this.GetBeneficiaryList(person[index].data[index].label, person[index].data[index].acmastcode)
                this.GetAccountDetails(person[index].data[index].label, person[index].data[index].acmastcode)

            }
        })
    }

    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg

    onBackAction() {
        navigation.goBack(this)
    }
    toggleModal = () => {
        this.setState({ isBeneficiaryPopupVisible: false, searchTerm: '' })
    };

    PressYes = (item1, item2) => {
        this.toggleModal();
        if (item1.BENF009 != null && item1.BENF009 != '') {
            this.setState({
                benificiaryAcc: item1.BENF008,
                beneficiaryAccType: item1.BENF008,
                benificiaryAccTitle: item1.BENF009,
                isClick: item2,
                bnfId: item1.BENF001,
                bnfMob: item1.BENF016,
                bnfBrCd: item1.BENF006,
            });
        };
    }

    toggleModalConfirmPopup = () => {
        this.setState({ isConfirmPopup: false })
    };

    toggleModalConfirmYesPopup = () => {
        this.toggleModalConfirmPopup();
        if ((parseFloat(this.state.imps_chrg_rq) == 1) && (parseFloat(this.state.chrg_amt) + parseFloat(this.state.netchrg_amt) <= 0)) {
            Snackbar.show({
                text: 'Charges amount not defined, Please contact your branch',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red'
            });
        }
        this.minBalanceCalculation(this.state.chrg_amt, this.state.netchrg_amt)
    };

    toggleModalChargesConfirmPopup = () => {
        this.setState({ isChargesConfirmPopup: false })
    };
    toggleModalChargesConfirmYesPopup = () => {
        this.toggleModalChargesConfirmPopup();
        this.CallFunction();
    };

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    toggleModalYesNoDialog = () => {
        this.setState({ isYesNoModalVisible: false, ChargesCheck: false })
    };
    toggleYesModal = () => {
        this.toggleModalYesNoDialog();
        if (this.state.ChargesCheck) {
            this.setState({ ChargesCheck: false })
            navigation.navigate(this, 'ImpsTransferDetails', {
                from: this.state.callFrom,
                fromAcc: this.state.accType,
                toAcc: this.state.benificiaryAcc,
                remark: this.state.remark,
                amount: this.state.amount,
                fromAccAcmastCode: this.state.acmastcode,
                beneficiaryAccAcmastCode: this.state.beneficiaryAccAcmastCode,
                fromAccName: this.state.fromAccName,
                beneficiaryAccName: this.state.benificiaryAccTitle,
                benfId: this.state.bnfId,
                chrg_amt: this.state.chrg_amt,
                netchrg_amt: this.state.netchrg_amt,
                bnfBrCd: this.state.bnfBrCd,
                accList: this.state.accounList,
            });

        }
        else {
            if (this.state.confirmRequest) {
                this.ConfirmRequest();
            } else {
                if (this.props.termsAndConditionShownForImps) {
                    this.GetIMPSCharge()
                }
                else {
                    setTimeout(() => {
                        this.setState({ isTermsConditionModalVisible: true })
                    }, Platform.OS === 'ios' ? 500 : 0);

                }
            }
        }

    };
    toggleModalOkDialog = () => {
        this.setState({ isOkModalVisible: false })
    };
    toggleModalYesDialog = () => {
        if (this.state.isFromGoogle) {
            navigation.navigate(this, 'bottomNavigator');
        } else {
            this.toggleModalOkDialog();
        }
    };
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
    onSelectAccount = (value, title, acmastcode, acName, debitStop, min_bal, min_bal_req) => {
        console.log("debitStop: " + debitStop)
        this.setState({ isQuickModalVisible: false })
        if (acmastcode === null || acmastcode === undefined || acmastcode.trim() === "") {

        }
        else {
            if (this.state.labelText === 'From A/c') {
                {
                    this.setState({ accType: value, fromAcc: value, acmastcode: acmastcode, min_bal: min_bal, min_bal_req: min_bal_req, myBalance: title, debitStop: debitStop })
                }

                this.GetBeneficiaryList(value, acmastcode)
                this.GetAccountDetails(value, acmastcode)
            }
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
    toCallSubmit() {
        const result = this.ValidateForm();
        if (result) {


            if (Constants.UserId === 'google' || Constants.UserId === 'GOOGLE') {

                navigation.navigate(this, 'ImpsTransferSuccess', {
                    from: this.state.callFrom,
                    trnId: '58869',
                  });

            }
            else {


                const trn_amount = parseFloat(this.state.amount)
                const ac_balacne = parseFloat(this.state.availableBalance)
                const m_bal = parseFloat(this.state.min_bal)

                const remain_TransactionBalance = ac_balacne - m_bal


                console.log("trn_amount " + trn_amount);
                console.log("ac_balacne " + ac_balacne);
                console.log("m_bal " + m_bal);
                console.log("remain_TransactionBalance " + remain_TransactionBalance);


                if (this.state.min_bal_req === 'N') {
                    if (trn_amount > remain_TransactionBalance) {
                        this.setState({ isYesNoModalVisible: true })
                        this.props.setOkDialogText('Due to this transaction, the account balance will fall below the minimum balance. Do you want to proceed?')
                    }
                    else {
                        if (this.props.termsAndConditionShownForImps) {
                            this.GetIMPSCharge()
                        }
                        else {
                            this.setState({ isTermsConditionModalVisible: true })
                        }
                    }

                }
                else {
                    if (trn_amount > remain_TransactionBalance) {
                        this.setState({ isOkModalVisible: true })
                        this.props.setOkDialogText('This transaction cannot be done because the balance goes below the minimum balance')
                    }
                    else {
                        if (this.props.termsAndConditionShownForImps) {
                            this.GetIMPSCharge()
                        }
                        else {
                            this.setState({ isTermsConditionModalVisible: true })
                        }
                    }


                }


            }

        }

    }


    ValidateForm() {
        var result = true;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        const bal = parseFloat(this.state.availableBalance)
        this.setState({ error_amount: '', error_remark: '', error_beneficiaryAcc: '' });
        if (!MyValidator.isEmptyField(this.state.amount).isValid) {
            this.setState({ error_amount: 'Please enter amount' });
            result = false;
        }
        const Remark = this.state.remark.trim();

        if (!MyValidator.isEmptyField(Remark).isValid) {
            this.setState({ error_remark: 'Please enter remark' });
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
        if (this.state.beneficiaryAccType === 'Search or Select Beneficiary A/c') {
            this.setState({ error_beneficiaryAcc: 'Select Beneficiary A/c' });
            result = false;
        }
        if (specialCharRegex.test(this.state.remark)) {
            setTimeout(() => {
                this.setState({ isOkModalVisible: true })
            }, Platform.OS === 'ios' ? 500 : 0);
            this.props.setOkDialogText('Special charcters not allowed in remark..!!')
            result = false;
        }
        if (this.state.accounList.length == 0 || this.state.myJsonArrayforBeneficiaryList.length == 0) {
            this.props.setOkDialogText('Insufficient Data!!')
            result = false;
        }
        const amount = this.state.availableBalance;
        if (parseFloat(this.state.amount) > parseFloat(amount)) {
            setTimeout(() => {
                this.setState({ isOkModalVisible: true })
            }, Platform.OS === 'ios' ? 500 : 0);
            this.props.setOkDialogText('Amount is greater than account balance!! ' + amount)
            result = false;
        }
        if (bal < 0) {
            setTimeout(() => {
                this.setState({ isOkModalVisible: true })
            }, Platform.OS === 'ios' ? 500 : 0);
            this.props.setOkDialogText('Insufficient Balance')
            result = false;
        }
        if (this.state.amount < 1) {
            setTimeout(() => {
                this.setState({ isOkModalVisible: true })
            }, Platform.OS === 'ios' ? 500 : 0);
            this.props.setOkDialogText('Enter Amount in Rupee!!')
            result = false;
        }
        if (parseFloat(this.state.amount) > parseFloat(this.state.IMPS_TRN_LMT)) {
            setTimeout(() => {
                this.setState({ isOkModalVisible: true })
            }, Platform.OS === 'ios' ? 500 : 0);
            this.props.setOkDialogText('Amount should not be greater than transaction limit please contact to your branch, your transaction limit is ' + this.state.IMPS_TRN_LMT)
            result = false;
        }
        if (this.state.accounList.length == 0 || this.state.myJsonArrayforBeneficiaryList.length == 0) {
            this.props.setOkDialogText('Insufficient Data!!')
            result = false;
        }
        if(this.props.userId === 'google' || this.props.userId === 'GOOGLE')
        {
            this.setState({ isFromGoogle: true })
            setTimeout(() => {
                this.setState({ isOkModalVisible: true })
            }, Platform.OS === 'ios' ? 500 : 0);
            this.props.setOkDialogText("Transaction done successfully")
            result = false;
        }
        if ((this.state.debitStop != null) && (this.state.debitStop != '') && (parseInt(this.state.debitStop) === 1)) {
            Snackbar.show({
                text: 'Selected Debit Account is Debit Stopped. Please Contact your Branch...!',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red'
            });
            result = false;
        }
        return result;
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
    GetIMPSCharge = async () => {
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {
            try {
                const Headers = APIUrlConstants.Headers("GETIMPSCHRG");


                const jsonReq =
                {
                    customerId: Constants.GMST_CODE,
                    acMastCode: this.state.acmastcode,
                    acNo: this.state.accType,
                    branchCd: Constants.BRANCH_CODE,
                    secKey: Constants.SecretKey,
                    divId: this.props.DeviceId,
                    amt: this.state.amount
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
                            this.setState({ chrg_amt: '0.0', netchrg_amt: '0.0', imps_chrg_rq: finalRes.IMPSCHRGRQ, charges_amt: '0.0' })
                            const ErrorMsg = finalRes.RESULT
                            Snackbar.show({
                                text: ErrorMsg,
                                duration: Snackbar.LENGTH_SHORT,
                                backgroundColor: 'red'

                            });
                            this.setState({ mps_chrg_rq: finalRes.IMPSCHRGRQ })
                            if (this.state.imps_chrg_rq == 1) {
                                Snackbar.show({
                                    text: 'Charges amount not defined, Please contact your branch',
                                    duration: Snackbar.LENGTH_SHORT,
                                    backgroundColor: 'red'
                                });
                            }
                        }
                        else if (finalRes.SUCCESS === "TRUE") {
                            this.setState({ chrg_amt: finalRes.CHRG_AMT, netchrg_amt: finalRes.NETCHRG_AMT, imps_chrg_rq: finalRes.IMPSCHRGRQ, charges_amt: parseFloat(finalRes.CHRG_AMT) + parseFloat(finalRes.NETCHRG_AMT) })
                            this.setState({ isConfirmPopup: true })

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

    minBalanceCalculation(chargeAmt, netChargAmt) {
        console.log("chargeAmt: " + chargeAmt + " netChargAmt: " + netChargAmt)
        const chrg_amt = parseFloat(chargeAmt) + parseFloat(netChargAmt)
        const trn_amount = parseFloat(this.state.amount)
        const ac_balacne = parseFloat(this.state.availableBalance)
        const m_bal = parseFloat(this.state.min_bal)
        const transferable_amount = chrg_amt + trn_amount
        const remain_balance = ac_balacne - transferable_amount
        const remain_TransactionBalance = ac_balacne - m_bal
        console.log("ac_balacne: " + ac_balacne)
        console.log("trn_amount: " + trn_amount)
        console.log("chrg_amt: " + chrg_amt)
        console.log("m_bal: " + m_bal)
        console.log("transferable_amount: " + transferable_amount)
        console.log("remain_balance: " + remain_balance)
        console.log("remain_TransactionBalance: " + remain_TransactionBalance)
        console.log("min_bal_req: " + this.state.min_bal_req)

        if (remain_balance < m_bal) {

            if (this.state.min_bal_req === 'Y') {
                // setTimeout(() => {
                //     this.setState({ isOkModalVisible: true })
                // }, Platform.OS === 'ios' ? 500 : 0);
                // this.props.setOkDialogText("This transaction cannot be done because the balance goes below the minimum balance.")


                //PRH
                if (remain_TransactionBalance < transferable_amount) {
                    setTimeout(() => {
                        this.setState({ isOkModalVisible: true })
                    }, Platform.OS === 'ios' ? 500 : 0);
                    this.props.setOkDialogText('This transaction cannot be done because the balance goes below the minimum balance')
                }
                else {
                    navigation.navigate(this, 'NeftransferDetails', { from: this.state.callFrom, fromAcc: this.state.accType, toAcc: this.state.benificiaryAcc, remark: this.state.remark, amount: this.state.amount, fromAccAcmastCode: this.state.acmastcode, beneficiaryAccAcmastCode: this.state.beneficiaryAccAcmastCode, fromAccName: this.state.fromAccName, beneficiaryAccName: this.state.benificiaryAccTitle, chrg_amt: this.state.chrg_amt, bnfId: this.state.bnfId, bnfBrCd: this.state.bnfBrCd, accList: this.state.accounList })

                }

            }
            else {

                if (parseFloat(this.state.amount) + parseFloat(this.state.chrg_amt) > Math.abs(ac_balacne)) {
                    setTimeout(() => {
                        this.setState({ isOkModalVisible: true })
                    }, Platform.OS === 'ios' ? 500 : 0);
                    this.props.setOkDialogText('Balance of account must not exceed amount plus charges !')
                }
                else {
                    this.setState({ confirmRequest: true })
                    setTimeout(() => {
                        this.setState({ isYesNoModalVisible: true })
                    }, Platform.OS === 'ios' ? 500 : 0);
                    this.props.setOkDialogText("Due to this transaction balance goes below the minimum balance do you want to proceed ?.")
                }


            }



        }
        else {
            this.setState({ charges_amt: parseFloat(chargeAmt) + parseFloat(netChargAmt) })
            const bal = this.state.availableBalance;
            if (parseFloat(bal) < 0) {
                setTimeout(() => {
                    this.setState({ isOkModalVisible: true })
                }, Platform.OS === 'ios' ? 500 : 0);
                this.props.setOkDialogText('Balance not available  in your account!! ' + bal)
            }
            else if (this.state.amount === '') {
                setTimeout(() => {
                    this.setState({ isOkModalVisible: true })
                }, Platform.OS === 'ios' ? 500 : 0);
                this.props.setOkDialogText('Please enter correct amount!! ' + bal)
            }
            else if ((parseFloat(this.state.amount) + parseFloat(chargeAmt) + parseFloat(netChargAmt)) > Math.abs(bal)) {
                setTimeout(() => {
                    this.setState({ isOkModalVisible: true })
                }, Platform.OS === 'ios' ? 500 : 0);
                this.props.setOkDialogText('Amount+Charges not greater than account balance!! ' + amount)
            }
            else {
                if (parseFloat(this.state.imps_chrg_rq) == 1 || (parseFloat(chargeAmt) + parseFloat(netChargAmt) <= 0)) {
                    navigation.navigate(this, 'ImpsTransferDetails', {
                        from: this.state.callFrom,
                        fromAcc: this.state.accType,
                        toAcc: this.state.benificiaryAcc,
                        remark: this.state.remark,
                        amount: this.state.amount,
                        fromAccAcmastCode: this.state.acmastcode,
                        beneficiaryAccAcmastCode: this.state.beneficiaryAccAcmastCode,
                        fromAccName: this.state.fromAccName,
                        beneficiaryAccName: this.state.benificiaryAccTitle,
                        benfId: this.state.bnfId,
                        chrg_amt: this.state.chrg_amt,
                        netchrg_amt: this.state.netchrg_amt,
                        bnfBrCd: this.state.bnfBrCd,
                        accList: this.state.accounList,
                    });
                }
            }
        }
    }



    GetBeneficiaryList = async (acNo, acmastcode) => {
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {
            try {
                const Headers = APIUrlConstants.Headers("GETIMPSBNFLIST");
                const jsonReq =
                {
                    customerId: Constants.GMST_CODE,
                    acMastCode: acmastcode,
                    acNo: acNo,
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
                        var responseData = await decryptData(response)
                        var newRes = responseData.slice(16)
                        var finalRes = JSON.parse(newRes)
                        if (finalRes.SUCCESS === "FALSE") {
                            const ErrorMsg = finalRes.RESULT
                            this.setState({ myJsonArrayforBeneficiaryList: [], filteredData: [], isClick: '', benificiaryAccTitle: '' })
                            // }
                        }
                        else if (finalRes.SUCCESS === "TRUE") {
                            const acdtlsArray = finalRes.Acdtls.map(item => JSON.parse(item.replace(/\\/g, '')));
                            this.setState({ myJsonArrayforBeneficiaryList: acdtlsArray, filteredData: acdtlsArray, isClick: '', benificiaryAccTitle: '' })
                            if ("IMPS_DLY_LMT" in finalRes) {
                                this.setState({ NEFT_DLY_FLAG: 'Y', NEFT_DLY_LMT: finalRes.IMPS_DLY_LMT })
                            }
                            else {
                                this.setState({ NEFT_DLY_FLAG: 'N' })
                            }
                            if ("IMPS_USED_LMT" in finalRes) {
                                this.setState({ NEFT_DLY_FLAG: 'Y', NEFT_USED_LMT: finalRes.IMPS_USED_LMT })
                            }
                            else {
                                this.setState({ NEFT_DLY_FLAG: 'N' })
                            }
                            if ("IMPS_TRN_LMT" in finalRes) {
                                this.setState({ IMPS_TRN_LMT: finalRes.IMPS_TRN_LMT })
                            }
                            else {
                                this.setState({ IMPS_TRN_LMT: '0' })
                            }

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
    GetAccountDetails = async (fromAcc, acmastcode) => {
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {
            try {
                const Headers = APIUrlConstants.Headers("GETALLBAL");

                const Body =
                {
                    PARACNT: "1",
                    PARA1_TYP: "STR",
                    PARA1_VAL: "{\"ACMASTCODE\":\"" + acmastcode + "\",\"AC_NO\":\"" + fromAcc + "\"}"
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
                            Snackbar.show({
                                text: ErrorMsg,
                                duration: Snackbar.LENGTH_SHORT,
                                backgroundColor: 'red'
                            });
                            this.setState({ availableBalance: '0.0' })

                        }
                        else if (res === "TRUE") {
                            this.setState({ availableBalance: response['ALLOWABLE BALANCE'] })
                            if (parseFloat(this.state.availableBalance) <= 0) {
                                Snackbar.show({
                                    text: 'No Balance, Please contact your branch',
                                    duration: Snackbar.LENGTH_SHORT,
                                    backgroundColor: 'red'
                                });
                            }
                            else if (parseFloat(this.state.availableBalance) == 0) {
                                Snackbar.show({
                                    text: 'Invalid Account Selected, Please contact your branch',
                                    duration: Snackbar.LENGTH_SHORT,
                                    backgroundColor: 'red'
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
                text: 'Check Internet Connection',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red'
            });
        }

    }

    ConfirmRequest() {
        console.log("ConfirmRequest1")
        const amt = this.state.amount
        const bacNo = this.state.benificiaryAcc + " + " + this.state.benificiaryAccTitle
        const bal = this.state.myBalance
        if (Constants.IS_IMPSFAST === '1' && this.state.benificiaryAcc != this.state.benificiaryAcc) {
            console.log("ConfirmRequest2")
            setTimeout(() => {
                this.setState({ isOkModalVisible: true })
            }, Platform.OS === 'ios' ? 500 : 0);
            this.props.setOkDialogText('Confirm Beneficiary is not match')
        }
        else {
            console.log("ConfirmRequest3")
            if ((parseFloat(this.state.imps_chrg_rq) == 1) && (parseFloat(this.state.chrg_amt) + parseFloat(this.state.netchrg_amt) <= 0)) {
                console.log("ConfirmRequest4")
                Snackbar.show({
                    text: 'Charges amount not defined, Please contact your branch',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'red'
                });
            }
            setTimeout(() => {
                this.setState({ isChargesConfirmPopup: true })
            }, Platform.OS === 'ios' ? 500 : 0);

        }
    }
    CallFunction() {
        if (this.state.NEFT_DLY_FLAG === 'Y') {
            const amt = parseFloat(this.state.amount)
            const totalAmt = parseFloat(amt) + parseFloat(this.state.NEFT_USED_LMT) + parseFloat(this.state.chrg_amt)
            if (parseFloat(parseFloat(totalAmt) > parseFloat(this.state.NEFT_DLY_LMT))) {
                if (parseFloat(this.state.NEFT_DLY_LMT) === 0 || parseFloat(this.state.NEFT_DLY_LMT) === 0.0) {
                    navigation.navigate(this, 'ImpsTransferDetails', {
                        from: this.state.callFrom,
                        fromAcc: this.state.accType,
                        toAcc: this.state.benificiaryAcc,
                        remark: this.state.remark,
                        amount: this.state.amount,
                        fromAccAcmastCode: this.state.acmastcode,
                        beneficiaryAccAcmastCode: this.state.beneficiaryAccAcmastCode,
                        fromAccName: this.state.fromAccName,
                        beneficiaryAccName: this.state.benificiaryAccTitle,
                        benfId: this.state.bnfId,
                        chrg_amt: this.state.chrg_amt,
                        netchrg_amt: this.state.netchrg_amt,
                        bnfBrCd: this.state.bnfBrCd,
                        accList: this.state.accounList,
                    });
                }
                else {
                    setTimeout(() => {
                        this.setState({ isOkModalVisible: true })
                    }, Platform.OS === 'ios' ? 500 : 0);
                    this.props.setOkDialogText('IMPS daily limit exceded for day. Try with lesser amount or visit your branch for transaction')
                }
            }
            else {
                navigation.navigate(this, 'ImpsTransferDetails', {
                    from: this.state.callFrom,
                    fromAcc: this.state.accType,
                    toAcc: this.state.benificiaryAcc,
                    remark: this.state.remark,
                    amount: this.state.amount,
                    fromAccAcmastCode: this.state.acmastcode,
                    beneficiaryAccAcmastCode: this.state.beneficiaryAccAcmastCode,
                    fromAccName: this.state.fromAccName,
                    beneficiaryAccName: this.state.benificiaryAccTitle,
                    benfId: this.state.bnfId,
                    chrg_amt: this.state.chrg_amt,
                    netchrg_amt: this.state.netchrg_amt,
                    bnfBrCd: this.state.bnfBrCd,
                    accList: this.state.accounList,
                });
            }
        }
    }

    toggleModalTermsCondition = () => {
        this.setState({ isTermsConditionModalVisible: false })
    };
    toggleModalTermsConditionSubmitButton = () => {
        this.props.setTermsAndConditionForImps(true);
        this.toggleModalTermsCondition();
        this.GetIMPSCharge();
    };
    render() {
        return (
            <View style={styles.mainView}>
                <ImageBackground style={styles.mainView}
                    source={this.bgImage}
                    resizeMode='cover'>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        enabled={true}>
                        <TrasnperantFixedHomeHeader
                            backAction={() => this.onBackAction()} />
                        <View style={styles.lableHeader}>
                            <View style={styles.lableHeaderView}>
                                <Text style={styles.impsTitle}>{strings.impsText + " Transfer"}
                                </Text>
                                <Text style={styles.impsDescription}>Express Transfers, Anytime, Anywhere
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
                                        this.state.availableBalance
                                    )}
                                </View>
                                <Text style={styles.allowableBalanceText}>
                                    Allowable Balance
                                </Text>
                                <Text style={styles.allowableBalanceValue}>
                                    {strings.rupee + this.state.availableBalance}
                                </Text>

                                <CardView
                                    style={styles.cardViewStyle}
                                    cardElevation={2}
                                    cardMaxElevation={2}
                                    cornerRadius={8}>

                                    <View style={styles.benficiaryAccView}>
                                        <TouchableOpacity style={styles.fromAccTouchable}
                                            onPress={() => {
                                                if (this.state.myJsonArrayforBeneficiaryList != null && this.state.myJsonArrayforBeneficiaryList.length > 0) {
                                                    if (this.state.accType != '') {
                                                        this.setState({ isBeneficiaryPopupVisible: true, labelText: 'Search or Select Beneficiary A/c' })
                                                    }
                                                    else {
                                                        Snackbar.show({
                                                            text: 'Select From A/c',
                                                            duration: Snackbar.LENGTH_SHORT,
                                                            backgroundColor: 'red'
                                                        });
                                                    }
                                                }
                                                else {
                                                    Snackbar.show({
                                                        text: 'No beneficiary record available..!!',
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
                                            <View
                                                style={styles.fromAccDropDown}></View>
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
                                                    <View style={styles.horizontalView}>
                                                        <Text style={styles.accNoText}>
                                                            A/c No:{this.state.benificiaryAcc}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View> : null}

                                <TouchableOpacity style={styles.amountTouchable}
                                    onPress={() => {
                                        if (this.state.benificiaryAcc === '') {
                                            Snackbar.show({
                                                text: 'Select Beneficiary A/c',
                                                duration: Snackbar.LENGTH_SHORT,
                                                backgroundColor: 'red'
                                            });
                                        }
                                    }}>
                                    <TextInput style={styles.amountTextInput}
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
                                        label="Amount"
                                        value={this.state.amount}
                                        onChangeText={amount => {
                                            // this.setState({ amount: amount.replace(/[^0-9]/g, ''), });
                                            const regex = /^(\d{0,6})(\.\d{0,2})?$/;
                                            const match = amount.match(regex);
                                            if (match) {
                                                this.setState({ amount: match[0] });
                                            }

                                            if (amount.length === 1 && (amount === '0' || amount === '.')) {
                                                this.setState({ amount: '' });
                                            }
                                        }}
                                        keyboardType='decimal-pad'
                                        mode='outlined'
                                        editable={this.state.benificiaryAcc === '' ? false : true}
                                        returnKeyType='next'
                                        onSubmitEditing={() => { this.rm.focus(); }}
                                        blurOnSubmit={false}
                                    />
                                    {this.state.error_amount !== '' && (<Text style={styles.ErrorDisplay}>{this.state.error_amount}</Text>)}
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.remarkTouchable}
                                    onPress={() => {
                                        if (this.state.amount === '') {
                                            Snackbar.show({
                                                text: 'Please enter amount',
                                                duration: Snackbar.LENGTH_SHORT,
                                                backgroundColor: 'red'
                                            });
                                        }
                                    }}>

                                    <TextInput
                                        style={styles.remarkTextInput}
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
                                        label="Remark"
                                        value={this.state.remark}
                                        onChangeText={remark => {
                                            this.setState({ remark: remark.replace(/[^0-9A-Za-z ]/g, '') });
                                        }}
                                        mode='outlined'
                                        editable={this.state.amount === '' ? false : true}
                                        ref={(input) => { this.rm = input; }}
                                    />
                                    {this.state.error_remark !== '' && (<Text style={styles.ErrorDisplay}>{this.state.error_remark}</Text>)}
                                </TouchableOpacity>
                                <View style={styles.chargeAmtView}>
                                    <Text style={styles.chargeAmtText}>
                                        Charges Amount:
                                    </Text>
                                    <Text style={[styles.chargeAmtTextValue, { color: this.props.themeColor }]}>
                                        {this.state.charges_amt}
                                    </Text>
                                </View>
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
                                DialogTermsAndCondition(
                                    this.state.isTermsConditionModalVisible,
                                    this.toggleModalTermsCondition,
                                    this.toggleModalTermsConditionSubmitButton,
                                    this.state.termsAndConditions,
                                    'IMPS Transfer'
                                )
                            }
                            {
                                DialogYesNoModal(
                                    this.state.isYesNoModalVisible,
                                    this.toggleModalYesNoDialog,
                                    this.toggleYesModal,
                                    this.props.okDialogText,
                                    this.props.SecondaryColor
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
                            {
                                DialogAddBeneficiaryConfirmPopup(
                                    this.state.isConfirmPopup,
                                    this.toggleModalConfirmPopup,
                                    this.toggleModalConfirmYesPopup,
                                    (parseFloat(this.state.chrg_amt) + parseFloat(this.state.netchrg_amt)),
                                    this.state.benificiaryAccTitle,
                                    this.state.benificiaryAcc,
                                    this.state.amount,
                                    'IMPS Transfer'
                                )
                            }
                            {
                                DialogAddBeneficiaryConfirmPopup(
                                    this.state.isChargesConfirmPopup,
                                    this.toggleModalChargesConfirmPopup,
                                    this.toggleModalChargesConfirmYesPopup,
                                    parseFloat(this.state.chrg_amt) + parseFloat(this.state.netchrg_amt),
                                    this.state.benificiaryAccTitle,
                                    this.state.benificiaryAcc,
                                    (parseFloat(this.state.chrg_amt) + parseFloat(this.state.netchrg_amt) + parseFloat(this.state.amount)),
                                    'IMPS Charges Confirm',
                                    this.state.amount
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
    ErrorDisplay:
    {
        color: '#FF0000',
        marginLeft: 5,
        fontSize: 12
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
        marginBottom: 10,
    },
    impsTitle:
    {
        fontSize: 20,
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: colors.white,
    },
    impsDescription:
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
    searchOrSelecBeneficiaryView:
    {
        marginTop: 10,
        height: 48,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.white,
        elevation: 4,
        marginLeft: 1,
        marginRight: 1,
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

    cardViewStyle:
    {
        marginTop: 5,
        marginHorizontal: 1,
        backgroundColor: colors.white,
    },
    dottedClickView:
    {
        borderStyle: 'dotted',
        borderWidth: 2,
        borderRadius: 8,
        borderColor: '#93B1C8',
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
    horizontalView:
    {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    accNoText:
    {
        color: '#252525',
        fontFamily: strings.fontMedium,
        fontSize: 12,
        marginBottom: 10
    },
    viewHistoryText:
    {
        color: '#1F3C66',
        fontFamily: strings.fontMedium,
        fontSize: 12
    },
    amountTouchable:
    {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 10,
        marginTop: 10,
    },
    amountTextInput:
    {
        lineHeight: 40,
        height: 48,
        width: width - 50,
    },
    remarkTouchable:
    {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    remarkTextInput:
    {
        lineHeight: 40,
        height: 48,
        width: width - 50,
        borderColor: '#DFE1E8'
    },
    chargeAmtView:
    {
        flexDirection: 'row',
        marginTop: 8
    },
    chargeAmtText:
    {
        color: '#1F3C66',
        fontWeight: '500',
        fontFamily: strings.fontMedium,
        fontSize: 15,
    },
    chargeAmtTextValue:
    {
        fontWeight: '500',
        marginLeft: 3,
        fontFamily: strings.fontMedium,
        fontSize: 15,
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
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15
    },
    historyButtonText:
    {
        fontFamily: strings.fontMedium,
        fontWeight: '600',
        fontSize: 24,
        color: '#133A72',
        marginBottom: 16,
    },
    historyCard:
    {
        backgroundColor: colors.white,
        justifyContent: 'center',
        marginTop: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.white,
    },
    historyHorizontal:
    {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        borderColor: '#E3E3E3',
        borderWidth: 1,
    },
    upArrowView:
    {
        height: 36,
        width: 36,
        borderRadius: 36 / 2,
        backgroundColor: '#eb5757' + '1A',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    downArrowView:
    {
        height: 36,
        width: 36,
        borderRadius: 36 / 2,
        backgroundColor: '#EB5757',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    downGreenArrow:
    {
        height: 36,
        width: 36,
        borderRadius: 36 / 2,
        backgroundColor: '#27ae60' + '1A',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    horizontalLableView:
    {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    columnLableView:
    {
        padding: 2,
        flex: 0.75,
        alignSelf: 'center',
    },
    flatListTitle:
    {
        fontFamily: strings.fontMedium,
        fontSize: 14,
        color: 'black',
    },
    flatListTitleDescription:
    {
        fontFamily: strings.fontRegular,
        fontSize: 12,
        color: '#686868',
    },
    ErrorDisplay:
    {
        color: "#FF0000",
        marginLeft: 5,
        fontSize: 12
    },
    amountAndDateView:
    {
        flex: 0.5,
        alignSelf: 'center',
    },
    flatListAmountText:
    {
        textAlign: 'right',
        paddingTop: 5,
        fontFamily: strings.fontBold,
        fontSize: 14,

    },
    dateText:
    {
        textAlign: 'right',
        fontFamily: strings.fontMedium,
        fontSize: 12,
        color: '#686868',
    },
    loadMoreTouchable:
    {
        marginTop: 15,
        marginBottom: 15,
        height: 40,
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#8bb9dc',
        marginHorizontal: 24,
    },
    loadMoreText:
    {
        color: 'black',
        fontFamily: strings.fontMedium,
        fontSize: 14,
    },
};

export default connect(mapStateToProps, mapDispatchToProps)(ImpsTransfer);