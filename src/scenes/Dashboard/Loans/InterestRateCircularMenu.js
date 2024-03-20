import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
} from 'react-native';
import {
    colors,
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    navigation,
    appThemeConfiguration,
} from '../../../App';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview'
import TrasnperantFixedHomeHeader from '../../../components/TrasnperantFixedHomeHeader';
import LoanIntRateIcon from '../../../assets/icons/laon_int_rate.svg'
import DepIntRateIcon from '../../../assets/icons/icon_dep_int_rate.svg'
import Colors from '../../../common/Colors';

class InterestRateCircularMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            callFrom: this.props.route.params.from,
            accounList: props.route.params.dashboardArray,
        };
    }


    onBackAction() {
        navigation.goBack(this)
    }

    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg
    render() {
        return (
            <View style={styles.container}>
                <ImageBackground style={styles.imageBackground} source={this.bgImage} resizeMode='cover'>
                    <View style={styles.headerContainer}>
                        <TrasnperantFixedHomeHeader backAction={() => this.onBackAction()} />
                        <Text style={styles.title}>{strings.interestRateCircular}</Text>
                        <Text style={styles.subtitle}>{strings.interestRateCircularDescription}</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Deposit Interest Rate */}
                            <CardView
                                cardElevation={2}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.CardStyle}>
                                <TouchableOpacity onPress={() => { }} style={styles.Touchablestyle}>
                                    <View style={styles.touchableInnerView}>
                                        <DepIntRateIcon height={33} width={37} color={this.props.SecondaryColor} />
                                        <Text style={styles.MainTextStyle}>{strings.depositeInterestRate}</Text>
                                    </View>
                                </TouchableOpacity>
                            </CardView>
                            {/* Loan Interest Rate */}
                            <CardView
                                cardElevation={2}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={styles.CardStyle}>
                                <TouchableOpacity onPress={() => { navigation.navigate(this, 'LoanInterestRate', { from: this.state.callFrom, dashboardArray: this.state.accounList }); }} style={styles.Touchablestyle}>
                                    <View style={styles.touchableInnerView}>
                                        <LoanIntRateIcon height={33} width={33} color={this.props.SecondaryColor} />
                                        <Text style={styles.MainTextStyle}>{strings.loanInterestRate}</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(InterestRateCircularMenu);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imageBackground: {
        flex: 1
    },
    headerContainer: {
        flex: 0.25,
        justifyContent: 'flex-start'
    },
    title: {
        marginLeft: 15,
        color: 'white',
        fontSize: 24,
        fontFamily: strings.fontBold
    },
    subtitle: {
        marginLeft: 15,
        color: 'white',
        fontSize: 15,
        fontFamily: strings.fontRegular
    },
    contentContainer: {
        flex: 0.75,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column',
        alignItems: 'center'
    },
    CardStyle:
    {
        backgroundColor: 'white',
        marginTop: 25,
        marginBottom: 5,
        width: width - 40,
        height: 80,
        justifyContent: 'center',
        marginHorizontal: 10
    },
    Touchablestyle:
    {
        flexDirection: 'row',
        marginHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: '#cdcdce',
        borderRadius: 12,

    },
    MainTextStyle:
    {
        fontSize: 15,
        includeFontPadding: false,
        color: Colors.boldTextColor,
        fontFamily: strings.fontMedium,
        fontWeight: '500',
        alignSelf: 'center',
        marginLeft: 20

    },
    touchableInnerView:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
       
    },
    iconView:
    {
        backgroundColor: 'white'
    }
});