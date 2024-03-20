import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  BackHandler,
} from "react-native";

import { TextInput } from "react-native-paper";

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
import TrasnsperantFixedHeader from "../../components/TrasnperantFixedHeader";
import APIUrlConstants from "../../common/APIUrlConstants";
import Colors from "../../common/Colors";
import Arrowdown from "../../assets/icons/dashboardIcons/arrow_down.svg";
import { selectAccount } from "../../components/CustomDialog";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import MyValidator from "../../common/MyValidator";
import Constants from "../../common/Constants";
import Snackbar from "react-native-snackbar";

class ForgetPassword extends Component {
  constructor(props) {
    super(props);

    this.accData = [
      { label: "Savings Account", value: "Saving" },
      { label: "Loan Account", value: "Loan" },
      { label: "Current Account", value: "Current" },
    ];

    this.verifyData = [
      { label: "Pan card Number", value: "PAN Number" },
      { label: "Aadhar card Number", value: "Adhar Number" },
    ];

    this.state = {
      isVerify: false,
      isModalVisible: false,
      accType: this.accData.length > 0 ? this.accData[0].label : "",
      verifyType: this.verifyData[0].label,

      AccType_Key: this.accData.length > 0 ? this.accData[0].value : "",
      VerifType_key: this.verifyData[0].value,
      labelText: "",

      accon: "",
      mobile: "",
      panOrAadharLable: "PAN Number",
      panOrAadharNo: "",
      selectedDate: "",

      Accno_error: "",
      Dob_error: "",
      MobNo_error: "",
      PanAdhar_error: "",
    };

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);


    const customThemeInputText = {
      colors: {
        placeholder: "#DFE1E8",
        text: this.props.textColor,
        primary: this.props.SecondaryColor,
        underlineColor: "transparent",
        background: "white",
      },
      roundness: 8,
    };


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

  onSelectAccount = (value, key) => {
    this.setState({ isModalVisible: false, accType: value, AccType_Key: key });
  };

  onSelectVerify = (value, key) => {
    this.setState({
      isVerify: false,
      verifyType: value,
      VerifType_key: key,
      panOrAadharLable:
        value == "Pan card Number" ? "PAN Number" : "Aadhar Number",
      panOrAadharNo: "",
    });
  };

  _onDateSelected = (selDate) => {
    this.setState({ selectedDate: selDate, showDatePicker: false });
  };

  _hideDatePicker = () => {
    this.setState({ showDatePicker: false });
  };

  Submit() {
    // navigation.replace(this, 'ForgetPasswordOTP', { USERID: '74746', MobileNO: this.state.mobile })

    const result = this.ValidateForm();

    if (result) {
      this.ForgetPasswordOTP();
    }
  }

  ForgetPasswordOTP() {
    const Headers = APIUrlConstants.Headers("REGUSERONLINE");

    const Body = {
      PARACNT: "1",
      PARA1_TYP: "STR",
      PARA1_VAL:
        '{"BNK_CODE":"' +
        Constants.BankCode +
        '","ACC_NO":"' +
        this.state.accon +
        '","ADHAR_PAN":"' +
        this.state.panOrAadharNo +
        '","MOB":"' +
        this.state.mobile +
        '","DOB":"' +
        moment(this.state.selectedDate).format("DD-MMM-YYYY") +
        '","KYC_TYPE":"' +
        this.state.VerifType_key +
        '","ACC_TYPE":"' +
        this.state.AccType_Key +
        '","OPR_TYPE":"FORGOT"}',
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

          if (ErrorMsg == null) {
            Snackbar.show({
              text: "INVALID USER!!",
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: "red",
            });
          } else {
            Snackbar.show({
              text: ErrorMsg,
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: "red",
            });
          }
        } else if (res === "TRUE") {
          const USERID = response.USERID;

          navigation.replace(this, "ForgetPasswordOTP", {
            USERID: USERID,
            MobileNO: this.state.mobile,
            AccountType: this.state.AccType_Key,
            DOB: moment(this.state.selectedDate).format("DD-MMM-YYYY"),
            ADHAR_PAN: this.state.panOrAadharNo,
            AccountNumber: this.state.accon,
            KYC_TYPE: this.state.VerifType_key,
          });
        }
      }
    );
  }

  ValidateForm() {
    var result = true;

    this.setState({
      Accno_error: "",
      Dob_error: "",
      MobNo_error: "",
      PanAdhar_error: "",
    });

    if (!MyValidator.isValidIndianMobile(this.state.mobile).isValid) {
      this.setState({
        MobNo_error: MyValidator.isValidIndianMobile(this.state.mobile)
          .Response,
      });
      result = false;
    }

    if (!MyValidator.isNumberOnlyPresent(this.state.accon).isValid) {
      this.setState({
        Accno_error: MyValidator.isNumberOnlyPresent(this.state.accon).Response,
      });
      result = false;
    }

    if (!MyValidator.isEmptyField(this.state.accon).isValid) {
      this.setState({ Accno_error: MyValidator.isEmptyField("").Response });
      result = false;
    }

    if (!MyValidator.isValidDate(this.state.selectedDate).isValid) {
      this.setState({ Dob_error: MyValidator.isEmptyField("").Response });
      result = false;
    }

    if (this.state.verifyType === "Aadhar card Number") {
      if (!MyValidator.isValidAadharCard(this.state.panOrAadharNo).isValid) {
        this.setState({
          PanAdhar_error: MyValidator.isValidAadharCard(
            this.state.panOrAadharNo
          ).Response,
        });
        result = false;
      }
    }

    if (this.state.verifyType === "Pan card Number") {
      if (!MyValidator.isValidPanCard(this.state.panOrAadharNo).isValid) {
        this.setState({
          PanAdhar_error: MyValidator.isValidPanCard(this.state.panOrAadharNo)
            .Response,
        });
        result = false;
      }
    }

    return result;
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
          <View style={styles.TransparentHeaderBg}>
            <TrasnsperantFixedHeader backAction={() => this.onBackAction()} />

            {/* Forget Pass Image */}
            <View style={styles.ImageStyleBG}>
              <Image source={assets.onSuccess} style={styles.BackgroundImage} />
            </View>

            <KeyboardAvoidingView
              style={styles.CurveBackground}
              behavior={Platform.OS === "ios" ? "padding" : ""}
              enabled={true}
            >
              <View style={styles.CurveView}>
                <Text style={styles.Text_Heading}>Forget Password</Text>

                <ScrollView>
                  <View>
                    {/* Acc Type */}
                    <View style={styles.InputBoxDesign}>
                      <TouchableOpacity
                        style={styles.ActypeTouchable}
                        onPress={() =>
                          this.setState({
                            isModalVisible: true,
                            labelText: " Account Type",
                          })
                        }
                      >
                        <View style={styles.AccounTypeDirection}>
                          <Text style={styles.SmallText}>Account Type </Text>

                          <Text style={styles.TextStyle}>
                            {this.state.accType}
                          </Text>
                        </View>

                        <View
                          style={styles.AccountTypeIcon}
                        >
                          <Arrowdown height={15} width={15} />
                        </View>
                      </TouchableOpacity>
                      {selectAccount(
                        this.state.isModalVisible,
                        this.accData,
                        this.onSelectAccount,
                        this.state.labelText,
                        this.state.accType,
                        "ListTypeDesign"
                      )}
                    </View>

                    {/* Account No */}
                    <View style={styles.InputBoxViewStyle}>

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
                        label="Account number"
                        value={this.state.accon}
                        keyboardType="numeric"
                        onChangeText={(accon) => {
                          this.setState({
                            accon: accon.replace(/[^0-9]/g, ""),
                          });
                        }}
                        mode="outlined"
                        maxLength={20}
                        placeholder="Account number"
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          this.mobileno.focus();
                        }}
                        blurOnSubmit={false}
                      />

                      {this.state.Accno_error !== "" && (
                        <Text style={styles.ErrorDisplay}>
                          {this.state.Accno_error}
                        </Text>
                      )}
                    </View>

                    {/* DOB */}

                    <View>
                      <View style={styles.InputBoxDesign}>
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({ showDatePicker: true })
                          }
                        >
                          {this.state.selectedDate ? (
                            <Text
                              style={[styles.DateTextStyle,  { color: this.props.textColor }, ]} >
                              {" "}{moment(this.state.selectedDate).format("DD/MM/YYYY")}{" "}
                            </Text>
                          ) : (
                            <Text
                              style={[
                                styles.DateTextStyle,
                                { color: "#DFE1E8" },
                              ]}
                            >
                              Date of Birth
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>

                      {this.state.Dob_error !== "" && (
                        <Text style={styles.ErrorDisplay}>
                          {this.state.Dob_error}</Text>
                      )}
                    </View>

                    {/* Mobile number */}
                    <View style={styles.InputBoxViewStyle}>
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
                        value={this.state.mobile}
                        maxLength={10}
                        keyboardType="numeric"
                        onChangeText={(mobile) => {
                          this.setState({
                            mobile: mobile.replace(/[^0-9]/g, ""),
                          });
                        }}
                        mode="outlined"
                        ref={(input) => {
                          this.mobileno = input;
                        }}
                        placeholder="Mobile No."
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          this.aadharPan.focus();
                        }}
                        blurOnSubmit={false}
                      />

                      {this.state.MobNo_error !== "" && (
                        <Text style={styles.ErrorDisplay}>
                          {this.state.MobNo_error}
                        </Text>
                      )}
                    </View>

                    {/* Verify */}
                    <View style={styles.InputBoxDesign}>
                      <TouchableOpacity
                        style={styles.ActypeTouchable}
                        onPress={() =>
                          this.setState({ isVerify: true, labelText: "Verify" })
                        }
                      >
                        <View style={styles.AccounTypeDirection}>
                          <Text style={styles.SmallText}>Verify</Text>

                          <Text style={styles.TextStyle}>
                            {this.state.verifyType}
                          </Text>
                        </View>

                        <View
                          style={styles.AccountTypeIcon}
                        >
                          <Arrowdown height={15} width={15} />
                        </View>
                      </TouchableOpacity>
                      {selectAccount(
                        this.state.isVerify,
                        this.verifyData,
                        this.onSelectVerify,
                        this.state.labelText,
                        this.state.verifyType,
                        "ListTypeDesign"
                      )}
                    </View>

                    {/* Pan/AdharNo */}
                    <View style={styles.InputBoxViewStyle}>
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
                        label={this.state.panOrAadharLable}
                        value={this.state.panOrAadharNo}
                        keyboardType={
                          this.state.panOrAadharLable == "PAN Number"
                            ? "default"
                            : "numeric"
                        }
                        autoCapitalize="characters"
                        maxLength={
                          this.state.panOrAadharLable == "PAN Number" ? 10 : 12
                        }
                        onChangeText={(text) => {
                          this.setState({
                            panOrAadharNo: text.replace(/[^A-Z0-9]/g, ""),
                          });
                        }}
                        mode="outlined"
                        ref={(input) => {
                          this.aadharPan = input;
                        }}
                        placeholder={this.state.panOrAadharLable}
                      />
                      {this.state.PanAdhar_error !== "" && (
                        <Text style={styles.ErrorDisplay}>
                          {this.state.PanAdhar_error}
                        </Text>
                      )}
                    </View>
                    {/* buttons */}
                    <TouchableOpacity
                      style={[
                        styles.SubmitButton,
                        { backgroundColor: this.props.PrimaryColor },
                      ]}
                      onPress={() => {
                        this.Submit();
                      }}
                    >
                      <Text style={{ color: colors.white }}>Submit</Text>

                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </View>
        </ImageBackground>
        <RenderLoader />
        <DateTimePickerModal
          isVisible={this.state.showDatePicker}
          mode="date"
          date={new Date()}
          isDarkModeEnabled={false}
          themeVariant={"light"}
          onConfirm={this._onDateSelected}
          onCancel={this._hideDatePicker}
          // minimumDate={new Date()}
          display={Platform.OS === "ios" ? "inline" : "default"}
          timeZoneOffsetInMinutes={2 * 60}
        />
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
  ImageStyleBG: { flex: 1, justifyContent: "center", alignItems: "center" },
  ViewFlexOne: {
    flex: 1,
  },
  TransparentHeaderBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  CurveBackground: {
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex: 3,
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
    marginBottom: 20,
    fontSize: 22,
    textAlign: "center",
    fontFamily: strings.fontBold,
    color: Colors.boldTextColor,
  },
  InputBoxDesign: {
    height: 48,
    width: width - 50,
    backgroundColor: colors.white,
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DFE1E8",
    marginTop: 10
  },

  ActypeTouchable:
  {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  SmallText: {
    color: "#464563",
    marginLeft: 15,
    fontSize: 10,
    fontFamily: strings.fontMedium,
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
    marginBottom: 20,
  },
  DateTextStyle: {
    fontSize: 15,
    paddingLeft: 15,
  },

  ErrorDisplay: { color: "#FF0000", marginLeft: 5, fontSize: 12 },

  AccounTypeDirection:
    { flexDirection: "column" },

  AccountTypeIcon:
  {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },

  InputBoxViewStyle:
  {
    justifyContent: "center",
    marginTop: 5
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword);
