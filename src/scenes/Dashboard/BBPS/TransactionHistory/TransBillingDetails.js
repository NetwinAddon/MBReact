
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
    util,
} from '../../../../App';


import { TextInput } from 'react-native-paper';

import BBPS from '../../../../assets/icons/BBPS_Logo.svg'

//import { TouchableOpacity } from 'react-native-gesture-handler';
import TrasnsperantFixedHeader from '../../../../components/TrasnperantFixedHeader';

import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';

import MSEDCL from '../../../../assets/icons/MSEDCL.svg'
import Arrow from '../../../../assets/icons/Vectorarrow.svg';


import DownArrow from '../../../../assets/icons/down-arrow.svg'

import { SimOperatorPop } from '../../../../components/SimOperatorPop';
import { CustomPopupsRecharge } from '../../../../components/CustomPopupsRecharge';
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




class TransHistoryList extends Component {


    constructor(props) {
        super(props);


        //var name = this.props.route.RGP;



        this.RechargePlans = [
            {
                Title: 'Item 1',
                Desc: 'Information 1',
                status: 'send',
            },
            {
                Title: 'Item 2',
                Desc: 'Information 2',
                status: 'Pending...',
            },
            {
                Title: 'Item 3',
                Desc: 'Information 3',
                status: 'Pending...',
            },

            // Add more user data as needed
        ];

        this.state = {
            isModalVisible: false,
            isStateModalVisible: false,
            selectedValue: 'option1',
            // operaterName: this.OperatorsList.length > 0 ? 'Select Operator' : '',
            // StateName: this.circlesName.length > 0 ? 'Select Circle' : '',
            labelText: '',
            amount: '',
            remark: '',
            searchTerm: '',
            searchTermAct: 0,
            matchedBank: null,
            searchPerformed: false,
            constactsNumbers: []
        };

    }










    componentDidMount() {

    }
    bgImage = appThemeConfiguration(config.themeColor).bgImg





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
        this.setState({ isStateModalVisible: false, StateName: value })
        console.log("state.isStateModalVisible", this.state.isStateModalVisible, value);
        // renderWelcomeMsg()


    }




    render() {

        return (
            <View style={styles.mainContainer}>
                <ImageBackground style={styles.backgroundImage}
                    source={this.bgImage}
                    resizeMode='cover'
                >
                    <TrasnsperantFixedHeader
                        backAction={() => this.onBackAction()}
                    />

                    <View style={styles.headerContainer}>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>Transaction History
                            </Text>
                            <Text style={styles.headerSubtitle}>Search BBPS Transaction
                            </Text>

                        </View>
                    </View>
                    <View style={styles.mainView}>
                        <ScrollView>
                            <View style={styles.innerView}>
                                <View style={styles.viewContainer}>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.username}>{'Billing Details '}</Text>

                                    </View>



                                    <View>
                                        <BBPS style={styles.bbpsStyle} />
                                    </View>

                                </View>
                                <View style={styles.container}>
                                    <View style={styles.iconContainer}>
                                        <View style={styles.simIcon}>
                                            <MSEDCL height={32} width={32} />
                                        </View>
                                    </View>

                                    <View style={styles.textContainer}>
                                        <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
                                            {'Maharashtra State ElectricityBoard Limited'}
                                        </Text>

                                        <Text style={styles.mobileNumber}>{'Biller ID: MSEB000071225'}</Text>
                                    </View>


                                </View>
                                <View style={styles.agentStatus}>
                                    <View style={styles.viewText}>
                                        <Text style={styles.date}>Agent ID</Text>
                                        <Text style={styles.date}>Status</Text>
                                    </View>
                                    <View style={styles.containerView}>
                                        <Text style={[styles.date, { fontFamily: "Inter-Regular" }]}>
                                            {' AGENTID000'}
                                        </Text>
                                        <View style={styles.statusView}>
                                            <Text style={styles.viewText}>Failure</Text>
                                        </View>

                                    </View>


                                </View>

                                <View style={styles.tnxView}>

                                    <View style={styles.leftContainer}>
                                        <Text style={styles.Transdate}>{`Transaction Date : `}</Text>
                                        <Text style={styles.Transdate}>{`Transaction Amount : `}</Text>
                                        <Text style={styles.Transdate}>{`Transaction ID : `}</Text>

                                    </View>

                                    <View style={styles.rightContainer}>
                                        <Text style={styles.dateText}>31st Dec, 2023</Text>
                                        <Text style={styles.amountText}>{strings.rupee} 5421.00</Text>
                                        <Text style={styles.transactionIdText}>CC1101225D</Text>

                                    </View>


                                </View>
                            </View>
                        </ScrollView>
                        <View>
                            <CardView
                                cardElevation={2}
                                cardMaxElevation={2}
                                cornerRadius={12}
                                style={styles.cardContainer}
                            >
                                <TouchableOpacity
                                    style={styles.buttonContainer}
                                    onPress={() => this.props.navigation.navigate('transHistoryList')}
                                >
                                    <Text style={styles.buttonText}>Back</Text>
                                </TouchableOpacity>
                            </CardView>
                        </View>
                    </View>

                </ImageBackground>

            </View>


        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransHistoryList);


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
    },
    innerView: {
        alignItems: 'center',
        marginTop: 10
    },
    viewContainer:
    {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        width: width - 50,

    },
    statusText: {
        flex: 1,
        marginRight: 10,
    },
    containerView: {
        flex: 1,
        alignItems: 'flex-end',
    },
    statusView: {
        borderRadius: 50,
        backgroundColor: "rgba(235, 87, 87, 0.1)",
        width: 100,
        height: 18,
    },
    viewText: {
        fontSize: 12,
        // lineHeight: 11,  // Uncomment if needed
        fontWeight: "900",
        fontFamily: "SF UI Display",
        color: "#eb5757",
        alignSelf: 'center',
    },
    headerContainer: {
        flex: 0.15,
    },
    agentStatus: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        width: width - 50,

    },
    headerTextContainer: {
        marginLeft: 25,
        marginTop: 15,
    },
    mainView: {
        flex: 0.85,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },
    headerTitle: {
        fontSize: 22,
        color: 'white',
        textAlign: 'left',
        fontFamily: 'your-font-bold',
        fontWeight: '800'
    },
    headerSubtitle: {
        fontSize: 15,
        color: 'white',
        textAlign: 'left',
        fontFamily: 'your-font-medium',
    },

    container: {
        flexDirection: 'row',
        padding: 10,
        // borderBottomWidth: 1,
        // borderBottomColor: '#ddd',
        alignItems: 'center',
        marginBottom: 10,
        width: width - 50,
        flex: 3,
        borderBottomWidth: 1,
        borderColor: "#EDEFF4",
        borderStyle: "solid",
    },

    iconContainer: {
        flex: 1,
        marginRight: 10,
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
        justifyContent: 'center',
        alignItems: 'center'

    },
    textContainer: {
        flex: 4,
        //width:500
    },
    username: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        width: '100%'
    },
    bbpsStyle: {
        marginTop: 5,
    },
    mobileNumber: {
        fontSize: 14,
    },
    date: {
        fontSize: 13,
        //  lineHeight: 15,
        fontWeight: "600",
        fontFamily: "Inter-SemiBold",
        color: "#5a6470",
        textAlign: "left",
        opacity: 0.8,
        marginBottom: 5
    },
    Transdate: {
        fontSize: 13,
        lineHeight: 15,
        fontFamily: "Inter-Regular",
        color: "#252525",
        textAlign: "left",
        opacity: 0.8,
        marginBottom: 3
    },
    dateText: {
        fontSize: 12,
        lineHeight: 15,
        fontFamily: "Inter-Regular",
        color: "#252525",
        textAlign: "left",
        opacity: 0.8,
        marginBottom: 2,
    },
    amountText: {
        fontWeight: "700",
        fontFamily: "Inter-Bold",
        marginBottom: 2,
    },
    transactionIdText: {
        fontSize: 12,
        lineHeight: 15,
        fontFamily: "Inter-Regular",
        color: "#252525",
        textAlign: "left",
        opacity: 0.8,
        marginBottom: 2,
    },
    tnxView: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        width: width - 50,
        borderRadius: 13,
        backgroundColor: "#edeff4",
    },
    leftContainer: {
        flex: 1,
        marginRight: 10,
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    cardContainer: {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 20,
    },
    buttonContainer: {
        padding: 15,
        width: width - 50,
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
