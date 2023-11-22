import React, { memo, type PropsWithChildren, useCallback } from 'react';
import { useTabView } from './TabView';
import { usePageScrollHandler } from './hooks/usePageScrollHandler';
import Animated from 'react-native-reanimated';
import RNPagerView, { type PagerViewProps } from 'react-native-pager-view';

const AnimatedPagerView = Animated.createAnimatedComponent(RNPagerView);

export const PagerView = memo(function TabViewPagerView({
  children,
  ...props
}: PropsWithChildren<PagerViewProps>) {
  const { animatedIndex, staticIndex, pagerViewRef } = useTabView();

  const onScroll = usePageScrollHandler(
    {
      onPageScroll: (e: any) => {
        'worklet';
        animatedIndex.value = e.offset + e.position;
      },
    },
    []
  );

  const onPageSelected = useCallback((e: any) => {
    'worklet';
    staticIndex.value = e.nativeEvent.position;
  }, []);

  return (
    <AnimatedPagerView
      ref={pagerViewRef}
      style={{ flex: 1 }}
      onPageScroll={onScroll}
      onPageSelected={onPageSelected}
      {...props}
    >
      {children}
    </AnimatedPagerView>
  );
});
