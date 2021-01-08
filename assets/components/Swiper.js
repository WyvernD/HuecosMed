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
  saltarPress = () => {
    this.props.navigation.navigate('Formulario');
  };
  state = {
    slider: true,
  };

  async componentDidMount() {
    setTimeout(() => {
      if (this.state.slider) {
        this.render();
        this.state.slider = false;
        this.props.navigation.navigate('Home', {
          dato: JSON.stringify({...this.state.slider}),
        });
      }
    }, 5000);
  }

  async componentDidUpdate() {
    if (this.props.route.params != undefined) {
      const datosRes = JSON.parse(this.props.route.params.dato);
      this.state.slider = datosRes.slider;
      this.props.route.params = undefined;
    }
  }

  render() {
    if (this.state.slider) {
      return (
        <View style={styles.Container}>
          <StatusBar hidden={true} />
          <Swiper
            autoplay={false}
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
                source={require('../iconos/La_app.png')}
                style={styles.iconLaApp}
              />
              <Image
                source={require('../iconos/arbolito.png')}
                style={styles.iconFooter}
              />
            </View>
          </Swiper>
        </View>
      );
    } else {
      return (
        <View style={styles.Container}>
          <StatusBar hidden={true} />
          <Swiper
            autoplay={false}
            showsButtons={false}
            showsPagination={false}
            activeDot={true}
            preloadImages={true}
            loop={false}>
            <View style={styles.slide}>
              <Image
                source={require('../iconos/Rectángulo.png')}
                style={styles.image}
              />
              <Image
                source={require('../iconos/grupo1/Grupo_1001.png')}
                style={styles.iconFondo}
              />
              <View style={styles.contenedor}>
                <Text style={styles.reportar}>{'REPORTA'}</Text>
                <Text style={styles.reportarDanos}>
                  {'LOS DAÑOS EN LA VÍA'}
                </Text>
                <Text style={styles.reportarTxt}>
                  {
                    'A través de HUECOSMED podrá reportar los baches o huecos que se se encuentran en vía pública'
                  }
                </Text>
                <Pressable style={styles.btn} onPress={this.saltarPress}>
                  <Text style={styles.btnText}>{'Saltar'}</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.slide}>
              <Image
                source={require('../iconos/Rectángulo.png')}
                style={styles.image}
              />
              <Image
                source={require('../iconos/grupo2/Grupo_1002.png')}
                style={styles.iconFondo}
              />
              <View style={styles.contenedor}>
                <Text style={styles.reportar}>RECIBE</Text>
                <Text style={styles.reportarDanos}>NOTIFICACIONES</Text>
                <Text style={styles.reportarTxt}>
                  Estamos en contacto con el ciudadano para informar
                  oportunamente sobre la solución a su reporte
                </Text>
                <Pressable style={styles.btn} onPress={this.saltarPress}>
                  <Text style={styles.btnText}>Saltar</Text>
                </Pressable>
              </View>
            </View>
          </Swiper>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  iconFondo: {
    top: 20,
    height: '50%',
    marginLeft: '25%',
    marginRight: '25%',
    position: 'absolute',
    zIndex: 4,
  },
  slideOff: {
    display: 'none',
  },
  iconLogo: {
    top: '5%',
    width: width,
    marginLeft: '25%',
    marginRight: '25%',
    height: '20%',
    position: 'absolute',
    opacity: 1,
  },
  iconHuecos: {
    top: '27%',
    width: width,
    marginLeft: '30%',
    marginRight: '30%',
    height: 110,
    position: 'absolute',
  },
  iconLaApp: {
    top: '50%',
    width: width,
    marginLeft: '25%',
    marginRight: '25%',
    height: 110,
    position: 'absolute',
  },
  iconFooter: {
    width: width,
    height: '40%',
    position: 'absolute',
    bottom: 0,
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
    fontFamily: 'Maven Pro',
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
    width: width,
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
