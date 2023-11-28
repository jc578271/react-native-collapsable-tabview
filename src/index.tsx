export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

export { TabRoot } from "./TabRoot";
export { TabView, useExternalTabView as useTabView } from "./TabView";
export { TabHeader, type TabHeaderProps } from "./TabHeader";
export { TabBar, type TabBarProps } from "./TabBar";
export { type IRenderTabBarItem } from "./components/BarItem";
export { TabPager, type TabPagerProps } from "./TabPager";
export { TabScrollView } from "./TabScrollView";
export { TabFlashList } from "./TabFlashList";
export { TabRefreshControl } from "./TabRefreshControl";
export { ETabStatus } from "./types"
