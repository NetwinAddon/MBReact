import React, { Component } from 'react';
import {
    Text,
    View,
    ImageBackground,
} from 'react-native';
import {
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    navigation,
    themeImage,
    appThemeConfiguration,
} from '../../App';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview'
import TrasnsperantFixedHeader from '../../components/TrasnperantFixedHeader';

import DropDown from '../../assets/icons/DropDown.svg'

import Password from '../../assets/icons/fi-rr-password.svg'

import Lock from '../../assets/icons/Ico-lock.svg'
import Colors from '../../common/Colors';




class ForgetMpinOptionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }


    ResetUsingAccountDetails() {
        this.props.navigation.navigate('ForgetMpinAccountDetails')

    }

    ResetUsingIdPassword() {
        this.props.navigation.navigate('ForgetMpin')
    }


    onBackAction() {
        navigation.goBack(this)
    }

    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg2

    render() {
        return (
            <View style={styles.ViewFlexOne}>

                <ImageBackground style={styles.ViewFlexOne}
                    source={this.bgImage}
                    resizeMode='cover'
                >
                    <View style={styles.TransparentHeaderBG}>
                        <TrasnsperantFixedHeader
                            backAction={() => this.onBackAction()}
                        />
                        <Text style={styles.TitleHeading}>Reset MPIN</Text>
                        <Text style={styles.TitleSubHeading}>Set Or Change MPIN</Text>

                    </View>
                    <View style={styles.ViewStyleBG}>

                        <ScrollView >

                            {/* Change MPIN Using Password */}
                            <CardView
                                cardElevation={2}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.CardStyle}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.ResetUsingIdPassword();
                                    }} >
                                    <View style={styles.Touchablestyle}>

                                        <View style={styles.TouchableMainView} >
                                            <View style={styles.ViewStyle}>
                                                <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                    <Password height={18} width={22} color={this.props.SecondaryColor} />
                                                </View>
                                            </View>
                                            <Text style={styles.MainTextStyle}> Reset Using ID-Password </Text>
                                        </View>
                                        <View
                                            style={styles.ArrowIcon}>
                                            <DropDown width={15} height={15} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </CardView>

                            {/* Change MPIN Using AcountDetails*/}
                            <CardView
                                cardElevation={2}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.CardStyle}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.ResetUsingAccountDetails();}} >
                                            
                                    <View
                                        style={styles.Touchablestyle}>
                                        <View style={styles.TouchableMainView} >
                                            <View style={styles.ViewStyle}>
                                                <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                    <Lock height={18} width={22} color={this.props.SecondaryColor} />
                                                </View>
                                            </View>
                                            <Text style={styles.MainTextStyle}>  Reset Using Account Details </Text>
                                        </View>
                                        <View
                                            style={styles.ArrowIcon}>
                                            <DropDown width={15} height={15} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </CardView>

                        </ScrollView>
                    </View>
                </ImageBackground>
            </View>


        );
    }
}

const styles = {

    CardStyle:
    {
        backgroundColor: 'white',
        marginTop: 15,
        marginBottom: 5,
        width: width - 40,
        marginHorizontal: 5,
        alignItems: 'center'
    },
    Touchablestyle:
    {

        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        alignItems: 'center',
        width: width - 40,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: '#cdcdce',
        borderRadius: 12,

    },
    TouchableMainView:
    { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    IconBgStyle:
    {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: Colors.themeColorOrange + '1A',
        alignItems: 'center',
        justifyContent: 'center'
    },
    MainTextStyle:
    {
        fontSize: 15,
        includeFontPadding: false,
        color: Colors.boldTextColor,
        fontFamily: strings.fontMedium
    },

    ViewStyle:
    {
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },

    ArrowIcon:
    {
        width: 20,
        height: 20,
        justifyContent: 'flex-end',
        transform: [{ rotate: '-90deg' },],
    },
    TitleHeading:
    {
        marginLeft: 15,
        color: 'white',
        fontSize: 24,
        fontFamily: strings.fontBold,
        marginTop: 15,
    },
    TitleSubHeading:
    {
        marginLeft: 15,
        color: 'white',
        fontSize: 15,
        fontFamily: strings.fontRegular
    },
    ViewStyleBG:
    {
        flex: 0.9,
        alignItems: 'center',
        backgroundColor: '#fbfcfc',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column',
        paddingTop: 30,
        marginTop: 20,
    },
    ViewFlexOne: {
        flex: 1,
    },

    TransparentHeaderBG:
    { 
        flex: 0.3,             
        justifyContent: 'flex-start' 
    },
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgetMpinOptionScreen);
