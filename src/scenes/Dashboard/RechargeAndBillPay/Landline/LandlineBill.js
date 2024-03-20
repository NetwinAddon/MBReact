
import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    FlatList,
    StyleSheet,
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
} from '../../../../App';
import { TextInput } from 'react-native-paper';

import TrasnsperantFixedHeader from '../../../../components/TrasnperantFixedHeader';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';
import CardViewAutoSlider from '../CardViewAutoSlider';
import Strings from '../../../../common/Strings';

class LandlineBill extends Component {


    constructor(props) {
        super(props);

        this.RecantList = [
            {
                LandlineNumber: '0253 6655 255',
                rechargeAmount: '419',
                OperatorName: 'Airtel Landline',
                Logo: require('../../../../assets/icons/AirtelLogo1.png'),
                operator_code: 'ATL',
                service_type: 'Landline',
                service_provider: 'CR',
            },
            {
                LandlineNumber: '0253 8856 325',
                rechargeAmount: '560',
                OperatorName: 'Reliance Infocomm',
                Logo: require('../../../../assets/icons/datacard_Reliance.png'),
                operator_code: 'RI',
                service_type: 'Landline',
                service_provider: 'CR',
            },
            {
                LandlineNumber: '0253 8666 561',
                rechargeAmount: '310',
                OperatorName: 'Tata Docomo CDMA',
                Logo: require('../../../../assets/icons/datacard_TataPhoton.png'),
                operator_code: 'TDL',
                service_type: 'Landline',
                service_provider: 'CR',
            },

        ];

        this.OperatorList = [
            {
                OperatorName: 'Airtel Landline',
                Logo: require('../../../../assets/icons/AirtelLogo1.png'),
                operator_code: 'ATL',
                service_type: 'Landline',
                service_provider: 'CR',
            },
            {
                OperatorName: 'BSNL Landline',
                Logo: require('../../../../assets/icons/datacard_BSNL.png'),
                operator_code: 'BSL',
                service_type: 'Landline',
                service_provider: 'CR',
            },
            {
                OperatorName: 'MTNL Landline',
                Logo: require('../../../../assets/icons/datacard_MTNL.png'),
                operator_code: 'MTL',
                service_type: 'Landline',
                service_provider: 'CR',
            },
            {
                OperatorName: 'Reliance Infocomm',
                Logo: require('../../../../assets/icons/datacard_Reliance.png'),
                operator_code: 'RI',
                service_type: 'Landline',
                service_provider: 'CR',
            },
            {
                OperatorName: 'Tata Docomo CDMA',
                Logo: require('../../../../assets/icons/datacard_TataPhoton.png'),
                operator_code: 'TDL',
                service_type: 'Landline',
                service_provider: 'CR',
            },
        ];

        this.state = {

            searchTerm: '',
            filteredData: this.OperatorList,
            RecentVisible: true,
        };

    }

    componentDidMount() {

    }

    onBackAction() {
        navigation.goBack(this)
    }

    RecentList = ({ item }) => (

        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('landlineBillPayment', { name: item.OperatorName, Logo: item.Logo, OperatorCode: item.operator_code, Amount: item.rechargeAmount })}
        >
            <View style={styles.Container1view}>

                <View style={styles.container1}>
                    <Image source={item.Logo} style={styles.image1} />
                </View>

                <View style={{ flex: 2, marginLeft: 20 }}>
                    <Text style={styles.username}>{item.OperatorName}</Text>
                    <Text style={styles.OperatorNumber}>{item.LandlineNumber}</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.rechargeAmount}>{Strings.rupee + item.rechargeAmount}</Text>
                    <Text style={styles.lastRecharge}>{'Last Bill Paid Amount'}</Text>

                </View>
            </View>
        </TouchableOpacity>
    );


    AllLandline = ({ item }) => {
        return (

            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('landlineBillPayment', { name: item.OperatorName, Logo: item.Logo, OperatorCode: item.operator_code, Amount: 0, })}
            >
                <View style={styles.TouchableView}>


                    <View style={styles.container1}>
                        <Image source={item.Logo} style={styles.image1} />
                    </View>

                    <View style={{ flex: 4, marginLeft: 20 }}>

                        <Text style={styles.username}>{item.OperatorName}</Text>

                    </View>

                </View>
            </TouchableOpacity>
        );
    };


    handleSearch = searchTerm => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        const filteredData = this.OperatorList
            .filter(item => {
                const lowerCaseName = item.OperatorName.toLowerCase();
                return lowerCaseName.includes(lowerCaseSearchTerm);
            })
            .map(item => {
                return {
                    ...item,
                    highlightedName: (
                        <this.HighlightedText
                            text={item.OperatorName}
                            searchTerm={lowerCaseSearchTerm}
                            highlightColor='Yellow'
                        />
                    ),
                };
            });


        if (lowerCaseSearchTerm === '') {
            this.state.RecentVisible = true;
        }
        else {
            this.state.RecentVisible = false;
        }

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
                            part.toLowerCase() === lowerCaseSearchTerm
                                ? { color: highlightColor, fontWeight: 'bold' }
                                : {}
                        }
                    >
                        {part}
                    </Text>
                ))}
            </Text>
        );
    };

    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg


    render() {

        return (
            <View style={styles.flexOne}>

                <ImageBackground style={styles.flexOne}
                    source={this.bgImage}
                    resizeMode='cover'>

                    <TrasnsperantFixedHeader
                        backAction={() => this.onBackAction()} />

                    <View style={styles.flexpointFifteen}>

                        <View style={styles.HeadingView}>

                            <Text style={styles.HeadingTitle}>Landline Bill </Text>

                            <Text style={styles.SubHeadTitle}>Internet Data Recharge or Bill Pay
                            </Text>

                        </View>
                    </View>

                    <View style={styles.SeacrhBarView}>


                        {/*  Search Bar */}
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={6}
                            style={styles.SearchBarStyle}>
                            <TextInput
                                maxLength={10}
                                style={styles.SearchBarStyle}
                                value={this.state.searchTerm}
                                onChangeText={text => this.handleSearch(text)}
                                placeholder='Search Number with STD Code'

                            />

                            <View>
                                <Image style={styles.ImageStyle} source={require('../../../../assets/icons/search.png')}></Image>
                            </View>
                        </CardView>

                        <View>
                            <CardViewAutoSlider CardType={'Prepaid'} /></View>

                        <ScrollView>
                            <View style={styles.ViewTwoStyle}>


                                {/* Recent Recharge View  */}
                                {this.state.RecentVisible &&

                                    <View>
                                        <View style={styles.RecentCardViewStyle}>
                                            <Text style={styles.RecentTextStyle}>{`Recent `}</Text>
                                            <TouchableOpacity
                                                style={styles.RecentTouchableStyle}
                                                onPress={() => this.props.navigation.navigate('billsPaymentHistory', { HistoryMenu: 'Landline Bill Payment' })}>

                                                <Text style={[styles.RecentTextTwoStyle, { color: this.props.SecondaryColor }]}>{`View History`}</Text>
                                            </TouchableOpacity>
                                        </View>



                                        <React.Fragment>

                                            <View style={styles.flexOne}>

                                                <FlatList
                                                    style={styles.PaddingBottomTen}
                                                    data={this.RecantList.slice(0, 5)}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    renderItem={this.RecentList}
                                                />

                                            </View>
                                        </React.Fragment>

                                    </View>
                                }

                                {/* LandLineList  */}
                                <View style={styles.ContactListView}>
                                    <View style={styles.ContactListSubView}>
                                        <Text style={styles.ContactListText}>{` Landline Provider `}</Text>
                                    </View>

                                    <ScrollView>
                                        <View style={styles.ViewTwoStyle}>

                                            <View>
                                                <FlatList
                                                    data={this.state.filteredData}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    renderItem={this.AllLandline}
                                                />
                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>

                            </View>

                        </ScrollView>

                    </View>

                </ImageBackground>

            </View>


        );

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LandlineBill);


const styles = StyleSheet.create({



    textContainer: {
        flex: 2,
    },
    username: {
        fontSize: 17,
        fontWeight: '500',
        color: '#000'
    },

    rechargeAmount: {
        fontSize: 18,
        textAlign: 'right',
        fontWeight: 'bold',
        color: '#686868'
    },
    lastRecharge: {
        fontSize: 11,
        textAlign: 'right',

    },

    container1: {
        width: 50,
        height: 50,
        borderRadius: 50,
        overflow: 'hidden',
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    image1: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',

    },
    OperatorNumber: {
        fontSize: 14,
    },


    Container1view:
    {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center'
    },

    TouchableView:
    {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        paddingHorizontal: 4,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center'
    },

    flexOne:
    {
        flex: 1
    },

    flexpointFifteen:
    {
        flex: 0.15
    },

    HeadingView:
    {
        marginLeft: 25,
        marginTop: 15,
    },

    HeadingTitle:
    {
        fontSize: 22,
        color: 'black',
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: colors.white,
    },

    SubHeadTitle:
    {
        fontSize: 15,
        color: 'black',
        textAlign: 'left',
        fontFamily: strings.fontMedium,
        color: colors.white,
    },

    SeacrhBarView:
    {
        flex: 0.85,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },
    SearchBarStyle:
    {
        height: 48,
        backgroundColor: 'white',
        width: width - 50,
        alignItems: 'center',
        marginTop: 30,
        flexDirection: 'row',
        marginBottom: 8,
    },

    SearchTextStyle:
    {
        flex: 0.95,
        height: 54,
        backgroundColor: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 17,
    },

    ImageStyle:
    {
        height: 23,
        width: 23
    },

    ViewTwoStyle:
    {
        width: width - 30
    },

    RecentCardViewStyle:
    {
        marginBottom: 10,
        flexDirection: 'row',
        width: width - 50,
        marginTop: 10
    },
    RecentTextStyle:
    {
        textAlign: 'left',
        flex: 1,
        fontWeight: 'bold'
    },
    RecentTouchableStyle:
    {
        flex: 1,
        alignSelf: 'flex-end'
    },
    RecentTextTwoStyle:
    {
        textAlign: 'right',
        flex: 1,
    },
    PaddingBottomTen:
    {
        paddingBottom: 5
    },

    ContactListView:
    {
        flex: 0.85,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },

    ContactListSubView:
    {
        width: '100%'
    },
    ContactListText:
    {
        textAlign: 'left',
        fontWeight: 'bold',
        marginTop: 10
    },

});
