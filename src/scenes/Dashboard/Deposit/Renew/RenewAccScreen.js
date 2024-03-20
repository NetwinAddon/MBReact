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
} from '../../../../App';
import Arrowdown from '../../../../assets/icons/dashboardIcons/arrow_down.svg';
import {FlatList, ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';

import {TextInput, Button, TouchableRipple} from 'react-native-paper';
import {selectAccount} from '../../../../components/CustomPopups';
import CustomRadioGroup from '../../../../components/CustomRadioGroup';
import {RadioButton} from 'react-native-paper';
import People from '../../../../assets/icons/PeopleGroup.svg';
import {DropdownPopup} from '../DropdownPopup';
import Balance from '../../../../assets/icons/Balance.svg';
import TrasnperantFixedHeader from '../../../../components/TrasnperantFixedHeader';

class RenewAccScreen extends Component {
 constructor(props) {
  super(props);
  this.accData = [
   {label: 'Savings Account (121555)', value: '1'},
   {label: 'Savings Account (155855)', value: '2'},
  ];
  this.state = {
   isDebitAcc: false,
   accData: this.accData[0].label,
   checked: 'no',
   nominee: false,
  };
 }
 componentDidMount() {}

 onSelectDebitAccount = (value) => {
  this.setState({isDebitAcc: false, accData: value});
 };

 onBackAction() {
  navigation.goBack(this);
 }

 toReviewFD() {
  navigation.navigate(this, 'depositReviewFD');
 }

 toAddNominee() {
  navigation.navigate(this, 'depositAddNominee');
 }

 handleOptionSelect = (selectedOption) => {
  // Do something with the selected option value
  this.setState({nominee: true});
  console.log('Selected option:', selectedOption);
 };

 toSuccess() {
  // navigation.navigate(this, 'existingUserLoginSuccess')
 }
 bgImage = appThemeConfiguration(config.themeColor).bgImg;

 render() {
  const options = [
   {label: 'Raju Prasad Raundal', value: 0, number: '12345'},
   {label: 'Sagar Prasad Raundal', value: 1, number: '45323'},
   {label: 'Bhavana Prasad Raundal', value: 2, number: '54232'},
  ];
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
      {strings.RenewDepositAcc}
     </Text>

     <Text
      style={{
       marginLeft: 15,

       fontSize: 15,
       color: 'black',
       textAlign: 'left',
       fontFamily: strings.fontMedium,
       color: colors.white,
      }}
     >
      {strings.RenewDepositAccSubStr}
     </Text>
    </View>

    <View
     style={{
      flex: 0.75,
      width: width,
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
        // alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 30,
       }}
      >
       <View>
        {/* Radio Button */}
        <Text
         style={{
          fontFamily: strings.fontRegular,
          // marginLeft: 10,
          marginTop: 15,
          color: '#1F3C66',
          fontWeight: '600',
          fontSize: 15,
         }}
        >
         {'Select Renewal Option'}
        </Text>
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
            {'Renew with Maturity Amount'}
           </Text>
          </View>
          <View
           style={{
            // flex: 1,
            justifyContent: 'flex-end',
            marginBottom: 10,
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
         <View
          style={{
           flexDirection: 'row',
           alignItems: 'center',
           marginBottom: 5,
          }}
         >
          <View
           style={{
            flex: 1,
            justifyContent: 'flex-end',
           }}
          >
           <Text
            style={{
             color: '#555555',
             // marginRight : 10
             fontWeight: '400',
             fontFamily: strings.fontRegular,
            }}
           >
            {'Renew with Deposit Amount'}
           </Text>
          </View>
          <View
           style={{
            //flex: 1,
            justifyContent: 'flex-end',
           }}
          >
           <RadioButton
            value='yes'
            status={this.state.checked === 'yes' ? 'checked' : 'unchecked'}
            onPress={() => this.setState({checked: 'yes'})}
            color='black' // Set the fill color to black
            borderColor='black'
            theme={{
             colors: 'primary',
            }}
           />
          </View>
         </View>
        </View>
       </View>
       <View
        style={{
         marginTop: 10,
         height: 48,
         width: width - 40,
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
         onPress={() => this.setState({isDebitAcc: true, labelText: 'Credit the money back to'})}
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
           {'Credit the money back to'}
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
       <View
        style={{
         height: 75,
         width: width - 40,
         borderRadius: 10,
         borderColor: 'black',
         backgroundColor: '#e8f1f8',
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
           color: colors.accTextColor,
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
          {'85562518554'}
         </Text>
        </View>
       </View>
      </View>
     </ScrollView>
     {/* Next button */}
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
       // onPress={() => this.toReviewFD()}
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
    </View>
   </ImageBackground>
  );
 }
}

export default connect(mapStateToProps, mapDispatchToProps)(RenewAccScreen);
