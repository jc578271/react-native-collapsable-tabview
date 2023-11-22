import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  contentStyle: {
    flexDirection: 'row',
    flex: 1,
  },
  barItem: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'scroll',
    zIndex: 1,
  },
  underline: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'black',
    bottom: 0,
  },
});
