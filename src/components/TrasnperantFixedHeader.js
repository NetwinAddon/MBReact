import React, { Component } from 'react';
import { Image, ImageBackground, Platform, Text, TouchableOpacity, View } from 'react-native';
import assets from '../assets';
import colors from '../common/Colors';
import { connect, mapDispatchToProps, mapStateToProps } from '../redux';
import { width, exist } from '../common/util';
// import StatusBar from './RenderStatusBar';

import { API, sendData, strings } from '../App';
import BackImg from '../assets/icons/iconArrowLeft.svg'


class TrasnperantFixedHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            // Main View
            <View
                style={{ paddingTop: Platform.OS == 'ios' ? 40 :  35 }}
            >

                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        alignContent: 'center',
                    }}>



                    <View style={{ flexDirection: 'row', }}>
                        <TouchableOpacity
                            style={{
                                // backgroundColor: 'red',
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
                                marginRight: 10

                            }} >
                                <BackImg color='white' height={20} width={20} />
                            </View>
                        </TouchableOpacity>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            // backgroundColor: 'green'
                        }}>
                            <Text style={{
                                fontSize: 23,
                                fontFamily: strings.fontBold,
                                color : 'white',
                                includeFontPadding: false
                            }}>{this.props.title ? this.props.title : ""}</Text>

                        </View>
                    </View>

                </View>
            </View>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TrasnperantFixedHeader);
