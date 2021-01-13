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


let txtLaApp = '';
let txtReporta = '';
let txtReportaDan = '';
let txtReportaAyuda = '';
let txtRecibe = '';
let txtRecibeNotif = '';
let txtRecibeAyuda = '';
let txtSaltar = '';

const {width, height} = Dimensions.get('window');

const fontSizeText = width <= 380 ? 30 : 40;
const fontSizeTextSec = width <= 380 ? 15 : 20;
const fontSizeInfo = width <= 380 ? 12 : 15;

class SliderScreen extends React.Component {
  saltarPress = () => {
    this.props.navigation.navigate('Formulario', {
      dato: JSON.stringify({...this.state}),
    });
  };
  state = {
    slider: true,
    paramsTrue: false,
    parametros: [],
  };

  async componentDidMount() {
    this.cargarParametros();
    setTimeout(() => {
      if (this.state.slider) {
        this.render();
        this.state.slider = false;
        this.props.navigation.navigate('Home', {
          dato: JSON.stringify({...this.state}),
        });
      }
    }, 5500);
  }
  async cargarParametros() {
    let response = await fetch(
      'https://www.medellin.gov.co/HuecosMed/cargardatos.hyg?str_sql=eyJTUUwiOiJTUUxfSFVFQ09TX0NPTlNVTFRBUl9QQVJBTUVUUk9TIiwiTiI6MCwiREFUT1MiOnt9fQ%3D%3D',
    );
    let res = await response.json();
    this.state.parametros = res;
    let textos = res[0];
    txtSaltar = textos.SALTAR;
    txtReporta = textos.REPORTA;
    txtReportaDan = textos.REPORTADAN;
    txtReportaAyuda = textos.REPORTAINFO;
    txtRecibe = textos.RECIBE;
    txtRecibeNotif = textos.NOTIF;
    txtRecibeAyuda = textos.RECIBEINFO;
    txtLaApp = textos.LAAPP;
    this.state.paramsTrue = true;
  }

  async componentDidUpdate() {
    if (this.props.route.params != undefined) {
      const datosRes = JSON.parse(this.props.route.params.dato);
      console.log(datosRes);
      this.state.slider = datosRes.slider;
      this.props.route.params = undefined;
    }
    if (!this.state.paramsTrue) {
      this.cargarParametros();
    }
  }

  renderSlider() {
    return (
      <Swiper
        autoplay={false}
        showsButtons={false}
        showsPagination={false}
        ref="swiper"
        effect="Fade"
        preloadImages={false}
        loop={false}>
        <View style={styles.slide}>
          <Image
            source={require('../iconos/Rectángulo.png')}
            style={styles.image}
          />
          <View style={styles.centerImage}>
            <Image
              source={require('../iconos/grupo1/Grupo_1001.png')}
              style={[styles.iconFondo]}
            />
          </View>
          <View style={styles.contenedor}>
            <Text style={styles.reportar}>{txtReporta}</Text>
            <Text style={styles.reportarDanos}>{txtReportaDan}</Text>
            <Text style={styles.reportarTxt}>{txtReportaAyuda}</Text>
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
              <Text style={styles.btnText}>{txtSaltar}</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.slide}>
          <Image
            source={require('../iconos/Rectángulo.png')}
            style={styles.image}
          />
          <View style={styles.centerImage}>
            <Image
              source={require('../iconos/grupo2/Grupo_1002.png')}
              style={[styles.iconFondo]}
            />
          </View>
          <View style={styles.contenedor}>
            <Text style={styles.reportar}>{txtRecibe}</Text>
            <Text style={styles.reportarDanos}>{txtRecibeNotif}</Text>
            <Text style={styles.reportarTxt}>{txtRecibeAyuda}</Text>
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
              <Text style={styles.btnText}>{txtSaltar}</Text>
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
            source={require('../iconos/splash/logo-alcaldia2.png')}
            style={styles.iconLogo}
          />
          <Image
            source={require('../iconos/splash/HUECOSMED2.png')}
            style={styles.iconHuecos}
          />
          <Image
            style={styles.iconLaApp}
            source={require('../iconos/splash/LA_APP.png')}
          />
        </View>
        <Image
          source={require('../iconos/splash/arbolito.png')}
          style={styles.iconFooter}
        />
        <Text style={styles.version}>V3.9</Text>
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
//<Text style={styles.txtApp}>{txtLaApp}</Text>
/*<Image
       source={require('../iconos/splash/LA_APP.png')}
 />*/
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
    right: 10,
  },
  content: {
    flex: 1,
    width: width,
    alignItems: 'center',
  },
  iconLogo: {
    top: '5%',
    height: height / 5,
    resizeMode: 'contain',
    position: 'relative',
  },
  iconHuecos: {
    height: height / 4,
    resizeMode: 'center',
    position: 'relative',
    bottom: 0,
  },
  txtApp: {
    zIndex: 5,
    bottom: 2,
    fontSize: fontSizeTextSec,
    textAlign: 'center',
  },
  iconLaApp: {
    top: '0%',
    height: height / 4,
    resizeMode: 'contain',
    position: 'relative',
  },
  iconFooter: {
    width: width,
    height: '40%',
    position: 'absolute',
    bottom: 0,
  }, //Fin split
  centerImage: {
    top: '1%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconFondo: {
    top: 5,
    zIndex: 2,
    height: height / 2,
    resizeMode: 'center',
    position: 'absolute',
  },
  contentSlide: {
    flex: 1,
    alignItems: 'center',
    width: width / 2,
    position: 'absolute',
  },
  contenedor: {
    position: 'absolute',
    alignItems: 'center',
    fontFamily: 'MavenPro-Bold',
    textAlign: 'center',
    paddingRight: 50,
    paddingLeft: 50,
    bottom: '5%',
    zIndex: 5,
  },
  reportar: {
    fontSize: fontSizeText,
    bottom: 80,
    color: '#fff',
    fontFamily: 'MavenPro-Bold',
  },
  reportarDanos: {
    fontSize: fontSizeTextSec,
    bottom: 80,
    color: '#fff',
    fontFamily: 'MavenPro-Bold',
  },
  reportarTxt: {
    fontSize: fontSizeInfo,
    bottom: 70,
    color: '#fff',
    fontFamily: 'MavenPro-Medium',
    textAlign: 'center',
    opacity: 1,
  },
  btnText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  btn: {
    textAlign: 'center',
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    fontFamily: 'MavenPro-Bold',
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
    zIndex: 1,
    width: width,
    height: height,
    position: 'relative',
  },
});

export default SliderScreen;
