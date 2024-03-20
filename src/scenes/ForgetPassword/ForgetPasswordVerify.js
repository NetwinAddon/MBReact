import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  Keyboard,
  BackHandler,
  ScrollView,
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
  constants,
  sendData,
} from "../../App";
import { TouchableOpacity } from "react-native-gesture-handler";
import TrasnsperantFixedHeader from "../../components/TrasnperantFixedHeader";
import APIUrlConstants from "../../common/APIUrlConstants";
import Colors from "../../common/Colors";
import { TextInput } from "react-native-paper";
import EyeOpen from "../../assets/icons/formIcons/ico-eye.svg";
import EyeSlash from "../../assets/icons/formIcons/ico-eye-slash.svg";
import MyValidator from "../../common/MyValidator";
import Constants from "../../common/Constants";
import Snackbar from "react-native-snackbar";

class ForgetPasswordVerify extends Component {
  constructor(props) {
    super(props);
    this.OTP = props.route.params.OTP;
    this.USERID = props.route.params.USERID;
    this.MobileNO = props.route.params.MobileNO;

    this.state = {
      mpin: "",
      confirmMpin: "",
      isSubmit: false,
      loginPass: "",
      confirmloginPass: "",
      isloginPass: true,
      isConfirmloginPass: true,
      isTransactionPin: true,
      transPass: "",
      confirmTransPass: "",
      loginPin_error: "",
      transactionPin_error: "",
      GMST_CODE: Constants.GMST_CODE,
    };

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() { }

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

  Confirm() {
    const result = this.ValidateForm();

    if (result) {
      this.VerifyOTPApi();
    }
  }

  ValidateForm() {
    var result = true;

    this.setState({ transactionPin_error: "", loginPin_error: "" });

    if (
      !MyValidator.isConfirmPassword(
        this.state.loginPass,
        this.state.confirmloginPass
      ).isValid
    ) {
      this.setState({
        loginPin_error: MyValidator.isConfirmPassword(
          this.state.loginPass,
          this.state.confirmloginPass
        ).Response,
      });

      result = false;
    }

    if (!MyValidator.isConfirmTrasactionPassword(this.state.transPass, this.state.confirmTransPass).isValid) {
      this.setState({
        transactionPin_error: MyValidator.isConfirmTrasactionPassword(
          this.state.transPass,
          this.state.confirmTransPass
        ).Response,
      });
      result = false;
    }

    return result;
  }

  VerifyOTPApi() {
    const simid = "00000000-05ec-ff6b-0000-00005659f38b";

    const Headers = APIUrlConstants.Headers("VERIOTP");

    const Body = {
      PARACNT: "1",
      PARA1_TYP: "STR",
      PARA1_VAL:
        '{"BNK_CODE":"' +
        constants.BankCode +
        '","REF_ID":"' +
        this.USERID +
        '","USR_ID":"' +
        this.USERID +
        '","LPIN":"' +
        this.state.confirmloginPass +
        '","TPIN":"' +
        this.state.confirmTransPass +
        '","OTP":"' +
        this.OTP +
        '","DEVICE_ID":"' +
        this.props.DeviceId +
        '","SIMNO":"' +
        simid +
        '","REG_MODE":"FORGOT","MOB":"' +
        this.MobileNo +
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

        var finalRes = JSON.stringify(responseData);

        console.log("VerifyOTPApi Response:- " + finalRes);

        if (response.SUCCESS === "FALSE") {
          navigation.replace(this, "RegistrationFail");
          Snackbar.show({
            text: "Failed !",
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "red",
          });
        } else {
          Snackbar.show({
            text: "Password Reset Successfully..!",
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "green",
          });

          this.props.setLoginPass(this.state.confirmloginPass);

          const GMST_CODE = this.props.gmstCode;

          if (
            GMST_CODE === null ||
            GMST_CODE === undefined ||
            GMST_CODE.trim() === ""
          ) {
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: "existingUserLogin" }],
            });
          } else {
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: "loginTypeSelectScreen" }],
            });
          }
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
          <View style={styles.ImageBG}>
            <TrasnsperantFixedHeader backAction={() => this.onBackAction()} />

            <View style={styles.BackgroundImageView}>
              <Image source={assets.onSuccess} style={styles.BackgroundImage} />
            </View>

            <KeyboardAvoidingView
              style={styles.CurveBackground}
              behavior={Platform.OS === "ios" ? "padding" : ""}
              enabled={true}
            >

              <View style={styles.CurveView}>

                <Text style={styles.Text_Heading}>Enter New Password</Text>

                <ScrollView
                  showsVerticalScrollIndicator={false}>

                  <View style ={{  marginTop: 10,}}>


                    <View style={styles.ViewBg}>
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
                        label="Login Password"
                        value={this.state.loginPass}
                        keyboardType="default"
                        onChangeText={(loginPass) => {
                          this.setState({ loginPass });
                        }}
                        mode="outlined"
                        // secureTextEntry={true}
                        placeholder="Login Password"
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          this.confirmLoginpass.focus();
                        }}
                        blurOnSubmit={false}
                      />
                    </View>

                    {/* Confirm Login Password */}
                    <View style={styles.ViewconfTrnsPassword}>
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
                        label="Confirm Login Password"
                        value={this.state.confirmloginPass}
                        keyboardType="default"
                        onChangeText={(confirmloginPass) => {
                          this.setState({ confirmloginPass });
                        }}
                        mode="outlined"
                        secureTextEntry={this.state.isConfirmloginPass}
                        right={
                          <TextInput.Icon
                            forceTextInputFocus={false}
                            onPress={() => {
                              this.setState({ isConfirmloginPass: !this.state.isConfirmloginPass, });
                              Keyboard.dismiss();
                            }}
                            icon={() => (
                              <View style={styles.TextInputIcon}>
                                {this.state.isConfirmloginPass ? (
                                  <EyeSlash height={20} width={20} color={"#000000"} />) :

                                  (<EyeOpen height={20} nwidth={20} color={"#000000"} />)}
                              </View>
                            )}
                          />
                        }
                        ref={(input) => { this.confirmLoginpass = input; }}
                        placeholder="Confirm Login Password"
                        returnKeyType="next"
                        onSubmitEditing={() => { this.transactionpass.focus(); }}
                        blurOnSubmit={false} />

                      {this.state.loginPin_error !== "" && (<Text style={styles.ErrorDisplay}> {this.state.loginPin_error} </Text>)}

                    </View>

                    {/* Transaction Password */}
                    <View style={styles.TrnsPassViewBG}>
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
                        label="Transaction Pin"
                        value={this.state.transPass}
                        keyboardType="default"
                        onChangeText={(transPass) => {
                          this.setState({ transPass });
                        }}
                        mode="outlined"
                        ref={(input) => { this.transactionpass = input; }}
                        // secureTextEntry={true}
                        placeholder="Transaction Pin"
                        returnKeyType="next"
                        onSubmitEditing={() => { this.Confirmtransactionpass.focus(); }}
                        blurOnSubmit={false}
                      />
                    </View>

                    {/*Confirm Transaction Password */}
                    <View style={styles.ViewconfTrnsPassword}>
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
                        label="Confirm Transaction Pin"
                        value={this.state.confirmTransPass}
                        keyboardType="default"
                        onChangeText={(confirmTransPass) => {
                          this.setState({ confirmTransPass });
                        }}
                        mode="outlined"
                        secureTextEntry={this.state.isTransactionPin}
                        right={
                          <TextInput.Icon
                            forceTextInputFocus={false}
                            onPress={() => {
                              this.setState({ isTransactionPin: !this.state.isTransactionPin, });
                              Keyboard.dismiss();
                            }}
                            icon={() => (
                              <View style={styles.TextInputIcon}>
                                {this.state.isTransactionPin ? (
                                  <EyeSlash height={20} width={20} color={"#000000"} />) :

                                  (<EyeOpen height={20} width={20} color={"#000000"} />)}
                              </View>
                            )}
                          />
                        }
                        ref={(input) => { this.Confirmtransactionpass = input; }}
                        placeholder="Confirm Transaction Pin"
                      />

                      {this.state.transactionPin_error !== "" && (<Text style={styles.ErrorDisplay}>{this.state.transactionPin_error} </Text>)}
                    </View>

                    {/* buttons */}
                    <TouchableOpacity
                      style={[styles.SubmitButton, { backgroundColor: this.props.PrimaryColor },]}
                      onPress={() => { this.Confirm(); }}>
                      <Text style={{ color: colors.white }}>Confirm</Text>
                    </TouchableOpacity>

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
    height: 250,
    width: 250,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  CurveBackground: {
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex: 1.5,
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
  TextInputStyle: {
    lineHeight: 40,
    height: 48,
    justifyContent: "space-between",
    alignItems: "stretch",
    width: width - 50,
  },

  TextInputTheme: {
    colors: {
      placeholder: "#DFE1E8",
      text: "#1F3C66",
      primary: "#FF5936",
      underlineColor: "transparent",
      background: "white",
    },
    roundness: 8,
  },

  SubmitButton: {
    marginTop: 15,
    height: 52,
    width: width - 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },

  ViewBg: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  
  },
  BackgroundImageView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  TextInputIcon: {
    height: 30,
    width: 30,
    marginTop: 10,
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
  ViewconfTrnsPassword: {
    justifyContent: "center",
  },
  TrnsPassViewBG:
    { alignItems: "center", justifyContent: "center" },

  ErrorDisplay: { color: "#FF0000", marginLeft: 5, fontSize: 12 },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgetPasswordVerify);
