export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

export { TabRoot } from "./TabRoot";
export { TabView, useExternalTabView as useTabView } from "./TabView";
export { TabHeader } from "./TabHeader";
export { TabBar } from "./TabBar";
export { TabPager } from "./TabPager";
export { TabScrollView } from "./TabScrollView";
export { TabFlashList } from "./TabFlashList";
export { TabRefreshControl } from "./TabRefreshControl";
