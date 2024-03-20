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
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview'
import TrasnsperantFixedHeader from '../../components/TrasnperantFixedHeader';
import Fingerprint from '../../assets/icons/SampleFingerprint.svg'


class SetFingurePrint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        };
    }

    onBackAction() {
        navigation.goBack(this)
    }

    optionalConfigObject ={
        title: 'Authentication Required',
        imageColor: '#e00606', 
        imageErrorColor: '#ff0000', 
        sensorDescription: 'Touch sensor',
        sensorErrorDescription: 'Failed', 
        cancelText: 'Cancel', 
        fallbackLabel: 'Show Passcode', 
        unifiedErrors: false,
        passcodeFallback: false, 
      };

    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg3

    render() {
        return (
            <View style={styles.mainContainer}>
                <ImageBackground style={styles.mainContainer}
                    source={this.bgImage}
                    resizeMode='cover'>
                    <View style={styles.headerContainer}>
                        <TrasnsperantFixedHeader
                            backAction={() => this.onBackAction()}/>
                        <Text style={styles.HeadingText}>Fingerprint</Text>
                        <Text style={styles.SubHeading}>Please lift and rest your finger</Text>
                    </View>
                    <View style={styles.CurvedBg}>
                        <View style={styles.headerLableConatiner}>
                            <Fingerprint height={120} width={120} color={this.props.SecondaryColor} />
                        </View>
                        <View style={styles.mainLabelContainer}>
                            <CardView
                                cardElevation={3}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.cardContainer}>
                                <TouchableOpacity
                                     style={[styles.setUpTouchable, { backgroundColor: this.props.PrimaryColor}]}
                                    onPress={() => this.handleBiometric()}
                                ><Text style={styles.setUpText}>Set up</Text>
                                </TouchableOpacity>
                            </CardView>
                            <View style={styles.termsAndConditionsView}>
                                <TouchableOpacity style={[styles.termsAndConditionsView, { justifyContent:'center' }]}>
                                    <Text style={[styles.termsAndConditionsText, {color: this.props.PrimaryColor}]}
                                    >{strings.termsAndConditions}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = {
    mainContainer:
    {
        flex: 1
    },
    headerContainer:
    {
        flex: 0.35,
         justifyContent: 'flex-start' 
    },
    headerLableConatiner:
    {
        marginTop: 40,
        height: 250,
        width: 250,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainLabelContainer:
    {
        flex: 1,
        width: width - 40,
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 20
    },
    cardContainer:
    {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 20,
    },
    setUpTouchable:
    {
        padding: 15,
        width: width - 50,
        justifyContent: 'center',
        borderRadius: 12,
    },
    setUpText:
    {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15
    },
    HeadingText:
    {
        marginLeft: 25,
        color: 'white',
        fontSize: 24,
        fontFamily: strings.fontBold,
        marginTop: 20
    },
    SubHeading:
    {
        marginLeft: 25,
        color: 'white',
        fontSize: 15,
        fontFamily: strings.fontRegular
    },

    CurvedBg:
    {
        flex: 0.65,
        alignItems: 'center',
        backgroundColor: '#fbfcfc',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column'
    },
    termsAndConditionsView:
    {
        alignItems: 'center',
        flexDirection: 'row',
    },
    termsAndConditionsText:
    {
        textAlign: 'center',
        fontFamily: strings.fontRegular,
        fontSize: 12,
        marginBottom: 3
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetFingurePrint);
