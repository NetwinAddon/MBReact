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
import Arrowdown from '../../../assets/icons/dashboardIcons/arrow_down.svg';
import { ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';
import CustomRadioGroup from '../../../components/CustomRadioGroup';
import {RadioButton} from 'react-native-paper';
import People from '../../../assets/icons/PeopleGroup.svg';
import TrasnperantFixedHeader from '../../../components/TrasnperantFixedHeader';

class DepositOpenAccount extends Component {
 constructor(props) {
  super(props);
  this.accData = [
   {label: 'Savings Acc', value: '1'},
   {label: 'Fixed deposit Acc', value: '2'},
   {label: 'Current Acc', value: '3'},
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
      {strings.depositOpenAcc}
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
      {strings.addDetailstoNewAcc}
     </Text>
    </View>

    <View
     style={{
      flex: 0.75,
      width: width,
      backgroundColor: '#fbfcfc',
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
       {/* Debit Account */}

       <Text
        style={{
         // width : width -40,
         marginTop: 25,
         fontSize: 15,
         fontFamily: strings.fontRegular,
         color: 'black',
         // backgroundColor : 'red'
        }}
       >
        {strings.creditAmount}
       </Text>

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
        //  onPress={() => this.setState({isDebitAcc: true, labelText: 'Debit Account'})}
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
           {strings.SavingAccount}
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
       {/* {selectAccount(
        this.state.isDebitAcc,
        this.accData,
        this.onSelectDebitAccount,
        this.state.labelText,
        this.state.accData
       )} */}

       {/* Account Number */}
       <View
        style={{
         marginTop: 15,
         height: 48,
         width: width - 40,
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
           {strings.accNo}
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
        </View>
       </View>

       <View style={{marginLeft: 15}}>
        {/* Radio Button */}
        <Text
         style={{
          fontFamily: strings.fontRegular,
          marginLeft: 10,
          marginTop: 15,
          color: 'black',
          // marginRight : 10
          fontSize: 15,
         }}
        >
         {strings.nomineeRequired}
        </Text>
        <View
         style={{
          marginTop: 5,
          flexDirection: 'row',
         }}
        >
         <View
          style={{
           flexDirection: 'row',
           alignItems: 'center',
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
          <Text
           style={{
            color: 'black',
            fontFamily: strings.fontRegular,
            marginRight: 10,
           }}
          >
           {strings.no}
          </Text>
         </View>
         <View
          style={{
           flexDirection: 'row',
           alignItems: 'center',
           marginBottom: 10,
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
          <Text
           style={{
            color: 'black',
            // marginRight : 10
            fontFamily: strings.fontRegular,
           }}
          >
           {strings.yes}
          </Text>
         </View>
        </View>

        {this.state.checked == 'yes' && (
         <View>
          <View
           style={{
            // width : width -40,
            marginLeft: 5,
           }}
          >
           <Text
            style={{
             color: this.props.textColor,
             // marginLeft : 10,
             fontFamily: strings.fontMedium,
             fontSize: 15,
            }}
           >
            {strings.selectOrAddNominee}
           </Text>
           <View
            style={{
             marginTop: 8,
             flexDirection: 'row',
             paddingRight: 20,
             width: width - 40,
             // flex :1,
             // backgroundColor : 'gray'
            }}
           >
            <Text
             style={{
              color: '#EB5757',
              // marginLeft : 10,
              fontFamily: strings.fontMedium,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              fontSize: 13,
              padding: 3,
              paddingTop: 0,
              // backgroundColor : 'green'
             }}
            >
             {strings.note}
            </Text>
            <Text
             style={{
              color: '#EB5757',
              // padding : 10,
              // marginLeft : 10,
              fontFamily: strings.fontMedium,
              fontSize: 13,
              textAlign: 'left',
              // marginRight : 25,
              paddingRight: 35,
              // backgroundColor : 'green'
             }}
            >
             {strings.noteDetails}
            </Text>
           </View>
          </View>

          {/* Add nominee btn */}
          <TouchableOpacity
           style={{
            // flex : 1,
            width: '50%',
            flexDirection: 'row',
            marginTop: 15,
            padding: 5,
            marginRight: 10,
            // backgroundColor: '#f4f5fa',
            borderWidth: 1.5,
            borderColor: '#8bb9dc',
            borderRadius: 10,
            justifyContent: 'flex-start',
            alignItems: 'center',
           }}
           // disabled={this.state.checked == true ? false : true}
           onPress={() => this.toAddNominee()}
          >
           <View
            style={{
             height: 35,
             width: 35,
             // borderRadius: 40/2,
             // backgroundColor: this.props.themeColor + '1A',
             alignItems: 'center',
             justifyContent: 'center',
            }}
           >
            <People
             color={this.state.checked ? this.props.themeColor : 'gray'}
             height={20}
             width={20}
            />
           </View>

           <Text
            style={{
             marginLeft: 5,
             alignSelf: 'center',
             // justifyContent : 'center',
             color: this.state.checked ? this.props.textColor : 'gray',
             fontFamily: strings.fontMedium,
             fontSize: 15,
             marginBottom: 3,
             marginRight: 5,
            }}
           >
            {strings.addNominee}
           </Text>
          </TouchableOpacity>

          {/* Nominee list  */}
          <CustomRadioGroup options={options} onSelect={this.handleOptionSelect} />
         </View>
        )}
       </View>
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
         onPress={() => this.toReviewFD()}
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
     </ScrollView>
    </View>
   </ImageBackground>
  );
 }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositOpenAccount);
