import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    Button,
    TouchableOpacity,
    Dimensions,
    BackHandler
} from 'react-native';
import Footer from '../../../../assets/icons/footer.svg';
import {
    colors,
    strings,
    assets,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    navigation,
} from '../../../../App';
import CardView from 'react-native-cardview';
import FixedHeader from '../../../../components/FixedHeader';


class ImpsTransferSucess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            callFrom: this.props.route.params.from,
            trnId: this.props.route.params.trnId
        };

        
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    }


    
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        // navigation.goBack(this)
        return true;
    }

    onBackAction() {
        // navigation.goBack(this)
    }



    componentDidMount() {
        console.log('props', this.props)
        if (this.state.callFrom === 'Dashboard') {
            setTimeout(() => {
                navigation.navigate(this, 'bottomNavigator')
            }, 1500);
        }
        else if (this.state.callFrom === 'Add Beneficiary') {
            setTimeout(() => {
                navigation.navigate(this, 'IMPSTransferMenu')
            }, 1500);
        }
        else if (this.state.callFrom === 'Close Beneficiary') {
            setTimeout(() => {
                navigation.navigate(this, 'IMPSTransferMenu')
            }, 1500);
        }
        else if (this.state.callFrom === 'Verify Beneficiary') {
            setTimeout(() => {
                navigation.navigate(this, 'IMPSTransferMenu')
            }, 1500);
        }
        else {
            setTimeout(() => {
                navigation.navigate(this, 'quickPayScreen')
            }, 1500);
        }
    }

    toMain() {
        if (this.state.callFrom === 'Dashboard') {
            navigation.navigate(this, 'bottomNavigator')
        }
        else if (this.state.callFrom === 'Add Beneficiary') {
            navigation.navigate(this, 'IMPSTransferMenu')
        }
        else if (this.state.callFrom === 'Close Beneficiary') {
            navigation.navigate(this, 'IMPSTransferMenu')
        }
        else if (this.state.callFrom === 'Verify Beneficiary') {
            navigation.navigate(this, 'IMPSTransferMenu')
        }
        else {
            navigation.navigate(this, 'quickPayScreen')
        }
    }

    handleBackButton = () => {
        navigation.navigate(this, 'IMPSTransferMenu')
        return true;
    };


    render() {
        return (
            <View style={styles.container}>
                <FixedHeader/>
                <View style={styles.contentContainer}>
                    <View style={styles.innerContainer}>
                        <Image
                            source={assets.success}
                            style={styles.image}/>
                        <Text style={[styles.congratulationText, { color: this.props.textColor }]}>
                            Congratulations!</Text>
                        {this.state.callFrom === 'Verify Beneficiary' ?
                            <Text style={[styles.text, { color: this.props.textColor, }]}>
                                Beneficiary Successfully Verified.</Text> :
                            this.state.callFrom === 'Close Beneficiary' ?
                                <Text style={[styles.text, { color: this.props.textColor, }]}>
                                    Beneficiary A/c Successfully Closed.</Text>
                                : this.state.callFrom === 'Add Beneficiary' ?
                                    <Text style={[styles.text, { color: this.props.textColor, }]}>
                                        Beneficiary Added Successfully</Text> :
                                    <View style={styles.columnContainer}>
                                        <Text style={[styles.text, { color: this.props.textColor, }]}>
                                            Fund Transfer Successfully</Text>
                                        <Text style={[styles.transactionText, { color: this.props.textColor, }]}>
                                            {'IMPS Transaction reference no. ' + this.state.trnId}</Text>
                                    </View>
                        }
                    </View>
                    <View style={styles.buttonContainer}>
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={12}
                            style={styles.cardView}>
                            <TouchableOpacity
                               style={[styles.button, { backgroundColor: this.props.PrimaryColor,}]}
                                onPress={() => this.toMain()}
                            ><Text style={styles.buttonText}>
                                    Back to menu
                                </Text>
                            </TouchableOpacity>
                        </CardView>
                        <View>
                            <Footer height={70} width={300} />
                        </View>
                    </View>
                </View> 
                </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: 106,
        width: 106,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    congratulationText:
    {
        alignItems: 'flex-end',
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 20,
        fontSize: 26,
       
    },
    text: {
        width: width - 45,
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 15,
        fontSize: 15,
    },
    columnContainer: {
        flexDirection: 'column',
    },
    transactionText: {
        width: width - 45,
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 15,
        fontSize: 18,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    cardView: {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 10,
    },
    button: {
        padding: 15,
        width: width - 45,
        justifyContent: 'center',
        borderRadius: 12,
    },
    buttonText: {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15,
    },
};

export default connect(mapStateToProps, mapDispatchToProps)(ImpsTransferSucess);