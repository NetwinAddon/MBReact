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
    appThemeConfiguration,
} from '../../App';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview'
import TrasnsperantFixedHeader from '../../components/TrasnperantFixedHeader';

import DropDown from '../../assets/icons/DropDown.svg'

import Password from '../../assets/icons/fi-rr-password.svg'
import Lock from '../../assets/icons/Ico-lock.svg'
import Colors from '../../common/Colors';




class ForgetOptionScreen extends Component {
    constructor(props) {
        super(props);
      
    }

    componentDidMount() {
    }



    ForgetUserId() {
        this.props.navigation.navigate('ForgetUserId')
    }

    ForgetPassword() {
        this.props.navigation.navigate('ForgetPassword')
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
                    resizeMode='cover'>

                    <View style={styles.TransparentHeaderBG}>

                        <TrasnsperantFixedHeader
                            backAction={() => this.onBackAction()} />

                        <Text style={styles.TitleHeading}>Forget Password</Text>

                        <Text style={styles.TitleSubHeading}>Set Or Change Passwords</Text>

                    </View>

                    <View style={styles.ViewStyleBG}>

                        <ScrollView >

                            <CardView
                                cardElevation={2}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.CardStyle}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.ForgetUserId();
                                    }} >
                                    <View
                                        style={styles.Touchablestyle}>

                                        <View style={styles.CardViewMain} >
                                            <View style={styles.ViewStyle}>
                                                <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                    <Password height={18} width={22} color={this.props.SecondaryColor} />
                                                </View>
                                            </View>
                                            <Text style={styles.MainTextStyle}> Forget User ID </Text>
                                        </View>
                                        <View style={styles.ArrowIcon}>
                                            <DropDown width={15} height={15} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </CardView>

                            {/* Forget Password */}
                            <CardView
                                cardElevation={2}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.CardStyle} >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.ForgetPassword();
                                    }}>
                                    <View
                                        style={styles.Touchablestyle}>
                                        <View style={styles.CardViewMain} >
                                            <View style={styles.ViewStyle}>
                                                <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                    <Lock height={18} width={22} color={this.props.SecondaryColor} />
                                                </View>
                                            </View>

                                            <Text style={styles.MainTextStyle}> Forget Password</Text>
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

    CardViewMain:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
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
    ViewStyleBG:
    {
        flex: 1,
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
        { flex: 0.4, justifyContent: 'flex-start' },
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgetOptionScreen);
