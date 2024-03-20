import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
} from 'react-native';
import {
  colors,
  strings,
  connect,
  mapStateToProps,
  mapDispatchToProps,
  width,
  navigation,
  appThemeConfiguration,
  sendData,
  RenderLoader,
} from '../../../App';
import Arrowdown from '../../../assets/icons/dashboardIcons/arrow_down.svg';
import { ScrollView } from 'react-native-gesture-handler';


import Constants from '../../../common/Constants';
import { QuickPayCustomPopupDropDownForLoan } from '../../../components/QuickPayCustomPopupDropDownForLoan';
import Snackbar from 'react-native-snackbar';
import TrasnperantFixedHomeHeader from '../../../components/TrasnperantFixedHomeHeader';
import NetInfo from '@react-native-community/netinfo';
import { KeyboardAvoidingView } from 'react-native';
import MyValidator from '../../../common/MyValidator';
import APIUrlConstants from '../../../common/APIUrlConstants';
import { selectAccount } from '../../../components/CustomPopups';
import { DropdownPopup } from '../Deposit/DropdownPopup';
class LoanInterestRate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      labelText: '',
      callFrom: this.props.route.params.from,
      accounList: props.route.params.dashboardArray,
      myJsonArray: [],
      interestRateArray: [],
      selectAccType: '',
      selectedAcmastCode: ''
    };
  }
  componentDidMount() {
    this.CallGLService();

  }
  bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg;
  
  onBackAction() {
    navigation.goBack(this);
  }
  
  

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    navigation.goBack(this);

    return true;
  };

  onSelectAccount = (value, item) => {
    console.log("SelectIte,: " + JSON.stringify(item))
    this.setState({ selectAccType: item.label, isModalVisible: false, selectedAcmastCode: item.acmastcode });
    this.InterestRateDisplay(item.acmastcode)
  };




  toCallSubmit() {
    const result = this.ValidateForm();
    if (result) {
      navigation.navigate(this, 'LoanInterestRateDetails', {interestRateArray : this.state.interestRateArray})
    }



  }

  checkInternetConnection = async () => {
    try {
      const state = await NetInfo.fetch();
      const isConnected = state.isConnected;
      return isConnected;
    } catch (error) {
      return false;
    }
  };
  ValidateForm() {
    var result = true;
    if (!MyValidator.isEmptyField(this.state.selectAccType).isValid) {
      this.setState({ error_amount: 'Please select account type' });
      result = false;
    }
    return result;
  }


  CallGLService = async () => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers("LOANGLLST");
        const jsonReq =
        {
          ac_type: '2',
        }
        const Body =
        {
          PARACNT: "1",
          PARA1_TYP: "STR",
          PARA1_VAL: JSON.stringify(jsonReq),

        }
        console.log("CallGLService URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("CallGLService Body:- " + JSON.stringify(Body));
        console.log("");
        sendData(this,
          'post',
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            console.log("responseData CallGLService================", JSON.stringify(response))
            if (response.SUCCESS === "FALSE") {
            }
            else {
              const formattedData = [];

              response.Acdtls.forEach((itemString) => {
                const item = JSON.parse(itemString); // Parse the JSON-like string into an object
                const existingType = formattedData.find((data) => data.title === item.AC_NAME);
                if (existingType) {
                  existingType.data.push({
                    acmastcode: item.ACMASTCODE,
                    label: item.AC_NAME.replace('A\\C', 'A/c'),
                  });
                } else {
                  formattedData.push({
                    acmastcode: item.ACMASTCODE,
                    label: item.AC_NAME.replace('A\\C', 'A/c'),

                  });
                }
              });
              this.setState({ myJsonArray: formattedData, selectAccType: formattedData[0].label, selectedAcmastCode: formattedData[0].acmastcode })
              this.InterestRateDisplay(formattedData[0].acmastcode)
            }
          })

      } catch (error) {
      }
    }
    else {
      Snackbar.show({ text: 'Check Internet Connection', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
    }
  }

  InterestRateDisplay = async (acmastcode) => {
    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers("CLLAPIDET");
        const jsonReq =
        {
          CATAGARY_INFO: 'CIRDET',
          CALLFROM: 'NETBNK',
          ACCMOBILENO: Constants.MobileNumber,
          GL_HEAD_ID: acmastcode,
          INSUBTYPE: '',
          CUSTOMERID: Constants.GMST_CODE,
          DEPOSITACCNO: '0'
        }
        const Body =
        {
          PARACNT: "5",
          PARA1_TYP: "STR",
          PARA1_VAL: Constants.GMST_CODE,
          PARA2_TYP: "STR",
          PARA2_VAL: JSON.stringify(jsonReq),
          PARA3_TYP: "STR",
          PARA3_VAL: Constants.BankCode,
          PARA4_TYP: "STR",
          PARA4_VAL: Constants.SecretKey,
          PARA5_TYP: "STR",
          PARA5_VAL: 'fetchCircularDet',

        }
        console.log("InterestRateDisplay URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("InterestRateDisplay Body:- " + JSON.stringify(Body));
        console.log("");
        sendData(this,
          'post',
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            console.log("responseData InterestRateDisplay================", JSON.stringify(response))
            if (response.SUCCESS === "FALSE") {
            }
            else {
              this.setState({interestRateArray: response})
            }
          })

      } catch (error) {
      }
    }
    else {
      Snackbar.show({ text: 'Check Internet Connection', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
    }
  }







  render() {
    return (
      <View style={styles.mainView}>
        <ImageBackground style={styles.mainView} source={this.bgImage} resizeMode='cover'>
          <KeyboardAvoidingView
            style={styles.mainView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            enabled={true}>
            <TrasnperantFixedHomeHeader backAction={() => this.onBackAction()} />
            <View style={styles.lableHeader}>
              <View style={styles.lableHeaderView}>
                <Text style={styles.ftToOtherBankTitle}>Loan Interest Rate Circular</Text>
                <Text style={styles.ftToOtherBankDescription}>Select Your Account Type</Text>
              </View>
            </View>
            <View
              style={styles.subMainView}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.mainSubView}>
                  <TouchableOpacity
                    style={styles.fromAccTouchable}
                    onPress={() => {
                      if (this.state.myJsonArray != null && this.state.myJsonArray.length > 0) {
                        this.setState({ isModalVisible: true, labelText: 'From A/c' });
                      } else {
                        Snackbar.show({
                          text: 'No record available..!!',
                          duration: Snackbar.LENGTH_SHORT,
                          backgroundColor: 'red',
                        });
                      }
                    }}>
                    <View style={styles.mainView}>
                      <Text
                        style={styles.fromAccText}>
                        From A/c
                      </Text>
                      <Text
                        style={styles.fromAccTextValue}>
                        {this.state.selectAccType}
                      </Text>
                    </View>
                    <View
                      style={styles.fromAccDropDown}>
                      <Arrowdown height={15} width={15} />
                    </View>
                  </TouchableOpacity>
                  {
                    DropdownPopup(
                      this.state.isModalVisible,
                      this.state.myJsonArray,
                      this.onSelectAccount,
                      this.state.labelText,
                      this.state.selectAccType,
                    )
                  }

                </View>
              </ScrollView>
              <View style={styles.bottomView}>
                <TouchableOpacity
                  style={styles.backButtonTouchable}
                  onPress={() => {this.toCallSubmit()}}>
                  <Text style={styles.backButtonText}>Check Circular</Text>
                </TouchableOpacity>
                <TouchableOpacity
               
                  onPress={() => {
                    this.onBackAction();
                  }}>
                <Text style={[styles.backText, { color: this.props.SecondaryColor }]}>Back</Text></TouchableOpacity>
              </View>

            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
        <RenderLoader />
      </View>
    );
  }
}
const styles = {
  mainView:
  {
    flex: 1
  },
  lableHeader:
  {
    flex: 0.15
  },
  lableHeaderView:
  {
    marginLeft: 25,
    marginBottom: 10,
  },
  ftToOtherBankTitle:
  {
    fontSize: 20,
    textAlign: 'left',
    fontFamily: strings.fontBold,
    color: colors.white,
  },
  ftToOtherBankDescription:
  {
    fontSize: 15,
    textAlign: 'left',
    fontFamily: strings.fontMedium,
    color: colors.white,
  },
  subMainView:
  {
    flex: 0.85,
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  mainSubView:
  {
    marginTop: 50,
    height: 48,
    width: width - 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DFE1E8',
    marginBottom: 10,
  },
  fromAccTouchable:
  {
    flexDirection: 'row',
    alignItems: 'center'
  },
  fromAccText:
  {
    color: colors.accTextColor + '80',
    marginLeft: 15,
    fontSize: 10,
    fontFamily: strings.fontMedium
  },
  fromAccTextValue:
  {
    color: colors.accTextColor,
    marginLeft: 15,
    fontSize: 15,
    fontFamily: strings.fontMedium
  },
  fromAccDropDown:
  {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10
  },
  ErrorDisplay:
  {
    color: "#FF0000",
    marginLeft: 5,
    fontSize: 12
  },
  backButtonTouchable:
  {
    padding: 15,
    width: width - 50,
    backgroundColor: colors.btnColor,
    justifyContent: 'center',
    borderRadius: 12,
    alignSelf: 'center',
   

  },
  backButtonText:
  {
    alignSelf: 'center',
    color: colors.white,
    fontFamily: strings.fontRegular,
    fontSize: 15,

  },
  backText:
  {
    alignSelf: 'center',
    fontFamily: strings.fontMedium,
    fontSize: 15,
    fontWeight: '500',
    marginTop:20

  },
  bottomView:
  {
    position: 'absolute',
    bottom: 30,
    flexDirection:'column'
  }


};

export default connect(mapStateToProps, mapDispatchToProps)(LoanInterestRate);
