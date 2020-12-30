import React from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  Alert,
  Dimensions,
  Pressable,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const {width, height} = Dimensions.get('window');

class SliderScreen extends React.Component {
  handlePress = () => {
    this.props.navigation.navigate('Formulario');
  };

  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.navigate('Formulario');
    }, 6000);
  }

  render() {
    return (
      <View style={styles.Container}>
        <StatusBar hidden={true} />
        <Swiper
          autoplay={true}
          showsButtons={false}
          showsPagination={false}
          activeDot={false}
          preloadImages={true}
          loop={false}>
          <View style={styles.slide}>
            <Image
              source={require('../iconos/logo-alcaldía.png')}
              style={styles.iconLogo}
            />
            <Image
              source={require('../iconos/HUECOSMED.png')}
              style={styles.iconHuecos}
            />
            <Image
              source={require('../iconos/arbolito.png')}
              style={styles.iconFooter}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={require('../iconos/Rectángulo.png')}
              style={styles.image}
            />
            <Image
              source={require('../iconos/rayitas.png')}
              style={styles.iconFondo}
            />
            <Image
              source={require('../iconos/vocina.png')}
              style={styles.iconCentro}
            />
            <Image
              source={require('../iconos/Ellipse.png')}
              style={styles.iconCircle}
            />
            <View style={styles.contenedor}>
              <Text style={styles.reportar}>REPORTA</Text>
              <Text style={styles.reportarDanos}>LOS DAÑOS EN LA VIA</Text>
              <Text style={styles.reportarTxt}>
                A través de HUECOSMED podrá reportar los baches o huecos que se
                encuentran en vía pública
              </Text>
              <Pressable style={styles.btn} onPress={this.handlePress}>
                <Text style={styles.btnText}>Saltar</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.slide}>
            <Image
              source={require('../iconos/Rectángulo.png')}
              style={styles.image}
            />
            <Image
              source={require('../iconos/rayitas.png')}
              style={styles.iconFondo}
            />
            <Image
              source={require('../iconos/carta.png')}
              style={[styles.iconCentro, styles.iconCarta]}
            />
            <Image
              source={require('../iconos/Ellipse.png')}
              style={styles.iconCircle}
            />
            <View style={styles.contenedor}>
              <Text style={styles.reportar}>RECIBE</Text>
              <Text style={styles.reportarDanos}>NOTIFICACIONES</Text>
              <Text style={styles.reportarTxt}>
                Estamos en contacto con el ciudadano para informar oportunamente
                sobre la solución a su reporte
              </Text>
              <Pressable style={styles.btn} onPress={this.handlePress}>
                <Text style={styles.btnText}>Saltar</Text>
              </Pressable>
            </View>
          </View>
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  iconFondo: {
    top: 51,
    width: 259,
    height: 440,
    position: 'absolute',
    zIndex: 4,
    opacity: 0.51,
  },
  iconCentro: {
    top: 190,
    width: 200,
    height: 200,
    position: 'absolute',
    opacity: 1,
    zIndex: 3,
  },
  iconCircle: {
    top: 135,
    width: 350,
    height: 350,
    position: 'absolute',
    zIndex: 2,
    opacity: 0.51,
  },
  iconFooter: {
    width: 484,
    height: 339,
    position: 'absolute',
    bottom: 0,
  },
  iconCarta: {},
  iconLogo: {
    top: 147,
    width: 266,
    height: 143,
    position: 'absolute',
    opacity: 1,
  },
  iconHuecos: {
    top: 301,
    width: 242,
    height: 105,
    position: 'absolute',
  },
  contenedor: {
    position: 'absolute',
    alignItems: 'center',
    fontFamily: 'Maven Pro',
    textAlign: 'center',
    paddingRight: 65,
    paddingLeft: 65,
    bottom: 70,
    zIndex: 5,
  },
  reportar: {
    fontSize: 30,
    bottom: 80,
    color: '#fff',
    fontWeight: 'bold',
  },
  reportarDanos: {
    fontSize: 25,
    bottom: 80,
    color: '#fff',
  },
  reportarTxt: {
    fontSize: 14,
    bottom: 70,
    color: '#fff',
    textAlign: 'center',
    opacity: 1,
  },
  btnText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  btn: {
    fontWeight: 'bold',
    textAlign: 'center',
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.write,
  },
  image: {
    width: width,
    height: height,
    zIndex: 1,
    position: 'absolute',
    opacity: 0.9,
  },
});

export default SliderScreen;
