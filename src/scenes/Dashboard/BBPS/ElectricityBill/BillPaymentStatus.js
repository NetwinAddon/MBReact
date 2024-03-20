
//  RGP

import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    FlatList,
    StyleSheet,
    PermissionsAndroid,
    Alert,
    BackHandler,
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
    RenderOkDialog,
} from '../../../../App';

import Arrowdown from '../../../../assets/icons/dashboardIcons/arrow_down.svg';
import { TextInput } from 'react-native-paper';
import Balance from '../../../../assets/icons/Balance.svg'
import MSEDCL from '../../../../assets/icons/MSEDCL.svg'
import CheckBox from '@react-native-community/checkbox';

//import { TouchableOpacity } from 'react-native-gesture-handler';
import TrasnsperantFixedHeader from '../../../../components/TrasnperantFixedHeader';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';
import Airtel from '../../../../assets/icons/Airtel.svg';
import Arrow from '../../../../assets/icons/Vectorarrow.svg';
import DownArrow from '../../../../assets/icons/down-arrow.svg'
import { selectAccount } from '../../../../components/CustomPopups';
import { SimOperatorPop } from '../../../../components/SimOperatorPop';
import { ConfirmAmountPopup } from '../../../../components/ConfirmAmountPopup.js';
import { CustomPopupsRecharge } from '../../../../components/CustomPopupsRecharge.js';
import BBPS from '../../../../assets/icons/BBPS_Logo.svg'
const bankData = [
    {
        ifsc: 'SBI0001234',
        name: 'State Bank of India',
        address: 'Pawan Nagar, Nashik',
    },
    {
        ifsc: 'BOB1234',
        name: 'Bank of baroda',
        address: 'Pawan Nagar, Nashik',
    },
    // Add more bank data entries as needed
];




class BillPaymentStatus extends Component {

    constructor(props) {
        super(props);


        //var name = this.props.route.RGP;



        this.RechargePlans = [
            {
                RechargeAmount: '151',
                Date: '5th Nov 2023',
                Time: '07:11 PM',
                validity: '3 day',
            },
            {
                RechargeAmount: '299',
                Date: '30th Dec 2023',
                Time: '08:19 AM',
                validity: '7 day',
            },
            {
                RechargeAmount: '666',
                Date: '15th Oct 2023',
                Time: '02:11 PM',
                validity: '27 day',
            },

            // Add more user data as needed
        ];
        this.OperatorsList = [
            {
                "name": "Airtel Prepaid",
            },
            {
                "name": "Jio Prepaid",

            },
            {
                "name": "Vi Prepaid",

            },
            {
                "name": "BSNL Prepaid",

            },
            {
                "name": "MTLN Prepaid",

            }
        ];

        this.accData = [
            { label: '011445252360', value: '1' },
            { label: '012585252360', value: '2' },
            { label: '011445258460', value: '3' },

        ];
        this.data = {
            ConsumerNo: "9875858563",
            ConsumerName: "Ashok Sahebrao Patil",
            BillDate: "01/05/2023",
            BillPeriod: "NA",
            BillNumber: "NA",
            BillDueDate: "24/05/2023",
            PayeeNumber: "9866663333"
        }
        this.PaymentsStatus = {
            PaymentMode: "Online",
            TransactionId: "8487884512",
            TransactionStatus: "Pending",
            TransactionDateTime: "13th May 2023, 11.53AM",
            PaymentChannel: "Agent Channel",
           
        }


        this.state = {
            isModalVisible: false,
            isModalVisible1: false,
            isStateModalVisible: false,
            selectedValue: 'option1',
            operaterName: this.OperatorsList.length > 0 ? 'Select Operator' : '',
            labelText: '',
            amount: '',
            accType: this.accData.length > 0 ? this.accData[0].label : '',
            remark: '',
            searchTerm: '',
            searchTermAct: 0,
            searchPerformed: false,
            constactsNumbers: [],
            confirmDialog: false,

        };

    }


    // handleValidation = () => {
    //     console.log('handleValidation called')
    //     const { depositAmount, confirmDepositAmount } = this.state;

    //     if (!depositAmount || !confirmDepositAmount) {
    //         this.setState({ error: 'Please enter both amounts' });
    //     } else if (depositAmount !== confirmDepositAmount) {
    //         this.setState({ error: 'Amounts do not match' });
    //     } else {

    //         this.setState({ error: '' });
    //         this.setState({ confirmDialog: true })

    //     }
    // };





    renderPlansItem = ({ item }) => (

        // <TouchableOpacity
        //     onPress={() => this.props.navigation.navigate('rechargePay', {
        //         // RechargeAmount: item.rechargeAmount,
        //         // UserName: this.props.route.params.name,
        //         // MobileNumber: this.props.route.params.mobno
        //     })}
        // >
        <CardView
            cardElevation={3}
            cardMaxElevation={5}
            cornerRadius={15}
            style={{
                height: 70,

                backgroundColor: 'white',
                width: width - 50,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 8,
                marginBottom: 8,
            }}
        >


            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('rechargePay', {
                    RechargeAmount: item.RechargeAmount,
                    UserName: this.props.route.params.name,
                    MobileNumber: this.props.route.params.mobno
                })}
            >
                <View style={styles.container}>

                    <View style={{ justifyContent: 'center', marginRight: 35 }}>
                        <Text style={{
                            fontSize: 22,
                            fontWeight: "700",
                            fontFamily: "SF UI Display",
                            color: "#1f3c66",
                            textAlign: "right"
                        }}>{strings.rupee}{item.RechargeAmount}</Text>

                    </View>

                    <View style={[styles.textContainer, { paddingTop: 10 }]}>
                        <Text style={{
                            fontSize: 14,
                            color: '#252525'
                        }}>Date: {item.Date}

                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: '#252525',
                            fontWeight: "500",
                            fontFamily: "SF UI Display",
                            textAlign: "left",
                            opacity: 0.8
                        }}>Time: {item.Time}</Text>
                        <Text style={{
                            fontSize: 12,
                            //lineHeight: 11,
                            color: "#ff5936"
                        }}>Expire in {item.validity} Days</Text>
                    </View>

                    <View >
                        <Arrow style={{
                            flex: 1,
                            width: "100%",
                            height: 10,
                            marginRight: 10
                        }}></Arrow>

                    </View>
                </View>
            </TouchableOpacity>
        </CardView>

        // </TouchableOpacity>

    );


    componentDidMount() {




    }
    bgImage = appThemeConfiguration(config.themeColor).bgImg


    hideDialog = () => {
        this.setState({ confirmDialog: false })
    }


    onBackAction() {
        navigation.goBack(this)
    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        navigation.goBack(this)
        return true;
    };


    toOwnAccTransfer() {
        navigation.navigate(this, 'ownAccTransferScreen')
        console.log('hellooooo')
    }

    toReview() {
        navigation.navigate(this, 'quickPayWithinBankOtherAccount')
    }


    onSelectOperator = (value) => {
        console.log('valueeeeeeeeee' + value)
        { value !== '' || value !== 'undefined' ? console.log('true') : console.log('false') }
        this.setState({ isModalVisible: false, operaterName: value })
        console.log("state.isModalVisible", this.state.isModalVisible, value);
        // renderWelcomeMsg()


    }

    onSelectState = (value) => {
        console.log('valueeeeeeeeee' + value)
        { value !== '' || value !== 'undefined' ? console.log('true') : console.log('false') }
        this.setState({ isModalVisible: false, operaterName: value })
        console.log("state.isModalVisible", this.state.isModalVisible, value);
        // renderWelcomeMsg()


    }


    onSelectAccount = (value) => {

        this.setState({ isModalVisible1: false, accType: value })

        console.log("state.isModalVisible1", this.state.isModalVisible1, value);
        // renderWelcomeMsg()

    }



    render() {

        return (
            <View style={{ flex: 1, }}>

                <ImageBackground style={{ flex: 1 }}
                    source={this.bgImage}
                    resizeMode='cover'
                >
                    <TrasnsperantFixedHeader
                        backAction={() => this.onBackAction()}
                    />

                    <View style={{ flex: 0.15 }}>
                        <View style={{
                            marginLeft: 25,
                            marginTop: 15,
                        }}>
                            <Text style={{
                                fontSize: 22,
                                color: 'black',
                                textAlign: 'left',
                                fontFamily: strings.fontBold,
                                color: colors.white,
                            }}>Electricity Bill Pay
                            </Text>
                            <Text style={{
                                fontSize: 15,
                                color: 'black',
                                textAlign: 'left',
                                fontFamily: strings.fontMedium,
                                color: colors.white,
                            }}>Select Your Electricity Provider
                            </Text>

                        </View>
                    </View>


                    <View style={{ flex: 0.85, alignItems: 'center', backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>

                        {/*  Search Bar */}

                        <View style={{
                            flexDirection: 'row',
                            padding: 10,
                            alignItems: 'center',
                            marginBottom: 10,
                            width: width - 50,
                            marginTop: 20,
                        }}>


                            <View style={styles.textContainer}>
                                <Text style={styles.username}>{'Bill Payment'}</Text>

                            </View>



                            <View>
                                <BBPS style={{ marginTop: 5 }} />
                            </View>

                        </View>

                        {this.state.confirmDialog === true ?
                            <ConfirmAmountPopup isVisible={this.state.confirmDialog} isDisabled={this.hideDialog} MobileNumber={this.props.route.params.mobno} BillAmt={parseFloat(this.state.confirmDepositAmount)} charges={1.5} from={'DTH'} />
                            : null}
                        <ScrollView
                            style={{ width: '100%', flex: 1 }}
                            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                        >


                            <View style={{
                                width: width - 50,
                                alignItems: 'center'
                            }}>

                                <View style={styles.InputBoxDesign}
                                >
                                    <TouchableOpacity style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                        onPress={() => this.setState({ isModalVisible1: true, labelText: 'Select Account' })}
                                    >

                                        <View style={{ flex: 1, }}>
                                            <Text style={{
                                                color: colors.accTextColor + '80',
                                                marginLeft: 15,
                                                fontSize: 10,
                                                fontFamily: strings.fontMedium
                                            }}>
                                                Select Account
                                            </Text>

                                            <Text style={{
                                                color: colors.accTextColor,
                                                marginLeft: 15,
                                                fontSize: 15,
                                                fontFamily: strings.fontMedium
                                            }}>
                                                {this.state.accType}
                                            </Text>
                                        </View>

                                        <View style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginHorizontal: 10
                                        }} >
                                            <Arrowdown height={15} width={15} />
                                        </View>


                                    </TouchableOpacity>
                                    {CustomPopupsRecharge(
                                        this.state.isModalVisible1,
                                        this.accData,
                                        this.onSelectAccount,
                                        this.state.labelText,
                                        this.state.accType
                                    )}
                                </View>



                                <View
                                    style={{
                                        borderRadius: 12,
                                        backgroundColor: "#fff",
                                        shadowColor: "rgba(31, 60, 102, 1)",
                                        shadowOffset: {
                                            width: 0, // Adjust the horizontal offset if needed
                                            height: 5, // Adjust the vertical offset to control the shadow on the top side
                                        },
                                        shadowRadius: 20,
                                        elevation: 10,
                                        shadowOpacity: 0.5, // Adjust the opacity based on your preference
                                        flex: 1,
                                        width: width - 30,
                                        height: 215,
                                        marginTop: 20,
                                    }}
                                >
                                    <View style={{
                                        flexDirection: 'row',
                                        padding: 10,
                                        // borderBottomWidth: 1,
                                        // borderBottomColor: '#ddd',

                                        width: width - 50,
                                    }}>

                                        <View style={styles.iconContainer}>
                                            <View style={styles.simIcon}>

                                                <MSEDCL width={38} height={38} style={{ alignSelf: 'center', marginTop: 5 }} />

                                            </View>
                                        </View>

                                        <View style={[styles.textContainer, { paddingTop: 5 }]}>
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: "500",
                                                fontFamily: "SF UI Display",
                                                color: "#000",
                                                textAlign: "left"
                                            }} >{this.props.route.params.ProviderName}
                                                {/* this.props.route.params.ProviderName */}
                                            </Text>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: "500",
                                                fontFamily: "SF UI Display",
                                                color: "#929cac",
                                                textAlign: "left",
                                                width: 130
                                            }}>ID: {this.props.route.params.ID} </Text>

                                        </View>



                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                                        <View style={{ flex: 1.2 }}>
                                            <Text style={styles.consumerNo}>Consumer No</Text>
                                            <Text style={styles.consumerNo}>Consumer Name</Text>
                                            <Text style={styles.consumerNo}>Bill Date</Text>
                                            <Text style={styles.consumerNo}>Bill Period</Text>
                                            <Text style={styles.consumerNo}>Bill Number</Text>
                                            <Text style={styles.consumerNo}>Bill Due Date</Text>
                                            <Text style={styles.consumerNo}>Payee Number</Text>
                                        </View>
                                        <View style={{ flex: 0.8, alignItems: 'center' }}>
                                            <Text style={styles.consumerNo}>:</Text>
                                            <Text style={styles.consumerNo}>:</Text>
                                            <Text style={styles.consumerNo}>:</Text>
                                            <Text style={styles.consumerNo}>:</Text>
                                            <Text style={styles.consumerNo}>:</Text>
                                            <Text style={styles.consumerNo}>:</Text>
                                            <Text style={styles.consumerNo}>:</Text>
                                        </View>
                                        <View style={{ flex: 2 }}>
                                            <Text style={styles.consumerNo}>{this.data.ConsumerNo}</Text>
                                            <Text style={styles.consumerNo}>{this.data.ConsumerName}</Text>
                                            <Text style={styles.consumerNo}>{this.data.BillDate}</Text>
                                            <Text style={styles.consumerNo}>{this.data.BillPeriod}</Text>
                                            <Text style={styles.consumerNo}>{this.data.BillNumber}</Text>
                                            <Text style={styles.consumerNo}>{this.data.BillDueDate}</Text>
                                            <Text style={styles.consumerNo}>{this.data.PayeeNumber}</Text>
                                        </View>
                                    </View>


                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', width: width - 60, marginTop: 25 }}>
                                    <View style={{ flex: 1, padding: 8 }}>
                                        <Text style={{
                                            fontSize: 10,
                                            lineHeight: 11,
                                            fontWeight: "500",
                                            fontFamily: "SF UI Display",
                                            color: "rgba(0, 0, 0, 0.75)",
                                            textAlign: "left"
                                        }}>Total Bill Amount</Text>
                                        <Text style={{
                                            fontSize: 26,
                                            letterSpacing: 0,
                                            lineHeight: 30,
                                            fontWeight: "700",
                                            fontFamily: "SF UI Display",
                                            color: "#1f3c66",
                                            marginTop: 5
                                        }}>₹ 196.00</Text>
                                    </View>
                                    <View style={{ flex: 1.3, backgroundColor: 'rgba(246, 246, 246, 1)', height: 50, borderRadius: 10, padding: 13 }}>


                                        <Text style={{
                                            fontSize: 12,
                                            lineHeight: 11,
                                            fontWeight: "500",
                                            fontFamily: "SF UI Display",
                                            color: "rgba(0, 0, 0, 0.75)",
                                            marginLeft:10,
                                            marginBottom:5
                                        }}>Bill Amount      :  {strings.rupee + '102'}</Text>
                                        <Text style={{
                                            fontSize: 12,
                                            lineHeight: 11,
                                            fontWeight: "500",
                                            fontFamily: "SF UI Display",
                                            color: "rgba(0, 0, 0, 0.75)",
                                            marginLeft:10,

                                          
                                        }}>CCF Amount    :  {strings.rupee + '199'}</Text>



                                    </View>

                                </View>
                                <View style={{
                                    borderRadius: 8,
                                    backgroundColor: "#f3f8ff",
                                    borderStyle: "dashed",
                                    borderColor: "#93b1c8",
                                    borderWidth: 1,
                                    flex: 1,
                                    width: "100%",
                                    height: 110, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20,
                                    padding:10
                                }}>
                                    <View style={{ flex: 1.8 }}>
                                        <Text style={styles.paymentMode}>Payment Mode</Text>
                                        <Text style={styles.paymentMode}>Transaction Id</Text>
                                        <Text style={styles.paymentMode}>Transaction Status</Text>
                                        <Text style={styles.paymentMode}>Trans Date & Time</Text>
                                        <Text style={styles.paymentMode}>Payment Channel</Text>

                                    </View>
                                    <View style={{ flex: 0.8, alignItems: 'center' }}>
                                        <Text style={styles.paymentMode}>:</Text>
                                        <Text style={styles.paymentMode}>:</Text>
                                        <Text style={styles.paymentMode}>:</Text>
                                        <Text style={styles.paymentMode}>:</Text>
                                        <Text style={styles.paymentMode}>:</Text>


                                    </View>
                                    <View style={{ flex: 2.5 }}>
                                        <Text style={styles.paymentMode}>{this.PaymentsStatus.PaymentMode}</Text>
                                        <Text style={styles.paymentMode}>{this.PaymentsStatus.TransactionId}</Text>
                                        <Text style={styles.paymentMode}>{this.PaymentsStatus.TransactionStatus}</Text>
                                        <Text style={styles.paymentMode}>{this.PaymentsStatus.TransactionDateTime}</Text>
                                        <Text style={styles.paymentMode}>{this.PaymentsStatus.PaymentChannel}</Text>

                                    </View>
                                </View>

                                {/* Button */}
                                <CardView
                                    cardElevation={2}
                                    cardMaxElevation={2}
                                    cornerRadius={12}
                                    style={{
                                        backgroundColor: 'gray',
                                        justifyContent: 'center',
                                        marginVertical: 20,
                                    }}>
                                    <TouchableOpacity
                                        style={{
                                            padding: 15,
                                            width: width - 50,
                                            backgroundColor: colors.btnColor,
                                            justifyContent: 'center',
                                            borderRadius: 12,
                                        }}
                                    onPress={() => this.props.navigation.navigate('electricityBillPaySuccess')}

                                    ><Text style={{
                                        alignSelf: 'center',
                                        color: 'white',
                                        fontFamily: strings.fontRegular,
                                        fontSize: 15
                                    }}>
                                            Confirm
                                        </Text>
                                    </TouchableOpacity>
                                </CardView>
                                {/* <TouchableOpacity>
                                    <Text style={{
                                        fontSize: 15,
                                        fontWeight: "500",
                                        fontFamily: "SF UI Display",
                                        color: "#ff5936",
                                        textAlign: "center",
                                        // textDecorationLine: "underline", 
                                        // paddingBottom: 2,
                                    }}>Back</Text></TouchableOpacity> */}
                            </View>

                        </ScrollView>

                    </View>

                </ImageBackground>

            </View>


        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BillPaymentStatus);


const styles = StyleSheet.create({

    InputBoxDesign: {

        height: 48,
        width: width - 50,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DFE1E8',

    },
    container: {
        flexDirection: 'row',
        padding: 10,

        alignItems: 'center',
        width: width - 50,
    },

    iconContainer: {
        flex: 1,
    },
    simIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 0.5,
        elevation: 2,
        marginLeft: 6
    },
    textContainer: {
        flex: 3.5,

    },
    username: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000'
    },
    consumerNo: {
        fontSize: 13,

        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "rgba(0, 0, 0, 0.5)",
        textAlign: "left"
    },
    paymentMode: {
        fontSize: 12.6,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left"
        }

});
