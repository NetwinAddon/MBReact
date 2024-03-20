import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  BackHandler,
} from "react-native";
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
} from "../../App";
import { TouchableOpacity } from "react-native-gesture-handler";
import CardView from "react-native-cardview";
import TrasnsperantFixedHeader from "../../components/TrasnperantFixedHeader";
import APIUrlConstants from "../../common/APIUrlConstants";
import Colors from "../../common/Colors";
import OtpInputs from "react-native-otp-inputs";
import Constants from "../../common/Constants";

class ForgetPasswordOTP extends Component {
  constructor(props) {
    super(props);

    this.USERID = props.route.params.USERID;
    this.MobileNO = props.route.params.MobileNO;
    this.AccountType = props.route.params.AccountType;
    this.DOB = props.route.params.DOB;
    this.ADHAR_PAN = props.route.params.ADHAR_PAN;
    this.AccountNumber = props.route.params.AccountNumber;
    this.KYC_TYPE = props.route.params.KYC_TYPE;

    this.state = {
      otpInput: "",

      timer: 45,
      OTPcount: 1,
    };

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
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
          this.setState({ timer: "00" });
        }
      }
    );
  };

  Submit() {
    navigation.replace(this, "ForgetPasswordVerify", {
      OTP: this.state.otpInput,
      USERID: this.USERID,
      MobileNO: this.MobileNO,
    });
  }

  ResendOTP = () => {
    this.setState((prevState) => ({ OTPcount: prevState.OTPcount + 1 }));
    this.OTPResendApi();
  };

  OTPResendApi() {
    const Headers = APIUrlConstants.Headers("REGUSERONLINE");

    const Body = {
      PARACNT: "1",
      PARA1_TYP: "STR",
      PARA1_VAL:
        '{"BNK_CODE":"' + Constants.BankCode + '","ACC_NO":"' + this.AccountNumber + '","ADHAR_PAN":"' + this.ADHAR_PAN + '","MOB":"' + this.MobileNO + '","DOB":"' + this.DOB + '","KYC_TYPE":"' + this.KYC_TYPE + '","ACC_TYPE":"' + this.AccountType + '","OPR_TYPE":"FORGOT"}',
    };

    sendData(
      this,
      "post",
      APIUrlConstants.BASE_URL,
      Headers,
      JSON.stringify(Body),
      async (obj, response) => {
        var responseData = response;

        let res = response.SUCCESS;
        if (res === "FALSE") {
        } else if (res === "TRUE") {
          clearInterval(this.timerInterval);
          this.setState({ timer: 45 }, this.startTimer);
        }
      }
    );
  }

  bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg;

  render() {
    return (
      <View style={styles.ViewFlexOne}>
        <ImageBackground
          style={styles.ViewFlexOne}
          source={this.bgImage}
          resizeMode="cover"
        >
          <View style={styles.SubViewStyle}>
            <TrasnsperantFixedHeader backAction={() => this.onBackAction()} />

            <View style={styles.BgImageView}>
              <Image source={assets.onSuccess} style={styles.BackgroundImage} />
            </View>

            <KeyboardAvoidingView
              style={styles.CurveBackground}
              behavior={Platform.OS === "ios" ? "padding" : ""}
              enabled={true}
            >
              <View style={styles.CurveView}>
                <Text style={styles.Text_Heading}>Enter OTP</Text>

                <View style={styles.OTPInputBoxView}>
                  <OtpInputs
                    style={styles.OTPInputStyle}
                    handleChange={(code) => {
                      this.setState({ otpInput: code });
                    }}
                    numberOfInputs={6}
                    inputContainerStyles={styles.InputContainer}
                    focusStyles={{ borderColor: this.props.SecondaryColor }}
                    keyboardType="numeric" // This allows only numbers
                    inputStyles={styles.InputsStyle}
                    selectionColor={this.props.SecondaryColor}
                    secureTextEntry={true}
                    autofillFromClipboard={false}
                  />
                </View>

                {this.state.OTPcount < 3 ? (
                  <View style={styles.TimerStyle}>
                    {this.state.timer === "00" ? (
                      <TouchableOpacity onPress={() => this.ResendOTP()}>

                        <Text style={[ styles.ResendOTPStyle, { color: this.props.PrimaryColor },]}> Resend OTP </Text>

                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.ResendOTPTimerStyle}> {"00." + this.state.timer} </Text>)}
                  </View>
                ) : null}

                {/* UI-TAG Submit Button */}
                <CardView
                  cardElevation={this.state.otpInput.length == 6 ? 3 : 0}
                  cardMaxElevation={3}
                  cornerRadius={12}
                  style={styles.SubmitBtnBg}
                >
                  <TouchableOpacity
                    style={[
                      styles.ButtonTouchable,
                      {
                        backgroundColor:
                          this.state.otpInput.length > 3
                            ? colors.btnColor
                            : colors.btnDisable,
                      },
                    ]}
                    disabled={this.state.otpInput.length > 3 ? false : true}
                    onPress={() => {  this.Submit();  }} >
                    <Text
                      style={[
                        styles.SubmitTextStyle,
                        {
                          color:
                            this.state.otpInput.length > 3
                              ? colors.white
                              : colors.btnDisableTextColor,
                        },
                      ]}
                    >
                      {strings.submit}
                    </Text>
                  </TouchableOpacity>
                </CardView>
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
    height: 150,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  CurveBackground: {
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex: 2,
  },
  CurveView: {
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flexDirection: "column",
  },
  Text_Heading: {
    width: width,
    marginTop: 30,
    fontSize: 22,
    textAlign: "center",
    fontFamily: strings.fontBold,
    color: Colors.boldTextColor,
  },
  InputContainer: {
    height: 45,
    width: 45,
    margin: 5,
    borderWidth: 1,
    justifyContent: "center",
    backgroundColor: colors.otpBackColor,
    borderColor: colors.otpBorderColor,
    borderRadius: 8,
  },
  ButtonTouchable: {
    padding: 15,
    width: width - 40,
    backgroundColor: colors.btnColor,
    justifyContent: "center",
    borderRadius: 12,
  },
  InputsStyle: {
    fontSize: 15,
    textAlign: "center",
    color: "#1F3C66",
    fontWeight: "bold",
  },
  ResendOTPStyle: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: strings.fontMedium,
  },
  ResendOTPTimerStyle: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: strings.fontMedium,
    color: colors.Red,
    marginLeft: 5
  },
  OTPInputBoxView: {
    height: 60,
    width: width - 40,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  OTPInputStyle: {
    flexDirection: "row",
    justifyContent: "center",
  },
  SubmitBtnBg: {
    backgroundColor: "white",
    justifyContent: "center",
    marginVertical: 10,
  },
  ViewFlexOne: {
    flex: 1,
  },
  SubViewStyle: { flex: 1, justifyContent: "center", alignItems: "center" },

  BgImageView: { flex: 1, justifyContent: "center", alignItems: "center" },

  TimerStyle: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },

  SubmitTextStyle: {
    alignSelf: "center",
    fontFamily: strings.fontRegular,
    fontSize: 15,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPasswordOTP);
