import React, {
  forwardRef,
  memo,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useImperativeHandle,
} from 'react';
import {useTabView} from './TabView';
import {usePageScrollHandler} from './hooks/usePageScrollHandler';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import RNPagerView from 'react-native-pager-view';
import {ROOT_ID} from './constant';
import {useWindow} from './hooks/useWindow';

const AnimatedPagerView = Animated.createAnimatedComponent(RNPagerView);

export interface TabPager {
  goToPage: (index: number) => void;
}

export interface TabPagerProps extends PropsWithChildren<{}>{
  onPageChanged?: (index: number) => void;
}

const _TabPager = forwardRef<TabPager, TabPagerProps>(function TabPager(
  props,
  ref,
) {
  const {tabViewId, tabs, pagerViewRef} = useTabView();

  /* set tabs with provider tabs */
  useEffect(() => {
    tabs.value = (props.children as any[]).map(child => child.props.label);
  }, [(props.children as any[])?.length]);

  /* externalRef */
  const {width} = useWindow();

  const goToPage = useCallback((index: number) => {
    if (tabViewId === ROOT_ID) {
      pagerViewRef.current?.setPage(index);
    } else {
      pagerViewRef.current?.scrollTo({
        x: index * width.value,
        animated: false,
      });
    }
  }, [tabViewId]);

  useImperativeHandle(
    ref,
    () => ({
      goToPage,
    }),
    [goToPage],
  );

  if (tabViewId === ROOT_ID) {
    return <Pager {...props}/>;
  }

  return <Scroll {...props}/>;
});

export const TabPager = memo(_TabPager);

const Pager = memo(({children, onPageChanged}: TabPagerProps) => {
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
    onPageChanged?.(e.nativeEvent.position);
  }, [onPageChanged]);

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

const Scroll = memo(({children, onPageChanged}: TabPagerProps) => {
  const {animatedIndex, staticIndex, pagerViewRef} = useTabView();

  const {width} = useWindow();

  const onChangeTabJS = useCallback((index: number) => {
    onPageChanged?.(index)
  }, [onPageChanged])

  const onScroll = useAnimatedScrollHandler(
    {
      onScroll: e => {
        animatedIndex.value = e.contentOffset.x / width.value;
        staticIndex.value = e.contentOffset.x / width.value;
        runOnJS(onChangeTabJS)(e.contentOffset.x / width.value)
      },
    },
    [onPageChanged],
  );

  return (
    <Animated.ScrollView
      ref={pagerViewRef}
      onScroll={onScroll}
      scrollEnabled={false}
      horizontal={true}>
      {children}
    </Animated.ScrollView>
  );
});
