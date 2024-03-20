import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    Keyboard,
    BackHandler
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
    height,
    sendData,
    RenderLoader,

} from '../../../App';

import CardView from 'react-native-cardview'
import TrasnsperantFixedHeader from '../../../components/TrasnperantFixedHeader';
import Deposit from '../../../assets/icons/deposited.svg'
import Withdraw from '../../../assets/icons/withdraw.svg'
import Filter from '../../../assets/icons/Filter.svg'
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment'


import Download from '../../../assets/icons/fi-rr-download.svg'
import Constants from '../../../common/Constants';
import APIUrlConstants from '../../../common/APIUrlConstants';
import { parse } from '@babel/core';
import { RFValue } from "react-native-responsive-fontsize";
import Colors from '../../../common/Colors';

var OpeningBalance = 0;

class MpassBook extends Component {
    constructor(props) {
        super(props);

        this.accDetails = props.route.params

        this.Balance = Constants.Selected_BALANCE
        this.AcNO = Constants.Selected_AC_NO
        this.AcType = Constants.Selected_ACTYPE.toUpperCase()
        this.GmstCode = Constants.Selected_GMST_CODE
        this.AcMastCode = Constants.Selected_ACMASTCODE

        this.LoadMore = []
        this.Temp = []

        console.log("Balance:-" + this.Balance);



        this.state = {
            initialDate: false,
            showDatePicker: false,
            searchTerm: '',
            filteredData: [],
            start_count: 0,
            end_count: 20,
            AccountDetails: '',

        };

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    componentDidMount() {

        this.GetM_PassbookStatementApi()
    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    onBackAction() {
        navigation.goBack(this)
    }

    handleBackButtonClick() {
        navigation.goBack(this)
        return true;
    }

    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg3

    toDownload() {
        navigation.navigate(this, 'myAccountDownloadStatement', this.accDetails)
    }

    filterData(searchTerm) {
        const filteredData = [];
        // Iterate over each section in the data
        this.data.forEach(section => {
            const filteredSectionData = section.data.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (filteredSectionData.length > 0) {
                // Add the section with filtered data to the filteredData array
                filteredData.push({ ...section, data: filteredSectionData });
            }
        });
        return filteredData;
    };

    handleSearch = searchTerm => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        // Filter the data based on the search term
        const filteredData = this.LoadMore
            .filter(item => {
                const lowerCaseName = item.PRTCLS.toLowerCase();
                return lowerCaseName.includes(lowerCaseSearchTerm);
            })
            .map(item => {
                return {
                    ...item,
                    highlightedName: (
                        <this.HighlightedText
                            text={item.PRTCLS}
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

    renderFooter = () => {
        return (
            <TouchableOpacity
                style={{
                    marginTop: 15,
                    marginBottom: 15,
                    height: 40,
                    width: width - 50,
                    alignItems: 'center',
                    backgroundColor: 'white',
                    // marginTop: 20,
                    justifyContent: 'center',
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: '#8bb9dc'

                }}
                onPress={() => {
                    if (this.state.filteredData != null && this, this.state.filteredData != '') // DAA search wrong input then load mode option is not working and list is empty
                    {
                        this.LoadMoreOnPress()
                    }

                }}
            ><Text style={{
                color: 'black',
                fontFamily: strings.fontMedium,
                fontSize: RFValue(12),
            }}>Load More</Text></TouchableOpacity>
        );
    };



    LoadMoreOnPress = () => {

        //increment next value by 30 in load more press
        this.setState((prevState) => ({

            start_count: prevState.end_count,
            end_count: prevState.end_count + 20,


        }), () => {
            console.log("start ", this.state.start_count)
            console.log("end ", this.state.end_count)
            this.GetM_PassbookStatementApi()
        });


    }


    // renderListItem = ({ item }) => {
    //     const { filteredData } = this.state;

    //     return (
    //         <View style={{
    //             flexDirection: 'row',
    //             alignItems: 'center', marginVertical: 10
    //         }}>
    //             {item.DRCR === ('TO') ?
    //                 //    uparrow
    //                 <View style={{
    //                     height: 36,
    //                     width: 36,
    //                     borderRadius: 36 / 2,
    //                     backgroundColor: "#eb5757" + '1A',
    //                     alignItems: 'center',
    //                     justifyContent: 'center',
    //                     // marginTop: 5,
    //                     // marginBottom: 5
    //                 }}>
    //                     <Withdraw height={16} width={16} color={'#eb5757'} />
    //                 </View>

    //                 :
    //                 // downArrow
    //                 <View style={{
    //                     height: 36,
    //                     width: 36,
    //                     borderRadius: 36 / 2,
    //                     backgroundColor: "#27ae60" + '1A',
    //                     alignItems: 'center',
    //                     justifyContent: 'center',
    //                     // marginTop: 5,
    //                     // marginBottom: 5
    //                 }}>
    //                     <Deposit height={16} width={16} color={'#27ae60'} />
    //                 </View>

    //             }
    //             <View
    //                 style={{
    //                     flex: 1,
    //                     flexDirection: 'row',
    //                     justifyContent: 'space-between',

    //                 }}
    //             >

    //                 <View
    //                     style={{
    //                         marginLeft: 5,
    //                         padding: 2,
    //                         flex: 0.70
    //                     }}
    //                 >
    //                     <Text
    //                         style={{
    //                             fontFamily: strings.fontMedium,
    //                             fontSize: RFValue(12),
    //                             color: 'black'
    //                         }}
    //                         numberOfLines={1}
    //                     >{item.PRTCLS}</Text>
    //                     <Text
    //                         style={{
    //                             fontFamily: strings.fontRegular,
    //                             fontSize: RFValue(12),
    //                             color: '#929CAC'
    //                         }}
    //                     > {moment(item.TDATE).format("DD MMM YYYY")}</Text>
    //                 </View>

    //                 <View
    //                     style={{
    //                         flex: 0.30
    //                     }}
    //                 >
    //                     <Text style={{
    //                         // flex: 1,
    //                         textAlign: 'right',
    //                         paddingTop: 5,
    //                         fontFamily: strings.fontRegular,
    //                         fontSize: RFValue(12),

    //                         color: item.DRCR === ('TO') ? '#EB5757' : '#27AE60'
    //                     }}
    //                     numberOfLines={1}
    //                     >{item.DRCR === 'TO' ? "₹ " + item.DEBIT+" Dr" : "₹ " + item.CREDIT+" Cr"}</Text>

    //                     <Text style={{
    //                         textAlign: 'right',
    //                         fontFamily: strings.fontRegular,
    //                         fontSize: RFValue(12),
    //                         color: 'black'
    //                     }}
    //                     numberOfLines={1}
    //                     >Bal: {item.BALANCE.startsWith('-') ? `${Math.abs(item.BALANCE)} Cr` :`${Math.abs(item.BALANCE)} Dr`}</Text>
    //                 </View>


    //             </View>
    //         </View>
    //     );
    // };


    renderListItem = ({ item }) => {
        const { filteredData } = this.state;

        return (
            <View style={styles.MainView}>

                {item.DRCR === ('TO') ?
                    <View style={styles.WithDrawIcon}>
                        <Withdraw height={16} width={16} color={'#eb5757'} />
                    </View>
                    :
                    <View style={styles.DeposityIcon}>

                        <Deposit height={16} width={16} color={'#27ae60'} />
                    </View>

                }
  

                <View style={styles.SubMainView}>

                    <View style={styles.InnerLayputView}>

                        <Text
                            style={styles.PerticularStyle}
                            numberOfLines={1}>{item.PRTCLS}</Text>

                        <Text style={[styles.DrCrStyle, { color: item.DRCR === ('TO') ? '#EB5757' : '#27AE60' }]}
                            numberOfLines={1}
                        >{item.DRCR === 'TO' ? "₹ " + item.DEBIT + " Dr" : "₹ " + item.CREDIT + " Cr"}</Text>


                    </View>

                    <View style={styles.InnerLayputView}>


                        <Text style={styles.DateStyle}> {moment(item.TDATE).format("DD MMM YYYY")}</Text>


                        <Text style={styles.BalanceStyle}
                            numberOfLines={1}>Bal: {item.BALANCE.startsWith('-') ? `${Math.abs(item.BALANCE)} Cr` : `${Math.abs(item.BALANCE)} Dr`}</Text>

                    </View>

                </View>

            </View>
        );
    };

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
        console.log('hellooooo')
    }


    GetM_PassbookStatementApi() {

        const Headers = APIUrlConstants.Headers("GETPASBKSTAT");


        const Body =
        {
            PARACNT: "4",
            PARA1_TYP: "STR",
            PARA1_VAL: Constants.GMST_CODE,
            PARA2_TYP: "STR",
            PARA2_VAL: "{\"TXTACCNO\":\"" + this.AcNO + "\",\"TXTGLHEADID\":\"" + this.AcMastCode + "\",\"TXTSTARTROW\":\"" + this.state.start_count + "\",\"TXTENDROW\":\"" + this.state.end_count + "\"}",
            PARA3_TYP: "STR",
            PARA3_VAL: Constants.BankCode,
            PARA4_TYP: "STR",
            PARA4_VAL: Constants.SecretKey,
        }

        console.log("M-PassBook Statement URL:- " + APIUrlConstants.BASE_URL + "\n");

        console.log("M-PassBook Statement Body:- " + JSON.stringify(Body) + "\n");

        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            this.M_PassbookApiCallback)

    }


    // M_PassbookApiCallback = async (obj, response) => 
    // {

    //     console.log("M-PassBook Statement Body:- " + JSON.stringify(response));


    //     let Resp = response.Acdtls
    //     this.AccountDetails = response.Acdtls

    //     var length = Resp.length - 1

    //     var MainBalance = 0
    //     // var OpeningBalance = 0

    //     if (Resp.length > 0) 
    //     {

    //         this.Temp = [];


    //         Resp.map((item) => {

    //             this.Temp.push(JSON.parse(item))

    //         })

    //         console.log("----------" + JSON.stringify(this.Temp))

    //         if (this.state.start_count === 0) {

    //             const bal = parseFloat(this.Temp[0].BALANCE)

    //             MainBalance = MainBalance + bal

    //             OpeningBalance = MainBalance

    //             console.log("----OpeningBalance BALANCE--- " + OpeningBalance)

    //         }

    //         for (let j = length; j >= 0; j--) {


    //             if (j === 0 && this.state.start_count === 0) {
    //             }
    //             else {

    //                 const Credit = parseFloat(this.Temp[j].CREDIT)

    //                 const Debit = parseFloat(this.Temp[j].DEBIT)

    //                 OpeningBalance = OpeningBalance - Credit + Debit

    //                 let formattedNumber = OpeningBalance.toFixed(2)

    //                 console.log('Equation:- Credit:- ' + Credit + ' Debit:- ' + Debit + ' MainBalance ' + OpeningBalance)

    //                 this.Temp[j].BALANCE = formattedNumber


    //             }
    //         }


    //         if (this.state.start_count === 0) {

    //             const firstElement = this.Temp.shift();

    //             this.Temp.push(firstElement);

    //             this.LoadMore = this.Temp
    //         }
    //         else{

    //             this.LoadMore = this.LoadMore.concat(this.Temp.reverse()); 
    //         }

    //         OpeningBalance = this.Temp[this.Temp.length-2].BALANCE
    //         console.log("---- OpeningBalance --- " + OpeningBalance)


    //         // this.LoadMore = this.Temp

    //         this.setState({ filteredData: this.LoadMore })

    //     }

    // }

    M_PassbookApiCallback = async (obj, response) => {

        console.log("M-PassBook Statement Body:- " + JSON.stringify(response));


        let Resp = response.Acdtls
        this.AccountDetails = response.Acdtls
        // let mainArry = Resp.map((jsonStr) => JSON.parse(jsonStr));

        // console.log("M PassBook Resposnse:- ", Resp)

        if (Resp.length > 0) {

            Resp.map((item) => {
                this.state.filteredData.push(JSON.parse(item))
                this.LoadMore.push(JSON.parse(item))

            })

        }

    }


    render() {

        return (
            <View style={{ flex: 1 }}>

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
                            marginBottom: 10,
                        }}>
                            <Text style={{
                                fontSize: RFValue(20),
                                color: 'black',
                                textAlign: 'left',
                                fontFamily: strings.fontBold,
                                color: colors.white,
                            }}>{strings.mPassbook}</Text>

                            <Text style={{
                                fontSize: RFValue(13),
                                color: 'black',
                                textAlign: 'left',
                                fontFamily: strings.fontMedium,
                                color: colors.white,
                            }}>{strings.mpassSubStr}
                            </Text>

                        </View>
                    </View>

                    <View style={{
                        flex: 0.85,
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,

                    }}>

                        <View style={{
                            marginTop: -30,

                        }}>
                            {/* profile card */}
                            <CardView
                                cardElevation={3}
                                cardMaxElevation={3}
                                cornerRadius={30}
                                style={{
                                    backgroundColor: this.props.PrimaryColor,
                                    height: 130, width: width - 40,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <View style={{
                                    // justifyContent: 'space-between',
                                    alignItems: 'center',
                                    height: 140,
                                    width: width - 60,
                                    flexDirection: 'row',
                                }}
                                >
                                    <View style={{
                                        flex: 0.5,
                                        justifyContent: 'center',
                                        padding: 10

                                    }}>
                                        <View
                                            style={{
                                                flex: 0.5,
                                                // backgroundColor: 'red',
                                                justifyContent: 'center',
                                                // alignItems: 'center'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: '#7E8CA0',
                                                    fontFamily: strings.fontRegular,
                                                    fontSize: RFValue(12)
                                                }}
                                            >{strings.fullName}</Text>
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontFamily: strings.fontRegular,
                                                    fontSize: RFValue(14)
                                                }}
                                            >{Constants.Name.toLocaleUpperCase()}</Text>
                                        </View>

                                        <View
                                            style={{
                                                flex: 0.5,
                                                // backgroundColor: 'red',
                                                justifyContent: 'center',
                                                // alignItems: 'center'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: '#7E8CA0',
                                                    fontFamily: strings.fontRegular,
                                                    fontSize: RFValue(12)
                                                }}
                                            >{strings.AccNumber}</Text>
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontFamily: strings.fontRegular,
                                                    fontSize: RFValue(14)
                                                }}
                                            >{this.AcNO}</Text>
                                        </View>

                                    </View>

                                    <View
                                        style={{
                                            flex: 0.5,
                                            justifyContent: 'center',
                                            padding: 10
                                        }}
                                    >
                                        <View
                                            style={{
                                                flex: 0.5,
                                                // backgroundColor: 'red',
                                                justifyContent: 'center',
                                                // alignItems: 'center'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: '#7E8CA0',
                                                    fontFamily: strings.fontRegular,
                                                    fontSize: RFValue(12)
                                                }}
                                            >{strings.AvailBal}</Text>
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontFamily: strings.fontRegular,
                                                    fontSize: RFValue(14)
                                                }}
                                            >
                                                {this.Balance.startsWith('-') ? ("₹ " + this.Balance.replace('-', '') + " Cr") : ("₹ " + this.Balance + " Dr")}
                                            </Text>
                                        </View>

                                        <View
                                            style={{
                                                flex: 0.5,
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: '#7E8CA0',
                                                    fontFamily: strings.fontRegular,
                                                    fontSize: RFValue(12)
                                                }}
                                            >{strings.accType}</Text>
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontFamily: strings.fontRegular,
                                                    fontSize: RFValue(14)
                                                }}
                                            >{this.AcType}</Text>
                                        </View>

                                    </View>

                                </View>
                            </CardView>
                        </View>

                        {/* download and my Account */}
                        <View
                            style={{
                                height: 70,
                                width: width - 80,
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#e4e7ed',
                                marginTop: -35,
                                zIndex: -1,
                                borderBottomEndRadius: 15,
                                borderBottomLeftRadius: 15

                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                }}

                            >
                                {/* mini statement */}

                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        height: 70,
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        paddingBottom: 12

                                    }}

                                    onPress={() => this.toDownload()}

                                >
                                    <View
                                        style={{
                                            height: 15,
                                            width: 15,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            //   backgroundColor : 'red',
                                            marginRight: 3
                                        }}
                                    >
                                        <Download height={12} width={12} fill={this.props.SecondaryColor} />

                                    </View>
                                    <Text
                                        style={{
                                            fontSize: RFValue(12),
                                            color: '#686868',
                                            fontFamily: strings.fontMedium


                                        }}
                                    >{strings.downloadStatemant}</Text>
                                </TouchableOpacity>


                            </View>
                        </View>

                        {/* Filter */}
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={6}
                            style={{
                                // flex: 1,
                                height: 48,
                                backgroundColor: 'white',
                                width: width - 60,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 10,
                                flexDirection: 'row',
                            }}
                        >
                            <TextInput
                                style={{
                                    paddingLeft: 10,
                                    flex: 0.85,
                                    height: 48,
                                    backgroundColor: 'white',
                                    fontFamily: strings.fontRegular,
                                    fontSize: RFValue(15),
                                    color: this.props.PrimaryColor,
                                }}

                                value={this.state.searchTerm}
                                // onChangeText={searchTerm => {
                                //     this.setState({ searchTerm });
                                //     console.log("searchTerm", searchTerm)
                                // }}
                                onChangeText={text => this.handleSearch(text)}

                                placeholder='Enter Keyword'
                                placeholderTextColor= '#808080'
                            >
                            </TextInput>
                            <TouchableOpacity
                                style={{
                                    flex: 0.15,
                                    height: 45,
                                    margin: 2,
                                    backgroundColor: this.props.SecondaryColor,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 5
                                }}
                                onPress={() => {
                                    // Keyboard.dismiss()
                                    this.handleSearch(this.state.searchTerm)

                                }}
                            >
                                <Filter height={20} width={20} color={'white'} />
                            </TouchableOpacity>
                        </CardView >

                        {/* Account history */}



                        <FlatList
                            data={this.state.filteredData}
                            style={{
                                marginTop: 15,
                                width: width - 40
                            }}
                            ItemSeparatorComponent={() => {
                                return (
                                    // Flat List Item Separator
                                    <View
                                        style={{
                                            height: 0.5,
                                            width: '90%',
                                            backgroundColor: colors.backgroundColor,
                                            alignSelf: 'center'
                                        }}
                                    />
                                );
                            }}

                            contentContainerStyle={{ justifyContent: 'center' }}
                            renderSectionHeader={({ section: { title } }) => (
                                <Text style={{
                                    color: '#252525',
                                    padding: 10,
                                    paddingLeft: 2,
                                    fontSize: RFValue(12),
                                    fontFamily: strings.fontMedium
                                }}>{title}</Text>
                            )}
                            renderItem={this.renderListItem}

                            ListFooterComponent={this.renderFooter} //Load More
                        />


                    </View >

                </ImageBackground >
                <RenderLoader />
            </View >


        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MpassBook);



const styles = StyleSheet.create({

    SubMainView:
    {
        flex: 1,
        marginLeft: 10
    },

    InnerLayputView:
    {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    PerticularStyle:
    {
        fontFamily: strings.fontMedium,
        fontSize: RFValue(12),
        color: 'black',
        flex: 2.4,
       
    },

    DrCrStyle:
    {
        textAlign: 'right',
        paddingTop: 5,
        fontFamily: strings.fontRegular,
        fontSize: RFValue(12),
        flex: 1,
    },

    DateStyle:
    {
        fontFamily: strings.fontRegular,
        fontSize: RFValue(12),
        color: '#929CAC'
    },

    BalanceStyle:
    {
        textAlign: 'right',
        fontFamily: strings.fontRegular,
        fontSize: RFValue(12),
        color: 'black'
    },
    DeposityIcon:
    {
        height: 36,
        width: 36,
        borderRadius: 36 / 2,
        backgroundColor: "#27ae60" + '1A',
        alignItems: 'center',
        justifyContent: 'center',
    },

    WithDrawIcon:
    {
        height: 36,
        width: 36,
        borderRadius: 36 / 2,
        backgroundColor: "#eb5757" + '1A',
        alignItems: 'center',
        justifyContent: 'center',
    },

    MainView:
    {
        flexDirection: 'row',
        alignItems: 'center', 
        marginVertical: 10
    }




})