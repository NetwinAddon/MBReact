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
} from '../../../App';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';


import OtpInputs from 'react-native-otp-inputs';

import {_toEncrypt} from '../../../common/util';
import TrasnperantFixedHeader from '../../../components/TrasnperantFixedHeader';
class StandingInstructionsOTP extends Component {
 constructor(props) {
  super(props);
  console.log('OTPForFundTransferProps======', this.props.route.params);
  this.state = {
   otp: '',
   transPin: '',
   otp_length: '',
   isTransactionPin: true,
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
         source={require('../../../assets/images/graphic-img-03.png')}
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
         onPress={() => navigation.navigate(this, 'StandingInstructionsSuccess')}
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

export default connect(mapStateToProps, mapDispatchToProps)(StandingInstructionsOTP);
