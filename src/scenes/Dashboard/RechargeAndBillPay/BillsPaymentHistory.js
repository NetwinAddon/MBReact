import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    TextInput,
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
    config,
} from '../../../App';
import CardView from 'react-native-cardview'
import TrasnsperantFixedHeader from '../../../components/TrasnperantFixedHeader';
import Withdraw from '../../../assets/icons/withdraw.svg'
import { FlatList } from 'react-native-gesture-handler';
import Constants from '../../../common/Constants';

class BillsPaymentHistory extends Component {
    constructor(props) {
        super(props);
        this.Balance = Constants.Selected_BALANCE
        this.AcNO = Constants.Selected_AC_NO
        this.AcType = Constants.Selected_ACTYPE.toUpperCase()
        this.GmstCode = Constants.Selected_GMST_CODE
        this.AcMastCode = Constants.Selected_ACMASTCODE
        this.LoadMore = []
        this.HistoryList = [
            {
                username: 'Poonam Jadhav',
                mobileNumber: '1234567890',
                rechargeAmount: '925.00',
                simCompany: 'Airtel',
                lastRecharge: '10th Nov 2023',
                rechargeType: 'Prepaid Mobile Recharge'

            },
            {
                username: 'Airtel TV',
                mobileNumber: '9876543210',
                rechargeAmount: '225.00',
                simCompany: 'Jio',
                lastRecharge: '9th Nov 2023',
                rechargeType: 'Postpaid Bill Payment'
            },
            {
                username: 'Sanjay Jadhav',
                mobileNumber: '1234567890',
                rechargeAmount: '925.00',
                simCompany: 'Airtel',
                lastRecharge: '1th Nov 2023',
                rechargeType: 'Prepaid Mobile Recharge'

            },
            {
                username: 'DDL',
                mobileNumber: '9876543210',
                rechargeAmount: '225.00',
                simCompany: 'Jio',
                lastRecharge: '9th Nov 2023',
                rechargeType: 'Postpaid Bill Payment'
            },
            {
                username: 'BSNL Landline',
                mobileNumber: '9876543210',
                rechargeAmount: '299.00',
                simCompany: 'Airtel',
                lastRecharge: '9nd Aug 2023',
                rechargeType: 'Landline Bill Payment'

            },
            {
                username: 'JIO Data Card',
                mobileNumber: '9876543210',
                rechargeAmount: '299.00',
                simCompany: 'Jio',
                lastRecharge: '9th Nov 2023',
                rechargeType: 'Data Card Payment'

            },
            {
                username: 'Airtel Landline',
                mobileNumber: '9876543210',
                rechargeAmount: '299.00',
                simCompany: 'Airtel',
                lastRecharge: '11nd Aug 2023',
                rechargeType: 'Landline Bill Payment'

            },
            {
                username: 'Airtel TV',
                mobileNumber: '9876543210',
                rechargeAmount: '352.00',
                simCompany: 'Jio',
                lastRecharge: '9th Nov 2023',
                rechargeType: 'DTH Recharge'

            },
            {
                username: 'Reliance Landline',
                mobileNumber: '9876543210',
                rechargeAmount: '299.00',
                simCompany: 'Airtel',
                lastRecharge: '9nd Aug 2023',
                rechargeType: 'Landline Bill Payment'

            },
            {
                username: 'JIO Data Card',
                mobileNumber: '9876543210',
                rechargeAmount: '252.00',
                simCompany: 'Jio',
                lastRecharge: '10th Nov 2023',
                rechargeType: 'Data Card Payment'

            },
            {
                username: 'JIO Data Card',
                mobileNumber: '9876543210',
                rechargeAmount: '252.00',
                simCompany: 'Jio',
                lastRecharge: '10th Dec 2023',
                rechargeType: 'Data Card Payment'

            },

        ];


        this.state = {
            initialDate: false,
            showDatePicker: false,
            searchTerm: '',
            filteredData: null,
            AccountList: [],
            start_count: 0,
            end_count: 30,
            MainHistoryList: []
        };
    }

    bgImage = appThemeConfiguration(config.themeColor).bgImg

    renderFooter = () => {
        return (
            <TouchableOpacity
                style={styles.loadMoreTouchable}
                onPress={this.LoadMoreOnPress}
            ><Text style={styles.loadMoreText}>Load More</Text></TouchableOpacity>
        );
    };

    renderHeader = (date) => {
        return (
            <View>
                <Text style={styles.dateText}>{date}</Text>
            </View>
        );
    };

    handleSearch(searchTerm) {
        const filteredData = this.HistoryList.filter(item => {
            const searchTermLower = searchTerm.toLowerCase();
            return (
                item.username.toLowerCase().includes(searchTermLower) ||
                item.mobileNumber.includes(searchTerm) ||
                item.rechargeAmount.includes(searchTerm) ||
                item.simCompany.toLowerCase().includes(searchTermLower) ||
                item.lastRecharge.toLowerCase().includes(searchTermLower) ||
                item.rechargeType.toLowerCase().includes(searchTermLower)
            );
        });
        this.setState({ filteredData });
    };

    LoadMoreOnPress = () => {
        //increment next value by 30 in load more press
        // this.setState((prevState) => ({
        //     start_count: prevState.end_count,
        //     end_count: prevState.end_count + 30,
        // }), () => {
        //     console.log("start ", this.state.start_count)
        //     console.log("end ", this.state.end_count)
        //     this.GetM_PassbookStatementApi()
        // });
    }

    renderListItem = ({ item }) => {
        return (
            <View style={styles.renderList}>
                <View style={styles.withdrawImgView}>
                    <Withdraw height={16} width={16} color={'#eb5757'} />
                </View>
                <View
                    style={[styles.mainView, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <View style={styles.userNameView}>
                        <Text style={styles.userNameText}
                            numberOfLines={1}
                        >{item.username}</Text>
                        <Text style={styles.userNameTextValue}>{item.mobileNumber}</Text>
                    </View>
                    <View>
                        <Text style={styles.rechargeAmnt}>{strings.rupee + item.rechargeAmount}</Text>
                        <View style={{
                        }}>
                            <Text style={styles.rechargeType}>{item.rechargeType}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }



    _onDateSelected = (selDate) => {
        if (this.state.initialDate) {
            console.log("inital date is: ")
            this.setState({ startDate: selDate, showDatePicker: false })
        }
        else {
            this.setState({ endDate: selDate, showDatePicker: false })
        }
    }


    _hideDatePicker = () => {
        this.setState({ showDatePicker: false });
    };

    onBackAction() {
        navigation.goBack(this)
    }
    toOwnAccTransfer() {
        navigation.navigate(this, 'ownAccTransferScreen')
    }

    render() {
        let filteredHistoryList = [];
        if (this.props.route.params.HistoryMenu) {
            filteredHistoryList = this.HistoryList.filter(item => item.rechargeType === this.props.route.params.HistoryMenu);
        } else {
            filteredHistoryList = this.HistoryList
        }
        const sortedHistoryList = filteredHistoryList.sort((a, b) => new Date(b.lastRecharge) - new Date(a.lastRecharge));
        const groupedByDate = sortedHistoryList.reduce((result, item) => {
            const date = item.lastRecharge;
            if (!result[date]) {
                result[date] = [];
            }
            result[date].push(item);
            return result;
        }, {});
        const groupedData = Object.entries(groupedByDate)
            .map(([date, data]) => ({ date, data }))
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        return (
            <View style={styles.mainView}>
                <ImageBackground style={styles.mainView}
                    source={this.bgImage}
                    resizeMode='cover'>
                    <TrasnsperantFixedHeader
                        backAction={() => this.onBackAction()} />
                    <View style={styles.lableHeader}>
                        <View style={styles.lableHeaderView}>
                            <Text style={styles.ftToOtherBankTitle}>{'History'}</Text>
                            <Text style={styles.ftToOtherBankDescription}>{'Recharge & Bill Payment History'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.subMainView}>
                        {/* Filter */}
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={6}
                            style={styles.searchCard}>
                            <TextInput
                                style={[styles.searchTextInput, { color: this.props.textColor }]}
                                value={this.state.searchTerm}
                                onChangeText={searchTerm => {
                                    this.setState({ searchTerm });
                                    this.handleSearch(searchTerm);
                                }}
                                placeholder='Search Here'>
                            </TextInput>
                            <View>
                                <Image style={{ height: 23, width: 23 }} source={require('../../../assets/icons/search.png')}></Image>
                            </View>
                        </CardView >
                        <FlatList
                            data={this.state.searchTerm.length > 0 ? this.state.filteredData : groupedData}
                            keyExtractor={(item) => item.date}
                            style={styles.flatListStyle}
                            ItemSeparatorComponent={() => {
                                return (
                                    <View style={styles.itemSeparator} />
                                );
                            }}
                            contentContainerStyle={{ justifyContent: 'center' }}
                            renderItem={({ item }) => (
                                <View>
                                    {this.state.searchTerm.length > 0 ?
                                        this.renderListItem({ item })
                                        :
                                        <View>
                                            {this.renderHeader(item.date)}
                                            {item.data.map((rechargeItem) =>
                                                this.renderListItem({ item: rechargeItem })
                                            )}
                                        </View>}
                                </View>
                            )}
                            ListFooterComponent={
                                this.state.searchTerm.length == 0 ? this.renderFooter : null
                            }
                        />

                    </View >
                </ImageBackground >
            </View >
        );
    }
}
const styles = {
    mainView:
    {
        flex: 1
    },
    lableHeader:
    {
        flex: 0.15
    },
    lableHeaderView:
    {
        marginLeft: 25,
        marginBottom: 10,
    },
    ftToOtherBankTitle:
    {
        fontSize: 20,
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: colors.white,
    },
    ftToOtherBankDescription:
    {
        fontSize: 15,
        color: 'black',
        textAlign: 'left',
        fontFamily: strings.fontMedium,
        color: colors.white,
    },
    subMainView:
    {
        flex: 0.85,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    searchCard:
    {
        height: 48,
        backgroundColor: 'white',
        width: width - 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        flexDirection: 'row',
    },
    searchTextInput:
    {
        flex: 0.85,
        height: 48,
        backgroundColor: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 17,
    },
    flatListStyle:
    {
        marginTop: 15,
        width: width - 60,
    },
    itemSeparator:
    {
        height: 0.5,
        width: '90%',
        backgroundColor: colors.backgroundColor,
        alignSelf: 'center',
    },
    renderList:
    {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 13
    },
    withdrawImgView:
    {
        height: 36,
        width: 36,
        borderRadius: 36 / 2,
        backgroundColor: "#eb5757" + '1A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userNameView:
    {
        marginLeft: 15,
        padding: 2,
        flex: 0.75,
    },
    userNameText:
    {
        fontFamily: strings.fontMedium,
        fontSize: 14,
        color: 'black'
    },
    userNameTextValue:
    {
        fontFamily: strings.fontRegular,
        fontSize: 14,
        color: '#929CAC'
    },
    rechargeAmnt:
    {
        textAlign: 'right',
        paddingTop: 5,
        fontFamily: strings.fontRegular,
        fontSize: 14,
        color: '#252525'
    },
    rechargeType:
    {
        textAlign: 'right',
        fontFamily: strings.fontRegular,
        fontSize: 12,
        color: "#686868",
        opacity: 0.7
    },
    dateText:
    {
        marginTop: 6,
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#686868",
        textAlign: "left"
    },
    loadMoreTouchable:
    {
        marginTop: 15,
        marginBottom: 15,
        height: 40,
        width: width - 60,
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#8bb9dc'
    },
    loadMoreText:
    {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 10,
        marginTop: 10,
    },

};

export default connect(mapStateToProps, mapDispatchToProps)(BillsPaymentHistory);
