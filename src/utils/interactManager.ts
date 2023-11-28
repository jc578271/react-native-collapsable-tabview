import { InteractionManager } from "react-native";

export const interactManager = (
  fn: () => void,
  wait: number = 0,
  timeout?: { current: any }
) => {
  return InteractionManager.runAfterInteractions(() => {
    if (timeout) {
      if (timeout.current !== null) {
        clearTimeout(timeout.current);
      }

      timeout.current = setTimeout(() => {
        fn();
      }, wait);
    } else {
      setTimeout(() => {
        fn();
      }, wait);
    }
  });
};
