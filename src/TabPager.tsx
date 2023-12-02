import React, {
  forwardRef,
  memo,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import { useTabView } from "./TabView";
import { usePageScrollHandler } from "./hooks/usePageScrollHandler";
import Animated, {
  runOnJS,
  type SharedValue,
  useAnimatedProps,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import RNPagerView from "react-native-pager-view";
import { ROOT_ID } from "./constant";
import { useWindow } from "./hooks/useWindow";

const AnimatedPagerView = Animated.createAnimatedComponent(RNPagerView);

export interface TabPager {
  goToPage: (index: number) => void;
}

export interface TabPagerProps extends PropsWithChildren<{}> {
  initialPage?: number | SharedValue<number>;
  scrollEnabled?: boolean | SharedValue<boolean>;
  overScrollMode?: "auto" | "always" | "never";
  keyboardDismissMode?: "none" | "on-drag";
  onPageChanged?: (index: number) => void;
}

const getValue = <T extends number | boolean>(value: T | SharedValue<T>) => {
  "worklet";
  if (typeof value === "number" || typeof value === "boolean") return value;
  return value.value;
};

const _TabPager = forwardRef<TabPager, TabPagerProps>(function TabPager(
  props,
  ref
) {
  const { tabViewId, tabs, pagerViewRef } = useTabView();

  /* set tabs with provider tabs */
  useEffect(() => {
    tabs.value = (props.children as any[]).map((child) => child.props.label);
  }, [(props.children as any[])?.length]);

  /* externalRef */
  const { width } = useWindow();

  const goToPage = useCallback(
    (index: number) => {
      if (tabViewId === ROOT_ID) {
        pagerViewRef.current?.setPage(index);
      } else {
        pagerViewRef.current?.scrollTo({
          x: index * width.value,
          animated: false,
        });
      }
    },
    [tabViewId]
  );

  useImperativeHandle(
    ref,
    () => ({
      goToPage,
    }),
    [goToPage]
  );

  if (tabViewId === ROOT_ID) {
    return <Pager {...props} />;
  }

  return <Scroll {...props} />;
});

export const TabPager = memo(_TabPager);

const Pager = memo(
  ({
    children,
    onPageChanged,
    scrollEnabled = true,
    initialPage = 0,
    ...rest
  }: TabPagerProps) => {
    const { animatedIndex, staticIndex, pagerViewRef } = useTabView();

    const onScroll = usePageScrollHandler(
      {
        onPageScroll: (e: any) => {
          "worklet";
          animatedIndex.value = e.offset + e.position;
        },
      },
      []
    );

    const onPageSelected = useCallback(
      (e: any) => {
        "worklet";
        staticIndex.value = e.nativeEvent.position;
        onPageChanged?.(e.nativeEvent.position);
      },
      [onPageChanged]
    );

    /* animated props */
    const animatedProps = useAnimatedProps(
      () => ({
        initialPage: getValue(initialPage),
        scrollEnabled: getValue(scrollEnabled),
      }),
      [initialPage, scrollEnabled]
    ) as any;

    return (
      <AnimatedPagerView
        ref={pagerViewRef}
        animatedProps={animatedProps}
        style={{ flex: 1 }}
        onPageScroll={onScroll}
        onPageSelected={onPageSelected}
        {...rest}
      >
        {children}
      </AnimatedPagerView>
    );
  }
);

const Scroll = memo(
  ({
    children,
    onPageChanged,
    overScrollMode,
    keyboardDismissMode,
    initialPage = 0,
  }: TabPagerProps) => {
    const { animatedIndex, staticIndex, pagerViewRef } = useTabView();

    const { width } = useWindow();

    const onChangeTabJS = useCallback(
      (index: number) => {
        onPageChanged?.(index);
      },
      [onPageChanged]
    );

    const onScroll = useAnimatedScrollHandler(
      {
        onScroll: (e) => {
          animatedIndex.value = e.contentOffset.x / width.value;
          staticIndex.value = e.contentOffset.x / width.value;
          runOnJS(onChangeTabJS)(e.contentOffset.x / width.value);
        },
      },
      [onPageChanged]
    );

    const animatedProps = useAnimatedProps(
      () => ({
        contentOffset: { x: getValue(initialPage) * width.value, y: 0 },
      }),
      [initialPage]
    ) as any;

    return (
      <Animated.ScrollView
        ref={pagerViewRef}
        // @ts-ignore
        animatedProps={animatedProps}
        onScroll={onScroll}
        scrollEnabled={false}
        horizontal={true}
        overScrollMode={overScrollMode}
        keyboardDismissMode={keyboardDismissMode}
      >
        {children}
      </Animated.ScrollView>
    );
  }
);
