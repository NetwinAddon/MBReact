import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    FlatList,
    StyleSheet,
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
    config,
} from '../../../App';
import { TextInput } from 'react-native-paper';
import TrasnsperantFixedHeader from '../../../components/TrasnperantFixedHeader';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';
import Arrow from '../../../assets/icons/Vectorarrow.svg';
import DownArrow from '../../../assets/icons/down-arrow.svg'
import { Dialog_SimOperator } from '../../../components/Dialog_SimOperator';
import { Dialog_SelectCircle } from './Dialog_SelectCircle';

class RechargeHistory extends Component {
    constructor(props) {
        super(props);
        this.RechargePlans = [
            {
                RechargeAmount: '151',
                Date: '5th Nov 2023',
                Time: '07:11 PM',
                validity: '27 day',
                Logo: require('../../../assets/icons/AirtelLogo.png'),
                OperatorName: 'Airtel-Prepaid'
            },
            {
                RechargeAmount: '299',
                Date: '30th Dec 2023',
                Time: '08:19 AM',
                validity: '',
                Logo: require('../../../assets/icons/Vi-icon.png'),
                OperatorName: 'Vi-Prepaid'
            },
            {
                RechargeAmount: '666',
                Date: '15th Oct 2023',
                Time: '02:11 PM',
                validity: '',
                Logo: require('../../../assets/icons/Jio-icon.png'),
                OperatorName: 'Jio-Prepaid'
            },
        ];

        this.OperatorList = [
            {
                OperatorName: 'Airtel Prepaid ',
                Logo: require('../../../assets/icons/AirtelLogo.png'),
                operator_code: 'AP',
                service_type: 'Prepaid',
                service_provider: 'CR',
            },
            {
                OperatorName: 'Jio Prepaid',
                Logo: require('../../../assets/icons/Jio-icon.png'),
                operator_code: 'JP',
                service_type: 'Prepaid',
                service_provider: 'CR',
            },
            {
                OperatorName: 'Vi Prepaid',
                Logo: require('../../../assets/icons/Vi-icon.png'),
                operator_code: 'VP',
                service_type: 'Prepaid',
                service_provider: 'CR',
            },
            {
                OperatorName: 'BSNL Prepaid',
                Logo: require('../../../assets/icons/datacard_BSNL.png'),
                operator_code: 'BSNL',
                service_type: 'Prepaid',
                service_provider: 'CR',
            },
            {
                OperatorName: 'MTLN Prepaid',
                Logo: require('../../../assets/icons/datacard_MTNL.png'),
                operator_code: 'MTP',
                service_type: 'Prepaid',
                service_provider: 'CR',
            },
        ];

        this.CircleList = [
            { circle_code: '1', circle_name: 'Andhra Pradesh' },
            { circle_code: '2', circle_name: 'Assam' },
            { circle_code: '3', circle_name: 'Bihar' },
            { circle_code: '4', circle_name: 'Chennai' },
            { circle_code: '5', circle_name: 'Delhi' },
            { circle_code: '6', circle_name: 'Gujarat' },
            { circle_code: '7', circle_name: 'Haryana' },
            { circle_code: '8', circle_name: 'Himachal Pradesh' },
            { circle_code: '9', circle_name: 'Jammu & Kashmir' },
            { circle_code: '24', circle_name: 'Jharkhand' },
            { circle_code: '10', circle_name: 'Karnataka' },
            { circle_code: '11', circle_name: 'Kerala' },
            { circle_code: '12', circle_name: 'Kolkata' },
            { circle_code: '13', circle_name: 'Maharashtra & Goa (except Mumbai)' },
            { circle_code: '14', circle_name: 'Madhya Pradesh & Chhattisgarh' },
            { circle_code: '15', circle_name: 'Mumbai' },
            { circle_code: '16', circle_name: 'North East' },
            { circle_code: '17', circle_name: 'Orissa' },
            { circle_code: '18', circle_name: 'Punjab' },
            { circle_code: '19', circle_name: 'Rajasthan' },
            { circle_code: '20', circle_name: 'Tamil Nadu' },
            { circle_code: '21', circle_name: 'Uttar Pradesh -East' },
            { circle_code: '22', circle_name: 'Uttar Pradesh -West' },
            { circle_code: '23', circle_name: 'West Bengal' },

        ];
        this.state = {
            Landline_Name: this.props.route.params.OperatorName,
            Landline_Icon: this.props.route.params.Logo,
            Landline_OperatorCode: this.props.route.params.OperatorCode,
            Selected_CircleID: this.props.route.params.Circle_code,
            Selected_CircleName: this.props.route.params.CircleName,
            CircleName: 'Select Circle',
            isCircleVisible: false,
            isModalVisible: false,
            isStateModalVisible: false,
            selectedValue: 'option1',
            isOperatorVisible: false,
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

    renderPlansItem = ({ item }) => (
        <CardView
            cardElevation={3}
            cardMaxElevation={5}
            cornerRadius={15}
            style={styles.renderPlanTouchable}>
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('rechargePay', {
                    RechargeAmount: item.RechargeAmount,
                    UserName: this.props.route.params.name,
                    MobileNumber: this.props.route.params.mobno,
                    accList: this.props.route.params.AccountList,
                    Logo: this.state.Landline_Icon,
                    OperatorName: this.state.Landline_Name,
                    CircleName: this.state.Selected_CircleName,
                    Circle_code: this.state.Selected_CircleID
                })}>
                <View style={styles.container}>
                    <View style={styles.rechargeAmountView}>
                        <Text style={styles.rechargeAmountText}>{strings.rupee}{item.RechargeAmount}</Text>
                    </View>
                    <View style={[styles.textContainer, { paddingTop: 10 }]}>
                        <Text style={styles.dateText}>Date: {item.Date}
                        </Text>
                        <Text style={styles.timeText}>Time: {item.Time}</Text>
                        {item.validity !== '' ?
                            <Text style={styles.expireInDaysText}>Expire in {item.validity} Days</Text> : null}
                    </View>
                    <View >
                        <Arrow style={styles.arrowStyle}></Arrow>
                    </View>
                </View>
            </TouchableOpacity>
        </CardView>
    );

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

    onSelectCircle = (item) => {
        this.setState({ isCircleVisible: false, });
        if (item.circle_name === null || item.circle_name === undefined || item.circle_name.trim() === "") {

        }
        else {
            this.setState({ Selected_CircleID: item.circle_code, Selected_CircleName: item.circle_name, CircleName: item.circle_name })
        }
    }
    onSelectOperator = (item) => {
        console.log(item)
        this.setState({ isOperatorVisible: false, isValidOpr: true });


        if (item === undefined) { }
        else {
            if (item.OperatorName === null || item.OperatorName === undefined || item.OperatorName.trim() === "") {

            }
            else {
                this.setState({ Landline_Name: item.OperatorName, Landline_Icon: item.Logo, Landline_OperatorCode: item.operator_code })
            }
        }

    }

    render() {
        return (
            <View style={styles.mainView}>
                <ImageBackground style={styles.mainView} source={this.bgImage} resizeMode='cover'>
                    <TrasnsperantFixedHeader backAction={() => this.onBackAction()} />
                    <View style={styles.lableHeader}>
                        <View style={styles.lableHeaderView}>
                            <Text style={styles.prepaidTitle}>Prepaid</Text>
                            <Text style={styles.prepaidDescription}>Select Your Recharge Plan</Text>
                        </View>
                    </View>
                    <View style={styles.subMainView}>
                        <View style={styles.userNameMainView}>
                            <View style={styles.textContainer}>
                                <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">{this.props.route.params.name}</Text>
                                <Text style={styles.mobileNumber}>{this.props.route.params.mobno}</Text>
                            </View>
                            <View style={styles.simIcon}>
                                <Image style={styles.landLineIcon} source={this.state.Landline_Icon} />
                            </View>
                        </View>
                        <View style={styles.landLineNameView}>
                            <TouchableOpacity
                                style={styles.landLineNameTouchable}
                                onPress={() => this.setState({ isOperatorVisible: true })}>
                                <Text style={styles.landLineNameText}>{this.state.Landline_Name}</Text>
                                <DownArrow height={12} width={12} color={this.props.themeColor} />
                            </TouchableOpacity>
                            {Dialog_SimOperator(
                                this.state.isOperatorVisible,
                                this.OperatorList,
                                this.onSelectOperator,
                                this.state.DataCard_Name,
                            )}
                            <TouchableOpacity
                                style={styles.selectCircleTouchable}
                                onPress={() => this.setState({ isCircleVisible: true, })}>
                                <Text style={styles.selectCircleText} numberOfLines={1} ellipsizeMode="tail">{this.state.Selected_CircleName}</Text>
                                <DownArrow height={12} width={12} color={this.props.themeColor} />
                            </TouchableOpacity>
                            {Dialog_SelectCircle(
                                this.state.isCircleVisible,
                                this.CircleList,
                                this.onSelectCircle,
                                this.state.Selected_CircleName,
                            )}
                        </View>
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={6}
                            style={styles.searchCard}>
                            <TextInput
                                maxLength={10}
                                style={[styles.searchTextInput, { color: this.props.textColor }]}
                                value={this.state.searchTerm}
                                onChangeText={(searchTerm) => {
                                    this.setState({ searchTerm });
                                    this.setState({ searchTermAct: 1 });
                                }}
                                placeholder='Search Recharge Plans' />
                            <View>
                                <Image style={styles.searchImg} source={require('../../../assets/icons/search.png')}></Image>
                            </View>
                        </CardView>
                        <ScrollView>
                            <View style={styles.scrollInnerContainer}>

                                <View style={styles.scrollInnerContainerTwo}>
                                    <View style={styles.mainView}>
                                        <Text style={styles.rechargeHistory}>{'Recharge History '}</Text></View>
                                    <TouchableOpacity style={styles.mainView}>
                                        <Text style={styles.browsOtherPlan}
                                            onPress={() => this.props.navigation.navigate('rechargeOffers', {
                                                name: this.props.route.params.name,
                                                mobno: this.props.route.params.mobno,
                                                OperatorName: this.props.route.params.OperatorName,
                                                operator_code: this.props.route.params.OperatorName,
                                                Logo: this.props.route.params.Logo,
                                            })}>{'Brows Other Plans'}</Text>
                                    </TouchableOpacity>
                                </View>
                                {
                                    this.state.searchTermAct === 0 ? (
                                        <React.Fragment>
                                            <View style={[styles.mainView, { marginTop: 5 }]}>
                                                <FlatList
                                                    data={this.RechargePlans}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    renderItem={this.renderPlansItem}
                                                />
                                            </View>
                                        </React.Fragment>
                                    ) : null
                                }
                            </View>
                        </ScrollView>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RechargeHistory);


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        width: width - 60,
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
        flex: 2,
    },
    username: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000',
        width: '90%'
    },
    mobileNumber: {
        fontSize: 16,
    },
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
        marginBottom: 15,
    },
    prepaidTitle:
    {
        fontSize: 22,
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: colors.white,
    },
    prepaidDescription:
    {
        fontSize: 15,
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
    userNameMainView:
    {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        width: width - 60,
        marginTop: 20,
    },
    landLineNameView:
    {
        width: width - 60,
        height: 30,
        marginBottom: 10,
        flexDirection: 'row'
    },
    landLineNameTouchable:
    {
        borderRadius: 15,
        backgroundColor: "#fff",
        borderStyle: "solid",
        borderColor: "#d2d2d2",
        borderWidth: 0.5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    landLineNameText:
    {
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#000",
        textAlign: "left",
        marginRight: 5
    },
    landLineIcon:
    {
        width: 50,
        height: 50
    },
    selectCircleTouchable:
    {
        borderRadius: 15,
        backgroundColor: "#fff",
        borderStyle: "solid",
        borderColor: "#d2d2d2",
        borderWidth: 0.5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    selectCircleText:
    {
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#000",
        textAlign: "left",
        marginRight: 5,
    },
    searchCard:
    {
        height: 48,
        backgroundColor: 'white',
        width: width - 60,
        alignItems: 'center',
        marginTop: 5,
        flexDirection: 'row',
        marginBottom: 8,
    },
    searchTextInput:
    {
        flex: 0.95,
        height: 50,
        backgroundColor: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 17,
    },
    searchImg:
    {
        height: 23,
        width: 23
    },
    scrollInnerContainer:
    {
        alignItems: 'center'
    },
    scrollInnerContainerTwo:
    {
        flexDirection: 'row',
        width: width - 60
    },
    rechargeHistory:
    {
        textAlign: 'left'
    },
    browsOtherPlan:
    {
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#ff5936",
        textAlign: "right"
    },
    renderPlanTouchable:
    {
        height: 70,
        backgroundColor: 'white',
        width: width - 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 8,
        marginLeft: 5,
        marginRight: 5
    },
    rechargeAmountView:
    {
        justifyContent: 'center',
        marginRight: 35
    },
    rechargeAmountText:
    {
        fontSize: 22,
        fontWeight: "700",
        fontFamily: "SF UI Display",
        color: "#1f3c66",
        textAlign: "right"
    },
    dateText:
    {
        fontSize: 14,
        color: '#252525'
    },
    timeText:
    {
        fontSize: 14,
        color: '#252525',
        fontWeight: "500",
        fontFamily: "SF UI Display",
        textAlign: "left",
        opacity: 0.8
    },
    expireInDaysText:
    {
        fontSize: 12,
        color: "#ff5936"
    },
    arrowStyle:
    {
        flex: 1,
        width: "100%",
        height: 10,
        marginRight: 10
    }
});
