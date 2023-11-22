import { useDerivedValue } from 'react-native-reanimated';
import { useProvider } from 'react-native-collapsable-tabview';
import { ROOT_ID } from '../constant';

export const useAutoScroll = () => {
  const { headerHeightMap, barHeightMap } = useProvider();

  const totalHeaderHeight = useDerivedValue(
    () =>
      Object.values(headerHeightMap.value).reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      ),
    []
  );

  const totalBarHeight = useDerivedValue(
    () =>
      Object.values(barHeightMap.value).reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      ),
    []
  );

  const minHeight = useDerivedValue(
    () =>
      (barHeightMap.value[ROOT_ID] || 0) -
      (headerHeightMap.value[ROOT_ID] || 0),
    []
  );
};
