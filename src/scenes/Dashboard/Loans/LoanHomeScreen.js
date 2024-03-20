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
import Refresh from '../../../assets/icons/icon-refresh.svg';
import Slider from 'react-native-slider';
import { TextInput } from "react-native-paper";

class LoanHomeScreen extends Component {
    constructor(props) {
        super(props);



        this.state = {
            LoanType: this.props.route.params.LoanType,
            rangeValue: 0,
            maxlength: 1000000,
            rangeTenureValue: 0,
            maxTenurelength: 10,
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

        console.log(this.state.rangeTenureValue)
        console.log(this.state.value)
        let cal = 0;
        let maxlencal = 0

        if (this.state.value === true) {
            cal = this.state.rangeTenureValue / 12;
            maxlencal = this.state.maxTenurelength / 12
        } else {
            cal = this.state.rangeTenureValue * 12;
            maxlencal = this.state.maxTenurelength * 12
        }

        this.setState({ rangeTenureValue: cal, maxTenurelength: maxlencal })
    };

    onSelectDebitAccount = (value) => {
        this.setState({ isDebitAcc: false, accData: value })
    }

    onSelectAccountType = (value) => {
        this.setState({ isSelectAcc: false, accType: value })
    }

    onSelectScheme = (value) => {
        this.setState({ isSelectScheme: false, selectScheme: value })
    }

    onSelctPeriod = (value) => {
        this.setState({ isSelectedPeriod: false, selectPeriod: value })
    }

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
                                <View style={{ flex: 1, marginTop: 10 }}>

                                    <CardView
                                        cardElevation={6}
                                        cardMaxElevation={15}
                                        cornerRadius={15}
                                        style={styles.cardView}
                                    >

                                        <View style={{ flexDirection: 'row', }}>
                                            <View style={{ flex: 1, }}>
                                                <Text style={{
                                                    fontSize: 12,
                                                    fontWeight: "500",
                                                    fontFamily: "SF UI Display",
                                                    color: "#686868",

                                                }}>{'Loan Amount '}</Text>

                                            </View>

                                            <View style={{
                                                height: 20,
                                                width: 20,
                                                backgroundColor: '#FFEEEB',
                                                padding: 5,
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Refresh />
                                            </View>
                                        </View>



                                        <TextInput
                                            style={styles.inputBox}
                                            theme={{
                                                colors: {
                                                    placeholder: "#DFE1E8",
                                                    text: this.props.textColor,
                                                    primary: this.props.themeColor,
                                                    underlineColor: "transparent",
                                                    background: "white",
                                                },
                                                roundness: 8,
                                            }}
                                            // label="Transaction PIN"

                                            keyboardType="numeric"
                                            value={String(this.state.rangeValue)}
                                            onChangeText={this.handleTextInputChange}
                                            mode="outlined"
                                        />



                                        <View style={styles.sliderView}>
                                            <View style={styles.row}>

                                                <Slider
                                                    style={styles.slider}
                                                    minimumValue={0}  // Minimum value
                                                    maximumValue={this.state.maxlength}  // Maximum value
                                                    value={this.state.rangeValue < this.state.maxlength ? this.state.rangeValue : this.state.maxlength}

                                                    onValueChange={(newValue) => this.setState({ rangeValue: parseInt(newValue) })}
                                                    minimumTrackTintColor="#FF5936" // Change this color to your desired color
                                                    maximumTrackTintColor="#D9D9D9" // Change this color to your desired color
                                                    thumbTintColor="#FF5936"
                                                    thumbStyle={{ width: 15, height: 15 }}
                                                />

                                            </View>

                                        </View>

                                        <View style={{ flexDirection: 'row', }}>
                                            <View style={{ flex: 1, }}>
                                                <Text style={{
                                                    fontSize: 10,
                                                    fontWeight: "600",
                                                    fontFamily: "SF UI Display",
                                                    color: "#686868",

                                                }}>0</Text>

                                            </View>

                                            <View >
                                                <Text style={{
                                                    color: "#686868",
                                                    fontWeight: "600",
                                                    fontFamily: "SF UI Display",
                                                    fontSize: 10,
                                                }}>{this.state.maxlength}</Text>
                                            </View>
                                        </View>

                                        {/* <View style={styles.container}>

                                            <View style={{ justifyContent: 'center', marginRight: 35 }}>
                                                <Text style={{
                                                    fontSize: 10,
                                                    fontWeight: "200",
                                                    fontFamily: "SF UI Display",
                                                    color: "#686868",
                                                    //  textAlign: "right"
                                                }}>{'A/c No'}</Text>
                                                <Text style={{
                                                    fontSize: 14,
                                                    fontWeight: "700",
                                                    fontFamily: "SF UI Display",
                                                    color: "#252525",
                                                    //  textAlign: "right"
                                                }}>{'item.AC_NO'}</Text>
                                            </View>

                                            <View style={{}}>
                                                <Text style={{
                                                    fontSize: 10,
                                                    fontWeight: "200",
                                                    fontFamily: "SF UI Display",
                                                    color: "#686868",
                                                    //  textAlign: "right"
                                                }}>{'Scheme Name'}</Text>
                                                <Text style={{
                                                    fontSize: 14,
                                                    fontWeight: "700",
                                                    fontFamily: "SF UI Display",
                                                    color: "#252525",
                                                    //  textAlign: "right"
                                                }}>{'SCEMEHNAME'}</Text>

                                            </View>


                                        </View> */}

                                    </CardView>

                                    <CardView
                                        cardElevation={6}
                                        cardMaxElevation={15}
                                        cornerRadius={15}
                                        style={styles.cardView}
                                    >

                                        <View style={{ flexDirection: 'row', }}>
                                            <View style={{ flex: 1, }}>
                                                <Text style={{
                                                    fontSize: 12,
                                                    fontWeight: "500",
                                                    fontFamily: "SF UI Display",
                                                    color: "#686868",

                                                }}>{'Loan Tenure'}</Text>

                                            </View>
                                            <TouchableOpacity onPress={this.handleToggle} activeOpacity={0.8}>
                                                <Animated.View
                                                    style={styles.switchContainer}
                                                >
                                                    {/* Off Label */}
                                                    <Text style={{ color: '#1F3C66', fontSize: 10, padding: 8, width: 90, position: 'absolute', textAlign: this.state.value ? 'left' : 'right' }}>{this.state.value ? 'Year' : 'Month'}</Text>

                                                    {/* Knob */}
                                                    <Animated.View style={[styles.switchKnob, { transform: [{ translateX }] }]} >
                                                        <Text style={styles.label}>{this.state.value ? 'Month' : 'Year'}</Text>
                                                    </Animated.View>
                                                    {/* On Label */}
                                                    {/* <Text style={[styles.label, { right: 10, color: this.state.value ? '#000' : '#ccc' }]}>On</Text> */}
                                                </Animated.View>
                                            </TouchableOpacity>
                                        </View>



                                        <TextInput
                                            style={styles.inputBox}
                                            theme={{
                                                colors: {
                                                    placeholder: "#DFE1E8",
                                                    text: '#1F3C66',
                                                    primary: this.props.themeColor,
                                                    underlineColor: "transparent",
                                                    background: "white",
                                                },
                                                roundness: 8,
                                            }}
                                            // label="Transaction PIN"

                                            keyboardType="numeric"
                                            value={String(this.state.rangeTenureValue)}
                                            onChangeText={this.
                                                handleTenureTextInputChange}
                                            mode="outlined"
                                        />

                                        <View style={styles.sliderView}>
                                            <View style={styles.row}>

                                                <Slider
                                                    style={styles.slider}
                                                    minimumValue={0}  // Minimum value
                                                    maximumValue={100}  // Maximum value
                                                    value={this.state.rangeTenureValue < this.state.maxTenurelength ? this.state.rangeTenureValue : 100}

                                                    onValueChange={(newValue) => this.setState({ rangeTenureValue: parseInt(newValue) })}
                                                    minimumTrackTintColor="#FF5936" // Change this color to your desired color
                                                    maximumTrackTintColor="#D9D9D9" // Change this color to your desired color
                                                    thumbTintColor="#FF5936"
                                                    thumbStyle={{ width: 15, height: 15 }}
                                                />

                                            </View>

                                        </View>

                                        <View style={{ flexDirection: 'row', }}>
                                            <View style={{ flex: 1, }}>
                                                <Text style={{
                                                    fontSize: 10,
                                                    fontWeight: "600",
                                                    fontFamily: "SF UI Display",
                                                    color: "#686868",

                                                }}>0 {this.state.value ? 'Month' : 'Year'}</Text>

                                            </View>

                                            <View >
                                                <Text style={{
                                                    color: "#686868",
                                                    fontWeight: "600",
                                                    fontFamily: "SF UI Display",
                                                    fontSize: 10,
                                                }}>{this.state.maxTenurelength} {this.state.value ? 'Month' : 'Year'}</Text>
                                            </View>
                                        </View>


                                    </CardView>
                                </View>



                            </View>
                        </ScrollView>
                        <View style={{ width: width - 50, alignSelf: 'center' }}>
                            <CardView
                                cardElevation={2}
                                cardMaxElevation={2}
                                cornerRadius={12}
                                style={styles.cardContainer}
                            >
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => this.props.navigation.navigate('LoanDetailsScreen', { LoanType: this.state.LoanType })}
                                >
                                    <Text style={styles.buttonText}>
                                        Check Loan Details
                                    </Text>
                                </TouchableOpacity>
                            </CardView>
                        </View>
                    </View>
                </ImageBackground>
            </View>

        );
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(LoanHomeScreen);
const styles = StyleSheet.create({

    inputBox: {
        lineHeight: 40,
        height: 48,
        // width: width - 50,
        marginTop: 5,

    },
    cardView: {
        backgroundColor: 'white',
        width: width - 40,
        marginTop: 5,
        marginBottom: 8,
        padding: 15
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
        paddingTop: 5,
        alignItems: 'center',
        paddingTop: 10,
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
        marginHorizontal: 5,
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
        marginVertical: 20,
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