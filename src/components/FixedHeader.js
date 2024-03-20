import React, { Component } from 'react';
import { Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import assets from '../assets';
import Colors from '../common/Colors';
import { connect, mapDispatchToProps, mapStateToProps } from '../redux';
import { width, exist, themeImage, appThemeConfiguration } from '../common/util';
// import StatusBar from './RenderStatusBar';

import { API, colors, config, sendData } from '../App';
import BackImg from '../assets/icons/iconArrowLeft.svg'


class FixedHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg
 
  render() {
    return (
      // Main View
      <ImageBackground style={{ paddingTop: 35 }}
        source={this.bgImage}
        resizeMode='cover'
      >
        <View
          style={{ marginTop : Platform.OS == 'ios' ? 18 : 0 , backgroundColor: '#fff'}}
        >
        <View style={{
          height: 25,
          marginHorizontal: 25,
          marginBottom: -18,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          backgroundColor: Colors.white,
          opacity: 0.35,
          // marginTop: 40
        }}></View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            // height: 80,
            // zIndex : -1,
            backgroundColor: Colors.white,
            alignItems: 'center',
            alignContent: 'center',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}>

          {/* Back button */}

          

          <View style={{ flexDirection: 'row', }}>
            <TouchableOpacity
              style={{
                // backgroundColor : 'red'
              }}
              onPress={() => {
                this.props.backAction();
              }}
            >
              <View style={{
                height: 20,
                width: 20,
                // justifyContent: '',
                alignItems: 'flex-start',
                margin: 20,
              }} >
                <BackImg color = {this.props.color? this.props.color : colors.white } height={20} width={20} />
              </View>
            </TouchableOpacity>
            <View style={{ flex: 1 }}></View>
          </View>

        </View>
        </View>
      </ImageBackground>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(FixedHeader);
