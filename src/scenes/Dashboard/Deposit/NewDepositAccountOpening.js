import React, {Component} from 'react';
import {Text, View, ImageBackground, LayoutAnimation} from 'react-native';
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
import Arrowdown from '../../../assets/icons/dashboardIcons/arrow_down.svg';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';
import {selectAccount} from '../../../components/CustomPopups';
import {TextInput} from 'react-native-paper';
import Iicon from '../../../assets/icons/I-icon.svg';
import TrasnperantFixedHeader from '../../../components/TrasnperantFixedHeader';

class NewDepositAccountOpening extends Component {
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
       {strings.newDepositAcc}
      </Text>
      <Text
       style={{
        marginLeft: 15,
        color: 'white',
        fontSize: 15,
        fontFamily: strings.fontRegular,
       }}
      >
       {strings.newDepositSubStr}
      </Text>
     </View>
     <View
      style={{
       flex: 0.75,
       // alignItems: 'center',
       backgroundColor: '#fbfcfc',
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
        {/* Deposit Amount */}
        <View
         style={{
          // backgroundColor: '#00FF00',
          flexDirection: 'column',
          marginBottom: 8,
          justifyContent: 'center',
          alignItems: 'flex-start',
         }}
        >
         <TextInput
          style={{
           lineHeight: 40,
           height: 48,
           width: width - 50,
           marginBottom: 5,
           marginTop: 15,
          }}
          theme={{
           colors: {
            placeholder: '#DFE1E8',
            text: this.props.textColor,
            primary: this.props.themeColor,
            underlineColor: 'transparent',
            background: 'white',
           },
           roundness: 8,
          }}
          label='Deposits Amount'
          keyboardType='numeric'
          value={this.state.depositAmount}
          onChangeText={(depositAmount) => {
           this.setState({depositAmount});
          }}
          mode='outlined'
         />
        </View>

        {/* Debit Account */}
        <View
         style={{
          height: 48,
          width: width - 50,
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
           width: width - 50,
           flexDirection: 'row',
           alignItems: 'center',
          }}
        //   onPress={() => this.setState({isDebitAcc: true, labelText: 'Debit Account'})}
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
            Debit Account
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
        {selectAccount(
         this.state.isDebitAcc,
         this.accData,
         this.onSelectDebitAccount,
         this.state.labelText,
         this.state.accData
        )}
        {/* Account Number */}
        <View
         style={{
          marginTop: 15,
          height: 48,
          width: width - 50,
          backgroundColor: colors.white,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          borderWidth: 1, // comment to hide border
          borderColor: '#DFE1E8',
         }}
        >
         <View
          style={{
           flexDirection: 'row',
           alignItems: 'center',
          }}
          // onPress={() => this.setState({ isModalVisible: true, labelText: 'From A/c' })}
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
            Account No
           </Text>

           <Text
            style={{
             color: colors.accTextColor,
             marginLeft: 15,
             fontSize: 15,
             fontFamily: strings.fontMedium,
            }}
           >
            xxxxx58663252xx0x
           </Text>
          </View>

          {/* <View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginHorizontal: 10
                                }} >
                                    <Arrowdown height={15} width={15} />
                                </View> */}
         </View>
        </View>

        {/*  select account type */}
        <View
         style={{
          marginTop: 15,
          height: 48,
          width: width - 50,
          backgroundColor: colors.white,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#DFE1E8',
         }}
        >
         <TouchableOpacity
          style={{
           width: width - 50,
           flexDirection: 'row',
           alignItems: 'center',
          }}
        //   onPress={() => this.setState({isSelectAcc: true, labelText: 'Select Account Type'})}
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
            Select Account Type
           </Text>
           <Text
            style={{
             color: colors.accTextColor,
             marginLeft: 15,
             fontSize: 15,
             fontFamily: strings.fontMedium,
            }}
           >
            {this.state.accType}
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
        {selectAccount(
         this.state.isSelectAcc,
         this.accType,
         this.onSelectAccountType,
         this.state.labelText,
         this.state.accType
        )}

        {/* select scheme and interest rate*/}
        <View
         style={{
          marginTop: 15,
          height: 48,
          width: width - 50,
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
           width: width - 50,
           justifyContent: 'center',
           flexDirection: 'row',
          }}
        //   onPress={() => this.setState({isSelectScheme: true, labelText: 'Select Scheme'})}
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
            Select Scheme
           </Text>
           <Text
            style={{
             color: colors.accTextColor,
             marginLeft: 15,
             fontSize: 15,
             fontFamily: strings.fontMedium,
            }}
           >
            {this.state.selectScheme}
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
        {selectAccount(
         this.state.isSelectScheme,
         this.selectScheme,
         this.onSelectScheme,
         this.state.labelText,
         this.state.selectScheme
        )}

        {/* rate of interest */}
        <View
         style={{
          marginTop: 15,
          width: width - 50,
         }}
        >
         <TouchableOpacity
          style={{
           // backgroundColor: 'red',
           flexDirection: 'row',
           alignItems: 'center',
          }}
          onPress={() => this.toRateOfInterest()}
         >
          <Iicon height={15} width={15} />
          <Text
           style={{
            // alignSelf: 'center',
            marginLeft: 10,
            color: '#1F3C66',
            fontFamily: strings.fontMedium,
            fontSize: 15,
           }}
          >
           Click Here to See The Interest Rates
          </Text>
         </TouchableOpacity>
        </View>

        {/* Deposit Period */}
        <View
         style={{
          marginTop: 15,
          width: width - 50,
         }}
        >
         <Text
          style={{
           fontSize: 15,
           fontFamily: strings.fontMedium,
           color: this.props.textColor,
          }}
         >
          Deposit Period
         </Text>
         <View
          style={{
           flexDirection: 'row',
           // marginBottom: 10,
           justifyContent: 'space-between',
           alignItems: 'center',
          }}
         >
          {/* input for months */}
          <TextInput
           style={{
            lineHeight: 40,
            height: 48,
            width: 60,
           }}
           theme={{
            colors: {
             placeholder: '#DFE1E8',
             text: this.props.textColor,
             primary: this.props.themeColor,
             underlineColor: 'transparent',
             background: 'white',
            },
            roundness: 8,
           }}
           // label="Deposits Amount"
           keyboardType='numeric'
           maxLength={2}
           value={this.state.yearOrMonths}
           onChangeText={(yearOrMonths) => {
            this.setState({yearOrMonths: yearOrMonths.replace(/[^0-9]/g, '')});
           }}
           mode='outlined'
          />

          {/* input for month or year */}
          <View
           style={{
            marginTop: 6,
            height: 50,
            // width: width - 50,
            backgroundColor: colors.white,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#DFE1E8',
           }}
          >
           <TouchableOpacity
            style={{
             width: 110,
             height: 50,
             alignItems: 'center',
             justifyContent: 'center',
             flexDirection: 'row',
             // backgroundColor : 'red'
            }}
            // onPress={() => this.setState({isSelectedPeriod: true, labelText: 'Select Peroid'})}
           >
            <View style={{flex: 1}}>
             <Text
              style={{
               color: colors.accTextColor,
               marginLeft: 15,
               fontSize: 15,
               fontFamily: strings.fontMedium,
              }}
             >
              {this.state.selectPeriod}
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
          {selectAccount(
           this.state.isSelectedPeriod,
           this.selectPeriod,
           this.onSelctPeriod,
           this.state.labelText,
           this.state.selectPeriod
          )}

          {/* input for days */}
          <TextInput
           style={{
            width: 60,
            lineHeight: 40,
            height: 48,
           }}
           theme={{
            colors: {
             placeholder: '#DFE1E8',
             text: this.props.textColor,
             primary: this.props.themeColor,
             underlineColor: 'transparent',
             background: 'white',
            },
            roundness: 8,
           }}
           keyboardType='numeric'
           value={this.state.days}
           onChangeText={(days) => {
            this.setState({days: days.replace(/[^0-9]/g, '')});
           }}
           mode='outlined'
          />
          <Text
           style={{
            fontSize: 15,
            fontFamily: strings.fontMedium,
            color: this.props.textColor,
           }}
          >
           {' '}
           Days
          </Text>
         </View>
        </View>

        {/* buttons */}
        <View
         style={{
          flex: 1,
          // height: 52,
          // width: width - 50,
          // backgroundColor : 'red',
          justifyContent: 'flex-end',
          padding: 20,
         }}
        >
         <TouchableOpacity
          style={{
           marginTop: 15,
           padding: 15,
           // height: 52,
           width: width - 50,
           alignItems: 'center',
           backgroundColor: '#929CAC',
           // marginTop: 20,
           justifyContent: 'center',
           borderRadius: 12,
          }}
          onPress={() => {
           console.log(this.props);
           this.toModeOfOperation();
          }}
         >
          <Text style={{color: 'black'}}>Next</Text>
         </TouchableOpacity>
        </View>
       </View>
      </ScrollView>
     </View>
    </ImageBackground>
   </View>
  );
 }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewDepositAccountOpening);
