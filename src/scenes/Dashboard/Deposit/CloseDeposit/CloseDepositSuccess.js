import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    SafeAreaView,
    Animated,
    Image,
    Button,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Footer from '../../../../assets/icons/footer.svg';


import {
    colors,
    strings,
    assets,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    okDialog,
    RenderOkDialog,
    width,
    navigation,
} from '../../../../App';
import CardView from 'react-native-cardview';
import FixedHeader from '../../../../components/FixedHeader';


class CloseDespositSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.screenWidth = Dimensions.get("window").width;


    }
    componentDidMount() {

        setTimeout(() => {

            this.submit();

        }, 1500);
    }

    submit() {
        this.props.navigation.navigate('DTHHomeScreen')
        navigation.goBack(this)
    }


    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }}>

                <FixedHeader

                />
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                }}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        // backgroundColor: 'red',
                        alignItems: 'center'
                    }}>
                        <Image
                            source={assets.success}
                            style={{
                                height: 106,
                                width: 106,
                                justifyContent: 'center',
                                alignItems: 'center',

                                marginVertical: 20,
                                // backgroundColor: 'blue'


                            }}
                        />
                        <Text style={{
                            color: this.props.textColor,
                            alignItems: 'flex-end',
                            textAlign: 'center',
                            fontFamily: strings.fontMedium,
                            marginTop: 20,
                            fontSize: 24,
                            width: width - 60,
                            fontWeight: '800'
                        }}>
                            Deposit Account Has Been Closed Successfully</Text>
                        <Text
                            style={{
                                width: width - 45,
                                color: this.props.textColor,
                                // alignItems: 'flex-end',
                                textAlign: 'center',
                                fontFamily: strings.fontMedium,
                                marginTop: 15,
                                fontSize: 15,

                            }}>
                            Receipt Generated Please Download</Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            // backgroundColor : 'red',
                            justifyContent: 'flex-end'
                        }}>
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={12}
                            style={{
                                backgroundColor: 'gray',
                                justifyContent: 'center',
                                marginVertical: 10
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    padding: 15,
                                    width: width - 45,
                                    backgroundColor: colors.btnColor,
                                    justifyContent: 'center',
                                    borderRadius: 12,
                                }}
                                onPress={() => this.props.navigation.navigate('closeDepositHomeScreen')}
                            ><Text style={{
                                alignSelf: 'center',
                                color: 'white',
                                fontFamily: strings.fontRegular,
                                fontSize: 15
                            }}>
                                  Home
                                </Text>
                            </TouchableOpacity>
                        </CardView>

                        {/* <TouchableOpacity style={{
                            justifyContent: 'flex-end',
                            marginBottom: 20
                        }}>
                            <Text
                                style={{
                                    // width: width - 45,
                                    color: this.props.textColor,
                                    // alignItems: 'flex-end',
                                    textAlign: 'center',
                                    fontFamily: strings.fontMedium,
                                    // padding : 15,
                                    fontSize: 15,
                                }}
                            >Back To Main Menu</Text>
                        </TouchableOpacity> */}



                        <View style={{
                            // justifyContent: 'flex-end',
                            // marginTop: 20
                        }}>
                            <Footer height={70} width={300} />
                        </View>

                    </View>

                </View>

            </View>

        );
    }
}




export default connect(mapStateToProps, mapDispatchToProps)(CloseDespositSuccess);
