import { useAnimatedRef, useSharedValue } from 'react-native-reanimated';
import { useMemo } from 'react';
import { nanoid } from 'nanoid';
import PagerView from 'react-native-pager-view';
import { ROOT_ID } from '../constant';

export const _useTabView = (isRoot?: boolean) => {
  const tabViewId = useMemo(() => isRoot ? ROOT_ID : nanoid(3), [isRoot]);
  const currentTab = useSharedValue<string | null>(null);
  const animatedIndex = useSharedValue<number>(0);
  const staticIndex = useSharedValue<number>(0);
  const tabs = useSharedValue<string[]>([]);
  const pagerViewRef = useAnimatedRef<PagerView>();

  return useMemo(
    () => ({
      tabViewId,
      currentTab,
      tabs,
      animatedIndex,
      staticIndex,
      pagerViewRef,
    }),
    [pagerViewRef, tabViewId]
  );
};
