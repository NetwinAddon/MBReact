//  RGP

import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  FlatList,
  StyleSheet,
  PermissionsAndroid,
  Alert,
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
  config,
  RenderOkDialog,
  RenderLoader,
} from "../../../../App";
import xml2js from "react-native-xml2js";
import Arrowdown from "../../../../assets/icons/dashboardIcons/arrow_down.svg";
import { TextInput } from "react-native-paper";
import Balance from "../../../../assets/icons/Balance.svg";
import MSEDCL from "../../../../assets/icons/MSEDCL.svg";
import CheckBox from "@react-native-community/checkbox";

//import { TouchableOpacity } from 'react-native-gesture-handler';
import TransparentFixedHeader from "../../../../components/TrasnperantFixedHeader.js";
import CardView from "react-native-cardview";
import { ScrollView } from "react-native-gesture-handler";
import Airtel from "../../../../assets/icons/Airtel.svg";
import Arrow from "../../../../assets/icons/Vectorarrow.svg";
import DownArrow from "../../../../assets/icons/down-arrow.svg";
import { selectAccount } from "../../../../components/CustomPopups";
import { SimOperatorPop } from "../../../../components/SimOperatorPop";
import { ConfirmAmountPopup } from "../../../../components/ConfirmAmountPopup.js";
import { CustomPopupsRecharge } from "../../../../components/CustomPopupsRecharge.js";
import BBPS from "../../../../assets/icons/BBPS_Logo.svg";
import MyValidator from "../../../../common/MyValidator.js";
import Constants from "../../../../common/Constants.js";
import { _toEncrypt, decryptData, sendData } from "../../../../common/util.js";
import APIUrlConstants from "../../../../common/APIUrlConstants.js";
import Snackbar from "react-native-snackbar";
import { DialogInsufficientBalance } from "../../../../components/Dialog_InsufficientBalance.js";
import { DropdownPopup } from "../../Deposit/DropdownPopup.js";
const bankData = [
  {
    ifsc: "SBI0001234",
    name: "State Bank of India",
    address: "Pawan Nagar, Nashik",
  },
  {
    ifsc: "BOB1234",
    name: "Bank of baroda",
    address: "Pawan Nagar, Nashik",
  },
  // Add more bank data entries as needed
];

class DTHBillPayment extends Component {
  constructor(props) {
    super(props);
    console.log("reqqqqqqqqq", this.props.route.params.ResJSON);

    //var name = this.props.route.RGP;

    this.RechargePlans = [
      {
        RechargeAmount: "151",
        Date: "5th Nov 2023",
        Time: "07:11 PM",
        validity: "3 day",
      },
      {
        RechargeAmount: "299",
        Date: "30th Dec 2023",
        Time: "08:19 AM",
        validity: "7 day",
      },
      {
        RechargeAmount: "666",
        Date: "15th Oct 2023",
        Time: "02:11 PM",
        validity: "27 day",
      },

      // Add more user data as needed
    ];
    this.chkdata = [
      { label: "Base Bill Amount" },
      { label: "Late Payment Fee" },
      { label: "Fixed Charges" },
      { label: "Additional Charges" },
    ];

    this.accData = [
      { label: "011445252360", value: "1" },
      { label: "012585252360", value: "2" },
      { label: "011445258460", value: "3" },
    ];

    this.accData = [
      { label: "Cash", value: "1" },
      { label: "Internet Banking", value: "2" },
      { label: "Debit Card", value: "3" },
      { label: "Credit Card", value: "4" },
      { label: "Prepaid Card", value: "5" },
      { label: "IMPS", value: "6" },
      { label: "UPI", value: "7" },
      { label: "Wallet", value: "8" },
      { label: "NEFT", value: "9" },
    ];

    this.state = {
      BillerFetchRequirement: this.props.route.params.BillerFetchRequirement,
      isDebitAcc: false,
      InsufficientBalanceDialog: false,
      checkedItemTags: [],
      isCheckedBaseBillAMT: false,
      CheckboxAMT: [],
      BillDetails: this.props.route.params.ResJSON,
      BillAMT: this.props.route.params.ResJSON.AMOUNT,
      ConsumerNum: this.props.route.params.ConsumerNum,
      AMOUNTOPTIONS: this.props.route.params.ResJSON.AMOUNTOPTIONS,
      checkedItems: {},
      isModalVisible: false,
      isModalVisible1: false,
      isStateModalVisible: false,
      selectedValue: "option1",
      //  operaterName: this.OperatorsList.length > 0 ? 'Select Operator' : '',
      labelText: "",
      amount: "",
      AC_NO: this.props.route.params.ACC_NO,
      remark: "",
      searchTerm: "",
      searchTermAct: 0,
      searchPerformed: false,
      constactsNumbers: [],
      confirmDialog: false,
      CCFAMT: "0.0",
      TransPIN: "",
      TransPINError: "",
      accData: this.accData[0].label,
    };
  }

  onSelectDebitAccount = (value) => {
    this.setState({ isDebitAcc: false, accData: value });
  };

  componentDidMount() {
    console.log(
      "ddddddddddddddddddddddd" + JSON.stringify(this.state.checkedItemTags)
    );
    if (this.state.BillerFetchRequirement !== "NOT_SUPPORTED") {
      this.xmlToJSON();
    }
  }

  xmlToJSON = () => {
    xml2js.parseString(this.state.AMOUNTOPTIONS, (error, result) => {
      if (error) {
        console.error(error);
      } else {
        this.setState({ CheckboxAMT: result.billerResponse.amountOptions[0] });
        console.log(
          result.billerResponse.amountOptions[0].option[0].amountValue
        );
      }
    });
  };

  toggleBaseAMTCheckbox = () => {
    console.log(
      "isCheckedBaseBillAMT===========" + this.state.isCheckedBaseBillAMT
    );
    this.setState((prevState) => ({
      isCheckedBaseBillAMT: !prevState.isCheckedBaseBillAMT,
    }));
  };

  bgImage = appThemeConfiguration(config.themeColor).bgImg;

  hideDialog = () => {
    this.setState({ confirmDialog: false });
  };

  onBackAction() {
    navigation.goBack(this);
  }
  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton = () => {
    navigation.goBack(this);
    return true;
  };

  toOwnAccTransfer() {
    navigation.navigate(this, "ownAccTransferScreen");
    console.log("hellooooo");
  }

  toReview() {
    navigation.navigate(this, "quickPayWithinBankOtherAccount");
  }

  onSelectOperator = (value) => {
    console.log("valueeeeeeeeee" + value);
    {
      value !== "" || value !== "undefined"
        ? console.log("true")
        : console.log("false");
    }
    this.setState({ isModalVisible: false, operaterName: value });
    console.log("state.isModalVisible", this.state.isModalVisible, value);
    // renderWelcomeMsg()
  };

  PressOK = () => {
    this.setState({ InsufficientBalanceDialog: false });
  };

  onSelectState = (value) => {
    console.log("valueeeeeeeeee" + value);
    {
      value !== "" || value !== "undefined"
        ? console.log("true")
        : console.log("false");
    }
    this.setState({ isModalVisible: false, operaterName: value });
    console.log("state.isModalVisible", this.state.isModalVisible, value);
    // renderWelcomeMsg()
  };

  onPayBill() {
    var result = this.isValidate();
    console.log(
      "==================================" +
      JSON.stringify(this.state.checkedItemTags)
    );
    if (result) {
      var acBalance = 0;

      acBalance = this.props.route.params.Selected_Balance.replace("-", "");

      const TotalAmt = parseFloat(this.state.BillAMT);

      console.log("TotalAmt== " + TotalAmt);

      if (acBalance < TotalAmt) {
        this.setState({ InsufficientBalanceDialog: true });
      } else {
        this.payElectricityBill();
      }
    }
  }

  payElectricityBill = async () => {
    const simid = "00000000-05ec-ff6b-0000-00005659f38b";

    const Headers = {
      ProdCD: Constants.ProdCD,
      BankCD: Constants.BankCode,
      OprCD: "PUTBILLPAYREQ",
      Content_Type: "application/json",
      REQ_TYPE: "POST",
    };

    let amountTags = "";

    this.state.checkedItemTags.forEach((item) => {
      const label = item.LabelName[0];
      const amount = item.amountValue[0];

      // Generate XML tags with dynamic content
      const amountTag =
        "<amountTag>" +
        label +
        "</amountTag>" +
        "<value>" +
        +amount +
        "</value>";

      // Append the generated XML tag to the existing amountTags string
      amountTags += amountTag;
    });

    // const BILLERPARAMLIST = this.state.BillDetails.map(item => JSON.parse(item.replace(/\\/g, '')));
    // console.log("BILLERPARAMLIST:- " + JSON.stringify(BILLERPARAMLIST));
    const jsonReq = {
      BILLERPARA: this.props.route.params.BillerParaList,
      CUSTOMER_ID: Constants.GMST_CODE,
      BILLERID: this.props.route.params.BILLERID,
      BILLERSRNO: this.props.route.params.BILLERSRNO,
      CORP_ID: Constants.BankCode,
      SEC_KEY: Constants.SecretKey,
      ACMASTCODE: this.props.route.params.ACMASTCODE,
      AC_NO: this.props.route.params.ACC_NO,
      GMSTCODE: Constants.GMST_CODE,
      MOBILENO: this.props.route.params.MobNum,
      BRANCHCODE: Constants.BRANCH_CODE,
      REQ_TYPE: "BILLPAY",
      BILLAMT: "0",
      divId: this.props.DeviceId,
      secKey: Constants.SecretKey,
      TrnPin: this.state.TransPIN,
      BBPSREQSRNO: this.state.BillDetails.BBPSREQSRNO,
      CCFAMOUNT: this.state.CCFAMT,
      OPTAMOUNT: this.state.BillAMT.toString(),
      AMOUNTTAGS: amountTags,
      DEVICE_LATTIDUTE: "",
      DEVICE_LONGITUDE: "",
      DEVICE_LOCAL_IP: "",
      DEVICE_PUBLIC_IP: "",
      DEVICE_ISP_OPERATOR: "",
      SIMNO: simid,
      bankCode: Constants.BankCode,
      customerId: Constants.GMST_CODE,
    };
    console.log("finalRes111111111111111111111" + JSON.stringify(jsonReq));
    let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));

    const Body = {
      PARACNT: "1",
      PARA1_TYP: "STR",
      PARA1_VAL: JSON.stringify(jsonValue),
    };

    sendData(
      this,
      "post",
      APIUrlConstants.BASE_URL,
      Headers,
      JSON.stringify(Body),
      async (obj, response) => {
        var responseData = await decryptData(response);
        var newRes = responseData.slice(16);

        var finalRes = JSON.parse(newRes);


        if (finalRes.SUCCESS === "TRUE") {
          this.props.navigation.navigate("electricityBillPaySuccess", {
            PaymentMode: this.state.accData,
            TXNREFID: finalRes.TXNREFID,
            BillAMT: this.state.BillAMT,
            ActualAMT: this.props.route.params.ResJSON.AMOUNT,
            CCFAMT: this.state.CCFAMT,
          });
          const Msg = finalRes.RESULT;
          Snackbar.show({
            text: Msg,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "green",
          });
        } else {
          const Msg = finalRes.RESULT;
          // // ToastAndroid.show(Msg, ToastAndroid.SHORT)
          Snackbar.show({
            text: Msg,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "red",
          });

          // this.props.navigation.replace('loginTypeSelectScreen')
        }
      }
    );
  };

  isValidate() {
    var result = true;
    this.setState({ TransPINError: "" });
    if (!MyValidator.isEmptyField(this.state.TransPIN).isValid) {
      this.setState({ TransPINError: "Please Enter Transaction PIN!" });
      result = false;
    }

    return result;
  }

  toggleCheckbox = (index, amountValue, chkamountName) => {
    let amt = parseFloat(amountValue) / 100;
    let ActulBillAMT = parseFloat(this.state.BillAMT);
    let Label = chkamountName;

    if (this.state.checkedItems[index] === true) {
      console.log(amt);
      var Amount = ActulBillAMT - amt;

      this.setState({ BillAMT: Amount });
    } else {
      var Amount = ActulBillAMT + amt;

      this.setState({ BillAMT: Amount });
    }


    this.setState((prevState) => {
      const newCheckedItems = { ...prevState.checkedItems };
      newCheckedItems[index] = !prevState.checkedItems[index];
      return { checkedItems: newCheckedItems };
    });


    // Define the newJsonObject
    let newJsonObject = {
      'LabelName': Label,
      'amountValue': amountValue,
    };

    this.setState((prevState) => {
      const newCheckedItems = [...prevState.checkedItemTags];
      const indexToRemove = newCheckedItems.findIndex(
        (item) =>
          item.LabelName === newJsonObject.LabelName &&
          item.amountValue === newJsonObject.amountValue
      );

      if (indexToRemove !== -1) {
        newCheckedItems.splice(indexToRemove, 1);
      } else {
        newCheckedItems.push(newJsonObject);
      }


      return { checkedItemTags: newCheckedItems };
    });




  };

  renderItem = ({ item, index }) => {

    return (
      <View style={styles.checkBoxGridView}>
        <TouchableOpacity
          onPress={() =>
            this.toggleCheckbox(index, item.amountValue, item.amountName)
          }
        >
          <View style={styles.checkboxRow}>
            <CheckBox
              style={styles.checkBoxStyle}
              lineWidth={0.5}
              hideBox={false}
              boxType={"square"}
              tintColors={{ true: "#1F3C66" }}
              animationDuration={0.5}
              disabled={false}
              onAnimationType={"bounce"}
              offAnimationType={"stroke"}
              onValueChange={() =>
                this.toggleCheckbox(index, item.amountValue, item.amountName)
              }
              value={this.state.checkedItems[index]}
            />
            <Text style={styles.amountText}>
              {item.amountName}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.container}
          source={this.bgImage}
          resizeMode="cover"
        >
          <TransparentFixedHeader backAction={() => this.onBackAction()} />


          <View style={styles.headingContainer}>
            <View style={styles.innerContainer}>
              <Text style={styles.title}>Electricity Bill Pay
              </Text>
              <Text style={styles.subTitle}>Select Your Electricity Provider
              </Text>
            </View>
          </View>

          <View style={styles.containerView1}>
            <View style={styles.headerView}>
              <View style={styles.textContainer}>
                <Text style={styles.username}>{"Bill Payment"}</Text>
              </View>

              <View>
                <BBPS />
              </View>
            </View>

            {this.state.confirmDialog === true ? (
              <ConfirmAmountPopup
                isVisible={this.state.confirmDialog}
                isDisabled={this.hideDialog}
                MobileNumber={this.props.route.params.mobno}
                BillAmt={parseFloat(this.state.confirmDepositAmount)}
                charges={1.5}
                from={"DTH"}
              />
            ) : null}

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={styles.containerView}>
                <View style={styles.InputBoxDesign}>
                  <View style={styles.touchableOpacity}>
                    <View style={styles.container}>
                      <Text style={styles.selectedHeadingText}>
                        Select Account
                      </Text>
                      <Text style={styles.selectedText}>
                        {this.state.AC_NO}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.billFetchCard}>
                  <View style={styles.billFetchCardView}>
                    <View style={styles.container}>
                      <View style={styles.simIcon}>
                        <Image
                          source={this.props.route.params.LOGO}
                          style={styles.iconStyle} />
                      </View>
                    </View>

                    <View style={styles.textContainer}>
                      <Text style={styles.providerName}>
                        {this.props.route.params.ProviderName}
                      </Text>
                      <Text style={styles.idText}>
                        ID: {this.props.route.params.ID}{" "}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={styles.billFetchDetails}
                  >
                    <View style={styles.container}>
                      <Text style={styles.consumerNo}>Consumer No:</Text>
                      <Text style={styles.consumerNo}>Consumer Name:</Text>
                      <Text style={styles.consumerNo}>Bill Date:</Text>
                      <Text style={styles.consumerNo}>Bill Period:</Text>
                      <Text style={styles.consumerNo}>Bill Number:</Text>
                      <Text style={styles.consumerNo}>Bill Due Date:</Text>
                      <Text style={styles.consumerNo}>Payee Number:</Text>
                    </View>
                    <View style={styles.container}>
                      <Text style={styles.consumerNo}>{Constants.MobileNumber}</Text>
                      <Text style={styles.consumerNo}> {this.state.BillDetails.CUSTOMERNAME}</Text>
                      <Text style={styles.consumerNo}>{this.state.BillDetails.BILLDATE}</Text>
                      <Text style={styles.consumerNo}>{this.state.BillDetails.BILLPERIOD}</Text>
                      <Text style={styles.consumerNo}>{this.state.BillDetails.BILLNUMBER} </Text>
                      <Text style={styles.consumerNo}>{this.state.BillDetails.DUEDATE}</Text>
                      <Text style={styles.consumerNo}>{this.props.route.params.MobNum}</Text>
                    </View>
                  </View>
                  <View>
                    <Text></Text>
                  </View>
                </View>

                <FlatList
                  data={this.state.CheckboxAMT.option}
                  renderItem={this.renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={2}
                  style={styles.flatListStyle}
                />

                <TouchableOpacity onPress={this.toggleBaseAMTCheckbox}>
                  <View style={styles.checkboxView} >
                    <CheckBox
                      style={styles.checkBoxStyle}
                      lineWidth={0.5}
                      hideBox={false}
                      boxType={"square"}
                      tintColors={{ true: "#1F3C66" }}
                      animationDuration={0.5}
                      disabled={false}
                      onAnimationType={"bounce"}
                      offAnimationType={"stroke"}
                      onValueChange={this.toggleBaseAMTCheckbox}
                      value={this.state.isCheckedBaseBillAMT}
                    />
                    <Text style={styles.checkBoxText}  >
                      Base Bill Amount
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.amtView}>
                  <View style={styles.itemContainer}>
                    <Text style={styles.label}>
                      Total Bill Amount
                    </Text>
                    <Text style={styles.amount}>
                      ₹ {this.state.BillAMT}
                    </Text>
                  </View>
                  {this.state.isCheckedBaseBillAMT === true ? (
                    <View style={styles.additionalInfoContainer}>
                      <Text style={styles.additionalInfoText}>
                        Bill Amount :{" "}
                        {strings.rupee +
                          parseFloat(this.props.route.params.ResJSON.AMOUNT)}
                      </Text>

                      <Text style={styles.additionalInfoText}>
                        CCF Amount : {strings.rupee + this.state.CCFAMT}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.InputBoxDesign}>
                  <TouchableOpacity
                    style={styles.touchableOpacity}
                    onPress={() =>
                      this.setState({
                        isDebitAcc: true,
                        labelText: " Select Payment Mode",
                      })
                    }
                  >
                    <View style={styles.container}>
                      <Text style={styles.selectedHeadingText}>
                        {"Select Payment Mode"}
                      </Text>
                      <Text style={styles.selectedText}>
                        {this.state.accData}
                      </Text>
                    </View>

                    <View style={styles.arrowIcon}>
                      <Arrowdown height={15} width={15} />
                    </View>
                  </TouchableOpacity>
                </View>
                {DropdownPopup(
                  this.state.isDebitAcc,
                  this.accData,
                  this.onSelectDebitAccount,
                  this.state.labelText,
                  this.state.accData
                )}

                <View style={styles.textInputContainer}>
                  <TextInput
                    style={styles.inputBox}
                    theme={{
                      colors: {
                        placeholder: "#DFE1E8",
                        text: this.props.textColor,
                        primary: this.props.themeColor,
                        underlineColor: "transparent",
                        background: "white",
                      },
                      roundness: 8,
                    }}
                    label="Transaction PIN"
                    keyboardType="numeric"
                    value={this.state.depositAmount}
                    onChangeText={(TransPIN) => {
                      this.setState({ TransPIN });
                    }}
                    mode="outlined"
                  />
                  {this.state.TransPINError !== "" && (
                    <Text style={styles.ErrorDisplay}>
                      {this.state.TransPINError}
                    </Text>
                  )}
                </View>

                <CardView
                  cardElevation={2}
                  cardMaxElevation={2}
                  cornerRadius={12}
                  style={styles.cardContainer}
                >
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.onPayBill()}
                  >
                    <Text style={styles.buttonText}>
                      Bill Pay
                    </Text>
                  </TouchableOpacity>
                </CardView>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
        <RenderLoader />
        {
          /* InsufficentBalance Dialog */
          DialogInsufficientBalance(
            this.state.InsufficientBalanceDialog,
            this.PressOK,
            this.props.SecondaryColor
          )
        }
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DTHBillPayment);

const styles = StyleSheet.create({
  InputBoxDesign: {
    height: 48,
    width: width - 50,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DFE1E8",
  },
  touchableOpacity: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectedHeadingText: {
    color: colors.accTextColor + '80',
    marginLeft: 15,
    fontSize: 10,
    fontFamily: strings.fontMedium
  },
  billFetchCard: {
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "rgba(31, 60, 102, 1)",
    shadowRadius: 20,
    elevation: 10,
    shadowOpacity: 0.5,
    flex: 1,
    width: width - 30,
    marginTop: 20,
  },
  billFetchCardView: {
    flexDirection: 'row',
    padding: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
    width: width - 50,
  },
  selectedText: {
    color: colors.accTextColor,
    marginLeft: 15,
    fontSize: 15,
    fontFamily: strings.fontMedium
  },
  textInputContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  inputBox: {
    lineHeight: 40,
    height: 48,
    width: width - 50,
    marginTop: 10,
  },

  arrowIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
  },
  headingContainer: {
    flex: 0.15,
  },
  innerContainer: {
    marginLeft: 25,
    marginTop: 15,
  },
  title: {
    fontSize: 22,
    textAlign: 'left',
    fontFamily: strings.fontBold,
    color: colors.white,
  },
  subTitle: {
    fontSize: 15,
    textAlign: 'left',
    fontFamily: strings.fontMedium,
    color: colors.white,
  },
  simIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 0.5,
    elevation: 2,
    marginLeft: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  iconStyle: { width: '100%', height: '100%' },
  containerView1: {
    flex: 0.85,
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  headerView: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    width: width - 50,
    marginTop: 5,
  },
  textContainer: {
    flex: 3.5,
  },
  providerName: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "SF UI Display",
    color: "#000",
    textAlign: "left",
  },
  idText: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "SF UI Display",
    color: "#929cac",
    textAlign: "left",
    width: 130,
  },
  billFetchDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
  },
  scrollView: { width: '100%', flex: 1 },
  consumerNo: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "SF UI Display",
    color: "rgba(0, 0, 0, 0.5)",
    textAlign: "left",
  },
  flatListStyle:
  {
    flex: 1,
    marginTop: 15
  },
  checkboxView:
  {
    justifyContent: "flex-start",
    width: width - 50,
    flexDirection: "row",
  },
  checkBoxStyle:
  {
    height: 20
  },
  checkBoxText:
  {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "SF UI Display",
    color: "#686868",
    textAlign: "left",
    marginLeft: 5,
  },
  amtView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: width - 60,
    marginTop: 20,
    marginBottom: 15,
  },
  itemContainer: {
    flex: 1,
    padding: 5,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    fontFamily: "SF UI Display",
    color: "rgba(0, 0, 0, 0.75)",
    textAlign: "left",
  },
  amount: {
    fontSize: 26,
    fontWeight: "700",
    fontFamily: "SF UI Display",
    color: "#1f3c66",
  },
  additionalInfoContainer: {
    flex: 1,
    backgroundColor: "rgba(246, 246, 246, 1)",
    borderRadius: 10,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    width: width - 20,
  },
  additionalInfoText: {
    fontSize: 11,
    fontWeight: "500",
    fontFamily: "SF UI Display",
    color: "rgba(0, 0, 0, 0.75)",
  },
  containerView: {
    width: width - 50,
    alignItems: 'center'
  },
  ErrorDisplay: {
    color: "#FF0000",
    marginLeft: 5,
    fontSize: 12,
    marginTop: 3,
  },
  cardContainer: {
    backgroundColor: "gray",
    justifyContent: "center",
    marginVertical: 20,
  },
  button: {
    padding: 15,
    width: width - 50,
    backgroundColor: colors.btnColor,
    justifyContent: "center",
    borderRadius: 12,
  },
  buttonText: {
    alignSelf: "center",
    color: "white",
    fontFamily: strings.fontRegular,
    fontSize: 15,
  },
  checkBoxGridView: {
    flexDirection: "row",
    width: width / 2,
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: "row",
  },
  amountText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "SF UI Display",
    color: "#686868",
    textAlign: "left",
    marginLeft: 5,
  },
});
