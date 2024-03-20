import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  ToastAndroid,
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
  sendData,
} from "../../App";
import Footer from "../../assets/icons/footer.svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import CardView from "react-native-cardview";
import FromTo from "../../assets/icons/FromAndTo.svg";
import OtpInputs from "react-native-otp-inputs";
import APIUrlConstants from "../../common/APIUrlConstants";
import Constants from "../../common/Constants";
import { TextInput } from "react-native-paper";
import EyeOpen from "../../assets/icons/formIcons/ico-eye.svg";
import EyeSlash from "../../assets/icons/formIcons/ico-eye-slash.svg";
import { _toEncrypt, decryptData } from "../../common/util";
import md5 from "md5";
import Snackbar from "react-native-snackbar";
import TrasnperantFixedHomeHeader from "../../components/TrasnperantFixedHomeHeader";
import NetInfo from "@react-native-community/netinfo";
import SwipeButton from "../../components/SwipeButton";
class TransactionOTPScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      otp: "",
      transPin: "",
      otp_length: "",
      isTransactionPin: true,
      callFrom: this.props.route.params.from,
      amount: this.props.route.params.amount,
      fromAcc: this.props.route.params.fromAcc,
      benificiaryAcc: this.props.route.params.toAcc,
      fromAccAcmastCode: this.props.route.params.fromAccAcmastCode,
      beneficiaryAccAcmastCode:
        this.props.route.params.beneficiaryAccAcmastCode,
      trnId: this.props.route.params.trnId,
      fromAccName: this.props.route.params.fromAccName,
      beneficiaryAccName: this.props.route.params.beneficiaryAccName,
      bBranchCode: this.props.route.params.bBranchCode,
      beneficiaryId: this.props.route.params.beneficiaryId,
      txnFor: this.props.route.params.txnFor,
      remark: this.props.route.params.remark,
      timer: 45,
      OTPcount: 0,
      chrg_amt: this.props.route.params.chrg_amt,
      neftTrnid: this.props.route.params.neftTrnid,
      trnscnId: this.props.route.params.trnscnId,
      errorCount:0
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
          this.setState({ timer: "00" });
        }
      }
    );
  };
  onBackAction() {
    navigation.goBack(this);
  }




  submitIMPSTxnApi = async () => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        let otpEncrypt = md5(this.state.otp.code);

        const Headers = APIUrlConstants.Headers('SETIMPSFTREQ');

        const jsonReq = {
          customerId: Constants.GMST_CODE,
          acMastCode: this.state.fromAccAcmastCode,
          acNo: this.state.fromAcc,
          bnfId: this.state.beneficiaryId,
          bnfBrCd: this.state.bBranchCode,
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
        console.log('jsonReqjsonReq ' + JSON.stringify(jsonReq));
        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));

        const Body = {
          PARACNT: '1',
          PARA1_TYP: 'STR',
          PARA1_VAL: jsonValue,
        };



        sendData(
          this,
          'post',
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            //var responseData = response
            var responseData = await decryptData(response);
            var newRes = responseData.slice(16);
            var finalRes = JSON.parse(newRes);
            // console.log("responseData SubmitOtpApi================", response)
            console.log('SubmitOtpApi Response:- ' + JSON.stringify(finalRes));
            if (finalRes.SUCCESS === 'FALSE') {
              const ErrorMsg = finalRes.RESULT;
              this.setState(prevState => ({ errorCount: prevState.errorCount + 1 }));
              if (this.state.errorCount === 3) {
                  Snackbar.show({
                      text: ErrorMsg,
                      duration: Snackbar.LENGTH_SHORT,
                      backgroundColor: 'red',
                      numberOfLines:3
                    });
                    navigation.navigate(this, 'bottomNavigator');
              }
              else{
                  Snackbar.show({
                      text: ErrorMsg + " " + "Attempts Left:-" + (Number(3) - Number(this.state.errorCount)),
                      duration: Snackbar.LENGTH_SHORT,
                      backgroundColor: 'red',
                      numberOfLines:3
                    });
              }
            } else if (finalRes.SUCCESS === 'TRUE') {
              this.setState({errorCount:0})
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

  submitNEFTTxnApi = async () => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        let otpEncrypt = md5(this.state.otp.code);

        const Headers = APIUrlConstants.Headers("SETNEFTFTREQ");

        const jsonReq = {
          customerId: Constants.GMST_CODE,
          acMastCode: this.state.fromAccAcmastCode,
          acNo: this.state.fromAcc,
          bnfId: this.state.beneficiaryId,
          bnfBrCd: this.state.bBranchCode,
          prtcls: this.state.remark,
          amt: this.state.amount,
          otp: otpEncrypt,
          trPin: this.state.transPin,
          bankCode: Constants.BankCode,
          secKey: Constants.SecretKey,
          neftTrnid: this.state.neftTrnid,
          branchCd: Constants.BRANCH_CODE,
          benAcc: this.state.benificiaryAcc,
          TRNSCNID: this.state.trnscnId,
        };

        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));

        const Body = {
          PARACNT: "1",
          PARA1_TYP: "STR",
          PARA1_VAL: JSON.stringify(jsonReq),
        };

        console.log(
          "SubmitOtpApi:------------------------ " + JSON.stringify(jsonReq)
        );

        sendData(
          this,
          "post",
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            // //var responseData = response
            // var responseData = await decryptData(response)
            // var newRes = responseData.slice(16)
            // var finalRes = JSON.parse(newRes)
            console.log("responseData SubmitOtpApi================", response);
            // console.log("SubmitOtpApi Response:- " + JSON.stringify(responseData));
            if (response.SUCCESS === "FALSE") {
              const ErrorMsg = response.RESULT;
            
              this.setState(prevState => ({ errorCount: prevState.errorCount + 1 }));
             
              if (this.state.errorCount === 3) {
                  Snackbar.show({
                      text: ErrorMsg,
                      duration: Snackbar.LENGTH_SHORT,
                      backgroundColor: 'red',
                      numberOfLines:3
                    });
                    navigation.navigate(this, 'bottomNavigator');
              }
              else{
                  Snackbar.show({
                      text: ErrorMsg + " " + "Attempts Left:-" + (Number(3) - Number(this.state.errorCount)),
                      duration: Snackbar.LENGTH_SHORT,
                      backgroundColor: 'red',
                      numberOfLines:3
                    });
              }
            } else if (response.SUCCESS === "TRUE") {
              this.setState({errorCount:0})
              console.log("refNo: ", response.RESULT);
              const result = response.RESULT;
              const match = result.match(/\b(\d+)\b/);
              const referenceNumber = match ? match[1] : null;
              // var refNo = result.split('SELF FT TRANSACTION SUCCESSFUL WITH REF NO');
              console.log("refNo: ", referenceNumber);
              // navigation.navigate(this, 'FundTransferSuccess', { from: this.state.callFrom, refNo: referenceNumber })
              navigation.navigate(this, "NeftTransferSuccess", {
                from: this.state.callFrom,
                refNo: referenceNumber,
              });
            }
          }
        );
      } catch (e) {
        console.log("Error: ", e);
      }
    } else {
      Snackbar.show({
        text: "Internet not avaialable",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
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

  submitOtherAccTxnApi = async () => {

    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers("SETFTREQ");
        const Body = {
          PARACNT: "11",
          PARA1_TYP: "STR",
          PARA1_VAL: Constants.GMST_CODE,
          PARA2_TYP: "STR",
          PARA2_VAL: this.state.fromAccAcmastCode,
          PARA3_TYP: "STR",
          PARA3_VAL: this.state.fromAcc,
          PARA4_TYP: "STR",
          PARA4_VAL: this.state.beneficiaryId + "#" + this.state.benificiaryAcc,
          PARA5_TYP: "STR",
          PARA5_VAL: this.state.bBranchCode,
          PARA6_TYP: "STR",
          PARA6_VAL: "MB FT " + this.state.remark,
          PARA7_TYP: "STR",
          PARA7_VAL: this.state.amount,
          PARA8_TYP: "STR",
          PARA8_VAL: this.state.otp.code,
          PARA9_TYP: "STR",
          PARA9_VAL: this.state.transPin,
          PARA10_TYP: "STR",
          PARA10_VAL: Constants.BankCode,
          PARA11_TYP: "STR",
          PARA11_VAL: Constants.SecretKey,
        };

        console.log("Beneficiary URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("Beneficiary Api:- " + JSON.stringify(Body));
        console.log("");

        sendData(
          this,
          "post",
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            var responseData = response;

            console.log(
              "Beneficiary Response:- " + JSON.stringify(responseData)
            );

            let res = response.SUCCESS;
            if (res === "FALSE") {
             
              const ErrorMsg = response.RESULT;
            
              this.setState(prevState => ({ errorCount: prevState.errorCount + 1 }));
             
              if (this.state.errorCount === 3) {
                  Snackbar.show({
                      text: ErrorMsg,
                      duration: Snackbar.LENGTH_SHORT,
                      backgroundColor: 'red',
                      numberOfLines:3
                    });
                    navigation.navigate(this, 'bottomNavigator');
              }
              else{
                  Snackbar.show({
                      text: ErrorMsg + " " + "Attempts Left:-" + (Number(3) - Number(this.state.errorCount)),
                      duration: Snackbar.LENGTH_SHORT,
                      backgroundColor: 'red',
                      numberOfLines:3
                    });
              }
              if (response.RESULT.includes('TRANSACTION AMOUNT EXCEEDS TRANSACTION AMOUNT LIMIT.')) {
                console.log("if")
                navigation.navigate(this, 'sameBankOtherAcc', {
                  from: this.state.callFrom,
                  accList: this.state.accList,
                  
                });

              }

            } else if (res === "TRUE") {
              this.setState({ errorCount: 0 });
              const transactionID =
                responseData["TRANSACTION ID"].split("-")[1];
              navigation.navigate(this, "fundTransferSameBankSuccess", {
                from: this.state.callFrom,
                refNo: transactionID,
              });
            }
          }
        );
      } catch (e) {
        console.log("Error: ", e);
      }
    } else {
      Snackbar.show({
        text: "Internet not avaialable",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };

  ResendOtherAccOTP = async () => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers("SNDFTOTP");
        const Body = {
          PARACNT: "4",
          PARA1_TYP: "STR",
          PARA1_VAL: Constants.UserId,
          PARA2_TYP: "STR",
          PARA2_VAL: Constants.GMST_CODE,
          PARA3_TYP: "STR",
          PARA3_VAL: Constants.BankCode,
          PARA4_TYP: "STR",
          PARA4_VAL: Constants.SecretKey,
        };

        console.log("GetOtp URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("GetOtp Api:- " + JSON.stringify(Body));
        console.log("");

        sendData(
          this,
          "post",
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            var responseData = response;

            console.log(
              "GetOtp Api Response:- " + JSON.stringify(responseData)
            );

            let res = response.SUCCESS;
            if (res === "FALSE") {
              // if(response.toLowerCase().includes('RESULT'))
              // {
                const ErrorMsg = response.RESULT;
                // ToastAndroid.show(ErrorMsg, ToastAndroid.SHORT)
                Snackbar.show({
                  text: ErrorMsg,
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: "red",
                  numberOfLines:3
                });
                // }
            } else if (res === "TRUE") {
              this.setState((prevState) => ({
                OTPcount: prevState.OTPcount + 1,
                errorCount:0
              }));
              Snackbar.show({
                text: "OTP Resend Successfully..!",
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "green",
              });
              clearInterval(this.timerInterval);
              this.setState({ timer: 45 }, this.startTimer);
            }
          }
        );
      } catch (e) {
        console.log("Error: ", e);
      }
    } else {
      Snackbar.show({
        text: "Internet not avaialable",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };

  submiSelfAccTxnApi = async () => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        let otpEncrypt = md5(this.state.otp.code);

        const Headers = APIUrlConstants.Headers("SNDSLFFTREQ");

        const Body = {
          PARACNT: "1",
          PARA1_TYP: "STR",
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
            '","neftTrnId":"' +
            this.state.trnId +
            '","Otp":"' +
            otpEncrypt +
            '","TrnPin":"' +
            this.state.transPin +
            '","benAcc":"' +
            this.state.benificiaryAcc +
            '","amt":"' +
            this.state.amount +
            '","debit_gl":"' +
            this.state.fromAccName +
            '","credit_gl":"' +
            this.state.beneficiaryAccName +
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
              this.setState(prevState => ({ errorCount: prevState.errorCount + 1 }));
              const ErrorMsg = response.RESULT;
              if (this.state.errorCount === 3) {
                  Snackbar.show({
                      text: ErrorMsg,
                      duration: Snackbar.LENGTH_SHORT,
                      backgroundColor: 'red',
                      numberOfLines:3
                    });
                    navigation.navigate(this, 'bottomNavigator');
              }
              else{
                  Snackbar.show({
                      text: ErrorMsg + " " + "Attempts Left:-" + (Number(3) - Number(this.state.errorCount)),
                      duration: Snackbar.LENGTH_SHORT,
                      backgroundColor: 'red',
                      numberOfLines:3
                    });
              }
            } else if (res === "TRUE") {
              //this.toSucess()
this.setState({errorCount : 0})
              const result = responseData.RESULT;
              const match = result.match(/\b(\d+)\b/);
              const referenceNumber = match ? match[1] : null;
              var refNo = result.split(
                "SELF FT TRANSACTION SUCCESSFUL WITH REF NO"
              );

              navigation.navigate(this, "fundTransferSucess", {
                from: this.state.callFrom,
                refNo: referenceNumber,
              });
            }
          }
        );
      } catch (e) { }
    } else {
      Snackbar.show({
        text: "Internet not avaialable",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };


  ResendIMPSOTP = async () => {
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

        console.log('ResendOtp URL:- ' + APIUrlConstants.BASE_URL);
        console.log('');
        console.log('ResendOtp:- ' + JSON.stringify(jsonReq));
        console.log('');

        sendData(this, 'post', APIUrlConstants.BASE_URL, Headers, Body, async (obj, response) => {
          console.log('responseData ResendOtp================', response);
          var responseData = response;
          var responseData = await decryptData(response);
          var newRes = responseData.slice(16);
          var finalRes = JSON.parse(newRes);
          console.log('responseData ResendOtp================', JSON.stringify(finalRes));
          //console.log("GetBeneficiaryList Response:- " + JSON.stringify(responseData));
          if (finalRes.SUCCESS === 'FALSE') {
            const ErrorMsg = finalRes.RESULT;
            Snackbar.show({
              text: ErrorMsg,
              duration: Snackbar.LENGTH_SHORT,
              numberOfLines:3
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

  ResendNEFTOTP = async () => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers("SNDNEFTFTOTP");

        const jsonReq = {
          customerId: Constants.GMST_CODE,
          branchCd: Constants.BRANCH_CODE,
          secKey: Constants.SecretKey,
          divId: this.props.DeviceId,
          bankCode: Constants.BankCode,
          neftTrnid: this.state.neftTrnid,
          TRNSCNID: this.state.trnscnId,
          NMODE: "4",
        };

        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));

        const Body = {
          PARACNT: "1",
          PARA1_TYP: "STR",
          PARA1_VAL: JSON.stringify(jsonReq),
        };

        console.log("ResendOtp URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("ResendOtp:- " + JSON.stringify(jsonReq));
        console.log("");

        sendData(
          this,
          "post",
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            var responseData = response;
            // var responseData = await decryptData(response)
            // var newRes = responseData.slice(16)
            // var finalRes = JSON.parse(newRes)
            console.log("responseData ResendOtp================", responseData);
            // console.log("GetBeneficiaryList Response:- " + response);
            if (responseData.SUCCESS === "FALSE") {
              const ErrorMsg = responseData.RESULT;
              Snackbar.show({
                text: ErrorMsg,
                duration: Snackbar.LENGTH_SHORT,
                numberOfLines:3
              });
            } else if (responseData.SUCCESS === "TRUE") {
              this.setState((prevState) => ({
                OTPcount: prevState.OTPcount + 1,
              }));
              Snackbar.show({
                text: "OTP Resend Successfully..!",
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "green",
              });
              clearInterval(this.timerInterval);
              this.setState({ timer: 45 }, this.startTimer);
            }
          }
        );
      } catch (e) {
        console.log("Error: ", e);
      }
    } else {
      Snackbar.show({
        text: "Internet not avaialable",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };

  ResendOTP = async () => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers("GETSLFFTOTP");
        const Body = {
          PARACNT: "1",
          PARA1_TYP: "STR",
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
            '","CALLFROM":"RESEND_OTP","NEFT_TRN_ID":"' +
            this.state.trnId +
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
                numberOfLines:3
              });
            } else if (res === "TRUE") {
              this.setState((prevState) => ({
                OTPcount: prevState.OTPcount + 1,
              }));
              Snackbar.show({
                text: "OTP Resend Successfully..!",
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "green",
              });
              clearInterval(this.timerInterval);
              this.setState({ timer: 45 }, this.startTimer);
            }
          }
        );
      } catch (e) { }
    } else {
      Snackbar.show({
        text: "Internet not avaialable",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };
  bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg;
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          style={{ flex: 1 }}
          source={this.bgImage}
          resizeMode="cover"
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : ""}
            // keyboardVerticalOffset={Platform.OS === 'ios' ? 89 : 0}
            enabled={true}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TrasnperantFixedHomeHeader
                backAction={() => this.onBackAction()}
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    marginBottom: 20,
                    width: width - 40,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      fontFamily: strings.fontBold,
                    }}
                  >
                    {this.state.txnFor === "OTHER"
                      ? "Other A/c Fund Transfer"
                      : this.state.txnFor === "NEFT"
                        ? "NEFT"
                        : this.state.txnFor === "IMPS"
                          ? "IMPS"
                          : "Within Bank Own A/C Transfer"}
                  </Text>

                  <Text
                    style={{
                      fontSize: 15,
                      color: "black",
                      fontFamily: strings.fontMedium,
                      color: colors.white,
                    }}
                  >
                    {this.state.txnFor === "OTHER"
                      ? "Other A/c Fund Transfer"
                      : this.state.txnFor === "NEFT"
                        ? "Fund Transfer"
                        : this.state.txnFor === "IMPS"
                          ? "Fund Transfer"
                          : "Self A/c Fund Transfer"}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                alignItems: "center",
                // justifyContent: 'flex-end',
                backgroundColor: "white",
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                flexDirection: "column",
                paddingBottom: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: width - 40,
                  marginTop: 30,
                }}
              >
                <View
                  style={{
                    flex: 0.1,
                    marginTop: 5,
                    // backgroundColor: 'green',
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FromTo height={125} />
                </View>
                <View
                  style={{
                    flex: 0.9,
                    // backgroundColor: 'gray'
                  }}
                >
                  {/* from Account */}
                  <View
                    style={{
                      // marginTop: 15,
                      height: 75,
                      // width: width - 50,
                      backgroundColor: colors.white,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 8,
                      borderWidth: 1, // comment to hide border
                      borderColor: "#DFE1E8",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: this.props.themeColor,
                            marginLeft: 15,
                            fontSize: 14,
                            fontFamily: strings.fontRegular,
                          }}
                        >
                          From A/c
                        </Text>

                        <Text
                          style={{
                            color: colors.accTextColor,
                            marginLeft: 15,
                            fontSize: 18,
                            fontFamily: strings.fontMedium,
                          }}
                        >
                          {this.state.fromAcc}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* to Account */}
                  <View
                    style={{
                      marginTop: 15,
                      height: 75,
                      // width: width - 50,
                      backgroundColor: colors.white,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 8,
                      borderWidth: 1, // comment to hide border
                      borderColor: "#DFE1E8",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: this.props.themeColor,
                            marginLeft: 15,
                            fontSize: 14,
                            fontFamily: strings.fontRegular,
                          }}
                        >
                          To A/c
                        </Text>

                        <Text
                          style={{
                            color: colors.accTextColor,
                            marginLeft: 15,
                            fontSize: 18,
                            fontFamily: strings.fontMedium,
                          }}
                        >
                          {this.state.benificiaryAcc}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* amount */}
              <View
                style={{
                  marginTop: 20,
                  height: 75,
                  width: width - 50,
                  backgroundColor: colors.white,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 8,
                  borderWidth: 1, // comment to hide border
                  borderColor: "#DFE1E8",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: this.props.themeColor,
                        marginLeft: 15,
                        fontSize: 14,
                        fontFamily: strings.fontRegular,
                      }}
                    >
                      Amount
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          color: "green",
                          marginLeft: 15,
                          fontSize: 18,
                          fontFamily: strings.fontMedium,
                        }}
                      >
                        ₹{this.state.amount}
                      </Text>
                      {this.state.txnFor === "NEFT" || this.state.txnFor === "IMPS" ? (
                        <Text
                          style={{
                            color: colors.accTextColor,
                            marginRight: 14,
                            fontSize: 15,
                            fontFamily: strings.fontMedium,
                            alignSelf: "center",
                            opacity: 0.5,
                          }}
                        >
                          +₹{Number(this.state.chrg_amt) + " Service Charge"}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>
              </View>
              {/* for otp */}
              <Text
                style={{
                  width: width - 50,
                  marginTop: 20,
                  fontSize: 25,
                  textAlign: "center",
                  fontFamily: strings.fontBold,
                  color: this.props.textColor,
                }}
              >
                {strings.enterOTP}
              </Text>

              <View
                style={{
                  height: 60,
                  width: width - 40,
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: 10,
                  // backgroundColor : 'red'
                }}
              >
                <OtpInputs
                  caretHidden={false} // cusrsor
                  handleChange={(code) => {
                    this.setState({
                      otp: { code: code.replace(/[^0-9]/g, "") },
                    });
                    this.setState({ otp_length: code });
                  }}
                  numberOfInputs={6}
                  keyboardType="numeric" // This allows only numbers
                  secureTextEntry={true}
                  inputContainerStyles={{
                    height: 45,
                    width: 45,
                    margin: 5,
                    borderWidth: 1,
                    justifyContent: "center",
                    // alignItems : 'center',
                    backgroundColor: colors.otpBackColor,
                    // backgroundColor : 'red',
                    borderColor: colors.otpBorderColor,
                    borderRadius: 8,
                  }}
                  focusStyles={{
                    borderColor: this.props.themeColor,
                  }}
                  inputStyles={{
                    fontSize: 15,
                    textAlign: "center",

                    color: this.props.textColor,
                  }}
                  selectionColor={this.props.themeColor}
                  autofillFromClipboard={false}
                />
              </View>
              {/* Resend OTP */}
              {this.state.OTPcount < 2 ? (
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  {this.state.timer === "00" ? (
                    <TouchableOpacity
                      onPress={() =>
                        this.state.txnFor === "OTHER"
                          ? this.ResendOtherAccOTP()
                          : this.state.txnFor === "NEFT"
                            ? this.ResendNEFTOTP()
                            : this.state.txnFor === "IMPS"
                              ? this.ResendIMPSOTP()
                              : this.ResendOTP()
                      }
                    >
                      <Text
                        style={[
                          styles.ResendOTPStyle,
                          { color: this.props.PrimaryColor },
                        ]}
                      >
                        Resend OTP
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text
                      style={[
                        styles.ResendOTPStyle,
                        { color: colors.Red, marginLeft: 5 },
                      ]}
                    >
                      {"00." + this.state.timer}
                    </Text>
                  )}
                </View>
              ) : null}
              <View
                style={{
                  marginTop: 10,
                  justifyContent: "center",
                }}
              >
                <TextInput
                  style={{
                    lineHeight: 40,
                    height: 48,
                    width: width - 50,
                  }}
                  theme={{
                    colors: {
                      placeholder: "#DFE1E8",
                      text: this.props.textColor,
                      primary: this.props.themeColor,
                      underlineColor: "transparent",
                    },
                    roundness: 8,
                  }}
                  label="Enter Transaction pin"
                  value={this.state.transPin}
                  keyboardType="default"
                  onChangeText={(transPin) => {
                    this.setState({ transPin: transPin });
                  }}
                  mode="outlined"
                  secureTextEntry={this.state.isTransactionPin}
                  right={
                    <TextInput.Icon
                      forceTextInputFocus={false}
                      onPress={() => {
                        this.setState({
                          isTransactionPin: !this.state.isTransactionPin,
                        });
                        Keyboard.dismiss();
                      }}
                      icon={() => (
                        <View
                          style={{
                            // backgroundColor: 'red',
                            height: 30,
                            width: 30,
                            marginTop: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {this.state.isTransactionPin ? (
                            <EyeSlash
                              height={20}
                              width={20}
                              color={"#000000"}
                            />
                          ) : (
                            <EyeOpen height={20} width={20} color={"#000000"} />
                          )}
                        </View>
                      )}
                    />
                  }
                  ref={(input) => {
                    this.Confirmtransactionpass = input;
                  }}
                  placeholder="Enter Transaction Password"
                />
              </View>

           
              <SwipeButton
                onPressAllow={() => {
                  this.state.txnFor === "OTHER"
                    ? this.submitOtherAccTxnApi()
                    : this.state.txnFor === "NEFT"
                      ? this.submitNEFTTxnApi()
                      : this.state.txnFor === "IMPS"
                        ? this.submitIMPSTxnApi()
                        : this.submiSelfAccTxnApi()
                }}
                // onPressNo={() => this.noThanks()}
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
  textInputContainer: {
    margin: 10,
    // backgroundColor : 'red',
  },
  roundedTextInput: {
    backgroundColor: "#F3F8FF",
    marginTop: 5,
    width: 45,
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
  },
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionOTPScreen);