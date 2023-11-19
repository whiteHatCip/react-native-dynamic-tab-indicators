# react-native-dynamic-tab-indicators

A simple component that allows to show swipeable tabs in a screen, with a really nice animated indicator that follows user's finger when swiping through tabs and that resizes based on the tab's width.

## Installation

```sh
npm install react-native-dynamic-tab-indicators
```

## Usage

```js
import { DynamicTabBar } from "react-native-dynamic-tab-indicators";

// ...
const tabs: Tab[] = [
  { tabName: 'Men', imageSrc: require('../assets/tabsBackgrounds/man.jpg') },
  {
    tabName: 'Women',
    imageSrc: require('../assets/tabsBackgrounds/woman.jpg'),
  },
  { tabName: 'Kids', imageSrc: require('../assets/tabsBackgrounds/kid.jpg') },
  {
    tabName: 'Home Decor',
    imageSrc: require('../assets/tabsBackgrounds/home-decor.jpg'),
  },
];

<DynamicTabBar tabs={tabs} />
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

## Rewards
I created this library starting from a blog post on Medium that you can find at this link:

https://medium.com/timeless/dynamic-tab-indicators-in-react-native-using-reanimated-part-i-9edd6cc7cc84

I wanted to keep track of this component he was teaching about, and since it was one of those cases in which the component was highly isolatable, I wanted to try out to publish an npm package for future needs.

In short, I simply used the code from the blog post to create this npm package for learning purposes, hence, 99% of the code is not written from me. I just changed it a little bit to pass some props to the component from outside of it.
