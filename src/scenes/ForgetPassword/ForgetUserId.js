import React, { Component } from "react";
import {
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Animated,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ToastAndroid,
  StyleSheet,
  Keyboard,
  Clipboard,
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
  constants,
} from "../../App";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import CardView from "react-native-cardview";
import TrasnsperantFixedHeader from "../../components/TrasnperantFixedHeader";
import APIUrlConstants from "../../common/APIUrlConstants";
import Colors from "../../common/Colors";
import { TextInput } from "react-native-paper";
import Footer from "../../assets/icons/footer.svg";
import OtpInputs from "react-native-otp-inputs";
import EyeOpen from "../../assets/icons/formIcons/ico-eye.svg";
import EyeSlash from "../../assets/icons/formIcons/ico-eye-slash.svg";
import Constants from "../../common/Constants";
import Snackbar from "react-native-snackbar";
import CopyIcon from "../../assets/icons/copy.svg";

class ForgetUserId extends Component {
  constructor(props) {
    super(props);

    this.state = {
      MobileNo: "",
      MobNo_error: "",
      otpInput: "",
      title: "Forget User-Id",
      ButtonTitle: "Submit",

      user_OTP: "",
      user_ID: "",

      stus_MobileNo: true,
      stus_OTP: false,
      stus_ViewID: false,

      timer: 45,
      OTPcount: 0,
    };
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

  onBackAction() {
    navigation.goBack(this);
  }

  SubmitButton() {
    if (this.state.stus_MobileNo) {
      const result = this.ValidateForm();

      if (result) {
        this.ForgetUserIdApi();
      }
    }

    if (this.state.stus_OTP) {
      if (this.state.user_OTP === this.state.otpInput) {
        Snackbar.show({
          text: "OTP Verified Successfully",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "green",
        });
        this.setState({
          stus_MobileNo: false,
          stus_OTP: false,
          stus_ViewID: true,
          title: "Your User ID Is",
          ButtonTitle: "Go to Login Page",
        });
      } else {
        Snackbar.show({
          text: "Invalid OTP",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "red",
        });
      }
    }

    if (this.state.stus_ViewID) {
      this.props.navigation.reset({
        index: 0,
        routes: [{ name: "existingUserLogin" }],
      });
    }
  }

  ResendOTP() {
    const simid = "00000000-05ec-ff6b-0000-00005659f38b";

    const Headers = APIUrlConstants.Headers("FRGTUSERID");

    const Body = {
      PARACNT: "1",
      PARA1_TYP: "STR",
      PARA1_VAL:
        '{"BNK_CODE":"' +
        Constants.BankCode +
        '","MOB":"' +
        this.state.MobileNo +
        '","DEVICE_ID":"' +
        this.props.DeviceId +
        '","SIMNO":"' +
        simid +
        '"}',
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
          const ErrorMsg = response.RESULT;
          Snackbar.show({
            text: ErrorMsg,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "red",
          });
        } else if (res === "TRUE") {
          this.setState((prevState) => ({ OTPcount: prevState.OTPcount + 1 }));

          Snackbar.show({
            text: "OTP Resend Successfully",
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "green",
          });

          const OTP = response.OTP;
          const USER_ID = response.USER_ID;

          this.setState({ user_ID: USER_ID, user_OTP: OTP });

          clearInterval(this.timerInterval);
          this.setState({ timer: 45 }, this.startTimer);
        }
      }
    );
  }

  CopyUserId = async () => {
    try {
      await Clipboard.setString(this.state.user_ID);

      Snackbar.show({
        text: "User ID Copied !!",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "green",
      });
    } catch (error) { }
  };

  ValidateForm() {
    var result = true;

    this.setState({ MobNo_error: "" });

    const MobNo = this.state.MobileNo;

    if (MobNo.length === 0) {
      this.setState({ MobNo_error: "Enter Mobile Number" });
      result = false;
    }

    if (MobNo.length !== 10) {
      this.setState({ MobNo_error: "Enter 10 digit Mobile Number" });
      result = false;
    }
    return result;
  }

  ForgetUserIdApi() {
    const simid = "00000000-05ec-ff6b-0000-00005659f38b";

    const Headers = APIUrlConstants.Headers("FRGTUSERID");

    const Body = {
      PARACNT: "1",
      PARA1_TYP: "STR",
      PARA1_VAL:
        '{"BNK_CODE":"' +
        Constants.BankCode +
        '","MOB":"' +
        this.state.MobileNo +
        '","DEVICE_ID":"' +
        this.props.DeviceId +
        '","SIMNO":"' +
        simid +
        '"}',
    };
    sendData(
      this,
      "post",
      APIUrlConstants.BASE_URL,
      Headers,
      JSON.stringify(Body),
      async (obj, response) => {

        let res = response.SUCCESS;
        if (res === "FALSE") {
          const ErrorMsg = response.RESULT;

          Snackbar.show({
            text: ErrorMsg,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "red",
          });
        } else if (res === "TRUE") {
          this.setState((prevState) => ({ OTPcount: prevState.OTPcount + 1 }));

          Snackbar.show({
            text: "OTP send Successfully",
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "green",
          });

          const OTP = response.OTP;
          const USER_ID = response.USER_ID;

          this.startTimer();

          this.setState({
            stus_MobileNo: false,
            stus_OTP: true,
            stus_ViewID: false,
            user_ID: USER_ID,
            user_OTP: OTP,
            title: "Enter OTP To Verify",
            ButtonTitle: "Verify",
          });
        }
      }
    );
  }

  bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg2;
  render() {
    return (
      <View style={styles.ViewFlexOne}>
        <ImageBackground
          style={styles.ViewFlexOne}
          source={this.bgImage}
          resizeMode="cover"
        >
          <KeyboardAvoidingView
              style={styles.CurveBackground}
              behavior={Platform.OS === "ios" ? "padding" : ""}
              enabled={true}
            >
            <TrasnsperantFixedHeader backAction={() => this.onBackAction()} />
            <View style={styles.ImageBG}>
              <Image source={assets.onSuccess} style={styles.SuccessImage} />
            </View>

            
              <View style={[styles.CurveView]}>

                <Text style={[styles.Text_Heading, { color: this.props.PrimaryColor },]}>
                  {this.state.title}
                </Text>

                {this.state.stus_MobileNo ? (
                  <Text
                    style={[styles.Note, { color: this.props.PrimaryColor }]}
                  >
                    Forget UserID ? Don't worry just verify your registered
                    mobile number and get the UserID.
                  </Text>
                ) : null}

                {/* Mobile number */}
                {this.state.stus_MobileNo ? (
                  <View style={styles.MobileNoBg}>
                    <TextInput
                      style={styles.TextInputStyle}
                      theme={{
                        colors: {
                          placeholder: "#DFE1E8",
                          text: this.props.textColor,
                          primary: this.props.SecondaryColor,
                          underlineColor: "transparent",
                          background: "white",
                        },
                        roundness: 8,
                      }}
                      label="Mobile No."
                      value={this.state.MobileNo}
                      maxLength={10}
                      keyboardType="numeric"
                      onChangeText={(MobileNo) => {
                        this.setState({ MobileNo: MobileNo.replace(/[^0-9]/g, "") });
                      }}
                      mode="outlined"
                    />

                    {this.state.MobNo_error !== "" && (<Text style={styles.ErrorDisplay}>{this.state.MobNo_error}</Text>)}

                  </View>
                ) : null}

                {/* UI-TAG OTP Input */}
                {this.state.stus_OTP ? (
                  <View style={styles.OTPInputStyle}>
                    <OtpInputs style={[styles.OTPInputStyleTwo, { color: this.props.PrimaryColor, }]}
                      handleChange={(code) => { this.setState({ otpInput: code }); }}
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
                ) : null}

                {/* Resend OTP */}
                {this.state.stus_OTP && this.state.OTPcount < 3 ? (

                  <View style={styles.ResendOTPViewStyle}>
                    {this.state.timer === "00" ? (
                      <TouchableOpacity onPress={() => this.ResendOTP()}>
                        <Text style={[styles.ResendOTPStyle, { color: this.props.PrimaryColor },]} >
                          Resend OTP
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text
                        style={[styles.ResendOTPStyle, { color: colors.Red, marginLeft: 5 },]} >
                        {"00." + this.state.timer}
                      </Text>
                    )}
                  </View>
                ) : null}

                {/* View User Id */}
                {this.state.stus_ViewID ? (
                  <View style={styles.BoxStyle}>
                    <Text style={[styles.ViewUserId, { color: this.props.textColor },]} >
                      {this.state.user_ID}
                    </Text>

                    <TouchableOpacity onPress={() => this.CopyUserId()}>
                      <CopyIcon
                        height={20}
                        width={20}
                        color={this.props.SecondaryColor} />
                    </TouchableOpacity>
                  </View>
                ) : null}


                {/* Submit Btn */}
                {!this.state.stus_OTP && (
                  <TouchableOpacity
                    style={[styles.SubmitButton, { backgroundColor: this.props.PrimaryColor },]}
                    onPress={() => { this.SubmitButton(); }}>
                    <Text style={{ color: colors.white }}> {this.state.ButtonTitle}</Text>
                  </TouchableOpacity>
                )}



                {this.state.stus_OTP && (
                  <CardView
                    cardElevation={this.state.otpInput.length == 6 ? 3 : 0}
                    cardMaxElevation={3}
                    cornerRadius={12}
                    style={styles.OTPCardViewStyle}>
                    <TouchableOpacity
                      style={[styles.ButtonTouchable, { backgroundColor: this.state.otpInput.length > 3 ? colors.btnColor : colors.btnDisable, },]}
                      disabled={this.state.otpInput.length > 3 ? false : true}
                      onPress={() => { this.SubmitButton(); }}>
                      <Text
                        style={[styles.SubmitBtnstyle, { color: this.state.otpInput.length > 3 ? colors.white : colors.btnDisableTextColor, }]} >
                        {this.state.ButtonTitle}
                      </Text>
                    </TouchableOpacity>
                  </CardView>
                )}

               
              </View>
           
          </KeyboardAvoidingView>
           <View style={styles.FooterStyle}>
                  <Footer height={70} width={300} />
                </View>
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
    justifyContent: "flex-end",
    flex: 1,
    flexWrap: "wrap",
  },
  CurveView: {
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flexDirection: "column",
    alignSelf: "center",
    justifyContent: "center",
  },
  Text_Heading: {
    width: width,
    fontSize: 22,
    textAlign: "center",
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
  Inputcontainer: {
    height: 45,
    width: 45,
    margin: 5,
    borderWidth: 1,
    marginTop: 30,
    justifyContent: "center",
    backgroundColor: colors.otpBackColor,
    borderColor: colors.otpBorderColor,
    borderRadius: 8,
  },
  Inputstyle: {
    fontSize: 15,
    textAlign: "center",
    color: Colors.textColorForOrange,
    fontWeight: "bold",
  },
  TextInputStyle: {
    lineHeight: 40,
    height: 48,
    justifyContent: "space-between",
    alignItems: "stretch",
    width: width - 50,
    marginTop: 20,
  },
  SubmitButton: {
    marginTop: 15,
    height: 52,
    width: width - 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
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

  InputsStyle: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "#1F3C66",
  },

  BoxStyle: {
    backgroundColor: "#EBEBEB",
    marginVertical: 30,
    borderRadius: 15,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
  },
  ResendOTPStyle: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: strings.fontMedium,
  },
  ButtonTouchable: {
    padding: 15,
    width: width - 40,
    backgroundColor: colors.btnColor,
    justifyContent: "center",
    borderRadius: 12,
  },
  SuccessImage: {
    height: 200,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  OTPInputStyle: {
    height: 60,
    width: width - 40,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  ViewUserId: {
    fontFamily: strings.fontMedium,
    marginRight: 15,
    fontSize: 26,
  },
  ImgBgSubViewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  ViewFlexOne: {
    flex: 1,
  },
  ImageBG: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  MobileNoBg: { justifyContent: "center", marginTop: 5 },

  OTPInputStyleTwo:
  {
    flexDirection: "row",
    justifyContent: "center",

  },
  ResendOTPViewStyle:
  {
    flexDirection: "row",
    justifyContent: "center"
  },

  OTPStatus:
  {
    backgroundColor: "white",
    justifyContent: "center",
    marginVertical: 10,
  },

  OTPCardViewStyle:
  {
    backgroundColor: "white",
    justifyContent: "center",
    marginVertical: 10,
  },
  SubmitBtnstyle:
  {
    alignSelf: "center",
    fontFamily: strings.fontRegular,
    fontSize: 15,
  },
  FooterStyle:
    { alignItems: "center", justifyContent: "flex-end" , backgroundColor:'white'},

  ErrorDisplay: { color: "#FF0000", marginLeft: 5, fontSize: 12 },
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgetUserId);
