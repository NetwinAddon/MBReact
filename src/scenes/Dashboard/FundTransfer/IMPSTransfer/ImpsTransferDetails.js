import React, { Component } from 'react';
import {
  Text,
  View,
  ImageBackground,
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
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import FromTo from '../../../../assets/icons/FromAndTo.svg';
import Iicon from '../../../../assets/icons/I-icon.svg';
import APIUrlConstants from '../../../../common/APIUrlConstants';
import Constants from '../../../../common/Constants';
import { _toEncrypt, decryptData } from '../../../../common/util';
import Snackbar from 'react-native-snackbar';
import numberToWords from 'number-to-words';
import TrasnperantFixedHomeHeader from '../../../../components/TrasnperantFixedHomeHeader';
import NetInfo from '@react-native-community/netinfo';
import { DialogTermsAndCondition } from '../../../../components/DialogTermsAndCondition';

class ImpsTransferDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: this.props.route.params.amount,
      remark: this.props.route.params.remark,
      fromAcc: this.props.route.params.fromAcc,
      toAcc: this.props.route.params.toAcc,
      benificiaryAcc: this.props.route.params.toAcc,
      benfId: this.props.route.params.benfId,
      fromAccAcmastCode: this.props.route.params.fromAccAcmastCode,
      beneficiaryAccAcmastCode: this.props.route.params.beneficiaryAccAcmastCode,
      fromAccName: this.props.route.params.fromAccName,
      beneficiaryAccName: this.props.route.params.beneficiaryAccName,
      chrg_amt: this.props.route.params.chrg_amt,
      netchrg_amt: this.props.route.params.netchrg_amt,
      termsAndCondition: false,
      callFrom: this.props.route.params.from,
      bnfBrCd: this.props.route.params.bnfBrCd,
      accList: this.props.route.params.accList,
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
    };
  }
  componentDidMount() { }


  toggleModalTermsCondition = () => {
    this.setState({ termsAndCondition: false });
  };
  toggleModalTermsConditionSubmitButton = () => {
    this.toggleModalTermsCondition()
  };
  onSelectDebitAccount = (value) => {
    this.setState({ isDebitAcc: false, accData: value });
  };

  onBackAction() {
    navigation.goBack(this);
  }

  handleOptionSelect = (selectedOption) => {
    this.setState({ nominee: true });
  };

  toEdit() {
    navigation.navigate(this, 'ImpsTransfer', {
      from: this.state.callFrom,
      accList: this.state.accList,
    });
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
  toCallSubmit() {
    const { fromAcc, benificiaryAcc, amount, remark } = this.state;
    if (fromAcc == '' && benificiaryAcc == '' && amount == '' && remark == '') {
      console.log('Please enter all field');
    } else {
      this.SubmitApi();
    }
  }

  SubmitApi = async () => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers('SNDIMPSFTOTP');

        const jsonReq = {
          customerId: Constants.GMST_CODE,
          acMastCode: this.state.fromAccAcmastCode,
          acNo: this.state.fromAcc,
          branchCd: Constants.BRANCH_CODE,
          secKey: Constants.SecretKey,
          divId: this.props.DeviceId,
          Benf001: this.state.benfId,
          Amount: this.state.amount,
          Prtcls: this.state.remark,
          bankCode: Constants.BankCode,
          chrgAmt: this.state.chrg_amt,
          chrgNetAmt: this.state.netchrg_amt,
          Benf008: this.state.toAcc,
          DEVICE_LATTIDUTE: '',
          DEVICE_LONGITUDE: '',
          DEVICE_LOCAL_IP: '',
          DEVICE_PUBLIC_IP: '',
          DEVICE_ISP_OPERATOR: '',
          SIMNO: '00000000-05ec-ff6b-0000-00005659f38b',
        };

        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));

        const Body = {
          PARACNT: '1',
          PARA1_TYP: 'STR',
          PARA1_VAL: jsonValue,
        };
        console.log("SubmitApi URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("SubmitApi:- " + JSON.stringify(jsonReq));
        console.log("");
        sendData(
          this,
          'post',
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            console.log("responseData SubmitApi================", JSON.stringify(response))
            var responseData = await decryptData(response);
            var newRes = responseData.slice(16);
            var finalRes = JSON.parse(newRes);
            console.log("responseData SubmitApi================", JSON.stringify(finalRes))
            if (finalRes.Acdtls != null && finalRes.Acdtls != '') {
              let res = finalRes.Acdtls;
              let mainArry = [];
              mainArry = res.map((jsonStr) => JSON.parse(jsonStr));
              Snackbar.show({
                text: mainArry[0].MSGDESCR,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
              });
            } else {
              if (finalRes.SUCCESS === 'FALSE') {
                const ErrorMsg = finalRes.RESULT;
                Snackbar.show({
                  text: ErrorMsg,
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'red',
                });
              } else if (finalRes.SUCCESS === 'TRUE') {
                navigation.navigate(this, 'ImpsTransferOtp', {
                  from: this.state.callFrom,
                  fromAcc: this.state.fromAcc,
                  toAcc: this.state.benificiaryAcc,
                  remark: this.state.remark,
                  amount: this.state.amount,
                  fromAccAcmastCode: this.state.fromAccAcmastCode,
                  beneficiaryAccAcmastCode: this.state.beneficiaryAccAcmastCode,
                  fromAccName: this.state.fromAccName,
                  beneficiaryAccName: this.state.beneficiaryAccName,
                  benfId: this.state.benfId,
                  chrg_amt: this.state.chrg_amt,
                  netchrg_amt: this.state.netchrg_amt,
                  bnfBrCd: this.state.bnfBrCd,
                  neftTrnid: finalRes.NEFT_TRN_ID,
                  trnscnId: finalRes.TRNSCNID,
                  accList: this.state.accList,
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
  convertToWords = (amount) => {
    try {
      const [integerPart, decimalPart] = amount.toString().split('.');
      const integerInWords = numberToWords.toWords(Number(integerPart));
      const decimalInWords = decimalPart
        ? ` and ${numberToWords.toWords(Number(decimalPart))} Paise`
        : '';
      const capitalizedIntegerInWords =
        integerInWords.charAt(0).toUpperCase() + integerInWords.slice(1);
      if (Number(integerPart) >= 100000 && Number(integerPart) <= 1000000) {
        const wordsArray = capitalizedIntegerInWords.split(' ');
        const indexOfSecondHundred = wordsArray.indexOf('hundred', wordsArray.indexOf('hundred') - 1);
        if (indexOfSecondHundred !== -1) {
          wordsArray[indexOfSecondHundred] = 'lakh';
        }
        const modifiedIntegerInWords = wordsArray.join(' ');
        const finalOutput = `${modifiedIntegerInWords.replace(/-/g, ' ')} Rupees${decimalInWords}`;
        return finalOutput;
      } else if (Number(integerPart) >= 1000000) {
        const finalOutput = `Exceeds UPI limit (Rs. 10 lakh)`;
        return finalOutput;
      } else {
        const finalOutput = `${capitalizedIntegerInWords.replace(/-/g, ' ')} Rupees${decimalInWords}`;

        return finalOutput;
      }
    } catch (e) {
      console.log('Error: ', e);
    }
  };

  bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg;
  render() {
    return (
      <View style={styles.mainView}>
        <ImageBackground
          style={styles.imageBackgroundStyle}
          source={this.bgImage}
          resizeMode='cover'>
          <TrasnperantFixedHomeHeader backAction={() => this.onBackAction()} />
          <View style={styles.lableHeaderMainView}>
            <View
              style={styles.lableHeaderSubView}>
              <Text
                style={styles.ConfirmDetailsTitle}>
                Confirm Details
              </Text>
              <Text
                style={styles.ConfirmDetailsDescription}>
                IMPS Fund Transfer
              </Text>
            </View>
          </View>
          <View
            style={styles.subMainView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={styles.mainSubView}>
                <View
                  style={styles.fromAccMainView}>
                  <FromTo height={125} />
                </View>
                <View
                  style={styles.fromAccSubView}>
                  <View
                    style={styles.fromAccOneView}>
                    <View
                      style={styles.fromAccTwoView}>
                      <View style={styles.mainView}>
                        <Text
                          style={[styles.fromAccText, { color: this.props.themeColor }]}>
                          From A/c
                        </Text>
                        <Text
                          style={styles.fromAccTextValue}>
                          {this.state.fromAcc}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={styles.toAccMainView}>
                    <View
                      style={styles.fromAccTwoView}
                    >
                      <View style={styles.mainView}>
                        <Text
                          style={[styles.fromAccText, { color: this.props.themeColor }]}>
                          To A/c
                        </Text>
                        <Text
                          style={styles.fromAccTextValue}>
                          {this.state.benificiaryAcc}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={styles.remarkMainView}>
                <View
                  style={styles.fromAccTwoView}>
                  <View style={styles.mainView}>
                    <Text
                      style={[styles.fromAccText, { color: this.props.themeColor }]}>
                      Remark
                    </Text>
                    <Text
                      style={styles.fromAccTextValue}>
                      {this.state.remark}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={styles.remarkMainView}>
                <View
                  style={styles.fromAccTwoView}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.fromAccText, { color: this.props.themeColor }]}>
                      Amount
                    </Text>
                    <View style={styles.amountServiceChargeView}>
                      <Text
                        style={styles.amountText}>
                        ₹{this.state.amount}
                      </Text>
                      <Text
                        style={styles.serviceChargeValue}>
                        +₹{Number(this.state.netchrg_amt) + Number(this.state.chrg_amt) + ' Service Charge'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <Text
                style={[styles.amountInWordsText, { color: this.props.themeColor }]}>
                Amount in Words:
              </Text>
              <View
                style={styles.horizontalLineView} />
              <Text
                style={[styles.amountInWordsValue, {
                  color: this.convertToWords(this.state.amount).includes('Exceeds UPI limit (Rs. 10 lakh)')
                    ? 'red'
                    : 'green'
                }]}>
                {this.convertToWords(this.state.amount)}
              </Text>
              <Text
                style={styles.servichChargeConToWordsValue}>
                {'+ ' +
                  this.convertToWords(Number(this.state.netchrg_amt) + Number(this.state.chrg_amt)) +
                  ' Service Charge'}
              </Text>
              <View
                style={styles.termsAndConditionView}>
                <TouchableOpacity
                  style={styles.termsAndConditionTouchable}
                  onPress={() => this.setState({ termsAndCondition: true })}
                >
                  <Iicon height={15} width={15} />
                  <Text
                    style={[styles.termsAndConditonText, { color: this.props.textColor }]}>
                    Terms & Conditions Apply
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.SubmitButtonTouchable, { backgroundColor: this.props.PrimaryColor,}]}
                  onPress={() => {
                    this.toCallSubmit();
                  }}>
                  <Text
                    style={styles.submitButtonText}>
                    Transfer now
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.EditTextTouchable}
                  onPress={() => this.toEdit()}>
                  <Text
                    style={[styles.editText, { color: this.props.themeColor }]}>
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
          {
            DialogTermsAndCondition(
              this.state.termsAndCondition,
              this.toggleModalTermsCondition,
              this.toggleModalTermsConditionSubmitButton,
              this.state.termsAndConditions,
              'IMPS Transfer'
            )
          }
          <RenderLoader />
        </ImageBackground>
      </View>
    );
  }
}
const styles = {
  mainView:
  {
    flex: 1
  },
  imageBackgroundStyle:
  {
    flex: 1,
    alignItems: 'center',
  },
  lableHeaderMainView:
  {
    flex: 0.15,
    alignSelf: 'flex-start',
    marginHorizontal: 25
  },
  lableHeaderSubView:
  {
    marginBottom: 10,
  },
  ConfirmDetailsTitle:
  {
    color: 'white',
    fontSize: 20,
    fontFamily: strings.fontBold,
  },
  ConfirmDetailsDescription:
  {
    fontSize: 15,
    color: 'black',
    fontFamily: strings.fontMedium,
    color: colors.white,
  },
  subMainView:
  {
    flex: 1,
    backgroundColor: '#f2f4f6',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
  },
  mainSubView:
  {
    flexDirection: 'row',
    width: width - 40,
    marginTop: 25,
  },
  fromAccMainView:
  {
    flex: 0.1,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fromAccSubView:
  {
    flex: 0.9,
  },
  fromAccOneView:
  {
    height: 75,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DFE1E8',
  },
  fromAccTwoView:
  {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fromAccText:
  {
    marginLeft: 15,
    fontSize: 14,
    fontFamily: strings.fontRegular,
  },
  fromAccTextValue:
  {
    color: colors.accTextColor,
    marginLeft: 15,
    fontSize: 18,
    fontFamily: strings.fontMedium,
  },
  toAccMainView:
  {
    marginTop: 15,
    height: 75,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DFE1E8',
  },
  remarkMainView:
  {
    marginTop: 20,
    height: 75,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DFE1E8',
  },
  amountText:
  {
    color: 'green',
    marginLeft: 15,
    fontSize: 18,
    fontFamily: strings.fontMedium,
  },
  amountInWordsText:
  {
    fontSize: 14,
    fontFamily: strings.fontRegular,
    marginTop: 12,
  },
  horizontalLineView:
  {
    borderBottomColor: '#EB5757',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  amountInWordsValue:
  {
    fontSize: 14,
    fontFamily: strings.fontMedium,
  },
  termsAndConditionView:
  {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  termsAndConditionTouchable:
  {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 10,
  },
  termsAndConditonText:
  {
    marginLeft: 10,
    fontFamily: strings.fontMedium,
    fontSize: 13,
  },
  SubmitButtonTouchable:
  {
    padding: 15,
    width: width - 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  submitButtonText:
  {
    color: 'white',
    fontFamily: strings.fontRegular,
    fontSize: 14,
  },
  EditTextTouchable:
  {
    padding: 8,
  },
  editText:
  {
    fontFamily: strings.fontRegular,
    fontSize: 14,
  },
  amountServiceChargeView:
  {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  serviceChargeValue:
  {
    color: 'black',
    marginRight: 14,
    fontSize: 15,
    fontFamily: strings.fontMedium,
    alignSelf: 'center',
    opacity: 0.5,
  },
  servichChargeConToWordsValue:
  {

    color: colors.accTextColor,
    fontSize: 14,
    fontFamily: strings.fontMedium,
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ImpsTransferDetails);
