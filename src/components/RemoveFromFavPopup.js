import React, { useState } from "react";
import Modal from "react-native-modal";

import {
  View,
  TouchableOpacity,
  Platform,
  Linking,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import CardView from "react-native-cardview";
// import Arrowdown from '../../assets/icons/dashboardIcons/arrow_down.svg'
import { assets, colors, strings, width } from "../App";
import { useNavigation } from "@react-navigation/native";
// import Colors from '../common/Colors';

import RemoveFromFav from "../assets/icons/RemoveFromFav.svg";
import Constants from "../common/Constants";
import { _toEncrypt, sendData } from "../common/util";
import APIUrlConstants from "../common/APIUrlConstants";

import { RFValue } from "react-native-responsive-fontsize";

export const RemoveFromFavPopup = ({
  isVisible,
  isDisabled,
  MenuName,
  obj,
}) => {
  const navigation = useNavigation();
  const [menuAdded, setMenuAdded] = useState(true);
  const [ResMSG, setResMSG] = useState("");
  const sendRequest = async () => {
    try {
      const Headers = {
        ProdCD: Constants.ProdCD,
        BankCD: Constants.BankCode,
        OprCD: "REMFMENU",
        Content_Type: "application/json",
        REQ_TYPE: "POST",
      };
      const reqParams = {
        Menu_ID: MenuName.MENU_ID,
        GMST_CODE: Constants.GMST_CODE,
      };
      const Body = {
        PARACNT: "1",
        PARA1_TYP: "STR",
        PARA1_VAL: JSON.stringify(reqParams),
      };
      sendData(
        obj,
        "post",
        APIUrlConstants.BASE_URL,
        Headers,
        JSON.stringify(Body),
        async (obj, response) => {
        
          let res = response.SUCCESS;
          if (res === "FALSE") {
            setResMSG(response.RESULT);
            setMenuAdded(false);
            setTimeout(() => {
              isDisabled();
            }, 2000);
          } else if (res === "TRUE") {
            setResMSG(response.RESULT);
            setMenuAdded(false);
            setTimeout(() => {
              isDisabled();
            }, 2000);
          }
        }
      );
    } catch (error) {
      console.error("Error in API:", error);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.8}
      onBackdropPress={() => isDisabled()}
      onBackButtonPress={() => isDisabled()}
      animationIn={"fadeIn"}
      animationInTiming={500}
      animationOut={"fadeOut"}
      animationOutTiming={100}
    >
      <View>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <CardView
              style={styles.cardContainer}
              cardElevation={2}
              cardMaxElevation={2}
              cornerRadius={8}
            >
              {menuAdded ? (
                <View style={styles.contentContainer}>
                  <View style={styles.iconWrapper}>
                    <RemoveFromFav height={35} width={35}></RemoveFromFav>
                  </View>
                  <Text style={styles.text}>
                    Remove "{MenuName.MENU_NAME}" from your Favourite?
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.cancelbtn}
                      onPress={() => isDisabled()}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.confirmbtn}
                      onPress={() => sendRequest()}
                    >
                      <Text style={styles.confirmbtntext}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View
                style={styles.successView}
                >
                  <Image
                    source={assets.success}
                    style={styles.successImg}
                  />

                  <Text
                     style={styles.warnMsg}
                  >
                    "{MenuName.MENU_NAME}" {ResMSG.toLowerCase()}
                  </Text>
                </View>
              )}
            </CardView>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContent: {
    padding: 8,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "white",
  },
  cardContainer: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  contentContainer: {
    padding: 10,
    marginHorizontal: 19,
    alignItems: "center",
  },
  iconWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "pink",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: RFValue(15),
    fontWeight: "500",
    fontFamily: "SF UI Display",
    color: "#252525",
    textAlign: "left",
    opacity: 0.8,
    marginTop: 15,
    textAlign: "center",
    width: width - 60,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  cancelbtn: {
    width: width - 50,
    borderColor: colors.btnColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    flex: 1,
    marginRight: 9,
    borderWidth: 1,
    height: 40,
  },
  buttonText: {
    alignSelf: "center",
    fontFamily: strings.fontBold,
    fontSize: 15,
    color: "#252525",
  },
  confirmbtn: {
    width: width - 50,
    backgroundColor: colors.btnColor,
    justifyContent: "center",
    borderRadius: 12,
    flex: 1,
    height: 40,
  },
  confirmbtntext: {
    alignSelf: "center",
    color: "white",
    fontFamily: strings.fontBold,
    fontSize: 15,
  },
  successView:{
    justifyContent: "center",
    alignItems: "center",
  },
  successImg:{
    height: 85,
    width: 85,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  warnMsg:{
    width: width - 80,
    color: "#252525",
    textAlign: "center",
    fontFamily: strings.fontMedium,
    fontSize: RFValue(15),
    opacity: 0.8,
    marginBottom: 15,
  }
});
