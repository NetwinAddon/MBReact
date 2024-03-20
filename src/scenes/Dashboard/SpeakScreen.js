import React, { Component } from "react";
import Voice from "@react-native-voice/voice";
import {
  Text,
  View,
  FlatList,
  BackHandler,
  PermissionsAndroid,
  Alert,
  Button,
  Image,
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import Modal from "react-native-modal";
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";

// import { initReactI18next } from "react-i18next";

import {
  colors,
  strings,
  connect,
  mapStateToProps,
  mapDispatchToProps,
  width,
  navigation,
  sendData,
  RenderLoader,
} from "../../App";
import CardView from "react-native-cardview";
import Arrowdown from "../../assets/icons/dashboardIcons/arrow_down.svg";
import { RFValue } from "react-native-responsive-fontsize";
import FixedHeader from "../../components/FixedHeader";
import { request, PERMISSIONS, check, RESULTS } from "react-native-permissions";
import Constants from "../../common/Constants";
import APIUrlConstants from "../../common/APIUrlConstants";
import Snackbar from "react-native-snackbar";
import { SpeakCommandPopup } from "../../components/SpeakCommandPopup";
import { BeneficiaryCustomPopupDropDown } from "../../components/BeneficiaryCustomPopupDropDown";
import LanguageIcon from "../../assets/icons/language-icon.svg";
import MicrophoneIcon from "../../assets/icons/render-mike-icon.svg";
import CircleIcon from "../../assets/icons/angle-circle-right.svg";
import { _toEncrypt, decryptData } from "../../common/util";
import { DialogYesNoModal } from "../../components/DialogYesNoModal";

class SpeakScreen extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    var userData = props.route.params.customData;
    this.DashboardAcc = [];
    this.dynamicDegrees = [];
    this.CommandList = [
      {
        label: "Self 5000 Rupees to Current Account for (Purpose)",
        value: "1",
      },
      { label: "Self 5000 Rupees to Saving Account for (Purpose)", value: "2" },

      {
        label:
          "Self 5000 Rupees to Current Account Ending with 1234 (last 4 digit) for (Purpose)",
        value: "4",
      },
      {
        label:
          "Self 5000 Rupees to Saving Account Ending with 1234 (last 4 digit) for (Purpose)",
        value: "5",
      },
    ];

    this.LanguageList = [
      { LangName: "English", LangCode: "en" },
      { LangName: "मराठी", LangCode: "mr" },
      { LangName: "हिन्दी", LangCode: "hi" },
      { LangName: "ગુજરાતી", LangCode: "gu" },
      { LangName: "ಕನ್ನಡ", LangCode: "kn" },
    ];

    this.state = {
      isYesNoModalVisible: false,
      Selected_CommandType: "",
      CommandType: "",
      Selected_Command: "",
      Selected_Language: this.LanguageList[0].LangName,
      isOkModalVisible: false,
      // isFromGoogle: false,
      isBeneficiaryModalVisible: false,
      isLanguageModalVisible: false,
      UserName: userData.NAME,
      colors: [],
      recognized: "",
      error: "",
      end: "",
      netchrg_amt: "0.0",
      chrg_amt: "0.0",
      rtgs_chrg_rq: "0",
      multipleBeneList: "",
      accounList: props.route.params.dashboardArray,
      MicrophoneAction: true,
      isVoiceAssistanceActive: false,
      DashboardAcc: [],
      totalAmount: 0,
      colors: [],
      dlyLmt: "",
      ftTrnLmt: "0",
      usedLmt: "",
      myTempData: [],
      ACNO: "",
      amount: "",
      remark: "",
      bBranchCode: "",
      benificiaryAcc: "",
      beneficiaryAccAcmastCode: "",
      neftDayend: "0",
      imps_chrg_rq: "",
      NEFT_DLY_FLAG: "N",
      NEFT_DLY_LMT: "",
      NEFT_USED_LMT: "0",
      NEFT_TRN_LMT: "0",
      BeneficiaryMobNum: "",
      availableBalance: "0.0",
      beneficiaryAccName: "",
      ForMoreCommand: false,
      MoreCommand: this.CommandList[0].label,
      isClick: "",
      beneficiaryId: "",
      waveAnimations: [
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
      ],
      // language: "en",

      CommandData: [
        {
          key: "1",
          rightText: "Account Statement",
          leftText: "Statement 1 January 2024 to 1 June 2024",
        },
        {
          key: "2",
          rightText: "Self Transfer",
          leftText: this.CommandList[0].label,
          onPress: () => {
            this.setState({
              ForMoreCommand: true,
              labelText: "Speak Commands",
              selectedOption: this.CommandList[0].label,
            });
          },
        },
        {
          key: "3",
          rightText: "Other Bank A/c Transfer",
          leftText: "OTHER 5000 Rupees to Rupesh Patil for (Purpose)",
        },
        {
          key: "4",
          rightText: "NEFT Fund Transfer",
          leftText: "NEFT 5000 Rupees to Rupesh Patil for (Purpose)",
        },
        {
          key: "5",
          rightText: "IMPS Fund Transfer",
          leftText: "IMPS 5000 Rupees to Rupesh Patil for (Purpose)",
        },
      ],
    };

    this.translations = {
      en: {
        hello: "Hello",
        goodbye: "Goodbye",
      },
      hi: {
        hello: "नमस्ते",
        goodbye: "अलविदा",
      },
      mr: {
        hello: "नमस्कार",
        goodbye: "आबाद",
      },
    };
    this.accDetails = props.route.params;

    this.SavingAccList = [];

    Voice.onSpeechRecognized = this.onSpeechRecognized;
    // Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    this.shwoingData = [];
    this.beneshowingData = [];

    let userAccArray = userData.Acdtls;
    console.log("HomeScreen UserAccList", userAccArray);
    this.state.obj = this;

    if (userAccArray.length > 0) {
      userAccArray.map((item) => {
        this.DashboardAcc.push(JSON.parse(item));
      });
      this.state.SelectedeAccountList = this.DashboardAcc[0];
    }

    this.DashboardAcc.forEach((element) => {
      if (
        element.ACTYPE === "CURRENT ACCOUNT" ||
        element.ACTYPE === "SAVING ACCOUNT"
      ) {
        console.log("In");
        this.state.totalAmount =
          this.state.totalAmount + Math.abs(element.BALANCE);
      }
    });

    this.DashboardAcc.forEach((element) => {
      if (
        element.ACTYPE === "CURRENT ACCOUNT" ||
        element.ACTYPE === "SAVING ACCOUNT"
      ) {
        const existing = this.state.myTempData.find(
          (e) => e.ACTYPE == element.ACTYPE
        );
        if (existing) {
          existing.time += element.BALANCE;
        } else {
          this.state.myTempData.push({
            BALANCE: element.BALANCE,
            ACTYPE: element.ACTYPE,
          });
        }
      }
      return null;
    });
  }
  toggleModalYesNoDialog = () => {
    this.setState({ isYesNoModalVisible: false });
  };

  ConfirmRequest = () => {
    this.setState({ isYesNoModalVisible: false });
    if (this.state.NEFT_DLY_FLAG === "Y") {
      const amt = parseFloat(this.state.amount);
      const totalAmt =
        parseFloat(amt) +
        parseFloat(this.state.NEFT_USED_LMT) +
        parseFloat(this.state.chrg_amt);
      if (
        parseFloat(parseFloat(totalAmt) > parseFloat(this.state.NEFT_DLY_LMT))
      ) {
        if (
          parseFloat(this.state.NEFT_DLY_LMT) === 0 ||
          parseFloat(this.state.NEFT_DLY_LMT) === 0.0
        ) {
          this.getNEFTCharges();
        } else {
          this.setState({ isOkModalVisible: true });
          this.props.setOkDialogText(
            "NEFT daily limit exceded for day. Try with lesser amount or visit your branch for transaction"
          );
        }
      } else {
        this.getNEFTCharges();
      }
    }
  };

  ConfirmIMPSRequest = () => {
    this.setState({ isYesNoModalVisible: false });

    if (
      Constants.IS_IMPSFAST === "1" &&
      this.state.benificiaryAcc != this.state.benificiaryAcc
    ) {
      this.setState({ isOkModalVisible: true });
      this.props.setOkDialogText("Confirm Beneficiary is not match");
    } else {
      if (
        parseFloat(this.state.imps_chrg_rq) == 1 &&
        Number(this.state.chrg_amt) + Number(this.state.netchrg_amt) <= 0
      ) {
        Snackbar.show({
          text: "Charges amount not defined, Please contact your branch",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "red",
        });
      }

      if (this.state.NEFT_DLY_FLAG === "Y") {
        const amt = parseFloat(this.state.amount);

        const totalAmt =
          parseFloat(amt) +
          parseFloat(this.state.NEFT_USED_LMT) +
          parseFloat(this.state.chrg_amt);

        //  if (parseFloat(totalAmt) > parseFloat(this.state.NEFT_DLY_LMT))
        if (parseFloat(totalAmt) > parseFloat(this.state.NEFT_DLY_LMT)) {
          if (
            parseFloat(this.state.NEFT_DLY_LMT) === 0 ||
            parseFloat(this.state.NEFT_DLY_LMT) === 0.0
          ) {
            this.getIMPSCharges();
          } else {
            this.setState({ isOkModalVisible: true });
            this.props.setOkDialogText(
              "IMPS daily limit exceded for day. Try with lesser amount or visit your branch for transaction"
            );
          }
        } else {
          this.getIMPSCharges();
        }
      }
    }
  };

  getIMPSOTP = async () => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers("SNDIMPSFTOTP");

        const jsonReq = {
          customerId: Constants.GMST_CODE,
          acMastCode: Constants.Selected_ACMASTCODE,
          acNo: Constants.Selected_AC_NO,
          branchCd: Constants.BRANCH_CODE,
          secKey: Constants.SecretKey,
          divId: this.props.DeviceId,
          Benf001: this.state.beneficiaryId,
          Amount: this.state.amount,
          Prtcls: this.state.remark,
          bankCode: Constants.BankCode,
          chrgAmt: this.state.chrg_amt,
          chrgNetAmt: this.state.netchrg_amt,
          Benf008: this.state.benificiaryAcc,
          DEVICE_LATTIDUTE: "",
          DEVICE_LONGITUDE: "",
          DEVICE_LOCAL_IP: "",
          DEVICE_PUBLIC_IP: "",
          DEVICE_ISP_OPERATOR: "",
          SIMNO: "00000000-05ec-ff6b-0000-00005659f38b",
        };

        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));

        const Body = {
          PARACNT: "1",
          PARA1_TYP: "STR",
          PARA1_VAL: jsonValue,
        };

        console.log("SubmitApi URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("SubmitApi:- " + JSON.stringify(jsonReq));
        console.log("");

        sendData(
          this,
          "post",
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            //var responseData = response
            var responseData = await decryptData(response);
            var newRes = responseData.slice(16);
            var finalRes = JSON.parse(newRes);
            console.log(
              "responseData SubmitApi================",
              JSON.stringify(finalRes)
            );
            //console.log("GetBeneficiaryList Response:- " + JSON.stringify(responseData));
            if (finalRes.Acdtls != null && finalRes.Acdtls != "") {
              let res = finalRes.Acdtls;
              let mainArry = [];
              mainArry = res.map((jsonStr) => JSON.parse(jsonStr));
              Snackbar.show({
                text: mainArry[0].MSGDESCR,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red",
              });
            } else {
              if (finalRes.SUCCESS === "FALSE") {
                const ErrorMsg = finalRes.RESULT;
                Snackbar.show({
                  text: ErrorMsg,
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: "red",
                });
              } else if (finalRes.SUCCESS === "TRUE") {
                Snackbar.show({
                  text: "OTP Successfully Sent to Your Registered Mobile Number",
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: "green",
                });
                navigation.navigate(this, "transactionOTPScreen", {
                  from: "Dashboard",
                  txnFor: "IMPS",
                  fromAcc: Constants.Selected_AC_NO,
                  toAcc: this.state.benificiaryAcc,
                  remark: this.state.remark,
                  amount: this.state.amount,
                  fromAccAcmastCode: Constants.Selected_ACMASTCODE,
                  beneficiaryAccAcmastCode: this.state.beneficiaryAccAcmastCode,
                  fromAccName: Constants.Selected_AC_NAME,
                  beneficiaryAccName: this.state.beneficiaryAccName,
                  beneficiaryId: this.state.beneficiaryId,
                  chrg_amt: this.state.chrg_amt,
                  netchrg_amt: this.state.netchrg_amt,
                  bBranchCode: this.state.bBranchCode,
                  neftTrnid: finalRes.NEFT_TRN_ID,
                  trnscnId: finalRes.TRNSCNID,
                });
              }
            }
          }
        );
      } catch (e) {
        console.log("Error: ", e);
      }
    } else {
      Snackbar.show({
        text: "Check Internet Connection",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };
  // translate = (key) => {
  //   return this.translations[this.state.language][key];
  // };
  checkInternetConnection = async () => {
    try {
      const state = await NetInfo.fetch();

      const isConnected = state.isConnected;
      // console.log("Internet status:", isConnected);

      return isConnected;
    } catch (error) {
      console.error("Error checking internet connection:", error);
      return false;
    }
  };

  toggleModalOkDialog = () => {
    this.setState({ isOkModalVisible: false });
  };

  onBackArrow = () => {
    navigation.goBack(this);
  };
  onSelectDebitAccount = (value) => {
    console.log("value----------------------" + value);
    if (value === null || value === undefined || value.trim() === "") {
      this.setState({
        ForMoreCommand: false,
      });
    } else {
      const updatedCommandData = this.state.CommandData.map((item) => {
        if (item.key === "2") {
          return {
            ...item,
            leftText: value,
          };
        }
        return item;
      });

      this.setState({
        ForMoreCommand: false,
        MoreCommand: value,
        CommandData: updatedCommandData,
      });
    }
  };

  onSelectLanguage = (value) => {
    console.log("valuevaluevalue=====" + value);
    if (value === null || value === undefined || value.trim() === "") {
      this.setState({
        isLanguageModalVisible: false,
      });
    } else {
      this.setState({
        isLanguageModalVisible: false,
        Selected_Language: value,
      });
    }
  };




  componentDidMount() {
    // const translatedString = this.translate("hello");

    this.props.navigation.addListener("focus", () => {
      this.stopWaveAnimation(),
        this.setState({
          Selected_Language: this.LanguageList[0].LangName,
          MicrophoneAction: true,
          isVoiceAssistanceActive: false,
          recognized: "",
          Selected_CommandType: "",
          Selected_Command: "",
        });
    });
    this.setState({ accounList: this.DashboardAcc });
  }


  GetOTHBeneficiaryList = async (accType, acmastcode, BeneficiaryName) => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected)
      try {
        const Headers = APIUrlConstants.Headers("GETFNDTRLIST");
        const Body = {
          PARACNT: '6',
          PARA1_TYP: 'STR',
          PARA1_VAL: Constants.GMST_CODE,
          PARA2_TYP: 'STR',
          PARA2_VAL: accType,
          PARA3_TYP: 'STR',
          PARA3_VAL: acmastcode,
          PARA4_TYP: 'STR',
          PARA4_VAL: Constants.BRANCH_CODE,
          PARA5_TYP: 'STR',
          PARA5_VAL: Constants.BankCode,
          PARA6_TYP: 'STR',
          PARA6_VAL: Constants.SecretKey,
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
              this.setState({ isClick: "", benificiaryAccTitle: "" });

              const ErrorMsg = response.RESULT;
              // ToastAndroid.show(ErrorMsg, ToastAndroid.SHORT)
              Snackbar.show({
                text: ErrorMsg,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red",
              });
              // }
            } else if (res === "TRUE") {
              this.setState({ isClick: "", benificiaryAccTitle: "" });
              this.setState({
                dlyLmt: responseData.FND_DLY_LMT,
                usedLmt: responseData.FND_USED_LMT,
              });
              const acdtlsArray = responseData.Acdtls.map((item) =>
                JSON.parse(item.replace(/\\/g, ""))
              );

              console.log("acdtlsArray:--- ", JSON.stringify(acdtlsArray));

              const filteredData = acdtlsArray.filter((item) => {
                const lowerCaseName = item.NAME.toLowerCase();
                console.log('lowerCaseName======' + lowerCaseName + '   ' + BeneficiaryName.toLowerCase())
                return lowerCaseName.includes(BeneficiaryName.toLowerCase());
              });

              console.log("filteredData:--- ", JSON.stringify(filteredData));

              if (filteredData.length > 0) {
                if (filteredData.length === 1) {
                  if (
                    parseFloat(this.state.amount) >
                    parseFloat(filteredData[0].FT_TRN_LMT)
                  ) {
                    this.setState({ isOkModalVisible: true });
                    this.props.setOkDialogText(
                      "Amount should not be greater than transaction limit please contact to your brance, your transaction limit is " +
                      responseData.FT_TRN_LMT
                    );
                  } else if (
                    parseFloat(this.state.amount) +
                    parseFloat(this.state.usedLmt) >
                    parseFloat(this.state.dlyLmt)
                  ) {
                    this.setState({ isOkModalVisible: true });
                    this.props.setOkDialogText(
                      "Sorry, we cant proceed your transaction because you are exceeding your daily limit for fund transfer, Please contact to your branch."
                    );
                  } else {
                    this.setState({
                      beneficiaryAccAcmastCode: filteredData[0].BACMASTCODE,
                      bBranchCode: filteredData[0].BBRANCHCODE,
                      benificiaryAcc: filteredData[0].BAC_NO,
                      beneficiaryId: filteredData[0].BNFID,
                    });
                    this.getOTHAccOTP();
                  }
                } else {
                  this.setState({
                    multipleBeneList: filteredData,
                    isBeneficiaryModalVisible: true,
                  });
                  Snackbar.show({
                    text: "Multiple Beneficiary Found! Please Select Your Beneficiary",
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: "green",
                  });
                }
              } else {
                Snackbar.show({
                  text:
                    "Beneficiary not found for " +
                    BeneficiaryName +
                    " Please Add your Beneficiary",
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: "red",
                });
              }
            }
          }
        );
      } catch (e) {
        console.log("Error: ", e);
      }
    else {
      Snackbar.show({
        text: "Check Internet Connection",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };
  toggleModal = () => {
    this.setState({ isBeneficiaryModalVisible: false });
  };
  GetBeneficiaryList = async (
    fromAcc,
    acmastcode,
    AccType,
    AccLastFourDigit
  ) => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers("GETSLFFTBENF");
        const Body = {
          PARACNT: "1",
          PARA1_TYP: "STR",
          PARA1_VAL:
            '{"customerId":"' +
            Constants.GMST_CODE +
            '","secKey":"' +
            Constants.SecretKey +
            '","acNo":"' +
            fromAcc +
            '","acMastCode":"' +
            acmastcode +
            '","branchCd":"' +
            Constants.BRANCH_CODE +
            '","bankCd":"' +
            Constants.BankCode +
            '"}',
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
              "GetBeneficiaryList Response:- " + JSON.stringify(responseData)
            );

            let res = response.SUCCESS;
            if (res === "FALSE") {
              const ErrorMsg = response.RESULT;
              Snackbar.show({
                text: ErrorMsg,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red",
              });
              // }
            } else if (res === "TRUE") {
              const personData = [];
              const formattedData = [];
              this.setState({
                ftTrnLmt: responseData.FT_TRN_LMT,
                dlyLmt: responseData.FND_DLY_LMT,
                usedLmt: responseData.FND_USED_LMT,
              });
              // this.state.beneficiaryList.push(responseData)
              console.log(
                "responseData.FT_TRN_LMT:- " + responseData.FT_TRN_LMT
              );
              const acdtlsArray = responseData.Acdtls.map((item) =>
                JSON.parse(item.replace(/\\/g, ""))
              );
              console.log("AccType " + AccType);

              const filteredObjects = acdtlsArray.filter((item) => {
                const lowerCaseName = item.AC_NAME.toLowerCase();
                console.log("lowerCaseName=== " + lowerCaseName);
                return lowerCaseName.includes(AccType.toLowerCase());
              });

              if (
                parseFloat(this.state.amount) >
                parseFloat(responseData.FT_TRN_LMT)
              ) {
                this.setState({ isOkModalVisible: true });
                this.props.setOkDialogText(
                  "Amount should not be greater than transaction limit please contact to your brance, your transaction limit is " +
                  responseData.FT_TRN_LMT
                );
              } else if (
                parseFloat(this.state.amount) + parseFloat(this.state.usedLmt) >
                parseFloat(this.state.dlyLmt)
              ) {
                this.setState({ isOkModalVisible: true });
                this.props.setOkDialogText(
                  "Sorry, we cant proceed your transaction because you are exceeding your daily limit for fund transfer, Please contact to your branch."
                );
              } else {
                
                if (AccLastFourDigit === "") {
                  if (filteredObjects.length !== 0) {
                    if (filteredObjects.length === 1) {
                      this.setState({
                        beneficiaryAccAcmastCode:
                          filteredObjects[0].BACMASTCODE,
                        bBranchCode: filteredObjects[0].BBRANCHCODE,
                        benificiaryAcc: filteredObjects[0].BAC_NO,
                        beneficiaryAccName: filteredObjects[0].AC_NAME,
                      });

                      this.GetOtpApi();
                    } else {
                      Snackbar.show({
                        text: "Multiple beneficiaries found! Provide last 4 digits of Beneficiary Account number in your command",
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: "orange",
                      });
                    }
                  } else {
                    Snackbar.show({
                      text: "Beneficiary Not Found for This account Type",
                      duration: Snackbar.LENGTH_SHORT,
                      backgroundColor: "red",
                    });
                  }
                } else {
                  console.log('filteredObjects=='+JSON.stringify(filteredObjects))
                  const matchingObject = filteredObjects.find((item) =>
                  {
                    item.BAC_NO.endsWith(AccLastFourDigit)
                    console.log('item.BAC_NO=='+item.BAC_NO)
                  }
                  );
                  console.log('matchingObject=='+matchingObject)
                  if (matchingObject) {
                    console.log("matchingObject  --:", matchingObject);
                    this.setState({
                      beneficiaryAccAcmastCode: matchingObject.BACMASTCODE,
                      bBranchCode: matchingObject.BBRANCHCODE,
                      benificiaryAcc: matchingObject.BAC_NO,
                      beneficiaryAccName: matchingObject.AC_NAME,
                    });

                    this.GetOtpApi();
                  } else {
                    Snackbar.show({
                      text: "Beneficiary Not Found for This Account Number",
                      duration: Snackbar.LENGTH_SHORT,
                      backgroundColor: "red",
                    });
                  }
                }
              }
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

  GetOTHAllowableBalance = async (
    fromAcc,
    acmastcode,
    BeneficiaryName,
    CommandType
  ) => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers("GETALLBAL");

        const Body = {
          PARACNT: "1",
          PARA1_TYP: "STR",
          PARA1_VAL:
            '{"ACMASTCODE":"' + acmastcode + '","AC_NO":"' + fromAcc + '"}',
        };

        sendData(
          this,
          "post",
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            var responseData = response;

            console.log(
              "GetAllowableBalance:- " + JSON.stringify(responseData)
            );

            let res = response.SUCCESS;
            if (res === "FALSE") {
              const ErrorMsg = response.RESULT;
              Snackbar.show({
                text: ErrorMsg,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red",
              });
              this.setState({ availableBalance: "0.0" });
            } else if (res === "TRUE") {
              this.setState({
                availableBalance: response["ALLOWABLE BALANCE"],
              });
              if (
                parseFloat(response["ALLOWABLE BALANCE"]) <
                parseFloat(this.state.amount)
              ) {
                Snackbar.show({
                  text: "Insufficient Allowable Balance",
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: "orange",
                });
              } else {
                if (CommandType === "other") {
                  this.GetOTHBeneficiaryList(
                    Constants.Selected_AC_NO,
                    Constants.Selected_ACMASTCODE,
                    BeneficiaryName
                  );
                } else if (CommandType === "neft") {
                  this.getNEFTBeneficiaryList(
                    Constants.Selected_AC_NO,
                    Constants.Selected_ACMASTCODE,
                    BeneficiaryName
                  );
                } else {
                  this.getIMPSBeneficiaryList(
                    Constants.Selected_AC_NO,
                    Constants.Selected_ACMASTCODE,
                    BeneficiaryName
                  );
                }
              }
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

  getIMPSBeneficiaryList = async (acNo, acmastcode, BeneficiaryName) => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers("GETIMPSBNFLIST");
        const jsonReq = {
          customerId: Constants.GMST_CODE,
          acMastCode: acmastcode,
          acNo: acNo,
          branchCd: Constants.BRANCH_CODE,
          secKey: Constants.SecretKey,
          divId: this.props.DeviceId,
        };

        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));

        const Body = {
          PARACNT: "1",
          PARA1_TYP: "STR",
          PARA1_VAL: jsonValue,
        };

        console.log("GetBeneficiaryList URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("GetBeneficiaryList:- " + JSON.stringify(jsonReq));
        console.log("");

        sendData(
          this,
          "post",
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            //var responseData = response
            var responseData = await decryptData(response);
            var newRes = responseData.slice(16);
            var finalRes = JSON.parse(newRes);
            console.log(
              "finalRes ================================================================" +
              JSON.stringify(finalRes)
            );
            //console.log("GetBeneficiaryList Response:- " + JSON.stringify(responseData));
            if (finalRes.SUCCESS === "FALSE") {
              const ErrorMsg = finalRes.RESULT;
              this.setState({
                myJsonArrayforBeneficiaryList: [],
                filteredData: [],
                isClick: "",
                benificiaryAccTitle: "",
              });
              // }
            } else if (finalRes.SUCCESS === "TRUE") {
              this.setState({
                myJsonArrayforBeneficiaryList: acdtlsArray,
                filteredData: acdtlsArray,
                isClick: "",
                benificiaryAccTitle: "",
              });

              if ("IMPS_DLY_LMT" in finalRes) {
                console.log(
                  "IMPS_DLY_LMTIMPS_DLY_LMTIMPS_DLY_LMTIMPS_DLY_LMT  " +
                  finalRes.IMPS_DLY_LMT
                );
                this.setState({
                  NEFT_DLY_FLAG: "Y",
                  NEFT_DLY_LMT: finalRes.IMPS_DLY_LMT,
                });
              } else {
                this.setState({ NEFT_DLY_FLAG: "N" });
              }
              if ("IMPS_USED_LMT" in finalRes) {
                this.setState({
                  NEFT_DLY_FLAG: "Y",
                  NEFT_USED_LMT: finalRes.IMPS_USED_LMT,
                });
              } else {
                this.setState({ NEFT_DLY_FLAG: "N" });
              }
              if ("IMPS_TRN_LMT" in finalRes) {
                console.log("IF");
                this.setState({ IMPS_TRN_LMT: finalRes.IMPS_TRN_LMT });
              } else {
                console.log("Else");
                this.setState({ IMPS_TRN_LMT: "0" });
              }
              const acdtlsArray = finalRes.Acdtls.map((item) =>
                JSON.parse(item.replace(/\\/g, ""))
              );
              console.log("IMPS_TRN_LMT: ", finalRes.IMPS_TRN_LMT);
              // this.setState({
              //   myJsonArrayforBeneficiaryList: acdtlsArray,
              //   filteredData: acdtlsArray,
              // });
              // console.log("acdtlsArray:--- ", JSON.stringify(response));

              const filteredData = acdtlsArray.filter((item) => {
                const lowerCaseName = item.BENF009.toLowerCase();
                return lowerCaseName.includes(BeneficiaryName.toLowerCase());
              });

              console.log("filteredData:--- ", JSON.stringify(filteredData));
              if (filteredData.length > 0) {
                if (filteredData.length === 1) {
                  if (
                    parseFloat(this.state.amount) >
                    parseFloat(finalRes.IMPS_TRN_LMT)
                  ) {
                    this.setState({ isOkModalVisible: true });
                    this.props.setOkDialogText(
                      "Amount should not be greater than transaction limit please contact to your branch, your transaction limit is " +
                      finalRes.IMPS_TRN_LMT
                    );
                  } else {
                    this.setState({
                      beneficiaryAccName: filteredData[0].BENF009,
                      BeneficiaryMobNum: filteredData[0].BENF016,
                      bBranchCode: filteredData[0].BENF006,
                      benificiaryAcc: filteredData[0].BENF008,
                      beneficiaryId: filteredData[0].BENF001,
                    });

                    if (
                      parseFloat(
                        Constants.Selected_BALANCE.replace(/[^\d]/g, "")
                      ) === parseFloat(this.state.amount)
                    ) {
                      this.setState({ isYesNoModalVisible: true });
                      console.log("toCallSubmit");
                      this.props.setOkDialogText(
                        "Due to this transaction account balance goes below the minimum balance do you want to proceed ?."
                      );
                    } else {
                      this.getIMPSCharges();
                    }
                  }
                } else {
                  if (
                    parseFloat(this.state.amount) >
                    parseFloat(finalRes.IMPS_TRN_LMT)
                  ) {
                    this.setState({ isOkModalVisible: true });
                    this.props.setOkDialogText(
                      "Amount should not be greater than transaction limit please contact to your branch, your transaction limit is " +
                      finalRes.IMPS_TRN_LMT
                    );
                  } else {
                    this.setState({
                      multipleBeneList: filteredData,
                      isBeneficiaryModalVisible: true,
                    });
                    Snackbar.show({
                      text: "Multiple Beneficiary Found! Please Select Your Beneficiary",
                      duration: Snackbar.LENGTH_SHORT,
                      backgroundColor: "green",
                    });
                  }
                }
              } else {
                Snackbar.show({
                  text:
                    "Beneficiary not found for " +
                    BeneficiaryName +
                    "! Please Add your Beneficiary",
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: "red",
                });
              }
            }
          }
        );
      } catch (e) {
        console.log("Error: ", e);
      }
    } else {
      Snackbar.show({
        text: "Check Internet Connection",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };

  getIMPSCharges = async () => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers("GETIMPSCHRG");

        const jsonReq = {
          customerId: Constants.GMST_CODE,
          acMastCode: Constants.Selected_ACMASTCODE,
          acNo: Constants.Selected_AC_NO,
          branchCd: Constants.BRANCH_CODE,
          secKey: Constants.SecretKey,
          divId: this.props.DeviceId,
          amt: this.state.amount,
        };

        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));

        const Body = {
          PARACNT: "1",
          PARA1_TYP: "STR",
          PARA1_VAL: jsonValue,
        };

        console.log("GetIMPSCharge URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("GetIMPSCharge:- " + JSON.stringify(jsonReq));
        console.log("");

        sendData(
          this,
          "post",
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            //var responseData = response

            var responseData = await decryptData(response);
            var newRes = responseData.slice(16);
            var finalRes = JSON.parse(newRes);
            console.log(
              "responseData GetIMPSCharge================",
              JSON.stringify(finalRes)
            );
            console.log(
              "GetBeneficiaryList Response:- " + JSON.stringify(responseData)
            );
            if (finalRes.SUCCESS === "FALSE") {
              this.setState({
                chrg_amt: "0.0",
                netchrg_amt: "0.0",
                imps_chrg_rq: finalRes.IMPSCHRGRQ,
              });
              const ErrorMsg = finalRes.RESULT;
              Snackbar.show({
                text: ErrorMsg,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red",
              });
              this.setState({ mps_chrg_rq: finalRes.IMPSCHRGRQ });
              if (this.state.imps_chrg_rq == 1) {
                Snackbar.show({
                  text: "Charges amount not defined, Please contact your branch",
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: "red",
                });
              }
            } else if (finalRes.SUCCESS === "TRUE") {
              this.setState({
                chrg_amt: finalRes.CHRG_AMT,
                netchrg_amt: finalRes.NETCHRG_AMT,
                imps_chrg_rq: finalRes.IMPSCHRGRQ,
              });
              if (
                parseFloat(this.state.imps_chrg_rq) == 1 &&
                Number(this.state.chrg_amt) + Number(this.state.netchrg_amt) <=
                0
              ) {
                Snackbar.show({
                  text: "Charges amount not defined, Please contact your branch",
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: "red",
                });
              }

              this.impsMinBalanceCalculation(
                finalRes.CHRG_AMT,
                finalRes.NETCHRG_AMT
              );
            }
          }
        );
      } catch (e) {
        console.log("Error: ", e);
      }
    } else {
      Snackbar.show({
        text: "Check Internet Connection",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };

  getNEFTBeneficiaryList = async (acNo, acmastcode, BeneficiaryName) => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers("GETNEFTBENFLIST");
        const jsonReq = {
          customerId: Constants.GMST_CODE,
          acMastCode: acmastcode,
          acNo: acNo,
          branchCd: Constants.BRANCH_CODE,
          secKey: Constants.SecretKey,
        };

        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));

        const Body = {
          PARACNT: "1",
          PARA1_TYP: "STR",
          PARA1_VAL: JSON.stringify(jsonReq),
        };

        console.log("GetBeneficiaryList " + JSON.stringify(jsonReq));

        sendData(
          this,
          "post",
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            console.log(
              "responseData BeneficiaryList================",
              response
            );
            if (response.SUCCESS === "FALSE") {
              const ErrorMsg = response.RESULT;
              Snackbar.show({
                text: ErrorMsg,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red",
              });
              this.setState({
                myJsonArrayforBeneficiaryList: [],
                filteredData: [],
                isClick: "",
                benificiaryAccTitle: "",
              });
            } else if (response.SUCCESS === "TRUE") {
              this.setState({
                neftDayend: response.NEFTCLOSED,
                isClick: "",
                benificiaryAccTitle: "",
              });
              if ("NEFT_DLY_LMT" in response) {
                this.setState({ NEFT_DLY_FLAG: "Y" });
              } else {
                this.setState({
                  NEFT_DLY_FLAG: "N",
                  NEFT_DLY_LMT: response.NEFT_DLY_LMT,
                });
              }
              if ("NEFT_USED_LMT" in response) {
                this.setState({ NEFT_DLY_FLAG: "Y" });
              } else {
                this.setState({
                  NEFT_DLY_FLAG: "N",
                  NEFT_USED_LMT: response.NEFT_USED_LMT,
                });
              }
              if ("NEFT_TRN_LMT" in response) {
                this.setState({ NEFT_TRN_LMT: response.NEFT_TRN_LMT });
              } else {
                this.setState({ NEFT_TRN_LMT: "0" });
              }
              this.setState({ isClick: "", benificiaryAccTitle: "" });

              const acdtlsArray = response.Acdtls.map((item) =>
                JSON.parse(item.replace(/\\/g, ""))
              );
              // this.setState({
              //   myJsonArrayforBeneficiaryList: acdtlsArray,
              //   filteredData: acdtlsArray,
              // });
              console.log("acdtlsArray:--- ", JSON.stringify(response));

              const filteredData = acdtlsArray.filter((item) => {
                const lowerCaseName = item.BENF009.toLowerCase();
                return lowerCaseName.includes(BeneficiaryName.toLowerCase());
              });

              console.log("filteredData:--- ", JSON.stringify(filteredData));

              if (filteredData.length > 0) {
                if (filteredData.length === 1) {
                  if (
                    parseFloat(this.state.amount) >
                    parseFloat(response.NEFT_TRN_LMT)
                  ) {
                    this.setState({ isOkModalVisible: true });
                    this.props.setOkDialogText(
                      "Amount should not be greater than transaction limit please contact to your branch, your transaction limit is " +
                      this.state.ftTrnLmt
                    );
                  } else if (Number(this.state.neftDayend) === 1) {
                    this.setState({ isOkModalVisible: true });
                    this.props.setOkDialogText(
                      "NEFT counter closed for today! Try in banking hours ! "
                    );
                    result = false;
                  } else {
                    this.setState({
                      beneficiaryAccName: filteredData[0].BENF009,
                      BeneficiaryMobNum: filteredData[0].BENF016,
                      bBranchCode: filteredData[0].BENF006,
                      benificiaryAcc: filteredData[0].BENF008,
                      beneficiaryId: filteredData[0].BENF001,
                    });
                    if (parseFloat("10") === parseFloat(this.state.amount)) {
                      this.setState({ isYesNoModalVisible: true });
                      console.log("toCallSubmit");
                      this.props.setOkDialogText(
                        "Due to this transaction account balance goes below the minimum balance do you want to proceed ?."
                      );
                    } else {
                      this.getNEFTCharges();
                    }
                  }
                } else {
                  this.setState({
                    multipleBeneList: filteredData,
                    isBeneficiaryModalVisible: true,
                  });
                  Snackbar.show({
                    text: "Multiple Beneficiary Found! Please Select Your Beneficiary",
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: "green",
                  });
                }
              } else {
                Snackbar.show({
                  text:
                    "Beneficiary not found for " +
                    BeneficiaryName +
                    "! Please Add your Beneficiary",
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: "red",
                });
              }
            }
          }
        );
      } catch (error) {
        console.log("Error: ", error);
      }
    } else {
      Snackbar.show({
        text: "Check Internet Connection",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };

  getNEFTCharges = async () => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers("GETNEFTCHRG");
        const jsonReq = {
          customerId: Constants.GMST_CODE,
          acMastCode: Constants.Selected_ACMASTCODE,
          acNo: Constants.Selected_AC_NO,
          branchCd: Constants.BRANCH_CODE,
          secKey: Constants.SecretKey,
          amt: this.state.amount,
        };

        // let jsonValue = await _toEncrypt(JSON.stringify(jsonReq))
        const Body = {
          PARACNT: "1",
          PARA1_TYP: "STR",
          PARA1_VAL: JSON.stringify(jsonReq),
        };

        console.log("getNEFTCharges URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("getNEFTCharges:- " + JSON.stringify(jsonReq));
        console.log("");
        console.log("getNEFTCharges:- " + JSON.stringify(Body));
        console.log("");

        sendData(
          this,
          "post",
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            console.log("getNEFTCharges================", response);
            if (response.SUCCESS === "FALSE") {
              const ErrorMsg = response.RESULT;
              Snackbar.show({
                text: ErrorMsg,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red",
              });
              this.setState({
                chrg_amt: "0.0",
                rtgs_chrg_rq: response.RTGSCHRGRQ,
              });
            } else if (response.SUCCESS === "TRUE") {
              this.setState({
                chrg_amt: response.CHRG_AMT,
                rtgs_chrg_rq: response.RTGSCHRGRQ,
              });
              console.log("minBalanceCalculation1");
              if (
                parseFloat(this.state.rtgs_chrg_rq) === 1 &&
                parseFloat(this.state.chrg_amt) <= 0
              ) {
                console.log("ChargesAmnt2");
                Snackbar.show({
                  text: "Charges amount not defined, Please contact your branch",
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: "red",
                });
              } else {
                this.minBalanceCalculation(

                );
              }
            }
          }
        );
      } catch (error) {
        console.log("Error: ", error);
      }
    } else {
      Snackbar.show({
        text: "Check Internet Connection",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };

  impsMinBalanceCalculation(chargeAmt, netChargAmt) {
    const chrg_amt = parseFloat(chargeAmt + netChargAmt);
    const trn_amount = parseFloat(this.state.amount);
    const ac_balacne = parseFloat(
      Constants.Selected_BALANCE.replace(/[^\d]/g, "")
    );
    const m_bal = parseFloat(Constants.Selected_MIN_BAL);
    console.log("Account_Balance: ", ac_balacne);
    console.log("Minimum_Balance: ", m_bal);
    const transferable_amount = chrg_amt + trn_amount;
    console.log("Trn_Balance: ", transferable_amount);
    const remain_balance = ac_balacne - transferable_amount;
    console.log("Remain_Balance: ", remain_balance);
    if (remain_balance < m_bal) {
      if (Constants.Selected_MIN_BAL_REQ === "Y") {
        this.setState({ isOkModalVisible: true });
        this.props.setOkDialogText(
          "This transaction cannot be done because the balance goes below the minimum balance.111111"
        );
      } else {
        this.setState({ isYesNoModalVisible: true });
        this.props.setOkDialogText(
          "Due to this transaction balance goes below the minimum balance do you want to proceed ?."
        );
        // this.setState({ charges_amt: this.state.charges_amt + this.state.netchrg_amt })
      }
    } else {
      this.setState({ charges_amt: Number(chargeAmt) + Number(netChargAmt) });
      const bal = Constants.Selected_BALANCE.replace(/[^\d]/g, "");
      console.log("this.state.availableBalance: ", bal);
      if (Number(bal) < 0) {
        console.log("1");
        this.setState({ isOkModalVisible: true });
        this.props.setOkDialogText(
          "Balance not available  in your account!! " + bal
        );
      } else if (this.state.amount === "") {
        console.log("2");
        this.setState({ isOkModalVisible: true });
        this.props.setOkDialogText("Please enter coorect amount!! " + bal);
      } else if (
        Number(this.state.amount) + Number(chargeAmt) + Number(netChargAmt) >
        Math.abs(bal)
      ) {
        console.log("3");
        this.props.setOkDialogText(
          "Amount + Charges " +
          "(" +
          this.state.amount +
          "+" +
          chargeAmt +
          ")" +
          " not greater than account balance!! "
        );
        this.setState({ isOkModalVisible: true });
      }
      // else if one condition add
      else {
        console.log("4");
        if (
          Number(this.state.imps_chrg_rq) == 1 ||
          Number(chargeAmt) + Number(netChargAmt) <= 0
        ) {
          this.getIMPSOTP();
        } else {
          console.log("6");
        }
      }
    }
  }

  minBalanceCalculation() {
    const chrg_amt = parseFloat(this.state.chrg_amt);
    const trn_amount = parseFloat(this.state.amount);
    const ac_balacne = parseFloat(Constants.Selected_BALANCE.replace('-', ''));
    const m_bal = parseFloat(Constants.Selected_MIN_BAL);
    console.log("Account_Balance: ", ac_balacne);
    console.log("Minimum_Balance: ", m_bal);
    console.log("Account_Balance: ", ac_balacne);
    console.log("Minimum_Balance: ", m_bal);
    const transferable_amount = chrg_amt + trn_amount;
    console.log("Trn_Balance: ", transferable_amount);
    const remain_balance = ac_balacne - m_bal;
    console.log("Remain_Balance: ", remain_balance);
    console.log("Remain_Balance: ", Constants.Selected_MIN_BAL_REQ);


    if (Constants.Selected_MIN_BAL_REQ === 'N') {
      if (transferable_amount >= ac_balacne) {
        this.setState({ isOkModalVisible: true })
        this.props.setOkDialogText('Balance of account must not exceed amount plus charges !')
      }
      else {
        this.getNEFTOTP();
      }
    }
    else {
      if (transferable_amount >= remain_balance) {
        this.setState({ isOkModalVisible: true })
        this.props.setOkDialogText('This transaction cannot be done because the balance goes below the minimum balance')
      }
      else {
        this.getNEFTOTP();
      }

    }
  }

  getNEFTOTP = async () => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers("SNDNEFTFTOTP");

        const jsonReq = {
          customerId: Constants.GMST_CODE,
          acMastCode: Constants.Selected_ACMASTCODE,
          acNo: Constants.Selected_AC_NO,
          branchCd: Constants.BRANCH_CODE,
          secKey: Constants.SecretKey,
          Benf001: this.state.beneficiaryId,
          Amount: this.state.amount,
          Prtcls: this.state.remark,
          bankCode: Constants.BankCode,
          chrgAmt: this.state.chrg_amt,
          DEVICE_LATTIDUTE: "null",
          DEVICE_LONGITUDE: "null",
          DEVICE_LOCAL_IP: "null",
          DEVICE_PUBLIC_IP: "null",
          DEVICE_ISP_OPERATOR: "null",
          SIMNO: "00000000-05ec-ff6b-0000-00005659f38b",
          divId: this.props.DeviceId,
        };

        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));

        const Body = {
          PARACNT: "1",
          PARA1_TYP: "STR",
          PARA1_VAL: JSON.stringify(jsonReq),
        };

        console.log("SubmitApi URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("SubmitApi:- " + JSON.stringify(jsonReq));
        console.log("");

        sendData(
          this,
          "post",
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            console.log("responseData SubmitApi================", response);
            //var responseData = response
            // var responseData = await decryptData(response)
            // var newRes = responseData.slice(16)
            // var finalRes = JSON.parse(newRes)
            // console.log("responseData BeneficiaryList================", JSON.stringify(finalRes))
            //console.log("GetBeneficiaryList Response:- " + JSON.stringify(responseData));
            if (response.SUCCESS === "FALSE") {
              const ErrorMsg = response.RESULT;
              Snackbar.show({
                text: ErrorMsg,
                duration: Snackbar.LENGTH_SHORT,
              });
            } else if (response.SUCCESS === "TRUE") {
              navigation.navigate(this, "transactionOTPScreen", {
                from: "Dashboard",
                txnFor: "NEFT",
                fromAcc: Constants.Selected_AC_NO,
                toAcc: this.state.benificiaryAcc,
                remark: this.state.remark,
                amount: this.state.amount,
                fromAccAcmastCode: Constants.Selected_ACMASTCODE,
                beneficiaryAccAcmastCode: this.state.beneficiaryAccAcmastCode,
                fromAccName: Constants.Selected_AC_NAME,
                beneficiaryAccName: this.state.beneficiaryAccName,
                chrg_amt: this.state.chrg_amt,
                beneficiaryId: this.state.beneficiaryId,
                bBranchCode: this.state.bBranchCode,
                neftTrnid: response.NEFT_TRN_ID,
                trnscnId: response.TRNSCNID,
              });
            }
          }
        );
      } catch (e) {
        console.log("Error: ", e);
      }
    } else {
      Snackbar.show({
        text: "Check Internet Connection",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };

  GetAllowableBalance = async (
    fromAcc,
    acmastcode,
    AccLastFourDigit,
    AccType
  ) => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers("GETALLBAL");
        const Body = {
          PARACNT: "1",
          PARA1_TYP: "STR",
          PARA1_VAL:
            '{"ACMASTCODE":"' + acmastcode + '","AC_NO":"' + fromAcc + '"}',
        };

        sendData(
          this,
          "post",
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            var responseData = response;

            console.log(
              "GetAllowableBalance:- " + JSON.stringify(responseData)
            );

            let res = response.SUCCESS;
            if (res === "FALSE") {
              const ErrorMsg = response.RESULT;
              Snackbar.show({
                text: ErrorMsg,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red",
              });
              this.setState({ availableBalance: "0.0" });
            } else if (res === "TRUE") {
              this.setState({
                availableBalance: response["ALLOWABLE BALANCE"],
              });
              if (
                parseFloat(response["ALLOWABLE BALANCE"]) <
                parseFloat(this.state.amount)
              ) {
                Snackbar.show({
                  text: "Insufficient Allowable Balance",
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: "orange",
                });
              } else {
                this.GetBeneficiaryList(
                  Constants.Selected_AC_NO,
                  Constants.Selected_ACMASTCODE,
                  AccType,
                  AccLastFourDigit
                );
              }
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

  requestAudioPermission = async () => {

    try {
      if (Platform.OS === "android") {

        const audioPermission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
        const granted = await PermissionsAndroid.request(audioPermission);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Audio recording permission granted");
          this.props.setAudioPermission(true);
        } else {
          console.log("Audio recording permission denied");

          this.showMandatoryPermissionAlert();
        }
      } else if (Platform.OS === "ios") {
        console.log('Platform.OS==== ' + Platform.OS)
        const status = await check(PERMISSIONS.IOS.MICROPHONE);
        console.log('status==== ' + status + 'RESULTS.GRANTED=== ' + RESULTS.GRANTED)
        if (status === RESULTS.GRANTED) {
          console.log("Audio recording permission granted");
          // this.props.setAudioPermission(true);

          // Proceed with audio-related functionality
        } else {
          console.log("Audio=======");
          const requestStatus = await request(PERMISSIONS.IOS.MICROPHONE);
          if (requestStatus === RESULTS.GRANTED) {
            console.log("Audio recording permission granted");
            // this.props.setAudioPermission(true);
            console.log("Audio.....");

            // Proceed with audio-related functionality
          } else {
            console.log("Audio recording permission denied");
            // Handle mandatory audio permission denial
            this.showMandatoryPermissionAlert();
          }
        }
      }
    } catch (error) {
      console.log("Error requesting audio recording permission:", error);
    }
  };

  showMandatoryPermissionAlert = () => {
    Alert.alert(
      "Audio Recording Permission Required",
      "This app requires audio recording permission to function properly. Please grant the permission.",
      [
        {
          text: "OK",
          onPress: () => {
            // Open the app settings
            if (Platform.OS === "android") {
              this.requestAudioPermission();
            } else {
              // For iOS, redirect to the general app settings page
              Linking.openURL("app-settings:");
            }
          },
        },
      ]
    );
  };

  handleVoiceCommand = (command) => {
    const commandArray = command.split(" ");
    const IndexCommand = commandArray[0].toLowerCase();

    switch (IndexCommand) {
      case "statement":
        this.statementCmdValidation(commandArray);
        break;
      case "self":
        this.txnSelfCmdValidation(commandArray);
        break;
      case "other":
        this.txnOtherCmdValidation(commandArray, IndexCommand);
        break;
      case "neft":
        this.txnOtherCmdValidation(commandArray, IndexCommand);
        break;
      case "imps":
        this.txnOtherCmdValidation(commandArray, IndexCommand);
        break;
      default:
        Snackbar.show({
          text: "Invalid Command",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "red",
        });
    }
  };

  txnOtherCmdValidation = (commandArray, IndexCommand) => {
    commandArray = commandArray.map((element) => element.toLowerCase());

    const amountIndex = commandArray.findIndex((element) => element === "rs" || element === "rupees" || element === "₹");

    var Amount =
      amountIndex === 2
        ? parseFloat(commandArray[1])
        : parseFloat(commandArray[2]);

    if (amountIndex === -1) {
      Snackbar.show({
        text: "Rupees keyword is missing or in the wrong position",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
      return;
    }

    if (isNaN(Amount)) {
      Snackbar.show({
        text: "Amount is not a valid number",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
      return;
    }
    this.setState({ amount: Amount });

    const toIndex = commandArray.indexOf("to");
    var Remark = "";
    if (toIndex === -1 || toIndex !== 3) {
      Snackbar.show({
        text: "Invalid TO keyword position",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
      return;
    }

    const forIndex = commandArray.indexOf("for");

    if (forIndex === -1) {
      Snackbar.show({
        text: "Invalid for keyword position",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
      return;
    }

    Remark = commandArray.slice(forIndex + 1).join(" ");
    console.log("Remark" + Remark);
    this.setState({ remark: Remark });

    if (Remark === "") {
      Snackbar.show({
        text: "Remark not found!!",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
      return;
    }

    const BeneficiaryName = commandArray.slice(toIndex + 1, forIndex).join(" ");
    console.log("Constants.Selected_AC_NAME    " + Constants.Selected_AC_NAME);
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharRegex.test(Remark)) {
      this.setState({ isOkModalVisible: true });
      this.props.setOkDialogText("Special charcters not allowed in remark..!!");
      return;
    }
    const bal = parseFloat(Constants.Selected_BALANCE.replace(/[^\d]/g, ""));

    if (Amount < 1) {
      this.setState({ isOkModalVisible: true });
      this.props.setOkDialogText("Provide Amount in Rupee!!");
      return;
    }

    if (Number(Amount) > Number(bal)) {
      this.setState({ isOkModalVisible: true });
      this.props.setOkDialogText(
        "Amount is greater than account balance!! " + Amount
      );
      return;
    }
    if (bal < 0) {
      this.setState({ isOkModalVisible: true });
      this.props.setOkDialogText("Insufficient Balance");
      return;
    }
    if (Amount < 1) {
      this.setState({ isOkModalVisible: true });
      this.props.setOkDialogText("Enter Amount in Rupee!!");
      return;
    }


    if ((Constants.Selected_DEBIT_STOP != null) && (Constants.Selected_DEBIT_STOP != '') && (parseInt(Constants.Selected_DEBIT_STOP) === 1)) {
      Snackbar.show({
        text: 'Selected Debit Account is Debit Stopped. Please Contact your Branch..!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red'
      });
      return;
    }

    if (
      IndexCommand === "other" ||
      IndexCommand === "neft" ||
      IndexCommand === "imps"
    ) {
      this.setState({ CommandType: IndexCommand });
    }

    if (
      Constants.Selected_AC_NAME != null &&
      Constants.Selected_AC_NAME != ""
    ) {
      if (BeneficiaryName.length > 3) {
        this.GetOTHAllowableBalance(
          Constants.Selected_AC_NO,
          Constants.Selected_ACMASTCODE,
          BeneficiaryName,
          this.state.CommandType
        );
      } else {
        Snackbar.show({
          text: "Beneficiary Name too short! Minimum 4 characters required.",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "orange",
        });
      }
    }

    console.log("Amount:", this.state.amount);
    console.log("availableBalance:", this.state.availableBalance);
    console.log("Remark:", Remark);
  };

  txnSelfCmdValidation = (commandArray) => {
    var AccLastFourDigit = "";

    commandArray = commandArray.map((element) => element.toLowerCase());

    const includesAccount = commandArray.includes("ending");

    const endingStr = commandArray.indexOf("ending");

    const amountIndex = commandArray.findIndex(
      (element) => element === "rs" || element === "rupees"
    );

    if (commandArray.length < 8) {
      Snackbar.show({
        text: "Invalid Command",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
      return;
    }

    var Amount =
      amountIndex === 2
        ? parseFloat(commandArray[1])
        : parseFloat(commandArray[2]);

    if (amountIndex === -1) {
      Snackbar.show({
        text: "Rupees keyword is missing or in the wrong position",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
      return;
    }
    if (isNaN(Amount)) {
      Snackbar.show({
        text: "Amount is not a valid number",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
      return;
    }
    this.setState({ amount: Amount });

    const toIndex = commandArray.indexOf("to");
    var Remark = "";
    if (toIndex === -1 || toIndex !== 3) {
      Snackbar.show({
        text: "Invalid TO keyword position",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
      return;
    }

    const AccIndex = commandArray.indexOf("account");

    if (AccIndex !== 5 || AccIndex === -1) {
      Snackbar.show({
        text: "'Account' keyword missing!!",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
      return;
    }

    if (includesAccount) {
      console.log(
        "commandArray.lengthcommandArray.length" + commandArray.length
      );
      if (commandArray.length < 11) {
        Snackbar.show({
          text: "Command is Incomplete",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "orange",
        });
        return;
      }

      if (endingStr !== 6) {
        Snackbar.show({
          text: "Invalid keyword position",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "orange",
        });
        return;
      }

      const forIndex = commandArray.indexOf("for");

      if (forIndex !== 9 || forIndex === -1) {
        Snackbar.show({
          text: "Invalid for keyword position",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "orange",
        });
        return;
      }

      AccLastFourDigit = commandArray[8];
      console.log("AccLastFourDigit==============" + AccLastFourDigit);
      const Acclen = commandArray.indexOf(commandArray[8]);
      if (isNaN(AccLastFourDigit) && Acclen === 4) {
        Snackbar.show({
          text: "Four four digit number only",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "orange",
        });
        return;
      }

      Remark = commandArray.slice(forIndex + 1).join(" ");
      console.log("RemarkRemarkRemarkRemarkRemark" + Remark);
      this.setState({ remark: Remark });
    } else {
      if (commandArray.length < 8) {
        Snackbar.show({
          text: "Command is incomplete",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "orange",
        });
        return;
      }
      const forIndex = commandArray.indexOf("for");

      if (forIndex !== 6 || forIndex === -1) {
        Snackbar.show({
          text: "Invalid for keyword position",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "orange",
        });
        return;
      }
      Remark = commandArray.slice(forIndex + 1).join(" ");
      this.setState({ remark: Remark });
    }

    if (Amount < 1) {
      this.setState({ isOkModalVisible: true });
      this.props.setOkDialogText("Provide Amount in Rupee!!");
      return;
    }
    console.log('selected ac numbwe===================' + Constants.Selected_AC_NO);
    console.log('selected ac ac mas===================' + Constants.Selected_ACMASTCODE);

    if ((Constants.Selected_DEBIT_STOP != null) && (Constants.Selected_DEBIT_STOP != '') && (parseInt(Constants.Selected_DEBIT_STOP) === 1)) {
      Snackbar.show({
        text: 'Selected Debit Account is Debit Stopped. Please Contact your Branch..!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red'
      });
      return;
    }
    

    const AccType = commandArray[4];

    this.GetAllowableBalance(
      Constants.Selected_AC_NO,
      Constants.Selected_ACMASTCODE,
      AccLastFourDigit,
      AccType
    );

    console.log("Amount:", this.state.amount);
    console.log("availableBalance:", this.state.availableBalance);
    console.log("Remark:", Remark);
  };






  statementCmdValidation = (commandArray) => {


    var toMonth = "";
    var frmMonth = "";



    if (commandArray.includes(undefined) || commandArray.includes(" ") || commandArray.length < 8) {

      Snackbar.show({
        text: "Date not recognized! Please speak louder",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
      return;
    }

    if (isNaN(commandArray[1]) || isNaN(commandArray[3]) || isNaN(commandArray[5]) || isNaN(commandArray[7])) {
      Snackbar.show({
        text: "Please check the statement date or year!",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
      return;
    }
    if (commandArray[4].toLowerCase() !== "to") {
      Snackbar.show({
        text: "'To' keyword not recognized! Please try again!",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
      return;
    }
    const monthNames = {
      january: "01",
      february: "02",
      march: "03",
      april: "04",
      may: "05",
      june: "06",
      july: "07",
      august: "08",
      september: "09",
      october: "10",
      november: "11",
      december: "12",
    };
    if (monthNames.hasOwnProperty(commandArray[2].toLowerCase()) && monthNames.hasOwnProperty(commandArray[6].toLowerCase())) {
      toMonth = monthNames[commandArray[2].toLowerCase()];
      frmMonth = monthNames[commandArray[6].toLowerCase()];
    }
    else {
      Snackbar.show({
        text: "Month name is not recognized",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
      return;
    }



    const FinalFromDate = moment(`${commandArray[1]}/${toMonth}/${commandArray[3]}`, 'DD/MM/YYYY').toDate();
    const FinalToDate = moment(`${commandArray[5]}/${frmMonth}/${commandArray[7]}`, 'DD/MM/YYYY').toDate();
    const currentDate = new Date();
    console.log('FinalFromDate : ' + FinalFromDate)
    console.log('FinalToDate : ' + FinalToDate)
    console.log('currentDate : ' + currentDate)


    if (FinalFromDate > FinalToDate) {
      Snackbar.show({
        text: "Please provide correct date!",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
      return;
    }
    if (FinalFromDate > currentDate) {
      Snackbar.show({
        text: "From date is greater than current date!",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
      return;
    }

    if (FinalToDate > currentDate) {
      Snackbar.show({
        text: "To date is greater than current date!",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
      return;
    }






    this.DownloadStatement(FinalFromDate, FinalToDate);
  };




  GetAllowableOTHBalance = async (fromAcc, acmastcode) => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers("GETALLOWBAL");

        const Body = {
          PARACNT: "1",
          PARA1_TYP: "STR",
          PARA1_VAL:
            '{"customerId":"' +
            Constants.GMST_CODE +
            '","acMastCode":"' +
            acmastcode +
            '","acNo":"' +
            fromAcc +
            '","secKey":"' +
            Constants.SecretKey +
            '"}',
        };

        console.log("GetAllowableBalance URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("GetAllowableBalance Api:- " + JSON.stringify(Body));
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
              "GetAllowableBalance Response:- " + JSON.stringify(responseData)
            );

            let res = response.SUCCESS;
            if (res === "FALSE") {
              const ErrorMsg = response.RESULT;
              Snackbar.show({
                text: ErrorMsg,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red",
              });
              this.setState({ availableBalance: "0.0" });
            } else if (res === "TRUE") {
              this.setState({
                availableBalance: response["ALLOWABLE BALANCE"],
              });
              if (parseFloat(this.state.availableBalance) <= 0) {
                Snackbar.show({
                  text: "No Balance, Please contact your branch",
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: "red",
                });
              } else if (parseFloat(this.state.availableBalance) == 0) {
                Snackbar.show({
                  text: "Invalid Account Selected, Please contact your branch",
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: "red",
                });
              }
            }
          }
        );
      } catch (e) {
        console.log("Error: ", e);
      }
    } else {
      Snackbar.show({
        text: "Check Internet Connection",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };

  getOTHAccOTP = async () => {
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
        console.log("FundTransferWithinBank URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("FundTransferWithinBank Body:- " + JSON.stringify(Body));
        console.log("");
        sendData(
          this,
          "post",
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            var responseData = response;

            if (responseData.SUCCESS === "FALSE") {
              const ErrorMsg = response.RESULT;
              // ToastAndroid.show(ErrorMsg, ToastAndroid.SHORT)
              Snackbar.show({
                text: ErrorMsg,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red",
              });
            } else {
              console.log("inside else");
              console.log(
                "FundTransferOtherAcc response is",
                JSON.stringify(response)
              );
              //this.setState({termsAndCondition : true})
              navigation.navigate(this, "transactionOTPScreen", {
                from: "Dashboard",
                txnFor: "OTHER",
                fromAcc: Constants.Selected_AC_NO,
                toAcc: this.state.benificiaryAcc,
                amount: this.state.amount,
                fromAccAcmastCode: Constants.Selected_ACMASTCODE,
                beneficiaryAccAcmastCode: this.state.beneficiaryAccAcmastCode,
                bBranchCode: this.state.bBranchCode,
                beneficiaryId: this.state.beneficiaryId,
                fromAccName: Constants.Selected_AC_NAME,
                remark: this.state.remark,
              });
            }
          }
        );
      } catch (e) {
        console.log("Error: ", e);
      }
    } else {
      Snackbar.show({
        text: "Check Internet Connection",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };

  GetOtpApi = async () => {
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
            Constants.Selected_AC_NO +
            '","acMastCode":"' +
            Constants.Selected_ACMASTCODE +
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
            '","DEVICE_LATTIDUTE":"null","DEVICE_LONGITUDE":"null","DEVICE_LOCAL_IP":"null","DEVICE_PUBLIC_IP":"null","DEVICE_ISP_OPERATOR":"null","SIMNO":"00000000-05ec-ff6b-0000-00005659f38b","divId":"' +
            this.props.DeviceId +
            '"}',
        };

        console.log("GetOtp URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log(
          "GetOtp Api:------------------------------- " + JSON.stringify(Body)
        );
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
              });
              // }
            } else if (res === "TRUE") {
              console.log("Success");
              Snackbar.show({
                text: "OTP Successfully Sent to Your Registered Mobile Number",
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "green",
              });
              // console.log("GetOtp Api Response:- " + JSON.stringify(responseData))

              console.log("Transid: ", responseData.NEFT_TRN_ID);
              navigation.navigate(this, "transactionOTPScreen", {
                from: "dashboard",
                fromAcc: Constants.Selected_AC_NO,
                toAcc: this.state.benificiaryAcc,
                amount: this.state.amount,
                fromAccAcmastCode: Constants.Selected_ACMASTCODE,
                beneficiaryAccAcmastCode: this.state.beneficiaryAccAcmastCode,
                trnId: responseData.NEFT_TRN_ID,
                fromAccName: Constants.Selected_AC_NAME,
                beneficiaryAccName: this.state.beneficiaryAccName,
                bBranchCode: this.state.bBranchCode,
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

  componentWillUnmount() {
    console.log("unmounttttt");
    Voice.destroy().then(Voice.removeAllListeners);
  }

  DownloadStatement(FinalFromDate, FinalToDate) {
    const startDate = moment(FinalFromDate, "DD/MM/YYYY");
    const endDate = moment(FinalToDate, "DD/MM/YYYY");

    const daysDifference = endDate.diff(startDate, "days");

    console.log("days diff-" + daysDifference);

    if (daysDifference < 366) {
      this.DownloadStatementApi(startDate, endDate);
    } else {
      Snackbar.show({
        text: "Maximum of one year is allowed",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "orange",
      });
    }
  }

  DownloadStatementApi = async (startDate, endDate) => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers("ACCSTATREQ");

        const Body = {
          PARACNT: "11",
          PARA1_TYP: "STR",
          PARA1_VAL: Constants.GMST_CODE,
          PARA2_TYP: "STR",
          PARA2_VAL: Constants.Selected_AC_NO,
          PARA3_TYP: "STR",
          PARA3_VAL: Constants.Selected_ACMASTCODE,
          PARA4_TYP: "STR",
          PARA4_VAL: Constants.BRANCH_CODE,
          PARA5_TYP: "STR",
          PARA5_VAL: Constants.Name,
          PARA6_TYP: "STR",
          PARA6_VAL: "0",
          PARA7_TYP: "STR",
          PARA7_VAL: moment(startDate).format("DD-MMM-YYYY"),
          PARA8_TYP: "STR",
          PARA8_VAL: moment(endDate).format("DD-MMM-YYYY"),
          PARA9_TYP: "STR",
          PARA9_VAL: "PDF",
          PARA510_TYP: "STR",
          PARA10_VAL: Constants.BankCode,
          PARA11_TYP: "STR",
          PARA11_VAL: Constants.SecretKey,
        };

        console.log("Headers:- " + JSON.stringify(Headers));
        console.log("");
        console.log("Download Statement Body:- " + JSON.stringify(Body));
        console.log("");

        sendData(
          this,
          "post",
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          this.DownloadStatementApiCallback
        );
      } catch (e) {
        console.log("Error: ", e);
      }
    } else {
      Snackbar.show({
        text: "Check Internet Connection",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }

  }
  DownloadStatementApiCallback = async (obj, response) => {
    console.log("Download Statement Response:- " + JSON.stringify(response));

    let res = response.SUCCESS;

    if (res === "FALSE") {
      //return okDialog(this, "Hellos")
      Snackbar.show({
        text: "Something went to wrong",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    } else if (res === "TRUE") {
      console.log("Success TRUE");

      const currentDate = new Date();

      // Format the date and time to use in the file name
      const formattedDate = currentDate.toISOString().slice(0, 10); // YYYY-MM-DD
      const formattedTime = currentDate
        .toTimeString()
        .slice(0, 8)
        .replace(/:/g, ""); // HHMMSS

      var RESULTT = "data:application/pdf;base64," + response.RESULT;
      try {
        const base64Data = RESULTT.replace("data:application/pdf;base64,", "");
        const filename = `Statement${formattedDate}_${formattedTime}.pdf`;
        const path = RNFS.DownloadDirectoryPath + "/" + filename;

        RNFS.writeFile(path, base64Data, "base64");
        console.log("PDF file saved to ", path);

        // ToastAndroid.show('Statement Downloaded successfully', ToastAndroid.SHORT)
        Snackbar.show({
          text: "Statement Downloaded successfully",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "green",
        });

        RNFS.exists(path).then((res) => {
          if (res) {
            console.log("Open PDF File", res);

            FileViewer.open(path);
          }
        });
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("Success FALSE");
    }
  };

  onSpeechRecognized = (e) => {
    console.log('on SpeechRecognized')
  };



  onSpeechError = (e) => {
    console.log('e.error===' + JSON.stringify(e.error))
    this.setState({ error: JSON.stringify(e.error) });
    if (e.error.code === '2') {
      Snackbar.show({
        text: "Check Internet Connection",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });

      {
        this.state.recognized === ""
          ? this.setState({
            recognized:
              "Check Internet Connection",
            MicrophoneAction: true,
          })
          : this.setState({
            MicrophoneAction: true,
            isVoiceAssistanceActive: true,
          });
      }

    }

  };

  onSpeechResults = (e) => {
    let recognizedVoice = e.value[0]
    console.log(recognizedVoice);
    var regex = /i am ps(?=\d+)|i am ps/gi;
    var result = recognizedVoice.toLowerCase().replace(regex, 'IMPS ');
    result = result.replace('  ', ' ');
    this.setState({ recognized: result });
    this.handleVoiceCommand(result);
  };

  startVoiceRecognition = async () => {
    this.requestAudioPermission();
    if (true) {
      try {

        Voice.onSpeechStart = () => {
          console.log("User vstarted speaking");
        };

        // Set up event listener for speech end
        Voice.onSpeechEnd = () => {
          console.log("User stopped speaking");
          //this.setState({ MicrophoneAction: true,isVoiceAssistanceActive : false,
          {
            this.state.recognized === ""
              ? this.setState({
                recognized:
                  "Your voice is important! Speak up a little louder, Please.",
                MicrophoneAction: true,
              })
              : this.setState({
                MicrophoneAction: true,
                isVoiceAssistanceActive: true,
              });
          }

          // Your code to handle the event after the user stops speaking
        };

        // Start voice recognition
        await Voice.start("en");
      } catch (e) {
        console.error(e);
      }
    } else {
    }
  };

  stopVoiceRecognition = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  toggleMicrophoneAction = () => {

    console.log(this.state.MicrophoneAction)

    console.log(this.state.MicrophoneAction)
    this.setState({
      MicrophoneAction: false,
      recognized: "",
    }, () => {
      if (!this.state.MicrophoneAction) {
        this.startVoiceRecognition();
        this.stopWaveAnimation();
        this.animateVoiceAssistance();
      } else {
        this.stopWaveAnimation();
      }
    });
  };


  animateVoiceAssistance = () => {
    const animations = this.state.waveAnimations.map((animation, index) => {
      return Animated.loop(
        Animated.timing(animation, {
          toValue: 1,
          duration: 1500 + index * 500, // Adjust duration for smoother flow
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
    });

    Animated.parallel(animations).start();
  };

  stopWaveAnimation = () => {
    // console.log("this.state.waveAnimations" + this.state.waveAnimations);
    this.state.waveAnimations.forEach((animation) => {
      animation.stopAnimation(); // Stop the animation
      animation.setValue(0); // Reset the animation to initial state
    });
  };

  onBeneficiarySelectAccount = (
    value,
    title,
    bAcmastCode,
    bBranchCode,
    bNfId,
    ftTrnLmt
  ) => {
    if (title === "") {
      this.setState({ benificiaryAcc: "" });
      Snackbar.show({
        text: "Beneficiary Name is Null..!!",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    } else {
      if (this.state.CommandType === "other") {
        this.setState({
          benificiaryAcc: value,
          benificiaryAccTitle: title,
          beneficiaryAccAcmastCode: bAcmastCode,
          bBranchCode: bBranchCode,
          beneficiaryId: bNfId,
        });
        if (parseFloat(this.state.amount) > parseFloat(ftTrnLmt)) {
          this.setState({ isOkModalVisible: true });
          this.props.setOkDialogText(
            "Amount should not be greater than transaction limit please contact to your brance, your transaction limit is " +
            ftTrnLmt
          );
        } else if (
          parseFloat(this.state.amount) + parseFloat(this.state.usedLmt) >
          parseFloat(this.state.dlyLmt)
        ) {
          this.setState({ isOkModalVisible: true });
          this.props.setOkDialogText(
            "Sorry, we cant proceed your transaction because you are exceeding your daily limit for fund transfer, Please contact to your branch."
          );
        } else {
          this.getOTHAccOTP();
        }
      } else if (this.state.CommandType === "neft") {
        this.setState({
          beneficiaryAccName: value,
          bBranchCode: bBranchCode,
          benificiaryAcc: value,
          beneficiaryId: bNfId,
        });

        if (
          parseFloat(Constants.Selected_BALANCE.replace(/[^\d]/g, "")) ===
          parseFloat(this.state.amount)
        ) {
          this.setState({ isYesNoModalVisible: true });
          console.log("toCallSubmit");
          this.props.setOkDialogText(
            "Due to this transaction account balance goes below the minimum balance do you want to proceed ?."
          );
        } else {
          this.getNEFTCharges();
        }
      } else if (this.state.CommandType === "imps") {
        this.setState({
          beneficiaryAccName: value,
          bBranchCode: bBranchCode,
          benificiaryAcc: value,
          beneficiaryId: bNfId,
        });
        if (
          parseFloat(Constants.Selected_BALANCE.replace(/[^\d]/g, "")) ===
          parseFloat(this.state.amount)
        ) {
          this.setState({ isYesNoModalVisible: true });
          console.log("toCallSubmit");
          this.props.setOkDialogText(
            "Due to this transaction account balance goes below the minimum balance do you want to proceed ?."
          );
        } else {
          this.getIMPSCharges();
        }
      }
    }
  };

  renderItem = ({ item }) => (
    <CardView
      cardElevation={3}
      cardMaxElevation={5}
      cornerRadius={15}
      style={styles.cardContainer}
    >
      <View style={styles.commandContainer}>
        <View style={styles.renderIconContainer}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                Selected_CommandType: item.rightText,
                Selected_Command: item.leftText,
              });
              this.toggleMicrophoneAction(); // Corrected invocation of toggleMicrophoneAction
            }}
          >
            <View style={styles.microphoneContainer}>
              <MicrophoneIcon />
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.textContainer]}>
          <Text style={styles.rightText}>{item.rightText}</Text>
          <Text style={styles.leftText}>{item.leftText}</Text>
          {item.onPress && (
            <TouchableOpacity onPress={item.onPress}>
              <Text style={styles.moreCmdOption}>
                {"Click here for more commands."}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </CardView>
  );

  render() {
    const { waveAnimations } = this.state;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.container1}>
          <FixedHeader
            backAction={() => this.onBackArrow()}
            color={"#1F3C66"}
          />
          <View style={styles.header1}>
            <View style={styles.pageTitleView}>
              <View
                style={{
                  marginLeft: 20,
                  width: width - 80,
                  justifyContent: "center",
                }}
              >
                <Text style={styles.pageTitle}>Speak</Text>
              </View>
              {/* <TouchableOpacity
                onPress={() =>
                  this.setState({
                    isLanguageModalVisible: true,
                    labelText: "Commands Languages",
                  })
                }
                style={styles.LanguageIconView}
              >
                <LanguageIcon
                  style={styles.LanguageIconContainer}
                  height={18}
                  width={18}
                />
                <Text style={styles.langText}>
                  {this.state.Selected_Language}
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>

          {this.state.MicrophoneAction === true &&
            this.state.isVoiceAssistanceActive === false &&
            this.state.recognized === "" ? (
            <View style={styles.containerView}>
              <Text style={styles.text}>
                Hello <Text style={styles.boldText}>{this.state.UserName}</Text>
                ,
                {
                  ' "Speak Feature" enables voice-command operations for various services.'
                }
              </Text>
              <View style={styles.NoteView}>
                <Text style={styles.NoteText}>
                  {`Click the microphone icon below to proceed. Avoid sharing sensitive information like user ID, password, or account number.`}
                </Text>

                <View></View>
              </View>
              <View style={styles.flatList}>
                <FlatList
                  data={this.state.CommandData}
                  renderItem={this.renderItem}
                />
              </View>

              {SpeakCommandPopup(
                this.state.ForMoreCommand,
                this.CommandList,
                this.onSelectDebitAccount,
                this.state.labelText,
                this.state.CommandList
              )}
              {/* {SpeakCommandPopup(
                this.state.isLanguageModalVisible,
                this.LanguageList,
                this.onSelectLanguage,
                this.state.labelText,
                this.state.CommandList
              )} */}
            </View>
          ) : (
            <View style={styles.outerContainer}>
              <View style={styles.nestedContainer}>
                <Image
                  style={styles.voiceAssistantImage}
                  source={require("../../assets/images/VoiceAssistant.png")}
                />
              </View>
              {this.state.Selected_CommandType !== "" &&
                this.state.Selected_Command !== "" ? (
                <View
                  style={{
                    width: width - 60,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CardView
                    cardElevation={3}
                    cardMaxElevation={5}
                    cornerRadius={15}
                    style={{
                      padding: 8,
                      backgroundColor: "white",
                      width: width - 50,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      //   marginTop: 5,
                      // marginBottom: 8,
                      // marginLeft: 5,
                      // marginRight: 5,
                    }}
                  >
                    <TouchableOpacity>
                      <View style={styles.commandContainer}>
                        <View style={styles.renderIconContainer}>
                          <View style={styles.microphoneContainer}>
                            <MicrophoneIcon />
                          </View>
                        </View>
                        <View style={[styles.textContainer]}>
                          <Text style={styles.rightText}>
                            {this.state.Selected_CommandType}
                          </Text>
                          <Text style={styles.leftText}>
                            {this.state.Selected_Command}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </CardView>
                </View>
              ) : null}
              <View style={styles.recViewContainer}>
                <View style={styles.recognizedContainer}>
                  <Text style={styles.recognizedText}>
                    {this.state.recognized === ""
                      ? "Listening... "
                      : this.state.recognized}
                  </Text>
                  <View></View>
                </View>
              </View>
            </View>
          )}

          <View
            style={[
              styles.container,
              {
                flex:
                  this.state.MicrophoneAction &&
                    !this.state.isVoiceAssistanceActive &&
                    this.state.recognized === ""
                    ? 0.2
                    : 0.4,
              },
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  alignItems:
                    this.state.MicrophoneAction &&
                      !this.state.isVoiceAssistanceActive &&
                      this.state.recognized === ""
                      ? "flex-end"
                      : "center",
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.microphoneButton,
                  {
                    backgroundColor: this.state.MicrophoneAction
                      ? "white"
                      : "#1F3C66",
                  },
                ]}
                onPress={this.toggleMicrophoneAction}
              >
                <Image
                  style={[
                    styles.microphoneIcon,
                    {
                      tintColor: this.state.MicrophoneAction
                        ? "#1F3C66"
                        : "white",
                    },
                  ]}
                  source={require("../../assets/icons/Microphone-icon.png")}
                />
              </TouchableOpacity>
            </View>
            {this.state.MicrophoneAction !== true && (
              <View style={styles.wavesContainer}>
                {waveAnimations.map((animation, index) => (
                  <Animated.View
                    key={index}
                    style={[styles.wave, styles.waveAnimated(index, animation)]}
                  />
                ))}
              </View>
            )}
          </View>
        </View>

        <Modal
          isVisible={this.state.isOkModalVisible}
          backdropOpacity={0.8}
          onBackdropPress={() => this.toggleModalOkDialog()}
          onBackButtonPress={() => this.toggleModalOkDialog()}
          animationIn={"fadeIn"}
          animationInTiming={500}
          animationOut={"fadeOut"}
          animationOutTiming={100}
        >
          <View style={styles.ModelView}>
            <Text style={styles.OkdialogHeader}>{strings.okdialogHeader}</Text>
            <Text style={styles.okDialogText}>{this.props.okDialogText}</Text>

            <TouchableOpacity
              style={styles.ModalOkView}
              onPressIn={() => {
                this.toggleModalOkDialog();
              }}
            >
              <Text style={styles.ModelOkText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          isVisible={this.state.isBeneficiaryModalVisible}
          backdropOpacity={0.8}
          onBackdropPress={() => this.toggleModal()}
          onBackButtonPress={() => this.toggleModal()}
          animationIn={"fadeIn"}
          animationInTiming={500}
          animationOut={"fadeOut"}
          animationOutTiming={100}
        >
          <View
            style={{
              //  height: 100,
              borderRadius: 8,
              backgroundColor: "#f3f3f3",
              // padding: 12,
              paddingBottom: 10,
            }}
          >
            <CardView
              style={{
                // overflow: 'hidden',
                height: 45,
                width: "100%",
                borderRadius: 8,
                backgroundColor: colors.white,
                justifyContent: "center",
                alignItems: "center",
                // marginBottom : 10,
              }}
              cardElevation={2}
              cardMaxElevation={2}
              cornerRadius={8}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              // onPress={() => this.setState({ isModalVisible: true })}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "red",
                      marginLeft: 15,
                      fontSize: 15,
                      fontFamily: strings.fontMedium,
                    }}
                  >
                    Multiple Beneficiary Found!
                  </Text>
                  <Text
                    style={{
                      color: "#252525",
                      marginLeft: 15,
                      fontSize: 10,
                      fontFamily: strings.fontMedium,
                    }}
                  >
                    Select Beneficiary A/c
                  </Text>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center",
                    marginHorizontal: 10,
                  }}
                >
                  <Arrowdown height={15} width={15} />
                </View>
              </View>
            </CardView>

            <FlatList
              data={this.state.multipleBeneList}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    backgroundColor: colors.white,
                    justifyContent: "center",
                    marginHorizontal: 10,
                    marginTop: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: colors.white,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.toggleModal();
                      {
                        this.state.CommandType === "neft" ||
                          this.state.CommandType === "imps"
                          ? this.onBeneficiarySelectAccount(
                            item.BENF008,
                            item.BENF009,
                            "",
                            item.BENF006,
                            item.BENF001,
                            ""
                          )
                          : this.onBeneficiarySelectAccount(
                            item.BAC_NO,
                            item.NAME,
                            item.BACMASTCODE,
                            item.BBRANCHCODE,
                            item.BNFID,
                            item.FT_TRN_LMT
                          );
                      }
                    }}
                  >
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          marginHorizontal: 12,
                        }}
                      >
                        <View style={{ flexDirection: "column", flex: 1 }}>
                          <Text
                            style={{
                              color: "#252525",
                              padding: 10,
                              fontFamily: strings.fontBold,
                              fontSize: 12,
                            }}
                          >
                            {this.state.CommandType === "neft" ||
                              this.state.CommandType === "imps"
                              ? item.BENF009
                              : item.NAME}
                          </Text>
                          <View
                            style={{
                              borderColor: "black",
                              borderTopWidth: 1,
                              width: 215,
                              height: 1,
                              opacity: 0.1,

                              borderStyle: "solid",
                            }}
                          />
                          <Text
                            style={{
                              color: "#252525",
                              padding: 10,
                              fontFamily: strings.fontMedium,
                              fontSize: 12,
                            }}
                          >
                            A/c No:{" "}
                            {this.state.CommandType === "neft" ||
                              this.state.CommandType === "imps"
                              ? item.BENF008
                              : item.BAC_NO}
                          </Text>
                        </View>
                        <CircleIcon height={20} width={20} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </Modal>
        <Modal
          isVisible={this.state.isYesNoModalVisible}
          backdropOpacity={0.8}
          onBackdropPress={() => this.toggleModalYesNoDialog()}
          onBackButtonPress={() => this.toggleModalYesNoDialog()}
          animationIn={"fadeIn"}
          animationInTiming={500}
          animationOut={"fadeOut"}
          animationOutTiming={100}
        >
          <View style={{ backgroundColor: "white" }}>
            <Text
              style={{
                backgroundColor: colors.themeColorOrange,
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                paddingVertical: 10,
              }}
            >
              {strings.okdialogHeader}
            </Text>
            <Text
              style={{
                textAlign: "center",
                paddingVertical: 16,
                paddingHorizontal: 15,
                color: colors.black,
              }}
            >
              {this.props.okDialogText}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  borderTopColor: colors.themeColor,
                  borderTopWidth: 1,
                  paddingVertical: 12,
                  flex: 1,
                }}
                onPress={() => {
                  {
                    this.state.CommandType === "neft"
                      ? this.ConfirmRequest()
                      : this.state.CommandType === "imps"
                        ? this.ConfirmIMPSRequest()
                        : null;
                  }
                }}
              >
                <Text style={{ textAlign: "center", color: colors.black }}>
                  {strings.yes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderTopColor: colors.themeColor,
                  borderTopWidth: 1,
                  paddingVertical: 12,
                  flex: 1,
                  borderLeftWidth: 1,
                  borderLeftColor: colors.themeColor,
                }}
                onPress={() => {
                  this.toggleModalYesNoDialog();
                }}
              >
                <Text style={{ textAlign: "center", color: colors.black }}>
                  {strings.no}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <RenderLoader />
      </View>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  container1: {
    flex: 1,
    alignItems: "center",
    width: width,
  },
  header1: {
    width: width - 40,
    marginTop: -40,
  },
  LanguageIconView: {
    position: "absolute",
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F3C66",
    borderRadius: 6,
    borderStyle: "dashed",
    paddingRight: 5,
    paddingLeft: 5,
    padding: 2,
    justifyContent: "space-between",
  },
  LanguageIconContainer: {
    marginRight: 5,
  },
  langText: {
    color: "#1F3C66",
    fontWeight: "600",
  },
  renderIconContainer: {
    justifyContent: "center",
    padding: 5,
    marginRight: 10,
  },
  flatList: {
    marginTop: 10,
    width: width - 40,
  },
  microphoneContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#F4F5FA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 0.5,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 5,
    // width:500
  },
  text: {
    fontSize: 14,
    color: "#1F3C66",
    marginTop: 22,
    includeFontPadding: false,
    fontWeight: "400",
    fontFamily: "SF UI Display",
  },
  boldText: {
    fontWeight: "bold",
  },
  containerView: {
    width: width - 40,
    flex: 1,
  },
  cardContainer: {
    padding: 8,
    backgroundColor: "white",
    width: width - 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 8,
    marginLeft: 5,
    marginRight: 5,
  },
  commandContainer: {
    flexDirection: "row",
    // padding:5,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
    alignItems: "center",
    // marginBottom: 10,
    width: width - 60,
  },
  pageTitleView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // This will distribute the two child views (Text and TouchableOpacity) evenly across the container
  },
  pageTitle: {
    fontSize: RFValue(23),
    fontFamily: strings.fontBold,
    color: "#1f3c66",
    textAlign: "center",
    includeFontPadding: false,
    fontWeight: "700",
    fontFamily: "SF UI Display",
  },

  microphoneIcon: {
    width: 30,
    height: 30,
    tintColor: "#1F3C66",
  },
  mphoneIcon: {
    width: 15,
    height: 15,
    tintColor: "#1F3C66",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "black",
  },
  selectedTextStyle: {
    fontSize: 16,
    backgroundColor: "red",
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  dropdown: {
    width: "75%",
    borderColor: "gray",
    marginTop: -45,
    borderRadius: 5,
    borderWidth: 0.2,
    paddingHorizontal: 8,
    backgroundColor: "white",
    height: 40,
    paddingLeft: 15,
  },
  gauge: {
    position: "absolute",
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  gaugeText: {
    backgroundColor: "transparent",
    color: "#ffffff",
    fontSize: 18,
    fontFamily: strings.fontMedium,
  },
  CircleShape: {
    width: 20,
    height: 20,
    borderRadius: 150 / 2,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  ShowAccountStyle: {
    height: 45,
    width: "75%",
    borderRadius: 8,
    marginTop: -25,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  TitleText: {
    flex: 1,
    fontFamily: strings.fontMedium,
    fontSize: 15,
    marginTop: 10,
    marginLeft: 16,
    textAlign: "left",
  },
  row: {
    flexDirection: "row",
  },
  header: {
    flex: 1,
    padding: 10,
    backgroundColor: "lightgray",
    textAlign: "center",
    fontWeight: "bold",
  },
  container: {
    marginTop: -50,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "relative",
    zIndex: 1,
    width: width - 40,
  },
  microphoneButton: {
    width: 65,
    height: 65,
    borderRadius: 50,
    // borderWidth:1,
    backgroundColor: "#1F3C69",
    shadowColor: "rgba(31, 60, 152, 0.5)",
    shadowOpacity: 15,
    shadowRadius: 0.8,
    elevation: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  wavesContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  wave: {
    position: "absolute",
    backgroundColor: "#1F3C66",
  },
  waveAnimated: (index, animation) => ({
    width: 80 + index * 25,
    height: 80 + index * 25,
    borderRadius: 50 + index * 12.5,
    opacity: 0.5 - index * 0.1,
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1.2],
        }),
      },
    ],
  }),
  rightText: {
    fontSize: 11,
    color: "#252525",
    fontWeight: "400",
  },
  leftText: {
    fontSize: 14,
    color: "#1F3C66",
    fontWeight: "700",
    fontFamily: "SF UI Display",
    textAlign: "left",
    opacity: 0.8,
  },
  moreCmdOption: {
    fontSize: 10,
    fontFamily: strings.fontBold,
    color: "#FF5936",
    includeFontPadding: false,
    fontWeight: "800",
    fontFamily: "SF UI Display",
  },
  NoteView: {
    width: width - 40,
    borderRadius: 10,
    borderColor: "black",
    backgroundColor: "#e8f1f8",
    alignItems: "center",
    marginTop: 10,
  },
  NoteText: {
    fontSize: 14,
    fontFamily: strings.fontBold,
    color: "#1F3C66",
    //  marginTop: 20,
    includeFontPadding: false,
    fontWeight: "500",
    fontFamily: "SF UI Display",
    padding: 5,
  },
  ModelView: {
    backgroundColor: "white",
  },
  OkdialogHeader: {
    backgroundColor: colors.themeColorOrange,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
  },
  okDialogText: {
    textAlign: "center",
    paddingVertical: 16,
    paddingHorizontal: 15,
    color: colors.black,
  },
  ModalOkView: {
    borderTopColor: colors.themeColor,
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  ModelOkText: {
    textAlign: "center",
    color: colors.black,
  },
  voiceAssistantImage: {
    width: width - 100,
    height: width - 100,
    alignSelf: "center",
  },
  outerContainer: {
    width: width - 60,
    flex: 1,
  },
  nestedContainer: {
    width: width - 60,

    marginTop: 20,
  },
  recognizedContainer: {
    width: width - 60,
    borderRadius: 10,
    borderColor: "#E1E1E1",
    alignItems: "center",

    borderWidth: 1,
    justifyContent: "center",
  },
  recViewContainer: {
    width: width - 60,
    // flex: 1.2,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  recognizedText: {
    fontSize: 18,
    fontFamily: "SF UI Display",
    fontWeight: "800",
    color: "#1F3C66",
    padding: 10,
    textAlign: "center",
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(SpeakScreen);