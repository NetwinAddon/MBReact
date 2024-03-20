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
import Colors from '../../../../common/Colors';
import TrasnperantFixedHeader from '../../../../components/TrasnperantFixedHeader';

class PrematuredEnquiryHomeScreen extends Component {
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
   savingsExpanded: Array(this.RnwAccData.length).fill(false),
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
 onPressItem = (index) => {
  this.setState((prevState) => {
   const savingsExpanded = [...prevState.savingsExpanded];
   savingsExpanded[index] = !savingsExpanded[index];
   return {savingsExpanded};
  });
 };

 renderPlansItem = ({item, index}) => (
  <View
   style={{
    //  height: 70,
    // padding: 10,
    // backgroundColor: 'white',
    width: width - 50,
    marginBottom: 10,
   }}
  >
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
    <TouchableOpacity
     onPress={() => {
      this.changeLayout();
      this.onPressItem(index); // Pass the index of the item
     }}
    >
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
   <View
    style={{
     zIndex: -1,
     marginTop: -15,
     justifyContent: 'center',
     alignItems: 'center',
     width: width - 70,
     height: this.state.savingsExpanded[index] ? null : 0,
     padding: this.state.savingsExpanded[index] ? 15 : 0,
     overflow: 'hidden',
     marginHorizontal: 14,
     marginBottom: 8,
     backgroundColor: colors.white,
     borderColor: 'rgba(0,0,0,0.1)',
     borderLeftWidth: this.state.savingsExpanded[index] ? 1 : 0,
     borderBottomWidth: this.state.savingsExpanded[index] ? 1 : 0,
     borderRightWidth: this.state.savingsExpanded[index] ? 1 : 0,
     borderBottomEndRadius: 12,
     borderBottomStartRadius: 12,
     backgroundColor: '#e8f1f8',
    }}
   >
    {this.renderGridContent()}
   </View>
  </View>
 );

 renderGridContent() {
  const jsonData = {
   DepositAmount: '22,500',
   TDSDeducted: '0.00 Dr',
   CurrentTDS: '0',
   AmountPaid: '25,600 Cr',
  };

  return (
   <View style={{width: width - 100}}>
    <View style={{flexDirection: 'row'}}>
     <View style={{flex: 1, padding: 5}}>
      <Text style={styles.commonTextStyle}>Deposit Amount</Text>
      <Text style={[styles.commonTextStyle, styles.boldText]}>{jsonData.DepositAmount}</Text>
     </View>
     <View style={{flex: 1, padding: 5}}>
      <Text style={styles.commonTextStyle}>TDS Deducted</Text>
      <Text style={[styles.commonTextStyle, styles.boldText]}>{jsonData.TDSDeducted}</Text>
     </View>
    </View>
    <View style={{flexDirection: 'row'}}>
     <View style={{flex: 1, padding: 5}}>
      <Text style={styles.commonTextStyle}>Current TDS</Text>
      <Text style={[styles.commonTextStyle, styles.boldText]}>{jsonData.CurrentTDS}</Text>
     </View>
     <View style={{flex: 1, padding: 5}}>
      <Text style={styles.commonTextStyle}>Amount Paid</Text>
      <Text style={[styles.commonTextStyle, styles.boldText]}>{jsonData.AmountPaid}</Text>
     </View>
    </View>
   </View>
  );
 }

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
       {strings.PrematuredEnquiry}
      </Text>
      <Text
       style={{
        marginLeft: 15,
        color: 'white',
        fontSize: 15,
        fontFamily: strings.fontRegular,
       }}
      >
       {strings.PrematuredEnquirySubStr}
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

        <View style={{width: width - 40, marginTop: 10}}>
         <FlatList
          data={this.RnwAccData}
          renderItem={({item, index}) => this.renderPlansItem({item, index})}
          keyExtractor={(item, index) => index.toString()} // assuming index is a suitable key
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

export default connect(mapStateToProps, mapDispatchToProps)(PrematuredEnquiryHomeScreen);
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

 commonTextStyle: {
  fontSize: 14,
  fontWeight: '500',
  fontFamily: 'SF UI Display',
  color: '#686868',
  // textAlign: "right"  // Uncomment this line if you want to set textAlign globally
 },
 boldText: {
  fontWeight: '700',
  color: '#252525',
 },
});
