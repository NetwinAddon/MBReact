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
import {FlatList, ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';
import {TextInput, Button, TouchableRipple} from 'react-native-paper';
import TrasnperantFixedHeader from '../../../components/TrasnperantFixedHeader';

class DepositAddNominee extends Component {
 constructor(props) {
  super(props);

  this.state = {
   name: '',
   address: '',
   taluka: '',
   city: '',
   relation: '',
   age: '',
   nominee: '',
   nomineeName: '',
   percent: '',
  };
 }
 componentDidMount() {}

 backToDetails() {
  navigation.navigate(this, 'depositOpenAccount');
 }

 onBackAction() {
  navigation.goBack(this);
 }

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
       {strings.addNominee}
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
       {strings.nomineeStr}
      </Text>
     </View>
     <View
      style={{
       flex: 0.75,
       alignItems: 'center',
       backgroundColor: '#fbfcfc',
       // backgroundColor: 'red',
       borderTopLeftRadius: 30,
       borderTopRightRadius: 30,
       flexDirection: 'column',
       // justifyContent: 'space-between'
      }}
     >
      <ScrollView keyboardShouldPersistTaps='handled'>
       <View
        style={{
         // marginTop: 20,
         paddingTop: 5,
         alignItems: 'center',
         paddingTop: 10,
         paddingBottom: 30,
        }}
       >
        {/* name */}
        <View
         style={{
          // backgroundColor: '#00FF00',
          flexDirection: 'column',
          marginBottom: 10,
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
           marginTop: 10,
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
          label='Name'
          value={this.state.name}
          onChangeText={(name) => {
           this.setState({name});
          }}
          mode='outlined'
         />
        </View>

        {/* address*/}
        <View
         style={{
          // backgroundColor: '#AA0000',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          marginBottom: 10,
         }}
        >
         {/* old */}
         {/* <TextInput
                                placeholder={'address number'}
                                placeholderTextColor={'gray'}
                                value={this.state.address}
                                style={{
                                    width: '100%',
                                    backgroundColor: 'white',
                                    height: 40,
                                    borderRadius: 20,
                                    borderWidth: 0.7,
                                    paddingLeft: 15

                                }}
                                onChangeText={address => {
                                    this.setState({ address });
                                }}
                            /> */}

         {/* New */}

         <TextInput
          style={{
           lineHeight: 40,
           height: 48,
           width: width - 50,
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
          label='address'
          value={this.state.address}
          onChangeText={(address) => {
           this.setState({address});
          }}
          mode='outlined'
         />
        </View>

        {/* taluka */}
        <View
         style={{
          flexDirection: 'column',
          // padding: 5,
          justifyContent: 'center',
          // alignItems: 'flex-start',
          marginBottom: 10,
         }}
        >
         {/* old */}
         {/* <TextInput
                                placeholder={'User ID'}
                                placeholderTextColor={'gray'}
                                value={this.state.address}
                                style={{
                                    width: '100%',
                                    backgroundColor: 'white',
                                    height: 40,
                                    borderRadius: 20,
                                    borderWidth: 0.7,
                                    paddingLeft: 15

                                }}
                                onChangeText={taluka => {
                                    this.setState({ taluka });
                                }}
                            /> */}
         {/* new */}
         <TextInput
          style={{
           lineHeight: 40,
           height: 48,
           width: width - 50,
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
          label='taluka'
          value={this.state.taluka}
          onChangeText={(taluka) => {
           this.setState({taluka});
          }}
          mode='outlined'
         />
        </View>

        {/* city*/}
        <View
         style={{
          flexDirection: 'column',
          // padding: 5,
          justifyContent: 'center',
          // alignItems: 'flex-start',
          marginBottom: 10,
         }}
        >
         {/* new */}
         <TextInput
          style={{
           lineHeight: 40,
           height: 48,
           width: width - 50,
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
          label='City'
          value={this.state.city}
          onChangeText={(city) => {
           this.setState({city});
          }}
          mode='outlined'
         />
        </View>

        {/* Relation */}
        <View
         style={{
          flexDirection: 'column',
          // padding: 5,
          justifyContent: 'center',
          // alignItems: 'flex-start',
          marginBottom: 10,
         }}
        >
         <TextInput
          style={{
           lineHeight: 40,
           height: 48,
           width: width - 50,
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
          label='Relation'
          value={this.state.relation}
          onChangeText={(relation) => {
           this.setState({relation});
          }}
          mode='outlined'
         />
        </View>

        {/* Age*/}
        <View
         style={{
          flexDirection: 'column',
          // padding: 5,
          justifyContent: 'center',
          // alignItems: 'flex-start',
          marginBottom: 10,
         }}
        >
         <TextInput
          style={{
           lineHeight: 40,
           height: 48,
           width: width - 50,
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
          label='Age'
          value={this.state.age}
          onChangeText={(age) => {
           this.setState({age});
          }}
          mode='outlined'
         />
        </View>

        {/* Nominee Guardian  (If no. minor)  */}
        <View
         style={{
          flexDirection: 'column',
          // padding: 5,
          justifyContent: 'center',
          // alignItems: 'flex-start',
          marginBottom: 10,
         }}
        >
         <TextInput
          style={{
           lineHeight: 40,
           height: 48,
           width: width - 50,
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
          label='Nominee Guardian  (If no. minor) '
          value={this.state.nominee}
          onChangeText={(nominee) => {
           this.setState({nominee});
          }}
          mode='outlined'
         />
        </View>

        {/*  nomineeName  */}
        <View
         style={{
          flexDirection: 'column',
          // padding: 5,
          justifyContent: 'center',
          // alignItems: 'flex-start',
          marginBottom: 10,
         }}
        >
         <TextInput
          style={{
           lineHeight: 40,
           height: 48,
           width: width - 50,
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
          label='Name'
          value={this.state.nomineeName}
          onChangeText={(nomineeName) => {
           this.setState({nomineeName});
          }}
          mode='outlined'
         />
        </View>

        {/*  Percent  */}
        <View
         style={{
          flexDirection: 'column',
          // padding: 5,
          justifyContent: 'center',
          // alignItems: 'flex-start',
          marginBottom: 10,
         }}
        >
         <TextInput
          style={{
           lineHeight: 40,
           height: 48,
           width: width - 50,
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
          label='Percent'
          value={this.state.percent}
          onChangeText={(percent) => {
           this.setState({percent});
          }}
          mode='outlined'
         />
        </View>

        {/* buttons */}
        <TouchableOpacity
         style={{
          marginTop: 15,
          height: 52,
          width: width - 50,
          alignItems: 'center',
          backgroundColor: '#929CAC',
          // marginTop: 20,
          justifyContent: 'center',
          borderRadius: 12,
         }}
         onPress={() => {
          console.log(this.props);
          this.backToDetails();
          // this.props.onSubmit()
         }}
        >
         <Text style={{color: 'black'}}>{strings.submit}</Text>
        </TouchableOpacity>
       </View>
      </ScrollView>
     </View>
    </ImageBackground>
   </View>
  );
 }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositAddNominee);
