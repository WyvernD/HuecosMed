/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Text,
  Componet,
  Image,
  Dimensions,
} from 'react-native';

import Swiper from 'react-native-swiper';

const {width, height} = Dimensions.get('window');

const App: () => React$Node = () => {
  return (
    <>
      <View style={styles.Container}>
        <StatusBar hidden={true} />
        <Swiper autoplay={true}>
          <View style={styles.slide}>
            <Image
              source={require('./assets/images/Screenshot_2.jpg')}
              style={styles.image}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={require('./assets/images/Screenshot_3.jpg')}
              style={styles.image}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={require('./assets/images/Screenshot_4.jpg')}
              style={styles.image}
            />
          </View>
        </Swiper>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width,
    height: height,
  },
});

export default App;
