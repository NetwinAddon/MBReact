//  RGP

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
    BackHandler,
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
    RenderOkDialog,
} from '../../../../App';

import { TextInput } from 'react-native-paper';

import BBPS from '../../../../assets/icons/BBPS_Logo.svg';

//import { TouchableOpacity } from 'react-native-gesture-handler';
import TransparentFixedHeader from '../../../../components/TrasnperantFixedHomeHeader';

import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';

import Airtel from '../../../../assets/icons/Airtel.svg';
import Arrow from '../../../../assets/icons/Vectorarrow.svg';

import DownArrow from '../../../../assets/icons/down-arrow.svg';

import { SimOperatorPop } from '../../../../components/SimOperatorPop';
import { CustomPopupsRecharge } from '../../../../components/CustomPopupsRecharge';
const bankData = [
    {
        ifsc: 'SBI0001234',
        name: 'State Bank of India',
        address: 'Pawan Nagar, Nashik',
    },
    {
        ifsc: 'BOB1234',
        name: 'Bank of baroda',
        address: 'Pawan Nagar, Nashik',
    },
    // Add more bank data entries as needed
];

class HistoryList extends Component {
    constructor(props) {
        super(props);

        //var name = this.props.route.RGP;

        this.ComplaintsList = [
            {
                Title: 'Item 1',
                Desc: 'Information 1',
                status: 'send',
            },
            {
                Title: 'Item 2',
                Desc: 'Information 2',
                status: 'Pending...',
            },
            {
                Title: 'Item 3',
                Desc: 'Information 3',
                status: 'Pending...',
            },

            // Add more user data as needed
        ];

        this.state = {
            isModalVisible: false,
            isStateModalVisible: false,
            selectedValue: 'option1',
            // operaterName: this.OperatorsList.length > 0 ? 'Select Operator' : '',
            // StateName: this.circlesName.length > 0 ? 'Select Circle' : '',
            labelText: '',
            amount: '',
            remark: '',
            searchTerm: '',
            searchTermAct: 0,
            matchedBank: null,
            searchPerformed: false,
            constactsNumbers: [],
        };
    }

    renderComplaints = ({ item }) => (

        <View style={styles.complaintContainer}>
            <TouchableOpacity
            // onPress={() => this.props.navigation.navigate('rechargePay', {
            //     RechargeAmount: item.RechargeAmount,
            //     UserName: this.props.route.params.name,
            //     MobileNumber: this.props.route.params.mobno
            // })}
            >
                <View style={styles.container}>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>
                            {item.Title}
                        </Text>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.description}>
                                {item.Desc}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.statusContainer}>
                        <View style={styles.status}>
                            <Text style={styles.statusText}>
                                {item.status}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>


    );

    componentDidMount() { }
    bgImage = appThemeConfiguration(config.themeColor).bgImg;

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

    toOwnAccTransfer() {
        navigation.navigate(this, 'ownAccTransferScreen');
        console.log('hellooooo');
    }

    toReview() {
        navigation.navigate(this, 'quickPayWithinBankOtherAccount');
    }

    onSelectOperator = (value) => {
        console.log('valueeeeeeeeee' + value);
        {
            value !== '' || value !== 'undefined' ? console.log('true') : console.log('false');
        }
        this.setState({ isModalVisible: false, operaterName: value });
        console.log('state.isModalVisible', this.state.isModalVisible, value);
        // renderWelcomeMsg()
    };

    onSelectState = (value) => {
        console.log('valueeeeeeeeee' + value);
        {
            value !== '' || value !== 'undefined' ? console.log('true') : console.log('false');
        }
        this.setState({ isStateModalVisible: false, StateName: value });
        console.log('state.isStateModalVisible', this.state.isStateModalVisible, value);
        // renderWelcomeMsg()
    };

    render() {
        return (
            <View style={styles.mainContainer}>
                <ImageBackground style={styles.backgroundImage} source={this.bgImage} resizeMode='cover'>
                    <TransparentFixedHeader backAction={() => this.onBackAction()} />

                    <View style={styles.headerContainer}>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>Complaint History</Text>
                            <Text style={styles.headerSubtitle}>Search your complaint history</Text>
                        </View>
                    </View>

                    <View style={styles.contentContainer}>
                        <ScrollView>
                            <View style={styles.iconContainer}>
                                <View style={styles.bbpsContainer}>
                                    <BBPS style={styles.bbpsStyle} />
                                </View>


                                {this.state.searchTermAct === 0 ? (
                                    <React.Fragment>
                                        <View style={styles.flatListView}>
                                            <FlatList
                                                data={this.ComplaintsList}
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={this.renderComplaints}
                                            />
                                        </View>
                                    </React.Fragment>
                                ) : null}
                            </View>
                        </ScrollView>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryList);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        width: width - 60,
        flex: 3,
    },
    textContainer: {
        flex: 4,
        paddingTop: 5
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'SF UI Display',
        color: '#000',
        textAlign: 'left',
    },
    descriptionContainer: {
        borderRadius: 5,
        backgroundColor: '#f3f8ff',
        width: '90%',
        height: 25,
        justifyContent: 'center',
        paddingLeft: 10,
        marginTop: 5,
    },
    description: {
        fontSize: 12,
        color: '#252525',
        fontWeight: '500',
        fontFamily: 'SF UI Display',
        textAlign: 'left',
        opacity: 0.8,
    },
    statusContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    status: {
        padding: 3,
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'rgba(254, 190, 92, 0.5)', // RGB with opacity
        opacity: 0.4,
    },
    statusText: {
        fontSize: 12,
        color: 'red',
        fontWeight: '500',
        fontFamily: 'SF UI Display',
        textAlign: 'left',
    },
    mainContainer: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
    },
    headerContainer: {
        flex: 0.15,
    },
    headerTextContainer: {
        marginLeft: 25,
        marginTop: 15,
    },
    headerTitle: {
        fontSize: 22,
        color: 'white',
        textAlign: 'left',
        fontFamily: 'your-font-bold', // Replace 'your-font-bold' with your actual font
    },
    headerSubtitle: {
        fontSize: 15,
        color: 'white',
        textAlign: 'left',
        fontFamily: 'your-font-medium', // Replace 'your-font-medium' with your actual font
    },
    contentContainer: {
        flex: 0.85,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    iconContainer: {
        alignItems: 'center',
        marginTop: 15
    },
    bbpsContainer: {
        alignItems: 'flex-end',
        width: width - 60,
    },
    bbpsStyle: {
        marginTop: 5,
    },
    flatListView: {
        flex: 1,
        marginTop: 10
    },
    complaintContainer: {
        height: 70,
        backgroundColor: 'white',
        width: width - 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 8,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#dfe1e8',
    },


});
