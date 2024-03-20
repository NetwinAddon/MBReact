import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    StyleSheet
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


class MpinSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.screenWidth = Dimensions.get("window").width;


    }
    componentDidMount() {
        console.log('props', this.props)
    }


    toLoginPage() {
        navigation.navigate(this, 'mainLogin')
    }


    render() {
        return (
            <View style={styles.MainViewBg}>

                <FixedHeader />

                <View style={styles.MainViewBgTwo}>

                    <View style={styles.SubMainViewBg}
                    >
                        <Image
                            source={assets.success}
                            style={styles.ImageBg}
                        />
                        <Text style={[styles.MainTextStyle, { color: this.props.textColor, }]}>  Congratulations!</Text>

                        <Text
                            style={[styles.SubTextStyle, { color: this.props.textColor, }]}>

                            You have successfully created mPIN.</Text>
                    </View>

                    <View
                        style={styles.BtnViewBg}
                    >
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={12}
                            style={styles.CardViewStyle}>

                            <TouchableOpacity
                                style={styles.CardViewTouchableStyle}
                                onPress={() => this.toLoginPage()}  >
                                
                                <Text style={styles.CardTextStyle}>  Go to Login Page  </Text>
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

    MainViewBg:
    {
        flex: 1,
        backgroundColor: 'white'
    },
    MainViewBgTwo:
    {
        flex: 1,
        alignItems: 'center',
    },
    SubMainViewBg:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ImageBg:
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

    BtnViewBg:
    {
        flex: 1,
        justifyContent: 'flex-end'
    },
    CardViewStyle:
    {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 10
    },
    CardViewTouchableStyle:
    {
        padding: 15,
        width: width - 45,
        backgroundColor: colors.btnColor,
        justifyContent: 'center',
        borderRadius: 12,
    },
    CardTextStyle:
    {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15
    },
});



export default connect(mapStateToProps, mapDispatchToProps)(MpinSuccess);
