import React, {
  createContext,
  memo,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import type {IProvider} from './types';
import {_useTabView} from './hooks/_useTabView';
import {useDerivedValue, useSharedValue} from 'react-native-reanimated';
import {type NativeScrollEvent, View} from 'react-native';
import {ROOT_ID} from './constant';

const Context = createContext<IProvider | null>(null);

export const TabRoot = memo(function TabRoot({
  children,
}: PropsWithChildren<{}>) {
  /* get value same as TabView */
  const tabViewValue = _useTabView(true);

  const {headerHeight} = tabViewValue;

  const animatedScrollValue = useSharedValue(0);
  const scrollValueMap = useSharedValue<{[id: string]: number}>({});

  const onScroll = useCallback(
    (keyName: string) => (e: NativeScrollEvent) => {
      'worklet';
      animatedScrollValue.value = e.contentOffset.y;

      scrollValueMap.value = {
        ...scrollValueMap.value,
        [keyName]: e.contentOffset.y,
      };
    },
    [],
  );

  const parentHeaderHeight = useSharedValue(0);
  const parentBarHeight = useSharedValue(0);
  const parentTabs = useSharedValue<string[]>([]);
  const parentAnimatedIndex = useSharedValue(0);

  const emptyHeaderHeight = useSharedValue(0);
  const emptyBarHeight = useDerivedValue(() => headerHeight.value, []);

  const minBarTop = useDerivedValue(() => headerHeight.value, []);
  const rootIndex = useSharedValue('0');
  const rootAnimatedIndex = useSharedValue('0');

  const animatedHeight = useDerivedValue(() => {
    // const val = Math.min(
    //   0,
    //   Math.max(
    //     0 - animatedScrollValue.value,
    //     barHeight.value - headerHeight.value,
    //   ),
    // );
    //
    // if (animatedScrollValue.value - prevVal.value > 200) {
    //   return withTiming(val, {duration: 200});
    // }
    //
    // prevVal.value = animatedScrollValue.value;

    return Math.max(animatedScrollValue.value, 0);
  }, []);

  const returnValue = useMemo(
    () => ({
      label: ROOT_ID,
      animatedScrollValue,
      scrollValueMap,
      onScroll,
      animatedHeight,
      parentHeaderHeight,
      parentBarHeight,
      parentTabs,
      parentAnimatedIndex,
      emptyHeaderHeight,
      emptyBarHeight,
      minBarTop,
      rootIndex,
      rootAnimatedIndex,
      ...tabViewValue,
    }),
    [tabViewValue],
  );

  return (
    <Context.Provider value={returnValue}>
      <View style={{flex: 1, overflow: 'hidden'}}>{children}</View>
    </Context.Provider>
  );
});

export const useTabRoot = () => {
  let value = useContext<IProvider | null>(Context);
  if (value === null)
    throw new Error('wrap component with TabProvider before using');
  return value;
};
