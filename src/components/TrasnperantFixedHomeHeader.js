import React, { Component } from 'react';
import { Image, ImageBackground, Platform, Text, TouchableOpacity, View } from 'react-native';
import assets from '../assets';
import colors from '../common/Colors';
import { connect, mapDispatchToProps, mapStateToProps } from '../redux';
// import StatusBar from './RenderStatusBar';
import BackImg from '../assets/icons/iconArrowLeft.svg'
import HouseBlank from '../assets/icons/house-blank.svg'
import { useNavigation, useRoute } from '@react-navigation/native';



const TrasnperantFixedHomeHeader = ({ backAction}) => {
    const navigation = useNavigation();
    const route = useRoute();
    // console.log("Route==========", route)
    return (
      <View style={{ paddingTop: Platform.OS == 'ios' ? 40 : 35 }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            alignContent: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                backAction();
              }}
            >
              <View
                style={{
                  height: 20,
                  width: 20,
                  alignItems: 'flex-start',
                  margin: 20,
                  marginRight: 10,
                }}
              >
                <BackImg color='white' height={20} width={20} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if(route.params.from === 'QuickPay')
                {
                  navigation.navigate('quickPayScreen', {accList: route.params.dashboardArray});
                }
                else
                {
                  navigation.navigate('bottomNavigator', {userData: route.params.dashboardArray});
                }
               
              }}
              style={{
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                flex: 1,
              }}
            >
              <View
                style={{
                  height: 20,
                  width: 20,
                  alignItems: 'flex-end',
                  margin: 20,
                  marginRight: 22,
                }}
              >
                <HouseBlank color='white' height={20} width={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  
 
  
  export default connect(mapStateToProps, mapDispatchToProps)(TrasnperantFixedHomeHeader);
