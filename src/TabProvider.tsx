import React, {
  createContext,
  memo,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import type { IProvider } from './types';
import { _useTabView } from './hooks/_useTabView';
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { type NativeScrollEvent } from 'react-native';
import { ROOT_ID } from './constant';

const Context = createContext<IProvider | null>(null);

export const TabProvider = memo(function TabViewProvider({
  children,
}: PropsWithChildren<{}>) {
  const headerHeightMap = useSharedValue<{ [id: string]: number }>({});
  const barHeightMap = useSharedValue<{ [id: string]: number }>({});
  const headerHeight = useSharedValue(0);
  const barHeight = useSharedValue(0);
  const animatedScrollValue = useSharedValue(0);
  const scrollValueMap = useSharedValue<{ [id: string]: number }>({});

  const prevVal = useSharedValue(0);

  const animatedHeight = useDerivedValue(() => {
    const val = Math.min(
      0,
      Math.max(
        0 - animatedScrollValue.value,
        barHeight.value - headerHeight.value
      )
    );

    if (animatedScrollValue.value - prevVal.value > 200) {
      return withTiming(val, { duration: 200 });
    }

    prevVal.value = animatedScrollValue.value;
    return val;
  }, []);

  const onScroll = useCallback(
    (keyName: string) => (e: NativeScrollEvent) => {
      'worklet';
      animatedScrollValue.value = e.contentOffset.y;

      scrollValueMap.value = {
        ...scrollValueMap.value,
        [keyName]: e.contentOffset.y,
      };
    },
    []
  );

  /* get value same as TabView */
  const tabViewValue = _useTabView(true);

  const returnValue = useMemo(
    () => ({
      label: ROOT_ID,
      headerHeightMap,
      barHeightMap,
      animatedScrollValue,
      scrollValueMap,
      onScroll,
      animatedHeight,
      ...tabViewValue,
    }),
    [tabViewValue]
  );

  return <Context.Provider value={returnValue}>{children}</Context.Provider>;
});

export const useProvider = () => {
  let value = useContext<IProvider | null>(Context);
  if (value === null)
    throw new Error('wrap component with TabProvider before using');
  return value;
};
