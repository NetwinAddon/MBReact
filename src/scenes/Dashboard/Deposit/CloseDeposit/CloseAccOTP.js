import React, {Component} from 'react';
import {
 Text,
 View,
 Image,
 ImageBackground,
 Platform,
 KeyboardAvoidingView,
 Keyboard,
 ToastAndroid,
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
 config,
 sendData,
} from '../../../../App';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';


import OtpInputs from 'react-native-otp-inputs';

import {_toEncrypt} from '../../../../common/util';
import TrasnperantFixedHeader from '../../../../components/TrasnperantFixedHeader';
class CloseAccOTP extends Component {
 constructor(props) {
  super(props);
  console.log('OTPForFundTransferProps======', this.props.route.params);
  this.state = {
   otp: '',
   transPin: '',
   otp_length: '',
   isTransactionPin: true,
   //    callFrom: this.props.route.params.from,
   //  amount: this.props.route.params.amount,
   // fromAcc: this.props.route.params.fromAcc,
   // benificiaryAcc: this.props.route.params.toAcc,
   // fromAccAcmastCode: this.props.route.params.fromAccAcmastCode,
   // beneficiaryAccAcmastCode: this.props.route.params.beneficiaryAccAcmastCode,
   // trnId: this.props.route.params.trnId,
   // fromAccName: this.props.route.params.fromAccName,
   // beneficiaryAccName: this.props.route.params.beneficiaryAccName,
  };
 }
 componentDidMount() {}
 onBackAction() {
  navigation.goBack(this);
 }
 toSuccess() {
  navigation.navigate(this, 'FundTransferSuccess', {from: this.state.callFrom});
 }
 toCallSubmit() {
  const {fromAcc, benificiaryAcc, amount, remark} = this.state;
  //pass reference of this and string which we want to show in okdialog
  if (fromAcc == '' && benificiaryAcc == '' && amount == '' && remark == '') {
   console.log('Please enter all field');
  } else {
   navigation.navigate(this, 'FundTransferSuccess', {from: this.state.callFrom});
  }
 }

 // SubmitApiCall = async () => {
 //     console.log("Param: ", this.props.gmstCode, this.state.fromAccAcmastCode, Constants.SecretKey, this.state.fromAcc, Constants.BankCode)
 //     let otpEncrypt = md5(this.state.otp.code);
 //     const Headers =
 //     {
 //         ProdCD: Constants.ProdCD,
 //         BankCD: Constants.BankCode,
 //         OprCD: 'SNDSLFFTREQ',
 //         Content_Type: 'application/json',
 //         REQ_TYPE: 'POST'
 //     };
 //     const Body =
 //     {
 //         PARACNT: "1",
 //         PARA1_TYP: "STR",
 //         PARA1_VAL: "{\"customerId\":\"" + Constants.GMST_CODE+ "\",\"secKey\":\"" + Constants.SecretKey + "\",\"acNo\":\"" + this.state.fromAcc + "\",\"acMastCode\":\"" + this.state.fromAccAcmastCode + "\",\"branchCd\":\"MBR02\",\"bankCode\":\"" + Constants.BankCode + "\",\"neftTrnId\":\"" + this.state.trnId + "\",\"Otp\":\"" + otpEncrypt + "\",\"TrnPin\":\"" + this.state.transPin + "\",\"benAcc\":\"" + this.state.benificiaryAcc + "\",\"amt\":\"" + this.state.amount + "\",\"debit_gl\":\"" + this.state.fromAccName + "\",\"credit_gl\":\"" + this.state.beneficiaryAccName + "\"}"
 //     }

 //     console.log("Otp URL:- " + APIUrlConstants.BASE_URL);
 //     console.log("");
 //     console.log("Otp Api:- " + JSON.stringify(Body));
 //     console.log("");

 //     sendData(this,
 //         'post',
 //         APIUrlConstants.BASE_URL,
 //         Headers,
 //         JSON.stringify(Body),
 //         async (obj, response) => {
 //             var responseData = response

 //             console.log("Otp Api Response:- " + JSON.stringify(responseData));

 //             let res = response.SUCCESS
 //             if (res === "FALSE") {

 //                 // if(response.toLowerCase().includes('RESULT'))
 //                 // {
 //                 const ErrorMsg = response.RESULT
 //                 // ToastAndroid.show(ErrorMsg, ToastAndroid.SHORT)
 //                 Snackbar.show({
 //                     text: ErrorMsg,
 //                     duration: Snackbar.LENGTH_SHORT,
 //                     backgroundColor:'red'
 //                   });
 //                 // }
 //             }
 //             else if (res === "TRUE") {
 //                 //this.toSuccess()
 //                 console.log("refNo: ", responseData.RESULT);
 //                 const result = responseData.RESULT;
 //                 const match = result.match(/\b(\d+)\b/);
 //                 const referenceNumber = match ? match[1] : null;
 //                 var refNo = result.split('SELF FT TRANSACTION SUCCESSFUL WITH REF NO');
 //                 console.log("refNo: ", referenceNumber)
 //                 navigation.navigate(this, 'FundTransferSuccess', { from: this.state.callFrom, refNo: referenceNumber })
 //             }

 //         })

 // }
 bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg;
 render() {
  return (
   <View style={{flex: 1}}>
    <ImageBackground style={{flex: 1}} source={this.bgImage} resizeMode='cover'>
     <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : ''}
      // keyboardVerticalOffset={Platform.OS === 'ios' ? 89 : 0}
      enabled={true}
     >
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
       <TrasnperantFixedHeader backAction={() => this.onBackAction()} />
       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
         source={require('../../../../assets/images/graphic-img-03.png')}
         style={{
          height: 250,
          width: 250,
          // flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // paddingBottom: 10,
          marginBottom: 10,
          // backgroundColor : 'blue'
         }}
         resizeMode={Platform.OS === 'android' ? 'center' : 'contain'}
        />
       </View>
      </View>
      <View
       style={{
        alignItems: 'center',
        // justifyContent: 'flex-end',
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column',
        paddingBottom: '30%',
       }}
      >
       {/* for otp */}
       <Text
        style={{
         width: width - 50,
         marginTop: 60,
         fontSize: 25,
         textAlign: 'center',
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
         alignItems: 'center',
         justifyContent: 'center',
         marginVertical: 10,
         // backgroundColor : 'red'
        }}
       >
        <OtpInputs
         caretHidden={false} // cusrsor
         handleChange={(code) => {
          this.setState({otp: {code: code.replace(/[^0-9]/g, '')}});
          this.setState({otp_length: code});
          console.log('Otp: ', code);
          console.log('otp_length: ', this.state.otp_length.length);
         }}
         numberOfInputs={6}
         keyboardType='numeric' // This allows only numbers
         secureTextEntry={true}
         inputContainerStyles={{
          height: 45,
          width: 45,
          margin: 5,
          borderWidth: 1,
          justifyContent: 'center',
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
          textAlign: 'center',

          color: this.props.textColor,
         }}
         selectionColor={this.props.themeColor}
        />
       </View>

       <CardView
        cardElevation={this.state.otp.length >= 3 ? 3 : 0}
        cardMaxElevation={3}
        cornerRadius={12}
        style={{
         backgroundColor: 'white',
         justifyContent: 'center',
         marginTop: 20,
        }}
       >
        {console.log('Otp_lenght: ', this.state.otp_length.length)}
        {/* {console.log("transPin_lenght: ",this.state.transPin.length)} */}
        <TouchableOpacity
         style={{
          // marginBottom : 10,
          padding: 15,
          width: width - 40,
          backgroundColor: colors.btnColor,
          backgroundColor: this.state.otp_length.length >= 3 ? colors.btnColor : colors.btnDisable,
          justifyContent: 'center',
          borderRadius: 12,
         }}
         disabled={this.state.otp_length.length >= 3 ? false : true}
         onPress={() => this.props.navigation.navigate('closeDepositSuccess')}
        >
         <Text
          style={{
           alignSelf: 'center',
           color: this.state.otp_length.length >= 3 ? colors.white : colors.btnDisableTextColor,
           fontFamily: strings.fontRegular,
           fontSize: 15,
          }}
         >
          {strings.submit}
         </Text>
        </TouchableOpacity>
       </CardView>

       {/* <TouchableOpacity
                                style={{
                                    marginVertical: 10,
                                }}>

                                <Text style={{
                                    fontSize: 15,
                                    color: 'black',
                                    textAlign: 'left',
                                    fontFamily: strings.fontMedium,
                                    color: this.props.themeColor,
                                }}>{strings.forgotMpin}
                                </Text>
                            </TouchableOpacity>

                            <View style={{ alignItems: 'flex-end', }}>
                                <Footer height={70} width={300} />
                            </View> */}
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
  backgroundColor: '#F3F8FF',
  marginTop: 5,
  width: 45,
  height: 45,
  borderRadius: 8,
  borderWidth: 1,
 },
};

export default connect(mapStateToProps, mapDispatchToProps)(CloseAccOTP);
