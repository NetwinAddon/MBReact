import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    Clipboard,
    StyleSheet,
} from 'react-native';
import Footer from '../../assets/icons/footer.svg';
import CopyIcon from '../../assets/icons/copy.svg';


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
import Snackbar from 'react-native-snackbar';


class RegistrationSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.screenWidth = Dimensions.get("window").width;
        this.USERID = props.route.params.USERID



    }
    componentDidMount() {
        console.log('props', this.props)


    }


    toLoginPage() {

        navigation.navigate(this, 'loginType')
    }


    CopyUserId = async () => {

        try {
            await Clipboard.setString(this.USERID);

            Snackbar.show({
                text: 'User ID Copied !!',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'green'
            });

        } catch (error) {
            console.error('Error copying text: ', error);
        }
    };



    render() {
        return (
            <View style={styles.ReturnView}>

                <FixedHeader />

                <View style={styles.MainView}>

                    <View style={styles.ImageBG}>

                        <Image source={assets.success} style={styles.ImageStyle} />

                        <Text style={[styles.MainTextStyle, { color: this.props.PrimaryColor, }]}>

                            Congratulations!</Text>

                        <Text
                            style={[styles.SubTextStyle, { color: this.props.PrimaryColor, }]}>
                            You are successfully registred on  {'\n'}Mobile Banking Platform</Text>

                        <Text
                            style={[styles.UserIDTextStyle, { color: this.props.PrimaryColor, }]}> Your User ID is</Text>

                        <View style={styles.UserIdViewStyle}>

                            <Text style={[styles.UserIdCopyStyle, { color: this.props.textColor, }]}> {this.USERID}</Text>


                            <TouchableOpacity
                                onPress={() => this.CopyUserId()} >

                                <CopyIcon height={20} width={20} color={this.props.SecondaryColor} />

                            </TouchableOpacity>


                        </View>


                    </View>

                    <View
                        style={styles.btnViewBg}>

                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={12}
                            style={styles.btnCardViewStyle}>

                            <TouchableOpacity
                                style={[styles.btnTouchableStyle, { backgroundColor: this.props.PrimaryColor, }]}
                                onPress={() => this.toLoginPage()} >

                                <Text style={styles.btnTextStyle}>  Go to Login Page </Text>
                            </TouchableOpacity>
                        </CardView>

                        <View >
                            <Footer height={70} width={300} />
                        </View>

                    </View>

                </View>

            </View>

        );
    }
}

const styles = StyleSheet.create({


    ReturnView: {
        flex: 1,
        backgroundColor: 'white'
    },
    MainView:
    {
        flex: 1,
        alignItems: 'center',
    },
    ImageBG:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ImageStyle:
    {
        height: 106,
        width: 106,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    MainTextStyle:
    {
        alignItems: 'flex-end',
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 20,
        fontSize: 26,
        width: 250
    },
    SubTextStyle:
    {
        width: width - 45,
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 15,
        fontSize: 15,

    },
    UserIDTextStyle:
    {
        width: width - 45,
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 30,
        fontSize: 17,
    },
    UserIdViewStyle:
    {
        backgroundColor: '#EBEBEB',
        marginTop: 15,
        borderRadius: 15,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
    },
    UserIdCopyStyle:
    {
        fontFamily: strings.fontMedium,
        marginRight: 15,
        fontSize: 26,
    },
    btnViewBg:
    {
        flex: 1,
        justifyContent: 'flex-end'
    },
    btnCardViewStyle:
    {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 10
    },
    btnTouchableStyle:
    {
        padding: 15,
        width: width - 45,
        justifyContent: 'center',
        borderRadius: 12,
    },
    btnTextStyle:
    {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15
    },

});


export default connect(mapStateToProps, mapDispatchToProps)(RegistrationSuccess);
