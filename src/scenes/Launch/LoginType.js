import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
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
} from '../../App';
import Footer from '../../assets/icons/footer.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview'
import FixedHeader from '../../components/FixedHeader';


class LoginType extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const AppTheme = this.props.AppThemeSet
        if (AppTheme === null || AppTheme === undefined || AppTheme.trim() === "") {
            this.props.setAppTheme(strings.ThemeOne)
            bgImages = appThemeConfiguration(strings.ThemeOne).splash
            this.props.setThemeColor(appThemeConfiguration(strings.ThemeOne).themeColor)
            this.props.setTextColor(appThemeConfiguration(strings.ThemeOne).textColor)
            this.props.setPrimaryColor(appThemeConfiguration(strings.ThemeOne).PrimaryColor)
            this.props.setSecondaryColor(appThemeConfiguration(strings.ThemeOne).SecondaryColor)
        }
        else {
            bgImages = appThemeConfiguration(this.props.AppThemeSet).splash
            this.props.setThemeColor(appThemeConfiguration(this.props.AppThemeSet).themeColor)
            this.props.setTextColor(appThemeConfiguration(this.props.AppThemeSet).textColor)
            this.props.setPrimaryColor(appThemeConfiguration(this.props.AppThemeSet).PrimaryColor)
            this.props.setSecondaryColor(appThemeConfiguration(this.props.AppThemeSet).SecondaryColor)
        }

    }

    toExistingUser() {
        navigation.navigate(this, 'existingUserLogin')
    }

    toNewUser() {
        navigation.navigate(this, 'registerModeScreen')
    }

    onBackAction() {
        navigation.goBack(this)
    }

    render() {
        return (
            <View style={styles.mainView}>
                <FixedHeader
                    backAction={() => this.onBackAction()}
                    color={colors.btnColor}
                />
                <View style={styles.mainSubView}>
                    <View style={styles.imagView}>
                        <Image
                            source={assets.companyImage}
                            style={styles.imgStyle} />
                        <Text style={styles.companyTitle}>
                            {strings.companyName}</Text>
                    </View>
                    <CardView
                        cardElevation={3}
                        cardMaxElevation={3}
                        cornerRadius={12}
                        style={styles.existingUserCard}>
                        <TouchableOpacity
                            style={[styles.existingUserTouchable, { backgroundColor: this.props.PrimaryColor}]}
                            onPress={() => this.toExistingUser()}
                        ><Text style={styles.existingUserText}>
                                {strings.existingUser}
                            </Text>
                        </TouchableOpacity>
                    </CardView>
                    <CardView
                        cardElevation={3}
                        cardMaxElevation={3}
                        cornerRadius={12}
                        style={styles.newUserCard}>
                        <TouchableOpacity
                           style={[styles.newUserTouchable, { backgroundColor: this.props.PrimaryColor}]}
                            onPress={() => this.toNewUser()}
                        ><Text style={styles.newUserText}>
                                {strings.newUsers}
                            </Text>
                        </TouchableOpacity>
                    </CardView>
                    <View style={styles.footerView}>
                        <Footer height={70} width={300} />
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
        backgroundColor: 'white'
    },
    mainSubView:
    {
        flex: 1,
        alignItems: 'center'
    },
    imagView:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgStyle:
    {
        height: 72,
        width: 196,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
    },
    companyTitle:
    {
        color: colors.btnColor,
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 21
    },
    existingUserCard:
    {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 20,
    },

    existingUserTouchable:
    {
        padding: 15,
        width: width - 50,
        justifyContent: 'center',
        borderRadius: 12,
    },
    existingUserText:
    {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15
    },
    newUserCard:
    {
        backgroundColor: 'gray',
        justifyContent: 'center',
    },
    newUserTouchable:
    {
        padding: 15,
        width: width - 50,
        justifyContent: 'center',
        borderRadius: 12,
    },
    newUserText:
    {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15
    },
    footerView:
    {
        justifyContent: 'flex-end',
        marginTop: 20
    },
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginType);
