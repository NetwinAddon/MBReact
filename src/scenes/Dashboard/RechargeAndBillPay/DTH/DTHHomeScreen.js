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
    Slider
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
} from '../../../../App';
import { TextInput } from 'react-native-paper';

import TrasnsperantFixedHeader from '../../../../components/TrasnperantFixedHeader';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';
import CardViewAutoSlider from '../CardViewAutoSlider';
import Strings from '../../../../common/Strings';

class DTHHomeScreen extends Component {


    constructor(props) {
        super(props);


        this.DTHData = [
            {
                DTHNumber: '0253 6655 255',
                rechargeAmount: '419',
                DTHProvider: 'Airtel DTH',
                Logo: require('../../../../assets/icons/AirtelLogo1.png'),
                operator_code: 'ATD',
                service_type: 'DTH',
                service_provider: 'CR',
            },
            {
                DTHNumber: '0253 8856 325',
                rechargeAmount: '560',
                DTHProvider: 'Videocon DTH',
                Logo: require('../../../../assets/icons/d2hIcon.png'),
                operator_code: 'VDD',
                service_type: 'DTH',
                service_provider: 'CR',
            },
            {
                DTHNumber: '0253 8666 561',
                rechargeAmount: '310',
                DTHProvider: 'Tata Sky',
                Logo: require('../../../../assets/icons/TataSky.png'),
                operator_code: 'TSD',
                service_type: 'DTH',
                service_provider: 'CR',
            },

        ];

        this.OperatorList = [
            {
                DTHProvider: 'Airtel DTH',
                Logo: require('../../../../assets/icons/AirtelLogo1.png'),
                operator_code: 'ATD',
                service_type: 'DTH',
                service_provider: 'CR',
            },
            {
                DTHProvider: 'Big TV',
                Logo: require('../../../../assets/icons/BigTvLogo.png'),
                operator_code: 'BTD',
                service_type: 'DTH',
                service_provider: 'CR',
            },
            {
                DTHProvider: 'Dish TV',
                Logo: require('../../../../assets/icons/DishTvLogo.png'),
                operator_code: 'DTD',
                service_type: 'DTH',
                service_provider: 'CR',
            },
            {
                DTHProvider: 'Sun DTH',
                Logo: require('../../../../assets/icons/SunTVLogo.png'),
                operator_code: 'SD',
                service_type: 'DTH',
                service_provider: 'CR',
            },
            {
                DTHProvider: 'Tata Sky',
                Logo: require('../../../../assets/icons/TataSky.png'),
                operator_code: 'TSD',
                service_type: 'DTH',
                service_provider: 'CR',
            },
            {
                DTHProvider: 'Videocon DTH',
                Logo: require('../../../../assets/icons/d2hIcon.png'),
                operator_code: 'VDD',
                service_type: 'DTH',
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


    renderRecentDTHItems = ({ item }) => (

        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('DTHBillPayment', { name: item.DTHProvider, Logo: item.Logo, OperatorCode: item.operator_code, Amount: item.rechargeAmount })}
        >
            <View style={styles.Container1view}>

                <View style={styles.container1}>
                    <Image source={item.Logo} style={styles.image1} />
                </View>

                <View style={{ flex: 2, marginLeft: 20 }}>
                    <Text style={styles.username}>{item.DTHProvider}</Text>
                    <Text style={styles.DthNumber}>{item.DTHNumber}</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.rechargeAmount}>{Strings.rupee + item.rechargeAmount}</Text>
                    <Text style={styles.lastRecharge}>{'Last Bill Paid Amount'}</Text>

                </View>
            </View>
        </TouchableOpacity>
    );



    renderAllDTHItems = ({ item }) => {

        return (

            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('DTHBillPayment', { name: item.DTHProvider, Logo: item.Logo, OperatorCode: item.operator_code, Amount: 0, })}

            >

                <View style={styles.TouchableView}>


                    <View style={styles.container1}>
                        <Image source={item.Logo} style={styles.image1} />
                    </View>

                    <View style={{ flex: 4, marginLeft: 20 }}>

                        <Text style={styles.username}>{item.DTHProvider}</Text>


                    </View>

                </View>
            </TouchableOpacity>
        );
    };


    handleSearch = searchTerm => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        console.log("search---" + lowerCaseSearchTerm)
        const filteredData = this.OperatorList
            .filter(item => {
                const lowerCaseName = item.DTHProvider.toLowerCase();
                return lowerCaseName.includes(lowerCaseSearchTerm);
            })
            .map(item => {
                return {
                    ...item,
                    highlightedName: (
                        <this.HighlightedText
                            text={item.DTHProvider}
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
                    resizeMode='cover'
                >
                    <TrasnsperantFixedHeader
                        backAction={() => this.onBackAction()}
                    />

                    <View style={styles.flexpointFifteen}>
                        <View style={styles.HeadingView}>

                            <Text style={styles.HeadingTitle}>DTH
                            </Text>

                            <Text style={styles.SubHeadTitle}>Select DTH Provider
                            </Text>

                        </View>
                    </View>

                    <View style={styles.SeacrhBarView}>

                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={6}
                            style={styles.SearchBarStyle} >

                            <TextInput
                                maxLength={10}
                                style={[styles.SearchTextStyle, { color: this.props.textColor, }]}
                                value={this.state.searchTerm}
                                onChangeText={text => this.handleSearch(text)}
                                placeholder='Search DTH Provider'

                            />

                            <View>
                                <Image style={{ height: 23, width: 23 }} source={require('../../../../assets/icons/search.png')}></Image>
                            </View>
                        </CardView>

                        <CardViewAutoSlider CardType={'Prepaid'} />

                        <ScrollView>
                            <View style={styles.ViewTwoStyle}>

                                {this.state.RecentVisible &&

                                    <View>

                                        <View style={styles.RecentCardViewStyle}>
                                            <Text style={styles.RecentTextStyle}>{`Recent `}</Text>
                                            <TouchableOpacity
                                                style={styles.RecentTouchableStyle}
                                                onPress={() => this.props.navigation.navigate('billsPaymentHistory', { HistoryMenu: 'DTH Recharge' })}
                                            >
                                                <Text style={[styles.RecentTextTwoStyle, { color: this.props.SecondaryColor }]}>{`View History`}</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <React.Fragment>

                                            <View style={styles.flexOne}>

                                                <FlatList
                                                    style={styles.PaddingBottomTen}
                                                    data={this.DTHData.slice(0, 5)}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    renderItem={this.renderRecentDTHItems}
                                                />
                                            </View>
                                        </React.Fragment>

                                    </View>
                                }

                                {/* All DTH Provider  */}
                                <View style={styles.ContactListView}>
                                    <View style={styles.ContactListSubView}>
                                        <Text style={styles.ContactListText}>{`All Billers `}</Text>
                                    </View>

                                    <ScrollView>
                                        <View style={styles.ViewTwoStyle}>
                                            <View>
                                                <FlatList
                                                    data={this.state.filteredData}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    renderItem={this.renderAllDTHItems}
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

export default connect(mapStateToProps, mapDispatchToProps)(DTHHomeScreen);


const styles = StyleSheet.create({

    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    container: {
        flexDirection: 'row',
        padding: 9,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
        width: width - 50
    },

    iconContainer: {
        flex: 1,
        marginRight: 5,
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
        alignItems: 'center',
        justifyContent: 'center',

    },
    textContainer: {
        flex: 2,

    },
    username: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000',

    },
    DthNumber: {
        fontSize: 14,
    },
    rechargeAmount: {
        fontSize: 15,
        textAlign: 'right',
        fontWeight: 'bold',
        color: '#686868'
    },
    lastRecharge: {
        fontSize: 11,
        textAlign: 'right',

    },
    logo: {
        width: 50,
        height: 20,
    },

    container1: {
        width: 50,
        height: 50,
        borderRadius: 50, // Half of the width and height to make it circular
        overflow: 'hidden',
        elevation: 2, // Set the elevation for the shadow effect
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    TouchableView:
    {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center'
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
    image1: {
        width: '100%', // 90% of the container width
        height: '100%', // 90% of the container height
        resizeMode: 'cover',

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
