import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  Keyboard,
} from 'react-native';
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
} from '../../App';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';
import TransparentFixedHeader from '../../components/TrasnperantFixedHeader';
import APIUrlConstants from '../../common/APIUrlConstants';
import Colors from '../../common/Colors';
import { TextInput } from 'react-native-paper';
import Footer from '../../assets/icons/footer.svg';
import OtpInputs from 'react-native-otp-inputs';
import EyeOpen from '../../assets/icons/formIcons/ico-eye.svg';
import EyeSlash from '../../assets/icons/formIcons/ico-eye-slash.svg';
import Constants from '../../common/Constants';
import Snackbar from 'react-native-snackbar';
import MyValidator from '../../common/MyValidator';

class ChangeUserId extends Component {
  constructor(props) {
    super(props);

    this.state = {
      CurrentUserId: Constants.UserId,
      NewUserId: '',
      ConfirmNewUserId: '',

      stus_Checkavailability: true,
      stus_confirmPass: false,
      stus_OTP: false,

      VisibleNewUserId: true,
      VisibleConfiUserId: true,

      ButtonText: 'Check Availability',
      ImageFlex: 1,
      Title: 'Change User Id',

      confirmUserIdError: '',
      NewUserIdError: '',

      EditableUserId: true,

      timer: 45,
      OTPcount: 0,

      otpInput: '',
    };
  }

  componentDidMount() { }

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

  SubmitButton() {
    if (this.state.stus_Checkavailability) {
      const result = this.ValidateAvailability();

      if (result) {
        this.CheckAvailabilityApi();
      }
    }

    if (this.state.stus_confirmPass) {
      const result = this.ValidateConfirmPass();

      if (result) {
        this.GetOtp();

        // this.setState({ stus_Checkavailability: false, ImageFlex: 3, stus_confirmPass: false, stus_OTP: true, ButtonText: 'Submit',Title: 'Enter OTP' });
      }
    }

    // if (this.state.stus_OTP) {

    //   this.SubmitOTP();

    // }
  }

  ValidateAvailability() {
    var result = true;

    this.setState({ confirmUserIdError: '', NewUserIdError: '' });

    const newUserid = this.state.NewUserId;

    if (!MyValidator.isValidUserId(this.state.NewUserId).isValid) {
      this.setState({ NewUserIdError: MyValidator.isValidUserId(this.state.NewUserId).Response });
      result = false;
    }

    if (newUserid.includes(' ')) {
      this.setState({ NewUserIdError: 'Please remove white space' });
      result = false;
    }

    if (newUserid.length < 5) {
      this.setState({ NewUserIdError: 'Please enter minimum 5 digit user Id ' });
      result = false;
    }

    if (newUserid.toLowerCase() === 'google') {
      this.setState({ NewUserIdError: 'User Id Not available' });
      result = false;
    }

    return result;
  }

  ValidateConfirmPass() {
    var result = true;

    this.setState({ confirmUserIdError: '', NewUserIdError: '' });

    const newUserid = this.state.NewUserId;
    const confirm = this.state.ConfirmNewUserId;

    if (newUserid.includes(' ')) {
      this.setState({ NewUserIdError: 'Please remove white space' });
      result = false;
    }

    if (confirm.includes(' ')) {
      this.setState({ confirmUserIdError: 'Please remove white space' });
      result = false;
    }

    if (newUserid.length < 5) {
      this.setState({ NewUserIdError: 'Please enter Confirm User Id ' });

      result = false;
    }

    if (this.state.CurrentUserId === newUserid) {
      this.setState({ NewUserIdError: 'New User Id should be different from old User Id' });
      result = false;
    }

    if (newUserid !== confirm) {
      this.setState({ confirmUserIdError: 'User Id Missmatch' });

      result = false;
    }

    if (confirm.length < 5) {
      this.setState({ confirmUserIdError: 'Please enter confirm User Id ' });

      result = false;
    }

    return result;
  }

  CheckAvailabilityApi() {
    const Headers = APIUrlConstants.Headers('CHECKAVAIL');

    const Body = {
      PARACNT: '4',
      PARA1_TYP: 'STR',
      PARA1_VAL: this.state.NewUserId.trim(),
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
        var responseData = response;

        let res = response.SUCCESS;
        if (res === 'FALSE') {
          const ErrorMsg = response.RESULT;
          Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
        } else if (res === 'TRUE') {
          const Msg = response.RESULT;
          Snackbar.show({ text: Msg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green' });

          this.setState({
            EditableUserId: false,
            stus_Checkavailability: false,
            stus_confirmPass: true,
            stus_OTP: false,
            ButtonText: 'Get OTP',
          });
        }
      }
    );
  }

  ResendOTP() {
    this.GetOtp();
  }

  GetOtp() {
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
        var responseData = response;

        let res = response.SUCCESS;
        if (res === 'FALSE') {
          const ErrorMsg = response.RESULT;
          Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
        } else if (res === 'TRUE') {
          this.setState((prevState) => ({ OTPcount: prevState.OTPcount + 1 }));

          if (this.state.OTPcount > 1) {
            Snackbar.show({
              text: 'OTP Resend Successfully..!',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'green',
            });
            clearInterval(this.timerInterval);
            this.setState({ timer: 45 }, this.startTimer);
          } else {
            Snackbar.show({
              text: 'OTP Send Successfully..!',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'green',
            });

            this.setState({
              stus_Checkavailability: false,
              ImageFlex: 3,
              stus_confirmPass: false,
              stus_OTP: true,
              ButtonText: 'Submit',
              Title: 'Enter OTP',
            });
            this.startTimer();
          }
        }
      }
    );
  }

  SubmitOTP() {
    const Headers = APIUrlConstants.Headers('CHNGPIN');

    const Body = {
      PARACNT: '8',
      PARA1_TYP: 'STR',
      PARA1_VAL: Constants.UserId,
      PARA2_TYP: 'STR',
      PARA2_VAL: Constants.GMST_CODE,
      PARA3_TYP: 'STR',
      PARA3_VAL: 'U',
      PARA4_TYP: 'STR',
      PARA4_VAL: Constants.UserId,
      PARA5_TYP: 'STR',
      PARA5_VAL: this.state.NewUserId.trim(),
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
        var responseData = response;


        let res = response.SUCCESS;
        if (res === 'FALSE') {
          const ErrorMsg = response.RESULT;
          Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
          navigation.goBack(this);

        } else if (res === 'TRUE') {
          const Msg = response.RESULT;
          Snackbar.show({ text: Msg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green' });

          this.props.setUserId(this.state.NewUserId.trim());
          this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'loginType' }],
          });
        }
      }
    );
  }

  bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg2;
  render() {
    return (
      <View style={styles.ViewFlexOne}>
        <ImageBackground style={styles.ViewFlexOne} source={this.bgImage} resizeMode='cover'>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            enabled={true}
          >

            <View style={[styles.HeaderStyle, { flex: this.state.ImageFlex }]}>
              <TransparentFixedHeader backAction={() => this.onBackAction()} />

              <View
                style={styles.ImageViewBg}>

                <Image source={assets.onSuccess} style={styles.ImageStyle} />
              </View>
            </View>

            <View
              style={styles.CurveBackground}

            >
              <View style={[styles.CurveView]}>

                <Text style={[styles.Text_Heading, { color: this.props.PrimaryColor }]}>
                  {this.state.Title}
                </Text>

                {/* New User Id */}
                {this.state.stus_Checkavailability || this.state.stus_confirmPass ? (
                  <View style={styles.ViewBg}>
                    <TextInput
                      style={styles.TextInputStyle}
                      theme={{
                        colors: {
                          placeholder: '#DFE1E8',
                          text: this.props.textColor,
                          primary: this.props.SecondaryColor,
                          underlineColor: 'transparent',
                          background: 'white',
                        },
                        roundness: 8,
                      }}
                      maxLength={15}
                      label='New User Id'
                      value={this.state.NewUserId}
                      keyboardType='default'
                      editable={this.state.EditableUserId}
                      onChangeText={(NewUserId) => {
                        this.setState({ NewUserId });
                      }}
                      mode='outlined'
                      ref={(input) => {
                        this.newUserId = input;
                      }}
                      placeholder='New User Id'
                      blurOnSubmit={false}
                      returnKeyType='done'
                    />

                    {this.state.NewUserIdError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.NewUserIdError}</Text>)}
                  </View>
                ) : null}

                {/* Confirm User Id */}
                {this.state.stus_confirmPass && (
                  <View style={styles.ViewBg}>
                    <TextInput
                      style={styles.TextInputStyle}
                      theme={{
                        colors: {
                          placeholder: '#DFE1E8',
                          text: this.props.textColor,
                          primary: this.props.SecondaryColor,
                          underlineColor: 'transparent',
                          background: 'white',
                        },
                        roundness: 8,
                      }}
                      maxLength={15}
                      label='Confirm User Id'
                      value={this.state.ConfirmNewUserId}
                      keyboardType='default'
                      onChangeText={(ConfirmNewUserId) => {
                        this.setState({ ConfirmNewUserId });
                      }}
                      right={
                        <TextInput.Icon
                          forceTextInputFocus={false}
                          onPress={() => {
                            this.setState({ VisibleConfiUserId: !this.state.VisibleConfiUserId });
                            Keyboard.dismiss();
                          }}
                          icon={() => (
                            <View style={styles.IconStyle}>
                              {this.state.VisibleConfiUserId ? (
                                <EyeSlash height={20} width={20} color={'#000000'} />
                              ) : (
                                <EyeOpen height={20} width={20} color={'#000000'} />
                              )}
                            </View>
                          )}
                        />
                      }
                      mode='outlined'
                      secureTextEntry={this.state.VisibleConfiUserId}
                      placeholder='Confirm User Id'
                      returnKeyType='done'
                    />

                    {this.state.confirmUserIdError !== '' && (
                      <Text style={styles.ErrorDisplay}>{this.state.confirmUserIdError}</Text>
                    )}
                  </View>
                )}

                {this.state.stus_OTP && (
                  <OtpInputs
                    style={styles.OTPInputStyle}
                    handleChange={(code) => {
                      this.setState({ otpInput: code });
                    }}
                    numberOfInputs={6}
                    inputContainerStyles={styles.InputContainer}
                    focusStyles={{ borderColor: this.props.SecondaryColor }}
                    keyboardType='numeric' // This allows only numbers
                    inputStyles={[styles.InputsStyle, { color: this.props.PrimaryColor }]}
                    selectionColor={this.props.SecondaryColor}
                    secureTextEntry={true}
                    autofillFromClipboard={false}
                  />
                )}

                {this.state.stus_OTP && this.state.OTPcount < 3 ? (
                  <View style={styles.ResendOTPView}>
                    {this.state.timer === '00' ? (
                      <TouchableOpacity onPress={() => this.ResendOTP()}>

                        <Text style={[styles.ResendOTPStyle, { color: this.props.PrimaryColor }]}> Resend OTP  </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={[styles.ResendOTPStyle, { color: colors.Red, marginLeft: 5 }]}>
                        {'00.' + this.state.timer}
                      </Text>
                    )}
                  </View>
                ) : null}

                {/* Check Availability buttons */}

                {!this.state.stus_OTP && (
                  <TouchableOpacity
                    style={[styles.SubmitButton, { backgroundColor: this.props.PrimaryColor }]}
                    onPress={() => {
                      Keyboard.dismiss();
                      this.SubmitButton();
                    }}
                  >
                    <Text style={{ color: colors.white }}>{this.state.ButtonText}</Text>
                  </TouchableOpacity>
                )}

                {/* OTP Submit */}
                {this.state.stus_OTP && (
                  <TouchableOpacity
                    style={[
                      styles.SubmitButton,
                      {
                        backgroundColor:
                          this.state.otpInput.length > 3 ? this.props.PrimaryColor : colors.btnDisable,
                      },
                    ]}
                    disabled={this.state.otpInput.length > 3 ? false : true}
                    onPress={() => { this.SubmitOTP(); }}>
                    <Text
                      style={{ color: this.state.otpInput.length > 3 ? colors.white : colors.btnDisableTextColor, }}>
                      {this.state.ButtonText}
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Note */}
                {this.state.stus_Checkavailability || this.state.stus_confirmPass ? (
                  <View style={styles.NoteView}>
                    <Text style={[styles.Note, { color: this.props.PrimaryColor, fontFamily: strings.fontBold }]}>
                      Note :-
                    </Text>

                    <Text style={[styles.Note, { color: this.props.PrimaryColor }]}>
                      1. User can change user ID only once.{' '}
                    </Text>
                    <Text style={[styles.Note, { color: this.props.PrimaryColor }]}>
                      2. User Id must contain only A-Z, a-z, 0-9 characters and atleast one alphabet.{' '}
                    </Text>
                    <Text style={[styles.Note, { color: this.props.PrimaryColor }]}>
                      3. Minimum 5 and maximum 15 characters are allowed for user ID.{' '}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.FooterStyle}>
                  <Footer height={70} width={300} />
                </View>

              </View>
            </View>

          </KeyboardAvoidingView>
        </ImageBackground>

        <RenderLoader />
      </View>
    );
  }
}

const styles = StyleSheet.create({

  CurveBackground: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: 'flex-end',
    flex: 1.5,
    flexWrap: 'wrap'
  },
  ViewFlexOne: {
    flex: 1,
  },

  HeaderStyle:
  {
    justifyContent: 'center',
    alignItems: 'center'
  },
  ImageViewBg:
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageStyle:
  {
    height: 200,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  CurveView: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  Text_Heading: {
    width: width,
    fontSize: 22,
    textAlign: 'center',
    fontFamily: strings.fontBold,
    marginTop: 30,
    marginBottom: 5,
  },

  Note: {
    width: width - 50,
    fontSize: 12,
    fontFamily: strings.fontMedium,
    marginTop: 10,
  },

  NoteView:
  {
    flexDirection: 'column'
  },

  FooterStyle:
  {
    alignItems: 'center',
    justifyContent: 'flex-end'
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
  Inputstyle: {
    fontSize: 15,
    textAlign: 'center',
    color: Colors.textColorForOrange,
    fontWeight: 'bold',
  },
  ViewBg: {
    height: 60,
    justifyContent: 'center',
    marginTop: 5,
  },
  TextInputStyle: {
    lineHeight: 40,
    height: 48,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: width - 50,
  },
  SubmitButton: {
    marginTop: 15,
    height: 52,
    width: width - 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },

  OTPInputStyle:
  {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20
  },

  InputContainer: {
    height: 45,
    width: 45,
    margin: 5,
    borderWidth: 1,
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
  IconStyle: {
    height: 30,
    width: 30,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ResendOTPStyle: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: strings.fontMedium,
  },
  ResendOTPView:
  {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  ErrorDisplay: { color: '#FF0000', marginLeft: 5, fontSize: 12 },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeUserId);
