import { runOnUI, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { Dimensions, type ScaledSize } from 'react-native';
import { useCallback, useEffect, useMemo } from 'react';

export const useWindow = () => {
  const window = useSharedValue(Dimensions.get("window"));
  const heightWindow = useSharedValue(Dimensions.get("window").height);

  const handleWindow = useCallback(
    ({ window: _window }: { window: ScaledSize }) => {
      "worklet";
      window.value = _window;
    },
    []
  );

  useEffect(() => {
    Dimensions.addEventListener("change", runOnUI(handleWindow));
  }, []);

  const width = useDerivedValue(
    () =>
      window.value.width < window.value.height
        ? window.value.width
        : window.value.height,
    []
  );
  const height = useDerivedValue(
    () =>
      window.value.width < window.value.height
        ? heightWindow.value
        : window.value.width,
    []
  );

  return useMemo(
    () => ({
      width,
      height,
      heightWindow,
    }),
    []
  );
};
