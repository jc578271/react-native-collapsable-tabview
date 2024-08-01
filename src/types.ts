import type { SharedValue } from "react-native-reanimated";
import type PagerView from "react-native-pager-view";
import type { ReactNode, RefObject } from "react";
import Animated from "react-native-reanimated";
import type { NativeScrollEvent } from "react-native";
import type { NativeSyntheticEvent } from "react-native";

export interface TabViewProps {
  label: string;
  children?: ReactNode | undefined;
  initialHeight?: {
    header?: number;
    bar?: number;
  };
}

export interface IProvider extends ITabView {
  animatedScrollValue: SharedValue<number>;
  animatedHeight: SharedValue<number>;
  scrollValueMap: SharedValue<{ [id: string]: number }>;
  velocity: number;
  mountViewWhenVisible?: boolean;
  autoScrollDelay?: number;
  firstScrollDelay?: number;
}

export interface ITabView extends TabViewProps {
  currentTab: SharedValue<string | null>;
  tabs: SharedValue<string[]>;
  parentTabs: SharedValue<string[]>;
  animatedIndex: SharedValue<number>;
  parentAnimatedIndex: SharedValue<number>;
  staticIndex: SharedValue<number>;
  barHeight: SharedValue<number>;
  headerHeight: SharedValue<number>;
  parentHeaderHeight: SharedValue<number>;
  parentBarHeight: SharedValue<number>;
  emptyHeaderHeight: SharedValue<number>;
  emptyBarHeight: SharedValue<number>;
  minBarTop: SharedValue<number>;
  rootIndex: SharedValue<string>;
  rootAnimatedIndex: SharedValue<string>;
  pagerViewRef: RefObject<PagerView & Animated.ScrollView>;
  tabViewId: string;
}

export interface IExternalTabView {
  status: Readonly<SharedValue<ETabStatus>>;
  topScrollPosition: Readonly<SharedValue<number>>;
  animatedHeaderHeight: Readonly<SharedValue<number>>;
  onStatusChange: (handler: (status: ETabStatus) => void, deps?: any[]) => void;
}

export interface IItemLayout {
  left: number;
  width: number;
}

export enum ETabStatus {
  UNMOUNTED = 0,
  MOUNTED = 1,
  INVISIBLE = 2,
  VISIBLE = 3,
}

export interface IOnScroll {
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onAnimatedScroll?: (event: NativeScrollEvent) => void;
  onAnimatedBeginDrag?: (event: NativeScrollEvent) => void;
  onAnimatedEndDrag?: (event: NativeScrollEvent) => void;
  onAnimatedMomentumBegin?: (event: NativeScrollEvent) => void;
  onAnimatedMomentumEnd?: (event: NativeScrollEvent) => void;
}

export interface IScrollProps {
  disabledMinHeight?: boolean;
}
