import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Footer from '../../assets/icons/footer.svg';
import {
    colors,
    strings,
    assets,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    navigation,
} from '../../App';
import CardView from 'react-native-cardview';
import FixedHeader from '../../components/FixedHeader';


class FundTransferSucess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            callFrom: this.props.route.params.from === 'dashboard' ? 'dashboard' : '',
            refNo: this.props.route.params.refNo,
        };
        this.screenWidth = Dimensions.get('window').width;

    }
    componentDidMount() {
        setTimeout(() => {
            {
                this.state.callFrom === 'dashboard'
                    ? navigation.navigate(this, 'bottomNavigator')
                    : navigation.navigate(this, 'quickPayScreen');
            }
        }, 3000);
    }

    toMain() {
        {
            this.state.callFrom === 'dashboard'
                ? navigation.navigate(this, 'bottomNavigator')
                : navigation.navigate(this, 'quickPayScreen');
        }
    }
    render() {
        return (
            <View
                style={styles.mainView}>
                <FixedHeader />
                <View
                    style={styles.headerView}>
                    <View
                        style={styles.headerSubView}>
                        <Image
                            source={assets.success}
                            style={styles.successImage} />
                        <Text
                            style={[styles.congratulationText, { color: this.props.textColor, }]}>
                            Congratulations!
                        </Text>
                        <Text
                            style={[styles.successfullyText, { color: this.props.textColor, }]}>
                            Fund Transfer Successfully
                        </Text>
                        <Text
                            style={[styles.refNoText, { color: this.props.textColor, }]}>
                            {'Transaction reference no. ' + this.state.refNo}
                        </Text>
                    </View>
                    <View
                        style={styles.backToMenuView}>
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={12}
                            style={styles.backToMenuCard}>
                            <TouchableOpacity
                             style={[styles.backToMenuTouchable, { backgroundColor: this.props.PrimaryColor,}]}
                                onPress={() => this.toMain()}>
                                <Text
                                    style={styles.backToMenuText}>
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
    mainView:
    {
        flex: 1,
        backgroundColor: 'white',
    },
    headerView:
    {
        flex: 1,
        alignItems: 'center',
    },
    headerSubView:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successImage:
    {
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
        width: 250,
    },
    successfullyText:
    {
        width: width - 45,
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 15,
        fontSize: 15,
    },
    refNoText: {
        width: width - 45,
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 15,
        fontSize: 18,
    },
    backToMenuView:
    {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backToMenuCard:
    {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 10,
    },
    backToMenuTouchable:
    {

        padding: 15,
        width: width - 45,
        justifyContent: 'center',
        borderRadius: 12,
    },
    backToMenuText:
    {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15,
    },
}
export default connect(mapStateToProps, mapDispatchToProps)(FundTransferSucess);
