import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  contentStyle: {
    flexDirection: "row",
    flex: 1,
  },
  barItem: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "scroll",
    zIndex: 2,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "scroll",
    zIndex: 1,
  },
  underline: {
    position: "absolute",
    height: 2,
    backgroundColor: "black",
    bottom: 0,
  },

  underlineWithGap: {
    position: "absolute",
    height: "100%",
    zIndex: -1,
  },
  defaultUnderlineWithGap: {
    backgroundColor: "black",
    opacity: 0.4,
    borderRadius: 50,
  },
});
