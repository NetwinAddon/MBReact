import React from "react";
import Modal from "react-native-modal";

import { FlatList, View, TouchableOpacity, Text } from "react-native";
import CardView from "react-native-cardview";
import { colors, strings } from "../App";
export function SpeakCommandPopup(
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
      <View style={styles.container}>
        <CardView
          style={styles.cardContainer}
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={8}
        >
          <View style={styles.flatListItem}>
            <View style={styles.TextContainer}>
              <React.Fragment>
                <Text style={styles.labelText}>{labelText}</Text>
              </React.Fragment>
            </View>
          </View>
        </CardView>
        {labelText === 'Commands Languages' ?
         ( <FlatList
            data={accTypes}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            style={styles.flatList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelectAccount(item.LangName);
                }}
              >
                <View style={styles.flatListItem}>
                  <View style={styles.TextContainer}>
                    <Text style={styles.flatListItemText}>{item.LangName}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />):  (
            <FlatList
            data={accTypes}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            style={styles.flatList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelectAccount(item.label);
                }}
              >
                <View style={styles.flatListItem}>
                  <View style={styles.TextContainer}>
                    <Text style={styles.flatListItemText}>{item.label}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        
      </View>
    </Modal>
  );
}

const styles = {
  container: {
    borderRadius: 8,
    backgroundColor: "#DCDCDC80",
    // padding: 12,
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
    color: "#1F3C66",
    fontWeight: "800",
   
    fontSize: 14,
    fontFamily: strings.fontMedium,
    textAlign: "center",
  },
  flatList: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 10,
  },
  flatListItem: {
    flexDirection: "row",
  },
  TextContainer: {
    flex: 1,
  },
  flatListItemText: {
    color: "#252525",
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 5,
    paddingLeft: 10,
    fontSize: 12,
  },
  separator: {
    height: 0.5,
    width: "90%",
    backgroundColor: colors.backgroundColor,
    alignSelf: "center",
  },
};
