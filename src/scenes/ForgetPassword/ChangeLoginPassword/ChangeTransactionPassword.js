import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  BackHandler,
  Keyboard,
} from 'react-native';

import { TextInput } from 'react-native-paper';

import {
  colors,
  strings,
  assets,
  connect,
  mapStateToProps,
  mapDispatchToProps,
  width,
  navigation,
  appThemeConfiguration,
  RenderLoader,
  sendData,
} from '../../../App';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';
import TransparentFixedHeader from '../../../components/TrasnperantFixedHeader';
import APIUrlConstants from '../../../common/APIUrlConstants';
import Colors from '../../../common/Colors';
import MyValidator from '../../../common/MyValidator';
import Constants from '../../../common/Constants';
import Snackbar from 'react-native-snackbar';
import EyeOpen from '../../../assets/icons/formIcons/ico-eye.svg';
import EyeSlash from '../../../assets/icons/formIcons/ico-eye-slash.svg';
import OtpInputs from 'react-native-otp-inputs';

class ChangeTransactionPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Old_error: '',
      New_error: '',
      Confirm_error: '',

      OldPassword: '',
      NewPassword: '',
      ConfirmNewPassword: '',

      isConfirmloginPass: true,

      stus_Password: true,
      stus_OTP: false,

      otpInput: '',

      timer: 45,
      OTPcount: 1,
    };

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() { }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  onBackAction() {
    navigation.goBack(this);
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

  SubmitOTP() {
    const Headers = APIUrlConstants.Headers('CHNGPIN');

    const Body = {
      PARACNT: '8',
      PARA1_TYP: 'STR',
      PARA1_VAL: Constants.UserId,
      PARA2_TYP: 'STR',
      PARA2_VAL: Constants.GMST_CODE,
      PARA3_TYP: 'STR',
      PARA3_VAL: 'P',
      PARA4_TYP: 'STR',
      PARA4_VAL: this.state.OldPassword,
      PARA5_TYP: 'STR',
      PARA5_VAL: this.state.NewPassword,
      PARA6_TYP: 'STR',
      PARA6_VAL: this.state.otpInput,
      PARA7_TYP: 'STR',
      PARA7_VAL: Constants.BankCode,
      PARA8_TYP: 'STR',
      PARA8_VAL: Constants.SecretKey,
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
          Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
          navigation.goBack(this);
        } else if (res === 'TRUE') {
          const Msg = response.RESULT;

          Snackbar.show({
            text: 'Transaction Password Reset Successfully..!',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: 'green',
          });

          const GMST_CODE = this.props.gmstCode;

          if (GMST_CODE === null || GMST_CODE === undefined || GMST_CODE.trim() === '') {
            this.props.navigation.reset({ index: 0, routes: [{ name: 'existingUserLogin' }] });
          } else {
            this.props.navigation.reset({ index: 0, routes: [{ name: 'loginTypeSelectScreen' }] });
          }
        }
      }
    );
  }

  GetOTPSubmit() {
    const result = this.ValidateForm();

    if (result) {
      this.GetOTP();
    }
  }

  GetOTP() {
    const Headers = APIUrlConstants.Headers('SNDCHGPINOTP');

    const Body = {
      PARACNT: '4',
      PARA1_TYP: 'STR',
      PARA1_VAL: Constants.UserId,
      PARA2_TYP: 'STR',
      PARA2_VAL: Constants.GMST_CODE,
      PARA3_TYP: 'STR',
      PARA3_VAL: Constants.BankCode,
      PARA4_TYP: 'STR',
      PARA4_VAL: Constants.SecretKey,
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
          Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
        } else if (res === 'TRUE') {
          this.setState({ stus_Password: false, stus_OTP: true });

          this.startTimer();
        }
      }
    );
  }

  ResendOTP() {
    this.setState((prevState) => ({ OTPcount: prevState.OTPcount + 1 }));

    const Headers = APIUrlConstants.Headers('SNDCHGPINOTP');

    const Body = {
      PARACNT: '4',
      PARA1_TYP: 'STR',
      PARA1_VAL: Constants.UserId,
      PARA2_TYP: 'STR',
      PARA2_VAL: Constants.GMST_CODE,
      PARA3_TYP: 'STR',
      PARA3_VAL: Constants.BankCode,
      PARA4_TYP: 'STR',
      PARA4_VAL: Constants.SecretKey,
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
          Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
        } else if (res === 'TRUE') {
          clearInterval(this.timerInterval);
          this.setState({ timer: 45 }, this.startTimer);
        }
      }
    );
  }

  ValidateForm() {
    var result = true;

    this.setState({ Old_error: '', New_error: '', Confirm_error: '' });

    if (!MyValidator.isEmptyField(this.state.OldPassword).isValid) {
      this.setState({ Old_error: MyValidator.isEmptyField('').Response });
      result = false;
    }

    if (this.state.NewPassword.length > 0 && this.state.ConfirmNewPassword.length > 0) {
      if (
        !MyValidator.isConfirmTrasactionPassword(this.state.NewPassword, this.state.ConfirmNewPassword)
          .isValid
      ) {
        this.setState({
          Confirm_error: MyValidator.isConfirmTrasactionPassword(
            this.state.NewPassword,
            this.state.ConfirmNewPassword
          ).Response,
        });

        result = false;
      }
    }

    if (this.state.OldPassword === this.state.NewPassword) {
      this.setState({ New_error: 'Current password & new password should be different' });
      result = false;
    }

    const regex = /(.)(\1{3,})/g;

    if (this.state.NewPassword.match(regex)) {
      this.setState({ New_error: "Can't enter 4 consecutive variable" });
      result = false;
    }

    if (!MyValidator.isEmptyField(this.state.NewPassword).isValid) {
      this.setState({ New_error: MyValidator.isEmptyField('').Response });
      result = false;
    }

    if (!MyValidator.isEmptyField(this.state.ConfirmNewPassword).isValid) {
      this.setState({ Confirm_error: MyValidator.isEmptyField('').Response });
      result = false;
    }

    return result;
  }

  bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg;
  render() {
    return (
      <View style={styles.ViewFlexOne}>
        <ImageBackground style={styles.ViewFlexOne} source={this.bgImage} resizeMode='cover'>
          <View style={styles.HeaderStyle}>
            <TransparentFixedHeader backAction={() => this.onBackAction()} />

            <View style={styles.HeaderStyle}>
              <Image source={assets.onSuccess} style={styles.BackgroundImage} />
            </View>

            <KeyboardAvoidingView
              style={styles.CurveBackground}
              behavior={Platform.OS === 'ios' ? 'padding' : ''}
              enabled={true}>

              <View style={styles.CurveView}>
                <Text style={styles.Text_Heading}>Change Transaction Password</Text>

                <ScrollView>
                  <View>
                    {this.state.stus_Password && (
                      <View>

                        <View style={styles.ViewCenter}>

                          <TextInput
                            style={styles.TextInputStyleOne}
                            theme={{
                              colors: {
                                placeholder: '#DFE1E8',
                                text: this.props.textColor,
                                primary: this.props.PrimaryColor,
                                underlineColor: 'transparent',
                              },
                              roundness: 8,
                            }}
                            label='Current Password'
                            value={this.state.OldPassword}
                            keyboardType='default'
                            onChangeText={(OldPassword) => {
                              this.setState({ OldPassword });
                            }}
                            mode='outlined'
                            maxLength={20}
                            secureTextEntry={true}
                            placeholder='Current Password'
                            returnKeyType='next'
                            onSubmitEditing={() => {
                              this.NewPassword.focus();
                            }}
                            blurOnSubmit={false}
                          />

                          {this.state.Old_error !== '' && (<Text style={styles.ErrorDisplay}>{this.state.Old_error}</Text>)}
                        </View>

                        <View style={styles.NewPassBg}>

                          <TextInput
                            style={styles.TextInputStyleTwo}
                            theme={{
                              colors: {
                                placeholder: '#DFE1E8',
                                text: this.props.textColor,
                                primary: this.props.PrimaryColor,
                                underlineColor: 'transparent',
                                // background: 'red',
                              },
                              roundness: 8,
                            }}
                            label='New Password'
                            value={this.state.NewPassword}
                            keyboardType='default'
                            onChangeText={(NewPassword) => {
                              this.setState({ NewPassword });
                            }}
                            mode='outlined'
                            maxLength={20}
                            secureTextEntry={true}
                            placeholder='New Password'
                            returnKeyType='next'
                            ref={(input) => {
                              this.NewPassword = input;
                            }}
                            onSubmitEditing={() => {
                              this.ConfirmNewPassword.focus();
                            }}
                            blurOnSubmit={false}
                          />

                          {this.state.New_error !== '' && (
                            <Text style={styles.ErrorDisplay}>{this.state.New_error}</Text>
                          )}
                        </View>

                        <View style={styles.ViewCenter}>
                          <TextInput
                            style={styles.TextInputStyleThree}
                            theme={{
                              colors: {
                                placeholder: '#DFE1E8',
                                text: this.props.textColor,
                                primary: this.props.PrimaryColor,
                                underlineColor: 'transparent',
                              },
                              roundness: 8,
                            }}
                            label='Confirm Password'
                            value={this.state.ConfirmNewPassword}
                            keyboardType='default'
                            onChangeText={(ConfirmNewPassword) => {
                              this.setState({ ConfirmNewPassword });
                            }}
                            mode='outlined'
                            secureTextEntry={this.state.isConfirmloginPass}
                            maxLength={20}
                            right={
                              <TextInput.Icon
                                forceTextInputFocus={false}
                                onPress={() => {
                                  this.setState({ isConfirmloginPass: !this.state.isConfirmloginPass });
                                  Keyboard.dismiss();
                                }}
                                icon={() => (
                                  <View style={styles.EyeIconStyle} >
                                    {this.state.isConfirmloginPass ? (
                                      <EyeSlash height={20} width={20} color={'#000000'} />
                                    ) : (
                                      <EyeOpen height={20} width={20} color={'#000000'} />
                                    )}
                                  </View>
                                )}
                              />
                            }
                            ref={(input) => { this.ConfirmNewPassword = input; }}
                            placeholder='Confirm Login Password'
                            returnKeyType='next'
                            blurOnSubmit={false}
                          />

                          {this.state.Confirm_error !== '' && (<Text style={styles.ErrorDisplay}>{this.state.Confirm_error}</Text>)}
                        </View>

                        {/* buttons */}
                        <TouchableOpacity
                          style={[styles.SubmitButton, { backgroundColor: this.props.PrimaryColor }]}
                          onPress={() => {
                            this.GetOTPSubmit();
                          }}
                        >
                          <Text style={styles.GetOTPText}>Get OTP</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {this.state.stus_OTP && (
                      <View>
                        <OtpInputs
                          style={styles.OTPInputStyle}
                          handleChange={(code) => { this.setState({ otpInput: code }); }}
                          numberOfInputs={6}
                          inputContainerStyles={styles.Inputcontainer}
                          focusStyles={{ borderColor: this.props.SecondaryColor }}
                          keyboardType='numeric'
                          inputStyles={[styles.InputsStyle, { color: this.props.PrimaryColor }]}
                          selectionColor={this.props.SecondaryColor}
                          secureTextEntry={true}
                          autofillFromClipboard={false}
                        />

                        {this.state.OTPcount < 3 ? (
                          <View style={styles.OTPResendStyle}>
                            {this.state.timer === '00' ? (
                              <TouchableOpacity onPress={() => this.ResendOTP()}>
                                <Text style={[styles.ResendOTPStyle, { color: this.props.PrimaryColor }]}>
                                  Resend OTP
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <Text style={[styles.ResendOTPStyle, { color: colors.Red, marginLeft: 5 }]}>
                                {'00.' + this.state.timer}
                              </Text>
                            )}
                          </View>
                        ) : null}


                        <CardView
                          cardElevation={this.state.otpInput.length == 6 ? 4 : 0}
                          cardMaxElevation={3}
                          cornerRadius={12}
                          style={styles.SubmitBtnBg} >
                          <TouchableOpacity
                            style={[styles.ButtonTouchable, { backgroundColor: this.state.otpInput.length > 3 ? colors.btnColor : colors.btnDisable, },]}
                            disabled={this.state.otpInput.length > 3 ? false : true}
                            onPress={() => { this.SubmitOTP(); }} >
                            <Text
                              style={[styles.SubmitBtnTextBg, { color: this.state.otpInput.length > 3 ? colors.white : colors.btnDisableTextColor, }]} >
                              {strings.submit}
                            </Text>
                          </TouchableOpacity>
                        </CardView>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </View>
        </ImageBackground>
        <RenderLoader />
      </View>
    );
  }
}

const styles = StyleSheet.create({

  BackgroundImage: {
    height: 200,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  ViewFlexOne: {
    flex: 1,
  },

  HeaderStyle:
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  CurveBackground: {
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex: 1,
  },
  CurveView: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flexDirection: 'column',
  },
  Text_Heading: {
    width: width,
    marginTop: 30,
    fontSize: 22,
    textAlign: 'center',
    fontFamily: strings.fontBold,
    color: Colors.boldTextColor,
  },

  ViewCenter:
  {
    justifyContent: 'center',
  },

  TextInputStyleOne:
  {
    lineHeight: 40,
    height: 48,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: width - 50,
    marginTop: 20,
  },

  TextInputStyleTwo:
  {
    lineHeight: 40,
    height: 48,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: width - 50,
  },

  TextInputStyleThree:
  {
    marginTop: 5,
    lineHeight: 40,
    height: 48,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: width - 50,
  },

  EyeIconStyle:
  {
    height: 30,
    width: 30,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  GetOTPText:
  {
    color: colors.white,
  },

  OTPInputStyle:
  {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20
  },



  TextInputStyle: {
    lineHeight: 40,
    height: 48,
    width: width - 50,
  },

  TextInputTheme: {
    colors: {
      placeholder: '#DFE1E8',
      text: '#1F3C66',
      primary: '#FF5936',
      underlineColor: 'transparent',
      background: 'white',
    },
    roundness: 8,
  },
  ButtonTouchable: {
    padding: 15,
    width: width - 40,
    backgroundColor: colors.btnColor,
    justifyContent: 'center',
    borderRadius: 12,
  },

  SubmitButton: {
    marginTop: 15,
    height: 52,
    width: width - 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 20,
  },

  Inputcontainer: {
    height: 45,
    width: 45,
    margin: 5,
    borderWidth: 1,
    marginTop: 30,
    justifyContent: 'center',
    backgroundColor: colors.otpBackColor,
    borderColor: colors.otpBorderColor,
    borderRadius: 8,
  },

  InputsStyle: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  ResendOTPStyle: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: strings.fontMedium,
  },

  OTPResendStyle:
  {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10
  },

  SubmitBtnBg:
  {
    backgroundColor: 'white',
    justifyContent: 'center',
    marginVertical: 10
  },

  SubmitBtnTextBg:
  {
    alignSelf: 'center',
    fontFamily: strings.fontRegular,
    fontSize: 15,
  },


  NewPassBg:
  {
    justifyContent: 'center',
    marginTop: 5,
  },

  ErrorDisplay: { color: '#FF0000', marginLeft: 5, fontSize: 12 },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeTransactionPassword);
