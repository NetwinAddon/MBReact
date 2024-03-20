import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  FlatList,
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
import Modal from 'react-native-modal';
import CircleIcon from '../../../../assets/icons/angle-circle-right.svg';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';
import SearchIcon from '../../../../assets/icons/Vector.svg';
import MyValidator from '../../../../common/MyValidator';
import APIUrlConstants from '../../../../common/APIUrlConstants';
import Constants from '../../../../common/Constants';
import { QuickPayCustomPopupDropDownForLoan } from '../../../../components/QuickPayCustomPopupDropDownForLoan';
import Withdraw from '../../../../assets/icons/withdraw.svg';
import Deposit from '../../../../assets/icons/deposited.svg';
import ExclamationIcon from '../../../../assets/icons/exclamation_icon.svg';
import Snackbar from 'react-native-snackbar';
import TrasnperantFixedHomeHeader from '../../../../components/TrasnperantFixedHomeHeader';
import NetInfo from '@react-native-community/netinfo';
import { DialogBeneficiaryPopup } from '../../../../components/DialogBeneficiaryPopup';
import { DialogYesNoModal } from '../../../../components/DialogYesNoModal';
import { OKDialogFundTransfer } from '../../../../components/OKDialogFundTransfer';
import { white } from 'react-native-paper/lib/typescript/styles/colors';
import { KeyboardAvoidingView } from 'react-native';
class FundTransfer extends Component {
  constructor(props) {
    super(props);
    this.beneficiaryViewHistoryList = [
      {
        title: 'Received',
        desc: 'R: For Hospital Expenses',
        amount: '10,000',
        date: '12th Nov 2023',
      },
      {
        title: 'Sent',
        desc: 'R: Food Contribution ',
        amount: '2,000',
        date: '10th Nov 2023',
      },
      {
        title: 'Received',
        desc: 'R: For Hospital Expenses',
        amount: '15,000',
        date: '2nd Nov 2023',
      },
      {
        title: 'Sent',
        desc: 'R: Food Contribution ',
        amount: '2,000',
        date: '10th Nov 2023',
      },
      {
        title: 'Received',
        desc: 'R: For Hospital Expenses',
        amount: '10,000',
        date: '12th Nov 2023',
      },
      {
        title: 'Failed',
        desc: 'R: For Hospital Expenses',
        amount: '10,000',
        date: '12th Nov 2023',
      },
    ];
    this.state = {
      isModalVisible: false,
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
      isViewHistoryClick: false,
      error_amount: '',
      error_remark: '',
      error_beneficiaryAcc: '',
      acmastcode: '',
      termsAndCondition: false,
      availableBalance: '0.0',
      beneficiaryAccAcmastCode: '',
      beneficiaryId: '',
      fromAccName: '',
      beneficiaryBranchCode: '',
      callFrom: this.props.route.params.from,
      accounList: props.route.params.accList,
      myJsonArray: [],
      isBeneficiaryPopupVisible: false,
      isYesNoModalVisible: false,
      debitStop: '',
      dlyLmt: '',
      ftTrnLmt: '0',
      usedLmt: '',
      min_bal: '',
      min_bal_req: '',
      isOkModalVisible: false,
      searchTerm: '',
      isFromGoogle: false,
      filteredData: [],
    };
    this.shwoingData = [];
    this.uploadData = [];
  }
  componentDidMount() {
    const formattedData = [];
    this.state.accounList.forEach((item) => {
      if (
        item.ACTYPE === 'SAVING ACCOUNT' ||
        item.ACTYPE === 'CURRENT ACCOUNT' ||
        (item.ACTYPE === 'LOAN ACCOUNT' &&
          (item.SUB_TYPE === '2' || item.SUB_TYPE === '6' || item.SUB_TYPE === '7'))
      ) {
        const existingType = formattedData.find((data) => data.title === item.ACTYPE);
        if (existingType) {
          existingType.data.push({
            label: `${item.AC_NO}`,
            bal: `${item.BALANCE.startsWith('-')
              ? '₹' + item.BALANCE.replace('-', '') + ' Cr'
              : '₹' + item.BALANCE + ' Dr'
              }`,
            acmastcode: `${item.ACMASTCODE}`,
            acName: `${item.AC_NAME.replace('A\\C', 'A/c')}`,
            debitStop: item.DEBITSTOP,
            min_bal: item.MIN_BAL,
            min_bal_req: item.MIN_BAL_REQ,
          });
        } else {
          formattedData.push({
            title: item.ACTYPE,
            data: [
              {
                label: `${item.AC_NO}`,
                bal: `${item.BALANCE.startsWith('-')
                  ? '₹' + item.BALANCE.replace('-', '') + ' Cr'
                  : '₹' + item.BALANCE + ' Dr'
                  }`,
                acmastcode: `${item.ACMASTCODE}`,
                acName: `${item.AC_NAME.replace('A\\C', 'A/c')}`,
                debitStop: item.DEBITSTOP,
                min_bal: item.MIN_BAL,
                min_bal_req: item.MIN_BAL_REQ,
              },
            ],
          });
        }
      }
    });

    this.shwoingData.push(formattedData);
    this.shwoingData.map((person, index) => {
      if (['saving account', 'loan account', 'current account'].includes(Constants.Selected_ACTYPE)) {
        this.setState({
          myJsonArray: person,
          accType: Constants.Selected_AC_NO,
          acmastcode: Constants.Selected_ACMASTCODE,
          fromAccName: Constants.Selected_AC_NAME,
          debitStop: Constants.Selected_DEBIT_STOP,
          min_bal: Constants.Selected_MIN_BAL,
          min_bal_req: Constants.Selected_MIN_BAL_REQ,
        });
        this.GetBeneficiaryList(Constants.Selected_AC_NO, Constants.Selected_ACMASTCODE);
        if (Constants.Selected_ACTYPE.includes('loan account')) {
          this.GetAllowableBalance(Constants.Selected_AC_NO, Constants.Selected_ACMASTCODE);
        } else {
          this.GetAccountDetails(Constants.Selected_AC_NO, Constants.Selected_ACMASTCODE);
        }
      } else {
        this.setState({
          myJsonArray: person,
          accType: person[index].data[index].label,
          acmastcode: person[index].data[index].acmastcode,
          acmastcode: person[index].data[index].acmastcode,
          fromAccName: person[index].data[index].acName,
          debitStop: person[index].data[index].debitStop,
          min_bal: person[index].data[index].min_bal,
          min_bal_req: person[index].data[index].min_bal_req,
        });
        this.GetBeneficiaryList(person[index].data[index].label, person[index].data[index].acmastcode);
        if (person[index].title.includes('LOAN ACCOUNT')) {
          this.GetAllowableBalance(
            person[index].data[index].label,
            person[index].data[index].acmastcode
          );
        } else {
          this.GetAccountDetails(person[index].data[index].label, person[index].data[index].acmastcode);
        }
      }
    });
  }
  bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg;
  toggleModalYesNoDialog = () => {
    this.setState({ isYesNoModalVisible: false });
  };
  onBackAction() {
    navigation.goBack(this);
  }
  toggleModal = () => {
    this.setState({ isBeneficiaryPopupVisible: false });
  };
  toggleYesModal = () => {
    this.toggleModalYesNoDialog();
    navigation.navigate(this, 'fundTransferWithOtherAcc', {
      from: this.state.callFrom,
      fromAcc: this.state.accType,
      toAcc: this.state.benificiaryAcc,
      remark: this.state.remark,
      amount: this.state.amount,
      fromAccAcmastCode: this.state.acmastcode,
      beneficiaryAccAcmastCode: this.state.beneficiaryAccAcmastCode,
      beneficiaryBranchCode: this.state.beneficiaryBranchCode,
      fromAccName: this.state.fromAccName,
      beneficiaryId: this.state.beneficiaryId,
      accList: this.state.accounList,
    });
  };
  toggleBeneficiaryModal = (BAC_NO, NAME, BACMASTCODE, BBRANCHCODE, BNFID, isClick, FT_TRN_LMT) => {
    if (NAME === '') {
      this.setState({ benificiaryAcc: '' });
    } else {
      this.setState({
        benificiaryAcc: BAC_NO,
        beneficiaryAccType: BAC_NO,
        isModalVisible: false,
        benificiaryAccTitle: NAME,
        isClick: isClick,
        beneficiaryAccAcmastCode: BACMASTCODE,
        beneficiaryBranchCode: BBRANCHCODE,
        beneficiaryId: BNFID,
        ftTrnLmt: FT_TRN_LMT,
      });
    }
  };
  toggleModalOkDialog = () => {
    this.setState({ isOkModalVisible: false });
  };
  toggleModalYesDialog = () => {
    if (this.state.isFromGoogle) {
      navigation.navigate(this, 'bottomNavigator')
    }
    else {
      this.toggleModalOkDialog();
    }
  };

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    navigation.goBack(this);

    return true;
  };

  onSelectAccount = (value, title, acmastcode, acName, debitStop, min_bal, min_bal_req) => {
    this.setState({ isQuickModalVisible: false });
    if (acmastcode === null || acmastcode === undefined || acmastcode.trim() === '') {
    } else {
      if (this.state.labelText === 'From A/c') {
        this.setState({
          accType: value,
          fromAcc: value,
          acmastcode: acmastcode,
          fromAccName: acName,
          debitStop: debitStop,
          min_bal: min_bal,
          min_bal_req: min_bal_req,
        });
        this.GetBeneficiaryList(value, acmastcode);
      }
      if (acName != null && acName != '') {
        if (acName.includes('Loan')) {
          this.GetAllowableBalance(value, acmastcode);
        } else {
          this.GetAccountDetails(value, acmastcode);
        }
      }
    }
  };

  hide = () => {
    this.setState({ termsAndCondition: false });
  };


  toCallSubmit() {
    const result = this.ValidateForm();

    if (result) {


      const availableBalance = this.state.availableBalance.replace(/[^\d]/g, '');
      const EnteredAmount = this.state.amount;

      if (parseFloat(availableBalance) === parseFloat(0)) {
        this.setState({ isOkModalVisible: true });
        this.props.setOkDialogText('No balance available. Please contact your branch');
      }
      else if (Number(EnteredAmount) > Number(availableBalance)) {
        this.setState({ isOkModalVisible: true });
        this.props.setOkDialogText('Insufficient Account Balance');
      }
      else if (parseFloat(availableBalance) === parseFloat(EnteredAmount)) {
        this.setState({ isYesNoModalVisible: true });
        this.props.setOkDialogText(
          'Due to this transaction, the account balance will fall below the minimum balance. Do you want to proceed?'
        );
      }


      else {

        if (Constants.UserId === 'google' || Constants.UserId === 'GOOGLE') {


          navigation.navigate(this, 'fundTransferSameBankSuccess', { from: this.state.callFrom , refNo:'695969' });

        }
        else {
          navigation.navigate(this, 'fundTransferWithOtherAcc', {
            from: this.state.callFrom,
            fromAcc: this.state.accType,
            toAcc: this.state.benificiaryAcc,
            remark: this.state.remark,
            amount: this.state.amount,
            fromAccAcmastCode: this.state.acmastcode,
            beneficiaryAccAcmastCode: this.state.beneficiaryAccAcmastCode,
            beneficiaryBranchCode: this.state.beneficiaryBranchCode,
            fromAccName: this.state.fromAccName,
            beneficiaryId: this.state.beneficiaryId,
            accList: this.state.accounList,
          });

        }
      }
    }



  }

  checkInternetConnection = async () => {
    try {
      const state = await NetInfo.fetch();
      const isConnected = state.isConnected;
      return isConnected;
    } catch (error) {
      return false;
    }
  };
  ValidateForm() {
    var result = true;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    this.setState({ error_amount: '', error_remark: '', error_beneficiaryAcc: '' });

    const amount = this.state.availableBalance.replace(/[^\d]/g, '');

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
        backgroundColor: 'red',
      });
      result = false;
    }

    if (this.state.accounList.length == 0 || this.state.myJsonArrayforBeneficiaryList.length == 0) {
      this.setState({ isOkModalVisible: true });
      this.props.setOkDialogText('Insufficient Data!!');
      result = false;
    }

    if (!MyValidator.isEmptyField(Remark).isValid) {
      this.setState({ error_remark: 'Please enter remark' });
      result = false;
    }

    if (specialCharRegex.test(Remark)) {
      this.setState({ error_remark: 'Special characters were not allowed in remark..!!' });
      result = false;
    }

    if (this.state.beneficiaryAccType === 'Search or Select Beneficiary A/c') {
      this.setState({ error_beneficiaryAcc: 'Select Beneficiary A/c' });
      result = false;
    }


    if (this.state.debitStop != null && this.state.debitStop != '' && parseInt(this.state.debitStop) === 1) {
      Snackbar.show({ text: 'Selected Debit Account is Stopped. Please Contact your Branch...!', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red', });
      result = false;
    }


    if (!this.state.fromAccName.includes('LOAN')) {
      if (parseFloat(this.state.ftTrnLmt) == 0 || parseFloat(this.state.dlyLmt) == 0) {
        const trn_amount = parseFloat(this.state.amount);
        const ac_balance = Math.abs(parseFloat(amount));
        const m_balance = parseFloat(this.state.min_bal);
        const remain_balance = ac_balance - trn_amount;
        if (remain_balance < m_balance) {
          if (this.state.min_bal_req === 'Y') {
            this.setState({ isOkModalVisible: true });
            this.props.setOkDialogText(
              'This transaction cannot be done because the balance goes below the minimum balance.'
            );
          } else {
            this.setState({ isYesNoModalVisible: true });
            this.props.setOkDialogText(
              'Due to this transaction balance goes below the minimum balance do you want to proceed ?.'
            );
          }
        }
        result = false;
      }
    }


    if (parseFloat(this.state.amount) > parseFloat(this.state.ftTrnLmt)) {
      this.setState({ isOkModalVisible: true });
      this.props.setOkDialogText(
        'Amount should not be greater than transaction limit please contact to your branch, your transaction limit is ' +
        this.state.ftTrnLmt
      );
      result = false;
    }


    if (parseFloat(this.state.amount) + parseFloat(this.state.usedLmt) > parseFloat(this.state.dlyLmt)) {
      this.setState({ isOkModalVisible: true });
      this.props.setOkDialogText(
        'Sorry, we cant proceed your transaction because you are exceeding your daily limit for fund transfer, Please contact to your branch.'
      );
      result = false;
    }


    if(this.props.userId === 'google' || this.props.userId === 'GOOGLE')
    {
      this.setState({ isOkModalVisible: true, isFromGoogle: true });
      this.props.setOkDialogText('Transaction done successfully');
      result = false;
    }



    return result;
  }

  GetBeneficiaryList = async (accType, acmastcode) => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected)
      try {
        const Headers = APIUrlConstants.Headers('GETFNDTRLIST');
        const Body = {
          PARACNT: '6',
          PARA1_TYP: 'STR',
          PARA1_VAL: Constants.GMST_CODE,
          PARA2_TYP: 'STR',
          PARA2_VAL: accType,
          PARA3_TYP: 'STR',
          PARA3_VAL: acmastcode,
          PARA4_TYP: 'STR',
          PARA4_VAL: Constants.BRANCH_CODE,
          PARA5_TYP: 'STR',
          PARA5_VAL: Constants.BankCode,
          PARA6_TYP: 'STR',
          PARA6_VAL: Constants.SecretKey,
        };
        console.log("GetBeneficiaryList URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("GetBeneficiaryList Body:- " + JSON.stringify(Body));
        console.log("");
        sendData(
          this,
          'post',
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            console.log("responseData GetBeneficiaryList================", JSON.stringify(response))
            var responseData = response;
            let res = response.SUCCESS;
            if (res === 'FALSE') {
              this.setState({ isClick: '', benificiaryAccTitle: '' });
              const ErrorMsg = response.RESULT;
              Snackbar.show({
                text: ErrorMsg,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
              });
            } else if (res === 'TRUE') {
              this.setState({ isClick: '', benificiaryAccTitle: '' });
              this.setState({ dlyLmt: responseData.FND_DLY_LMT, usedLmt: responseData.FND_USED_LMT });
              const acdtlsArray = responseData.Acdtls.map((item) => JSON.parse(item.replace(/\\/g, '')));
              this.setState({ myJsonArrayforBeneficiaryList: acdtlsArray, filteredData: acdtlsArray });
            }
          }
        );
      } catch (e) {
        console.log('Error: ', e);
      }
    else {
      Snackbar.show({
        text: 'Check Internet Connection',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    }
  };
  GetAllowableBalance = async (fromAcc, acmastcode) => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers('GETALLOWBAL');

        const Body = {
          PARACNT: '1',
          PARA1_TYP: 'STR',
          PARA1_VAL:
            '{"customerId":"' +
            Constants.GMST_CODE +
            '","acMastCode":"' +
            acmastcode +
            '","acNo":"' +
            fromAcc +
            '","secKey":"' +
            Constants.SecretKey +
            '"}',
        };

        sendData(
          this,
          'post',
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            let res = response.SUCCESS;
            if (res === 'FALSE') {
              const ErrorMsg = response.RESULT;
              Snackbar.show({
                text: ErrorMsg,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
              });
              this.setState({ availableBalance: '0.0' });
            } else if (res === 'TRUE') {
              this.setState({ availableBalance: response['ALWBAL'] });
              if (parseFloat(this.state.availableBalance) <= 0) {
                Snackbar.show({
                  text: 'No Balance, Please contact your branch',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'red',
                });
              } else if (parseFloat(this.state.availableBalance) == 0) {
                Snackbar.show({
                  text: 'Invalid Account Selected, Please contact your branch',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'red',
                });
              }
            }
          }
        );
      } catch (e) {
        console.log('Error: ', e);
      }
    } else {
      Snackbar.show({
        text: 'Check Internet Connection',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    }
  };
  GetAccountDetails = async (fromAcc, acmastcode) => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers('GETALLBAL');

        const Body = {
          PARACNT: '1',
          PARA1_TYP: 'STR',
          PARA1_VAL: '{"ACMASTCODE":"' + acmastcode + '","AC_NO":"' + fromAcc + '"}',
        };

        sendData(
          this,
          'post',
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            let res = response.SUCCESS;
            if (res === 'FALSE') {
              const ErrorMsg = response.RESULT;
              Snackbar.show({
                text: ErrorMsg,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
              });
              this.setState({ availableBalance: '0.0' });
            } else if (res === 'TRUE') {
              this.setState({ availableBalance: response['ALLOWABLE BALANCE'] });
              if (parseFloat(this.state.availableBalance) <= 0) {
                Snackbar.show({
                  text: 'No Balance, Please contact your branch',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'red',
                });
              } else if (parseFloat(this.state.availableBalance) == 0) {
                Snackbar.show({
                  text: 'Invalid Account Selected, Please contact your branch',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'red',
                });
              }
            }
          }
        );
      } catch (e) {
        console.log('Error: ', e);
      }
    } else {
      Snackbar.show({
        text: 'Check Internet Connection',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    }
  };


  handleSearch = (searchTerm) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredData = this.state.myJsonArrayforBeneficiaryList
      .filter((item) => {
        const lowerCaseName = item.NAME.toLowerCase();
        return lowerCaseName.includes(lowerCaseSearchTerm);
      })
      .map((item) => {
        return {
          ...item,
          highlightedName: (
            <this.HighlightedText
              text={item.NAME}
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
              part.toLowerCase() === lowerCaseSearchTerm ? { color: highlightColor, fontWeight: 'bold' } : {}
            }
          >
            {part}
          </Text>
        ))}
      </Text>
    );
  };

  renderFooter = () => {
    return (
      <TouchableOpacity
        style={styles.loadMoreTouchable}
        onPress={this.LoadMoreOnPress}>
        <Text
          style={styles.loadMoreText}>
          Load More
        </Text>
      </TouchableOpacity>
    );
  };

  PressYes = (item1, item2) => {
    this.setState({ isBeneficiaryPopupVisible: false });
    if (item1.NAME === '') {
      this.setState({ benificiaryAcc: '' });
    } else {
      this.setState({
        benificiaryAcc: item1.BAC_NO,
        beneficiaryAccType: item1.BAC_NO,
        isModalVisible: false,
        benificiaryAccTitle: item1.NAME,
        isClick: item2,
        beneficiaryAccAcmastCode: item1.BACMASTCODE,
        beneficiaryBranchCode: item1.BBRANCHCODE,
        beneficiaryId: item1.BNFID,
        ftTrnLmt: item1.FT_TRN_LMT,
      });
    }
  }

  render() {
    return (
      <View style={styles.mainView}>
        <ImageBackground style={styles.mainView} source={this.bgImage} resizeMode='cover'>
          <KeyboardAvoidingView
            style={styles.mainView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            enabled={true}>
            <TrasnperantFixedHomeHeader backAction={() => this.onBackAction()} />
            <View style={styles.lableHeader}>
              <View
                style={styles.lableHeaderView}>
                <Text
                  style={styles.ftToOtherBankTitle}>
                  FT to Other A/C
                </Text>
                <Text
                  style={styles.ftToOtherBankDescription}>
                  Other A/c Fund Transfer
                </Text>
              </View>
            </View>
            <View
              style={styles.subMainView}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.mainSubView}>
                  <TouchableOpacity
                    style={styles.fromAccTouchable}
                    onPress={() => {
                      if (this.state.myJsonArray != null && this.state.myJsonArray.length > 0) {
                        this.setState({ isQuickModalVisible: true, labelText: 'From A/c' });
                      } else {
                        Snackbar.show({
                          text: 'No record available..!!',
                          duration: Snackbar.LENGTH_SHORT,
                          backgroundColor: 'red',
                        });
                      }
                    }}>
                    <View style={styles.mainView}>
                      <Text
                        style={styles.fromAccText}>
                        From A/c
                      </Text>
                      <Text
                        style={styles.fromAccTextValue}>
                        {this.state.accType}
                      </Text>
                    </View>
                    <View
                      style={styles.fromAccDropDown}>
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
                <Text
                  style={styles.allowableBalanceText}>
                  Allowable Balance
                </Text>
                <Text
                  style={styles.allowableBalanceValue}>
                  {strings.rupee + this.state.availableBalance}
                </Text>

                <CardView
                  style={styles.cardViewStyle}
                  cardElevation={2}
                  cardMaxElevation={2}
                  cornerRadius={8}>
                  <View
                    style={styles.benficiaryAccView}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        if (this.state.filteredData != null && this.state.filteredData.length > 0) {
                          if (this.state.accType != '') {
                            this.setState({
                              isBeneficiaryPopupVisible: true,
                              labelText: 'Search or Select Beneficiary A/c',
                            });
                          } else {
                            Snackbar.show({
                              text: 'Select From A/c',
                              duration: Snackbar.LENGTH_SHORT,
                              backgroundColor: 'red',
                            });
                          }
                        } else {
                          Snackbar.show({
                            text: 'No beneficiary record available..!!',
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: 'red',
                          });
                        }
                      }}>
                      <View style={styles.mainView}>
                        <Text
                          style={styles.fromAccTextValue}>
                          Search or Select Beneficiary A/c
                        </Text>
                      </View>
                      <View
                        style={styles.fromAccDropDown}></View>
                    </TouchableOpacity>
                  </View>
                </CardView>

                {this.state.error_beneficiaryAcc !== '' && (
                  <Text style={styles.ErrorDisplay}>{this.state.error_beneficiaryAcc}</Text>
                )}
                {this.state.isClick === 'isClick' ? (
                  <View
                    style={styles.dottedClickView}>
                    <View>
                      <View
                        style={styles.dottedClickMainView}>
                        <View style={styles.dottedClickMainSubView}>
                          <Text
                            style={styles.beneficiaryAccDetailsText}>
                            Beneficiary A/c Details
                          </Text>
                          <Text
                            style={styles.beneficiaryAccTitleText}>
                            {this.state.benificiaryAccTitle}
                          </Text>
                          <View
                            style={styles.horizontalLineView} />
                          <View style={styles.horzontalView}>
                            <Text style={styles.accNoText}>
                              A/c No:{this.state.benificiaryAcc}
                            </Text>
                            {/* <TouchableOpacity
                            onPress={() => {
                              this.setState({ isViewHistoryClick: true });
                            }}>
                            <Text style={styles.viewHistoryText}>
                              View History
                            </Text>
                          </TouchableOpacity> */}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                ) : null}
                <TouchableOpacity
                  style={styles.amountTouchable}
                  onPress={() => {
                    if (this.state.beneficiaryAccType === 'Search or Select Beneficiary A/c') {
                      Snackbar.show({
                        text: 'Select Beneficiary A/c',
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'red',
                      });
                    }
                  }}>
                  <TextInput
                    style={styles.amountTextInput}
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
                    label='Amount'
                    value={this.state.amount}
                    onChangeText={(amount) => {
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
                    editable={
                      this.state.beneficiaryAccType === 'Search or Select Beneficiary A/c' ? false : true
                    }
                    returnKeyType='next'
                    onSubmitEditing={() => {
                      this.rm.focus();
                    }}
                    blurOnSubmit={false}
                  />
                  {this.state.error_amount !== '' && (
                    <Text style={styles.ErrorDisplay}>{this.state.error_amount}</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.remarkTouchable}
                  onPress={() => {
                    if (this.state.amount === '') {
                      Snackbar.show({
                        text: 'Please enter amount',
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'red',
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
                    label='Remark'
                    value={this.state.remark}
                    onChangeText={(remark) => {
                      this.setState({ remark: remark.replace(/[^0-9A-Za-z ]/g, '') });
                    }}
                    mode='outlined'
                    editable={this.state.amount === '' ? false : true}
                    ref={(input) => {
                      this.rm = input;
                    }}
                  />
                  {this.state.error_remark !== '' && (
                    <Text style={styles.ErrorDisplay}>{this.state.error_remark}</Text>
                  )}
                </TouchableOpacity>
                <CardView
                  cardElevation={2}
                  cardMaxElevation={2}
                  cornerRadius={12}
                  style={styles.submitButtonCard}>
                  <TouchableOpacity
                  style={[styles.submitButtonTouchable, { backgroundColor: this.props.PrimaryColor,}]}
                    onPress={() => this.toCallSubmit()}>
                    <Text
                      style={styles.submitButtonText}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </CardView>
                {this.state.isViewHistoryClick ? (
                  <View style={{ marginTop: 25 }}>
                    <Text
                      style={styles.historyButtonText}
                      numberOfLines={1}>
                      History
                    </Text>
                    <FlatList
                      data={this.beneficiaryViewHistoryList}
                      renderItem={({ item, index }) => (
                        <View
                          style={styles.historyCard}>
                          <View
                            style={styles.historyHorizontal}>
                            {item.title === 'Sent' ? (
                              //    uparrow
                              <View
                                style={styles.upArrowView}>
                                <Withdraw height={16} width={16} color={'#eb5757'} />
                              </View>
                            ) : item.title === 'Failed' ? (
                              // downArrow
                              <View
                                style={styles.downArrowView}>
                                <ExclamationIcon height={16} width={16} color={'#27ae60'} />
                              </View>
                            ) : (
                              // downArrow
                              <View
                                style={styles.downGreenArrow}>
                                <Deposit height={16} width={16} color={'#27ae60'} />
                              </View>
                            )}
                            <View
                              style={styles.horizontalLableView}>
                              <View
                                style={styles.columnLableView}>
                                <Text
                                  style={styles.flatListTitle}
                                  numberOfLines={1}>
                                  {item.title}
                                </Text>
                                <Text
                                  style={styles.flatListTitleDescription}>
                                  {item.desc}
                                </Text>
                              </View>
                              <View
                                style={styles.amountAndDateView}>
                                <Text
                                  style={[styles.flatListAmountText, { color: item.amount === 'Sent' ? '#EB5757' : '#27AE60', }]}>
                                  {'₹' + item.amount}
                                </Text>
                                <Text
                                  style={styles.dateText}>
                                  {item.date}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      )}
                      ListFooterComponent={this.renderFooter} //Load More
                    />
                  </View>
                ) : null}
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
                  'Within Own A/c Beneficiary list'
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
  viewHistoryText:
  {
    color: '#1F3C66',
    fontFamily: strings.fontMedium,
    fontSize: 12,
    marginBottom: 10
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

export default connect(mapStateToProps, mapDispatchToProps)(FundTransfer);
