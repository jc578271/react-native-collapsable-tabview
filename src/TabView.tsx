import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { IExternalTabView, ITabView, TabViewProps } from "./types";
import { ETabStatus } from "./types";
import { useTabRoot } from "./TabRoot";
import { _useTabView } from "./hooks/_useTabView";
import { useWindow } from "./hooks/useWindow";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { ROOT_ID } from "./constant";
import { interactManager } from "./utils/interactManager";

const Context = createContext<ITabView | null>(null);
const ExternalContext = createContext<IExternalTabView | null>(null);

export const TabView = memo(function TabItem({
  children,
  initialHeight,
  ...props
}: TabViewProps) {
  const {
    tabViewId,
    headerHeight,
    barHeight,
    animatedIndex,
    tabs,
    emptyBarHeight: parentEmptyBarHeight,
    emptyHeaderHeight: parentEmptyHeaderHeight,
    minBarTop: parentMinBarTop,
    rootIndex: parentRootIndex,
    rootAnimatedIndex: parentRootAnimatedIndex,
    staticIndex: parentStaticIndex,
  } = useTabView();

  const { label } = props;

  const value = _useTabView(false, initialHeight);

  /* style Item View */
  const { width } = useWindow();
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
    return parentEmptyHeaderHeight.value + headerHeight.value;
  }, []);

  const emptyBarHeight = useDerivedValue(() => {
    return parentEmptyBarHeight.value + barHeight.value;
  }, []);

  const minBarTop = useDerivedValue(
    () =>
      parentMinBarTop.value + value.headerHeight.value - value.barHeight.value,
    []
  );

  const rootIndex = useDerivedValue(() => {
    return parentRootIndex.value + "" + (tabs?.value?.indexOf?.(label) || "");
  }, [label]);
  const rootAnimatedIndex = useDerivedValue(
    () =>
      parentRootAnimatedIndex.value + "" + Math.round(parentStaticIndex.value),
    []
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
    [value, props]
  );

  /* external values */
  const status = useSharedValue<ETabStatus>(ETabStatus.UNMOUNTED);
  const visible = useDerivedValue(
    () => rootIndex.value === rootAnimatedIndex.value,
    []
  );

  const statusHandler = useRef<((status: ETabStatus) => void) | null>(null);
  const statusDeps = useRef<any[]>([]);

  const { animatedHeight, mountViewWhenVisible } = useTabRoot();

  const [mounted, setMounted] = useState(!mountViewWhenVisible || false);

  const externalHeaderHeight = useDerivedValue(
    () =>
      Math.max(
        emptyHeaderHeight.value - animatedHeight.value,
        emptyBarHeight.value
      ),
    []
  );

  const jsCallback = useCallback(
    (status: ETabStatus) => {
      if (mountViewWhenVisible && status === ETabStatus.MOUNTED) {
        interactManager(() => {
          setMounted(true);
          statusHandler.current?.(status)
        }, 150);
        return;
      }
      statusHandler.current?.(status);
      return;
    },
    [...statusDeps.current, mountViewWhenVisible]
  );

  const onStatusChange = useCallback(
    (handler: (status: ETabStatus) => void, deps?: any[]) => {
      statusHandler.current = handler;
      if (deps) statusDeps.current = deps;
    },
    []
  );

  useAnimatedReaction(
    () => visible.value,
    (visible) => {
      if (status.value === ETabStatus.UNMOUNTED && !visible)
        return runOnJS(jsCallback)(ETabStatus.UNMOUNTED);

      if (status.value === ETabStatus.UNMOUNTED && visible) {
        status.value = ETabStatus.MOUNTED;
        return runOnJS(jsCallback)(ETabStatus.MOUNTED);
      }

      if (visible) {
        status.value = ETabStatus.VISIBLE;
        runOnJS(jsCallback)(ETabStatus.VISIBLE);
      } else {
        status.value = ETabStatus.INVISIBLE;
        runOnJS(jsCallback)(ETabStatus.INVISIBLE);
      }
    },
    [...statusDeps.current, mountViewWhenVisible]
  );

  const externalValue = useMemo(
    () => ({
      status,
      topScrollPosition: minBarTop,
      animatedHeaderHeight: externalHeaderHeight,
      onStatusChange: onStatusChange,
    }),
    []
  );

  if (tabViewId === ROOT_ID) {
    return (
      <Context.Provider value={returnValue}>
        <ExternalContext.Provider value={externalValue}>
          {mounted ? children : null}
        </ExternalContext.Provider>
      </Context.Provider>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      <Context.Provider value={returnValue}>
        <ExternalContext.Provider value={externalValue}>
          {mounted ? children : null}
        </ExternalContext.Provider>
      </Context.Provider>
    </Animated.View>
  );
});

export const useTabView = () => {
  let value = useContext<ITabView | null>(Context);
  if (value === null) value = useTabRoot();
  if (value === null) throw new Error("wrap TabView before using");
  return value;
};

export const useExternalTabView = () => {
  let value = useContext<IExternalTabView | null>(ExternalContext);
  if (value === null) throw new Error("wrap TabView before using");
  return value;
};
