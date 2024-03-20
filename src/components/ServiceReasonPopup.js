import React from "react";
import Modal from "react-native-modal";
import {
  FlatList,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import CardView from "react-native-cardview";
import Arrowdown from "../assets/icons//dashboardIcons/arrow_down.svg";
import { colors, strings } from "../App";

export function ServiceReasonPopup(
  isVisible,
  accTypes,
  onSelectAccount,
  labelText,
  labelValue
) {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.8}
      onBackdropPress={() => onSelectAccount(labelValue)}
      onBackButtonPress={() => onSelectAccount(labelValue)}
      animationIn={"fadeIn"}
      animationInTiming={500}
      animationOut={"fadeOut"}
      animationOutTiming={100}
    >
      <View style={styles.modalContainer}>
        <CardView
          style={styles.cardContainer}
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={8}
        >
          <View style={styles.headerView}>
            <View style={styles.labelView}>
              <React.Fragment>
                <Text style={styles.labelText}>{labelText}</Text>
                <Text style={styles.labelValueText}>{labelValue}</Text>
              </React.Fragment>
            </View>
            <View style={styles.iconContainer}>
              <Arrowdown height={15} width={15} />
            </View>
          </View>
        </CardView>
        <FlatList
          data={accTypes}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          style={styles.flatListStyle}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                console.log(isVisible);
                onSelectAccount(item.label);
              }}
            >
              <View style={styles.listItemContainer}>
                <View style={styles.labelView}>
                  <Text style={styles.listItemText}>{item.label}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    borderRadius: 8,
    backgroundColor: "#DCDCDC80",
  },
  cardContainer: {
    height: 45,
    width: "100%",
    borderRadius: 8,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  labelText: {
    color: "#25252580",
    marginLeft: 15,
    fontSize: 10,
    fontFamily: strings.fontMedium,
  },
  labelValueText: {
    color: "#252525",
    marginLeft: 15,
    fontSize: 15,
    fontFamily: strings.fontMedium,
  },
  separator: {
    height: 0.5,
    width: "90%",
    backgroundColor: colors.backgroundColor,
    alignSelf: "center",
  },
  listItemContainer: {
    flexDirection: "row",
  },
  flatListStyle: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 10,
  },
  listItemText: {
    color: "#252525",
    padding: 10,
  },
  iconContainer: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  labelView: {
    flex: 1
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
  },
});
