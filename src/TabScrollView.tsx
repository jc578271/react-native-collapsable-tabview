import React, {forwardRef, memo} from 'react';
import Animated, {
  type AnimatedScrollViewProps,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useTabView} from './TabView';
import {useAutoScroll} from './hooks/useAutoScroll';
import {View} from 'react-native';

const _TabScrollView = forwardRef<Animated.ScrollView, AnimatedScrollViewProps>(
  function TabScrollView({children, ...props}, ref) {
    const {emptyBarHeight, minBarTop} = useTabView();

    const animatedStyle = useAnimatedStyle(() => {
      return {
        height: emptyBarHeight.value,
      };
    }, []);

    const {onScroll, scrollViewRef, listHeight, onListLayout} = useAutoScroll(
      ref as any,
    );

    const containerStyle = useAnimatedStyle(() => {
      return {
        minHeight: listHeight.value + minBarTop.value,
      };
    }, []);

    return (
      <View style={{flex: 1}} onLayout={onListLayout}>
        <Animated.ScrollView ref={scrollViewRef} {...props} onScroll={onScroll}>
          <Animated.View style={containerStyle}>
            <Animated.View style={animatedStyle} />
            {children}
          </Animated.View>
        </Animated.ScrollView>
      </View>
    );
  },
);

export const TabScrollView = memo(_TabScrollView);
