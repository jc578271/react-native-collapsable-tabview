import React, {
  createContext,
  memo,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import type {IExternalTabView, ITabView, TabViewProps} from './types';
import {useTabRoot} from './TabRoot';
import {_useTabView} from './hooks/_useTabView';
import {useWindow} from './hooks/useWindow';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import {ROOT_ID} from './constant';

const Context = createContext<ITabView | null>(null);
const ExternalContext = createContext<IExternalTabView | null>(null);

export const TabView = memo(function TabItem({
  children,
  ...props
}: PropsWithChildren<TabViewProps>) {
  const {
    tabViewId,
    headerHeight,
    barHeight,
    animatedIndex,
    tabs,
    emptyBarHeight: parentEmptyBarHeight,
    minBarTop: parentMinBarTop,
    rootIndex: parentRootIndex,
    rootAnimatedIndex: parentRootAnimatedIndex,
    staticIndex: parentStaticIndex,
  } = useTabView();

  const {label} = props;

  const value = _useTabView();

  /* style Item View */
  const {width} = useWindow();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  }, []);

  /* parent value */
  const parentHeaderHeight = useDerivedValue(() => headerHeight.value, []);
  const parentBarHeight = useDerivedValue(() => barHeight.value, []);
  const parentTabs = useDerivedValue(() => tabs.value, []);
  const parentAnimatedIndex = useDerivedValue(() => animatedIndex.value, []);

  const emptyHeaderHeight = useDerivedValue(() => {
    return parentEmptyBarHeight.value + parentBarHeight.value;
  }, []);

  const emptyBarHeight = useDerivedValue(() => {
    return emptyHeaderHeight.value + value.headerHeight.value;
  }, []);

  const minBarTop = useDerivedValue(
    () => parentMinBarTop.value + value.headerHeight.value,
    [],
  );

  const rootIndex = useDerivedValue(() => {
    return parentRootIndex.value + '' + tabs.value.indexOf(label);
  }, [label]);
  const rootAnimatedIndex = useDerivedValue(
    () =>
      parentRootAnimatedIndex.value + '' + Math.round(parentStaticIndex.value),
    [],
  );

  const returnValue = useMemo(
    () => ({
      parentTabs,
      parentHeaderHeight,
      parentBarHeight,
      parentAnimatedIndex,
      emptyHeaderHeight,
      emptyBarHeight,
      minBarTop,
      rootIndex,
      rootAnimatedIndex,
      ...value,
      ...props,
    }),
    [value, props],
  );

  /* external values */
  const visible = useDerivedValue(
    () => rootIndex.value === rootAnimatedIndex.value,
    [],
  );
  const [mounted, setMounted] = useState(false);

  useAnimatedReaction(
    () => visible.value,
    visible => {
      if (!mounted && visible) {
        runOnJS(setMounted)(true);
      }
    },
    [],
  );

  const externalValue = useMemo(
    () => ({
      visible,
      mounted,
    }),
    [mounted],
  );

  if (tabViewId === ROOT_ID) {
    return (
      <Context.Provider value={returnValue}>
        <ExternalContext.Provider value={externalValue}>
          {children}
        </ExternalContext.Provider>
      </Context.Provider>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      <Context.Provider value={returnValue}>
        <ExternalContext.Provider value={externalValue}>
          {children}
        </ExternalContext.Provider>
      </Context.Provider>
    </Animated.View>
  );
});

export const useTabView = () => {
  let value = useContext<ITabView | null>(Context);
  if (value === null) value = useTabRoot();
  if (value === null) throw new Error('wrap TabView before using');
  return value;
};

export const useExternalTabView = () => {
  let value = useContext<IExternalTabView | null>(ExternalContext);
  if (value === null) throw new Error('wrap TabView before using');
  return value;
};
