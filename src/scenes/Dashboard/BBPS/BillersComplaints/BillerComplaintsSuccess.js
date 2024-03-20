import React, { Component } from "react";
import {
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Animated,
  Image,
  Button,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import Footer from "../../../../assets/icons/footer.svg";

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
} from "../../../../App";
import CardView from "react-native-cardview";
import FixedHeader from "../../../../components/FixedHeader";

class BillerComplaintsSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.screenWidth = Dimensions.get("window").width;
  }
  componentDidMount() {
    console.log("props", this.props);
  }

  toLoginPage() {
    navigation.navigate(this, "mainLogin");
  }

  render() {
    return (
      <View style={styles.container}>
        <FixedHeader />
        <View style={styles.mainContentContainer}>
          <View style={styles.imageContainer}>
            <Image source={assets.success} style={styles.image} />
            <Text style={[styles.title, { color: this.props.textColor }]}>
            Biller Complaint
            </Text>
            <Text
              style={[styles.successMessage, { color: this.props.textColor }]}
            >
              Successfully Registered
            </Text>
            <Text style={[styles.complaintId, { color: this.props.textColor }]}>
              Complaint ID: 8548585
            </Text>
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                You can track status of your complaint using your complaint id.
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CardView
              cardElevation={3}
              cardMaxElevation={3}
              cornerRadius={12}
              style={styles.cardView}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  this.props.navigation.navigate("billersComplaintsHomeScreen")
                }
              >
                <Text style={styles.buttonText}>Back to Menu</Text>
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
    backgroundColor: "white",
  },
  mainContentContainer: {
    flex: 1,
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 106,
    width: 106,
    marginVertical: 20,
  },
  title: {
    textAlign: "center",
    fontFamily: strings.fontMedium,
    marginTop: 20,
    fontSize: 26,
    width: 250,
  },
  successMessage: {
    width: width - 45,
    textAlign: "center",
    fontFamily: strings.fontMedium,
    marginTop: 15,
    fontSize: 15,
  },
  complaintId: {
    width: width - 45,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "SF UI Display",
    color: "#1f3c66",
    textAlign: "center",
    marginTop: 50,
  },
  infoContainer: {
    borderRadius: 15,
    backgroundColor: "#f4f5fa",
    padding: 8,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "SF UI Display",
    color: "#1f3c66",
    textAlign: "center",
    width: width - 70,
  },
  buttonContainer: {
    justifyContent: "flex-end",
    marginVertical: 10,
  },
  button: {
    padding: 15,
    width: width - 45,
    backgroundColor: colors.btnColor,
    justifyContent: "center",
    borderRadius: 12,
  },
  cardView:{ backgroundColor: "gray", justifyContent: "center" },
  buttonText: {
    alignSelf: "center",
    color: "white",
    fontFamily: strings.fontRegular,
    fontSize: 15,
  },
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BillerComplaintsSuccess);
