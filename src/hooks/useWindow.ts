import {
  runOnUI,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { Dimensions, type ScaledSize } from "react-native";
import { useCallback, useEffect, useMemo } from "react";

export const useWindow = () => {
  const widthWindow = useSharedValue(Dimensions.get("window").width);
  const heightWindow = useSharedValue(Dimensions.get("window").height);

  const handleWindow = useCallback(
    ({ window: _window }: { window: ScaledSize }) => {
      runOnUI((width: number, height: number) => {
        "worklet";
        widthWindow.value = width;
        heightWindow.value = height;
      })(_window.width, _window.height);
    },
    []
  );

  useEffect(() => {
    let dimensions = Dimensions.addEventListener("change", handleWindow);
    return () => {
      dimensions.remove();
    };
  }, []);

  const width = useDerivedValue(() => widthWindow.value, []);
  const height = useDerivedValue(() => heightWindow.value, []);

  return useMemo(
    () => ({
      width,
      height,
      heightWindow,
    }),
    []
  );
};
