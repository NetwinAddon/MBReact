import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    BackHandler,
} from 'react-native';
import Footer from '../../../../assets/icons/footer.svg';
import DeleteBeneficiaryIcon from '../../../../assets/icons/user-xmark.svg'
import AddBeneficiaryIcon from '../../../../assets/icons/user-add.svg'
import VerifyBeneficiaryIcon from '../../../../assets/icons/user-check.svg'
import EditBeneficiaryIcon from '../../../../assets/icons/user-pen.svg'
//import { TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview'
import QuickTransfer from '../../../../assets/icons/dashboardIcons/ico-24x7-quick-transfer.svg';
import HistoryIocn from '../../../../assets/icons/dashboardIcons/ico-history.svg'
import TrasnperantFixedHeader from '../../../../components/TrasnperantFixedHeader';
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
} from '../../../../App';

class NeftMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accounList: props.route.params.dashboardArray,
        };

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    }
    componentDidMount() {

    }
    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg


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

    toOwnAccTransfer() {
        navigation.navigate(this, 'ownAccTransferScreen')
        console.log('hellooooo')
    }

    History()
    {
      this.props.navigation.navigate('NeftTransHistory', { accList: this.state.accounList, from: 'Dashboard' })   
    }


    render() {
        return (
            <View style={{ flex: 1 }}>

                <ImageBackground style={{ flex: 1 }}
                    source={this.bgImage}
                    resizeMode='cover'
                >
                    <TrasnperantFixedHeader
                        backAction={() => this.onBackAction()}
                    />

                    <View style={{ flex: 0.2 }}>
                        <View style={{
                            marginLeft: 25,
                            marginBottom: 10,
                        }}>
                            <Text style={{
                                fontSize: 20,
                                color: 'black',
                                textAlign: 'left',
                                fontFamily: strings.fontBold,
                                color: colors.white,
                            }}>NEFT
                            </Text>

                            <Text style={{
                                fontSize: 15,
                                color: 'black',
                                textAlign: 'left',
                                fontFamily: strings.fontMedium,
                                color: colors.white,
                            }}>Fund Transfer
                            </Text>

                        </View>
                    </View>

                    <View style={{
                        flex: 0.7,
                        alignItems: 'center',

                        backgroundColor: 'white',
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,

                    }}>
                        <View style={{
                            marginLeft: 30,
                            marginRight: 35,
                            flexDirection: 'row',
                            marginTop: -50,
                        }}>

                            {/* NEFT Fund Transfer */}

                            <CardView
                                cardElevation={3}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={{
                                    backgroundColor: 'white',
                                    height: 180, width: 120,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    // 
                                }}
                            >
                                <TouchableOpacity style={{
                                    // justifyContent: 'space-between',
                                    alignItems: 'center',
                                    height: 180, width: 120,
                                }}
                                    onPress={() => {
                                        navigation.navigate(this, 'NeftTransfer', { accList: this.state.accounList, from: 'Dashboard' })

                                    }}
                                    activeOpacity={0.5}
                                >
                                    <View style={{
                                        height: 70,
                                        width: 70,
                                        borderRadius: 35,
                                        backgroundColor: this.props.SecondaryColor + '1A',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: 20
                                    }}>

                                        <QuickTransfer height={21} width={21} color={this.props.SecondaryColor} /></View>
                                    <Text style={{

                                        fontSize: 12,
                                        textAlign: 'center',
                                        color: this.props.textColor,
                                        fontFamily: strings.fontMedium,
                                        // backgroundColor :'red'
                                    }}>
                                        NEFT Fund
                                        Transfer</Text>

                                </TouchableOpacity>
                            </CardView>


                            {/* Add Beneficiary */}
                            <CardView
                                cardElevation={3}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={{
                                    marginLeft: 25,
                                    backgroundColor: 'white',
                                    height: 180, width: 120,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    // 
                                }}
                            >
                                <TouchableOpacity style={{
                                    // justifyContent: 'space-between',
                                    alignItems: 'center',
                                    height: 180, width: 120,


                                }}
                                    onPress={() => {
                                        navigation.navigate(this, 'NeftAddBeneficiary', { accList: this.state.accounList, from: 'Dashboard' })

                                    }}
                                    activeOpacity={0.5}
                                >
                                    <View style={{
                                        height: 70,
                                        width: 70,
                                        borderRadius: 35,
                                        backgroundColor: this.props.SecondaryColor + '1A',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: 20
                                    }}>

                                        <AddBeneficiaryIcon height={21} width={21} color={this.props.SecondaryColor} /></View>
                                    <Text style={{

                                        fontSize: 12,
                                        textAlign: 'center',
                                        color: this.props.textColor,
                                        fontFamily: strings.fontMedium,
                                        // backgroundColor :'red'
                                    }}>
                                        {strings.addBeneficiary}</Text>

                                </TouchableOpacity>
                            </CardView>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 25,

                        }}>
                            <CardView
                                cardElevation={3}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={{
                                    backgroundColor: 'white',
                                    height: 180, width: 120,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    // 
                                }}
                            >
                                <TouchableOpacity style={{
                                    alignItems: 'center',
                                    height: 180, width: 120,
                                }}
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        navigation.navigate(this, 'NeftVerifyBeneficiary', { accList: this.state.accounList, from: 'Dashboard' })
                                    }}
                                >
                                    <View style={{
                                        height: 70,
                                        width: 70,
                                        borderRadius: 35,
                                        backgroundColor: this.props.SecondaryColor + '1A',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: 20
                                    }}>

                                        <VerifyBeneficiaryIcon height={21} width={21} color={this.props.SecondaryColor} /></View>
                                    <Text style={{
                                        fontSize: 12,
                                        textAlign: 'center',
                                        color: this.props.textColor,
                                        fontFamily: strings.fontMedium,
                                        // backgroundColor :'red'
                                    }}>
                                        {strings.verifyBeneficiary}</Text>

                                </TouchableOpacity>
                            </CardView>

                            <CardView
                                cardElevation={3}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={{
                                    marginLeft: 25,
                                    backgroundColor: 'white',
                                    height: 180, width: 120,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    // 
                                }}
                            >
                                <TouchableOpacity style={{
                                    // justifyContent: 'space-between',
                                    alignItems: 'center',
                                    height: 180, width: 120,
                                }}
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        navigation.navigate(this, 'NeftDeleteBeneficiary', { accList: this.state.accounList, from: 'Dashboard' })
                                    }}
                                >
                                    <View style={{
                                        height: 70,
                                        width: 70,
                                        borderRadius: 35,
                                        backgroundColor: this.props.SecondaryColor + '1A',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: 20
                                    }}>

                                        <DeleteBeneficiaryIcon height={21} width={21} color={this.props.SecondaryColor} /></View>
                                    <Text style={{

                                        fontSize: 12,
                                        textAlign: 'center',
                                        color: this.props.textColor,
                                        fontFamily: strings.fontMedium,
                                        // backgroundColor :'red'
                                    }}>
                                        {strings.closeBeneficiary}</Text>
                                </TouchableOpacity>
                            </CardView>
                        </View>


                        {/* History Button */}

                        <TouchableOpacity
                            onPress={() => { this.History() }}>

                            <View style={{ marginTop: 37, height: 63, width: 184, backgroundColor: this.props.SecondaryColor, borderRadius: 50, justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                    <HistoryIocn height={25} width={25} color={'white'} />
                                    <Text style={{
                                        marginLeft: 10,
                                        fontSize: 14,
                                        textAlign: 'center',
                                        color: 'white',
                                        fontFamily: strings.fontBold,
                                        fontWeight: '700',
                                        alignSelf: 'center'
                                        // backgroundColor :'red'
                                    }}>
                                        History</Text>
                                </View>
                            </View>

                        </TouchableOpacity>



                        <View
                            style={{
                                flex: 1,

                                width: width,
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 5,
                                // backgroundColor : 'red'
                            }}
                        >

                            {/* scan and pay */}
                            {/* <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={30}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                            <View style={{
                                // flex: 1,
                                backgroundColor: this.props.themeColor,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 18,
                                borderRadius : Platform.OS == 'ios' ? 30 : 0,
                            }}>

                                <View>
                                    <QRCodeIcon height={25} width={25} />
                                </View>

                                <Text style={{
                                    fontSize: 15,
                                    color: 'black',
                                    textAlign: 'center',
                                    fontFamily: strings.fontBold,
                                    color: colors.white,
                                    paddingHorizontal: 8,
                                }}>{strings.strScanAndPay}
                                </Text>

                            </View>
                        </CardView> */}
                        </View>
                    </View>
                    <View style={{
                        flex: 0.1,
                        backgroundColor: 'white',
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }}>


                        <View style={{ alignItems: 'flex-end', }}>
                            <Footer height={70} width={300} />
                        </View>
                    </View>

                </ImageBackground>

            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NeftMenu);
