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
import Snackbar from 'react-native-snackbar';
import { QuickPayCustomPopupDropDownForLoan } from '../../../../components/QuickPayCustomPopupDropDownForLoan';
import TrasnperantFixedHomeHeader from '../../../../components/TrasnperantFixedHomeHeader';
import NetInfo from '@react-native-community/netinfo';
import { DialogBeneficiaryPopup } from '../../../../components/DialogBeneficiaryPopup';
import { DialogAddBeneficiaryConfirmPopup } from '../../../../components/DialogAddBeneficiaryConfirmPopup';
import { BeneficairyAccTypeCustomPopup } from '../../../../components/BeneficairyAccTypeCustomPopup';

class AddBeneficiary extends Component {
  constructor(props) {
    super(props);
    this.beneficiaryAccTypeData = [
      {
        title: 'Loan A/c',
        id: '2',
      },
      {
        title: 'Saving A/c',
        id: '3',
      },
      {
        title: 'Current A/c',
        id: '4',
      },
    ];
    this.state = {
      isModalVisible: false,
      isQuickModalVisible: false,
      isBeneficiaryAccTypeVisible: false,
      selectedValue: 'option1',
      accType: '',
      beneficiaryAccType: 'Search or Select Beneficiary A/c',
      beneficiaryAccTypeLabel: 'Select Beneficiary A/c Type',
      labelText: '',
      mobileNo: '',
      confirmBeneficiaryAcc: '',
      amountLimit: '',
      fromAcc: '',
      benificiaryAcc: '',
      benificiaryAccTitle: '',
      isClick: '',
      error_mobileNo: '',
      error_confirmBenificiaryAccNo: '',
      error_amountLimit: '',
      error_beneficiaryAcc: '',
      error_beneficiaryAccType: '',
      beneficiaryAccTypeValue: '',
      beneficiaryAccTypeValueNumber: '',
      fromAccAcmastCode: '',
      termsAndCondition: false,
      // callFrom: this.props.route.params.from === 'dashboard' ? 'dashboard' : this.props.route.params.from === 'fundTransfer' ? 'fundTransfer' : '',
      callFrom: 'Add Beneficiary',
      accounList: props.route.params.accList,
      myJsonArray: [],
      myJsonArrayforBeneficiaryList: [],
      confirmDialog: false,
      isBeneficiaryPopupVisible: false,
      isBeneficiaryViewHistory: false,
      isConfirmPopup: false,
      searchBeneficiaryAcNo: '',
      isMasked: true,
      isMasked1: true,
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
          });
        } else {
          // If ACTYPE doesn't exist, create a new entry for it
          formattedData.push({
            title: item.ACTYPE,
            // data: [{ label: `xxxxx${item.AC_NO}xx0x`, bal: `₹${item.BALANCE}` }],
            data: [
              {
                label: `${item.AC_NO}`,
                bal: `${item.BALANCE.startsWith('-')
                  ? '₹' + item.BALANCE.replace('-', '') + ' Cr'
                  : '₹' + item.BALANCE + ' Dr'
                  }`,
                acmastcode: `${item.ACMASTCODE}`,
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
          fromAccAcmastCode: Constants.Selected_ACMASTCODE,
          fromAcc: Constants.Selected_AC_NO,
        });
      } else {
        this.setState({
          myJsonArray: person,
          accType: person[index].data[index].label,
          fromAccAcmastCode: person[index].data[index].acmastcode,
          fromAcc: person[index].data[index].label,
        });
      }
    });
  }
  bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg;

  onBackAction() {
    navigation.goBack(this);
  }
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


  toggleModal = () => {
    this.setState({ isBeneficiaryPopupVisible: false, searchBeneficiaryAcNo: '' });
  };
  toggleModalBeneficiaryHistory = () => {
    this.setState({ isBeneficiaryViewHistory: false });
  };
  toggleModalConfirmPopup = () => {
    this.setState({ isConfirmPopup: false });
  };
  toggleModalConfirmYesPopup = () => {
    this.toggleModalConfirmPopup();
    this.AddBeneficiaryApi();
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


  onSelectAccount = (value, title, acmastcode, isClick) => {
    this.setState({ isQuickModalVisible: false });
    if (acmastcode === null || acmastcode === undefined || acmastcode.trim() === '') {
    } else {
      if (this.state.labelText === 'From A/c') {
        this.setState({ accType: value, fromAcc: value, fromAccAcmastCode: acmastcode });
      }
    }
  };

  onSelectBeneficiaryAccType = (value, title) => {
    this.setState({ isBeneficiaryAccTypeVisible: false });
    if (title === null || title === undefined || title.trim() === '') {
      this.setState({
        beneficiaryAccTypeLabel: 'Select Beneficiary A/c Type',
        beneficiaryAccTypeValue: '',
        beneficiaryAccTypeValueNumber: '',
        isClick: '',
        myJsonArrayforBeneficiaryList: []
      });
    } else {
      this.setState({
        beneficiaryAccTypeLabel: title,
        beneficiaryAccTypeValue: title,
        beneficiaryAccTypeValueNumber: value,
        isClick: '',
        myJsonArrayforBeneficiaryList: []
      });
    }
  };

  onSelectBeneficiaryAccount = (value, title, isClick) => {
    if (title === null || title === undefined || title.trim() === '') {
      this.setState({ benificiaryAcc: '', beneficiaryAccType: 'Search or Select Beneficiary A/c' });
    } else {
      this.setState({
        benificiaryAcc: value,
        beneficiaryAccType: title === '' ? null : value,
        searchBeneficiaryAcNo: '',
      });
    }
    this.setState({ isModalVisible: false, benificiaryAccTitle: title, isClick: isClick });
  };
  hide = () => {
    this.setState({ termsAndCondition: false });
  };
  hideDialog = () => {
    this.setState({ confirmDialog: false });
  };
  async toCallSubmit() {
    const result = this.ValidateForm();
    if (result) {
      const isConnected = await this.checkInternetConnection();
      if (isConnected) {
        this.setState({ isConfirmPopup: true });
      } else {
        Snackbar.show({
          text: 'Check Internet Connection',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'red',
        });
      }
    }
  }

  ValidateForm() {
    var result = true;
    this.setState({
      error_mobileNo: '',
      error_amountLimit: '',
      error_beneficiaryAcc: '',
      error_beneficiaryAccType: '',
      error_confirmBenificiaryAccNo: '',
    });

    if (!MyValidator.isValidIndianMobile(this.state.mobileNo).isValid) {
      this.setState({ error_mobileNo: MyValidator.isValidIndianMobile(this.state.mobileNo).Response });
      result = false;
    }
    if(this.state.amountLimit < 1)
    {
      this.setState({ error_amountLimit: 'Please enter amount greater than 1' });
      result = false;
    }
    if (!MyValidator.isEmptyField(this.state.amountLimit).isValid) {
      this.setState({ error_amountLimit: 'Please enter amount limit' });
      result = false;
    }
    if (this.state.beneficiaryAccType === 'Search or Select Beneficiary A/c') {
      this.setState({ error_beneficiaryAcc: 'Select Beneficiary A/c' });
      result = false;
    }
    if (this.state.beneficiaryAccTypeLabel === 'Select Beneficiary A/c Type') {
      this.setState({ error_beneficiaryAccType: 'Select Beneficiary A/c Type' });
      result = false;
    }
    if (!MyValidator.isEmptyField(this.state.confirmBeneficiaryAcc).isValid) {
      this.setState({ error_confirmBenificiaryAccNo: 'Please enter confirm beneficiary A/c no' });
      result = false;
    }
    if (Number(this.state.benificiaryAcc) != Number(this.state.confirmBeneficiaryAcc)) {
      Snackbar.show({
        text: 'Confirm beneficiary account number does not match',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
      result = false;
    }

    return result;
  }
  checkInternetConnection = async () => {
    try {
      const state = await NetInfo.fetch();
      const isConnected = state.isConnected;
      return isConnected;
    } catch (error) {
      console.error('Error checking internet connection:', error);
      return false;
    }
  };
  AddBeneficiaryApi = async () => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers('PUTFTBENFOTP');
        const jsonReq = {
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
          bnfAcno: this.state.benificiaryAcc,
          bnfMob: this.state.mobileNo,
          bnfActyp: this.state.beneficiaryAccTypeValueNumber,
          bnfTrnlmt: this.state.amountLimit,
          bnfBank: '',
        };
        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));

        const Body = {
          PARACNT: '1',
          PARA1_TYP: 'STR',
          PARA1_VAL: jsonValue,
        };

        sendData(
          this,
          'post',
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            var responseData = await decryptData(response);
            var newRes = responseData.slice(16);
            var finalRes = JSON.parse(newRes);
            if (finalRes.SUCCESS === 'FALSE') {
              if (finalRes.Acdtls.length != 0) {
                Snackbar.show({
                  text: 'Duplicate Beneficiary...!!',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'red',
                });
              } else {
                const ErrorMsg = finalRes.RESULT;
                Snackbar.show({
                  text: ErrorMsg,
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'red',
                });
              }

              // }
            } else if (finalRes.SUCCESS === 'TRUE') {
              const SuccessMsg = finalRes.RESULT;
              //this.setState({ confirmDialog: true })
              navigation.navigate(this, 'fundTransferSameBankSuccess', { from: this.state.callFrom });
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

  GetBeneficiaryList = async () => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers('GETFTBENFACLIST');
        const jsonReq = {
          customerId: Constants.GMST_CODE,
          CORPID: Constants.BRANCH_CODE,
          SEC_KEY: Constants.SecretKey,
          divId: this.props.DeviceId,
          secKey: Constants.SecretKey,
          bnfAcno: this.state.searchBeneficiaryAcNo,
          bnfActyp: this.state.beneficiaryAccTypeValueNumber,
        };

        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));

        const Body = {
          PARACNT: '1',
          PARA1_TYP: 'STR',
          PARA1_VAL: jsonValue,
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
            var responseData = await decryptData(response);
            var newRes = responseData.slice(16);
            var finalRes = JSON.parse(newRes);
            console.log("GetBeneficiaryList Response:- " + JSON.stringify(finalRes));
            if (finalRes.SUCCESS === 'FALSE') {
              const ErrorMsg = finalRes.RESULT;
              Snackbar.show({
                text: ErrorMsg,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
              });
            } else if (finalRes.SUCCESS === 'TRUE') {
              if(finalRes.Acdtls != null && finalRes.Acdtls != '')
              {
                const acdtlsArray = finalRes.Acdtls.map((item) => JSON.parse(item.replace(/\\/g, '')));
                this.setState({ myJsonArrayforBeneficiaryList: acdtlsArray });
              }
              else
              {
                Snackbar.show({
                  text: 'No beneficiary found',
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
  PressYes = (item1, item2) => {
    if (item1.NAME === null || item1.NAME === undefined || item1.NAME.trim() === '') {
      this.setState({ benificiaryAcc: '', beneficiaryAccType: 'Search or Select Beneficiary A/c' });
    } else {
      this.setState({
        benificiaryAcc: item1.AADHAR_REFNO,
        beneficiaryAccType: item1.NAME === '' ? null : item1.AADHAR_REFNO,
        searchBeneficiaryAcNo: '',
      });
    }
    this.setState({ isBeneficiaryPopupVisible: false, benificiaryAccTitle: item1.NAME, isClick: item2 });
  }

  handleSearch = (searchTerm) => {
    this.setState({ searchBeneficiaryAcNo: searchTerm.replace(/[^0-9]/g, '') });
  };
  handleSearchIcon = () => {
    if (
      this.state.searchBeneficiaryAcNo != null &&
      this.state.searchBeneficiaryAcNo != ''
    ) {
      Snackbar.show({
        text: 'Searching details, please wait...',
        duration: Snackbar.LENGTH_SHORT,
      });
      this.GetBeneficiaryList();
    } else {
      Snackbar.show({
        text: 'Please enter correct beneficiary Account No!!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    }
  };

  render() {
    return (
      <View style={styles.mainView}>
        <ImageBackground style={styles.mainView} source={this.bgImage} resizeMode='cover'>


          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            enabled={true}
          >
            <TrasnperantFixedHomeHeader backAction={() => this.onBackAction()} />
            <View style={styles.headerView}>
              <View
                style={styles.headerLabelView}>
                <Text
                  style={styles.addBeneficiaryText}>
                  Add Beneficiary
                </Text>
                <Text
                  style={styles.addBeneficiaryTextDesciption}>
                  Add Beneficiary for Fund Transfer
                </Text>
              </View>
            </View>
            <View
              style={styles.mainViewContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* form ACC */}
                <View
                  style={styles.fromAccView}>
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
                        style={styles.fromAccValue}>
                        {this.state.accType}
                      </Text>
                    </View>
                    <View
                      style={styles.dropDownValue}>
                      <Arrowdown height={15} width={15} />
                    </View>
                  </TouchableOpacity>
                  {QuickPayCustomPopupDropDownForLoan(
                    this.state.isQuickModalVisible,
                    this.state.myJsonArray,
                    this.onSelectAccount,
                    this.state.labelText,
                    this.state.accType
                  )}
                </View>
                <View
                  style={styles.beneficiaryView}>
                  <TouchableOpacity
                    style={styles.fromAccTouchable}
                    onPress={() => {
                      if (this.state.myJsonArray != null && this.state.myJsonArray.length > 0) {
                        this.setState({
                          isBeneficiaryAccTypeVisible: true,
                          labelText: 'Select Beneficiary A/c Type',
                        });
                      } else {
                        Snackbar.show({
                          text: 'Select From A/c',
                          duration: Snackbar.LENGTH_SHORT,
                          backgroundColor: 'red',
                        });
                      }
                    }}>
                    <View style={styles.mainView}>
                      <Text
                        style={styles.fromAccValue}>
                        {this.state.beneficiaryAccTypeLabel}
                      </Text>
                    </View>
                    <View
                      style={styles.dropDownValue}>
                      <Arrowdown height={15} width={15} />
                    </View>
                  </TouchableOpacity>
                  {BeneficairyAccTypeCustomPopup(
                    this.state.isBeneficiaryAccTypeVisible,
                    this.beneficiaryAccTypeData,
                    this.onSelectBeneficiaryAccType,
                    this.state.labelText,
                    this.state.accType
                  )}
                </View>
                {this.state.error_beneficiaryAccType !== '' && (
                  <Text style={styles.ErrorDisplay}>{this.state.error_beneficiaryAccType}</Text>
                )}
                {/* Beneficiary A/c */}

                <CardView
                  style={styles.cardViewStyle}
                  cardElevation={2}
                  cardMaxElevation={2}
                  cornerRadius={8}>
                  <View
                    style={styles.benficiaryAccView}>
                    <TouchableOpacity
                      style={styles.fromAccTouchable}
                      onPress={() => {
                        if (this.state.beneficiaryAccTypeValue === '') {
                          Snackbar.show({
                            text: 'Select beneficiary Account type',
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: 'red',
                          });
                        } else {
                          this.setState({ isBeneficiaryPopupVisible: true, labelText: 'Beneficiary A/c' });
                        }
                      }}>
                      <View style={styles.mainView}>
                        <Text
                          style={styles.fromAccValue}>
                          Search or Select Beneficiary A/c
                        </Text>
                      </View>
                      <View
                        style={styles.dropDownValue}
                      ></View>
                    </TouchableOpacity>
                  </View>
                </CardView>

                {this.state.error_beneficiaryAcc !== '' && (
                  <Text style={styles.ErrorDisplay}>{this.state.error_beneficiaryAcc}</Text>
                )}
                {this.state.isClick === 'isClick' ? (
                  <View>
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
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                ) : null}
                <TouchableOpacity
                  style={styles.confirmBeneficiaryTouchable}
                  onPress={() => {
                    if (this.state.benificiaryAcc === '') {
                      Snackbar.show({
                        text: 'Select Beneficiary A/c',
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'red',
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
                    label='Confirm Beneficiary A/c Number'
                    value={this.state.confirmBeneficiaryAcc}
                    onChangeText={(confirmBeneficiaryAcc) => {
                      this.setState({ confirmBeneficiaryAcc: confirmBeneficiaryAcc.replace(/[^0-9]/g, '') });
                    }}
                    mode='outlined'
                    keyboardType='number-pad'
                    editable={this.state.benificiaryAcc === '' ? false : true}
                    returnKeyType='next'
                    onSubmitEditing={() => {
                      this.mob.focus();
                    }}
                    blurOnSubmit={false}
                    secureTextEntry={this.state.isMasked}
                    onFocus={() => this.setState({ isMasked: false })}
                    onBlur={() => this.setState({ isMasked: true })}
                    contextMenuHidden={Constants.AUTOMATION_MODE === 'Y' ? false : true}
                    
                  />
                  {this.state.error_confirmBenificiaryAccNo !== '' && (
                    <Text style={styles.ErrorDisplay}>{this.state.error_confirmBenificiaryAccNo}</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmBeneficiarySubTouchable}
                  onPress={() => {
                    if (this.state.confirmBeneficiaryAcc === '') {
                      Snackbar.show({
                        text: 'Enter confirm beneficiary A/c no',
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'red',
                      });
                    }
                  }}>
                  <TextInput
                    style={styles.mobileNoTextInput}
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
                    label='Mobile Number'
                    value={this.state.mobileNo}
                    onChangeText={(mobileNo) => {
                      this.setState({ mobileNo: mobileNo.replace(/[^0-9]/g, '') });
                    }}
                    keyboardType='number-pad'
                    mode='outlined'
                    maxLength={10}
                    editable={this.state.confirmBeneficiaryAcc === '' ? false : true}
                    returnKeyType='next'
                    onSubmitEditing={() => {
                      this.rm.focus();
                    }}
                    ref={(input) => {
                      this.mob = input;
                    }}
                    blurOnSubmit={false}
                  />
                  {this.state.error_mobileNo !== '' && (
                    <Text style={styles.ErrorDisplay}>{this.state.error_mobileNo}</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.amountLimitTouchable}
                  onPress={() => {
                    if (this.state.mobileNo === '') {
                      Snackbar.show({
                        text: 'Please enter mobile no.',
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'red',
                      });
                    }
                  }}>
                  <TextInput
                    style={styles.mobileNoTextInput}
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
                    label='Amount Limit'
                    value={this.state.amountLimit}
                    onChangeText={(amountLimit) => {
                      this.setState({ amountLimit: amountLimit.replace(/[^0-9]/g, '') });

                      if (amountLimit.length === 1 && (amountLimit === '0' || amountLimit === '.')) {
                        this.setState({ amountLimit: '' });
                      }
                    }}
                    mode='outlined'
                    keyboardType='number-pad'
                    editable={this.state.mobileNo === '' ? false : true}
                    ref={(input) => {
                      this.rm = input;
                    }}
                    maxLength={6}
                  />
                  {this.state.error_amountLimit !== '' && (
                    <Text style={styles.ErrorDisplay}>{this.state.error_amountLimit}</Text>
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
              </ScrollView>
              {
                DialogBeneficiaryPopup(
                  this.state.isBeneficiaryPopupVisible,
                  this.toggleModal,
                  this.PressYes,
                  this.state.myJsonArrayforBeneficiaryList,
                  this.props.SecondaryColor,
                  this.handleSearch,
                  this.state.searchBeneficiaryAcNo,
                  this.handleSearchIcon,
                  'Within Other A/c AddBeneficiary'
                )
              }
              {
                DialogAddBeneficiaryConfirmPopup(
                  this.state.isConfirmPopup,
                  this.toggleModalConfirmPopup,
                  this.toggleModalConfirmYesPopup,
                  this.state.beneficiaryAccTypeValue,
                  this.state.benificiaryAccTitle,
                  this.state.benificiaryAcc,
                  null,
                  'Add Beneficiary',
                  null
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
    color: 'black',
    textAlign: 'left',
    fontFamily: strings.fontBold,
    color: colors.white,
  },
  addBeneficiaryTextDesciption:
  {
    fontSize: 15,
    color: 'black',
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
  beneficiaryView:
  {
    height: 48,
    width: width - 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DFE1E8',
  },
  cardViewStyle:
  {
    marginTop: 5,
    marginHorizontal: 1,
    backgroundColor: colors.white,
    marginTop:10
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
  confirmBeneficiaryTouchable:
  {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 10,
    
  },
  confirmBeneficiaryTextInput:
  {
    lineHeight: 40,
    height: 48,
    width: width - 50,
  },
  confirmBeneficiarySubTouchable:
  {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 10,
    marginTop: 10,
  },
  mobileNoTextInput:
  {
    lineHeight: 40,
    height: 48,
    width: width - 50,
  },
  amountLimitTouchable:
  {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 10,
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
  ErrorDisplay:
  {
    color: '#FF0000',
    marginLeft: 5,
    fontSize: 12
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBeneficiary);
