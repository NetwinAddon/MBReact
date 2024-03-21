import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    KeyboardAvoidingView,
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
    RenderLoader,
} from '../../App';
import Arrowdown from '../../assets/icons/dashboardIcons/arrow_down.svg';
import { TextInput } from 'react-native-paper';
import CardView from 'react-native-cardview';
import APIUrlConstants from '../../common/APIUrlConstants';
import { _toEncrypt, addMonths } from '../../common/util';
import MyValidator from '../../common/MyValidator';
import Constants from '../../common/Constants';
import { BeneficiaryCustomPopupDropDown } from '../../components/BeneficiaryCustomPopupDropDown';
import Snackbar from 'react-native-snackbar';
import { QuickPayCustomPopupDropDownForLoan } from '../../components/QuickPayCustomPopupDropDownForLoan';
import moment from 'moment'
import TrasnperantFixedHomeHeader from '../../components/TrasnperantFixedHomeHeader';
import NetInfo from '@react-native-community/netinfo';
import { DialogYesNoModal } from '../../components/DialogYesNoModal';
import { OKDialogFundTransfer } from '../../components/OKDialogFundTransfer';
import { DialogTermsAndCondition } from '../../components/DialogTermsAndCondition';

class QuickPayOwnAccTransfer extends Component {
    constructor(props) {
        super(props);
        this.inactivityWarningRef = React.createRef();
        this.state = {
            isModalVisible: false,
            isFromGoogle: false,
            isBeneficiaryModalVisible: false,
            accType: 'Select A/c',
            beneficiaryAccType: 'Select A/c',
            labelText: '',
            beneficiaryLabelText: '',
            amount: '',
            remark: '',
            fromAcc: '',
            benificiaryAcc: '',
            error_amount: '',
            error_remark: '',
            error_beneficiaryAcc: '',
            error_FromAcc: '',
            callFrom: this.props.route.params.from,
            accounList: this.props.route.params.from === 'dashboard' ? props.route.params.dashboardArray : props.route.params.accList,
            myJsonArray: [],
            myBeneficiaryJsonArray: [],
            debitStop: '',
            dlyLmt: '',
            ftTrnLmt: '0',
            usedLmt: '',
            min_bal: '',
            min_bal_req: '',
            DEBIT_GL_TYPE: '',
            CREDIT_GL_TYPE: '',
            CUR_INSTALLMENT_DATE: '',
            PENDING_INSTALLMENT: '',
            AC_TYPE: '',
            fromAccAcmastCode: '',
            beneficiaryAccAcmastCode: '',
            fromAccName: '',
            beneficiaryAccName: '',
            beneficiaryAccBalance: '',
            availableBalance: '0.0',
            beneficiaryList: [],
            isYesNoModalVisible: false,
            isOkModalVisible: false,
            // isTermsConditionModalVisible: false,
            bBranchCode: '',
            // termsAndConditions: [
            //     'User Responsibility: \n- The user acknowledges that they are solely responsible for any fund transfers initiated from their own account.\n- The user must ensure the accuracy of the transaction details, including the recipient\'s account information. 2.The Customer solely shall be responsible for the safe custody and security of IMPS application downloaded on their mobile phones. The Customer shall immediately inform the bank about the loss or theft of mobile phone for disabling of the IMPS service to prevent unauthorized usage.',
            //     'Authorization:\n- The user authorizes the bank to process fund transfers based on the instructions provided through the designated channels (e.g., online banking, mobile banking).',
            //     'Security Measures:\n- The user agrees to take necessary precautions to safeguard their account credentials and personal information to prevent unauthorized access and use.',
            //     'Transaction Limits:\n- The bank may impose limits on the amount and frequency of fund transfers. The user is responsible for adhering to these limits.',
            //     'Transaction Processing Time:\n- The user acknowledges that fund transfer processing times may vary. The bank is not responsible for any delay in processing beyond its control.',
            //     'Liability Limitation:\n- The bank shall not be liable for any loss, damage, or unauthorized access to funds resulting from the user\'s negligence, disclosure of credentials, or failure to adhere to security recommendations.',
            //     'Technical Issues:\n- The bank is not responsible for any technical issues, including but not limited to system outages, connectivity problems, or disruptions in service that may affect fund transfer capabilities.',
            //     'Force Majeure:\n- The bank shall not be liable for any failure or delay in performing its obligations under these terms and conditions due to circumstances beyond its reasonable control.',
            //     'Modification of Terms:\n- The bank reserves the right to modify these terms and conditions at any time. Users will be notified of any changes, and continued use of the service constitutes acceptance of the modified terms.',
            //     'By using the fund transfer service, you agree to these terms and conditions. If you do not agree with any part of these terms, please refrain from using the service.',
            // ],
            isButtonclick: false,
            isRDValidation: false,
            isRDAccSelect: false,
            AC_DUE_DT: '',
            error_rd_info: '',
        };
        this.shwoingData = []
        this.beneshowingData = []

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    }
    componentDidMount() {
        console.log("AccountList: " + JSON.stringify(this.state.accounList))
        const formattedData = [];
        this.state.accounList.forEach(item => {
            if (item.ACTYPE === 'SAVING ACCOUNT' || item.ACTYPE === 'CURRENT ACCOUNT' || item.ACTYPE === 'LOAN ACCOUNT' && (item.SUB_TYPE === '2' || item.SUB_TYPE === '6' || item.SUB_TYPE === '7')) {
                const existingType = formattedData.find(data => data.title === item.ACTYPE);
                if (existingType) {
                    existingType.data.push({
                        label: `${item.AC_NO}`,
                        bal: `${item.BALANCE.startsWith('-') ? ("₹" + item.BALANCE.replace('-', '') + " Cr") : ("₹" + item.BALANCE + " Dr")}`,
                        acmastcode: `${item.ACMASTCODE}`,
                        acName: `${item.AC_NAME.replace('A\\C', 'A/c')}`,
                        debitStop: item.DEBITSTOP,
                        min_bal: item.MIN_BAL,
                        min_bal_req: item.MIN_BAL_REQ,
                        DEBIT_GL_TYPE: item.ACTYPE + " - " + item.AC_NO
                    });
                } else {
                    formattedData.push({
                        title: item.ACTYPE,
                        data: [{
                            label: `${item.AC_NO}`,
                            bal: `${item.BALANCE.startsWith('-') ? ("₹" + item.BALANCE.replace('-', '') + " Cr") : ("₹" + item.BALANCE + " Dr")}`,
                            acmastcode: `${item.ACMASTCODE}`,
                            acName: `${item.AC_NAME.replace('A\\C', 'A/c')}`,
                            debitStop: item.DEBITSTOP,
                            min_bal: item.MIN_BAL,
                            min_bal_req: item.MIN_BAL_REQ,
                            DEBIT_GL_TYPE: item.ACTYPE + " - " + item.AC_NO
                        }],
                    });
                }
            }
        });
        this.shwoingData.push(formattedData)
        this.shwoingData.map((person, index) => {
            console.log("Person", Constants.Selected_ACTYPE)
            if (['saving account', 'loan account', 'current account'].includes(Constants.Selected_ACTYPE)) {
                this.setState({ myJsonArray: person, accType: Constants.Selected_AC_NO, fromAccAcmastCode: Constants.Selected_ACMASTCODE, fromAccName: Constants.Selected_AC_NAME, debitStop: Constants.Selected_DEBIT_STOP, min_bal: Constants.Selected_MIN_BAL, min_bal_req: Constants.Selected_MIN_BAL_REQ, DEBIT_GL_TYPE: Constants.Selected_DEBIT_GL_TYPE })
                this.GetBeneficiaryList(Constants.Selected_AC_NO, Constants.Selected_ACMASTCODE)
                this.GetAllowableBalance(Constants.Selected_AC_NO, Constants.Selected_ACMASTCODE)

            }
            else {
                this.setState({ myJsonArray: person, accType: person[index].data[index].label, fromAccAcmastCode: person[index].data[index].acmastcode, fromAccName: person[index].data[index].acName, debitStop: person[index].data[index].debitStop, min_bal: person[index].data[index].min_bal, min_bal_req: person[index].data[index].min_bal_req, DEBIT_GL_TYPE: person[index].data[index].DEBIT_GL_TYPE })
                this.GetBeneficiaryList(person[index].data[index].label, person[index].data[index].acmastcode)
                this.GetAllowableBalance(person[index].data[index].label, person[index].data[index].acmastcode)
            }

        })

    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        navigation.goBack(this)
        return true;
    }

    onBackAction() {
        navigation.goBack(this)
    }
    checkInternetConnection = async () => {
        try {
            const state = await NetInfo.fetch();
            const isConnected = state.isConnected;
            console.log("Internet status:", isConnected);
            return isConnected;
        } catch (error) {
            console.error("Error checking internet connection:", error);
            return false;
        }
    };

    validateInput = (input, digitsBeforeZero, digitsAfterZero) => {
        const pattern = new RegExp(
            `[0-9]{0,${digitsBeforeZero - 1}}(\\.?[0-9]{0,${digitsAfterZero - 1}})?`
        );
        return pattern.test(input);
    };

    GetBeneficiaryList = async (fromAcc, acmastcode) => {
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {
            try {
                const Headers = APIUrlConstants.Headers("GETSLFFTBENF");
                const Body =
                {
                    PARACNT: "1",
                    PARA1_TYP: "STR",
                    PARA1_VAL: "{\"customerId\":\"" + Constants.GMST_CODE + "\",\"secKey\":\"" + Constants.SecretKey + "\",\"acNo\":\"" + fromAcc + "\",\"acMastCode\":\"" + acmastcode + "\",\"branchCd\":\"" + Constants.BRANCH_CODE + "\",\"bankCd\":\"" + Constants.BankCode + "\"}"
                }
                console.log("GetBeneficiaryList URL:- " + APIUrlConstants.BASE_URL);
                console.log("");
                console.log("GetBeneficiaryList Body:- " + JSON.stringify(Body));
                console.log("");
                sendData(this,
                    'post',
                    APIUrlConstants.BASE_URL,
                    Headers,
                    JSON.stringify(Body),
                    async (obj, response) => {
                        console.log("responseData GetBeneficiaryList================", JSON.stringify(response))

                        console.log("Response: " + JSON.stringify(response))
                        var responseData = response
                        let res = response.SUCCESS
                        if (res === "FALSE") {
                            this.setState({ benificiaryAcc: '', beneficiaryAccType: 'Select A/c' })
                            const ErrorMsg = response.RESULT
                            Snackbar.show({
                                text: ErrorMsg,
                                duration: Snackbar.LENGTH_SHORT,
                                backgroundColor: 'red'
                            });
                        }
                        else if (res === "TRUE") {
                            const personData = [];
                            const formattedData = [];
                            this.setState({ ftTrnLmt: responseData.FT_TRN_LMT, dlyLmt: responseData.FND_DLY_LMT, usedLmt: responseData.FND_USED_LMT, benificiaryAcc: '', beneficiaryAccType: 'Select A/c' })
                            const acdtlsArray = responseData.Acdtls.map(item => JSON.parse(item.replace(/\\/g, '')));
                            acdtlsArray.forEach(item => {
                                if (item.AC_NAME != '1') {
                                    const existingType = formattedData.find(data => data.title === item.AC_NAME);
                                    if (existingType) {
                                        existingType.data.push({ label: `${item.BAC_NO}`, bal: `${item.AMOUNT.startsWith('-') ? ("₹" + item.AMOUNT.replace('-', '') + " Cr") : ("₹" + item.AMOUNT + " Dr")}`, acmastcode: `${item.BACMASTCODE}`, acName: `${item.AC_NAME.replace('A\\C', 'A/c')}`, CREDIT_GL_TYPE: `${item.AC_NAME.replace('A\\C', 'A/c')}`, AC_TYPE: item.ACTYPE, bBranchCode: item.BBRANCHCODE, AC_DUE_DT: item.AC_DUE_DT });
                                    } else {
                                        formattedData.push({
                                            title: item.AC_NAME,
                                            data: [{ label: `${item.BAC_NO}`, bal: `${item.AMOUNT.startsWith('-') ? ("₹" + item.AMOUNT.replace('-', '') + " Cr") : ("₹" + item.AMOUNT + " Dr")}`, acmastcode: `${item.BACMASTCODE}`, acName: `${item.AC_NAME.replace('A\\C', 'A/c')}`, CREDIT_GL_TYPE: `${item.AC_NAME.replace('A\\C', 'A/c')}`, AC_TYPE: item.ACTYPE, bBranchCode: item.BBRANCHCODE, AC_DUE_DT: item.AC_DUE_DT }],
                                        });
                                    }
                                }
                            });
                            this.beneshowingData.push(formattedData)
                            this.beneshowingData.map((person, index) => {
                                console.log("Person: " + JSON.stringify(person))
                                this.setState({ myBeneficiaryJsonArray: person })
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

    GetAllowableBalance = async (fromAcc, acmastcode) => {
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
        try {
            const Headers = APIUrlConstants.Headers("CHECKRD");
            const Body =
            {
                PARACNT: "1",
                PARA1_TYP: "STR",
                PARA1_VAL: "{\"AC_NO\":\"" + fromAcc + "\",\"ACMASTCODE\":\"" + acmastcode + "\"}"
            }
            console.log("GetAccountDetails URL:- " + APIUrlConstants.BASE_URL);
            console.log("");
            console.log("GetAccountDetails Body:- " + JSON.stringify(Body));
            console.log("");
            sendData(this,
                'post',
                APIUrlConstants.BASE_URL,
                Headers,
                JSON.stringify(Body),
                async (obj, response) => {
                    console.log("GetAccountDetails Response================", JSON.stringify(response))
                    let res = response.SUCCESS
                    if (res === "FALSE") {
                        const ErrorMsg = response.RESULT
                        Snackbar.show({
                            text: ErrorMsg,
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: 'red'
                        });

                    }
                    else {

                        this.setState({ CUR_INSTALLMENT_DATE: response['CUR_INST_DT'], PENDING_INSTALLMENT: response['PEND_INST'] })
                        console.log("CUR_INSTALLMENT_DATE: " + this.state.CUR_INSTALLMENT_DATE)
                        console.log("PENDING_INSTALLMENT: " + this.state.PENDING_INSTALLMENT)
                        this.RDValidation()

                    }
                })
        } catch (e) {
            console.log('Error: ', e)
        }

    }
    RDValidation() {

        console.log("IN RD VAlidation")
        const parts = this.state.CUR_INSTALLMENT_DATE.split('-');
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const monthIndex = monthNames.indexOf(parts[1]);
        const year = parseInt(parts[2]) + 2000;
        const parsedDate = new Date(year, monthIndex, parseInt(parts[0])); // Subtract 1 from monthIndex
        const formattedDate = `${parsedDate.getDate()}/${parsedDate.getMonth() + 1}/${parsedDate.getFullYear()}`;
        
        console.log("p_date: " + formattedDate);
        const today = new Date()

        const cur_date = moment(today).format("DD/MM/yyyy hh:mm a");
        console.log("cur_date: " + cur_date);



        try {
            let curInstDt = new Date(parsedDate);
            curInstDt = moment(curInstDt).format("DD/MM/yyyy")
            console.log("curInstDt1: " + curInstDt)

            let curDate = new Date()
            curDate = moment(curDate).format("DD/MM/yyyy")
            console.log("curDate: " + curDate)
            const pnd = this.state.PENDING_INSTALLMENT
            console.log("pnd: " + pnd)

            if (curInstDt != null && curDate != null) {
                const originalDate = new Date(parsedDate);
                console.log("originalDate: " + originalDate);
                const newDate = addMonths(originalDate, parseInt(Constants.RD_ALLOWDY));
                const newDateString = `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
                console.log("newDateString: " + newDateString);
                const newDateString2 = `${newDate.getDate() + 1}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
                console.log("newDateString2: " + newDateString2);
                console.log("<-- Values -->1-", formattedDate)
                console.log("<-- Values -->2-", cur_date)
                console.log("<-- Values -->3-", curInstDt)
                console.log("<-- Values -->5-", pnd)
                console.log("<-- Values -->6-", Constants.RD_ALLOWDY)
                const curDateParts = curDate.split("/");
                const curMonth = parseInt(curDateParts[0], 10); // Month is 0-indexed
                const curDay = parseInt(curDateParts[1], 10);
                const curYear = parseInt(curDateParts[2], 10);

                // Parse the future date string
                const futureDateParts = newDateString2.split("/");
                const futureMonth = parseInt(futureDateParts[0], 10); // Month is 0-indexed
                const futureDay = parseInt(futureDateParts[1], 10);
                const futureYear = parseInt(futureDateParts[2], 10);

                // Create Date objects for current and future dates
                const curDateObj = new Date(curYear, curMonth - 1, curDay); // Month is 0-indexed
                const futureDateObj = new Date(futureYear, futureMonth - 1, futureDay); // Month is 0-indexed

                // Compare the dates
                // if (futureDateObj <= curDateObj) {
                //   console.log("Future date is not after current date.");
                // } else {
                //   console.log("Future date is after current date.");
                // }
                console.log("curDateObj: " + curDateObj);
                console.log("futureDateObj: " + futureDateObj);
                if (parseInt(pnd) > 1 || curDateObj > futureDateObj) {
                    this.setState({ isOkModalVisible: true })
                    this.setState({ isRDValidation: true, isRDAccSelect: true })
                    console.log("isRDValidation false 2");
                    this.props.setOkDialogText("Can allow this transaction, because you have pending installments and grace period is exceeded, Please contact your branch.")
                }
                else {
                    this.setState({ isRDValidation: false, isRDAccSelect: false })
                    console.log("isRDValidation true 3");
                }
            }
            else {
                console.log("isRDValidation true 4");
                this.setState({ isOkModalVisible: true })
                this.props.setOkDialogText("Installment Details Not Found")
            }
        }
        catch (e) {
            console.log('Error: ', e)
        }

    }

    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg

  

    onSelectAccount = (value, title, acmastcode, acName, debitStop, min_bal, min_bal_req, debit_gl_type) => {
        this.setState({ isModalVisible: false })
        if (acmastcode === null || acmastcode === undefined || acmastcode.trim() === "") {
        }
        else {
            if (this.state.labelText === 'From A/c') {
                this.setState({ accType: value, fromAcc: value, fromAccAcmastCode: acmastcode, fromAccName: acName, debitStop: debitStop, min_bal: min_bal, min_bal_req: min_bal_req, DEBIT_GL_TYPE: debit_gl_type })
                this.GetBeneficiaryList(value, acmastcode)
                this.GetAllowableBalance(value, acmastcode)
            }
        }
    }
    onBeneficiarySelectAccount = (value, title, acmastcode, acName, credit_gl_type, ac_type, bBranchCode, AC_DUE_DT) => {


        const currentDate = new Date();
        const DueDate = moment(AC_DUE_DT).format("DD/MM/yyyy hh:mm a")

        console.log("Dateparamcon DueDate: " + DueDate)
        console.log("Dateparamcon currentDate " + currentDate)

        if (currentDate > DueDate) {
            this.setState({ isRDAccSelect: true, isOkModalVisible: true })
            this.props.setOkDialogText("Your Account is over Due")

        }
        else {
            this.setState({ isRDAccSelect: false })
            // console.log("cur date smaller  "+currentDate)

            if (value === '' || value == null) {
                console.log("if")
                this.setState({ beneficiaryAccType: 'Select A/c', isBeneficiaryModalVisible: false, })
            }
            else {
                console.log("else", ac_type)
                console.log("Constants.RD_ALLOWDY", Constants.RD_ALLOWDY)
                this.setState({ beneficiaryAccType: value, isBeneficiaryModalVisible: false, benificiaryAcc: value, beneficiaryAccAcmastCode: acmastcode, beneficiaryAccName: acName, beneficiaryAccBalance: title, CREDIT_GL_TYPE: credit_gl_type, AC_TYPE: ac_type, bBranchCode: bBranchCode })
                if (ac_type === '1' && parseFloat(Constants.RD_ALLOWDY) > 0) {
                    console.log("In RD A/c")
                    this.setState({ error_rd_info: 'We are not allowing overdue RD accounts here' })
                    // this.props.setOkDialogText("We are not allowing overdue RD accounts here")

                    this.GetAccountDetails(value, acmastcode)
                }
                else {
                    this.setState({ isRDValidation: false, isRDAccSelect: false, error_rd_info: '' })
                    console.log("isRDValidation true 1");
                }
            }
            console.log("onBeneficiarySelectAccount", this.state.isModalVisible, value, title, acmastcode, acName, credit_gl_type, ac_type, bBranchCode);

        }
    }

    toCallSubmit() {
        this.setState({ isButtonclick: true })
        setTimeout(() => {
            this.setState({ isButtonclick: false })
        }, 1500);
        const result = this.ValidateForm();
        if (result) {
            if (parseFloat(this.state.availableBalance) === parseFloat(this.state.amount)) {
                this.setState({ isYesNoModalVisible: true })
                this.props.setOkDialogText("Due to this transaction account balance goes below the minimum balance do you want to proceed ?.")
            }
            else 
            {
                // if (this.props.termsAndConditionShown) {
                    navigation.navigate(this, 'quickPayWithinBankOtherAccount', { from: this.state.callFrom, fromAcc: this.state.accType, toAcc: this.state.benificiaryAcc, remark: this.state.remark, amount: this.state.amount, fromAccAcmastCode: this.state.fromAccAcmastCode, beneficiaryAccAcmastCode: this.state.beneficiaryAccAcmastCode, fromAccName: this.state.fromAccName, beneficiaryAccName: this.state.beneficiaryAccName, bBranchCode: this.state.bBranchCode, accList: this.state.accounList })
                // }
                // else {
                //     this.setState({ isTermsConditionModalVisible: true })
                // }
            }
        }
    }


    ValidateForm() {
        var result = true;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        this.setState({ error_amount: '', error_remark: '', error_beneficiaryAcc: '', error_FromAcc: '' });
        if (!MyValidator.isEmptyField(this.state.amount).isValid) {
            this.setState({ error_amount: 'Please enter amount' });
            result = false;
        }
        const Remark = this.state.remark.trim();

        if (!MyValidator.isEmptyField(Remark).isValid) {
            this.setState({ error_remark: 'Please enter remark' });
            result = false;
        }
        if (specialCharRegex.test(this.state.remark)) {
            this.setState({ isOkModalVisible: true })
            this.props.setOkDialogText('Special charcters not allowed in remark..!!')
            result = false;
        }
        if (this.state.accounList.length == 0 || this.state.myBeneficiaryJsonArray.length == 0) {
            this.props.setOkDialogText('Insufficient Data!!')
            result = false;
        }
        if (this.state.beneficiaryAccType === 'Select A/c') {
            this.setState({ error_beneficiaryAcc: 'Select Beneficiary A/c' });
            result = false;
        }
        if (this.state.beneficiaryAccType === '') {
            this.setState({ error_FromAcc: 'Select A/c' });
            result = false;
        }
        if (this.state.amount.startsWith('.') ? this.state.amount : this.state.amount + '.0' > Math.abs(this.state.availableBalance)) {
            this.setState({ isOkModalVisible: true })
            this.props.setOkDialogText('Enter amount in rupee!!')
            result = false;
        }
        if (this.state.fromAcc === this.state.benificiaryAcc) {
            Snackbar.show({
                text: 'Please select other beneficiary A/c',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red'
            });
            result = false;
        }
        const beneficiaryAmount = this.state.beneficiaryAccBalance
        const amtD = parseFloat(this.state.amount)
        const amtFd = parseFloat(beneficiaryAmount)
        const bal = parseFloat(this.state.availableBalance)
        if (parseFloat(this.state.amount) > Math.abs(bal)) {
            this.setState({ isOkModalVisible: true })
            this.props.setOkDialogText('Amount is greater than account balance!! ' + bal)
            result = false;
        }
        if (bal < 0) {
            this.setState({ isOkModalVisible: true })
            this.props.setOkDialogText('Insufficient Balance')
            result = false;
        }
        if ((this.state.beneficiaryAccName.includes('Fixed')) && !(amtD % amtFd == 0)) {
            this.setState({ isOkModalVisible: true })
            this.props.setOkDialogText('Please enter amount multiple of ' + beneficiaryAmount)
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
        console.log("Account_Name: ", this.state.fromAccName)
        if (!this.state.fromAccName.includes("LOAN")) {
            if (parseFloat(this.state.ftTrnLmt) == 0 || parseFloat(this.state.dlyLmt) == 0) {
                const trn_amount = parseFloat(this.state.amount)
                const ac_balance = Math.abs(parseFloat(bal))
                const m_balance = parseFloat(this.state.min_bal)
                console.log("Account_Balance: ", ac_balance)
                console.log("Minimum_Balance: ", m_balance)
                console.log("Trn_Balance: ", m_balance)
                const remain_balance = ac_balance - trn_amount
                console.log("Remain_Balance: ", remain_balance)
                if (remain_balance < m_balance) {
                    if (this.state.min_bal_req === 'Y') {
                        this.setState({ isOkModalVisible: true })
                        this.props.setOkDialogText("This transaction cannot be done because the balance goes below the minimum balance.")
                    }
                    else {
                        this.setState({ isYesNoModalVisible: true })
                        this.props.setOkDialogText("Due to this transaction balance goes below the minimum balance do you want to proceed ?.")
                    }
                }
                result = false;
            }
        }

        if (parseFloat(this.state.amount) > parseFloat(this.state.ftTrnLmt)) {
            this.setState({ isOkModalVisible: true })
            this.props.setOkDialogText("Amount should not be greater than transaction limit. Please contact your branch. Your current transaction limit is " + this.state.ftTrnLmt)
            result = false;
        }
        if (((parseFloat(this.state.amount) + parseFloat(this.state.usedLmt)) > parseFloat(this.state.dlyLmt))) {
            this.setState({ isOkModalVisible: true })
            this.props.setOkDialogText("Sorry, we cant proceed your transaction because you are exceeding your daily limit for fund transfer, Please contact to your branch.")
            result = false;
        }
        if (this.props.userId === 'google') {
            this.setState({ isOkModalVisible: true, isFromGoogle: true })
            this.props.setOkDialogText("Transaction done successfully")
            result = false;
        }

        const beneficiaryAccBalance = this.state.beneficiaryAccBalance.replace("₹", "").replace("Dr", "").replace("Cr", "")
        console.log("AMoiunt=====================+" + this.state.amount)
        console.log("beneficiaryAccBalance=====================+" + beneficiaryAccBalance)
        console.log("AC_TYPE=====================+" + this.state.AC_TYPE)



        if (this.state.AC_TYPE === '1' && !(parseFloat(this.state.amount) % parseFloat(beneficiaryAccBalance) === 0)) {
            this.setState({ isOkModalVisible: true })
            this.props.setOkDialogText("Please enter amount multiple of " + beneficiaryAccBalance)
            result = false;
        }
        return result;
    };

    toggleModalYesNoDialog = () => {
        this.setState({ isYesNoModalVisible: false });
    };

    toggleYesModal = () => {
        this.toggleModalYesNoDialog();
        navigation.navigate(this, 'quickPayWithinBankOtherAccount', { from: this.state.callFrom, fromAcc: this.state.accType, toAcc: this.state.benificiaryAcc, remark: this.state.remark, amount: this.state.amount, fromAccAcmastCode: this.state.fromAccAcmastCode, beneficiaryAccAcmastCode: this.state.beneficiaryAccAcmastCode, fromAccName: this.state.fromAccName, beneficiaryAccName: this.state.beneficiaryAccName, bBranchCode: this.state.bBranchCode, accList: this.state.accounList })
    };

    toggleModalOkDialog = () => {
        this.setState({ isOkModalVisible: false })
    };

    toggleModalYesDialog = () => {
        if (this.state.isFromGoogle) {
            navigation.navigate(this, 'bottomNavigator')
        }
        else {
            this.toggleModalOkDialog();
        }
    };

    // toggleModalTermsCondition = () => {
    //     this.setState({ isTermsConditionModalVisible: false })
    // };
    toggleModalTermsConditionSubmitButton = () => {
        this.props.setTermsAndCondition(true)
        this.toggleModalTermsCondition()
        navigation.navigate(this, 'quickPayWithinBankOtherAccount', { from: this.state.callFrom, fromAcc: this.state.accType, toAcc: this.state.benificiaryAcc, remark: this.state.remark, amount: this.state.amount, fromAccAcmastCode: this.state.fromAccAcmastCode, beneficiaryAccAcmastCode: this.state.beneficiaryAccAcmastCode, fromAccName: this.state.fromAccName, beneficiaryAccName: this.state.beneficiaryAccName, bBranchCode: this.state.bBranchCode, accList: this.state.accounList })
    };

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
                            backAction={() => this.onBackAction()} />
                        <View style={styles.lableHeader}>
                            <View style={styles.lableHeaderView}>
                                <Text style={styles.ftToOtherBankTitle}>Within Bank Own A/C Transfer
                                </Text>{this.state.callFrom === 'dashboard' ?
                                    <Text style={styles.ftToOtherBankDescription}>Self A/c Fund Transfer
                                    </Text> :
                                    <Text style={styles.ftToOtherBankDescription}>Select mode of Transfer
                                    </Text>
                                }
                            </View>
                        </View>
                        <View style={styles.subMainView}>
                            <ScrollView>
                                <View style={styles.mainSubView}>
                                    <TouchableOpacity style={styles.fromAccTouchable}
                                        onPress={() => {
                                            if (this.state.myJsonArray != null && this.state.myJsonArray.length > 0) {
                                                this.setState({ isModalVisible: true, labelText: 'From A/c' })
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
                                        this.state.isModalVisible,
                                        this.state.myJsonArray,
                                        this.onSelectAccount,
                                        this.state.labelText,
                                        this.state.accType,
                                        this.state.availableBalance
                                    )}
                                </View>
                                {this.state.error_FromAcc !== '' && (<Text style={styles.ErrorDisplay}>{this.state.error_FromAcc}</Text>)}
                                <Text style={styles.allowableBalanceText}>Allowable Balance</Text>
                                <Text style={styles.allowableBalanceValue}>{strings.rupee + this.state.availableBalance}</Text>
                                <View style={styles.benficiaryAccView}>
                                    <TouchableOpacity style={styles.fromAccTouchable}
                                        onPress={() => {
                                            if (this.state.myBeneficiaryJsonArray != null && this.state.myBeneficiaryJsonArray.length > 0) {
                                                if (this.state.accType != 'Select A/c') {
                                                    this.setState({ isBeneficiaryModalVisible: true, beneficiaryLabelText: 'Beneficiary A/c' })
                                                }
                                                else {
                                                    Snackbar.show({
                                                        text: 'Select A/c',
                                                        duration: Snackbar.LENGTH_SHORT,
                                                        backgroundColor: 'red'
                                                    });
                                                }
                                            }
                                            else {
                                                Snackbar.show({
                                                    text: 'Your other account not found...',
                                                    duration: Snackbar.LENGTH_SHORT,
                                                    backgroundColor: 'red'
                                                });
                                            }

                                        }}>
                                        <View style={styles.mainView}>
                                            <Text style={styles.fromAccText}>Credit A/c</Text>
                                            <Text style={styles.fromAccTextValue}>{this.state.beneficiaryAccType}</Text>
                                        </View>
                                        <View style={styles.fromAccDropDown}>
                                            <Arrowdown height={15} width={15} />
                                        </View>
                                    </TouchableOpacity>
                                    {BeneficiaryCustomPopupDropDown(
                                        this.state.isBeneficiaryModalVisible,
                                        this.state.myBeneficiaryJsonArray,
                                        this.onBeneficiarySelectAccount,
                                        this.state.beneficiaryLabelText,
                                        this.state.accType,
                                    )}
                                </View>
                                {this.state.error_beneficiaryAcc !== '' && (<Text style={styles.ErrorDisplay}>{this.state.error_beneficiaryAcc}</Text>)}
                                {/* Amount */}
                                <TouchableOpacity style={styles.amountTouchable}
                                    onPress={() => {
                                        if (this.state.beneficiaryAccType === 'Select A/c') {
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
                                                borderColor: '#DFE1E8',
                                            },
                                            roundness: 8,
                                        }}
                                        label="Amount"
                                        value={this.state.amount}
                                        onChangeText={amount => {
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
                                        editable={this.state.beneficiaryAccType === 'Select A/c' ? false : true}
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
                                    <TextInput style={styles.remarkTextInput}
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
                                {!this.state.isRDAccSelect ?
                                    <CardView
                                        cardElevation={2}
                                        cardMaxElevation={2}
                                        cornerRadius={12}
                                        style={styles.submitButtonCard}>
                                        <TouchableOpacity style={[styles.submitButtonTouchable, { backgroundColor: this.props.PrimaryColor,}]}
                                            onPress={() => this.toCallSubmit()}
                                            disabled={this.state.isButtonclick || this.state.isRDValidation}>
                                            <Text style={styles.submitButtonText}>Submit</Text>
                                        </TouchableOpacity>
                                    </CardView> : null}

                                    {this.state.error_rd_info !== '' && (<Text style={styles.ErrorDisplay}>{"Note: "+this.state.error_rd_info}</Text>)}

                            </ScrollView>
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
                            {/* {
                                DialogTermsAndCondition(
                                    this.state.isTermsConditionModalVisible,
                                    this.toggleModalTermsCondition,
                                    this.toggleModalTermsConditionSubmitButton,
                                    this.state.termsAndConditions,
                                    'QuickPayOwnAccountTransfer'
                                )
                            } */}
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
    ftToOtherBankTitle:
    {
        fontSize: 20,
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
    },
    benficiaryAccView:
    {
        marginTop: 10,
        height: 48,
        width: width - 50,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DFE1E8',
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
    ErrorDisplay:
    {
        color: "#FF0000",
        marginLeft: 5,
        fontSize: 12
    },

};

export default connect(mapStateToProps, mapDispatchToProps)(QuickPayOwnAccTransfer);