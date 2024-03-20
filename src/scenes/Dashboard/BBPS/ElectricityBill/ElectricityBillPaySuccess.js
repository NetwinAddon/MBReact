
//  RGP

import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    SafeAreaView,
    Animated,
    Image,
    Button,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Footer from '../../../../assets/icons/footer.svg';


import {
    colors,
    strings,
    assets,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    okDialog,
    RenderOkDialog,
    width,
    navigation,
} from '../../../../App';
import CardView from 'react-native-cardview';
import FixedHeader from '../../../../components/FixedHeader';
import BBPS from '../../../../assets/icons/BBPS_Logo.svg'

class DTHRechargeSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            PaymentMode: this.props.route.params.PaymentMode,
            TXNREFID: this.props.route.params.TXNREFID,
            DateTime: '',
            BillAMT: this.props.route.params.BillAMT,
            ActualAMT: this.props.route.params.ActualAMT,
            CCFAMT: this.props.route.params.CCFAMT,
        };
        this.screenWidth = Dimensions.get("window").width;


    }
    componentDidMount() {
        console.log('props', this.props)

        this.formatDateTime();
    }

    formatDateTime = () => {

        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Month starts from 0
        const year = currentDate.getFullYear();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();

        const currDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        this.setState({ DateTime: currDateTime })
    };
    toLoginPage() {
        navigation.navigate(this, 'mainLogin')
    }


    render() {
        return (
            <View style={styles.container}>
                <FixedHeader />
                <View style={styles.bbpsIconView}>
                    <View style={styles.innerIconView}>
                        <BBPS />
                    </View>
                </View>
                <View style={styles.mainView}>

                    <View style={styles.successContainer}>

                        <Image
                            source={assets.success}
                            style={styles.image}
                        />
                        <Text style={[styles.text, { color: this.props.textColor }]}>
                            Bill Pay Successful!
                        </Text>
                        <Text style={[styles.description, { color: this.props.textColor }]}>
                            Electricity Bill Payment Done
                        </Text>
                    </View>
                    <View style={styles.amountContainer}>
                        <View style={styles.leftContainer}>
                            <Text style={styles.label}>Total Bill Amount</Text>
                            <Text style={styles.amount}>₹ {this.state.BillAMT}</Text>
                        </View>
                        <View style={styles.rightContainer}>
                            <View >
                                <Text style={styles.detail}>Bill Amount      :  {strings.rupee + this.state.ActualAMT}</Text>
                                <Text style={styles.detail}>CCF Amount    :  {strings.rupee + this.state.CCFAMT}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.paymentStatusView}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.consumerNo}>Payment Mode :</Text>
                            <Text style={styles.consumerNo}>Transaction Id :</Text>
                            <Text style={styles.consumerNo}>Transaction Status :</Text>
                            <Text style={styles.consumerNo}>Trn Date & Time :</Text>
                            <Text style={styles.consumerNo}>Payment Channel :</Text>

                        </View>
                        <View style={styles.innerContainer}>
                            <Text style={styles.consumerNo}>{this.state.PaymentMode}</Text>
                            <Text style={styles.consumerNo}>{this.state.TXNREFID}</Text>
                            <Text style={styles.consumerNo}>{'Successful'}</Text>
                            <Text style={styles.consumerNo}>{this.state.DateTime}</Text>
                            <Text style={styles.consumerNo}>{'Agent Channel'}</Text>
                        </View>
                    </View>
                    <View style={styles.buttonView}>
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={12}
                            style={styles.cardContainer} >
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this.props.navigation.navigate('electricityBillScreen')}>
                                <Text style={styles.buttonText}>
                                    Back to Menu
                                </Text>
                            </TouchableOpacity>
                        </CardView>
                        <View>
                            <Footer height={70} width={300} />
                        </View>
                    </View>
                </View>
            </View>

        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DTHRechargeSuccess);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    bbpsIconView: {
        flexDirection: 'row',
        marginTop: -30,
        width: width - 20,
    },

    innerIconView: {
        flex: 1,
        alignItems: 'flex-end',
    },
    mainView: {
        flex: 1,
        alignItems: 'center',
        marginTop: 40
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
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: 106,
        width: 106,
        marginVertical: 20,
    },
    text: {
        fontFamily: strings.fontMedium,
        fontSize: 26,
        marginTop: 20,
        textAlign: 'center',
        width: width - 60,
    },
    description: {
        fontFamily: strings.fontMedium,
        fontSize: 14,
        width: width - 45,
        textAlign: 'center',
        marginTop: 15,
    },
    amountContainer: {
        flexDirection: 'row',
        width: width - 60,
        marginTop: 50,
    },
    leftContainer: {
        flex: 1,
        padding: 8,
    },
    rightContainer: {
        flex: 1.3,
        backgroundColor: 'rgba(246, 246, 246, 1)',
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    label: {
        fontSize: 10,
        lineHeight: 11,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
    },
    amount: {
        fontSize: 26,
        letterSpacing: 0,
        lineHeight: 30,
        fontWeight: "700",
        fontFamily: "SF UI Display",
        color: "#1f3c66",
        marginTop: 5,
    },
    detail: {
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "rgba(0, 0, 0, 0.75)",
        marginLeft: 10,
    },
    paymentStatusView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: "#f3f8ff",
        borderStyle: "dashed",
        borderColor: "#93b1c8",
        borderWidth: 1,
        width: width - 40,
        padding: 10,
        marginTop: 20,
    },
    innerContainer: {
        flex: 1,
    },
    buttonView: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    cardContainer: {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 10
    },
    button: {
        padding: 15,
        width: width - 45,
        backgroundColor: colors.btnColor,
        justifyContent: 'center',
        borderRadius: 12,
    },
    buttonText: {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15,
    },

});