import type { AnimatedRef, SharedValue } from 'react-native-reanimated';
import type PagerView from 'react-native-pager-view';
import type { NativeScrollEvent } from 'react-native';
import { type ReactNode } from 'react';

export interface TabViewProps {
  label: string;
  children?: ReactNode | undefined;
}

export interface IProvider extends ITabView {
  headerHeightMap: SharedValue<{ [id: string]: number }>;
  barHeightMap: SharedValue<{ [id: string]: number }>;
  animatedScrollValue: SharedValue<number>;
  animatedHeight: SharedValue<number>;
  scrollValueMap: SharedValue<{ [id: string]: number }>;
  onScroll: (keyName: string) => (e: NativeScrollEvent) => void;
}

export interface ITabView extends TabViewProps{
  currentTab: SharedValue<string | null>;
  tabs: SharedValue<string[]>;
  animatedIndex: SharedValue<number>;
  staticIndex: SharedValue<number>;
  pagerViewRef: AnimatedRef<PagerView>;
  tabViewId: string;
}

export interface IItemLayout {
  left: number;
  width: number;
}
