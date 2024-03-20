import React, {Component} from 'react';
import {Text, View, Image, ImageBackground, Platform, KeyboardAvoidingView} from 'react-native';
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
 RenderLoader,
} from '../../App';
import Footer from '../../assets/icons/footer.svg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';
import OtpInputs from 'react-native-otp-inputs';
import Snackbar from 'react-native-snackbar';
import Constants from '../../common/Constants';
import APIUrlConstants from '../../common/APIUrlConstants';
import {_toEncrypt, decryptData, sendData} from '../../common/util';
import Colors from '../../common/Colors';
import TrasnperantFixedHeader from '../../components/TrasnperantFixedHeader';

class QuickPayMpin extends Component {
 constructor(props) {
  super(props);
  this.state = {
   MPin: '',
  };
 }
 componentDidMount() {}
 onBackAction() {
  navigation.goBack(this);
 }
 toSuccess() {
  // navigation.navigate(this, 'quickPayScreen')

  this.LoginWith_Mpin();
 }

 ForgetMpin() {
  this.props.navigation.navigate('ForgetMpinOptionScreen');
 }

 LoginWith_Mpin = async () => {
  console.log('userid:- ' + this.props.userId);

  console.log('mpin:- ' + this.state.MPin);

  let userId = await _toEncrypt(this.props.userId);

  const simid = '00000000-05ec-ff6b-0000-00005659f38b';

  const Headers = APIUrlConstants.Headers('LOGIN');

  const jsonReq = {
   MPIN: this.state.MPin,
  };

  let jsonValue = JSON.stringify(jsonReq);
  console.log('Json ' + jsonValue);

  let Mpin = await _toEncrypt(jsonValue);
  console.log('Json ' + Mpin);
  const Body = {
   PARACNT: '5',
   PARA1_TYP: 'STR',
   PARA1_VAL: userId,
   PARA2_TYP: 'STR',
   PARA2_VAL: Mpin,
   PARA3_TYP: 'STR',
   PARA3_VAL: this.props.DeviceId,
   PARA4_TYP: 'STR',
   PARA4_VAL: simid,
   PARA5_TYP: 'STR',
   PARA5_VAL: Constants.BankCode + '#98#98',
  };
  console.log('CheckMpin URL:- ' + APIUrlConstants.BASE_URL);
  console.log('');
  console.log('CheckMpin Body:- ' + JSON.stringify(Body));
  console.log('');

  sendData(
   this,
   'post',
   APIUrlConstants.BASE_URL,
   Headers,
   JSON.stringify(Body),
   async (obj, response) => {
    var responseData = await decryptData(response);
    var newRes = responseData.slice(16);
    var finalRes = JSON.parse(newRes);

    console.log('CheckMpin Response:- ' + JSON.stringify(finalRes));

    let res = finalRes.SUCCESS;
    if (res === 'FALSE') {
     const ErrorMsg = finalRes.RESULT;
     Snackbar.show({
      text: ErrorMsg,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: 'red',
     });
    } else if (res === 'TRUE') {
     Constants.Name = finalRes.NAME;
     Constants.BRANCH_CODE = finalRes.BRANCH_CODE;
     Constants.GMST_CODE = finalRes.GMST_CODE;
     Constants.DEPOSIT_CBSVER = finalRes.DEPOSIT_CBSVER;
     Constants.SecretKey = finalRes.SK;
     Constants.MobileNumber = finalRes.TELE; //HRP 107514

     this.props.setGmstCode(finalRes.GMST_CODE);

     this.props.setSecretKey(finalRes.SK);

     this.props.setNAME(finalRes.NAME);

     this.props.navigation.replace('quickPayScreen', {
      accList: finalRes.Acdtls.map((item) => JSON.parse(item.replace(/\\/g, ''))),
     });
    }
   }
  );
 };

 bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg;
 render() {
  return (
   <View style={{flex: 1}}>
    <ImageBackground style={{flex: 1}} source={this.bgImage} resizeMode='cover'>
     <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : ''}
      enabled={true}
     >
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
       <TrasnperantFixedHeader backAction={() => this.onBackAction()} />

       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
         source={require('../../assets/images/graphic-img-03.png')}
         style={{
          height: 250,
          width: 250,
          justifyContent: 'center',
          alignItems: 'center',
         }}
         resizeMode={Platform.OS === 'android' ? 'center' : 'contain'}
        />
       </View>
      </View>

      <View
       style={{
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column',
       }}
      >
       <Text
        style={{
         width: width - 50,
         marginTop: 30,
         fontSize: 25,
         textAlign: 'center',
         fontFamily: strings.fontBold,
         color: this.props.PrimaryColor,
        }}
       >
        {strings.quickPayOtp}
       </Text>

       <View
        style={{
         height: 60,
         width: width - 40,
         alignItems: 'center',
         justifyContent: 'center',
         marginVertical: 10,
        }}
       >
        <OtpInputs
         caretHidden={false} // cusrsor
         handleChange={(code) => {
          this.setState({MPin: code});
          console.log(this.state.MPin);
         }}
         numberOfInputs={4}
         keyboardType='numeric' // This allows only numbers
         secureTextEntry={true}
         inputContainerStyles={{
          height: 45,
          width: 45,
          margin: 5,
          borderWidth: 1,
          justifyContent: 'center',
          backgroundColor: colors.otpBackColor,
          borderColor: colors.otpBorderColor,
          borderRadius: 8,
         }}
         focusStyles={{
          borderColor: this.props.SecondaryColor,
         }}
         inputStyles={{
          fontSize: 15,
          textAlign: 'center',
          fontWeight: 'bold',
          color: this.props.textColor,
         }}
         selectionColor={this.props.SecondaryColor}
         autofillFromClipboard={false}
        />
       </View>

       <CardView
        cardElevation={this.state.MPin.length == 4 ? 3 : 0}
        cardMaxElevation={3}
        cornerRadius={12}
        style={{
         backgroundColor: 'white',
         justifyContent: 'center',
         marginVertical: 10,
        }}
       >
        <TouchableOpacity
         style={{
          padding: 15,
          width: width - 40,
          backgroundColor: this.props.PrimaryColor,
          backgroundColor:
           this.state.MPin.length == 4 ? this.props.PrimaryColor : colors.btnDisable,
          justifyContent: 'center',
          borderRadius: 12,
         }}
         disabled={this.state.MPin.length == 4 ? false : true}
         onPress={() => this.toSuccess()}
        >
         <Text
          style={{
           alignSelf: 'center',
           color: this.state.MPin.length == 4 ? colors.white : colors.btnDisableTextColor,
           fontFamily: strings.fontRegular,
           fontSize: 15,
          }}
         >
          {strings.logIn}
         </Text>
        </TouchableOpacity>
       </CardView>

       <TouchableOpacity
        style={{
         marginVertical: 10,
        }}
        onPress={() => this.ForgetMpin()}
       >
        <Text
         style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'left',
          fontFamily: strings.fontMedium,
          color: Colors.themeColorOrange,
         }}
        >
         {strings.forgotMpin}
        </Text>
       </TouchableOpacity>

       <View style={{alignItems: 'flex-end'}}>
        <Footer height={70} width={300} />
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

export default connect(mapStateToProps, mapDispatchToProps)(QuickPayMpin);
