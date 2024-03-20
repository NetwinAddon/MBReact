import React, {Component} from 'react';
import {
 Text,
 View,
 Image,
 ImageBackground,
 KeyboardAvoidingView,
 StyleSheet,
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
} from '../../App';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';
import TransparentFixedHeader from '../../components/TrasnperantFixedHeader';
import APIUrlConstants from '../../common/APIUrlConstants';
import Colors from '../../common/Colors';
import OtpInputs from 'react-native-otp-inputs';
import Constants from '../../common/Constants';
import {_toEncrypt, decryptData, sendData} from '../../common/util';
import Snackbar from 'react-native-snackbar';

class ForgetPassword extends Component {
 constructor(props) {
  super(props);

  this.SECRETKEY = props.route.params.SECRETKEY;

  this.state = {
   mpin: '',
   confirmMpin: '',
  };
 }

 componentDidMount() {}

 MpinChangeApi = async () => {
  const Headers = APIUrlConstants.Headers('CALLAPI');

  const jsonReq = {
   customerId: this.props.gmstCode,
   branchCd: this.props.BranchCode,
   secKey: this.SECRETKEY,
   divId: this.props.DeviceId,
   MPIN: this.state.confirmMpin,
   BANK_CODE: Constants.BankCode,
  };

  let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));

  const Body = {
   PARACNT: '2',
   PARA1_TYP: 'STR',
   PARA1_VAL: 'setMPIN',
   PARA2_TYP: 'STR',
   PARA2_VAL: jsonValue,
  };

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

    if (finalRes.SUCCESS === 'FALSE') {
     const ErrorMsg = finalRes.RESULT;
     Snackbar.show({text: ErrorMsg,duration: Snackbar.LENGTH_SHORT,backgroundColor: 'red',});

    }
     else {
     const Msg = finalRes.RESULT;
     Snackbar.show({text: Msg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green',  });

     this.props.navigation.replace('loginTypeSelectScreen');
    }
   }
  );
 };

 onBackAction() {
  navigation.goBack(this);
 }

 bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg;

 render() {
  return (
   <View style={styles.ViewFlexOne}>
    <ImageBackground style={styles.ViewFlexOne} source={this.bgImage} resizeMode='cover'>

     <View style={styles.HeaderViewBG}>
      <TransparentFixedHeader backAction={() => this.onBackAction()} />

      <View style={styles.HeaderViewBG}>
       <Image source={assets.onSuccess} style={styles.BackgroundImage} />
      </View>

      <KeyboardAvoidingView
       style={[styles.CurveBackground, {flex: 1}]}
       behavior={Platform.OS === 'ios' ? 'padding' : ''}
       enabled={true}
      >
       <View style={styles.CurveView}>
        <Text style={[styles.Text_Heading, {color: this.props.PrimaryColor}]}>
         {strings.entrMpin}
        </Text>

        <View style={styles.ViewBg}>
         <OtpInputs
          style={{flexDirection: 'row'}}
          handleChange={(code) => {
           this.setState({
            mpin: code,
            isSubmit: this.state.confirmMpin == code && this.state.confirmMpin != '' ? true : false,
           });
          }}
          keyboardType='numeric'
          numberOfInputs={4}
          inputContainerStyles={styles.Inputcontainer}
          focusStyles={{borderColor: this.props.SecondaryColor}}
          inputStyles={styles.Inputstyle}
          selectionColor={this.props.SecondaryColor}
          secureTextEntry={true}
          autofillFromClipboard={false}
         />
        </View>

        <Text style={[styles.Text_Heading, {color: this.props.PrimaryColor}]}>
         {strings.confMpin}
        </Text>

        <View pointerEvents={this.state.mpin.length >= 4 ? 'auto' : 'none'} style={styles.ViewBg}>
         <OtpInputs
          style={{flexDirection: 'row'}}
          handleChange={(value) => {
           this.setState({isSubmit: this.state.mpin == value ? true : false, confirmMpin: value});
          }}
          numberOfInputs={4}
          keyboardType='numeric'
          inputContainerStyles={styles.Inputcontainer}
          focusStyles={{borderColor: this.props.SecondaryColor}}
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
         style={styles.Cardstyle}>

         <TouchableOpacity
          style={[
           styles.ButtonTouch,
           {
            backgroundColor:
             this.state.isSubmit == true ? this.props.PrimaryColor : colors.btnDisable,
           },
          ]}
          disabled={this.state.isSubmit == true ? false : true}
          onPress={() => this.MpinChangeApi()}
         >
          <Text
           style={[
            styles.TextStyle,
            {color: this.state.isSubmit == true ? colors.white : colors.btnDisableTextColor},
           ]}
          >
           {strings.submit}
          </Text>
         </TouchableOpacity>
        </CardView>
       </View>
      </KeyboardAvoidingView>
     </View>
    </ImageBackground>

   </View>
  );
 }
}

const styles = StyleSheet.create({

 ViewFlexOne: {
  flex: 1,
},
HeaderViewBG:
{
  flex: 1, 
  justifyContent: 'center', 
  alignItems: 'center'
},
 BackgroundImage: {
  height: 250,
  width: 250,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 10,
 },

 CurveBackground: {
  backgroundColor: 'white',
  borderTopLeftRadius: 40,
  borderTopRightRadius: 40,
 },
 CurveView: {
  alignItems: 'center',
  backgroundColor: 'white',
  borderTopLeftRadius: 40,
  borderTopRightRadius: 40,
  flexDirection: 'column',
 },
 Text_Heading: {
  width: width,
  marginTop: 30,
  fontSize: 22,
  textAlign: 'center',
  fontFamily: strings.fontBold,
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
 Inputstyle: {
  fontSize: 15,
  textAlign: 'center',
  color: Colors.textColorForOrange,
  fontWeight: 'bold',
 },
 ViewBg: {
  height: 60,
  alignItems: 'center',
  justifyContent: 'center',
 },
 Cardstyle: {
  backgroundColor: 'white',
  justifyContent: 'center',
  marginVertical: 10,
  marginBottom: 30,
  marginTop: 30,
 },
 TextStyle: {
  alignSelf: 'center',
  fontFamily: strings.fontRegular,
  fontSize: 15,
 },
 ButtonTouch: {
  padding: 15,
  width: width - 50,
  backgroundColor: colors.btnColor,
  justifyContent: 'center',
  borderRadius: 12,
 },
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword);
