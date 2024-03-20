
//  RGP

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

//import { TouchableOpacity } from 'react-native-gesture-handler';
import TrasnsperantFixedHeader from '../../../../components/TrasnperantFixedHeader';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';
import CardViewAutoSlider from '../CardViewAutoSlider';
import Strings from '../../../../common/Strings';





class DataCard extends Component {


    constructor(props) {
        super(props);



        this.DataCardDetails = [
            {
                DataCardNumber: '0253 6655 255',
                rechargeAmount: '419',
                DataCardProvider: 'Aircel DataCard',
                Logo: require('../../../../assets/icons/datacard_Aircel.png'),
                operator_code: 'AD',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                DataCardNumber: '0253 6655 255',
                rechargeAmount: '400',
                DataCardProvider: 'MTNL Mumbai DataCard',
                Logo: require('../../../../assets/icons/datacard_MTNL.png'),
                operator_code: 'MMD',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                DataCardNumber: '0253 6655 255',
                rechargeAmount: '190',
                DataCardProvider: 'MTS Mblaze',
                Logo: require('../../../../assets/icons/datacard_MTSBlaze.png'),
                operator_code: 'MTZ',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                DataCardNumber: '0253 6655 255',
                rechargeAmount: '350',
                DataCardProvider: 'Reliance NetConnect 3G',
                Logo: require('../../../../assets/icons/datacard_Reliance.png'),
                operator_code: 'RNG',
                service_type: 'Datacard',
                service_provider: 'CR',
            },


        ];


        this.OperatorList = [
            {
                DataCardProvider: 'Aircel DataCard',
                Logo: require('../../../../assets/icons/datacard_Aircel.png'),
                operator_code: 'AD',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                DataCardProvider: 'BSNL DataCard',
                Logo: require('../../../../assets/icons/datacard_BSNL.png'),
                operator_code: 'BD',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                DataCardProvider: 'MTNL Delhi DataCard',
                Logo: require('../../../../assets/icons/datacard_MTNL.png'),
                operator_code: 'MDD',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                DataCardProvider: 'MTNL Mumbai DataCard',
                Logo: require('../../../../assets/icons/datacard_MTNL.png'),
                operator_code: 'MMD',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                DataCardProvider: 'MTS Mblaze',
                Logo: require('../../../../assets/icons/datacard_MTSBlaze.png'),
                operator_code: 'MTZ',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                DataCardProvider: 'MTS Mbrowse',
                Logo: require('../../../../assets/icons/datacard_MTSbrowse.png'),
                operator_code: 'MTW',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                DataCardProvider: 'Reliance NetConnect 1X',
                Logo: require('../../../../assets/icons/datacard_Reliance.png'),
                operator_code: 'RN',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                DataCardProvider: 'Reliance NetConnect 3G',
                Logo: require('../../../../assets/icons/datacard_Reliance.png'),
                operator_code: 'RNG',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                DataCardProvider: 'Reliance NetConnect+',
                Logo: require('../../../../assets/icons/datacard_Reliance.png'),
                operator_code: 'RNC',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                DataCardProvider: 'Tata Photon Whiz',
                Logo: require('../../../../assets/icons/datacard_TataPhoton.png'),
                operator_code: 'TPW',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                DataCardProvider: 'Tata Photon Whiz',
                Logo: require('../../../../assets/icons/datacard_TataPhoton.png'),
                operator_code: 'TPW',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
            {
                DataCardProvider: 'Tata Photon+',
                Logo: require('../../../../assets/icons/datacard_TataPhoton.png'),
                operator_code: 'TPW',
                service_type: 'Datacard',
                service_provider: 'CR',
            },
        ];




        this.state = {
            amount: '',
            searchTermAct: 0,
            constactsNumbers: [],
            searchTerm: '',
            filteredData: this.OperatorList,
            RecentVisible: true,
        };
    }








    renderRecentDataCardItem = ({ item }) => (

        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('dataCardPayments', { name: item.DataCardProvider, Logo: item.Logo, OperatorCode: item.operator_code, Amount: item.rechargeAmount })}
        >
            <View style={styles.Container1view}>

                <View style={styles.container1}>
                    <Image source={item.Logo} style={styles.image1} />
                </View>

                <View style={{ flex: 2, marginLeft: 20 }}>
                    <Text style={styles.username}>{item.DataCardProvider}</Text>
                    <Text style={styles.DthNumber}>{item.DataCardNumber}</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.rechargeAmount}>{Strings.rupee + item.rechargeAmount}</Text>
                    <Text style={styles.lastRecharge}>{'Last Bill Paid Amount'}</Text>

                </View>
            </View>
        </TouchableOpacity>
    );


    componentDidMount() {

    }


    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg2



    onBackAction() {
        navigation.goBack(this)
    }



    handleSearch = searchTerm => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        console.log("search---" + lowerCaseSearchTerm)
        // Filter the data based on the search term
        const filteredData = this.OperatorList
            .filter(item => {
                const lowerCaseName = item.DataCardProvider.toLowerCase();
                return lowerCaseName.includes(lowerCaseSearchTerm);
            })
            .map(item => {
                return {
                    ...item,
                    highlightedName: (
                        <this.HighlightedText
                            text={item.DataCardProvider}
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












    renderAllDataCardProviders = ({ item }) => {
        console.log(item)
        return (

            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('dataCardPayments', { name: item.DataCardProvider, Logo: item.Logo, OperatorCode: item.operator_code, Amount: 0, })}

            >

                <View style={styles.TouchableView}>


                    <View style={styles.container1}>
                        <Image source={item.Logo} style={styles.image1} />
                    </View>

                    <View style={{ flex: 4, marginLeft: 20 }}>

                        <Text style={styles.username}>{item.DataCardProvider}</Text>


                    </View>

                </View>
            </TouchableOpacity>
        );
    };


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

                            <Text style={styles.HeadingTitle}> Data Card </Text>


                            <Text style={styles.SubHeadTitle}>Internet Data Recharge or Bill Pay </Text>

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
                                style={[styles.SearchTextStyle, { color: this.props.textColor, }]}
                                value={this.state.searchTerm}
                                onChangeText={text => this.handleSearch(text)}
                                placeholder='Search Data Card Provider' />

                            <View>
                                <Image style={styles.ImageStyle} source={require('../../../../assets/icons/search.png')}></Image>
                            </View>

                        </CardView>


                        <View>
                            <CardViewAutoSlider CardType={'Prepaid'} /></View>

                        <ScrollView>
                            <View style={styles.ViewTwoStyle}>

                                {this.state.RecentVisible &&


                                    <View>

                                        {/* Recent Data Card View  */}

                                        <View style={styles.RecentCardViewStyle}>
                                            <Text style={styles.RecentTextStyle}>{`Recent `}</Text>
                                            <TouchableOpacity
                                                style={styles.RecentTouchableStyle}
                                                onPress={() => this.props.navigation.navigate('billsPaymentHistory', { HistoryMenu: 'Data Card Payment' })}>

                                                <Text style={[styles.RecentTextTwoStyle, { color: this.props.SecondaryColor }]}>{`View History`}</Text>

                                            </TouchableOpacity>
                                        </View>

                                        {
                                            this.state.searchTermAct === 0 ? (
                                                <React.Fragment>
                                                    <View style={styles.flexOne}>
                                                        <FlatList
                                                            style={styles.PaddingBottomTen}
                                                            data={this.DataCardDetails.slice(0, 5)}
                                                            keyExtractor={(item, index) => index.toString()}
                                                            renderItem={this.renderRecentDataCardItem}
                                                        />
                                                    </View>
                                                </React.Fragment>
                                            ) : null
                                        }


                                    </View>

                                }







                                {/* Contacts List View  */}

                                <View style={styles.ContactListView}>
                                    <View style={styles.ContactListSubView}>
                                        <Text style={styles.ContactListText}>{`All Data Card Provider `}</Text>
                                    </View>


                                    <ScrollView>
                                        <View style={styles.ViewTwoStyle}>

                                            <View>
                                                <FlatList
                                                    data={this.state.filteredData}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    renderItem={this.renderAllDataCardProviders}
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

export default connect(mapStateToProps, mapDispatchToProps)(DataCard);


const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
        marginBottom: 5
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
        //width:500


    },
    username: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000'
    },
    mobileNumber: {
        fontSize: 15,
    },
    rechargeAmount: {
        fontSize: 18,
        textAlign: 'right',
        fontWeight: 'bold',
        color: '#686868'
    },
    lastRecharge: {
        fontSize: 12,
        textAlign: 'right',

    },
    logo: {
        width: 50,
        height: 20,
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

    container1: {
        width: 50,
        height: 50,
        borderRadius: 50, // Half of the width and height to make it circular
        overflow: 'hidden',
        elevation: 2, // Set the elevation for the shadow effect
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
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
        paddingBottom: 10
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
             marginTop: 10 },
});
