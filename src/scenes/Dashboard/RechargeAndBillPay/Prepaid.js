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
import Contacts from 'react-native-contacts';
import { check, RESULTS, request } from 'react-native-permissions';
import CardViewAutoSlider from './CardViewAutoSlider';
import Snackbar from 'react-native-snackbar';

class Prepaid extends Component {
    constructor(props) {
        super(props);
        const accountList = props.route.params.dashboardArray
        this.data = [
            {
                title: 'Saving A/c',
                data: [
                    { label: 'xxxxx58663252xx0x', bal: '₹124 ' },
                    { label: 'xxxxx69863252xx0x', bal: '₹999' },
                ]
            },
            {
                title: 'Current A/c',
                data: [
                    { label: 'xxxxx58663252xx0x', bal: '₹1234' },

                ],
            },
        ];
        this.userData = [
            {
                username: 'Poonam Jadhav',
                mobileNumber: '1234567890',
                rechargeAmount: '25.00',
                Logo: require('../../../assets/icons/Jio-icon.png'),
                lastRecharge: '10th Nov 2023',
                OperatorName: 'Jio-Prepaid',
                operator_code: 'VP',
                CircleName: 'Maharashtra & Goa (except Mumbai)',
                Circle_code: '13',
            },
            {
                username: 'Raju Shinde',
                mobileNumber: '9876543210',
                rechargeAmount: '25.00',
                Logo: require('../../../assets/icons/Vi-icon.png'),
                lastRecharge: '9th Nov 2023',
                OperatorName: 'VI-Prepaid',
                operator_code: 'VP',
                CircleName: 'Maharashtra & Goa (except Mumbai)',
                Circle_code: '13',
            },
            {
                username: 'Santosh Yande',
                mobileNumber: '9876543210',
                rechargeAmount: '25.00',
                Logo: require('../../../assets/icons/Jio-icon.png'),
                lastRecharge: '02nd Aug 2023',
                OperatorName: 'Jio-Prepaid',
                operator_code: 'VP',
                CircleName: 'Mumbai',
                Circle_code: '15',
            },
            {
                username: 'Raju Shinde',
                mobileNumber: '9876543210',
                rechargeAmount: '25.00',
                Logo: require('../../../assets/icons/datacard_BSNL.png'),
                lastRecharge: '9th Nov 2023',
                OperatorName: 'BSNL-Prepaid',
                operator_code: 'VP',
                CircleName: 'Maharashtra & Goa (except Mumbai)',
                Circle_code: '13',
            },
            {
                username: 'Raju Shinde',
                mobileNumber: '9876543210',
                rechargeAmount: '25.00',
                Logo: require('../../../assets/icons/AirtelLogo.png'),
                lastRecharge: '9th Nov 2023',
                OperatorName: 'Airtel-Prepaid',
                operator_code: 'AP',
                CircleName: 'Jammu & Kashmir',
                Circle_code: '9',
            },

        ];
        this.state = {
            isModalVisible: false,
            selectedValue: 'option1',
            accType: this.data[0].data[0].label,
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

    renderUserItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('rechargeHistory',
                {
                    name: item.username,
                    mobno: item.mobileNumber,
                    AccountList: this.props.route.params.dashboardArray,
                    Logo: item.Logo,
                    OperatorName: item.OperatorName,
                    operator_code: item.operator_code,
                    CircleName: item.CircleName,
                    Circle_code: item.Circle_code
                })}>
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <View style={styles.simIcon}>
                        <Image style={styles.imgStyle} source={item.Logo} />
                    </View>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
                        {item.username}
                    </Text>
                    <Text style={styles.mobileNumber}>{item.mobileNumber}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.rechargeAmount}>{strings.rupee}{item.rechargeAmount}</Text>
                    <TouchableOpacity
                        style={styles.autoFetchStyle}>
                        <Text style={styles.autoFetchText}>{'Auto Fetch'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    componentDidMount() {
        this.requestContactPermission();
        if (this.state.searchTerm.length > 0) {
            this.setState({ searchTerm: '' });
        }
    }

    bgImage = appThemeConfiguration(config.themeColor).bgImg

    requestContactPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                    {
                        title: 'Contact Permission',
                        message: 'This app requires access to your contacts.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                } else {
                    console.log('Contact permission denied');
                    Alert.alert(
                        'Contact Permission Required',
                        'This app requires contact permission to function properly. Please grant the contact permission in the app settings.',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    if (Platform.OS === 'android') {
                                        this.requestContactPermission()
                                    }
                                },
                            },
                            {
                                text: 'Cancel',
                                style: 'cancel',
                                onPress: () => {
                                    Alert.alert('App Closure',
                                        'This app requires contact permission to function properly. Please grant the permission or exit the app.',
                                        [{
                                            text: 'OK',
                                            onPress: () => {
                                                if (Platform.OS === 'android') {
                                                    this.requestContactPermission()
                                                } else if (Platform.OS === 'ios') {
                                                    Linking.openSettings();
                                                }
                                            },
                                        },]
                                    );
                                },
                            },
                        ]
                    );
                }
            } else if (Platform.OS === 'ios') {
                const status = await check(PermissionsIOS.CONTACTS);
                if (status === RESULTS.GRANTED) {
                    fetchContacts();
                } else {
                    const requestStatus = await request(PermissionsIOS.CONTACTS);
                    if (requestStatus === RESULTS.GRANTED) {
                        fetchContacts();
                    } else {
                        Alert.alert(
                            'Contact Permission Required',
                            'This app requires contact permission to function properly. Please grant the contact permission.',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        this.requestContactPermission()

                                    },
                                },
                                {
                                    text: 'Cancel',
                                    style: 'cancel',
                                    onPress: () => {
                                    },
                                },
                            ]
                        );
                    }
                }
            }
        } catch (error) {
            console.log('Error requesting contact permission:', error);
        }
    };


    searchContacts = (searchString) => {

        if (searchString.length >= 3) {
            Contacts.getContactsMatchingString(searchString)
                .then((contacts) => {
                    if (contacts.length > 0) {
                        const contactInfo = contacts.reduce((acc, contact) => {
                            const phoneNumbers = contact.phoneNumbers.map(phone => this.cleanPhoneNumber(phone.number));
                            phoneNumbers.forEach(number => {
                                acc.push({
                                    displayName: contact.displayName,
                                    phoneNumbers: number
                                });
                            });
                            return acc;
                        }, []);
                        this.setState({
                            contactsNumbers: contactInfo
                        });
                    } else {
                        if (isNaN(searchString)) {
                        } else {
                            const first10Digits = searchString.slice(0, 10);
                            const notFoundContact = {
                                displayName: 'Unknown',
                                phoneNumbers: [first10Digits]
                            };
                            this.setState({
                                contactsNumbers: [notFoundContact]
                            });
                        }

                    }
                })
                .catch((e) => {
                    this.setState({
                        contactsNumbers: [],
                        searchTermAct: 0,
                    });
                });

        } else {
            console.log('false');
            this.setState({
                contactsNumbers: [],
                searchTermAct: 0,
            });
        }
    };

    cleanPhoneNumber = (phoneNumber) => {
        return phoneNumber.replace(/[\s()-]/g, '');
    };

    onBackAction() {
        navigation.goBack(this)
    }

    onSelectAccount = (value) => {
        this.setState({ isModalVisible: false, accType: value })
    }

    renderContactNumbers = ({ item }) => {
        console.log('item--->' + item.phoneNumbers.length)
        return (
            <TouchableOpacity
                onPress={() => {
                    if (this.state.searchTerm === "0000000000" || this.state.searchTerm.length < 10) {
                        Snackbar.show({ text: 'Please Enter a Valid Mobile Number', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                    } else {
                        this.props.navigation.navigate('rechargeOffers', {
                            name: item.displayName,
                            mobno: item.phoneNumbers,
                            accList: this.accountList,
                            OperatorName: 'Select Operator',
                            CircleName: 'Select Circle'
                        });
                    }
                }}>
                <View style={styles.displayNameMainView}>
                    <View style={styles.displayNameInnerView}>
                        <Text style={styles.displayNameText}>{item.displayName.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.phoneNumberMainView}>
                        <Text style={styles.displayNameTextTwo}>{item.displayName}</Text>
                        <Text style={styles.displayNameTextTwo}>{item.phoneNumbers}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        const { matchedBank, searchPerformed } = this.state;
        return (
            <View style={styles.mainView}>
                <ImageBackground style={styles.mainView}
                    source={this.bgImage}
                    resizeMode='cover'>
                    <TrasnsperantFixedHeader
                        backAction={() => this.onBackAction()} />
                    <View style={styles.lableHeader}>
                        <View style={styles.lableHeaderView}>
                            <Text style={styles.prepaidTitle}>Prepaid</Text>
                            <Text style={styles.prepaidDescription}>Select Your Prepaid Recharge Number</Text>
                        </View>
                    </View>
                    <View style={styles.subMainView}>
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
                                    if (searchTerm === "0000000000" || searchTerm < 10) {
                                        this.setState({ searchTerm });
                                        this.setState({ searchTermAct: 1 });
                                        this.searchContacts(searchTerm);
                                    } else {
                                        this.setState({ searchTerm });
                                        this.setState({ searchTermAct: 1 });
                                        this.searchContacts(searchTerm);
                                    }
                                }}
                                placeholder='Search Number / Name Here ' />
                            <View>
                                <Image style={styles.searchIcon} source={require('../../../assets/icons/search.png')}></Image>
                            </View>
                        </CardView>
                        {this.state.searchTermAct === 0 ? (
                            <View>
                                <CardViewAutoSlider CardType={'Prepaid'} />
                                <View style={styles.recentView}>
                                    <Text style={[styles.mainView, { textAlign: 'left' }]}>{`Recent `}</Text>
                                    <TouchableOpacity
                                        style={[styles.mainView, { alignSelf: 'flex-end' }]}
                                        onPress={() => this.props.navigation.navigate('billsPaymentHistory', { HistoryMenu: 'Prepaid Mobile Recharge' })}>
                                        <Text style={[styles.mainView, { textAlign: 'right', color: this.props.SecondaryColor }]}>{`View History`}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : null}
                        <ScrollView>
                            <View style={styles.scrollInnerView}>
                                {
                                    this.state.searchTermAct === 0 ? (
                                        <React.Fragment>
                                            <View style={styles.mainView}>
                                                {console.log("logg-->" + JSON.stringify(this.state.constactsNumbers[1]))}
                                                <FlatList
                                                    style={styles.flatListStyle}
                                                    data={this.userData.slice(0, 5)}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    renderItem={this.renderUserItem} />
                                            </View>
                                        </React.Fragment>
                                    ) : null
                                }
                                <View style={styles.subMainView}>
                                    <ScrollView>
                                        <View style={styles.outerScrollView}>
                                            <View style={styles.mainView}>
                                                <FlatList
                                                    style={styles.flatListStyle}
                                                    data={this.state.userData}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    renderItem={this.renderContactNumbers}
                                                />
                                            </View>
                                            <React.Fragment>
                                                <View>
                                                    <View>
                                                        <FlatList
                                                            data={this.state.contactsNumbers}
                                                            keyExtractor={(item, index) => index.toString()}
                                                            renderItem={this.renderContactNumbers} />
                                                    </View>
                                                </View>
                                            </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(Prepaid);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',

        height: 80
    },
    iconContainer: {
        flex: 1,
        marginRight: 10,
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
        color: '#000'
    },
    mobileNumber: {
        fontSize: 16,
    },
    rechargeAmount: {
        fontSize: 18,
        textAlign: 'right',
        fontWeight: 'bold',
        color: '#686868',
        paddingRight: 8

    },
    imgStyle:
    {
        width: 50,
        height: 50
    },
    autoFetchStyle:
    {
        borderRadius: 15,
        backgroundColor: "#fff",
        borderStyle: "solid",
        borderColor: "#bec8ec",
        borderWidth: 1,
        width: "70%",
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginTop: 3
    },
    autoFetchText:
    {
        color: 'black',
        fontSize: 12
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
        marginTop: 15
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
    searchCard:
    {
        height: 48,
        backgroundColor: 'white',
        width: width - 60,
        alignItems: 'center',
        marginTop: 30,
        flexDirection: 'row',
        marginBottom: 8,
    },
    searchTextInput:
    {
        flex: 0.95,
        height: 54,
        backgroundColor: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 17,
    },
    searchIcon:
    {
        height: 23,
        width: 23
    },
    recentView:
    {
        marginBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
        width: width - 50,
        marginLeft: 25,
    },
    scrollInnerView:
    {
        width: width - 30
    },
    flatListStyle:
    {
        paddingBottom: 10
    },
    outerScrollView:
    {
        width: 350
    },
    displayNameMainView:
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
    phoneNumberMainView:
    {
        marginLeft: 22
    },
    displayNameTextTwo:
    {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
        ontFamily: "SF UI Display"
    },
    phoneNumberText:
    {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: "SF UI Display",
        color: "#929cac",
    },
    balanceInnerContainer:
    {
        width: 55,
        height: 55,
        borderRadius: 10,
        backgroundColor: 'white',
        marginLeft: 18,
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
