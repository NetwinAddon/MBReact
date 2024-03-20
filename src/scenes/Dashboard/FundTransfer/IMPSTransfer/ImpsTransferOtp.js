import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
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
} from '../../../../App';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';
import OtpInputs from 'react-native-otp-inputs';
import APIUrlConstants from '../../../../common/APIUrlConstants';
import Constants from '../../../../common/Constants';
import { TextInput } from 'react-native-paper';
import EyeOpen from '../../../../assets/icons/formIcons/ico-eye.svg';
import EyeSlash from '../../../../assets/icons/formIcons/ico-eye-slash.svg';
import { _toEncrypt, decryptData } from '../../../../common/util';
import md5 from 'md5';
import Snackbar from 'react-native-snackbar';
import TrasnperantFixedHomeHeader from '../../../../components/TrasnperantFixedHomeHeader';
import NetInfo from '@react-native-community/netinfo';
import SwipeButton from '../../../../components/SwipeButton';

class ImpsTransferOtp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: '',
      transPin: '',
      otp_length: '',
      isTransactionPin: true,
      callFrom: this.props.route.params.from,
      amount: this.props.route.params.amount,
      remark: this.props.route.params.remark,
      fromAcc: this.props.route.params.fromAcc,
      benificiaryAcc: this.props.route.params.toAcc,
      fromAccAcmastCode: this.props.route.params.fromAccAcmastCode,
      beneficiaryAccAcmastCode: this.props.route.params.beneficiaryAccAcmastCode,
      trnId: this.props.route.params.trnId,
      fromAccName: this.props.route.params.fromAccName,
      beneficiaryAccName: this.props.route.params.beneficiaryAccName,
      benfId: this.props.route.params.benfId,
      bnfBrCd: this.props.route.params.bnfBrCd,
      neftTrnid: this.props.route.params.neftTrnid,
      trnscnId: this.props.route.params.trnscnId,
      timer: 45,
      OTPcount: 0,
      errorCount: 0,
      accList: this.props.route.params.accList,
    };
  }
  componentDidMount() {
    this.startTimer();
  }
  componentWillUnmount() {
    clearInterval(this.timerInterval);
  }
  startTimer = () => {
    this.timerInterval = setInterval(this.updateTimer, 1000);
  };

  updateTimer = () => {
    this.setState(
      (prevState) => ({
        timer: prevState.timer - 1,
      }),
      () => {
        if (this.state.timer === 0) {
          clearInterval(this.timerInterval);
          this.setState({ timer: '00' });
        }
      }
    );
  };
  onBackAction() {
    navigation.goBack(this);
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
      this.SubmitOtpApi();
    }
  }

  SubmitOtpApi = async () => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        let otpEncrypt = md5(this.state.otp.code);

        const Headers = APIUrlConstants.Headers('SETIMPSFTREQ');

        const jsonReq = {
          customerId: Constants.GMST_CODE,
          acMastCode: this.state.fromAccAcmastCode,
          acNo: this.state.fromAcc,
          bnfId: this.state.benfId,
          bnfBrCd: this.state.bnfBrCd,
          prtcls: this.state.remark,
          amt: this.state.amount,
          otp: otpEncrypt,
          trPin: this.state.transPin,
          bankCode: Constants.BankCode,
          secKey: Constants.SecretKey,
          divId: this.props.DeviceId,
          neftTrnid: this.state.neftTrnid,
          branchCd: Constants.BRANCH_CODE,
          benAcc: this.state.benificiaryAcc,
          trnscnId: this.state.trnscnId,
        };

        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));

        const Body = {
          PARACNT: '1',
          PARA1_TYP: 'STR',
          PARA1_VAL: jsonValue,
        };
        console.log("SubmitOtpApi URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("SubmitOtpApi:- " + JSON.stringify(jsonReq));
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
            console.log("SubmitOtpApi Response:- " + JSON.stringify(finalRes));
            if (finalRes.SUCCESS === 'FALSE') {
              this.setState(prevState => ({ errorCount: prevState.errorCount + 1 }));
              const ErrorMsg = finalRes.RESULT;
              if (this.state.errorCount === 3) {
                Snackbar.show({
                  text: ErrorMsg,
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'red',
                  numberOfLines:3
                });
                this.state.callFrom === 'Dashboard'
                                ? navigation.navigate(this, 'IMPSTransferMenu')
                                : navigation.navigate(this, 'quickPayScreen');
              }
              else
              {
                Snackbar.show({
                  text: ErrorMsg + " " + "Attempts Left:-" + (Number(3) - Number(this.state.errorCount)),
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'red',
                  numberOfLines:3
                });
              }
            } else if (finalRes.SUCCESS === 'TRUE') {
              this.setState({ errorCount: 0 });
              let res = finalRes.Acdtls;
              let mainArry = [];
              mainArry = res.map((jsonStr) => JSON.parse(jsonStr));
              navigation.navigate(this, 'ImpsTransferSuccess', {
                from: this.state.callFrom,
                trnId: mainArry[0].TRANS_ID,
              });
            }
          }
        );
      } catch (e) {
        console.log('Error: ', e);
      }
    } else {
      Snackbar.show({
        text: 'Internet not avaialable',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    }
  };
  ResendOtp = async () => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers('SNDIMPSFTOTP');

        const jsonReq = {
          customerId: Constants.GMST_CODE,
          branchCd: Constants.BRANCH_CODE,
          secKey: Constants.SecretKey,
          divId: this.props.DeviceId,
          bankCode: Constants.BankCode,
          neftTrnid: this.state.neftTrnid,
          trnscnId: this.state.trnscnId,
          NMODE: '4',
        };

        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));

        const Body = {
          PARACNT: '1',
          PARA1_TYP: 'STR',
          PARA1_VAL: jsonValue,
        };

        sendData(this, 'post', APIUrlConstants.BASE_URL, Headers, Body, async (obj, response) => {
          var responseData = response;
          var responseData = await decryptData(response);
          var newRes = responseData.slice(16);
          var finalRes = JSON.parse(newRes);
          if (finalRes.SUCCESS === 'FALSE') {
            const ErrorMsg = finalRes.RESULT;
            Snackbar.show({
              text: ErrorMsg,
              duration: Snackbar.LENGTH_SHORT,
            });
          } else if (finalRes.SUCCESS === 'TRUE') {
            this.setState((prevState) => ({ OTPcount: prevState.OTPcount + 1 }));
            Snackbar.show({
              text: 'OTP Resend Successfully..!',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'green',
            });
            clearInterval(this.timerInterval);
            this.setState({ timer: 45 }, this.startTimer);
          }
        });
      } catch (e) {
        console.log('Error: ', e);
      }
    } else {
      Snackbar.show({
        text: 'Internet not avaialable',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    }
  };
  bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg;
  forAllow = () => {
    if (Platform.OS === 'ios') {
      Keyboard.dismiss()
    }
    this.toCallSubmit()
  };
  render() {
    return (
      <View style={styles.mainView}>
        <ImageBackground style={styles.mainView} source={this.bgImage} resizeMode='cover'>
          <KeyboardAvoidingView
            style={styles.mainView}
            behavior={Platform.OS === 'ios' ? 'padding' : ''}
            enabled={true}
          >
            <View style={styles.headerView}>
              <TrasnperantFixedHomeHeader backAction={() => this.onBackAction()} />
              <View style={styles.headerView}>
                <Image
                  source={require('../../../../assets/images/graphic-img-03.png')}
                  style={styles.otpImage}
                  resizeMode={Platform.OS === 'android' ? 'center' : 'contain'}
                />
              </View>
            </View>
            <View
              style={styles.enterOtpView}>
              <Text
                style={[styles.enetrOtpText, { color: this.props.textColor }]}>
                {strings.enterOTP}
              </Text>
              <View
                style={styles.otpInputsView}>
                <OtpInputs
                  caretHidden={false} // cusrsor
                  handleChange={(code) => {
                    this.setState({ otp: { code: code.replace(/[^0-9]/g, '') } });
                    this.setState({ otp_length: code });
                  }}
                  numberOfInputs={6}
                  keyboardType='numeric' // This allows only numbers
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
                  autofillFromClipboard={false}
                />
              </View>
              {this.state.OTPcount < 2 ? (
                <View style={styles.resendOtpView}>
                  {this.state.timer === '00' ? (
                    <TouchableOpacity onPress={() => {
                      if (Platform.OS === 'ios') {
                        Keyboard.dismiss()
                      }
                      this.ResendOtp()}}>
                      <Text style={[styles.ResendOTPStyle, { color: this.props.PrimaryColor }]}>Resend OTP</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={[styles.ResendOTPStyle, { color: colors.Red, marginLeft: 5 }]}>
                      {'00.' + this.state.timer}
                    </Text>
                  )}
                </View>
              ) : null}
              <View
                style={styles.transactionPinView}>
                <TextInput
                  style={styles.transPinTextInput}
                  theme={{
                    colors: {
                      placeholder: '#DFE1E8',
                      text: this.props.textColor,
                      primary: this.props.themeColor,
                      underlineColor: 'transparent',
                    },
                    roundness: 8,
                  }}
                  label='Enter Transaction pin'
                  value={this.state.transPin}
                  keyboardType='default'
                  onChangeText={(transPin) => {
                    this.setState({ transPin: transPin });
                  }}
                  mode='outlined'
                  secureTextEntry={this.state.isTransactionPin}
                  right={
                    <TextInput.Icon
                      forceTextInputFocus={false}
                      onPress={() => {
                        this.setState({ isTransactionPin: !this.state.isTransactionPin });
                        Keyboard.dismiss();
                      }}
                      icon={() => (
                        <View
                          style={styles.eyeIconView}>
                          {this.state.isTransactionPin ? (
                            <EyeSlash height={20} width={20} color={'#000000'} />
                          ) : (
                            <EyeOpen height={20} width={20} color={'#000000'} />
                          )}
                        </View>
                      )}
                    />
                  }
                  ref={(input) => {
                    this.Confirmtransactionpass = input;
                  }}
                  placeholder='Enter Transaction Password'
                />
              </View>

              {/* <CardView
        cardElevation={this.state.otp.length >= 3 && this.state.transPin.length >= 3 ? 3 : 0}
        cardMaxElevation={3}
        cornerRadius={12}
        style={styles.otpButtonCard}>
        <TouchableOpacity
         style={[styles.submitButtonTouchable, { backgroundColor: this.state.otp_length.length >= 3 && this.state.transPin.length >= 3 ? colors.btnColor : colors.btnDisable, }]}
         disabled={
          this.state.otp_length.length >= 3 && this.state.transPin.length >= 3 ? false : true
         }
         onPress={() => {
          this.toCallSubmit();
         }}>
         <Text
          style={[styles.submitButtonText, { color: this.state.otp_length.length >= 3 && this.state.transPin.length >= 3 ? colors.white : colors.btnDisableTextColor }]}>
          {strings.submit}
         </Text>
        </TouchableOpacity>
       </CardView> */}
              <SwipeButton
                onPressAllow={() => {
                  this.forAllow()
                }}
                onPressNo={() => this.noThanks()}
                onToggle={this.state.otp_length.length >= 3 && this.state.transPin.length >= 3 ? true : false}
                btnColor={this.state.otp_length.length >= 3 && this.state.transPin.length >= 3 ? colors.btnColor : colors.btnDisable}
              />
            </View>
          </KeyboardAvoidingView>
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
  headerView:
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  otpImage:
  {
    height: 250,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  enterOtpView:
  {
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: 'column',
    paddingBottom: 15,
  },
  enetrOtpText:
  {
    width: width - 50,
    marginTop: 30,
    fontSize: 25,
    textAlign: 'center',
    fontFamily: strings.fontBold,

  },
  otpInputsView:
  {
    height: 60,
    width: width - 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  ResendOTPStyle: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: strings.fontMedium,
  },
  resendOtpView:
  {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  transactionPinView:
  {
    marginTop: 10,
    justifyContent: 'center',
  },
  transPinTextInput:
  {

    lineHeight: 40,
    height: 48,
    width: width - 50,
  },
  eyeIconView:
  {
    height: 30,
    width: 30,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpButtonCard:
  {
    backgroundColor: 'white',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonTouchable:
  {
    padding: 15,
    width: width - 40,
    backgroundColor: colors.btnColor,
    justifyContent: 'center',
    borderRadius: 12,
  },
  submitButtonText:
  {
    alignSelf: 'center',
    fontFamily: strings.fontRegular,
    fontSize: 15,
  },
}

export default connect(mapStateToProps, mapDispatchToProps)(ImpsTransferOtp);