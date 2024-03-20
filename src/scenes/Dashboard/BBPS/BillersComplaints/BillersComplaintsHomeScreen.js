
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
    config,
    RenderOkDialog,
} from '../../../../App';
import { TextInput } from 'react-native-paper';

//import { TouchableOpacity } from 'react-native-gesture-handler';
import TrasnsperantFixedHeader from '../../../../components/TrasnperantFixedHeader';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';

// import Airtel from '../../../../assets/icons/Airtel.svg';
import GESCOM from '../../../../assets/icons/GESCOM.svg'
// import CESE from '../../../../assets/icons/icon-CESE.png'
import MESCOM from '../../../../assets/icons/icon-mescom.svg'
import BBPS from '../../../../assets/icons/BBPS_Logo.svg'








class PostpaidScreen extends Component {


    constructor(props) {
        super(props);

        this.ProviderList = [
            {
                ProviderName: 'Gulbarga Electricity Supply Company Li...',
                ID: '1'
            },
            {
                ProviderName: 'Chamundeshwari electricity supply com....',
                ID: '2'
            },
            {
                ProviderName: 'Mangalore Electricity Supply Company Li...',
                ID: '3'
            },
            {
                ProviderName: 'Gulbarga Electricity Supply Company Li...',
                ID: '1'
            },
            {
                ProviderName: 'Chamundeshwari electricity supply com....',
                ID: '2'
            },
            {
                ProviderName: 'Mangalore Electricity Supply Company Li...',
                ID: '3'
            },

        ];
        this.state = {
            //  isModalVisible: false,
            //  selectedValue: 'option1',
            //  accType: this.data[0].data[0].label,
            labelText: '',
            amount: '',
            remark: '',
            searchTerm: '',
            searchTermAct: 0,
            matchedBank: null,
            searchPerformed: false,
            // constactsNumbers: []
        };
        // this.handleSearch = this.handleSearch.bind(this);
    }








    renderUserItem = ({ item }) => (

        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('billersComplaintScreen', {
                BillerName: item.ProviderName
            })}
        >
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <View style={styles.simIcon}>
                        {/* {item.ID === '1' ? <GESCOM height={28} width={28} /> : item.ID === '2' ? <CESE height={38} width={38} />: item.ID === '3' ? <MESCOM height={30} width={30}  /> : null} */}
                    </View>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
                        {item.ProviderName}
                    </Text>

                </View>


            </View>
        </TouchableOpacity>
    );

    handlePress = (item) => {
        // Handle press event here
        console.log('Item pressed:', item);
    };

    componentDidMount() {

    }
    bgImage = appThemeConfiguration(config.themeColor).bgImg








    onBackAction() {
        navigation.goBack(this)
    }

    toOwnAccTransfer() {
        navigation.navigate(this, 'ownAccTransferScreen')
        console.log('hellooooo')
    }

    toReview() {
        navigation.navigate(this, 'quickPayWithinBankOtherAccount')
    }


    onSelectAccount = (value) => {
        this.setState({ isModalVisible: false, accType: value })
        console.log("state.isModalVisible", this.state.isModalVisible, value);
        // renderWelcomeMsg()

    }

    //      Without seach terms






    render() {
        const { matchedBank, searchPerformed } = this.state;



        return (
            <View style={styles.mainContainer}>
                <ImageBackground style={styles.mainContainer} source={this.bgImage} resizeMode='cover'>
                    <TrasnsperantFixedHeader
                        backAction={() => this.onBackAction()}
                    />

                    <View style={styles.headingContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.title}>Biller Complaints
                            </Text>
                            <Text style={styles.subTitle}>Register your complaints against the biller.
                            </Text>

                        </View>
                    </View>

                    <View style={styles.containerView}>

                        <View style={styles.bbpsContainer}>
                            <BBPS style={styles.bbpsStyle} />
                        </View>


                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={6}
                            style={[styles.cardContainer]}
                        >
                            <TextInput
                                maxLength={10}
                                style={[styles.textInput, { color: this.props.textColor }]}
                                value={this.state.searchTerm}
                                onChangeText={(searchTerm) => {
                                    this.setState({ searchTerm });
                                    this.setState({ searchTermAct: 1 });
                                    this.searchContacts(searchTerm); // Call handleSearch on each text change

                                }}
                                placeholder='Search Biller Name'

                            />

                            <View>
                                <Image style={styles.searchIcon} source={require('../../../../assets/icons/search.png')}></Image>
                            </View>
                        </CardView>


                        <ScrollView>
                            <View style={styles.outerContainer}>
                                <View style={styles.innerView}>
                                    <Text style={styles.viewTitle}>{`All Provider `}</Text>
                                </View>
                                <View style={styles.mainContainer}>
                                    <FlatList
                                        data={this.ProviderList}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={this.renderUserItem}
                                    />
                                </View>
                            </View>
                        </ScrollView>

                    </View>
                </ImageBackground>
            </View>


        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostpaidScreen);


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    headingContainer: {
        flex: 0.15,
    },
    innerContainer: {
        marginLeft: 25,
        marginTop: 15,
    },
    outerContainer: {
        width: width - 40,
    },
    innerView: {
        width: width - 40,
        marginTop: 10,
    },
    viewTitle: {
        textAlign: 'left',
        flex: 1,
    },
    title: {
        fontSize: 22,
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: colors.white,
    },
    subTitle: {
        fontSize: 15,
        textAlign: 'left',
        fontFamily: strings.fontMedium,
        color: colors.white,
    },
    containerView: {
        flex: 0.85,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },
    bbpsContainer: {
        alignItems: 'flex-end',
        width: width - 60,
        marginBottom: 10,
        marginTop: 10,
    },
    bbpsStyle: {
        marginTop: 5,
    },
    wrapper: {
        height: 200,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    container: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
        //  marginBottom: 10
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
        flex: 5,
        //width:500


    },
    username: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000'
    },



    logo: {
        width: 50,
        height: 20,
    },
    cardContainer: {
        height: 48,
        backgroundColor: 'white',
        width: width - 40,
        alignItems: 'center',
        marginTop: 10,
        flexDirection: 'row',
        marginBottom: 8,
    },
    textInput: {
        flex: 0.95,
        height: 54,
        backgroundColor: 'white',
        fontFamily: strings.fontRegular, // Assuming strings is defined elsewhere
        fontSize: 17,

    },
    searchIcon: {
        height: 20,
        width: 20
    }
});
