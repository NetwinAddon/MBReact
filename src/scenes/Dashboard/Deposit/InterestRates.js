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
import TrasnperantFixedHeader from '../../../components/TrasnperantFixedHeader';


class InterestRates extends Component {
 constructor(props) {
  super(props);
  this.Data = [
   {label: 'From 1 Day to 30 Days', value: '1', rateOfInterest: '0'},
   {label: 'From 31 Days to 100 Days', value: '2', rateOfInterest: '5'},
   {label: 'From 100 Days to 200 Days', value: '3', rateOfInterest: '6.5'},
   {label: 'From 200 Days to 364 Days', value: '4', rateOfInterest: '7.5'},
   {label: 'From  364 Days to 9999 Days', value: '5  ', rateOfInterest: '8.5'},
  ];

  this.state = {};
 }

 BulletPoint = ({text, index}) => {
  return (
   <View
    style={{
     flex: 0.85,
     flexDirection: 'row',
     alignItems: 'flex-start',
    }}
   >
    <View
     style={{
      flexDirection: 'row',

      backgroundColor: index == 1 ? '' : this.props.themeColor + '80',
      padding: 15,
      paddingLeft: 10,
      paddingRight:
       index == 1 ? 0 : index == 2 ? 5 : index == 3 ? 14 : index == 4 ? 25 : index == 5 ? 30 : 0,
      borderRadius: 12,
     }}
    >
     <Text
      style={{
       color: this.props.themeColor,
       marginRight: 5,
       // fontSize: 1,
      }}
     >{`\u25CF`}</Text>
     <Text
      style={{
       color: 'black',
       fontFamily: strings.fontRegular,
       fontSize: 15,
      }}
     >
      {text}
     </Text>
    </View>
   </View>
  );
 };

 componentDidMount() {}

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
       Interest Rates
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
      {/* Account Number */}
      <FlatList
       style={{marginTop: 35}}
       data={this.Data}
       keyExtractor={(item, index) => index}
       showsVerticalScrollIndicator={false}
       renderItem={({item}) => {
        return (
         <View
          style={{
           flex: 1,
           marginTop: 15,
           width: width - 50,
           backgroundColor: '#f4f5fa',
           borderRadius: 12,
           flexDirection: 'row',
           alignItems: 'center',
           justifyContent: 'center',
          }}
         >
          <this.BulletPoint text={item.label} index={item.value} />
          <View
           style={{
            flex: 0.15,
            // backgroundColor : 'red'
           }}
          >
           <Text
            style={{
             textAlign: 'right',
             paddingRight: 5,
             color: 'black',
            }}
           >
            {item.rateOfInterest}%
           </Text>
          </View>
         </View>
        );
       }}
      />
     </View>
    </ImageBackground>
   </View>
  );
 }
}

export default connect(mapStateToProps, mapDispatchToProps)(InterestRates);
