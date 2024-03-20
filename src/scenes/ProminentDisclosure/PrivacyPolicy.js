import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import {
  strings,
  connect,
  mapStateToProps,
  mapDispatchToProps,
  navigation,
} from '../../App';
import Footer from '../../assets/icons/footer.svg';
import FixedHeader from '../../components/FixedHeader';
import { ScrollView } from 'react-native-gesture-handler';
import PrivacyIcon from '../../assets/icons/privacyPolicy.svg'


class PrivacyPolicy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CompanyName: 'Netwin Demo For Co-operative Bank',
    };
  }

  onBackAction() {
    navigation.goBack(this)
  }

  render() {
    return (
      <View style={styles.mainView}>
        <FixedHeader backAction={() => this.onBackAction()} color={this.props.textColor} />
        <View style={styles.mainSubView}>
          <View style={styles.mainOneView}>
            <Text style={[styles.MainHeading, { color: this.props.PrimaryColor }]}>
              Privacy Policy
            </Text>
            <ScrollView style={styles.scrollViewStyle}>
              <View style={styles.textViewStyle}>
                <PrivacyIcon height={110} width={110} fill={this.props.themeColor} />
                <Text style={[styles.SubHeading, { color: this.props.PrimaryColor, marginTop: 10 }]}>
                  {this.state.CompanyName}
                </Text>
                <Text style={styles.NormalText}>
                  Welcome to the {this.state.CompanyName} App's Privacy Policy. We prioritize the protection of your personal information and are committed to ensuring your privacy. This policy outlines how we collect, use, and safeguard your data when you use our mobile app services. By accessing and using our apps, you agree to the terms outlined in this policy.
                </Text>
                <Text style={[styles.SubHeading, { color: this.props.PrimaryColor, marginTop: 10 }]}>
                  Preamble
                </Text>
                <Text style={styles.NormalText}>
                  "This Mobile app Privacy Policy (“Policy”) applies to users of mobile apps with “{this.state.CompanyName} in any mobile  application that we own and control. In this Policy, the term '{this.state.CompanyName},' refers to our affiliates or subsidiaries. This Policy describes how the mobile  application collects, uses, and shares information from or about you, and explains how the information may be shared or used."
                </Text>
                <Text style={[styles.SubHeading, { color: this.props.PrimaryColor, marginTop: 10 }]}>
                  Contact List Permission:
                </Text>
                <Text style={styles.NormalText}>
                  The App requests permission to collect your contact list to facilitate mobile recharge services for friends, and family. This enables the automatic detection of reference information from your contact list during runtime, making it convenient to recharge mobiles and make bill payments for your contacts.
                </Text>
                <Text style={[styles.SubHeading, { color: this.props.PrimaryColor, marginTop: 10 }]}>
                  Storage Permission:
                </Text>
                <Text style={styles.NormalText}>
                  Mobile Banking App accesses the Internal Storage of the user to store Documents such as mini statement & QR code image. Additionally, it temporarily scan/collects QR code images locally in APP to enable easy QR based UPI scan and pay functionality. When users need to make payments, they can use saved QR codes for a seamless payment experience. No images are transferred to server.
                </Text>
                <Text style={[styles.SubHeading, { color: this.props.PrimaryColor, marginTop: 10 }]}>
                  Phone State Permission:
                </Text>
                <Text style={styles.NormalText}>
                  Purpose: Device Authentication
                  {'\n'}Usage: The Phone state permission is employed for security purposes, specifically for device authentication. This helps in registering and identifying the device securely within the {this.state.CompanyName} Mobile App.
                </Text>
                <Text style={[styles.SubHeading, { color: this.props.PrimaryColor, marginTop: 10 }]}>
                  Phone Call Permission:
                </Text>
                <Text style={styles.NormalText}>
                  The Loan Recovery App utilizes this permission to enable recovery officers to call loan holders for the purpose of loan recovery.
                </Text>
                <Text style={[styles.SubHeading, { color: this.props.PrimaryColor, marginTop: 10 }]}>
                  Camera Permission:
                </Text>
                <Text style={styles.NormalText}>
                  For the convenient Scan and Pay facility, we request access to your device's camera. This permission allows you to scan QR codes effortlessly, ensuring a secure and efficient payment process, also the camera maybe used to take pictures of documents or mortgages.
                </Text>
                <Text style={[styles.SubHeading, { color: this.props.PrimaryColor, marginTop: 10 }]}>
                  Location:
                </Text>
                <Text style={styles.NormalText}>
                  App utilizes location permission to enhance security and prevent fraud. This feature ensures user safety and facilitates geo coordinate based login process.
                </Text>
                <Text style={[styles.SubHeading, { color: this.props.PrimaryColor, marginTop: 10 }]}>
                  Voice Command:
                </Text>
                <Text style={styles.NormalText}>
                  App provides the option to use mobile app services through voice commands. We use voice recognition technology solely for this purpose, ensuring a hands-free and accessible banking experience. Your voice data is processed securely and is not shared with external parties.
                </Text>
                <Text style={[styles.SubHeading, { color: this.props.PrimaryColor, marginTop: 10 }]}>
                  Log Data:
                </Text>
                <Text style={styles.NormalText}>
                  App may collect log data for analytical purposes, helping us improve the app's performance and user experience. Log Data maybe used for debugging and security checking of our app. This information may be used by our developers to identify and resolve technical issues and failures. Log data does not personally identify you.
                </Text>
                <Text style={[styles.SubHeading, { color: this.props.PrimaryColor, marginTop: 10 }]}>
                  Children's Privacy:
                </Text>
                <Text style={styles.NormalText}>
                  Usage of  Mobile app is not allowed to the  children under the age of 18 and use of our Platform is available only to persons who can form a legally binding contract. If you are under the age of 18 years then you must use the Platform or services under the supervision of your parent, legal guardian, or any responsible adult.
                </Text>
                <Text style={[styles.SubHeading, { color: this.props.PrimaryColor, marginTop: 10 }]}>
                  Data Sharing:
                </Text>
                <Text style={styles.NormalText}>
                  We do not sell or trade your information to third parties. We may share your necessary information with third party API service providers to enhance user experience and provide you advanced services or as required by law.
                </Text>
                <Text style={[styles.SubHeading, { color: this.props.PrimaryColor, marginTop: 10 }]}>
                  Security Measures:
                </Text>
                <Text style={styles.NormalText}>
                  We take appropriate measures to protect your information from unauthorized access, alteration, disclosure, or destruction.
                </Text>
                <Text style={[styles.SubHeading, { color: this.props.PrimaryColor, marginTop: 10 }]}>
                  Service Providers :
                </Text>
                <Text style={styles.NormalText}>
                  {this.state.CompanyName} collaborates with trusted service providers to enhance its operations. These partners play a crucial role in efficiently delivering a range of services on behalf of {this.state.CompanyName}.
                </Text>
                <Text style={[styles.SubHeading, { color: this.props.PrimaryColor, marginTop: 10 }]}>
                  Ownership and Data Processing Rights:
                </Text>
                <Text style={styles.NormalText}>
                  Mobile app is owned by {this.state.CompanyName}. {this.state.CompanyName} has got this app developed & published by Netwin Systems & Software (I) Pvt ltd. It is essential to clarify that Netwin does not hold any rights over data processing, storage, or control within the mobile app.
                </Text>
                <Text style={styles.NormalText}>
                  All user data collected, processed, or stored within this mobile app is the sole responsibility of {this.state.CompanyName}. Any data  processing activities and storage  of data are fully controlled by {this.state.CompanyName}.
                </Text>
                <Text style={[styles.SubHeading, { color: this.props.PrimaryColor, marginTop: 10 }]}>
                  Changes to this Privacy Policy:
                </Text>
                <Text style={styles.NormalText}>
                  We reserve the right to modify this Privacy Policy at any time. Changes will be effective immediately upon posting on our website/ app/ play store. We encourage you to review this Privacy Policy regularly for updates.
                </Text>
                <Text style={[styles.SubHeading, { color: this.props.PrimaryColor, marginTop: 10 }]}>
                  Contact Information:
                </Text>
                <Text style={styles.NormalText}>
                  If you have any questions or concerns about this Privacy Policy, please feel free to contact us at our branch.
                  {'\n'}By using our mobile app, you agree to the terms outlined in this Privacy Policy. If you disagree with our mobile app privacy policy please uninstall and stop using the app.
                </Text>
              </View>
            </ScrollView>
          </View>
          <View style={styles.footerMainView}>
            <View style={styles.footerMainSubeView}>
              <Footer height={70} width={300} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  MainHeading:
  {
    fontSize: 25,
    textAlign: 'left',
    marginLeft: 10,
    padding: 20,
    fontFamily: strings.fontBold,
  },

  SubHeading:
  {
    fontSize: 18,
    textAlign: 'left',
    fontFamily: strings.fontBold,
    alignItems: 'flex-start'
  },

  NormalText:
  {
    fontSize: 14,
    textAlign: 'justify',
    padding: 5,
    fontFamily: strings.fontMedium,
    color: "#686868",

  },
  mainView:
  {
    flex: 1,
    backgroundColor: 'white'
  },
  mainSubView:
  {
    flex: 1,
  },
  mainOneView:
  {
    flex: 1,
    alignItems: 'center',
  },
  scrollViewStyle:
  {
    marginTop: 20
  },
  textViewStyle:
  {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  footerMainView:
  {
    alignItems: 'center',
  },
  footerMainSubeView:
  {
    justifyContent: 'flex-end'
  }
})



export default connect(mapStateToProps, mapDispatchToProps)(PrivacyPolicy);