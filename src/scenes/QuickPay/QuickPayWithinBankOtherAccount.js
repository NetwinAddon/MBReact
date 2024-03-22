import React, { Component } from 'react';
import {
  Text,
  View,
  ImageBackground,
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
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import FromTo from '../../assets/icons/FromAndTo.svg';
import Iicon from '../../assets/icons/I-icon.svg';
import APIUrlConstants from '../../common/APIUrlConstants';
import Constants from '../../common/Constants';
import Snackbar from 'react-native-snackbar';
import numberToWords from 'number-to-words';
import TrasnperantFixedHomeHeader from '../../components/TrasnperantFixedHomeHeader';
import NetInfo from '@react-native-community/netinfo';
import { DialogTermsAndCondition } from '../../components/DialogTermsAndCondition';

class QuickPayWithinBankOtherAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: this.props.route.params.amount,
      remark: this.props.route.params.remark,
      fromAcc: this.props.route.params.fromAcc,
      benificiaryAcc: this.props.route.params.toAcc,
      termsAndCondition: false,
      fromAccAcmastCode: this.props.route.params.fromAccAcmastCode,
      beneficiaryAccAcmastCode: this.props.route.params.beneficiaryAccAcmastCode,
      callFrom: this.props.route.params.from,
      fromAccName: this.props.route.params.fromAccName,
      beneficiaryAccName: this.props.route.params.beneficiaryAccName,
      bBranchCode: this.props.route.params.bBranchCode,
      accList: this.props.route.params.accList,
      termsAndConditions: [
        'User Responsibility: \n- The user acknowledges that they are solely responsible for any fund transfers initiated from their own account.\n- The user must ensure the accuracy of the transaction details, including the recipient\'s account information. The Customer solely shall be responsible for the safe custody and security of IMPS application downloaded on their mobile phones. The Customer shall immediately inform the bank about the loss or theft of mobile phone for disabling of the IMPS service to prevent unauthorized usage.',
        'Authorization:\n- The user authorizes the bank to process fund transfers based on the instructions provided through the designated channels (e.g., online banking, mobile banking).',
        'Security Measures:\n- The user agrees to take necessary precautions to safeguard their account credentials and personal information to prevent unauthorized access and use.',
        'Transaction Limits:\n- The bank may impose limits on the amount and frequency of fund transfers. The user is responsible for adhering to these limits.',
        'Transaction Processing Time:\n- The user acknowledges that fund transfer processing times may vary. The bank is not responsible for any delay in processing beyond its control.',
        'Liability Limitation:\n- The bank shall not be liable for any loss, damage, or unauthorized access to funds resulting from the user\'s negligence, disclosure of credentials, or failure to adhere to security recommendations.',
        'Technical Issues:\n- The bank is not responsible for any technical issues, including but not limited to system outages, connectivity problems, or disruptions in service that may affect fund transfer capabilities.',
        'Force Majeure:\n- The bank shall not be liable for any failure or delay in performing its obligations under these terms and conditions due to circumstances beyond its reasonable control.',
        'Modification of Terms:\n- The bank reserves the right to modify these terms and conditions at any time. Users will be notified of any changes, and continued use of the service constitutes acceptance of the modified terms.',
        'By using the fund transfer service, you agree to these terms and conditions. If you do not agree with any part of these terms, please refrain from using the service.',
      ],
    };
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


  onBackAction() {
    navigation.goBack(this);
  }

  toEdit() {
    navigation.navigate(this, 'quickPayOwnAccTransfer', {
      from: this.state.callFrom,
      accList: this.state.accList,
    });
  }

  toCallSubmit() {
    const { fromAcc, benificiaryAcc, amount, remark } = this.state;
    if (fromAcc == '' && benificiaryAcc == '' && amount == '' && remark == '') {
    } else {
      this.GetOtpApi();
    }
  }

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

  GetOtpApi = async () => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers('GETSLFFTOTP');
        const Body = {
          PARACNT: '1',
          PARA1_TYP: 'STR',
          PARA1_VAL:
            '{"customerId":"' +
            Constants.GMST_CODE +
            '","secKey":"' +
            Constants.SecretKey +
            '","acNo":"' +
            this.state.fromAcc +
            '","acMastCode":"' +
            this.state.fromAccAcmastCode +
            '","branchCd":"' +
            Constants.BRANCH_CODE +
            '","bankCode":"' +
            Constants.BankCode +
            '","bacNo":"' +
            this.state.benificiaryAcc +
            '","bacMastCode":"' +
            this.state.beneficiaryAccAcmastCode +
            '","bBranchCd":"' +
            this.state.bBranchCode +
            '","Amount":"' +
            this.state.amount +
            '","Remark":"' +
            this.state.remark +
            '","DEVICE_LATTIDUTE":"null","DEVICE_LONGITUDE":"null","DEVICE_LOCAL_IP":"null","DEVICE_PUBLIC_IP":"null","DEVICE_ISP_OPERATOR":"null","SIMNO":"00000000-05ec-ff6b-0000-00005659f38b","divId":"' +
            this.props.DeviceId +
            '"}',
        };
        sendData(
          this,
          'post',
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            var responseData = response;
            let res = response.SUCCESS;
            if (res === 'FALSE') {
              const ErrorMsg = response.RESULT;
              Snackbar.show({
                text: ErrorMsg,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
              });
            } else if (res === 'TRUE') {
              navigation.navigate(this, 'oTPForFundTransfer', {
                from: this.state.callFrom,
                fromAcc: this.state.fromAcc,
                toAcc: this.state.benificiaryAcc,
                amount: this.state.amount,
                fromAccAcmastCode: this.state.fromAccAcmastCode,
                beneficiaryAccAcmastCode: this.state.beneficiaryAccAcmastCode,
                trnId: responseData.NEFT_TRN_ID,
                fromAccName: this.state.fromAccName,
                beneficiaryAccName: this.state.beneficiaryAccName,
                bBranchCode: this.state.bBranchCode,
                accList: this.state.accList
              });
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

  bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg;

  toggleModalTermsCondition = () => {
    this.setState({ termsAndCondition: false });
  };
  toggleModalTermsConditionSubmitButton = () => {
    this.toggleModalTermsCondition()
  };

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
                style={styles.withinBankTitle}>
                Within Bank Own A/C Transfer
              </Text>
              {this.state.callFrom === 'dashboard' ? (
                <Text style={styles.withinBankDescription}>
                  Self A/c Fund Transfer
                </Text>
              ) : (
                <Text
                  style={styles.withinBankDescription}>
                  Select mode of Transfer
                </Text>
              )}
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
                    <View style={styles.fromAccTwoView}>
                      <View style={styles.mainView}>
                        <Text style={[styles.fromAccText, { color: this.props.themeColor }]}>
                          From A/c
                        </Text>
                        <Text style={styles.fromAccTextValue}>
                          {this.state.fromAcc}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={styles.toAccMainView}>
                    <View
                      style={styles.fromAccTwoView}>
                      <View style={{ flex: 1 }}>
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
                  <View style={{ flex: 1 }}>
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
                  <View style={styles.mainView}>
                    <Text
                      style={[styles.fromAccText, { color: this.props.themeColor }]}>
                      Amount
                    </Text>
                    <Text
                       style={styles.amountText}>
                      ₹{this.state.amount}
                    </Text>
                  </View>
                </View>
              </View>
              <Text
                  style={[styles.amountInWordsText, { color: this.props.themeColor }]}>
                Amount in Words:
              </Text>
              <View
                   style={styles.horizontalLineView}/>
              <Text
                style={[styles.amountInWordsValue, { color: this.convertToWords(this.state.amount).includes('Exceeds UPI limit (Rs. 10 lakh)')
                ? 'red'
                : 'green'}]}>
                {this.convertToWords(this.state.amount)}
              </Text>
              <View
                style={styles.termsAndConditionView}>
                <TouchableOpacity
                    style={styles.termsAndConditionTouchable}
                  onPress={() => this.setState({ termsAndCondition: true })}>
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
          <RenderLoader />
          {
            DialogTermsAndCondition(
              this.state.termsAndCondition,
              this.toggleModalTermsCondition,
              this.toggleModalTermsConditionSubmitButton,
              this.state.termsAndConditions,
              'QuickPayOwnAccountTransferDetail'
            )
          }
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
  withinBankTitle:
  {
    color: 'white',
    fontSize: 20,
    fontFamily: strings.fontBold,
  },
  withinBankDescription:
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
  }
  
}
export default connect(mapStateToProps, mapDispatchToProps)(QuickPayWithinBankOtherAccount);
