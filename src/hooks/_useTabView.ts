import Animated, {
  type SharedValue,
  useAnimatedRef,
  useSharedValue,
} from "react-native-reanimated";
import { useMemo, type RefObject } from "react";
import { makeid } from "../utils/makeid";
import PagerView from "react-native-pager-view";
import { ROOT_ID } from "../constant";

interface IUseTabView {
  tabViewId: string;
  currentTab: SharedValue<string | null>;
  tabs: SharedValue<string[]>;
  animatedIndex: SharedValue<number>;
  staticIndex: SharedValue<number>;
  pagerViewRef: RefObject<PagerView & Animated.ScrollView>;
  headerHeight: SharedValue<number>;
  barHeight: SharedValue<number>;
}

export const _useTabView = (
  isRoot?: boolean,
  initialHeight?: {
    header?: number;
    bar?: number;
  }
): IUseTabView => {
  const tabViewId = useMemo(() => (isRoot ? ROOT_ID : makeid(6)), [isRoot]);
  const currentTab = useSharedValue<string | null>(null);
  const animatedIndex = useSharedValue<number>(0);
  const staticIndex = useSharedValue<number>(0);
  const headerHeight = useSharedValue(initialHeight?.header || 0);
  const barHeight = useSharedValue(initialHeight?.bar || 0);
  const tabs = useSharedValue<string[]>([]);
  const pagerViewRef = useAnimatedRef<PagerView & Animated.ScrollView>();

  return useMemo(
    () => ({
      tabViewId,
      currentTab,
      tabs,
      animatedIndex,
      staticIndex,
      pagerViewRef,
      headerHeight,
      barHeight,
    }),
    [pagerViewRef, tabViewId]
  );
};
