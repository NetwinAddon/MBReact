import React, {Component} from 'react';
import {Text, View, ImageBackground, LayoutAnimation, StyleSheet} from 'react-native';
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

import {TextInput} from 'react-native-paper';
import TrasnperantFixedHeader from '../../../components/TrasnperantFixedHeader';

class AddStandingInstructions extends Component {
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
   installmentUnit: 'Month',
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

 bgImage = appThemeConfiguration(config.themeColor).bgImg;
 render() {
  return (
   <View style={styles.container}>
    <ImageBackground style={styles.container} source={this.bgImage} resizeMode='cover'>
     <View style={{flex: 0.25, justifyContent: 'flex-start'}}>
      <TrasnperantFixedHeader backAction={() => this.onBackAction()} />
      <Text style={styles.headerTitleStyle}>{strings.addStandingInstructionTitle}</Text>
      <Text style={styles.subTitleStyle}>{strings.addStandingInstructionSubtitle}</Text>
     </View>
     <View style={styles.accountDetailsContainer}>
      <ScrollView
      // keyboardShouldPersistTaps="handled"
      >
       <View style={styles.scrollContainer}>
        <View style={styles.dropDownContainer}>
         <TouchableOpacity
          style={{
           width: width - 50,
           flexDirection: 'row',
           alignItems: 'center',
          }}
         >
          <View style={styles.container}>
           <Text style={styles.textLabel}>Debit Account</Text>
           <Text style={styles.valueText}>{this.state.accData}</Text>
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
        <View style={styles.accountNoContainer}>
         <View
          style={{
           flexDirection: 'row',
          }}
         >
          <View style={styles.container}>
           <Text style={styles.textLabel}>Debit Account No</Text>

           <Text style={styles.valueText}>852236524</Text>
          </View>
         </View>
        </View>
        <View style={styles.dropDownContainer}>
         <TouchableOpacity
          style={{
           width: width - 50,
           flexDirection: 'row',
           alignItems: 'center',
          }}
         >
          <View style={styles.container}>
           <Text style={styles.textLabel}>Credit Account</Text>
           <Text style={styles.valueText}>{this.state.accData}</Text>
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
        <View style={styles.accountNoContainer}>
         <View
          style={{
           flexDirection: 'row',
          }}
         >
          <View style={styles.container}>
           <Text style={styles.textLabel}>Credit Account No</Text>

           <Text style={styles.valueText}>852236524</Text>
          </View>
         </View>
        </View>
        <View style={styles.inputContainer}>
         <TextInput
          style={styles.textInput}
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
          label='Instruction Start Date'
          keyboardType='default'
          value={this.state.depositAmount}
          onChangeText={(depositAmount) => {
           this.setState({depositAmount});
          }}
          mode='outlined'
         />
        </View>
        <View style={styles.inputContainer}>
         <TextInput
          style={styles.textInput}
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
          label='Instruction End Date'
          keyboardType='default'
          value={this.state.depositAmount}
          onChangeText={(depositAmount) => {
           this.setState({depositAmount});
          }}
          mode='outlined'
         />
        </View>
        <View style={styles.inputContainer}>
         <TextInput
          style={styles.textInput}
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
          label='Installment Amount'
          keyboardType='numeric'
          value={this.state.depositAmount}
          onChangeText={(depositAmount) => {
           this.setState({depositAmount});
          }}
          mode='outlined'
         />
        </View>
        <View style={styles.inputContainer}>
         <TextInput
          style={styles.textInput}
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
          label='Transfer Day'
          keyboardType='default'
          value={this.state.depositAmount}
          onChangeText={(depositAmount) => {
           this.setState({depositAmount});
          }}
          mode='outlined'
         />
        </View>
        <View style={styles.inputContainer}>
         <TextInput
          style={styles.textInput}
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
          label='Number of Installment'
          keyboardType='numeric'
          value={this.state.depositAmount}
          onChangeText={(depositAmount) => {
           this.setState({depositAmount});
          }}
          mode='outlined'
         />
        </View>
        <View style={styles.inputContainer}>
         <TextInput
          style={styles.textInput}
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
          label='Installment Period'
          keyboardType='numeric'
          value={this.state.depositAmount}
          onChangeText={(depositAmount) => {
           this.setState({depositAmount});
          }}
          mode='outlined'
         />
        </View>
        <View style={[styles.dropDownContainer, {marginTop: '5%'}]}>
         <TouchableOpacity
          style={{
           width: width - 50,
           flexDirection: 'row',
           alignItems: 'center',
          }}
         >
          <View style={styles.container}>
           <Text style={styles.textLabel}>Installment Unit</Text>
           <Text style={styles.valueText}>{this.state.installmentUnit}</Text>
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
          onPress={() => navigation.navigate(this, 'StandingInstructionsOTP')}
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
           {strings.next}
          </Text>
         </TouchableOpacity>
        </CardView>
        {/* Debit Account */}
       </View>
      </ScrollView>
     </View>
    </ImageBackground>
   </View>
  );
 }
}
const styles = StyleSheet.create({
 container: {flex: 1},
 textLabel: {
  color: colors.accTextColor + '80',
  marginLeft: 15,
  fontSize: 10,
  fontFamily: strings.fontMedium,
 },
 valueText: {
  color: colors.accTextColor,
  marginLeft: 15,
  fontSize: 15,
  fontFamily: strings.fontMedium,
 },
 buttonContainer: {
  width: '90%',
 },
 headerTitleStyle: {
  marginLeft: 15,
  color: 'white',
  fontSize: 24,
  fontFamily: strings.fontBold,
 },
 subTitleStyle: {
  marginLeft: 15,
  color: 'white',
  fontSize: 15,
  fontFamily: strings.fontRegular,
 },
 accountDetailsContainer: {
  flex: 0.75,
  // alignItems: 'center',
  backgroundColor: '#fff',
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  flexDirection: 'column',
 },
 scrollContainer: {
  alignItems: 'center',
  marginVertical: '7%',
 },
 inputContainer: {
  marginVertical: '2%',
 },
 textInput: {
  marginVertical: 0,
  height: 48,
  width: width - 50,
 },
 dropDownContainer: {
  height: 48,
  width: width - 50,
  backgroundColor: colors.white,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#DFE1E8',
  // marginBottom: 10
 },
 accountNoContainer: {
  marginVertical: 15,
  height: 48,
  width: width - 50,
  backgroundColor: colors.white,
  justifyContent: 'center',
  alignItems: 'center',
 },
});
export default connect(mapStateToProps, mapDispatchToProps)(AddStandingInstructions);
