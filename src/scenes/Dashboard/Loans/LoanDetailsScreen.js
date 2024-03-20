import React, { Component } from 'react';
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    ImageBackground,
    LayoutAnimation,
    Switch,
    Animated
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
//import Arrowdown from '../../../../assets/icons/dashboardIcons/arrow_down.svg'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview'
import TrasnsperantFixedHeader from '../../../components/TrasnperantFixedHeader';
import Money from '../../../assets/icons/money-icon.svg';
import Calendar from '../../../assets/icons/calendar-icon.svg';
import Balance from '../../../assets/icons/Balance.svg'
import Wallet from '../../../assets/icons/rupee-wallet-icon.svg'
import EMIDATE from '../../../assets/icons/time-cal-icon.svg'
import InterestPayable from '../../../assets/icons/badge-percent-icon.svg'
import TotalPayable from '../../../assets/icons/payable-wallet-icon.svg'
import Slider from 'react-native-slider';
import { TextInput } from "react-native-paper";

class LoanHomeScreen extends Component {
    constructor(props) {
        super(props);
        console.log('======================= ' + this.props.route.params.LoanType)








        this.state = {
            depositAmount: '',
            isDebitAcc: false,
            isSelectAcc: false,
            isSelectedPeriod: false,
            yearOrMonths: '',
            days: '',
            LoanType: this.props.route.params.LoanType,
            rangeValue: 0,
            maxlength: 1000000,
            rangeTenureValue: 0,
            maxTenurelength: 100,
            switchValue: false,
            value: false,
            animation: new Animated.Value(0),

        };

    }

    componentDidMount() {
    }

    handleToggle = () => {
        const { value, animation } = this.state;
        const toValue = value ? 0 : 1;

        Animated.timing(animation, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();

        this.setState({ value: !value });
        var cal = 0
        console.log(this.state.rangeTenureValue)
        console.log(this.state.value)
        { this.state.value === true ? cal = this.state.rangeTenureValue / 12 : cal = this.state.rangeTenureValue * 12 }
        this.setState({ rangeTenureValue: cal })
    };





    toRateOfInterest() {
        navigation.navigate(this, 'interestRates')
    }

    toModeOfOperation() {
        navigation.navigate(this, 'depositSelectModeOfOperation')
    }


    changeLayout() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    onBackAction() {
        navigation.goBack(this)
    }

    checkpaas() {

    }
    handleTextInputChange = (value) => {
        // Ensure value is numeric before updating the state

        console.log('valuevaluevaluevalue  ' + value)
        if (value === '') {
            this.setState({ rangeValue: parseInt(0) });
        }
        else {
            var cal = 0
            this.setState({ rangeValue: parseInt(value) });

        }
    }

    handleTenureTextInputChange = (value) => {
        // Ensure value is numeric before updating the state
        console.log('valuevaluevaluevalue  ' + value)
        if (value === '') {
            this.setState({ rangeTenureValue: parseInt(0) });
        }
        else {
            this.setState({ rangeTenureValue: parseInt(value) });
        }
    }
    toSucess() {
        // navigation.navigate(this, 'existingUserLoginSuccess')
    }
    bgImage = appThemeConfiguration(config.themeColor).bgImg
    render() {
        const { value, animation } = this.state;
        const translateX = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 36],
        });
        return (
            <View style={styles.container}>
                <ImageBackground
                    style={styles.imageBackground}
                    source={this.bgImage}
                    resizeMode='cover'
                >
                    <View style={styles.headerContainer}>
                        <TrasnsperantFixedHeader
                            backAction={() => this.onBackAction()}
                        />
                        <Text style={styles.title}>
                            {this.state.LoanType === 'Gold' ? strings.goldLoan : strings.vehicleLoan}
                        </Text>
                        <Text style={styles.subtitle}>{strings.subStrLoan}</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <ScrollView>
                            <View style={styles.innerContainer}>
                                <View style={styles.balanceView}>
                                    <View style={styles.balIconContainer}>
                                        <Balance width={30} height={30} />
                                    </View>

                                    <View>
                                        <Text style={styles.balanceText}>
                                            Loan Amount
                                        </Text>

                                        <Text style={styles.amountText}>
                                            {strings.rupee + '35,000,00'}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.balanceView}>
                                    <View style={styles.balIconContainer}>
                                        <Wallet width={30} height={30} />
                                    </View>

                                    <View>
                                        <Text style={styles.balanceText}>
                                            Loan Tenure
                                        </Text>

                                        <Text style={styles.amountText}>
                                            {strings.rupee + '4654'}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: 15 , flexWrap: 'wrap',}}>

                                    <CardView
                                        cardElevation={4}
                                        cardMaxElevation={15}
                                        cornerRadius={15}
                                        style={{
                                            backgroundColor: 'white',
                                            width: width / 2 - 30,
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            height: 'auto',
                                            padding: 5,
                                            marginHorizontal: 5

                                        }}
                                    >
                                        <View style={{
                                            borderRightWidth: 1,
                                            paddingRight: 10,
                                            borderStyle: 'dotted',
                                            borderColor: '#93B1C8',
                                        }}>
                                            <Money />
                                        </View>
                                        <View style={{ paddingLeft: 10 }}>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: "500",
                                                fontFamily: "SF UI Display",
                                                color: "#686868",
                                                justifyContent: 'center',
                                            }}>{'Interest Rate'}</Text>
                                            <Text style={{
                                                fontSize: 16,
                                                fontWeight: "800",
                                                fontFamily: "SF UI Display",
                                                color: "#1F3C66",
                                                justifyContent: 'center',
                                            }}>{'10%'}</Text>
                                        </View>






                                    </CardView>

                                    <CardView
                                        cardElevation={4}
                                        cardMaxElevation={15}
                                        cornerRadius={15}
                                        style={{
                                            backgroundColor: 'white',
                                            width: width / 2 - 30,
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            height: 'auto',
                                            padding: 10,
                                            marginHorizontal: 5,
                                            

                                        }}
                                    >
                                        <View style={{
                                            borderRightWidth: 1,
                                            paddingRight: 10,
                                            borderStyle: 'dotted',
                                            borderColor: '#93B1C8',

                                        }}>
                                            <Calendar />
                                        </View>
                                        <View style={{ paddingLeft: 10, }}>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: "500",
                                                fontFamily: "SF UI Display",
                                                color: "#686868",
                                                justifyContent: 'center',
                                            }}>{'Your Monthly EMI '}</Text>
                                            <Text style={{
                                                fontSize: 16,
                                                fontWeight: "800",
                                                fontFamily: "SF UI Display",
                                                color: "#1F3C66",
                                                justifyContent: 'center',
                                            }}>{'3,06,080'}</Text>
                                        </View>






                                    </CardView>

                                </View>

                                <View style={styles.viewContainer}>

                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderColor: "#93b1c8", borderRightWidth: 1, borderStyle: "dashed", padding: 5 }}>

                                        <EMIDATE />

                                        <Text style={{ fontSize: 10, marginTop: 5 }}>EMI Date</Text>
                                        <Text style={{ fontSize: 12, color: '#252525', fontWeight: "800", }}>01/05/2025</Text>
                                    </View>

                                    {/* Second grid */}
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderColor: "#93b1c8", borderRightWidth: 1, borderStyle: "dashed", padding: 5 }}>
                                        <InterestPayable />

                                        <Text style={{ fontSize: 10, marginTop: 5 }}>Interest Payable</Text>
                                        <Text style={{ fontSize: 12, color: '#252525', fontWeight: "800", }}>1,72,962</Text>
                                    </View>

                                    {/* Third grid */}
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <TotalPayable />

                                        <Text style={{ fontSize: 10, marginTop: 5 }}>Total Payable</Text>
                                        <Text style={{ fontSize: 12, color: '#252525', fontWeight: "800", }}>36,72,962</Text>
                                    </View>

                                </View>

                            </View>

                            <View style={{ width: width - 50, alignSelf: 'center' }}>
                                <CardView
                                    cardElevation={2}
                                    cardMaxElevation={2}
                                    cornerRadius={12}
                                    style={styles.cardContainer}
                                >
                                    <TouchableOpacity
                                        style={styles.button}
                                    // onPress={() => this.props.navigation.navigate('')}
                                    >
                                        <Text style={styles.buttonText}>
                                            Submit
                                        </Text>
                                    </TouchableOpacity>
                                </CardView>


                            </View>
                            <View style={{marginTop:10}}>
                            <TouchableOpacity onPress={()=> navigation.goBack(this)}>
                                <Text style={{ fontSize: 14, color: '#252525', fontWeight: "800", textAlign: 'center',color:'#FF5936' }}>Back</Text>
                            </TouchableOpacity>
                            </View>
                        </ScrollView>

                    </View>
                </ImageBackground>
            </View>

        );
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(LoanHomeScreen);
const styles = StyleSheet.create({
    viewContainer: {
        borderRadius: 8,
        borderStyle: "dashed",
        borderColor: "#93b1c8",
        borderWidth: 1,
        flex: 1,
        width: width - 50,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 5,
        padding: 10,
        marginTop: 15,
    },
    balanceView: {
        height: 70,
        width: width - 50,
        borderRadius: 10,
        borderColor: 'black',
        backgroundColor: '#e8f1f8',
        alignItems: 'center',
        marginTop: 15,
        flexDirection: 'row',
    },
    balIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: 'white',
        marginLeft: 10,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceText: {
        color: '#686868',
        fontSize: 12,
        fontFamily: strings.fontMedium,
    },
    amountText: {
        color: colors.accTextColor,
        fontSize: 18,
        fontFamily: strings.fontMedium,
        flexWrap: 'wrap',
        fontWeight: 'bold',
        // marginTop: 5,
    },
    inputBox: {
        lineHeight: 40,
        height: 48,
        // width: width - 50,
        marginTop: 10,

    },
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
        flexDirection: 'column'
    },
    innerContainer: {
        marginTop: 20,
        alignItems: 'center',

        paddingBottom: 30,


    },
    recognizedContainer: {
        width: width - 60,
        borderRadius: 10,
        borderColor: "#E1E1E1",
        alignItems: "center",
        borderWidth: 1,
        justifyContent: "center",
    },
    recViewContainer: {
        borderRadius: 10,
        borderColor: "#E1E1E1",
        borderWidth: 1,
        marginTop: 10,
    },

    recognizedText: {
        fontSize: 18,
        fontFamily: "SF UI Display",
        fontWeight: "800",
        color: "#1F3C66",
        padding: 8,
        // textAlign: "center",
    },

    // container: {
    //     flexDirection: 'row',
    //     flex: 1,
    //     marginTop: 5
    // },
    sliderView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    slider: {
        width: '100%',
        marginHorizontal: 10,
    },
    valueText: {
        fontSize: 24,
        marginTop: 20,
    },
    switchContainer: {
        width: 90, // Change this according to your switch width
        height: 25, // Change this according to your switch height
        borderRadius: 20, // half of height to make it round
        justifyContent: 'center',
        paddingHorizontal: 4,
        backgroundColor: '#DFE1E8'
    },
    switchKnob: {
        width: 46, // Change this according to your switch knob width
        height: 20, // Change this according to your switch knob height
        borderRadius: 18, // half of width/height to make it round
        backgroundColor: '#FF5936',
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        position: 'absolute',
        color: '#FFFFFF',
        fontSize: 10,
    },
    cardContainer: {
        backgroundColor: "gray",
        justifyContent: "center",

    },
    button: {
        padding: 15,
        width: width - 50,
        backgroundColor: colors.btnColor,
        justifyContent: "center",
        borderRadius: 12,
    },
    buttonText: {
        alignSelf: "center",
        color: "white",
        fontFamily: strings.fontRegular,
        fontSize: 15,
    },
});