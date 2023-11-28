import React, {
  memo,
  type PropsWithChildren,
  useCallback,
  useEffect,
} from 'react';
import {useTabView} from './TabView';
import {usePageScrollHandler} from './hooks/usePageScrollHandler';
import Animated, {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
} from 'react-native-reanimated';
import RNPagerView from 'react-native-pager-view';
import {ROOT_ID} from './constant';
import {useWindow} from './hooks/useWindow';

const AnimatedPagerView = Animated.createAnimatedComponent(RNPagerView);

export const TabPager = memo(function TabPager({
  children,
}: PropsWithChildren<{}>) {
  const {tabViewId, tabs} = useTabView();

  /* set tabs with provider tabs */
  useEffect(() => {
    tabs.value = (children as any[]).map(child => child.props.label);
  }, [(children as any[])?.length]);

  if (tabViewId === ROOT_ID) {
    return <Pager>{children}</Pager>;
  }

  return <Scroll>{children}</Scroll>;
});

const Pager = memo(({children}: PropsWithChildren<{}>) => {
  const {animatedIndex, staticIndex, pagerViewRef} = useTabView();

  const onScroll = usePageScrollHandler(
    {
      onPageScroll: (e: any) => {
        'worklet';
        animatedIndex.value = e.offset + e.position;
      },
    },
    [],
  );

  const onPageSelected = useCallback((e: any) => {
    'worklet';
    staticIndex.value = e.nativeEvent.position;
  }, []);

  return (
    <AnimatedPagerView
      ref={pagerViewRef}
      style={{flex: 1}}
      onPageScroll={onScroll}
      onPageSelected={onPageSelected}>
      {children}
    </AnimatedPagerView>
  );
});

const Scroll = memo(({children}: PropsWithChildren<{}>) => {
  const {animatedIndex, staticIndex} = useTabView();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const {width} = useWindow();

  useAnimatedReaction(
    () => ({animatedIndex: animatedIndex.value, width: width.value}),
    ({animatedIndex, width}) => {
      scrollTo(scrollRef, animatedIndex * width, 0, false);
      staticIndex.value = animatedIndex;
    },
    [],
  );

  return (
    <Animated.ScrollView
      ref={scrollRef}
      scrollEnabled={false}
      horizontal={true}>
      {children}
    </Animated.ScrollView>
  );
});
