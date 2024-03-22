import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
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
  sendData,
} from '../../App';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';
import TransparentFixedHeader from '../../components/TrasnperantFixedHeader';
import APIUrlConstants from '../../common/APIUrlConstants';
import { TextInput } from 'react-native-paper';
import EyeOpen from '../../assets/icons/formIcons/ico-eye.svg';
import EyeSlash from '../../assets/icons/formIcons/ico-eye-slash.svg';
import OtpInputs from 'react-native-otp-inputs';
import Smsicon from '../../assets/icons/smsicon.svg';
import Constants from '../../common/Constants';
import Snackbar from 'react-native-snackbar';
import NetInfo from '@react-native-community/netinfo';

class ForgetMpin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      UserId: '',
      Password: '',
      isloginPass: true,
      otpInput: '',
      isOTPPage: true,
      Title: 'Reset MPIN',
      timer: 45,
      OTPcount: 0,
    };
  }

  async componentDidMount() {
    if (isConnected) {
    } else {
      Snackbar.show({
        text: 'Check Internet Connection',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    }
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

  checkInternetConnection = async () => {
    try {
      const state = await NetInfo.fetch();

      const isConnected = state.isConnected;

      return isConnected;
    } catch (error) {
      return false;
    }
  };

  onBackAction() {
    navigation.goBack(this);
  }

  ResendOTP() {
    this.SendOTPApi();
  }

  SendOTPApi = async () => {


    if (this.state.UserId.trim().length > 0 && this.state.Password.length > 0) {

        const isConnected = await this.checkInternetConnection();

        if (isConnected) {


            const Headers = APIUrlConstants.Headers("REGUSERONLINE");

            const Body =
            {
                PARACNT: "1",
                PARA1_TYP: "STR",
                PARA1_VAL: "{\"CALLFROM\":\"OTP\",\"USERID\":\"" + this.state.UserId + "\",\"PASSWORD\":\"" + this.state.Password + "\",\"BNK_CODE\":\"" + Constants.BankCode + "\",\"DEVICEID\":\"" + this.props.DeviceId + "\"}"
            }

            // console.log("ForgetMpin OTPcall URL:- " + APIUrlConstants.BASE_URL);
            // console.log("");
            // console.log("ForgetMpin OTPcall:- " + JSON.stringify(Body));
            // console.log("");

            sendData(this,
                'post',
                APIUrlConstants.BASE_URL,
                Headers,
                JSON.stringify(Body),
                async (obj, response) => {

                    // console.log("ForgetMpin OTPcall Response:- " + JSON.stringify(response));

                    let res = response.SUCCESS

                    if (res === "FALSE") {

                        Snackbar.show({
                            text: 'Invalid User-ID or Password',
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: 'red'
                        });

                    }
                    else if (res === "TRUE") {


                        this.setState((prevState) => ({ OTPcount: prevState.OTPcount + 1 }))

                        this.setState({ isOTPPage: false, Title: 'Enter OTP' })

                        if (this.state.OTPcount > 1) {

                            Snackbar.show({ text: 'OTP Resend Successfully..!', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green' });
                            clearInterval(this.timerInterval);
                            this.setState({ timer: 45 }, this.startTimer);
                        }
                        else {

                            Snackbar.show({ text: 'OTP Send Successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green' });
                            this.startTimer();
                        }
                    }

                })

        } else {
            Snackbar.show({ text: 'Check Internet Connection', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });

        }

    }
}

  OTPSubmit() {
    const Headers = APIUrlConstants.Headers('REGUSERONLINE');

    const Body = {
      PARACNT: '1',
      PARA1_TYP: 'STR',
      PARA1_VAL:
        '{"CALLFROM":"OTP_VERIFY","GMST_CODE":"' +
        Constants.GMST_CODE +
        '","OTP":"' +
        this.state.otpInput +
        '","BNK_CODE":"' +
        Constants.BankCode +
        '"}',
    };
    console.log("Mpin change "+ APIUrlConstants.BASE_URL);
    console.log("Mpin change "+ JSON.stringify(Body));

    sendData(
      this,
      'post',
      APIUrlConstants.BASE_URL,
      Headers,
      JSON.stringify(Body),
      async (obj, response) => {

        console.log("Mpin change "+ JSON.stringify(response))
        let res = response.SUCCESS;

        if (res === 'FALSE') {
          const ErrorMsg = response.RESULT;
          // ToastAndroid.show(ErrorMsg, ToastAndroid.SHORT)
          Snackbar.show({
            text: ErrorMsg,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: 'red',
          });
        } else if (res === 'TRUE') 
        {
          const Msg = response.RESULT;

          // ToastAndroid.show(Msg, ToastAndroid.SHORT)
          Snackbar.show({
            text: Msg,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: 'green',
          });

          this.props.navigation.replace('ForgetChangeMpin', { SECRETKEY: response.SK });
        }
      }
    );
  }

  bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg2;
  render() {
    return (
      <View style={styles.ViewFlexOne}>

        <ImageBackground style={styles.ViewFlexOne} source={this.bgImage} resizeMode='cover'>

          <View style={styles.HeaderBg}>
            <TransparentFixedHeader backAction={() => this.onBackAction()} />

            <View style={styles.HeaderBg}>
              <Image source={assets.onSuccess} style={styles.BackgroundImage} />
            </View>

            <KeyboardAvoidingView
              style={[styles.CurveBackground, { flex: 1 }]}
              behavior={Platform.OS === 'ios' ? 'padding' : ''}
              enabled={true} >

              <View style={styles.CurveView}>

                <Text style={[styles.Text_Heading, { color: this.props.PrimaryColor }]}>{this.state.Title}</Text>

              </View>

              <ScrollView>
                <View>
                  {this.state.isOTPPage ? (
                    <View>

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
                          label='User ID'
                          value={this.state.UserId}
                          keyboardType='default'
                          onChangeText={(UserId) => {
                            this.setState({ UserId });
                          }}
                          mode='outlined'
                          placeholder='User ID'
                          returnKeyType='next'
                          onSubmitEditing={() => { this.password.focus(); }}
                          blurOnSubmit={false}
                        />
                      </View>

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
                          label='Login Password'
                          value={this.state.Password}
                          keyboardType='default'
                          onChangeText={(Password) => {
                            this.setState({ Password });
                          }}
                          mode='outlined'
                          secureTextEntry={this.state.isloginPass}
                          right={
                            <TextInput.Icon
                              forceTextInputFocus={false}
                              onPress={() => {
                                this.setState({ isloginPass: !this.state.isloginPass });
                                Keyboard.dismiss();
                              }}
                              icon={() => (
                                <View
                                  style={styles.EyebtnStyle}>
                                  {this.state.isloginPass ? (
                                    <EyeSlash height={20} width={20} color={'#000000'} />
                                  ) : (
                                    <EyeOpen height={20} width={20} color={'#000000'} />)}
                                </View>
                              )}
                            />
                          }
                          ref={(input) => { this.password = input; }}
                          placeholder='Login Password'
                        />
                      </View>

                      <TouchableOpacity
                        disabled={
                          this.state.UserId.trim().length > 0 && this.state.Password.length > 0 ? false : true
                        }
                        onPress={() => { this.SendOTPApi(); }}>
                        <View
                          style={[this.state.UserId.trim().length > 0 && this.state.Password.length > 0 ? styles.GetOtp : styles.GetOtpDisable,]}>

                          <Smsicon height={20} width={20}
                            fill={this.state.UserId.trim().length > 0 && this.state.Password.length > 0 ? '#1873B9' : colors.btnDisableTextColor}
                          />

                          <Text
                            style={[
                              styles.OtpText,
                              {
                                color:
                                  this.state.UserId.trim().length > 0 && this.state.Password.length > 0
                                    ? this.props.PrimaryColor
                                    : colors.btnDisableTextColor,
                              },
                            ]}
                          >
                            Get OTP
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View>
                      {/* UI-TAG OTP Input */}
                      <View>
                        <OtpInputs
                          style={styles.OTPInputStyle}
                          handleChange={(code) => {this.setState({ otpInput: code });}}
                          numberOfInputs={6}
                          inputContainerStyles={styles.InputContainer}
                          focusStyles={{ borderColor: this.props.themeColor }}
                          keyboardType='numeric'
                          inputStyles={styles.InputsStyle}
                          selectionColor={this.props.themeColor}
                          autofillFromClipboard={false}
                          secureTextEntry={true}
                        />
                      </View>

                      {this.state.OTPcount < 3 ? (
                        <View style={styles.OTPResendStyle}>
                          {this.state.timer === '00' ? (
                            <TouchableOpacity onPress={() => this.ResendOTP()}>
                              <Text style={[styles.ResendOTPStyle, { color: this.props.PrimaryColor }]}>  Resend OTP </Text>
                            </TouchableOpacity>
                          ) : (
                            <Text style={[styles.ResendOTPStyle, { color: colors.Red, marginLeft: 5 }]}>
                              {'00.' + this.state.timer}
                            </Text>
                          )}
                        </View>
                      ) : null}

                      <CardView
                        cardElevation={0}
                        cardMaxElevation={3}
                        cornerRadius={12}
                        style={{
                          backgroundColor: 'white',
                          justifyContent: 'center',
                          marginVertical: 30,
                          alignItems: 'center',
                        }}
                      >
                        <TouchableOpacity
                          style={[ styles.ButtonTouchable,{ backgroundColor:this.state.otpInput.length > 3 ? this.props.PrimaryColor : colors.btnDisable, },]}
                          disabled={this.state.otpInput.length > 3 ? false : true}
                          onPress={() => { this.OTPSubmit();}}>
                          
                          <Text style={[styles.SubmitBtnTextStyle,{    color: this.state.otpInput.length > 3 ? colors.white : colors.btnDisableTextColor,}]}>
                              {strings.submit}  </Text>
                        </TouchableOpacity>
                      </CardView>
                    </View>
                  )}
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </ImageBackground>

      </View>
    );
  }
}

const styles = StyleSheet.create({


  BackgroundImage: {
    height: 250,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  ViewFlexOne: {
    flex: 1,
  },

  HeaderBg:
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  CurveBackground: {
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
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
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: strings.fontBold,
  },


  TextStyle: {
    color: colors.accTextColor,
    marginLeft: 15,
    fontSize: 15,
    fontFamily: strings.fontMedium,
  },

  TextInputStyle: {
    lineHeight: 40,
    height: 48,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: width - 50,
  },

  EyebtnStyle:
  {
    height: 30,
    width: 30,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  ButtonTouchable: {
    padding: 15,
    width: width - 40,
    backgroundColor: colors.btnColor,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  SubmitBtnTextStyle:
  {
    alignSelf: 'center',
    fontFamily: strings.fontRegular,
    fontSize: 15,
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
  ResendOTPStyle: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: strings.fontMedium,
  },

  ViewBg: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  GetOtp: {
    width: width - width / 2,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1873B9',
    marginTop: 15,
    marginHorizontal: 25,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  GetOtpDisable: {
    width: width - width / 2,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.otpBorderColor,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.btnDisable,
    marginTop: 15,
    marginHorizontal: 25,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  OtpText: {
    fontSize: 17,
    textAlign: 'center',
    fontFamily: strings.fontBold,
    marginLeft: 10,
  },
  OTPInputStyle:
  {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  OTPResendStyle:
  { 
    flexDirection: 'row', 
    justifyContent: 'center',
     marginTop: 30 
    },
  InputContainer: {
    height: 45,
    width: 45,
    margin: 5,
    borderWidth: 1,
    backgroundColor: colors.otpBackColor,
    borderColor: colors.otpBorderColor,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  InputsStyle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#1F3C66',
    fontWeight: 'bold',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgetMpin);
