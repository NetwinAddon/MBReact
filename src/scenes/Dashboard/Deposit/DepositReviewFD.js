import React, {Component} from 'react';
import {
 Text,
 View,
 ImageBackground,
 LayoutAnimation,
 // FlatList,
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
} from '../../../App';
import Tree from '../../../assets/icons/Tree.svg';

import TreeTwo from '../../../assets/icons/TreeDeciduous.svg';
import {FlatList, ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';

import {TextInput, Button, TouchableRipple} from 'react-native-paper';
import OtpInputs from 'react-native-otp-inputs';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import CheckBox from '@react-native-community/checkbox';
import TrasnperantFixedHeader from '../../../components/TrasnperantFixedHeader';

class DepositReviewFD extends Component {
 constructor(props) {
  super(props);
  this.state = {
   checked: false,
  };
 }
 componentDidMount() {}

 onBackAction() {
  navigation.goBack(this);
 }

 toDepositOTP() {
  navigation.navigate(this, 'depositOtp');
 }
 bgImage = appThemeConfiguration(config.themeColor).bgImg;

 render() {
  return (
   <ImageBackground
    style={{
     flex: 1,
     alignItems: 'center',
    }}
    source={this.bgImage}
    resizeMode='cover'
   >
    <View
     style={{
      flex: 0.25,
      // justifyContent: 'flex-start'
     }}
    >
     <TrasnperantFixedHeader backAction={() => this.onBackAction()} />
     <Text
      style={{
       // marginTop: -15,
       marginLeft: 15,
       color: 'white',
       fontSize: 24,
       fontFamily: strings.fontBold,
      }}
     >
      {strings.reviewFD}
     </Text>

     {/* <Text style={{
                        marginLeft: 15,

                        fontSize: 15,
                        color: 'black',
                        textAlign: 'left',
                        fontFamily: strings.fontMedium,
                        color: colors.white,
                    }}>Lorem Ipsum is simply dummy text printing
                    </Text> */}
    </View>

    <View
     style={{
      flex: 0.75,
      width: width,
      // backgroundColor: '#fbfcfc',
      backgroundColor: 'white',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 20,
     }}
    >
     <ScrollView
     // keyboardShouldPersistTaps="handled"
     >
      <View
       style={{
        paddingTop: 5,
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 30,
       }}
      >
       {/* Type of Account */}
       <View
        style={{
         marginTop: 15,
         height: 48,
         width: width - 50,
         backgroundColor: colors.white,
         justifyContent: 'center',
         alignItems: 'center',
         borderRadius: 8,
         // borderWidth: 1,     // comment to hide border
         borderColor: '#DFE1E8',
        }}
       >
        <View
         style={{
          flexDirection: 'row',
          alignItems: 'center',
         }}
        >
         <View style={{flex: 1}}>
          <Text
           style={{
            color: colors.accTextColor + '80',
            marginLeft: 15,
            fontSize: 10,
            fontFamily: strings.fontMedium,
           }}
          >
           {strings.typeOfAcc}
          </Text>

          <Text
           style={{
            color: colors.accTextColor,
            marginLeft: 15,
            fontSize: 15,
            fontFamily: strings.fontMedium,
           }}
          >
           Fixed Deposit
          </Text>
         </View>
        </View>
       </View>

       {/* Scheme */}
       <View
        style={{
         marginTop: 15,
         height: 48,
         width: width - 50,
         backgroundColor: colors.white,
         justifyContent: 'center',
         alignItems: 'center',
         borderRadius: 8,
         // borderWidth: 1,     // comment to hide border
         // borderColor: '#DFE1E8',
        }}
       >
        <View
         style={{
          flexDirection: 'row',
          alignItems: 'center',
         }}
        >
         <View style={{flex: 1}}>
          <Text
           style={{
            color: colors.accTextColor + '80',
            marginLeft: 15,
            fontSize: 10,
            fontFamily: strings.fontMedium,
           }}
          >
           {strings.Scheme}
          </Text>

          <Text
           style={{
            color: colors.accTextColor,
            marginLeft: 15,
            fontSize: 15,
            fontFamily: strings.fontMedium,
           }}
          >
           Reinvestment Deposit
          </Text>
         </View>
        </View>
       </View>

       {/* Scheme */}
       <View
        style={{
         marginTop: 15,
         height: 48,
         width: width - 50,
         backgroundColor: colors.white,
         justifyContent: 'center',
         alignItems: 'center',
         borderRadius: 8,
         // borderWidth: 1,     // comment to hide border
         borderColor: '#DFE1E8',
        }}
       >
        <View
         style={{
          flexDirection: 'row',
          alignItems: 'center',
         }}
        >
         <View style={{flex: 1}}>
          <Text
           style={{
            color: colors.accTextColor + '80',
            marginLeft: 15,
            fontSize: 10,
            fontFamily: strings.fontMedium,
           }}
          >
           {strings.nameOfAccHolder}
          </Text>

          <Text
           style={{
            color: colors.accTextColor,
            marginLeft: 15,
            fontSize: 15,
            fontFamily: strings.fontMedium,
           }}
          >
           Sufiyan Mansur Mirza
          </Text>
         </View>
        </View>
       </View>

       {/* Deposit Amount */}
       <CardView
        cardElevation={0}
        cardMaxElevation={0}
        cornerRadius={15}
        style={{
         marginTop: 15,
         backgroundColor: '#e8f1f8',
         height: 120,
         width: width - 40,
         justifyContent: 'center',
         alignItems: 'center',
        }}
       >
        <View
         style={{
          // justifyContent: 'space-between',
          alignItems: 'center',
          height: 140,
          width: width - 40,
          backgroundColor: '#e8f1f8',
          flexDirection: 'row',
         }}
        >
         <View
          style={{
           height: 120,
           flex: 0.3,
           justifyContent: 'center',
           alignItems: 'center',
           // backgroundColor: 'white'
          }}
         >
          <View
           style={{
            height: 70,
            width: 60,
            backgroundColor: 'white',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
           }}
          >
           <Tree height={40} width={40} />
          </View>
         </View>

         <View
          style={{
           flex: 0.7,
           justifyContent: 'center',
           paddingTop: 15,
           paddingBottom: 15,
           // alignItems : 'center'
           // backgroundColor: 'green',
          }}
         >
          <View
           style={{
            flex: 0.5,
            // backgroundColor: 'red',
            justifyContent: 'center',
           }}
          >
           <Text style={{fontSize: 11, fontFamily: strings.fontRegular, color: '#686868'}}>
            {strings.depsitAmount}
           </Text>
           <Text style={{fontSize: 22, fontFamily: strings.fontBold, color: '#252525'}}>5000</Text>
          </View>

          <View
           style={{
            flex: 0.5,
            // backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'center',
           }}
          >
           <View
            style={{
             flex: 0.5,
             // backgroundColor: 'white',
             // flexDirection : 'row'
            }}
           >
            <Text style={{fontSize: 11, fontFamily: strings.fontRegular, color: '#686868'}}>
             {strings.mode}
            </Text>
            <Text style={{fontSize: 17, fontFamily: strings.fontBold, color: '#252525'}}>Self</Text>
           </View>
           <View
            style={{
             flex: 0.5,
            }}
           >
            <Text style={{fontSize: 11, fontFamily: strings.fontRegular, color: '#686868'}}>
             {strings.interestRate}
            </Text>
            <Text style={{fontSize: 17, fontFamily: strings.fontBold, color: '#252525'}}>8.5%</Text>
           </View>
          </View>
         </View>
        </View>
       </CardView>

       {/* Maturity Amount */}
       <CardView
        cardElevation={0}
        cardMaxElevation={0}
        cornerRadius={15}
        style={{
         marginTop: 15,
         backgroundColor: '#e8f1f8',
         height: 120,
         width: width - 40,
         justifyContent: 'center',
         alignItems: 'center',
        }}
       >
        <View
         style={{
          // justifyContent: 'space-between',
          alignItems: 'center',
          height: 140,
          width: width - 40,
          backgroundColor: '#d4efdf',
          flexDirection: 'row',
         }}
        >
         <View
          style={{
           height: 120,
           flex: 0.3,
           justifyContent: 'center',
           alignItems: 'center',
           // backgroundColor: 'white'
          }}
         >
          <View
           style={{
            height: 70,
            width: 60,
            backgroundColor: 'white',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
           }}
          >
           <TreeTwo height={30} width={30} />
          </View>
         </View>

         <View
          style={{
           flex: 0.7,
           justifyContent: 'center',
           paddingTop: 15,
           paddingBottom: 15,
           // alignItems : 'center'
           // backgroundColor: 'green',
          }}
         >
          <View
           style={{
            flex: 0.5,
            // backgroundColor: 'red',
            justifyContent: 'center',
           }}
          >
           <Text style={{fontSize: 11, fontFamily: strings.fontRegular, color: '#686868'}}>
            {strings.maturityAmount}
           </Text>
           <Text style={{fontSize: 22, fontFamily: strings.fontBold, color: '#252525'}}>5758</Text>
          </View>

          <View
           style={{
            flex: 0.5,
            // backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'center',
           }}
          >
           <View
            style={{
             flex: 0.5,
             // backgroundColor: 'white',
             // flexDirection : 'row'
            }}
           >
            <Text style={{fontSize: 11, fontFamily: strings.fontRegular, color: '#686868'}}>
             {strings.depositPeriod}
            </Text>
            <Text style={{fontSize: 15, fontFamily: strings.fontBold, color: '#252525'}}>
             5 Years{' '}
            </Text>
           </View>
           <View
            style={{
             flex: 0.5,
            }}
           >
            <Text style={{fontSize: 11, fontFamily: strings.fontRegular, color: '#686868'}}>
             {strings.maturityDate}
            </Text>
            <Text style={{fontSize: 15, fontFamily: strings.fontBold, color: '#252525'}}>
             03/04/2028
            </Text>
           </View>
          </View>
         </View>
        </View>
       </CardView>

       {/* Maturity Instruction */}
       <View
        style={{
         marginTop: 15,
         height: 48,
         width: width - 50,
         backgroundColor: colors.white,
         justifyContent: 'center',
         alignItems: 'center',
         borderRadius: 8,
         // borderWidth: 1,     // comment to hide border
         borderColor: '#DFE1E8',
        }}
       >
        <View
         style={{
          flexDirection: 'row',
          alignItems: 'center',
         }}
        >
         <View style={{flex: 1}}>
          <Text
           style={{
            color: colors.accTextColor + '80',
            marginLeft: 15,
            fontSize: 10,
            fontFamily: strings.fontMedium,
           }}
          >
           {strings.maturityInstruction}
          </Text>

          <Text
           style={{
            color: colors.accTextColor,
            marginLeft: 15,
            fontSize: 15,
            fontFamily: strings.fontMedium,
           }}
          >
           Not Applicable
          </Text>
         </View>
        </View>
       </View>

       {/* Interest Payout  */}
       <View
        style={{
         marginTop: 15,
         height: 48,
         width: width - 50,
         backgroundColor: colors.white,
         justifyContent: 'center',
         alignItems: 'center',
         borderRadius: 8,
         // borderWidth: 1,     // comment to hide border
         borderColor: '#DFE1E8',
        }}
       >
        <View
         style={{
          flexDirection: 'row',
          alignItems: 'center',
         }}
        >
         <View style={{flex: 1}}>
          <Text
           style={{
            color: colors.accTextColor + '80',
            marginLeft: 15,
            fontSize: 10,
            fontFamily: strings.fontMedium,
           }}
          >
           {strings.interestPayout}
          </Text>

          <Text
           style={{
            color: colors.accTextColor,
            marginLeft: 15,
            fontSize: 15,
            fontFamily: strings.fontMedium,
           }}
          >
           Not Applicable
          </Text>
         </View>
        </View>
       </View>

       {/* Join Holder */}
       <View
        style={{
         marginTop: 15,
         height: 48,
         width: width - 50,
         backgroundColor: colors.white,
         justifyContent: 'center',
         alignItems: 'center',
         borderRadius: 8,
         // borderWidth: 1,     // comment to hide border
         borderColor: '#DFE1E8',
        }}
       >
        <View
         style={{
          flexDirection: 'row',
          alignItems: 'center',
         }}
        >
         <View style={{flex: 1}}>
          <Text
           style={{
            color: colors.accTextColor + '80',
            marginLeft: 15,
            fontSize: 10,
            fontFamily: strings.fontMedium,
           }}
          >
           {strings.joinHolder}
          </Text>

          <Text
           style={{
            color: colors.accTextColor,
            marginLeft: 15,
            fontSize: 15,
            fontFamily: strings.fontMedium,
           }}
          >
           Not Applicable
          </Text>
         </View>
        </View>
       </View>

       {/* Nominee*/}
       <View
        style={{
         marginTop: 15,
         height: 48,
         width: width - 50,
         backgroundColor: colors.white,
         justifyContent: 'center',
         alignItems: 'center',
         borderRadius: 8,
         // borderWidth: 1,     // comment to hide border
         borderColor: '#DFE1E8',
        }}
       >
        <View
         style={{
          flexDirection: 'row',
          alignItems: 'center',
         }}
        >
         <View style={{flex: 1}}>
          <Text
           style={{
            color: colors.accTextColor + '80',
            marginLeft: 15,
            fontSize: 10,
            fontFamily: strings.fontMedium,
           }}
          >
           {strings.nominee}
          </Text>

          <Text
           style={{
            color: colors.accTextColor,
            marginLeft: 15,
            fontSize: 15,
            fontFamily: strings.fontMedium,
           }}
          >
           Vaibhav More
          </Text>
         </View>
        </View>
       </View>

       {/* Check box and terms and coditions       */}
       <View
        style={{
         // backgroundColor: '#a1a1a1',
         marginTop: 20,
         width: width - 40,
         alignItems: 'center',
         flexDirection: 'row',
         // justifyContent : 'flex-end'
        }}
       >
        <TouchableOpacity
         style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor : 'red'
         }}
         onPress={() => this.setState({checked: !this.state.checked})}
        >
         <CheckBox
          style={{
           width: 20,
           height: 20,
           marginRight: 15,
          }}
          lineWidth={0.5}
          hideBox={false}
          boxType={'square'}
          // tintColors={'#9E663C'}
          tintColors={{true: 'green'}}
          //   onCheckColor={'#6F763F'}
          //   onFillColor={'#4DABEC'}
          //   onTintColor={'#F4DCF8'}
          animationDuration={0.5}
          disabled={false}
          onAnimationType={'bounce'}
          offAnimationType={'stroke'}
          value={this.state.checked}
          // onValueChange={newValue =>
          //     this.setState({ checked: newValue })
          // }
         />
         <Text
          style={{
           fontFamily: strings.fontRegular,
           fontSize: 15,
           color: 'black',
           marginBottom: 3,
          }}
         >
          {strings.iAgree}
         </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft: 2}}>
         <Text
          style={{
           fontFamily: strings.fontRegular,
           fontSize: 15,
           color: '#1f3c66',
           marginBottom: 3,
          }}
         >
          {strings.termsAndCondition}
         </Text>
        </TouchableOpacity>
       </View>

       {/* buttons */}
       <CardView
        cardElevation={this.state.checked ? 3 : 0}
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
          backgroundColor: colors.btnColor,
          backgroundColor: this.state.checked ? colors.btnColor : colors.btnDisable,
          justifyContent: 'center',
          borderRadius: 12,
         }}
         disabled={this.state.checked ? false : true}
         onPress={() => this.toDepositOTP()}
        >
         <Text
          style={{
           alignSelf: 'center',
           color: this.state.checked ? colors.white : colors.btnDisableTextColor,
           fontFamily: strings.fontRegular,
           fontSize: 15,
          }}
         >
          {strings.submit}
         </Text>
        </TouchableOpacity>
       </CardView>
      </View>
     </ScrollView>
    </View>
   </ImageBackground>
  );
 }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositReviewFD);
