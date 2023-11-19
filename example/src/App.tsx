import * as React from 'react';

import {StyleSheet, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {DynamicTabBar} from 'react-native-dynamic-tab-indicators';
import type {Tab} from 'react-native-dynamic-tab-indicators';

const tabs: Tab[] = [
  {tabName: 'Men', imageSrc: require('../assets/tabsBackgrounds/man.jpg')},
  {
    tabName: 'Women',
    imageSrc: require('../assets/tabsBackgrounds/woman.jpg'),
  },
  {tabName: 'Kids', imageSrc: require('../assets/tabsBackgrounds/kid.jpg')},
  {
    tabName: 'Home Decor',
    imageSrc: require('../assets/tabsBackgrounds/home-decor.jpg'),
  },
];

export default function App() {
  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <DynamicTabBar tabs={tabs} />
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
