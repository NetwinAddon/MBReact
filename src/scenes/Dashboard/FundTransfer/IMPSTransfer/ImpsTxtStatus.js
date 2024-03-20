import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    BackHandler,
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
    sendData,
    RenderLoader,
} from '../../../../App';
import { TextInput } from 'react-native-paper';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';
import SearchIcon from '../../../../assets/icons/Vector.svg';
import MyValidator from '../../../../common/MyValidator';
import APIUrlConstants from '../../../../common/APIUrlConstants';
import Constants from '../../../../common/Constants';
import { _toEncrypt } from '../../../../common/util';
import Snackbar from 'react-native-snackbar';
import TrasnperantFixedHomeHeader from '../../../../components/TrasnperantFixedHomeHeader';
import NetInfo from '@react-native-community/netinfo';
class ImpsTxtStatus extends Component {
    constructor(props) {
        super(props);
        // console.log("FundTransferProps======", this.props.route.params.accList)
        this.data = [
            {
                title: 'Rahul Jain',
                label: '140025361526',
            },
            {
                title: 'Prashant Jadhav',
                label: 'xxxxx58663252xx0x',
            },
            {
                title: 'Tukaram Sonawane',
                label: 'xxxxx58663252xx0x',
            },
            {
                title: 'Shweta Patil',
                label: 'xxxxx58663252xx0x',
            },
        ];
        this.beneficiaryViewHistoryList = [
            {
                title: 'Received',
                desc: 'R: For Hospital Expenses',
                amount: '10,000',
                date: '12th Nov 2023',
            },
            {
                title: 'Sent',
                desc: 'R: Food Contribution ',
                amount: '2,000',
                date: '10th Nov 2023',
            },
            {
                title: 'Received',
                desc: 'R: For Hospital Expenses',
                amount: '15,000',
                date: '2nd Nov 2023',
            },
            {
                title: 'Sent',
                desc: 'R: Food Contribution ',
                amount: '2,000',
                date: '10th Nov 2023',
            },
            {
                title: 'Received',
                desc: 'R: For Hospital Expenses',
                amount: '10,000',
                date: '12th Nov 2023',
            },
            {
                title: 'Failed',
                desc: 'R: For Hospital Expenses',
                amount: '10,000',
                date: '12th Nov 2023',
            },
        ];
        this.state = {
            callFrom: this.props.route.params.from,
            searchTerm: '',
            filteredData: [],
            transaction_amnt: '',
            bankrrn: '',
            message: '',
            transaction_ref: '',
            transaction_payment_ref: '',
            beneficiaryName: '',
            transaction_date_time: '',
            transaction_status: '',
            beneficiary_ac_no: '',
            beneficiaryIfsc: '',
            remitterName: '',
            isIMPSTrnStatus: false
        };
    }
    componentDidMount() { }
    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg;

    onBackAction() {
        navigation.goBack(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        navigation.goBack(this);

        return true;
    };

    checkInternetConnection = async () => {
        try {
            const state = await NetInfo.fetch();
            const isConnected = state.isConnected;
            return isConnected;
        } catch (error) {
            console.error('Error checking internet connection:', error);
            return false;
        }
    };
    handleSearch = (searchTerm) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filteredData = this.state.myJsonArrayforBeneficiaryList
            .filter((item) => {
                const lowerCaseName = item.BENF009.toLowerCase();
                return lowerCaseName.includes(lowerCaseSearchTerm);
            })
            .map((item) => {
                return {
                    ...item,
                    highlightedName: (
                        <this.HighlightedText
                            text={item.BENF009}
                            searchTerm={lowerCaseSearchTerm}
                            highlightColor='Yellow'
                        />
                    ),
                };
            });

        this.setState({
            searchTerm,
            filteredData,
        });
    };

    HighlightedText = ({ text, searchTerm, highlightColor }) => {
        const lowerCaseText = text.toLowerCase();
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        const parts = lowerCaseText.split(new RegExp(`(${lowerCaseSearchTerm})`, 'gi'));

        return (
            <Text>
                {parts.map((part, index) => (
                    <Text
                        key={index}
                        style={
                            part.toLowerCase() === lowerCaseSearchTerm ? { color: highlightColor, fontWeight: 'bold' } : {}
                        }
                    >
                        {part}
                    </Text>
                ))}
            </Text>
        );
    };

    GetImpsTxtStatus = async () => {
        const isConnected = await this.checkInternetConnection();
        if (isConnected) {
            try {
                const Headers = APIUrlConstants.Headers('GETIMPSTRANDET');
                const Body = {
                    PARACNT: '4',
                    PARA1_TYP: 'STR',
                    PARA1_VAL: Constants.GMST_CODE,
                    PARA2_TYP: 'STR',
                    PARA2_VAL:
                        '{"REQRESPMSG":"' +
                        '1' +
                        '","TRANREFNO":"' +
                        this.state.searchTerm +
                        '","CUSTOMERID":"' +
                        Constants.GMST_CODE +
                        '"}',
                    PARA3_TYP: 'STR',
                    PARA3_VAL: Constants.BankCode,
                    PARA4_TYP: 'STR',
                    PARA4_VAL: Constants.SecretKey,
                };

                console.log('ImpsTransactionStatus URL:- ' + APIUrlConstants.BASE_URL);
                console.log('');
                console.log('ImpsTransactionStatus Body:- ' + JSON.stringify(Body));
                console.log('');

                sendData(
                    this,
                    'post',
                    APIUrlConstants.BASE_URL,
                    Headers,
                    JSON.stringify(Body),
                    async (obj, response) => {
                        var finalRes = response;
                        console.log('ImpsTransactionStatus Response:- ' + JSON.stringify(finalRes));
                        if (finalRes.SUCCESS === 'FALSE') {
                            this.setState({ isIMPSTrnStatus: false })
                            const ErrorMsg = finalRes.TRANSACTION_STATUS;
                            Snackbar.show({
                                text: ErrorMsg,
                                duration: Snackbar.LENGTH_SHORT,
                                backgroundColor: 'red',
                            });
                        } else if (finalRes.SUCCESS === 'TRUE') {
                            this.setState({
                                isIMPSTrnStatus: true,
                                transaction_amnt: finalRes.AMOUNT,
                                bankrrn: finalRes.BANKRRN,
                                message: finalRes.STATUS,
                                transaction_ref: finalRes.TRANREFNO,
                                transaction_payment_ref: finalRes.PAYMENTREF,
                                beneficiaryName: finalRes.BENENAME,
                                transaction_date_time: finalRes.TRANDTTIME,
                                transaction_status: finalRes.TRANSACTION_STATUS,
                                beneficiary_ac_no: finalRes.BENEACNO,
                                beneficiaryIfsc: finalRes.BENEIFSC,
                                remitterName: finalRes.REMNAME
                            })
                        }
                    }
                );
            } catch (e) {
                console.log('Error: ', e);
            }
        } else {
            Snackbar.show({
                text: 'Check Internet Connection',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
            });
        }
    };


    render() {
        return (
            <View style={styles.mainView}>
                <ImageBackground style={styles.mainView} source={this.bgImage} resizeMode='cover'>
                    <TrasnperantFixedHomeHeader backAction={() => this.onBackAction()} />
                    <View style={styles.headerView}>
                        <View style={styles.transactionHistoryView}>
                            <Text style={styles.Heading}>Transaction Status (IMPS)</Text>
                            <Text style={styles.SubHeading}>Check your IMPS Status</Text>
                        </View>
                    </View>
                    <View style={styles.CurveView}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.curveSubView}>
                                <View style={styles.CardStyle}>
                                    <TextInput
                                        style={[styles.TextInputStyle, { color: this.props.PrimaryColor }]}
                                        value={this.state.searchTerm}
                                        onChangeText={(searchTerm) => {
                                            this.setState({ searchTerm });
                                        }}
                                        keyboardType='number-pad'
                                        placeholder='Enter Transaction Ref No.'
                                        underlineColor='transparent'
                                    ></TextInput>
                                    <TouchableOpacity
                                        style={[styles.SeacrhBg, { backgroundColor: this.props.SecondaryColor }]}
                                        onPress={() => {
                                            if(this.state.searchTerm != null && this.state.searchTerm != '')
                                            {
                                                this.GetImpsTxtStatus();
                                            }
                                            else
                                            {
                                                Snackbar.show({
                                                    text: 'Please enter UPI transaction number',
                                                    duration: Snackbar.LENGTH_SHORT,
                                                    backgroundColor: 'red',
                                                  });
                                            }
                                           
                                        }}>
                                        <SearchIcon height={20} width={20} color={'white'} />
                                    </TouchableOpacity>
                                </View>
                                {this.state.isIMPSTrnStatus ?
                                    <View>
                                        <Text
                                            style={styles.statusFromText}>
                                            Status From Sponsored Bank
                                        </Text>

                                        <View style={styles.transactionAmntMainView}>
                                            <View style={styles.transactionAmntSubView}>
                                                <Text
                                                    style={styles.transactionAmntText}>
                                                    Transaction Amount
                                                </Text>
                                                <Text
                                                    style={styles.transactionAmntValue}>
                                                    {strings.rupee+" "+this.state.transaction_amnt}
                                                </Text>
                                            </View>
                                            <View
                                                style={styles.transactionRefMainView}>
                                                <View style={styles.transactionRefSubView}>
                                                    <Text
                                                        style={styles.transactionRefNoText}>
                                                        Tran. Ref. No.:
                                                    </Text>
                                                    <Text
                                                        style={styles.transactionRefNoTextValue}>
                                                        {' '+this.state.transaction_ref}
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text
                                                        style={styles.transactionStatus}>
                                                        Tran. Status :
                                                    </Text>
                                                    <View style={styles.mainView}>
                                                        <Text
                                                            style={styles.transactionStatusValue}>
                                                            {' '+this.state.transaction_status}
                                                           
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View
                                            style={styles.transactionHistoryMainView}>
                                            <View style={{ flex: 1.8 }}>
                                                <Text style={styles.paymentMode}>Bank RRN</Text>
                                                <Text style={styles.paymentMode}>Beneficiary Name</Text>
                                                <Text style={styles.paymentMode}>Payment Ref. No.</Text>
                                                <Text style={styles.paymentMode}>Transaction Date</Text>
                                                <Text style={styles.paymentMode}>Beneficiary A/c No</Text>
                                                <Text style={styles.paymentMode}>Benf. IFSC Code</Text>
                                            </View>
                                            <View style={{ flex: 0.8, alignItems: 'center' }}>
                                                <Text style={styles.paymentMode}>:</Text>
                                                <Text style={styles.paymentMode}>:</Text>
                                                <Text style={styles.paymentMode}>:</Text>
                                                <Text style={styles.paymentMode}>:</Text>
                                                <Text style={styles.paymentMode}>:</Text>
                                                <Text style={styles.paymentMode}>:</Text>
                                            </View>
                                            <View style={{ flex: 2.5 }}>
                                                <Text style={styles.paymentMode}>{this.state.bankrrn}</Text>
                                                <Text style={styles.paymentMode}>{this.state.beneficiaryName}</Text>
                                                <Text style={styles.paymentMode}>{this.state.transaction_payment_ref}</Text>
                                                <Text style={styles.paymentMode}>{this.state.transaction_date_time}</Text>
                                                <Text style={styles.paymentMode}>{this.state.beneficiary_ac_no}</Text>
                                                <Text style={styles.paymentMode}>{this.state.beneficiaryIfsc}</Text>
                                            </View>
                                        </View>
                                    </View> : null}
                            </View>
                        </ScrollView>
                        <TouchableOpacity
                               style={[styles.backButtonTouchable, { backgroundColor: this.props.PrimaryColor,}]}
                                    onPress={() => {
                                        this.onBackAction();
                                    }}>
                                    <Text
                                        style={styles.backButtonText}>
                                        {'Back'}
                                    </Text>
                                </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}
const styles = {
    mainView:
    {
        flex: 1
    },
    Heading: {
        fontSize: 24,
        color: 'black',
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: colors.white,
    },
    SubHeading: {
        fontSize: 15,
        textAlign: 'left',
        fontFamily: strings.fontMedium,
        color: colors.white,
    },
    CurveView: {
        flex: 0.8,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    statusFromText:
    {
        fontSize: 10,
        marginTop: 19,
        fontWeight: '700',
        fontFamily: strings.fontBold,
        color: '#133A72',
        textAlign: 'center',
        fontSize: 20,
    },
    transactionAmntMainView:
    {
        flexDirection: 'row',
        marginTop: 20
    },
    transactionAmntSubView:
    {
        flex: 1,
        padding: 8
    },
    transactionAmntText:
    {
        fontSize: 10,
        lineHeight: 11,
        fontWeight: '500',
        fontFamily: strings.fontMedium,
        color: 'rgba(0, 0, 0, 0.75)',
    },
    transactionRefNoText:
    {
        fontSize: 10,
        lineHeight: 11,
        fontWeight: "500",
        fontFamily: strings.fontMedium,
        color: "rgba(0, 0, 0, 0.75)",
        marginBottom: 5
    },
    transactionRefNoTextValue:
    {
        fontSize: 10,
        lineHeight: 11,
        fontWeight: "500",
        fontFamily: strings.fontMedium,
        color: "rgba(0, 0, 0, 0.75)",
        marginBottom: 5
    },
    transactionAmntValue:
    {
        fontSize: 26,
        letterSpacing: 0,
        lineHeight: 30,
        fontWeight: '700',
        fontFamily: strings.fontBold,
        color: '#1f3c66',
        marginTop: 8,
    },
    transactionRefMainView:
    {
        flex: 1,
        height: 57, backgroundColor: '#FEBE5C',
        padding: 10,
        opacity: 0.8,
        justifyContent: 'center',
        borderRadius: 12,
    },
    transactionRefSubView:
    {
        flexDirection: 'row'
    },
    transactionStatus:
    {
        fontSize: 10,
        lineHeight: 11,
        fontWeight: '500',
        fontFamily: strings.fontMedium,
        color: 'rgba(0, 0, 0, 0.75)',
        marginBottom: 5,
    },
    transactionStatusValue:
    {
        fontSize: 10,
        lineHeight: 11,
        fontWeight: '700',
        color: colors.accTextColor,
        marginBottom: 5,
        fontFamily: strings.fontBold,
    },
    transactionHistoryMainView:
    {
        borderRadius: 8,
        backgroundColor: '#f3f8ff',
        borderStyle: 'dashed',
        borderColor: '#93b1c8',
        borderWidth: 1,
        flexDirection: 'row',
        marginTop: 22,
        padding: 10,
        marginHorizontal: 15,
    },
    curveSubView: {
        marginTop: 10,

    },
    CardStyle: {
        backgroundColor: 'white',
        width: width - 60,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        flexDirection: 'row',
        borderWidth:1,
        borderColor:'#DFE1E8',
        borderRadius:8
    },
    TextInputStyle: {
        paddingLeft: 15,
        flex: 0.85,
        height: 48,
        backgroundColor: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 17,
    marginVertical:2
        
    },
    SeacrhBg: {
        flex: 0.15,
        height: 45,
        margin: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    paymentMode: {
        fontSize: 10,
        fontWeight: '500',
        fontFamily: strings.fontMedium,
        color: 'rgba(0, 0, 0, 0.75)',
        textAlign: 'left',
    },
    headerView:
    {
        flex: 0.2,
        justifyContent: 'center'
    },
    transactionHistoryView:
    {
        marginLeft: 25
    },
    backButtonTouchable:
    {
        padding: 15,
        width: width - 50,
        justifyContent: 'center',
        borderRadius: 12,
        alignSelf: 'center',
        position: 'absolute',
        bottom: 20,

    },
    backButtonText:
    {
        alignSelf: 'center',
        color: colors.white,
        fontFamily: strings.fontRegular,
        fontSize: 15,
        fontFamily: strings.fontBold,
    }

};

export default connect(mapStateToProps, mapDispatchToProps)(ImpsTxtStatus);
