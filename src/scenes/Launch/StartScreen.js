import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    ImageBackground,
} from 'react-native';
import {
    strings,
    assets,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    navigation,
    okDialog,
    RenderOkDialog,
    appThemeConfiguration,
} from '../../App';
import Footer from '../../assets/icons/footer.svg';
import Iicon from '../../assets/icons/I-icon.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview'
import NetInfo from '@react-native-community/netinfo';

class StartScreen extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                this.setState({ connectivityAvailable: true });
            } else {
                okDialog(this, strings.internetReq);
            }
        });
    }

    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg

    toStart() {
        navigation.navigate(this, 'loginType')
    }

    toPrivacyPolicy() {
        this.props.navigation.navigate('PrivacyPolicy')
    }

    render() {
        return (
            <View style={styles.mainView}>
                <ImageBackground style={styles.mainView}
                    source={this.bgImage}
                    resizeMode='cover'>
                    <View style={styles.imagView}>
                        <Image
                            source={assets.startImage}
                            style={styles.imgStyle} />
                    </View>
                    <View style={styles.mainSubView}>
                        <Text style={[styles.companyTitle, { color: this.props.textColor }]}>{strings.bankingWithoutBoundried}
                        </Text>
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={12}
                            style={styles.startCard}>
                            <TouchableOpacity
                                style={[styles.startTouchable, { backgroundColor: this.props.PrimaryColor }]}
                                onPress={() => this.toStart()}
                            ><Text style={styles.startText}>{strings.getStarted}</Text>
                            </TouchableOpacity>
                        </CardView>
                        <TouchableOpacity style={styles.privacyPolicyTouchable}
                            onPress={() => this.toPrivacyPolicy()}>
                            <Iicon height={15} width={15} color={this.props.SecondaryColor} />
                            <Text style={[styles.privacyPolicyText, { color: this.props.SecondaryColor }]}
                            >Privacy Policies</Text>
                        </TouchableOpacity>
                        <View style={styles.footerView}>
                            <Footer height={70} width={300} />
                        </View>
                    </View>
                </ImageBackground>
                <RenderOkDialog />
            </View>
        );
    }
}
const styles = {
    mainView:
    {
        flex: 1,
        backgroundColor: 'white'
    },
    mainSubView:
    {
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column'
    },
    imagView:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgStyle:
    {
        height: 250,
        width: 250,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
        marginBottom: 5,
    },
    companyTitle:
    {
        marginTop: 30,
        fontSize: 30,
        color: 'black',
        textAlign: 'center',
        fontFamily: strings.fontMedium,
    },
    startCard:
    {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 20,
    },
    startTouchable:
    {
        padding: 15,
        width: width - 50,
        justifyContent: 'center',
        borderRadius: 12,
    },
    startText:
    {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15
    },
    privacyPolicyTouchable:
    {
        flexDirection: 'row',
        alignItems: 'center'
    },
    privacyPolicyText:
    {
        marginLeft: 10,
        fontFamily: strings.fontMedium,
        fontSize: 15
    },
    footerView:
    {
        justifyContent: 'flex-end',
        marginTop: 20
    },
};
export default connect(mapStateToProps, mapDispatchToProps)(StartScreen);
