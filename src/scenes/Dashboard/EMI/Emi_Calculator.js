import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    ImageBackground,
    StyleSheet,
    BackHandler,
    TouchableOpacity,
    KeyboardAvoidingView,
    TextInput,
    Animated
} from 'react-native'
import {
    colors,
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    navigation,
    appThemeConfiguration,
    sendData,
    width,

} from '../../../App';
import { RFValue } from "react-native-responsive-fontsize";
import { RadioButton, } from 'react-native-paper';
import Slider from "react-native-slider";
import Snackbar from "react-native-snackbar";
import CardView from 'react-native-cardview'
import TrasnperantFixedHomeHeader from '../../../components/TrasnperantFixedHomeHeader';

import Rupees from '../../../assets/icons/ic_Rupees.svg'
import PercentRound from '../../../assets/icons/ic_PercentRound.svg'
import Tenure from '../../../assets/icons/ic_TenureTime.svg'

import CalenderIcon from '../../../assets/icons/calendar-icon.svg'
import InterestIcon from '../../../assets/icons/money-icon.svg'
import WalletIcon from '../../../assets/icons/payable-wallet-icon.svg'


import { PieChart } from 'react-native-svg-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import LinearGradient1 from 'react-native-linear-gradient';



class Emi_Calculator extends Component {
    constructor(props) {
        super(props);

        this.state =
        {
            EMI_DurType: 'Month',
            Flat_EMI: false,
            SummeryVisible: false,
            GraphicalVisible: false,

            LoanAmount: parseInt(0),
            RateOfInt: parseFloat(0.0),
            Tenure: parseInt(0),

            MonthlyEMI: parseInt(0),
            TotalInterest: parseInt(0),
            TotalAmount: parseInt(0),

            Editable: true,


            isVisible: false,
            translateY: new Animated.Value(500),



        }

        this.scrollViewRef = React.createRef();

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.GraphData = [

            { Name: 'Principle Amount', Value: this.state.LoanAmount },
            { Name: 'Interest Amount', Value: this.state.TotalInterest },
        ]

    }

    staticColorsArray = [
        '#F93307',
        '#FFA903',
        '#5775A0',
        '#1F3C66',
    ];

    componentDidMount() {

    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        navigation.goBack(this)
        return true;
    }

    onBackAction() {
        navigation.goBack(this)
    }

    scrollToBottom = () => {
        if (this.scrollViewRef.current) {
            this.scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };

    LoanAmountSlider = (value) => {

        this.setState({ LoanAmount: value.toFixed(0) });
    };

    RateIntSlider = (value) => {

        this.setState({ RateOfInt: value.toFixed(1) });
    };


    TenureSlider = (value) => {

        this.setState({ Tenure: value.toFixed(0) });
    };


    handleRadioButtonChange = (value) => {

        this.setState({ EMI_DurType: value, Tenure: 0, })


    };


    calculateEMI = () => {

        const { LoanAmount, RateOfInt, Tenure } = this.state;

        const loanAmountNumber = parseFloat(LoanAmount);
        const rateOfInterestNumber = parseFloat(RateOfInt);
        const tenureNumber = parseFloat(Tenure);

        console.log("loanAmountNumber "+loanAmountNumber)
        console.log("rateOfInterestNumber "+rateOfInterestNumber) 
        console.log("tenureNumber "+tenureNumber)

        if (loanAmountNumber === 0 || tenureNumber === 0) {
            Snackbar.show({ text: "Enter Valid Values", duration: Snackbar.LENGTH_SHORT, backgroundColor: "red", });
            return;
        }


        // if (isNaN(loanAmountNumber) || isNaN(rateOfInterestNumber) || isNaN(tenureNumber)) {
        //     // If any of the inputs are NaN, don't proceed with the calculation
        //     console.log("tenureNumber "+tenureNumber)
        //     Snackbar.show({ text: "Enter Valid Values", duration: Snackbar.LENGTH_SHORT, backgroundColor: "red", });
        //     return;
        // }

        var tenureInMonths = tenureNumber

        if (this.state.EMI_DurType === 'Year') {
            tenureInMonths = tenureNumber * 12;
        }

        const monthlyInterest = rateOfInterestNumber / (12 * 100);

        // if (isNaN(monthlyInterest) || monthlyInterest === 0) {
        //     return;
        // }

        const emi =
            loanAmountNumber *
            monthlyInterest *
            Math.pow(1 + monthlyInterest, tenureInMonths) /
            (Math.pow(1 + monthlyInterest, tenureInMonths) - 1);


        // const emiResult = loanAmountNumber * monthlyInterest * Math.pow(1 + monthlyInterest, tenureInMonths) / (Math.pow(1 + monthlyInterest, tenureInMonths) - 1);
        // const emi = Math.round(emiResult * 100) / 100;


        const totalInterest = emi * tenureInMonths - loanAmountNumber;

        const totalAmt = emi * tenureInMonths

        console.log("emi " + emi)
        console.log("totalInterest " + totalInterest)

        this.setState({
            MonthlyEMI: emi.toFixed(1),
            TotalInterest: totalInterest.toFixed(1),
            TotalAmount: totalAmt.toFixed(1),
            SummeryVisible: true,
            GraphicalVisible: false,
            Editable: false,
        });


        this.GraphData = [

            { Name: 'Principle Amount', Value: this.state.LoanAmount },
            { Name: 'Interest Amount', Value: totalInterest.toFixed(1) },
        ]

        this.scrollToBottom();
    };

    Reset = () => {
        this.setState({
            SummeryVisible: false,
            GraphicalVisible: false,
            LoanAmount: 0,
            RateOfInt: 0.0,
            Tenure: 0,
            MonthlyEMI: '0',
            TotalInterest: '0',
            TotalAmount: '0',
            Editable: true,
        })


    }

    BtnViewSummery = () => {
        this.setState({ GraphicalVisible: true , SummeryVisible : false });
    };
    
    BtnGraphicalView = () => {
        this.setState({ GraphicalVisible: false , SummeryVisible : true });
    };



    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg2


    render() {

        const gradients = this.GraphData.map((value, index) => {
            const startColor = this.staticColorsArray[index * 2]; 
            const endColor = this.staticColorsArray[index * 2 + 1]; 

            return (
                <Defs key={index}>
                    <LinearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor={startColor} />
                        <Stop offset="100%" stopColor={endColor} />
                    </LinearGradient>
                </Defs>

            );
        });


        const pieData = this.GraphData.map((value, index) => (
            {
                value: value.Value,
                svg: {

                    fill: `url(#gradient-${index})`, // Using the gradient for fill
                    onPress: () => console.log('press', value.Value),
                },
                key: `pie-${index}`,
            }));


        return (

            <View style={styles.flexOne}>

                <ImageBackground style={styles.flexOne}
                    source={this.bgImage}
                    resizeMode='stretch'>

                    <KeyboardAvoidingView
                        style={styles.mainView}
                        behavior={Platform.OS === 'ios' ? 'padding' : ''}
                        enabled={true}>

                        <View style={styles.HeaderBg}>
                            <TrasnperantFixedHomeHeader
                                backAction={() => this.onBackAction()}
                            />

                            <Text style={styles.HeaderText}>EMI Calculator</Text>

                            <Text style={styles.HeaderSubText}>Easy Loan EMI Calculator</Text>

                        </View>

                        <View style={styles.MainCurve}>

                            <View style={styles.ScrollViewView}>

                                <ScrollView
                                    ref={this.scrollViewRef}
                                    style={styles.flexOne}
                                    contentContainerStyle={styles.ScrollViewContailerStyle}
                                    showsVerticalScrollIndicator={false}
                                >

                                    <View >



                                        <View style={styles.OptionBg}>

                                            <TouchableOpacity style={this.state.Flat_EMI ? styles.IntTypUnSelect : styles.IntTypSelect}
                                                onPress={() => this.setState({ Flat_EMI: false })}
                                            >

                                                <Text style={[styles.TxtOptSel, { color: this.props.PrimaryColor }]}>Reducing Interest EMI Calculator</Text>

                                            </TouchableOpacity>

                                            <TouchableOpacity style={this.state.Flat_EMI ? styles.IntTypSelect : styles.IntTypUnSelect}
                                                onPress={() => this.setState({ Flat_EMI: true })}
                                            >

                                                <Text style={[styles.TxtOptSel, { color: this.props.PrimaryColor }]}>Flat EMI Calculator</Text>

                                            </TouchableOpacity>


                                        </View>

                                        <RadioButton.Group
                                            onValueChange={this.handleRadioButtonChange}
                                            value={this.state.EMI_DurType}>

                                            <View style={{ flexDirection: 'row', alignSelf: 'center', flex: 1, }}>
                                                <View style={styles.RadioBtnView}>
                                                    <RadioButton value="Month"
                                                        color={this.props.SecondaryColor}
                                                        borderColor={this.props.SecondaryColor}
                                                        uncheckedColor={this.props.SecondaryColor}
                                                        disabled={!this.state.Editable}
                                                    />
                                                    <Text>Monthly EMI</Text>
                                                </View>
                                                <View style={styles.RadioBtnView}>
                                                    <RadioButton value="Year"
                                                        color={this.props.SecondaryColor}
                                                        borderColor={this.props.SecondaryColor}
                                                        uncheckedColor={this.props.SecondaryColor}
                                                        disabled={!this.state.Editable}
                                                    />
                                                    <Text>Yearly EMI</Text>
                                                </View>

                                            </View>
                                        </RadioButton.Group>


                                        <View style={{ marginTop: 20 }}>


                                            <View style={styles.SneekBar_LayoutBg}>

                                                <View style={styles.DirectionRow}>

                                                    <Rupees height={15} width={15} color={this.props.SecondaryColor} />

                                                    <Text style={styles.SneekBarText}>Loan Amount</Text>


                                                </View>


                                                <View style={styles.Sneekbar_TextBg}>

                                                    <TextInput
                                                        style={[styles.TextInputStyleTwo, { color: this.props.PrimaryColor }]}
                                                        keyboardType='numeric'
                                                        label='Enter Amount'
                                                        placeholder='Enter Amount'
                                                        value={this.state.LoanAmount}
                                                        maxLength={9}
                                                        editable={this.state.Editable}
                                                        onChangeText={text => {

                                                            const amt = text.replace(/[^0-9]/g, '')

                                                            if (amt.length === 0) {
                                                                this.setState({ LoanAmount: 0 });
                                                            }
                                                            else if (amt.length === 1 && (amt === '0' || amt === '.')) {
                                                                this.setState({ LoanAmount: 0 });
                                                            }
                                                            else if (amt.length > 8) {
                                                                this.setState({ LoanAmount: '100000000' });
                                                            }
                                                            else {
                                                                this.setState({ LoanAmount: amt });
                                                            }


                                                        }}
                                                    />

                                                </View>





                                            </View>


                                            <Slider
                                                style={styles.SneekBarStyle}
                                                minimumValue={0}
                                                maximumValue={100000000}
                                                thumbTintColor={this.props.SecondaryColor}
                                                minimumTrackTintColor={this.props.SecondaryColor}
                                                maximumTrackTintColor='#D9D9D9'
                                                disabled={!this.state.Editable}
                                                value={parseInt(this.state.LoanAmount)}
                                                onValueChange={this.LoanAmountSlider}
                                                step={1}
                                            />

                                        </View>

                                        <View style={styles.Line} />





                                        <View style={{ marginTop: 20 }}>


                                            <View style={styles.SneekBar_LayoutBg}>

                                                <View style={styles.DirectionRow}>

                                                    <PercentRound height={15} width={15} color={this.props.SecondaryColor} />

                                                    <Text style={styles.SneekBarText}>Rate Of Interest</Text>


                                                </View>


                                                <View style={styles.Sneekbar_TextBg}>

                                                    <TextInput
                                                        style={[styles.TextInputStyleTwo, { color: this.props.PrimaryColor }]}
                                                        keyboardType='numeric'
                                                        label='Interest Rate'
                                                        placeholder='Interest Rate'
                                                        value={this.state.RateOfInt}
                                                        maxLength={4}
                                                        editable={this.state.Editable}
                                                        onChangeText={text => {

                                                            var value = text.replace(/[^0-9.]/g, '')

                                                            value = value.replace(/\.(?=.*\.)/g, '');

                                                            if (value.length === 0) {
                                                                this.setState({ RateOfInt: 0 });
                                                            }
                                                            else if (value.length === 1 && (value === '.')) {
                                                                this.setState({ RateOfInt: '0' });
                                                            }
                                                            else if (value > 99.9) {
                                                                this.setState({ RateOfInt: '100' });
                                                            }
                                                            else {
                                                                this.setState({ RateOfInt: value });
                                                            }


                                                        }}
                                                    />

                                                </View>



                                            </View>


                                            <Slider
                                                style={styles.SneekBarStyle}
                                                minimumValue={0}
                                                maximumValue={100}
                                                thumbTintColor={this.props.SecondaryColor}
                                                minimumTrackTintColor={this.props.SecondaryColor}
                                                maximumTrackTintColor='#D9D9D9'
                                                disabled={!this.state.Editable}
                                                onValueChange={this.RateIntSlider}
                                                value={parseInt(this.state.RateOfInt)}
                                                step={1}
                                            />

                                        </View>


                                        <View style={styles.Line} />






                                        <View style={{ marginTop: 20 }}>


                                            <View style={styles.SneekBar_LayoutBg}>

                                                <View style={styles.DirectionRow}>

                                                    <Tenure height={15} width={15} color={this.props.SecondaryColor} />

                                                    <Text style={styles.SneekBarText}>Tenure (In {this.state.EMI_DurType})</Text>


                                                </View>


                                                <View style={styles.Sneekbar_TextBg}>

                                                    <TextInput
                                                        style={[styles.TextInputStyleTwo, { color: this.props.PrimaryColor }]}
                                                        keyboardType='numeric'
                                                        label='Enter Tenure'
                                                        placeholder='Enter Tenure'
                                                        value={this.state.Tenure}
                                                        editable={this.state.Editable}
                                                        maxLength={this.state.EMI_DurType === 'Month' ? 4 : 3}
                                                        onChangeText={text => {

                                                            var value = text.replace(/[^0-9]/g, '')

                                                            if (value.length === 0) {
                                                                this.setState({ Tenure: 0 });
                                                            }
                                                            else if (value.length === 1 && (value === '.')) {
                                                                this.setState({ Tenure: '0' });
                                                            }
                                                            else if (this.state.EMI_DurType === 'Month' && value > 1200) {
                                                                this.setState({ Tenure: '1200' });
                                                            }
                                                            else if (this.state.EMI_DurType === 'Year' && value > 99) {
                                                                this.setState({ Tenure: '100' });
                                                            }
                                                            else {
                                                                this.setState({ Tenure: value });
                                                            }



                                                        }}
                                                    />

                                                </View>



                                            </View>


                                            <Slider
                                                style={styles.SneekBarStyle}
                                                minimumValue={0}
                                                maximumValue={this.state.EMI_DurType === 'Month' ? 1200 : 100}
                                                thumbTintColor={this.props.SecondaryColor}
                                                minimumTrackTintColor={this.props.SecondaryColor}
                                                maximumTrackTintColor='#D9D9D9'
                                                disabled={!this.state.Editable}
                                                onValueChange={this.TenureSlider}
                                                value={parseInt(this.state.Tenure)}
                                                step={1}
                                            />

                                        </View>

                                        <View style={styles.Line} />





                                        {/* Button Calculate EMI */}
                                        <View style={styles.ViewBg}>


                                            <CardView
                                                cardElevation={2}
                                                cardMaxElevation={5}
                                                cornerRadius={10}
                                                style={styles.BtnTextStyle}
                                            >

                                                <TouchableOpacity style={styles.BtnTouchableStyle}
                                                    onPress={() => this.calculateEMI()}
                                                >

                                                    <Text style={[styles.TxtOptSel, { color: this.props.PrimaryColor, fontFamily: strings.fontBold, }]}>Calculate EMI</Text>

                                                </TouchableOpacity>

                                            </CardView>


                                            <CardView
                                                cardElevation={2}
                                                cardMaxElevation={5}
                                                cornerRadius={10}
                                                style={styles.BtnTextStyle}
                                            >
                                                <TouchableOpacity style={styles.BtnTouchableStyle}
                                                    onPress={() => this.Reset()}
                                                >
                                                    <Text style={[styles.TxtOptSel, { color: this.props.PrimaryColor, fontFamily: strings.fontBold, }]}>Reset</Text>

                                                </TouchableOpacity>

                                            </CardView>



                                        </View>


                                        {this.state.SummeryVisible && (
                                            <View style={styles.CalculationMainView} >

                                                {/* MonthlyEmi */}
                                                <View style={styles.CalculationBgView}>


                                                    <View style={styles.DirectionRow}>

                                                        <CalenderIcon height={25} width={25} color={this.props.SecondaryColor} />

                                                        <Text style={[styles.CalculationText, { color: this.props.PrimaryColor }]}>Monthly EMI</Text>


                                                    </View>

                                                    <Text style={[styles.AmountText, { color: this.props.PrimaryColor }]}>{this.state.MonthlyEMI}</Text>


                                                </View>

                                                {/* Total Interest */}
                                                <View style={styles.CalculationBgView}>


                                                    <View style={styles.DirectionRow}>

                                                        <InterestIcon height={25} width={25} color={this.props.SecondaryColor} />

                                                        <Text style={[styles.CalculationText, { color: this.props.PrimaryColor }]}>Total Interest</Text>


                                                    </View>

                                                    <Text style={[styles.AmountText, { color: this.props.PrimaryColor }]}>{this.state.TotalInterest}</Text>


                                                </View>

                                                {/* Total Amt */}
                                                <View style={styles.CalculationBgView}>


                                                    <View style={styles.DirectionRow}>

                                                        <WalletIcon height={25} width={25} color={this.props.SecondaryColor} />

                                                        <Text style={[styles.CalculationText, { color: this.props.PrimaryColor }]}>Total Amount</Text>


                                                    </View>

                                                    <Text style={[styles.AmountText, { color: this.props.PrimaryColor }]}>{this.state.TotalAmount}</Text>


                                                </View>



                                                {/* buttons */}
                                                <TouchableOpacity
                                                    style={[, styles.ButtonStyle, { backgroundColor: this.props.PrimaryColor, }]}
                                                    onPress={() => this.BtnViewSummery()}
                                                >
                                                    <Text style={styles.submitBtnStyle}>View Graphical Data</Text>
                                                </TouchableOpacity>

                                            </View>

                                        )}

                                        {this.state.GraphicalVisible && (
                                            <View style={styles.CalculationMainView} >

                                                <View style={styles.flexDirectionRow}>


                                                    <View style={{
                                                        flexDirection: 'column',
                                                        flex: 1,
                                                        alignSelf: 'center',
                                                    }}>

                                                        {this.GraphData.map((item, index) => (

                                                            <View style={styles.GraphListStyle}>

                                                                <LinearGradient1
                                                                    colors={[this.staticColorsArray[index * 2], this.staticColorsArray[index * 2 + 1]]}
                                                                    style={styles.CircleShape}
                                                                    start={{ x: 1, y: 0.5 }}
                                                                    end={{ x: 0.5, y: 1.0 }}
                                                                />


                                                                <View style={{ flex: 1, marginLeft: 10 }}>

                                                                    <Text style={[styles.ScaleText, { color: index === 0 ? this.staticColorsArray[0] : this.staticColorsArray[3] }]}>{item.Name}</Text>

                                                                    <Text style={[styles.ScaleText2, { color: index === 0 ? this.staticColorsArray[0] : this.staticColorsArray[3] }]}>₹ {item.Value}</Text>

                                                                </View>

                                                            </View>

                                                        ))}






                                                    </View>



                                                    <View style={{ flex: 1.2 }}>


                                                        <PieChart
                                                            style={{ height: 200, width: 200, }}
                                                            outerRadius={'80%'}
                                                            innerRadius={'50%'}
                                                            labelRadius={8}
                                                            spacing={5}
                                                            data={pieData}>
                                                            {gradients}
                                                        </PieChart>

                                                    </View>


                                                </View>

                                                <TouchableOpacity
                                                    style={[, styles.ButtonStyle, { backgroundColor: PrimaryColor, }]}
                                                    onPress={() => this.BtnGraphicalView()}
                                                >

                                                    <Text style={styles.submitBtnStyle}>Graphical Representation</Text>

                                                </TouchableOpacity>

                                            </View>
                                        )}


                                    </View>


                                </ScrollView>


                            </View>

                        </View>




                    </KeyboardAvoidingView>





                </ImageBackground>




            </View>





        );
    }


}


export default connect(mapStateToProps, mapDispatchToProps)(Emi_Calculator);


const styles = StyleSheet.create({


    flexOne:
    {
        flex: 1,
    },
    mainView:
    {
        flex: 1
    },
    HeaderBg:
    {
        flex: 0.25,
        justifyContent: 'flex-start',
    },

    HeaderText:
    {
        marginLeft: 25,
        color: 'white',
        fontSize: 24,
        fontFamily: strings.fontBold,
        marginTop: 20,

    },

    HeaderSubText:
    {
        marginLeft: 25,
        color: 'white',
        fontSize: 15,
        fontFamily: strings.fontRegular
    },

    MainCurve:
    {
        flex: 0.75,
        alignItems: 'center',
        backgroundColor: '#fbfcfc',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column',

    },

    ScrollViewView:
    {
        flex: 1,
        marginTop: 20,
    },

    OptionBg:
    {
        backgroundColor: '#E3EEFF',
        width: width - 40,
        flex: 1,
        borderRadius: 10,
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginBottom: 5,
        alignSelf: 'center'
    },

    IntTypSelect:
    {
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        elevation: 1,
        marginHorizontal: 5,
    },

    IntTypUnSelect:
    {
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },

    BtnTextStyle:
    {
        backgroundColor: 'white',
        width: width / 2 - 30,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        height: 'auto',
        marginHorizontal: 10
    },

    BtnTouchableStyle:
    {
        flex: 1,
        paddingVertical: 10
    },

    ViewBg:
    {
        flexDirection: 'row',
        marginVertical: 25
    },

    TxtOptSel:
    {
        fontSize: RFValue(13),
        fontFamily: strings.fontMedium,
        textAlign: 'center',
        flex: 1,
        marginVertical: 8,
        justifyContent: 'center',
    },
    RadioButtonView:
    {
        flexDirection: 'row',
        alignSelf: 'center',
        flex: 1
    },


    RadioBtnView:
    {
        flexDirection: 'row',
        alignItems: 'center'
    },

    DirectionRow:
    {
        flexDirection: 'row',
        alignItems: 'center',
    },

    SneekBarText:
    {
        fontSize: RFValue(13),
        fontFamily: strings.fontBold,
        marginLeft: 5,
    },
    SneekBar_LayoutBg:
    {
        flexDirection: 'row',
        marginHorizontal: '5%',
        justifyContent: 'space-between'
    },

    SneekBarStyle:
    {
        height: 40,
        marginHorizontal: '5%',
    },

    Sneekbar_TextBg:
    {
        backgroundColor: '#E3EEFF',
        borderRadius: 15,
        alignItems: 'center',
        paddingHorizontal: 10,
        width: '40%',
    },
    flexDirectionRow:
    {
        flexDirection: 'row'
    },

    TextInputStyleTwo:
    {
        fontSize: RFValue(13),
        fontFamily: strings.fontMedium,
        flex: 1,
        textAlign: 'right'

    },

    Line:
    {
        marginHorizontal: '5%',
        backgroundColor: '#D9D9D9',
        height: 0.5,
        marginTop: 10,
    },

    CalculationBgView:
    {
        flexDirection: 'row',
        borderRadius: 10,
        borderWidth: 0.7,
        marginHorizontal: '3%',
        padding: 15,
        borderColor: '#DFE1E8',
        marginTop: 20,

    },

    CalculationMainView:
    {
        marginBottom: 25,
    },

    CalculationText:
    {
        fontSize: RFValue(13),
        fontFamily: strings.fontMedium,
        marginLeft: 10,
    },

    AmountText:
    {
        fontSize: RFValue(13),
        fontFamily: strings.fontMedium,
        alignSelf: 'center',
        flex: 1,
        textAlign: 'right',
        marginRight: 20,

    },

    ButtonStyle:
    {
        marginTop: 20,
        height: 52,
        width: width - 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        alignSelf: 'center'
    },

    submitBtnStyle:
    {
        color: colors.white,
        fontFamily: strings.fontBold,
    },

    CircleShape: {

        width: 20,
        height: 20,
        borderRadius: 150 / 2,
    },
    ScaleText:
    {
        fontSize: RFValue(12),
        fontFamily: strings.fontMedium,
        flexWrap: 'wrap',
    },
    ScaleText2:
    {
        fontSize: RFValue(13),
        fontFamily: strings.fontBold,
        flexWrap: 'wrap'
    },


    GraphListStyle:
    {
        flexDirection: 'row',
        marginTop: 5,
        marginLeft: 10,
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
    }
})