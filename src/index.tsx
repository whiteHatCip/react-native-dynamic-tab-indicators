import React, { useMemo, useState } from 'react';
import { Dimensions, FlatList, Image, Text, View } from 'react-native';
import type {
  ImageSourcePropType,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
  NativeScrollEvent,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'react-native-linear-gradient';
import tailwind from 'twrnc';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;

export type Tab = {
  tabName: string;
  imageSrc: ImageSourcePropType;
};

const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);
type FlatListImageProps = { item: Tab };

type FlatListTextProps = {
  item: Tab;
  index: number;
  viewTranslatePoints: number[];
  setViewTranslatePoints: React.Dispatch<React.SetStateAction<number[]>>;
  tabWidths: number[];
  setTabWidths: React.Dispatch<React.SetStateAction<number[]>>;
};

const FlatListImage = ({ item }: FlatListImageProps) => {
  return (
    <Animated.View
      key={item.tabName}
      style={tailwind.style(`h-[${SCREEN_HEIGHT}px] w-[${SCREEN_WIDTH}px]`)}
    >
      <Image style={tailwind.style('h-full w-full')} source={item.imageSrc} />
    </Animated.View>
  );
};

const FlatListText = ({
  item,
  index,
  viewTranslatePoints,
  setViewTranslatePoints,
  tabWidths,
  setTabWidths,
}: FlatListTextProps) => {
  const handleViewLayout = (event: LayoutChangeEvent) => {
    const { x } = event.nativeEvent.layout;
    const currentPoints = [...viewTranslatePoints];
    currentPoints[index] = x;
    setViewTranslatePoints(currentPoints);
  };

  const handleTextLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    const currentTabWidths = [...tabWidths];
    currentTabWidths[index] = width;
    setTabWidths(currentTabWidths);
  };

  return (
    <Animated.View onLayout={handleViewLayout} key={item.tabName}>
      <Text
        onLayout={handleTextLayout}
        style={tailwind.style('text-lg font-bold text-white')}
      >
        {item.tabName}
      </Text>
    </Animated.View>
  );
};

type TabProps = {
  tabs: Tab[];
  style?: StyleProp<ViewStyle>;
  scrollXValue: SharedValue<number>;
};

const Tabs = ({ tabs, style, scrollXValue }: TabProps) => {
  const [viewTranslatePoints, setViewTranslatePoints] = useState<number[]>([]);
  const [tabWidths, setTabWidths] = useState<number[]>([]);
  const indicatorStyle = useAnimatedStyle(() => {
    if (
      tabWidths.length === viewTranslatePoints.length &&
      tabWidths.length > 0
    ) {
      const x = scrollXValue.value;
      const input = tabWidths.map((_, index) => index * SCREEN_WIDTH);
      const widthOutput = tabWidths;
      const transformOutput = viewTranslatePoints;
      return {
        width: interpolate(x, input, widthOutput, Extrapolation.CLAMP),
        transform: [
          {
            translateX: interpolate(
              scrollXValue.value,
              input,
              transformOutput,
              Extrapolation.CLAMP
            ),
          },
        ],
      };
    }
    return {
      width: 0,
      transform: [{ translateX: 0 }],
    };
  });
  return (
    <Animated.View style={[tailwind.style('relative w-full px-4 z-20'), style]}>
      <View style={tailwind.style('flex flex-row items-start justify-between')}>
        {tabs.map((value, index) => {
          return (
            <FlatListText
              key={`${value.tabName}_${index}`}
              item={value}
              index={index}
              viewTranslatePoints={viewTranslatePoints}
              setViewTranslatePoints={setViewTranslatePoints}
              tabWidths={tabWidths}
              setTabWidths={setTabWidths}
            />
          );
        })}
      </View>
      <Animated.View
        style={[
          tailwind.style(
            'absolute h-2 w-30 bg-white rounded-md left-4 -bottom-3'
          ),
          indicatorStyle,
        ]}
      />
    </Animated.View>
  );
};

export type DynamicTabBarProps = {
  tabs: Tab[];
  style?: StyleProp<ViewStyle>;
  tabBarStyle?: StyleProp<ViewStyle>;
  tabsBackgroundGradientColors?: (string | number)[];
  onPageSnap?: (scrollEvent: NativeScrollEvent, page: number) => void;
};

export const DynamicTabBar: React.FC<DynamicTabBarProps> = ({
  tabs,
  style,
  tabBarStyle,
  tabsBackgroundGradientColors,
  onPageSnap,
}: DynamicTabBarProps) => {
  const { top } = useSafeAreaInsets();
  const scrollValue = useSharedValue(0);
  const scrollRef = useAnimatedRef<FlatList>();
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollValue.value = event.contentOffset.x;
    },
  });

  const scrollMomentumEndHandler = useAnimatedScrollHandler({
    onMomentumEnd: (event) => {
      const scrollDiff = event.contentOffset.x % SCREEN_WIDTH;
      if (scrollDiff > SCREEN_WIDTH / 2) {
        const scrollMultiplier = Math.ceil(
          event.contentOffset.x / SCREEN_WIDTH
        );
        scrollTo(scrollRef, scrollMultiplier * SCREEN_WIDTH, 0, true);
      } else {
        const scrollMultiplier = Math.floor(
          event.contentOffset.x / SCREEN_WIDTH
        );
        scrollTo(scrollRef, scrollMultiplier * SCREEN_WIDTH, 0, true);
      }
      onPageSnap?.(event, event.contentOffset.x / SCREEN_WIDTH);
    },
  });

  const tabsBgColors = useMemo(() => {
    if (tabsBackgroundGradientColors == null) {
      return ['rgba(0,0,0,1)', 'transparent'];
    }
    if (tabsBackgroundGradientColors.length === 0) {
      return ['transparent'];
    }
    return tabsBackgroundGradientColors;
  }, [tabsBackgroundGradientColors]);

  return (
    <View style={[tailwind.style(`flex-1 bg-[#141414]`), style]}>
      <Tabs
        tabs={tabs}
        style={tabBarStyle ?? { top }}
        scrollXValue={scrollValue}
      />
      <LinearGradient
        colors={tabsBgColors}
        style={tailwind.style(`absolute inset-0 h-[${top * 2}px] z-10`)}
      />
      <AnimatedFlatlist
        ref={scrollRef}
        onMomentumScrollEnd={scrollMomentumEndHandler}
        onScroll={scrollHandler}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
        scrollEventThrottle={16}
        style={tailwind.style('absolute z-0')}
        data={tabs}
        renderItem={({ item }) => <FlatListImage item={item as Tab} />}
      />
    </View>
  );
};
