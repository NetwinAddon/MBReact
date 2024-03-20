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
} from '../../../../App';
import Footer from '../../../../assets/icons/footer.svg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';


import OtpInputs from 'react-native-otp-inputs';
import TrasnperantFixedHeader from '../../../../components/TrasnperantFixedHeader';

class FundTransferMpin extends Component {
 constructor(props) {
  super(props);
  console.log('OTPForFundTransferProps======', this.props.route.params.from);
  this.state = {
   otp: '',
   transId: '',
   otp_length: '',
   callFrom: this.props.route.params.from === 'dashboard' ? 'dashboard' : '',
  };
 }
 componentDidMount() {}
 onBackAction() {
  navigation.goBack(this);
 }
 toSuccess() {
  navigation.navigate(this, 'fundTransferSameBankSuccess', {from: this.state.callFrom});
 }
 bgImage = appThemeConfiguration(config.themeColor).bgImg;
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
        paddingBottom: 15,
       }}
      >
       {/* for otp */}
       <Text
        style={{
         width: width - 50,
         marginTop: 30,
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
         autofillFromClipboard={false}
        />
       </View>

       {/* for trasn Id */}
       <Text
        style={{
         width: width - 50,
         marginTop: 15,
         fontSize: 25,
         textAlign: 'center',
         fontFamily: strings.fontBold,
         color: this.props.textColor,
        }}
       >
        {strings.enterTransID}
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
          this.setState({transId: code});
          console.log('TransId: ', code);
         }}
         numberOfInputs={4}
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
         secureTextEntry={true}
         autofillFromClipboard={false}
        />
       </View>

       <CardView
        cardElevation={this.state.otp.length == 6 && this.state.transId.length == 4 ? 3 : 0}
        cardMaxElevation={3}
        cornerRadius={12}
        style={{
         backgroundColor: 'white',
         justifyContent: 'center',
         marginVertical: 10,
        }}
       >
        {console.log('Otp_lenght: ', this.state.otp_length.length)}
        {/* {console.log("TransId_lenght: ",this.state.transId.length)} */}
        <TouchableOpacity
         style={{
          // marginBottom : 10,
          padding: 15,
          width: width - 40,
          backgroundColor: colors.btnColor,
          backgroundColor:
           this.state.otp_length.length == 6 && this.state.transId.length == 4
            ? colors.btnColor
            : colors.btnDisable,
          justifyContent: 'center',
          borderRadius: 12,
         }}
         disabled={
          this.state.otp_length.length == 6 && this.state.transId.length == 4 ? false : true
         }
         onPress={() => this.toSuccess()}
        >
         <Text
          style={{
           alignSelf: 'center',
           color:
            this.state.otp_length.length == 6 && this.state.transId.length == 4
             ? colors.white
             : colors.btnDisableTextColor,
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

export default connect(mapStateToProps, mapDispatchToProps)(FundTransferMpin);
