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
import {RadioButton, TextInput} from 'react-native-paper';
import Wallet from '../../../../assets/icons/wallet.svg';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';
import Colors from '../../../../common/Colors';
import Balance from '../../../../assets/icons/BAL-greenicon.svg';
import Arrowdown from '../../../../assets/icons/dashboardIcons/arrow_down.svg';
import {DropdownPopup} from '../DropdownPopup';
import TrasnperantFixedHeader from '../../../../components/TrasnperantFixedHeader';

class CloseAccScreen extends Component {
 constructor(props) {
  super(props);
  this.accData = [
   {label: '011445252360', value: '1'},
   {label: '016545252360', value: '2'},
   {label: '017785252360', value: '3'},
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
  ];

  this.state = {
   savingsExpanded: Array(this.RnwAccData.length).fill(true),
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
    // onPress={() => {
    //     this.changeLayout();
    //     this.onPressItem(index); // Pass the index of the item
    // }}
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
     marginBottom: -15,
     backgroundColor: colors.white,
     borderColor: 'rgba(0,0,0,0.1)',
     borderLeftWidth: this.state.savingsExpanded[index] ? 1 : 0,
     borderBottomWidth: this.state.savingsExpanded[index] ? 1 : 0,
     borderRightWidth: this.state.savingsExpanded[index] ? 1 : 0,
     // borderBottomEndRadius: 12,
     // borderBottomStartRadius: 12,
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
    <View
     style={{
      marginTop: 5,

      //  flexDirection: 'row'
     }}
    >
     <View
      style={{
       flexDirection: 'row',
       alignItems: 'center',
       marginBottom: 5,
       borderBottomColor: '#BEC8EC80',
       borderBottomWidth: 1,
       // width:width-60
      }}
     >
      <View
       style={{
        flex: 1,
        // justifyContent:'flex-end'
       }}
      >
       <Text
        style={{
         color: '#555555',
         fontWeight: '400',
         fontFamily: strings.fontRegular,
         marginRight: 10,
        }}
       >
        {'Premature Account'}
       </Text>
      </View>
      <View
       style={{
        // flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 5,
       }}
      >
       <RadioButton
        value='no'
        status={this.state.checked === 'no' ? 'checked' : 'unchecked'}
        onPress={() => this.setState({checked: 'no'})}
        borderColor='black'
        color='black' // Set the fill color to black
        theme={{
         colors: 'primary',
        }}
       />
      </View>
     </View>
    </View>
    <View style={{flexDirection: 'row'}}>
     <View style={{flex: 1, padding: 5}}>
      <Text style={styles.commonTextStyle}>Due Date</Text>
      <Text style={[styles.commonTextStyle, styles.boldText]}>30/01/2024</Text>
     </View>
     <View style={{flex: 1, padding: 5}}>
      <Text style={styles.commonTextStyle}>Premature Date</Text>
      <Text style={[styles.commonTextStyle, styles.boldText]}>23/01/2024</Text>
     </View>
    </View>
    <View style={{flexDirection: 'row'}}>
     <View style={{flex: 1, padding: 5}}>
      <Text style={styles.commonTextStyle}>Current TDS</Text>
      <Text style={[styles.commonTextStyle, styles.boldText]}>100</Text>
     </View>
     <View style={{flex: 1, padding: 5}}>
      <Text style={styles.commonTextStyle}>Deposit Amount</Text>
      <Text style={[styles.commonTextStyle, styles.boldText]}>109</Text>
     </View>
    </View>
    <View style={{flexDirection: 'row'}}>
     <View style={{flex: 1, padding: 5}}>
      <Text style={styles.commonTextStyle}>Interest of Deposit</Text>
      <Text style={[styles.commonTextStyle, styles.boldText]}>6.0 Cr</Text>
     </View>
     <View style={{flex: 1, padding: 5}}>
      <Text style={styles.commonTextStyle}>Current TDS</Text>
      <Text style={[styles.commonTextStyle, styles.boldText]}>0.0 Dr</Text>
     </View>
    </View>
    <View style={{flexDirection: 'row'}}>
     <View style={{flex: 1, padding: 5}}>
      <Text style={styles.commonTextStyle}>TDS Deducted</Text>
      <Text style={[styles.commonTextStyle, styles.boldText]}>0</Text>
     </View>
     <View style={{flex: 1, padding: 5}}>
      <Text style={styles.commonTextStyle}>Current TDS</Text>
      <Text style={[styles.commonTextStyle, styles.boldText]}>0</Text>
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
           Scheme Name
          </Text>

          <Text
           style={{
            color: '#1F3C66',
            fontWeight: '700',
            fontSize: 16,
            fontFamily: 'SF UI Display',
            marginBottom: 8,
           }}
          >
           {'DHANVARDHINI DEPOSITES ACCOUNT'}
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

        <View>
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
           // marginTop: 5,
           marginBottom: 8,
           marginLeft: 5,
           marginRight: 5,
           padding: 15,
          }}
         >
          <TouchableOpacity
          // onPress={() => {
          //     this.changeLayout();
          //     this.onPressItem(index); // Pass the index of the item
          // }}
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
              {'Amount Paid'}
             </Text>
             <Text
              style={{
               fontSize: 24,
               fontWeight: '700',
               fontFamily: 'SF UI Display',
               color: '#27AE60',
              }}
             >
              {strings.rupee}
              {'106.0 Dr'}
             </Text>
            </View>

            <View style={{justifyContent: 'flex-end'}}>
             <Wallet></Wallet>
            </View>
           </View>
           <View
            style={{
             marginTop: 10,
             height: 48,
             width: width - 80,
             backgroundColor: colors.white,
             justifyContent: 'center',
             alignItems: 'center',
             borderRadius: 8,
             borderWidth: 1,
             borderColor: '#DFE1E8',
             // marginBottom: 10
            }}
           >
            <TouchableOpacity
             style={{
              width: width - 80,
              flexDirection: 'row',
              alignItems: 'center',
             }}
             onPress={() => this.setState({isDebitAcc: true, labelText: 'Select Account'})}
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
               {'Select Account'}
              </Text>
              <Text
               style={{
                color: colors.accTextColor,
                marginLeft: 15,
                fontSize: 15,
                fontFamily: strings.fontMedium,
               }}
              >
               {this.state.accData}
              </Text>
             </View>

             <View
              style={{
               alignItems: 'center',
               justifyContent: 'center',
               marginHorizontal: 10,
              }}
             >
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
          </TouchableOpacity>
         </CardView>
        </View>

        <View
         style={{
          height: 75,
          width: width - 40,
          borderRadius: 10,
          borderColor: 'black',
          backgroundColor: 'rgba(39, 174, 96, 0.2)',
          alignItems: 'center',
          marginTop: 15,
          flexDirection: 'row',
         }}
        >
         <View
          style={{
           width: 60,
           height: 60,
           borderRadius: 10,
           backgroundColor: 'white',
           marginLeft: 10,
           marginRight: 15,
           alignItems: 'center',
           justifyContent: 'center',
          }}
         >
          <Balance width={35} height={35} />
         </View>

         <View>
          <Text
           style={{
            color: '#686868',
            fontSize: 14,
            fontFamily: strings.fontMedium,
           }}
          >
           Credit Account Number
          </Text>

          <Text
           style={{
            color: colors.accTextColor,
            fontSize: 16,
            fontFamily: strings.fontMedium,
            flexWrap: 'wrap',
            width: 245,
            fontWeight: 'bold',
            marginTop: 5,
           }}
          >
           {'011445252360'}
          </Text>
         </View>
        </View>

        <CardView
         cardElevation={3}
         cardMaxElevation={3}
         cornerRadius={12}
         style={{
          backgroundColor: 'gray',
          justifyContent: 'center',
          marginVertical: 20,
         }}
        >
         <TouchableOpacity
          style={{
           padding: 15,
           width: width - 40,
           backgroundColor: colors.btnColor,
           justifyContent: 'center',
           borderRadius: 12,
          }}
          onPress={() => this.props.navigation.navigate('closeAccOTP')}
          // disabled = {this.state.checked == 'yes' &&  this.state.nominee != true ? false : true }
         >
          <Text
           style={{
            alignSelf: 'center',
            color: 'white',
            fontFamily: strings.fontRegular,
            fontSize: 15,
           }}
          >
           {'Confirm Details'}
          </Text>
         </TouchableOpacity>
        </CardView>
       </View>
      </ScrollView>
     </View>
    </ImageBackground>
   </View>
  );
 }
}

export default connect(mapStateToProps, mapDispatchToProps)(CloseAccScreen);
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
