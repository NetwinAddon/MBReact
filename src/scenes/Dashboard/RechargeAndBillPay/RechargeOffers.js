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
import Arrow from '../../../assets/icons/Vectorarrow.svg';
import TrasnsperantFixedHeader from '../../../components/TrasnperantFixedHeader';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';
import Contacts from 'react-native-contacts';
import Svg from 'react-native-svg';
import { Path } from 'react-native-svg';
import { Dialog_SimOperator } from '../../../components/Dialog_SimOperator';
import Snackbar from 'react-native-snackbar';
import { Dialog_SelectCircle } from './Dialog_SelectCircle';

class RechargeOffers extends Component {
    constructor(props) {
        super(props);
        this.RechargePlans = [
            {
                amount: strings.rupee + 23,
                Talktime: '0',
                validity: '1 day',
                rechargeAmount: '259',
                rechargeDetails: 'Just you! Get 0.3GB  |  Extra Data 1.2GB Total 1.5GB Data'
            },
            {
                amount: strings.rupee + 23,
                Talktime: '0',
                validity: '1 day',
                rechargeAmount: '299',
                rechargeDetails: 'Just you! Get 0.3GB  |  Extra Data 1.2GB Total 1.5GB Data'
            },
            {
                amount: strings.rupee + 23,
                Talktime: '0',
                validity: '1 day',
                rechargeAmount: '999',
                rechargeDetails: 'Just you! Get 0.3GB  |  Extra Data 1.2GB Total 1.5GB Data'
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

        this.circlesName = [
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
            "Goa & Maharashtra", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
            "Kerala", "Madhya Pradesh", "Manipur", "Meghalaya", "Mizoram",
            "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
            "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
            "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"
        ]

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
            isValidOpr: true,
            isValidCir: true,
            Landline_Name: this.props.route.params.OperatorName,
            Landline_Icon: this.props.route.params.Logo,
            Landline_OperatorCode: this.props.route.params.OperatorCode,
            Selected_CircleID: this.props.route.params.Circle_code,
            Selected_CircleName: this.props.route.params.CircleName,
            isModalVisible: false,
            isStateModalVisible: false,
            isCircleVisible: false,
            selectedValue: 'option1',
            isOperatorVisible: false,
            StateName: this.circlesName.length > 0 ? 'Select Circle' : '',
            labelText: '',
            amount: '',
            remark: '',
            searchTerm: '',
            searchTermAct: 0,
            matchedBank: null,
            searchPerformed: false,
            constactsNumbers: []
        };
        this.handleSearch = this.handleSearch.bind(this);
    }

    renderPlansItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                if (this.state.Landline_Name === 'Select Operator') {
                    this.setState({ isValidOpr: false })
                    Snackbar.show({ text: 'Please Select operator first', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                }
                else if (this.state.Selected_CircleName === 'Select Circle') {
                    this.setState({ isValidCir: false })
                    Snackbar.show({ text: 'Please Select Circle first', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                }
                else {
                    this.props.navigation.navigate('rechargePay', {
                        RechargeAmount: item.rechargeAmount,
                        UserName: this.props.route.params.name,
                        MobileNumber: this.props.route.params.mobno,
                        AccountList: this.props.route.params.accList,
                        accList: this.props.route.params.AccountList,
                        Logo: this.state.Landline_Icon,
                        OperatorName: this.state.Landline_Name,
                        CircleName: this.state.Selected_CircleName,
                        Circle_code: this.state.Selected_CircleID
                    });
                }
            }}>

            <View style={styles.container}>
                <View style={styles.rechargeAmountView}>
                    <Text style={styles.rechargeAmountText}>{strings.rupee + item.rechargeAmount}</Text>
                </View>
                <View style={styles.validityView}>
                    <View style={styles.validityInnerView}>
                        <Text style={styles.commonTextStyle}>{'TalkTime: ' + item.Talktime}</Text>
                        <Text style={[styles.commonTextStyle, { marginLeft: 30 }]}>{'Validity: ' + item.validity}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.commonTextStyle}>{item.rechargeDetails}</Text>
                    </View>
                    <View>
                        <Text style={styles.moreText}>More</Text>
                    </View>
                </View>
                <View style={styles.arrowView}>
                    <Arrow />
                </View>
            </View>
        </TouchableOpacity>

    );

    bgImage = appThemeConfiguration(config.themeColor).bgImg

    fetchContacts = () => {
        Contacts.getAll().then((contacts) => {
            const contactInfo = contacts.map(contact => ({
                displayName: contact.displayName,
                phoneNumbers: contact.phoneNumbers.map(phone => phone.number)
            }));
            this.setState({
                constactsNumbers: contactInfo
            });

        }).catch((e) => { console.log('error reading contacts') });
    };

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

    onSelectOperator = (item) => {
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

    handleSearch(searchTerm) {
        const plainNumbers = (phoneNumber) => phoneNumber.replace(/[\(\)\-\s]/g, '');
        const filteredData = this.state.constactsNumbers.filter(
            (contact) =>
                contact.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (contact.phoneNumbers &&
                    contact.phoneNumbers.some((number) =>
                        plainNumbers(number).includes(searchTerm)
                    ))
        );
        this.setState({
            userData: filteredData,
        });
    }

    onSelectCircle = (item) => {
        console.log(item)
        this.setState({ isCircleVisible: false, isValidCir: true });
        if (item.circle_name === null || item.circle_name === undefined || item.circle_name.trim() === "") {
        }
        else {
            this.setState({ Selected_CircleID: item.circle_code, Selected_CircleName: item.circle_name, CircleName: item.circle_name })
        }
    }

    renderContactNumbers = ({ item }) => {
        const plainNumbers = item.phoneNumbers.map(number => number.replace(/[\(\)\-\s]/g, ''));
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('rechargeOffers', { name: 'rupesh' })}>
                <View style={styles.displayNameView}>
                    <View style={styles.displayNameInnerView}>
                        <Text style={styles.displayNameText}>{item.displayName.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.displayNameViewTwo}>
                        <Text style={styles.displayNameValue}>{item.displayName}</Text>
                        <Text style={styles.planNumberText}>{plainNumbers.join(', ')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        const { matchedBank, searchPerformed } = this.state;
        const sortedContacts = this.state.constactsNumbers.sort((a, b) =>
            a.displayName.toLocaleLowerCase().localeCompare(b.displayName.toLocaleLowerCase())
        );
        const groupedContacts = {};
        sortedContacts.forEach((contact) => {
            const firstLetter = (contact.displayName && contact.displayName.charAt(0).toUpperCase()) || 'Other';
            if (!groupedContacts[firstLetter]) {
                groupedContacts[firstLetter] = [];
            }
            groupedContacts[firstLetter].push(contact);
        });
        const sections = Object.keys(groupedContacts).map((letter) => ({
            title: letter,
            data: groupedContacts[letter],
        }));
        return (
            <View style={styles.mainView}>
                <ImageBackground style={styles.mainView}
                    source={this.bgImage}
                    resizeMode='cover'>
                    <TrasnsperantFixedHeader backAction={() => this.onBackAction()} />
                    <View style={styles.lableHeader}>
                        <View style={styles.lableHeaderView}>
                            <Text style={styles.prepaidTitle}>Prepaid
                            </Text>
                            <Text style={styles.prepaidDescription}>Select Your Recharge Plan
                            </Text>

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
                        <View style={styles.landLineView}>
                            <TouchableOpacity
                                style={[styles.landLineTouchable, { borderColor: this.state.isValidOpr ? "#d2d2d2" : "red", }]}
                                onPress={() => this.setState({ isOperatorVisible: true })}>
                                <Text style={[styles.landLineName, { color: this.state.isValidOpr ? "#000" : "red", }]}>{this.state.Landline_Name} </Text>
                                <View style={styles.svgMainVIew} >
                                    <Svg width="10" height="10">
                                        <Path
                                            d="M0 0L5 5L10 0H0Z"
                                            fill={this.state.isValidOpr ? 'grey' : 'red'}
                                        />
                                    </Svg></View>
                            </TouchableOpacity>
                            {Dialog_SimOperator(
                                this.state.isOperatorVisible,
                                this.OperatorList,
                                this.onSelectOperator,
                                this.state.DataCard_Name,
                            )}
                            <TouchableOpacity
                                style={[styles.circleTouchable, { borderColor: this.state.isValidCir ? "#d2d2d2" : "red", }]}
                                onPress={() => this.setState({ isCircleVisible: true, })}>
                                <Text style={[styles.circleName, { color: this.state.isValidCir ? "#000" : "red", }]}>{this.state.Selected_CircleName}</Text>
                                <View style={styles.svgView} >
                                    <Svg width="10" height="10">
                                        <Path
                                            d="M0 0L5 5L10 0H0Z"
                                            fill={this.state.isValidCir ? 'grey' : 'red'}
                                        />
                                    </Svg></View>
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
                                style={styles.searchTextInput}
                                value={this.state.searchTerm}
                                onChangeText={(searchTerm) => {
                                    this.setState({ searchTerm });
                                    this.setState({ searchTermAct: 1 });
                                }}
                                placeholder='Search Recharge Plans' />
                            <View>
                                <Image style={{ height: 23, width: 23 }} source={require('../../../assets/icons/search.png')}></Image>
                            </View>
                        </CardView>
                        <ScrollView>
                            <View>
                                {
                                    this.state.searchTermAct === 0 ? (
                                        <React.Fragment>
                                            <View>
                                                <FlatList
                                                    style={{ paddingBottom: 10 }}
                                                    data={this.RechargePlans}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    renderItem={this.renderPlansItem} />
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

export default connect(mapStateToProps, mapDispatchToProps)(RechargeOffers);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
        marginBottom: 5,
        width: width - 50,
    },
    rechargeAmountView:
    {
        alignSelf: 'flex-start'
    },
    rechargeAmountText:
    {
        fontSize: 14,
        fontWeight: "700",
        fontFamily: "SF UI Display",
        color: "#1f3c66",
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
    },
    textContainer: {
        flex: 3,
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
    commonTextStyle: {
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#252525",
        textAlign: "left",
        opacity: 0.8,
    },
    validityView:
    {
        flexDirection: 'column',
        marginLeft: 20,
        width: 220
    },
    validityInnerView:
    {
        flexDirection: 'row',
        marginBottom: 2
    },
    moreText:
    {
        fontSize: 13,
        marginTop: 3,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#1f3c66",
        textAlign: "left"
    },
    arrowView:
    {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'flex-end',
        marginLeft: 20
    },
    displayNameText:
    {
        fontSize: 24,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#fff",
        textAlign: "right",
        marginRight: 17,
        marginTop: 8
    },
    displayNameView:
    {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center'
    },
    displayNameInnerView:
    {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#EB5757',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 0.5,
        elevation: 2
    },
    displayNameViewTwo:
    {
        marginLeft: 22
    },
    displayNameValue:
    {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
        ontFamily: "SF UI Display"
    },
    planNumberText:
    {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: "SF UI Display",
        color: "#929cac",
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
        marginTop: 15,
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
        borderTopRightRadius: 25
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
    landLineIcon:
    {
        width: 50,
        height: 50
    },
    landLineView:
    {
        width: width - 50,
        height: 30,
        marginBottom: 10,
        flexDirection: 'row'
    },
    landLineTouchable:
    {
        borderRadius: 15,
        backgroundColor: "#fff",
        borderStyle: "solid",
        borderWidth: 0.5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    landLineName:
    {
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        textAlign: "left",
        marginRight: 5
    },
    svgMainVIew:
    {
        marginTop: 5 
    },
    circleTouchable:
    {
        borderRadius: 15,
        backgroundColor: "#fff",
        borderStyle: "solid",
        borderWidth: 0.5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    circleName:
    {
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        textAlign: "left",
        marginRight: 5
    },
    svgView:
    {
        marginTop: 5
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
    }
});
