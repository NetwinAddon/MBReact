import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    BackHandler,
} from 'react-native';
import {
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    navigation,
    width,
    sendData,
    RenderLoader,
    colors,
} from '../../App';
import FixedHeader from '../../components/FixedHeader';
import { ScrollView } from 'react-native-gesture-handler';
import { FlatList } from 'react-native-gesture-handler';
import Deposit from '../../assets/icons/deposited.svg'
import Withdraw from '../../assets/icons/withdraw.svg'
import APIUrlConstants from '../../common/APIUrlConstants';
import Constants from '../../common/Constants';
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import moment from 'moment'
import { RFValue } from "react-native-responsive-fontsize";

class HistoryScreen extends Component {
    constructor(props) {
        super(props);



        this.state = {
            start_count: 0,
            end_count: 30,
        };

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.HistoryList = []
        this.TempAcc = []
        this.AcMastCode = []
        this.AcNo = []

        var userData = props.route.params.customData

        let userAccArray = userData.Acdtls

        if (userAccArray.length > 0) {
            userAccArray.map((item) => {

                this.TempAcc.push(JSON.parse(item))    // 2- Store Resp in Temp Array

            })
        }

        this.TempAcc.forEach(item => {

            if (item.ACTYPE === 'SAVING ACCOUNT' || item.ACTYPE === 'CURRENT ACCOUNT' || item.ACTYPE === 'LOAN ACCOUNT' && (item.SUB_TYPE === '2' || item.SUB_TYPE === '6' || item.SUB_TYPE === '7')) {
                this.AcMastCode.push(item.ACMASTCODE)
                this.AcNo.push(item.AC_NO)
            }
        });

        console.log("AcMastCode" + this.AcMastCode)

    }

    async componentDidMount() {
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {
            this.GetTransactionHistory()
            this.props.navigation.addListener('focus', () => {
                this.HistoryList = []
                this.state.start_count = 0,
                    this.state.end_count = 20,
                    this.GetTransactionHistory()
            });

        } else {
            console.log("Not connected to the internet");
        }
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





    checkInternetConnection = async () => {
        try {
            const state = await NetInfo.fetch();
            const isConnected = state.isConnected;
            return isConnected;
        } catch (error) {
            console.error("Error checking internet connection:", error);
            return false;
        }
    };

    onBackArrow = () => {
        navigation.goBack(this)
    }

    GetTransactionHistory = async () => {
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {
            const Headers = APIUrlConstants.Headers("TRNHIST");
            const start = this.state.start_count;
            const end = this.state.end_count;
            const jsonReq =
            {
                CUST_ID: Constants.GMST_CODE,
                TXTSTARTROW: "" + this.state.start_count,
                TXTENDROW: "" + this.state.end_count,
                ENT_DATE1: '',
                ENT_DATE2: '',
            }
            let jsonValue = JSON.stringify(jsonReq);

            const Body =
            {
                PARACNT: "1",
                PARA1_TYP: "STR",
                PARA1_VAL: jsonValue + "#" + this.AcMastCode + "#" + this.AcNo,
            }


            console.log("TransHistory == Body  " + JSON.stringify(Body))

            sendData(this,
                'post',
                APIUrlConstants.BASE_URL,
                Headers,
                JSON.stringify(Body),
                async (obj, response) => {
                    var responseData = response

                    console.log("TransHistory == responseData  " + JSON.stringify(responseData))

                    if (responseData === "FALSE") {
                        return okDialog(this, "Hellos")
                    }
                    else {
                        let userAccArray = responseData.trndtls
                        if (userAccArray.length > 0) {
                            userAccArray.map((item) => {
                                this.HistoryList.push(JSON.parse(item))
                            })
                        }
                    }
                })

        } else {
            Snackbar.show({ text: 'Check Internet Connection', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
        }
    }

    HistoryDesign = ({ item }) => {
        return (
            <TouchableOpacity>
                <View style={styles.touchableContainer}>
                    {item.TRANS_REMARK === ('TO') ?
                        <View style={styles.WithdrawContainer}>
                            <Withdraw height={16} width={16} color={'#eb5757'} />
                        </View>
                        :
                        <View style={styles.downArrowContainer}>
                            <Deposit height={16} width={16} color={'#27ae60'} />
                        </View>
                    }
                    <View
                        style={styles.partucularMainContainer}>
                        <View style={styles.partucularMainInnerContainer}>
                            <Text style={styles.partucularText} numberOfLines={1}>{item.PARTICULAR}</Text>
                            {item.TRANS_ID !== '' && (<Text style={styles.transactionIdText}>{item.TRANS_ID}</Text>)}

                        </View>
                        <View style={styles.dateContainer}>
                            <Text style={[styles.rupeesText, { color: item.TRANS_REMARK === ('TO') ? '#EB5757' : '#27AE60' }]}>₹  {item.TRANS_REMARK === ('TO') ? item.DR_AMT : item.CR_AMT}</Text>
                            <Text style={styles.dateText}>{moment(item.TRANSACTION_DATE).format("DD MMM YYYY")} </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    LoadMoreOnPress = () => {
        this.setState((prevState) => ({
            start_count: prevState.end_count,
            end_count: prevState.end_count + 20,
        }), () => {
            console.log("start ", this.state.start_count)
            console.log("end ", this.state.end_count)
            this.GetTransactionHistory()
        });
    }


    renderFooter = () => {
        return (
            <TouchableOpacity style={styles.loadMoreTouchable}
                onPress={this.LoadMoreOnPress}>
                <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <View style={styles.mainContainer}>
                <FixedHeader
                    backAction={() => this.onBackArrow()}
                    color={this.props.PrimaryColor} />
                <View style={styles.innerContainer}>
                    <View style={styles.transactionHistoryContainer}>
                        <Text style={[styles.MainHeading, { color: this.props.PrimaryColor }]}>
                            Transaction History
                        </Text>


                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{marginTop: 10}}
                            >


                            <View style={styles.scrollInnerContainer}>
                            
                                <FlatList
                                    style={styles.flatListStyle}
                                    data={this.HistoryList}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={this.HistoryDesign}
                                // ListFooterComponent={this.renderFooter} 

                                />

                                {this.HistoryList.length > 0 && (
                                    <View style={styles.noteView}>
                                <Text style={styles.ErrorDisplay}>
                                    Note : 
                                    </Text>
                                    <Text style={styles.ErrorDisplay}>
                                   Visit M-Passbook or Download Account {'\n'}Statement For More Transactions
                                    </Text>
                                    </View>)}

                            </View>
                        </ScrollView>
                    </View>
                </View>
                <RenderLoader />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    MainHeading:
    {
        fontSize: RFValue(25),
        textAlign: 'left',
        marginLeft: 10,
        fontFamily: strings.fontBold,
    },
    mainContainer:
    {
        flex: 1,
        backgroundColor: colors.white
    },
    innerContainer:
    {
        flex: 1,
        marginTop: -30,
    },
    scrollInnerContainer:
    {
        alignItems: 'center'
    },
    flatListStyle:
    {
        marginTop: 10,
        width: width - 40,
    },
    loadMoreTouchable:
    {
        marginTop: 15,
        marginBottom: 15,
        height: 40,
        width: width - 50,
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#8bb9dc'
    },
    loadMoreText:
    {
        color: 'black',
        fontFamily: strings.fontMedium,
        fontSize: RFValue(14)
    },
    touchableContainer:
    {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        borderColor: '#bdc2c9',
        borderWidth: 0.5,
        borderRadius: 5,
        padding: 8,
    },
    WithdrawContainer:
    {
        height: 36,
        width: 36,
        borderRadius: 36 / 2,
        backgroundColor: "#eb5757" + '1A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    downArrowContainer:
    {
        height: 36,
        width: 36,
        borderRadius: 36 / 2,
        backgroundColor: "#27ae60" + '1A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    partucularMainContainer:
    {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center', // aligns items vertically
        alignItems: 'center',
    },
    partucularMainInnerContainer:
    {
        marginLeft: 5,
        padding: 2,
        flex: 0.68,
        alignContent: 'center',
        alignItems: 'center',
    },
    partucularText:
    {
        fontFamily: strings.fontMedium,
        fontSize: RFValue(12),
        color: 'black',
        alignSelf: 'baseline',
        textAlign: 'justify',
        alignItems: 'flex-start',
    },
    transactionIdText:
    {
        fontFamily: strings.fontRegular,
        fontSize: RFValue(12),
        color: '#929CAC',
        alignSelf: 'baseline'
    },
    dateContainer:
    {
        flex: 0.32,
        alignItems: 'flex-end'
    },
    dateText:
    {
        fontFamily: strings.fontRegular,
        fontSize: RFValue(12), color: '#929CAC'
    },
    rupeesText:
    {
        flex: 0.25,
        textAlign: 'right',
        padding: 5,
        fontFamily: strings.fontRegular,
        fontSize: RFValue(13),
    },
    transactionHistoryContainer:
    {
        flex: 1,
        alignItems: 'center',
    },
    ErrorDisplay: { color: "#FF0000",fontWeight: '500' , fontSize: RFValue(12) , marginBottom : 50},
    noteView:
    {
        flexDirection:'row'
    }

})



export default connect(mapStateToProps, mapDispatchToProps)(HistoryScreen);