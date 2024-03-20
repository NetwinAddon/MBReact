import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
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


class RegistrationFail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.screenWidth = Dimensions.get("window").width;




    }
    componentDidMount() {
        console.log('props', this.props)


    }


    toLoginPage() {

        navigation.navigate(this, 'loginType')
    }


    render() {
        return (
            <View style={styles.ReturnView}>

                <FixedHeader />

                <View style={styles.MainView}>

                    <View style={styles.ImageBG}>

                        <Image source={assets.Error} style={styles.ImageStyle} />

                        <Text style={[styles.MainTextStyle, { color: this.props.PrimaryColor, }]}>
                            Failed !</Text>

                        <Text
                            style={[styles.SubTextStyle, { color: this.props.PrimaryColor, }]}>
                            Please Try Again.</Text>



                    </View>

                    <View style={styles.btnViewBg}>

                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={12}
                            style={styles.btnStyle}>

                            <TouchableOpacity
                                style={styles.btnTouchableStyle}
                                onPress={() => this.toLoginPage()} >

                                <Text style={styles.btnTextStyle}> Go to Login Page </Text>
                                
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

    btnViewBg:
    {
        flex: 1,
        justifyContent: 'flex-end'
    },
    btnStyle:
    {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 10
    },
    btnTouchableStyle:
    {
        padding: 15,
        width: width - 45,
        backgroundColor: colors.btnColor,
        justifyContent: 'center',
        borderRadius: 12,
    },
    btnTextStyle:
    {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15
    }


})


export default connect(mapStateToProps, mapDispatchToProps)(RegistrationFail);
