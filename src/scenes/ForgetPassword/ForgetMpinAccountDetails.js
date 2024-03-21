import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Keyboard,
  StyleSheet,
  BackHandler,
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
  constants,
} from '../../App';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';
import TrasnsperantFixedHeader from '../../components/TrasnperantFixedHeader';
import APIUrlConstants from '../../common/APIUrlConstants';
import Colors from '../../common/Colors';
import { TextInput } from 'react-native-paper';
import OtpInputs from 'react-native-otp-inputs';
import Constants from '../../common/Constants';
import Snackbar from 'react-native-snackbar';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import MyValidator from '../../common/MyValidator';
import Arrowdown from '../../assets/icons/dashboardIcons/arrow_down.svg'
import { selectAccount } from '../../components/CustomDialog';
import { _toEncrypt, decryptData, sendData } from '../../common/util';


class ForgetMpinAccountDetails extends Component {

  constructor(props) {
    super(props);

    this.accData = [
      { label: 'Savings Account', value: 'Saving' },
      { label: 'Loan Account', value: 'Loan' },
      { label: 'Current Account', value: 'Current' },

    ];


    this.verifyData = [
      { label: 'Pan card Number', value: 'PAN Number' },
      { label: 'Aadhar card Number', value: 'Adhar Number' },
    ]

    this.state = {

      isVerify: false,
      isModalVisible: false,
      accType: this.accData.length > 0 ? this.accData[0].label : '',
      verifyType: this.verifyData[0].label,

      AccType_Key: this.accData.length > 0 ? this.accData[0].value : '',
      VerifType_key: this.verifyData[0].value,
      labelText: '',

      otpInput: '',

      accon: '',
      mobile: '',
      panOrAadharLable: 'PAN Number',
      panOrAadharNo: '',
      selectedDate: '',

      Accno_error: '',
      Dob_error: '',
      MobNo_error: '',
      PanAdhar_error: '',


      mpin: '',
      confirmMpin: '',

      USERID: '',
      SECRETKEY: '',

      stus_AccountDetails: true,
      stus_OTP: false,
      stus_Mpin: false,

      VisibleNewUserId: true,
      VisibleConfiUserId: true,

      ImageFlex: 1,
      Title: 'Reset MPIN',


      timer: 45,
      OTPcount: 0,


    }

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);



  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

    clearInterval(this.timerInterval);

  }


  startTimer = () => {
    this.timerInterval = setInterval(this.updateTimer, 1000);
  };

  updateTimer = () => {
    this.setState((prevState) => ({
      timer: prevState.timer - 1,
    }), () => {
      if (this.state.timer === 0) {
        clearInterval(this.timerInterval);
        this.setState({ timer: "00" })
      }
    });
  };



  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }


  onBackAction() {
    navigation.goBack(this)
  }


  onBackAction() {
    navigation.goBack(this)
  }

  onSelectAccount = (value, key) => {

    this.setState({ isModalVisible: false, accType: value, AccType_Key: key })

  }

  onSelectVerify = (value, key) => {

    this.setState({ isVerify: false, verifyType: value, VerifType_key: key, panOrAadharLable: value == "Pan card Number" ? "PAN Number" : "Aadhar Number" })

  }

  _onDateSelected = (selDate) => {
    this.setState({ selectedDate: selDate, showDatePicker: false })

  }

  _hideDatePicker = () => {
    this.setState({ showDatePicker: false });
  };


  ValidateForm() {

    var result = true;

    this.setState({ Accno_error: '', Dob_error: '', MobNo_error: '', PanAdhar_error: '' });

    if (!MyValidator.isValidIndianMobile(this.state.mobile).isValid) {
      this.setState({ MobNo_error: MyValidator.isValidIndianMobile(this.state.mobile).Response });
      result = false;
    }

    if (!MyValidator.isNumberOnlyPresent(this.state.accon).isValid) {
      this.setState({ Accno_error: MyValidator.isNumberOnlyPresent(this.state.accon).Response });
      result = false;
    }

    if (!MyValidator.isEmptyField(this.state.accon).isValid) {
      this.setState({ Accno_error: MyValidator.isEmptyField('').Response });
      result = false;
    }

    if (!MyValidator.isValidDate(this.state.selectedDate).isValid) {
      this.setState({ Dob_error: MyValidator.isEmptyField('').Response });
      result = false;
    }

    if (this.state.verifyType === 'Aadhar card Number') {
      if (!MyValidator.isValidAadharCard(this.state.panOrAadharNo).isValid) {
        this.setState({ PanAdhar_error: MyValidator.isValidAadharCard(this.state.panOrAadharNo).Response });
        result = false;
      }
    }

    if (this.state.verifyType === 'Pan card Number') {

      if (!MyValidator.isValidPanCard(this.state.panOrAadharNo).isValid) {
        this.setState({ PanAdhar_error: MyValidator.isValidPanCard(this.state.panOrAadharNo).Response });
        result = false;
      }

    }
    return result;
  };



  Submit() {
    const result = this.ValidateForm();

    if (result) {

      this.ForgetMpin()

    }

  }

  VerifyOTP() {

    const Headers = APIUrlConstants.Headers("REGUSERONLINE");

    const Body =
    {
      PARACNT: "1",
      PARA1_TYP: "STR",
      PARA1_VAL: "{\"CALLFROM\":\"OTP_VERIFY\",\"GMST_CODE\":\"" + this.state.USERID + "\",\"OTP\":\"" + this.state.otpInput + "\",\"BNK_CODE\":\"" + Constants.BankCode + "\"}"
    }

    sendData(this,
      'post',
      APIUrlConstants.BASE_URL,
      Headers,
      JSON.stringify(Body),
      async (obj, response) => {
        var responseData = response

        let res = response.SUCCESS
        if (res === "FALSE") {

          const ErrorMsg = response.RESULT
          Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
        }
        else if (res === "TRUE") {

          const Msg = response.RESULT
          Snackbar.show({ text: Msg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green' });

          this.setState({ SECRETKEY: response.SK, stus_AccountDetails: false, stus_OTP: false, stus_Mpin: true, Title: "Enter your MPIN", ImageFlex: 1.2 })
        }

      })

  }


  MpinChangeApi = async () => {

    // this.props.navigation.reset({index: 0,routes: [{ name: 'loginTypeSelectScreen' }],});

    const Headers = APIUrlConstants.Headers("CALLAPI");

    const jsonReq =
    {
      customerId: this.state.USERID,
      branchCd: Constants.BRANCH_CODE,
      secKey: Constants.SecretKey,
      divId: this.props.DeviceId,
      MPIN: this.state.confirmMpin,
      BANK_CODE: Constants.BankCode

    }
    let jsonValue = await _toEncrypt(JSON.stringify(jsonReq))

    const Body =
    {
      PARACNT: "2",
      PARA1_TYP: "STR",
      PARA1_VAL: 'setMPIN',
      PARA2_TYP: "STR",
      PARA2_VAL: jsonValue,
    }
    sendData(this,
      'post',
      APIUrlConstants.BASE_URL,
      Headers,
      JSON.stringify(Body),
      async (obj, response) => {

        var responseData = await decryptData(response)
        var newRes = responseData.slice(16)
        var finalRes = JSON.parse(newRes)


        if (finalRes.SUCCESS === "FALSE") {

          const ErrorMsg = finalRes.RESULT
          Snackbar.show({
            text: ErrorMsg,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: 'red'
          });

        }
        else {

          const Msg = finalRes.RESULT
          Snackbar.show({
            text: Msg,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: 'green'
          });

          const GMST_CODE = this.props.gmstCode
          console.log("Forget change GMST_CODE" + GMST_CODE)

          if (GMST_CODE === null || GMST_CODE === undefined || GMST_CODE.trim() === "") {
            this.props.navigation.reset({ index: 0, routes: [{ name: 'existingUserLogin' }],  });
          } else {
            navigation.navigate(this, 'mainLogin', { from: 'Dashboard' })
          }


        }

      })
  }


  ForgetMpin() {

    const Headers = APIUrlConstants.Headers("REGUSERONLINE");

    const Body =
    {
      PARACNT: "1",
      PARA1_TYP: "STR",
      PARA1_VAL: "{\"BNK_CODE\":\"" + constants.BankCode + "\",\"ACC_NO\":\"" + this.state.accon + "\",\"ADHAR_PAN\":\"" + this.state.panOrAadharNo + "\",\"MOB\":\"" + this.state.mobile + "\",\"DOB\":\"" + moment(this.state.selectedDate).format("DD-MMM-YYYY") + "\",\"KYC_TYPE\":\"" + this.state.VerifType_key + "\",\"ACC_TYPE\":\"" + this.state.AccType_Key + "\",\"OPR_TYPE\":\"FORGOT_MPIN\"}"
    }


    sendData(this,
      'post',
      APIUrlConstants.BASE_URL,
      Headers,
      JSON.stringify(Body),
      async (obj, response) => {
        var responseData = response

        let res = response.SUCCESS
        if (res === "FALSE") {


          const ErrorMsg = response.RESULT

          if (ErrorMsg == null) {
            Snackbar.show({ text: "INVALID USER!!", duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });

          }
          else {
            Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });

          }



        }
        else if (res === "TRUE") {
          this.state.USERID = response.USERID

          this.setState((prevState) => ({ OTPcount: prevState.OTPcount + 1 }))


          if (this.state.OTPcount > 1) {

            Snackbar.show({ text: 'OTP Resend Successfully..!', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green' });
            clearInterval(this.timerInterval);
            this.setState({ timer: 45 }, this.startTimer);
          }
          else {

            Snackbar.show({ text: 'OTP Send Successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green' });

            this.setState({ stus_AccountDetails: false, stus_OTP: true, stus_Mpin: false, Title: "Verify OTP", ImageFlex: 1.2 })

            this.startTimer();
          }



        }

      })

  }


  ResendOTP() {
    this.ForgetMpin();
  }

  bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg2

  render() {
    return (
      <View style={styles.ViewFlexOne}>

        <ImageBackground style={styles.ViewFlexOne}
          source={this.bgImage}
          resizeMode='cover'>


          <View style={[styles.TrasnsperantFixedHeaderView, { flex: this.state.ImageFlex, }]}>

            <TrasnsperantFixedHeader
              backAction={() => this.onBackAction()}
            />

            <View style={styles.ImageViewBG}>
              <Image
                source={assets.onSuccess}
                style={styles.ImageBG}
              />
            </View>

          </View>

          <View style={styles.FlexTwo}>

            <KeyboardAvoidingView
              style={styles.CurveBackground}
              behavior={Platform.OS === 'ios' ? 'padding' : ''}
              enabled={true}>

              <View style={[styles.CurveView,]} >

                <Text style={[styles.Text_Heading, { color: this.props.PrimaryColor, }]}>{this.state.Title}</Text>

                <ScrollView>

                  {this.state.stus_AccountDetails &&

                    <View>

                      <View style={[styles.InputBoxDesign, { marginTop: 15 }]}>

                        <TouchableOpacity
                          style={styles.DropDownTouchableStyle}
                          onPress={() => this.setState({ isModalVisible: true, labelText: ' Account Type' })}
                        >

                          <View style={styles.DropDownIconDirection}>

                            <Text style={styles.SmallText}>Account Type </Text>

                            <Text style={styles.TextStyle}>{this.state.accType}</Text>

                          </View>

                          <View style={styles.DropDownIconStyle} >
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
                      <View style={styles.TextInputViewStyle} >
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
                          label="Account number"
                          value={this.state.accon}
                          keyboardType='numeric'
                          onChangeText={accon => {
                            this.setState({ accon: accon.replace(/[^0-9]/g, '') });
                          }}
                          mode='outlined'
                          placeholder='Account number'
                          returnKeyType='next'
                          onSubmitEditing={() => { this.mobileno.focus(); }}
                          blurOnSubmit={false}
                        />

                        {this.state.Accno_error !== '' && (<Text style={styles.ErrorDisplay}>{this.state.Accno_error}</Text>)}

                      </View>


                      {/* DOB */}

                      <View style={styles.DropDownIconDirection}>

                        <View style={styles.InputBoxDesign}>

                          <TouchableOpacity
                            onPress={() => this.setState({ showDatePicker: true })}>
                            {this.state.selectedDate ?
                              <Text style={{ fontSize: 15, paddingLeft: 15, color: this.props.textColor }}> {moment(this.state.selectedDate).format("DD/MM/YYYY")} </Text>
                              :
                              <Text style={{ fontSize: 15, paddingLeft: 15, color: '#DFE1E8' }}>Date of Birth</Text>
                            }
                          </TouchableOpacity>

                        </View>

                        {this.state.Dob_error !== '' && (<Text style={styles.ErrorDisplay}>{this.state.Dob_error}</Text>)}

                      </View>

                      {/* Mobile number */}
                      <View style={styles.TextInputViewStyle}>
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
                          label="Mobile No."
                          value={this.state.mobile}
                          maxLength={10}
                          keyboardType='numeric'
                          onChangeText={mobile => {
                            this.setState({ mobile });
                          }}
                          mode='outlined'
                          ref={(input) => { this.mobileno = input; }}

                          placeholder='Mobile No.'
                          returnKeyType='next'
                          onSubmitEditing={() => { this.aadharPan.focus(); }}
                          blurOnSubmit={false}
                        />

                        {this.state.MobNo_error !== '' && (<Text style={styles.ErrorDisplay}>{this.state.MobNo_error}</Text>)}


                      </View>


                      {/* Verify */}
                      <View style={styles.InputBoxDesign}>

                        <TouchableOpacity
                          style={styles.DropDownTouchableStyle}
                          onPress={() => this.setState({ isVerify: true, labelText: 'Verify' })}
                        >

                          <View style={styles.DropDownIconDirection}>

                            <Text style={styles.SmallText}>Verify</Text>

                            <Text style={styles.TextStyle}>{this.state.verifyType}</Text>

                          </View>

                          <View style={styles.DropDownIconStyle} >
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
                      <View style={styles.TextInputViewStyle}>
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
                          label={this.state.panOrAadharLable}
                          value={this.state.panOrAadharNo}
                          keyboardType='default'
                          autoCapitalize="characters"
                          maxLength={this.state.panOrAadharLable == "PAN Number" ? 10 : 12}
                          onChangeText={panOrAadharNo => {
                            this.setState({ panOrAadharNo });
                          }}
                          mode='outlined'
                          ref={(input) => { this.aadharPan = input; }}
                          placeholder={this.state.panOrAadharLable}
                        />

                        {this.state.PanAdhar_error !== '' && (<Text style={styles.ErrorDisplay}>{this.state.PanAdhar_error}</Text>)}


                      </View>


                      {/* buttons */}
                      <TouchableOpacity
                        style={[styles.SubmitButton, { backgroundColor: this.props.PrimaryColor, marginBottom: 35, }]}
                        onPress={() => { this.Submit() }}>
                        <Text style={{ color: colors.white }}>Submit</Text>
                      </TouchableOpacity>

                    </View>

                  }

                  {this.state.stus_OTP &&

                    <View>

                      <OtpInputs
                        style={styles.OTPInputStyle}
                        handleChange={(code) => {this.setState({ otpInput: code }) }}
                        numberOfInputs={6}
                        inputContainerStyles={styles.InputContainer}
                        focusStyles={{ borderColor: this.props.SecondaryColor, }}
                        keyboardType="numeric"
                        inputStyles={[styles.InputsStyle, { color: this.props.PrimaryColor, }]}
                        selectionColor={this.props.SecondaryColor}
                        secureTextEntry={true}
                        autofillFromClipboard={false}
                      />

                      {this.state.OTPcount < 3 ? (

                        <View style={styles.SubmitBtnStyle}>

                          {this.state.timer === "00" ?

                            <TouchableOpacity
                              onPress={() => this.ResendOTP()}>

                              <Text style={[styles.ResendOTPStyle, { color: this.props.PrimaryColor }]}>Resend OTP</Text>
                            </TouchableOpacity>
                            :
                            <Text style={[styles.ResendOTPStyle, { color: colors.Red, marginLeft: 5 }]}>{'00.' + this.state.timer}</Text>
                          }


                        </View>

                      ) : null
                      }


                      <CardView
                        cardElevation={this.state.otpInput.length == 6 ? 3 : 0}
                        cardMaxElevation={3}
                        cornerRadius={12}
                        style={styles.SubmitBtnStyle}>

                        <TouchableOpacity
                          style={[styles.ButtonTouchable, { backgroundColor: this.state.otpInput.length > 3 ? colors.btnColor : colors.btnDisable }]}
                          disabled={this.state.otpInput.length > 3 ? false : true}
                          onPress={() => { this.VerifyOTP() }}

                        ><Text style={{
                          alignSelf: 'center',
                          color: this.state.otpInput.length > 3 ? colors.white : colors.btnDisableTextColor,
                          fontFamily: strings.fontRegular,
                          fontSize: 15
                        }}>
                            {strings.submit}
                          </Text>
                        </TouchableOpacity>
                      </CardView>

                    </View>


                  }



                  {this.state.stus_Mpin &&

                    <View>


                      <View style={styles.ViewBg}>

                        <OtpInputs
                         style={styles.OTPInputStyleTwo}
                          handleChange={(code) => {
                            this.setState({ mpin: code, isSubmit: (this.state.confirmMpin == code && this.state.confirmMpin != "") ? true : false })
                          }}
                          keyboardType="numeric" // This allows only numbers
                          numberOfInputs={4}
                          inputContainerStyles={styles.Inputcontainer}
                          focusStyles={{ borderColor: this.props.SecondaryColor, }}
                          inputStyles={styles.Inputstyle}
                          selectionColor={this.props.SecondaryColor}
                          secureTextEntry={true}
                          autofillFromClipboard={false}
                        />

                      </View>

                      <Text style={[styles.Text_Heading, { color: this.props.PrimaryColor, }]}>{strings.confMpin}</Text>


                      <View
                        pointerEvents={this.state.mpin.length >= 4 ? "auto" : "none"}
                        style={styles.ViewBg}>

                        <OtpInputs
                          style={styles.OTPInputStyleTwo}
                          handleChange={(value) => {
                            this.setState({ isSubmit: this.state.mpin == value ? true : false, confirmMpin: value })
                          }}
                          numberOfInputs={4}
                          keyboardType="numeric"
                          inputContainerStyles={styles.Inputcontainer}
                          focusStyles={{ borderColor: this.props.SecondaryColor, }}
                          inputStyles={styles.Inputstyle}
                          selectionColor={this.props.SecondaryColor}
                          secureTextEntry={true}
                          autofillFromClipboard={false}
                        />
                      </View>


                      <CardView
                        cardElevation={this.state.isSubmit == true ? 3 : 0}
                        cardMaxElevation={3}
                        cornerRadius={12}
                        style={[styles.Cardstyle]}
                      >
                        <TouchableOpacity
                          style={[styles.ButtonTouchable, { backgroundColor: this.state.isSubmit == true ? this.props.PrimaryColor : colors.btnDisable, }]}
                          disabled={this.state.isSubmit == true ? false : true}
                          onPress={() => this.MpinChangeApi()}
                        >
                          <Text style={[styles.TextStyle, { color: this.state.isSubmit == true ? colors.white : colors.btnDisableTextColor }]}>
                            {strings.submit}
                          </Text>

                        </TouchableOpacity>
                      </CardView>


                    </View>

                  }

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
          display={Platform.OS === "ios" ? "inline" : "default"}
          timeZoneOffsetInMinutes={2 * 60}
        />


      </View>
    )
  }


}


const styles = StyleSheet.create({

  ButtonTouchable:
  {
    padding: 15,
    width: width - 40,
    backgroundColor: colors.btnColor,
    justifyContent: 'center',
    borderRadius: 12,
  },
  SubmitBtnStyle:
  {
    backgroundColor: 'white',
    justifyContent: 'center',
    marginVertical: 25,
  },
  CurveBackground:
  {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: 'flex-end',
    flex: 1, flexWrap: 'wrap',
  },
  Cardstyle:
  {
    backgroundColor: 'white',
    justifyContent: 'center',
    marginVertical: 10,
    marginBottom: 30,
    marginTop: 30,
    alignSelf: 'center'
  },
  CurveView:
  {
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  Text_Heading:
  {
    width: width,
    fontSize: 22,
    textAlign: 'center',
    fontFamily: strings.fontBold,
    marginTop: 20,
    marginBottom: 5,
  },

  InputBoxDesign: {
    height: 48,
    width: width - 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DFE1E8',
    marginTop: 10
  },

  SmallText:
  {
    color: '#464563',
    marginLeft: 15,
    fontSize: 10,
    fontFamily: strings.fontMedium
  },

  TextStyle:
  {
    color: colors.accTextColor,
    marginLeft: 15,
    fontSize: 15,
    fontFamily: strings.fontMedium,
    textAlign: 'center'
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
  Inputstyle:
  {
    fontSize: 15,
    textAlign: 'center',
    color: Colors.textColorForOrange,
    fontWeight: 'bold'
  },
  ViewBg:
  {
    height: 60,
    justifyContent: 'center',
    marginTop: 5,
  },
  TextInputStyle:
  {
    lineHeight: 40,
    height: 48,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: width - 50,
  },
  TextInputViewStyle:
  {
    justifyContent: 'center',
    marginTop: 5

  },

  SubmitButton:
  {
    marginTop: 15,
    height: 52,
    width: width - 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },

  InputContainer:
  {
    height: 45,
    width: 45,
    margin: 5,
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: colors.otpBackColor,
    borderColor: colors.otpBorderColor,
    borderRadius: 8,
  },

  InputsStyle:
  {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold'
  },

  ResendOTPStyle:
  {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: strings.fontMedium,
  },
  ImageBG:
  {
    height: 200,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  ViewFlexOne: {
    flex: 1,
  },
  OTPInputStyle:
  {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 5
  },
  OTPInputStyleTwo:
  {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  TrasnsperantFixedHeaderView:
  {
    justifyContent: 'center',
    alignItems: 'center'
  },

  ImageViewBG:
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },

  FlexTwo:
  {
    flex: 1.5,
  },
  DropDownTouchableStyle:
  {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  DropDownIconDirection:
  {
    flexDirection: 'column',
  },
  DropDownIconStyle:
  {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  

  ErrorDisplay: { color: "#FF0000", marginLeft: 5, fontSize: 12 }

})


export default connect(mapStateToProps, mapDispatchToProps)(ForgetMpinAccountDetails);