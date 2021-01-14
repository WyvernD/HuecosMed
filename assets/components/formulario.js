import React from 'react';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  Modal,
  Dimensions,
} from 'react-native';

import WebHtml from './MapComponent';
const encode64 = require('../libs/B64');
import {WebView} from 'react-native-webview';
import ImagePicker from 'react-native-image-picker';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Autocomplete from 'react-native-autocomplete-input';
import Geolocation from '@react-native-community/geolocation';

const {width, height} = Dimensions.get('window');

let txtReporta = '';
let txtUbicacion = '';
let txtUbicDecripcion = '';
let txtPunto = '';
let txtPuntoDEscripcion = '';
let txtAgregarFoto = '';
let txtPlaceHolder = '';
let txtTomarFoto = '';
let txtGalery = '';
let campoObligatorio = '';
let alertGalery = '';
let alertFoto = '';

const fontSizehead = width <= 380 ? 15 : 20;
const fontSizeText = width <= 380 ? 8 : 12;
const fontSizeTitle = width <= 380 ? 10 : 12;
const fontSizeAyudas = width <= 380 ? 7 : 9;
const inputAlto = width <= 380 ? 35 : 40;
const fontSizeInput = width <= 380 ? 12 : 15;
const ubicarMe = width <= 380 ? height / 2 : height / 3;

const urlRoot = 'https://www.medellin.gov.co';

class getFormulario extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {},
      rutaGuardado: '',
      filterData: [],
      selectedItem: {},
      load: true,
      parametros: [],
      dirInicial: false,
      dirInicialTotal: 1,
    };
  }

  async cargarParametros() {
    this.setLoadVisible(true);
    let res = this.state.parametros;
    if (this.state.parametros.length === 0) {
      let response = await fetch(
        'https://www.medellin.gov.co/HuecosMed/cargardatos.hyg?str_sql=eyJTUUwiOiJTUUxfSFVFQ09TX0NPTlNVTFRBUl9QQVJBTUVUUk9TIiwiTiI6MCwiREFUT1MiOnt9fQ%3D%3D',
      );
      res = await response.json();
    }
    let textos = res[0];
    txtUbicacion = textos.UBICACION;
    txtUbicDecripcion = textos.AYUDAUBIC;
    txtPunto = textos.PUNTOREF;
    txtPuntoDEscripcion = textos.AYUDAPONDOREF;
    txtPlaceHolder = textos.PLACEHOLDER;
    txtAgregarFoto = textos.AGREGARFOTO;
    txtTomarFoto = textos.FOTO;
    txtGalery = textos.GALERIA;
    alertFoto = textos.FOTOSUBIDA;
    alertGalery = textos.GALERYSAUBIDA;
    campoObligatorio = textos.UBICOBLIGATORIO;
    txtReporta = textos.REPORTAHUECOS;
    this.setLoadVisible(false);
  }

  async componentDidMount() {
    if (this.props.route.params != undefined) {
      const datosRes = JSON.parse(this.props.route.params.dato);
      this.state.parametros = datosRes.parametros;
      this.props.route.params = undefined;
    }
    this.cargarParametros();
    await this.cargarDatos();
    if (Platform.OS !== 'ios') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
        }
      } catch (err) {
        // console.log(err);
      }
    }
  }

  async cargarDatos() {
    this.setLoadVisible(true);
    const consulta = {
      SQL: 'SQL_HUECOS_CONSULTAR_PARAMETROS_HUECO',
      N: 0,
      DATOS: {},
    };
    let url =
      urlRoot +
      '/HuecosMed/cargardatos.hyg?str_sql=' +
      encodeURIComponent(encode64(JSON.stringify(consulta)));
    let response = await fetch(url);
    let res = await response.json();
    this.setState({rutaGuardado: res[0].URLLOCALPHOTO});
    if (res[0].latitude !== undefined && res[0].longitude !== undefined) {
      this.refs.Map_Ref.injectJavaScript(
        ` mymap.flyTo([${res[0].latitude}, ${res[0].longitude}], ${res[0].zoom})`,
      );
    }
    this.setLoadVisible(false);
  }

  onchangeInputs = (text, name) => {
    this.setState({data: {...this.state.data, [name]: text}});
  };

  camaraPress = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'HuecosMed',
        privateDirectory: false,
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        //const source = {uri: response.uri};
        // console.log('response', JSON.stringify(response));
        this.state.data.urlFoto = response.uri;
        this.state.data.base64 = response.data;
        Alert.alert('Información', alertFoto);
      }
    });
  };

  galeryPress = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'HuecosMed',
        privateDirectory: true,
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
        //alert(response.customButton);
      } else {
        //const source = {uri: response.uri};
        // console.log('response', JSON.stringify(response));
        this.state.data.urlFoto = response.uri;
        this.state.data.base64 = response.data;
        Alert.alert('Información', alertGalery);
      }
    });
  };

  validarReporte = () => {
    this.setLoadVisible(true);
    const datos = {...this.state.data};
    if (datos.location !== undefined && datos.location !== '') {
      this.props.navigation.navigate('Reporte', {
        dato: JSON.stringify(this.state),
      });
      this.setLoadVisible(false);
    } else {
      this.setLoadVisible(false);
      Alert.alert('Campo obligatorio', campoObligatorio, [{text: 'Aceptar'}], {
        cancelable: false,
      });
    }
  };

  coordinatesFromMap = (data) => {
    let datos = JSON.parse(data);
    console.log(datos);
    this.llenarUbicacion(datos.lat, datos.lng);
    if (
      this.state.data.location === undefined ||
      this.state.data.location === ''
    ) {
      if (this.state.dirInicial) {
        this.getDirGeoCod(datos.lat, datos.lng);
      } else {
        if (this.state.dirInicialTotal >= 2) {
          this.setState({dirInicial: true});
        }
        this.setState({dirInicialTotal: this.state.dirInicialTotal + 1});
      }
    }
  };

  async getDirGeoCod(lat, lng) {
    this.setLoadVisible(true);
    const consulta = {
      SQL: 'SQL_HUECOS_CONSULTAR_GEOCOD_DIRECCION',
      N: 2,
      DATOS: {P1: lng, P2: lat},
    };
    let url =
      urlRoot +
      '/HuecosMed/cargardatos.hyg?str_sql=' +
      encodeURIComponent(encode64(JSON.stringify(consulta)));
    let response = await fetch(url);
    let res = await response.json();
    let direccion = res[0].DATOS;
    this.setState({
      data: {...this.state.data, ['location']: direccion},
    });
    this.setState({selectedItem: direccion});
    this.setLoadVisible(false);
  }

  limpiar = () => {
    this.setState({selectedItem: ''});
    this.setState({filterData: []});
    this.setState({
      data: {...this.state.data, ['location']: ''},
    });
  };

  getCapas = () => {};

  getUbicacion = () => {
    this.setLoadVisible(true);
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        let currentLongitude = JSON.stringify(position.coords.longitude);
        let currentLatitude = JSON.stringify(position.coords.latitude);
        this.refs.Map_Ref.injectJavaScript(
          ` mymap.flyTo([${currentLatitude}, ${currentLongitude}], 18)`,
        );
        this.getDirGeoCod(currentLatitude, currentLongitude);
        this.setLoadVisible(false);
      },
      (error) => {
        //  console.log(error);
        if (error.code === 2) {
          Alert.alert(
            'HUECOSMED necesita tu ubicación.',
            'Es necesario activar el GPS para poder ubicar adecuadamente el daño en el momento del reporte.',
            [{text: 'Aceptar', onPress: () => this.ActivarGps()}],
            {cancelable: false},
          );
          this.setLoadVisible(false);
        } else if (error.code === 3) {
          Alert.alert(
            '',
            'No se pudo obtener tu ubicación.',
            [{text: 'Aceptar', onPress: () => this.ActivarGps()}],
            {cancelable: false},
          );
          this.setLoadVisible(false);
        } else {
          Alert.alert(
            '',
            error,
            [{text: 'Aceptar', onPress: () => this.ActivarGps()}],
            {cancelable: false},
          );
          this.setLoadVisible(false);
        }
      },
      {enableHighAccuracy: true, timeout: 5000, maximumAge: 3600000},
    );
  };

  async ActivarGps() {
    //  console.log('Activar GPS');
  }

  llenarUbicacion = (currentLatitude, currentLongitude) => {
    this.setState({
      data: {...this.state.data, ['latitude']: currentLatitude},
    });
    this.setState({
      data: {...this.state.data, ['longitude']: currentLongitude},
    });
    this.setState({
      data: {...this.state.data, ['zoom']: 19},
    });
  };

  searchDirection = (direccion) => {
    if (direccion.length > 3) {
      const consulta = {
        SQL: 'SQL_HUECOS_CONSULTAR_DIRECCIONES_LISSTAG',
        N: 1,
        DATOS: {P1: direccion},
      };
      let url =
        urlRoot +
        '/HuecosMed/cargardatos.hyg?str_sql=' +
        encodeURIComponent(encode64(JSON.stringify(consulta)));
      fetch(url, {
        method: 'GET',
      })
        .then((e) => e.json())
        .then((responseJson) => {
          this.setState({filterData: responseJson[0].title.split(',')});
        })
        .catch((error) => {
          // console.error(error);
        });
    } else {
      this.setState({filterData: []});
    }
  };

  searchCoordinates = (direccion) => {
    if (direccion.length > 0) {
      const consulta = {
        SQL: 'SQL_HUECOS_CONSULTAR_DIRECCIONES',
        N: 1,
        DATOS: {P1: direccion},
      };
      let url =
        urlRoot +
        '/HuecosMed/cargardatos.hyg?str_sql=' +
        encodeURIComponent(encode64(JSON.stringify(consulta)));
      fetch(url, {
        method: 'GET',
      })
        .then((e) => e.json())
        .then((responseJson) => {
          if (responseJson) {
            let latitud = responseJson[0].LATITUD;
            let longitud = responseJson[0].LONGITUD;
            this.refs.Map_Ref.injectJavaScript(
              ` mymap.flyTo([${latitud}, ${longitud}], 18)`,
            );
          }
        })
        .catch((error) => {
          // console.error(error);
        });
    } else {
      this.setState({selectedItem: ''});
      this.setState({filterData: []});
      this.state.data.location = '';
    }
  };

  render() {
    return (
      <View style={styles.Container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.body}>
          <ScrollView>
            <WebView
              ref={'Map_Ref'}
              onMessage={(event) => {
                this.coordinatesFromMap(event.nativeEvent.data);
              }}
              source={{
                html: WebHtml,
              }}
              style={styles.WebviewMapa}
            />
            <View style={[styles.contenedor, {top: 0}]}>
              <View style={styles.headerDiv}>
                <Text style={styles.texthead}>{txtReporta}</Text>
              </View>
              <View style={[styles.viewCampos, styles.viewCampospad]}>
                <Text style={styles.Text}>{txtUbicacion}</Text>
                {this.renderAutoComplete()}
                <Text style={styles.ayuda}>{txtUbicDecripcion}</Text>
              </View>
              <View style={[styles.viewCampos, styles.viewCampospad]}>
                <Text style={[styles.Text, {paddingTop: 0}]}>{txtPunto}</Text>
                <TextInput
                  style={styles.TextInput}
                  value={this.state.data.description}
                  placeholder={txtPlaceHolder}
                  onChangeText={(event) =>
                    this.onchangeInputs(event, 'description')
                  }
                />
                <Text style={styles.ayuda}>{txtPuntoDEscripcion}</Text>
              </View>
            </View>
            <Pressable style={{display: 'none'}} onPress={this.getCapas}>
              <Image
                style={styles.iconoCapa}
                source={require('../iconos/grupo3/capax2.png')}
              />
            </Pressable>
            <Pressable style={styles.btnCapas} onPress={this.getUbicacion}>
              <Image
                style={styles.iconoCapa}
                source={require('../iconos/grupo3/ubicarx2.png')}
              />
            </Pressable>
            <View>
              <View style={styles.footer}>
                <Text style={styles.TextFooter}>{txtAgregarFoto}</Text>
                <View style={styles.viewCamposFotos}>
                  <View style={styles.viewCamposBtn}>
                    <Text style={styles.Txtfoto}>{txtTomarFoto}</Text>
                    <View style={styles.viewicono}>
                      <Pressable style={styles.btn} onPress={this.camaraPress}>
                        <Image
                          style={styles.icono}
                          source={require('../iconos/grupo4/001-camara-fotografica.png')}
                        />
                      </Pressable>
                    </View>
                  </View>
                  <View style={styles.viewCamposBtn}>
                    <Text style={styles.Txtfoto}>{txtGalery}</Text>
                    <View style={styles.viewicono}>
                      <Pressable style={styles.btn} onPress={this.galeryPress}>
                        <Image
                          style={styles.icono}
                          source={require('../iconos/grupo4/002-foto.png')}
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
                <Pressable
                  style={styles.buttonReportar}
                  onPress={() => this.validarReporte()}>
                  <Image
                    style={styles.buttonOk}
                    source={require('../iconos/REPORTAR.png')}
                  />
                </Pressable>
              </View>
            </View>
            {this.renderload()}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  renderAutoComplete() {
    return (
      <View style={{height: inputAlto}}>
        <Pressable
          style={
            this.state.data.location == undefined ||
            this.state.data.location == ''
              ? styles.btnOculto
              : styles.btnUbic
          }>
          <Image
            style={styles.iconoText}
            source={require('../iconos/ubicacion.png')}
          />
        </Pressable>
        <Autocomplete
          autoCapitalize="none"
          defaultValue={this.state.selectedItem}
          data={this.state.filterData}
          style={{
            backgroundColor: 'transparent',
            height: inputAlto,
            fontSize: fontSizeInput,
            fontFamily: 'MavenPro-Medium',
          }}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle}
          listContainerStyle={styles.listContainerStyle}
          listStyle={styles.listStyle}
          hideResults={false}
          keyExtractor={(item, i) => i.toString()}
          onChangeText={(text) => this.searchDirection(text)}
          renderItem={({item, i}) => (
            <Pressable
              style={styles.SearchBoxTouch}
              onPress={() => {
                this.setState({selectedItem: item});
                this.setState({filterData: []});
                this.searchCoordinates(item);
                this.state.data.location = item;
              }}>
              <Pressable style={styles.imgDir}>
                <Image
                  style={styles.iconoText}
                  source={require('../iconos/ubicacion.png')}
                />
              </Pressable>
              <Text style={styles.SearchBoxTextItem}>{item}</Text>
            </Pressable>
          )}
        />
        <Pressable
          style={
            this.state.data.location == undefined ||
            this.state.data.location == ''
              ? styles.btnOculto
              : styles.btnLimpiar
          }
          onPress={this.limpiar}>
          <Image
            style={styles.iconoText}
            source={require('../iconos/ElipseX.png')}
          />
          <Image
            style={[styles.iconoText, styles.iconoX]}
            source={require('../iconos/X2x.png')}
          />
        </Pressable>
      </View>
    );
  }

  setLoadVisible = (visible) => {
    this.setState({load: visible});
  };

  renderload() {
    return (
      <Modal
        transparent={true}
        visible={this.state.load}
        onRequestClose={() => {
          this.setLoadVisible(false);
        }}>
        <View style={stylesLoad.contenedor}>
          <Image
            source={require('../iconos/loading.gif')}
            style={stylesLoad.loadGif}
          />
        </View>
      </Modal>
    );
  }
}

const stylesLoad = StyleSheet.create({
  contenedor: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  loadGif: {
    opacity: 10,
    resizeMode: 'center',
  },
});

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  containerStyle: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#B7B7B7',
    marginBottom: 50,
    zIndex: 9,
  },
  inputContainerStyle: {
    paddingLeft: 30,
    paddingRight: 30,
    fontSize: fontSizeText,
    borderWidth: 0,
    height: inputAlto,
    borderRadius: 18,
    zIndex: 4,
    color: Colors.black,
  },
  listContainerStyle: {
    backgroundColor: 'transparent',
    width: '100%',
    zIndex: 9,
  },
  listStyle: {
    borderWidth: 0,
    zIndex: 9,
  },
  SearchBoxTouch: {
    margin: 5,
    borderWidth: 1,
    borderColor: '#B7B7B7',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    paddingTop: 2,
    zIndex: 10,
    fontSize: fontSizeText,
  },
  SearchBoxTextItem: {
    margin: 3,
    fontSize: fontSizeTitle,
    fontFamily: 'MavenPro-Medium',
    marginLeft: 20,
    right: 2,
    width: '90%',
    zIndex: 9,
  },
  imgDir: {
    left: 0,
    width: 27,
    height: 25,
    zIndex: 9,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  WebviewMapa: {
    height: height,
    width: width,
    margin: 0,
    padding: 0,
    zIndex: 0,
    backgroundColor: 'gray',
  },
  btnOculto: {
    display: 'none',
  },
  btnLimpiar: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: -5,
    width: 40,
    height: 40,
    zIndex: 10,
  },
  btnUbic: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    width: 35,
    height: 35,
    zIndex: 10,
  },
  iconoX: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: '25%',
    width: '25%',
  },
  TextUbic: {
    paddingLeft: 35,
  },
  iconoText: {
    height: '60%',
    width: '60%',
  },
  btnCapas: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    zIndex: 1,
    right: 5,
    top: ubicarMe,
    borderRadius: 50,
  },
  iconoCapa: {
    height: '100%',
    width: '100%',
  },
  TextInput: {
    width: '100%',
    height: inputAlto,
    fontFamily: 'MavenPro-Medium',
    borderRadius: 18,
    fontSize: fontSizeInput,
    margin: 0,
    padding: 0,
    borderColor: '#B7B7B7',
    borderWidth: 1,
    paddingLeft: 18,
  },
  Text: {
    color: Colors.black,
    fontSize: fontSizeTitle,
    fontFamily: 'MavenPro-Bold',
    textAlign: 'left',
    left: 0,
    margin: 0,
    paddingLeft: 5,
    paddingTop: 3,
    paddingBottom: 5,
    padding: 0,
    zIndex: 1,
  },
  ayuda: {
    color: '#9A9393',
    textAlign: 'left',
    paddingBottom: 1,
    paddingTop: 4,
    fontSize: fontSizeAyudas,
    fontFamily: 'MavenPro-Regular',
    width: '100%',
    zIndex: 1,
  },
  viewCampos: {
    flexDirection: 'column',
    padding: 0,
    marginBottom: 15,
  },
  contenedor: {
    backgroundColor: '#fff',
    opacity: 0.9,
    width: width,
    position: 'absolute',
    zIndex: 2,
  },
  viewCampospad: {
    paddingLeft: 30,
    paddingRight: 30,
  },
  body: {
    fontFamily: 'MavenPro-Medium',
    textAlign: 'center',
  },
  headerDiv: {
    backgroundColor: '#03AED8',
    height: 50,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingLeft: 0,
    paddingRight: 0,
  },
  texthead: {
    color: '#fff',
    textAlign: 'center',
    position: 'absolute',
    fontFamily: 'MavenPro-Bold',
    fontSize: fontSizehead,
    left: 20,
    right: 20,
    bottom: 10,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  footer: {
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 180,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    opacity: 0.9,
    zIndex: 1,
  },
  TextFooter: {
    color: '#575a5d',
    marginTop: 5,
    fontSize: 15,
    position: 'absolute',
  },
  viewCamposFotos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    position: 'absolute',
    bottom: 50,
    padding: 0,
    height: 130,
    width: 'auto',
    zIndex: 1,
  },
  viewicono: {
    width: '100%',
    textAlign: 'center',
    height: 39,
    borderRadius: 50,
    borderColor: '#03AED8',
    borderWidth: 2,
    zIndex: 1,
    backgroundColor: '#ffffff',
  },
  viewCamposBtn: {
    marginLeft: '5%',
    marginRight: '5%',
  },
  btn: {
    height: 35,
    zIndex: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icono: {
    top: 5,
    position: 'relative',
    alignItems: 'center',
    zIndex: 3,
  },
  Txtfoto: {
    color: '#575a5d',
    fontSize: fontSizeText,
    textAlign: 'center',
    marginBottom: 5,
  },
  buttonReportar: {
    position: 'absolute',
    bottom: 20,
    zIndex: 3,
  },
  buttonOk: {
    width: 310,
    height: 47,
    zIndex: 3,
  },
});

export default getFormulario;
