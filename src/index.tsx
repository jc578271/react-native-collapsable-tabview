export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

export * from "./TabProvider";
export * from "./TabView";
export * from "./HeaderView";
export * from "./PagerView";
export * from "./Bar";
export * from "./ScrollView";
export * from "./FlashList";
