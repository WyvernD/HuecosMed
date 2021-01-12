import React from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Text,
  Image,
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
    slider: false,
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
    }, 6000);
  }

  async componentDidUpdate() {
    if (this.props.route.params != undefined) {
      const datosRes = JSON.parse(this.props.route.params.dato);
      this.state.slider = datosRes.slider;
      this.props.route.params = undefined;
    }
  }

  pressSlide(tipo) {

  }

  renderSlider() {
    return (
      <Swiper
        autoplay={false}
        showsButtons={false}
        showsPagination={false}
        ref="swiper"
        effect="fade"
        preloadImages={false}
        onIndexChanged={this.pressSlide('546')}
        onSwiper={(swiper) => console.log(swiper)}
        loop={false}>
        <View style={styles.slide}>
          <Image
            source={require('../iconos/Rectángulo.png')}
            style={styles.image}
          />
          <Image
            source={require('../iconos/grupo1/Grupo_1001.png')}
            style={[styles.iconFondo, {height: 457}]}
          />

          <View style={styles.contenedor}>
            <Text style={styles.reportar}>{'REPORTA'}</Text>
            <Text style={styles.reportarDanos}>{'LOS DAÑOS EN LA VÍA'}</Text>
            <Text style={styles.reportarTxt}>
              {
                'A través de HUECOSMED podrá reportar los baches o huecos que se se encuentran en vía pública'
              }
            </Text>
            <Pressable
              style={stylesSlide.btnSlide}
              onPress={() => {
                this.refs.swiper.scrollBy(1);
              }}>
              <Image
                source={require('../iconos/splash/Componente12–2.png')}
                style={stylesSlide.passed}
              />
            </Pressable>
            <Pressable style={styles.btn} onPress={this.saltarPress}>
              <Text style={styles.btnText}>SALTAR</Text>
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
            style={[styles.iconFondo, {height: 448}]}
          />

          <View style={styles.contenedor}>
            <Text style={styles.reportar}>RECIBE</Text>
            <Text style={styles.reportarDanos}>NOTIFICACIONES</Text>
            <Text style={styles.reportarTxt}>
              Estamos en contacto con el ciudadano para informar oportunamente
              sobre la solución a su reporte
            </Text>
            <Pressable
              style={stylesSlide.btnSlide}
              onPress={() => {
                this.refs.swiper.scrollBy(-1);
              }}>
              <Image
                source={require('../iconos/splash/Componente12–3.png')}
                style={stylesSlide.passed}
              />
            </Pressable>
            <Pressable style={styles.btn} onPress={this.saltarPress}>
              <Text style={styles.btnText}>SALTAR</Text>
            </Pressable>
          </View>
        </View>
      </Swiper>
    );
  }

  renderSplit() {
    return (
      <View style={styles.Container}>
        <View style={styles.content}>
          <Image
            source={require('../iconos/splash/logo-alcaldía.png')}
            style={styles.iconLogo}
          />
          <Image
            source={require('../iconos/splash/HUECOSMED.png')}
            style={styles.iconHuecos}
          />
          <Image
            source={require('../iconos/splash/LA_APP.png')}
            style={styles.iconLaApp}
          />
        </View>
        <Image
          source={require('../iconos/splash/arbolito.png')}
          style={styles.iconFooter}
        />
        <Text style={styles.version}>V3.8</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.Container}>
        <StatusBar hidden={true} />
        {this.state.slider ? this.renderSplit() : this.renderSlider()}
      </View>
    );
  }
}
const stylesSlide = StyleSheet.create({
  btnSlide: {
    bottom: '27%',
  },
});

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    height: height,
    width: width,
    alignItems: 'center',
  },
  version: {
    bottom: 0,
    position: 'absolute',
    right: 5,
  },
  content: {
    flex: 1,
    width: width,
    alignItems: 'center',
    paddingRight: '20%',
    paddingLeft: '20%',
  },
  iconLogo: {
    top: '5%',
    height: 143,
    position: 'absolute',
  },
  iconHuecos: {
    top: '25%',
    height: 105,
    position: 'absolute',
    bottom: 0,
  },
  iconLaApp: {
    top: '50%',
    height: 59,
    position: 'absolute',
  },
  iconFooter: {
    width: width,
    height: '40%',
    position: 'absolute',
    bottom: 0,
  }, //Fin split
  iconFondo: {
    top: 20,
    zIndex: 2,
    position: 'absolute',
  },
  contentSlide: {
    flex: 1,
    width: '10%',
    alignItems: 'center',
    paddingRight: '45%',
    paddingLeft: '45%',
  },
  contenedor: {
    position: 'absolute',
    alignItems: 'center',
    fontFamily: 'MavenPro-Bold',
    textAlign: 'center',
    paddingRight: 65,
    paddingLeft: 65,
    bottom: 70,
    zIndex: 5,
  },
  reportar: {
    fontSize: 22,
    bottom: 80,
    color: '#fff',
    fontFamily: 'MavenPro-Bold',
    fontWeight: 'bold',
  },
  reportarDanos: {
    fontSize: 25,
    bottom: 80,
    color: '#fff',
    fontWeight: 'bold',
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
