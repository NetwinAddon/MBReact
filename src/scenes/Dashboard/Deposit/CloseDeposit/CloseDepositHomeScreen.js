import React, {Component} from 'react';
import {Text, View, FlatList, StyleSheet, ImageBackground, LayoutAnimation} from 'react-native';
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
//import Arrowdown from '../../../../assets/icons/dashboardIcons/arrow_down.svg'
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';

import {selectAccount} from '../../../../components/CustomPopups';
import {TextInput} from 'react-native-paper';
import Wallet from '../../../../assets/icons/wallet.svg';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';
import TrasnperantFixedHeader from '../../../../components/TrasnperantFixedHeader';

class CloseDepositHomeScreen extends Component {
 constructor(props) {
  super(props);
  this.accData = [
   {label: 'Savings Acc', value: '1'},
   {label: 'Fixed deposit Acc', value: '2'},
   {label: 'Current Acc', value: '3'},
  ];
  this.verifyData = [
   {label: 'Pan card Number', value: '1'},
   {label: 'Aadhar card Number', value: '2'},
  ];
  this.accType = [
   {label: 'Fixed Deposite', value: '1'},
   {label: 'Recurring deposit account', value: '2'},
  ];
  this.selectScheme = [
   {label: 'Plain Fixed Deposit A/c ', value: '1'},
   {label: 'Plain Savings Account A/c ', value: '2'},
  ];
  this.selectPeriod = [
   {label: 'Year', value: '1'},
   {label: 'Months', value: '2'},
  ];

  this.RnwAccData = [
   {
    BALANCE: '15,110',
    AC_NO: '2003855',
    SCEMEHNAME: 'Plain Fixed Deposit A/c',
   },
   {
    BALANCE: '27,500',
    AC_NO: '1503855',
    SCEMEHNAME: 'Plain Fixed Deposit A/c',
   },
   {
    BALANCE: '40,000',
    AC_NO: '3203855',
    SCEMEHNAME: 'Plain Fixed Deposit A/c',
   },
   {
    BALANCE: '55,310',
    AC_NO: '8503855',
    SCEMEHNAME: 'Plain Fixed Deposit A/c',
   },
   {
    BALANCE: '10,440',
    AC_NO: '9903855',
    SCEMEHNAME: 'Plain Fixed Deposit A/c',
   },
   // Add more user data as needed
  ];

  this.state = {
   verifyType: this.verifyData[0].label,
   depositAmount: '',
   accType: this.accType[0].label,
   accData: this.accData[0].label,
   selectScheme: this.selectScheme[0].label,
   selectPeriod: this.selectPeriod[0].label,
   isDebitAcc: false,
   isSelectAcc: false,
   isSelectScheme: false,
   isSelectedPeriod: false,
   yearOrMonths: '',
   days: '',
  };
 }

 componentDidMount() {}

 renderPlansItem = ({item}) => (
  // <TouchableOpacity
  //     onPress={() => this.props.navigation.navigate('rechargePay', {
  //         // RechargeAmount: item.rechargeAmount,
  //         // UserName: this.props.route.params.name,
  //         // MobileNumber: this.props.route.params.mobno
  //     })}
  // >
  <CardView
   cardElevation={6}
   cardMaxElevation={15}
   cornerRadius={15}
   style={{
    //  height: 70,
    // padding: 10,
    backgroundColor: 'white',
    width: width - 50,
    // justifyContent: 'center',
    //  alignItems: 'center',
    // flexDirection: 'row',
    marginTop: 5,
    marginBottom: 8,
    marginLeft: 5,
    marginRight: 5,
    padding: 15,
   }}
  >
   <TouchableOpacity onPress={() => this.props.navigation.navigate('closeAccScreen')}>
    <View style={{flexDirection: 'row'}}>
     <View style={{flex: 1}}>
      <Text
       style={{
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'SF UI Display',
        color: '#252525',
       }}
      >
       {'Balance'}
      </Text>
      <Text
       style={{
        fontSize: 24,
        fontWeight: '700',
        fontFamily: 'SF UI Display',
        color: '#1f3c66',
       }}
      >
       {strings.rupee}
       {item.BALANCE}
      </Text>
     </View>

     <View style={{justifyContent: 'flex-end'}}>
      <Wallet></Wallet>
     </View>
    </View>

    <View style={styles.container}>
     <View style={{justifyContent: 'center', marginRight: 35}}>
      <Text
       style={{
        fontSize: 10,
        fontWeight: '200',
        fontFamily: 'SF UI Display',
        color: '#686868',
        //  textAlign: "right"
       }}
      >
       {'A/c No'}
      </Text>
      <Text
       style={{
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'SF UI Display',
        color: '#252525',
        //  textAlign: "right"
       }}
      >
       {item.AC_NO}
      </Text>
     </View>

     <View style={{}}>
      <Text
       style={{
        fontSize: 10,
        fontWeight: '200',
        fontFamily: 'SF UI Display',
        color: '#686868',
        //  textAlign: "right"
       }}
      >
       {'Scheme Name'}
      </Text>
      <Text
       style={{
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'SF UI Display',
        color: '#252525',
        //  textAlign: "right"
       }}
      >
       {item.SCEMEHNAME}
      </Text>
     </View>
    </View>
   </TouchableOpacity>
  </CardView>

  // </TouchableOpacity>
 );

 onSelectDebitAccount = (value) => {
  this.setState({isDebitAcc: false, accData: value});
 };

 onSelectAccountType = (value) => {
  this.setState({isSelectAcc: false, accType: value});
 };

 onSelectScheme = (value) => {
  this.setState({isSelectScheme: false, selectScheme: value});
 };

 onSelctPeriod = (value) => {
  this.setState({isSelectedPeriod: false, selectPeriod: value});
 };

 toRateOfInterest() {
  navigation.navigate(this, 'interestRates');
 }

 toModeOfOperation() {
  navigation.navigate(this, 'depositSelectModeOfOperation');
 }

 changeLayout() {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
 }

 onBackAction() {
  navigation.goBack(this);
 }

 checkpaas() {}

 toSuccess() {
  // navigation.navigate(this, 'existingUserLoginSuccess')
 }
 bgImage = appThemeConfiguration(config.themeColor).bgImg;
 render() {
  return (
   <View style={{flex: 1}}>
    <ImageBackground style={{flex: 1}} source={this.bgImage} resizeMode='cover'>
     <View style={{flex: 0.25, justifyContent: 'flex-start'}}>
      <TrasnperantFixedHeader backAction={() => this.onBackAction()} />
      <Text
       style={{
        marginLeft: 15,
        color: 'white',
        fontSize: 24,
        fontFamily: strings.fontBold,
       }}
      >
       {strings.CloseDeposit}
      </Text>
      <Text
       style={{
        marginLeft: 15,
        color: 'white',
        fontSize: 15,
        fontFamily: strings.fontRegular,
       }}
      >
       {strings.CloseDepositSubStr}
      </Text>
     </View>
     <View
      style={{
       flex: 0.75,
       // alignItems: 'center',
       backgroundColor: 'white',
       borderTopLeftRadius: 30,
       borderTopRightRadius: 30,
       flexDirection: 'column',
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
        {/* Account Number */}
        <View
         style={{
          marginTop: 15,

          width: width - 50,
         }}
        >
         <View
          style={{
           flex: 1,
           borderBottomColor: '#BEC8EC80',
           borderBottomWidth: 1,
          }}
         >
          <Text
           style={{
            color: '#929CAC',
            fontWeight: '600',
            fontSize: 12,
            fontFamily: strings.fontMedium,
           }}
          >
           A/c Name
          </Text>

          <Text
           style={{
            color: '#1F3C66',
            fontWeight: '800',
            fontSize: 20,
            fontFamily: 'SF UI Display',
            marginBottom: 8,
           }}
          >
           {'Raju Shinde'}
          </Text>
         </View>
        </View>

        <View style={{flex: 1, marginTop: 10}}>
         {/* {console.log("logg-->" + JSON.stringify(this.state.constactsNumbers[1]))} */}
         {/* {console.log(this.userData)} */}
         <FlatList
          data={this.RnwAccData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderPlansItem}
         />
        </View>
       </View>
      </ScrollView>
     </View>
    </ImageBackground>
   </View>
  );
 }
}

export default connect(mapStateToProps, mapDispatchToProps)(CloseDepositHomeScreen);
const styles = StyleSheet.create({
 InputBoxDesign: {
  height: 48,
  width: width - 50,
  backgroundColor: colors.white,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#DFE1E8',
 },
 container: {
  flexDirection: 'row',
  flex: 1,

  marginTop: 5,
 },

 textContainer: {
  flex: 3.5,
 },
 username: {
  fontSize: 18,
  fontWeight: '500',
  color: '#000',
 },
 ErrorDisplay: {
  color: '#FF0000',
  marginLeft: 5,
  fontSize: 12,
  marginTop: 3,
 },
});
