import type { AnimatedRef, SharedValue } from "react-native-reanimated";
import type PagerView from "react-native-pager-view";
import type { NativeScrollEvent } from "react-native";
import { type ReactNode } from "react";
import Animated from "react-native-reanimated";

export interface TabViewProps {
  label: string;
  children?: ReactNode | undefined;
}

export interface IProvider extends ITabView {
  animatedScrollValue: SharedValue<number>;
  animatedHeight: SharedValue<number>;
  scrollValueMap: SharedValue<{ [id: string]: number }>;
  onScroll: (keyName: string) => (e: NativeScrollEvent) => void;
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
  pagerViewRef: AnimatedRef<PagerView & Animated.ScrollView>;
  tabViewId: string;
}

export interface IExternalTabView {
  status: Readonly<SharedValue<ETabStatus>>;
}

export interface IItemLayout {
  left: number;
  width: number;
}

export enum ETabStatus {
  UNMOUNTED = 0,
  MOUNTED = 1,
  INVISIBLE = 2,
  VISIBLE = 3
}
