import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    ImageBackground,
    StyleSheet,
    BackHandler,
    TouchableOpacity,
} from 'react-native'
import {
    colors,
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    navigation,
    appThemeConfiguration,
    sendData,
} from '../../App';


class PTPM_RegPage extends Component {
    constructor(props) {
        super(props);

        this.state =
        {

        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        navigation.goBack(this)
        return true;
    }

    onBackAction() {
        navigation.goBack(this)
    }


    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg3


    render() {

        return (

            <View style={styles.flexOne}>

                <ImageBackground style={styles.flexOne}
                    source={this.bgImage}
                    resizeMode='cover'>

                    <KeyboardAvoidingView
                        style={styles.mainView}
                        behavior={Platform.OS === 'ios' ? 'padding' : ''}
                        enabled={true}>

                        <View style={styles.HeaderBg}>
                            <TrasnsperantFixedHeader
                                backAction={() => this.onBackAction()}
                            />


                        </View>


                    </KeyboardAvoidingView>

                </ImageBackground>


            </View>

        );
    }


}


export default connect(mapStateToProps, mapDispatchToProps)(PTPM_RegPage);


const styles = StyleSheet.create({


    flexOne:
    {
        flex: 1,
    },
    mainView:
    {
        flex: 1
    },

})