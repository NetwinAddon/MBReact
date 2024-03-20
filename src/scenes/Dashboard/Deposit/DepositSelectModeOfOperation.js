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
import TrasnperantFixedHeader from '../../../components/TrasnperantFixedHeader';


class DepositSelectModeOfOperation extends Component {
 constructor(props) {
  super(props);

  this.state = {
   otp: '',
   isSelf: true,
  };
 }
 componentDidMount() {}

 onBackAction() {
  navigation.goBack(this);
 }

 toSuccess() {
  // navigation.navigate(this, 'existingUserLoginSuccess')
 }

 toMoreDetails() {
  navigation.navigate(this, 'depositOpenAccount');
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
      New Deposits A/c Opening
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
      Select mode of operation
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
     <View
      style={{
       marginTop: 20,
       flexDirection: 'row',
       alignItems: 'center',
      }}
     >
      <Text
       style={{
        fontSize: 15,
        textAlign: 'left',
        fontFamily: strings.fontMedium,
        color: this.props.textColor,
       }}
      >
       Mode of Operation
      </Text>
     </View>

     <View
      style={{
       width: width - 40,
       marginTop: 10,
       paddingVertical: 8,
       backgroundColor: colors.cardView,
       borderRadius: 10,
       justifyContent: 'space-evenly',
       alignItems: 'center',
       flexDirection: 'row',
      }}
     >
      <View
       style={{
        flex: 1,
       }}
      >
       <TouchableOpacity
        style={{
         marginLeft: 8,
         backgroundColor: colors.lightWhite,
         borderRadius: 5,
         justifyContent: 'center',
         alignItems: 'center',
         backgroundColor: this.state.isSelf == true ? colors.white : colors.cardView,
        }}
        onPress={() => this.setState({isSelf: true})}
       >
        <Text
         style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          fontFamily: strings.fontRegular,
          color: this.props.textColor,
          paddingVertical: 5,
          paddingHorizontal: 5,
         }}
        >
         Self
        </Text>
       </TouchableOpacity>
      </View>
      <View
       style={{
        flex: 1,
       }}
      >
       <TouchableOpacity
        style={{
         marginLeft: 8,
         backgroundColor: colors.cardView,
         borderRadius: 5,
         justifyContent: 'center',
         alignItems: 'center',
         marginRight: 8,
         backgroundColor: this.state.isSelf == true ? colors.cardView : colors.white,
        }}
        onPress={() => this.setState({isSelf: false})}
       >
        <Text
         style={{
          // flex: 1,
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          fontFamily: strings.fontRegular,
          color: this.props.textColor,
          paddingVertical: 5,
          paddingHorizontal: 5,
         }}
        >
         Joint
        </Text>
       </TouchableOpacity>
      </View>
     </View>

     {this.state.isSelf ? (
      <View
       style={{
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
        // flex: 1,
        // backgroundColor: 'black',
        // zIndex: 1
       }}
      >
       <Text
        style={{
         marginBottom: 10,
         fontFamily: strings.fontMedium,
         fontSize: 15,
         color: this.props.textColor,
        }}
       >
        Maturity Details
       </Text>

       {/*Interest rate card*/}
       <CardView
        cardElevation={3}
        cardMaxElevation={3}
        cornerRadius={10}
        style={{
         backgroundColor: colors.themeColorBlue,
         // height: 110,
         width: width - 70,
         justifyContent: 'center',
         alignItems: 'center',
        }}
       >
        <View
         style={{
          // justifyContent: 'space-between',
          alignItems: 'center',
          // zIndex: 1,
          paddingTop: 5,
          paddingBottom: 5,
          height: 110,
          width: width - 65,
          backgroundColor: colors.themeColorBlue,
          flexDirection: 'row',
         }}
        >
         <View
          style={{
           flex: 0.5,
           justifyContent: 'center',
           alignItems: 'center',
           // padding: 10
           // backgroundColor : 'red'
          }}
         >
          <View
           style={{
            flex: 1,
            // padding: 10,
            // backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
           }}
          >
           <Text
            style={{
             color: 'white',
             fontFamily: strings.fontBold,
             fontSize: 30,
            }}
           >
            8.5%
           </Text>
           <View
            style={{
             backgroundColor: '#FF5936',
             // padding: 7,
             borderRadius: 20,
            }}
           >
            <Text
             style={{
              color: 'white',
              fontFamily: strings.fontRegular,
              fontSize: 13,
              padding: 7,
              marginLeft: 10,
              marginRight: 10,
             }}
            >
             Interest Rate
            </Text>
           </View>
          </View>
         </View>

         <View
          style={{
           flex: 0.5,
           justifyContent: 'center',
           alignItems: 'center',
           // padding: 10
          }}
         >
          <View
           style={{
            flex: 1,
            // backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
           }}
          >
           <Text
            style={{
             color: 'white',
             fontFamily: strings.fontBold,
             fontSize: 30,
            }}
           >
            1717
           </Text>
           <View
            style={{
             backgroundColor: '#FF5936',
             // padding: 7,
             borderRadius: 20,
            }}
           >
            <Text
             style={{
              color: 'white',
              fontFamily: strings.fontRegular,
              fontSize: 13,
              padding: 7,
              marginLeft: 4,
              marginRight: 4,
             }}
            >
             Interest amount
            </Text>
           </View>
          </View>
         </View>
        </View>
       </CardView>

       {/* Rate Details */}
       <CardView
        style={{
         // oveflow : 'hidden',
         zIndex: -1,
         marginTop: -75,
         // flex :1,
         // height: 250,
         width: '100%',
         borderRadius: 8,
         backgroundColor: colors.white,
         // justifyContent: 'center',
         alignItems: 'center',
        }}
        cardElevation={2}
        cardMaxElevation={2}
        cornerRadius={12}
       >
        <View
         style={{
          flexDirection: 'column',
          justifyContent: 'center',
         }}
        >
         <View
          style={{
           // flex :1,
           width: width - 40,
           alignItems: 'center',
           marginTop: 70,
           // backgroundColor: 'green'
          }}
         >
          <View
           style={{
            padding: 8,
            // backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
           }}
          >
           <Text
            style={{
             fontSize: 13,
             fontFamily: strings.fontMedium,
             color: this.props.textColor,
            }}
           >
            Maturity Amount{' '}
           </Text>
           <Text
            style={{
             fontSize: 35,
             fontFamily: strings.fontBold,
             color: this.props.textColor,
            }}
           >
            ₹ 5,758
           </Text>
          </View>
          <View
           style={{
            padding: 15,
            // backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
           }}
          >
           <View
            style={{
             flex: 0.5,

             // backgroundColor : 'blue',
             justifyContent: 'center',
             alignItems: 'center',
            }}
           >
            <Text
             style={{
              fontSize: 12,
              fontFamily: strings.fontMedium,
              color: this.props.textColor,
             }}
            >
             Deposit Period
            </Text>
            <Text
             style={{
              fontSize: 17,
              fontFamily: strings.fontBold,
              color: this.props.textColor,
             }}
            >
             5 Years
            </Text>
           </View>
           <View
            style={{
             flex: 0.5,
             justifyContent: 'center',
             alignItems: 'center',
             // backgroundColor : 'green'
            }}
           >
            <Text
             style={{
              fontSize: 12,
              fontFamily: strings.fontMedium,
              color: this.props.textColor,
             }}
            >
             Maturity Date
            </Text>
            <Text
             style={{
              fontSize: 17,
              fontFamily: strings.fontBold,
              color: this.props.textColor,
             }}
            >
             03/04/2028
            </Text>
           </View>
          </View>
         </View>
        </View>
       </CardView>
      </View>
     ) : (
      <View
       style={{
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
        // flex: 1,
        // backgroundColor: 'black',
        // zIndex: 1
       }}
      >
       <Text
        style={{
         marginBottom: 10,
         fontFamily: strings.fontMedium,
         fontSize: 15,
         color: this.props.textColor,
        }}
       >
        Maturity Details
       </Text>

       {/*Interest rate card*/}
       <CardView
        cardElevation={3}
        cardMaxElevation={3}
        cornerRadius={10}
        style={{
         backgroundColor: colors.themeColorBlue,
         // height: 110,
         width: width - 70,
         justifyContent: 'center',
         alignItems: 'center',
        }}
       >
        <View
         style={{
          // justifyContent: 'space-between',
          alignItems: 'center',
          // zIndex: 1,
          paddingTop: 5,
          paddingBottom: 5,
          height: 110,
          width: width - 65,
          backgroundColor: colors.themeColorBlue,
          flexDirection: 'row',
         }}
        >
         <View
          style={{
           flex: 0.5,
           justifyContent: 'center',
           alignItems: 'center',
           // padding: 10
           // backgroundColor : 'red'
          }}
         >
          <View
           style={{
            flex: 1,
            // padding: 10,
            // backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
           }}
          >
           <Text
            style={{
             color: 'white',
             fontFamily: strings.fontBold,
             fontSize: 30,
            }}
           >
            10.0%
           </Text>
           <View
            style={{
             backgroundColor: '#FF5936',
             // padding: 7,
             borderRadius: 20,
            }}
           >
            <Text
             style={{
              color: 'white',
              fontFamily: strings.fontRegular,
              fontSize: 13,
              padding: 7,
              marginLeft: 10,
              marginRight: 10,
             }}
            >
             Interest Rate
            </Text>
           </View>
          </View>
         </View>

         <View
          style={{
           flex: 0.5,
           justifyContent: 'center',
           alignItems: 'center',
           // padding: 10
          }}
         >
          <View
           style={{
            flex: 1,
            // backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
           }}
          >
           <Text
            style={{
             color: 'white',
             fontFamily: strings.fontBold,
             fontSize: 30,
            }}
           >
            2022
           </Text>
           <View
            style={{
             backgroundColor: '#FF5936',
             // padding: 7,
             borderRadius: 20,
            }}
           >
            <Text
             style={{
              color: 'white',
              fontFamily: strings.fontRegular,
              fontSize: 13,
              padding: 7,
              marginLeft: 4,
              marginRight: 4,
             }}
            >
             Interest amount
            </Text>
           </View>
          </View>
         </View>
        </View>
       </CardView>

       {/* Rate Details */}
       <CardView
        style={{
         // oveflow : 'hidden',
         zIndex: -1,
         marginTop: -75,
         // flex :1,
         // height: 250,
         width: '100%',
         borderRadius: 8,
         backgroundColor: colors.white,
         // justifyContent: 'center',
         alignItems: 'center',
        }}
        cardElevation={2}
        cardMaxElevation={2}
        cornerRadius={12}
       >
        <View
         style={{
          flexDirection: 'column',
          justifyContent: 'center',
         }}
        >
         <View
          style={{
           // flex :1,
           width: width - 40,
           alignItems: 'center',
           marginTop: 70,
           // backgroundColor: 'green'
          }}
         >
          <View
           style={{
            padding: 8,
            // backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
           }}
          >
           <Text
            style={{
             fontSize: 13,
             fontFamily: strings.fontMedium,
             color: this.props.textColor,
            }}
           >
            Maturity Amount{' '}
           </Text>
           <Text
            style={{
             fontSize: 35,
             fontFamily: strings.fontBold,
             color: this.props.textColor,
            }}
           >
            ₹ 5,758
           </Text>
          </View>
          <View
           style={{
            padding: 15,
            // backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
           }}
          >
           <View
            style={{
             flex: 0.5,

             // backgroundColor : 'blue',
             justifyContent: 'center',
             alignItems: 'center',
            }}
           >
            <Text
             style={{
              fontSize: 12,
              fontFamily: strings.fontMedium,
              color: this.props.textColor,
             }}
            >
             Deposit Period
            </Text>
            <Text
             style={{
              fontSize: 17,
              fontFamily: strings.fontBold,
              color: this.props.textColor,
             }}
            >
             8 Years
            </Text>
           </View>
           <View
            style={{
             flex: 0.5,
             justifyContent: 'center',
             alignItems: 'center',
             // backgroundColor : 'green'
            }}
           >
            <Text
             style={{
              fontSize: 12,
              fontFamily: strings.fontMedium,
              color: this.props.textColor,
             }}
            >
             Maturity Date
            </Text>
            <Text
             style={{
              fontSize: 17,
              fontFamily: strings.fontBold,
              color: this.props.textColor,
             }}
            >
             10/04/2030
            </Text>
           </View>
          </View>
         </View>
        </View>
       </CardView>
      </View>
     )}
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
       onPress={() => this.toMoreDetails()}
      >
       <Text
        style={{
         alignSelf: 'center',
         color: 'white',
         fontFamily: strings.fontRegular,
         fontSize: 15,
        }}
       >
        Next
       </Text>
      </TouchableOpacity>
     </CardView>
    </View>
   </ImageBackground>
  );
 }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositSelectModeOfOperation);
