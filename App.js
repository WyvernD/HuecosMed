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
  Button,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Formulario from './assets/formulario';

import Swiper from 'react-native-swiper';

const {width, height} = Dimensions.get('window');

let objInicial = true;

const App: () => React$Node = () => {
  return objInicial ? getBanner() : Formulario;
};

function getBanner() {
  return (
    <>
      <View style={styles.Container}>
        <StatusBar hidden={true} />
        <Swiper autoplay={false}>
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
            <TouchableOpacity
              style={styles.saltarText}
              onPress={() => (objInicial = false)}>
              <Text style={styles.saltar}>{'Saltar'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.slide}>
            <Image
              source={require('./assets/images/Screenshot_4.jpg')}
              style={styles.image}
            />
            <TouchableOpacity
              style={styles.saltarText}
              onPress={() => (objInicial = false)}>
              <Text style={styles.saltar}>{'Saltar'}</Text>
            </TouchableOpacity>
          </View>
        </Swiper>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  saltarText: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  saltar: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    fontSize: 20,
    textDecorationLine: 'underline',
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
