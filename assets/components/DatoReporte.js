import React from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Modal,
  View,
  Dimensions,
} from 'react-native';
import {WebView} from 'react-native-webview';
import WebHtml from './MapComponent';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import ImagePicker from 'react-native-image-picker';

const {width, height} = Dimensions.get('window');
const urlRoot = 'https://www.medellin.gov.co';
const encode64 = require('../libs/B64');

let txtDatosRep = 'Datos del reporte';
let txtUbicacion = 'Ubicación actual del daño en la via';
let txtPunto = 'Digite un punto de referencia de la dirección';
let txtAgregarFoto = 'Agregar fotografia real (Opcional)';
let campoObligatorio = '';
let txtFotoEvidencia = 'Fotografía de evidencia';
let txtEmail = 'Ingresa el correo electrónico de quien reporta';
let txtEmailAyuda =
  'Al correo llegarán las notificaciones de avances en la solución del daño';

const fontSizehead = width <= 380 ? 15 : 20;
const fontSizeText = width <= 380 ? 8 : 12;
const fontSizeTitle = width <= 380 ? 10 : 12;
const fontSizeAyudas = width <= 380 ? 7 : 9;
const inputAlto = width <= 380 ? 35 : 40;
const fontSizeInput = width <= 380 ? 12 : 15;

const isEmail = (val) => {
  let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regEmail.test(val)) {
    return 'Invalid Email';
  } else {
    return val;
  }
}

class DatosReporte extends React.Component {
  state = {
    data: {},
    rutaGuardado: '',
    load: false,
    modalVisible: false,
    paramsTrue: false,
    parametros: [],
  };

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  componentDidUpdate() {
    if (this.props.route.params != undefined) {
      const datosRes = JSON.parse(this.props.route.params.dato);
      this.state.data = datosRes.data;
      this.state.rutaGuardado = datosRes.rutaGuardado;
      this.setLoadVisible(false);
      this.props.route.params = undefined;
    }
  }

  async cargarParametros() {
    let response = await fetch(
      'https://www.medellin.gov.co/HuecosMed/cargardatos.hyg?str_sql=eyJTUUwiOiJTUUxfSFVFQ09TX0NPTlNVTFRBUl9QQVJBTUVUUk9TIiwiTiI6MCwiREFUT1MiOnt9fQ%3D%3D',
    );
    let res = await response.json();
    let textos = res[0];
    txtUbicacion = textos.UBICACION;
    txtPunto = textos.PUNTOREF;
    txtAgregarFoto = textos.AGREGARFOTO;
    campoObligatorio = textos.EMALOBLIGATORIO;
    txtDatosRep = textos.DATOSGEN;
    txtEmail = textos.CORREO;
    txtFotoEvidencia = textos.FOTOEVIDENCIA;
    txtEmailAyuda = textos.AYUDACORREO;
  }

  async componentDidMount() {
    this.setLoadVisible(true);
    this.cargarParametros();
    if (this.props.route.params != undefined) {
      const datosRes = JSON.parse(this.props.route.params.dato);
      this.state.data = datosRes.data;
      this.state.rutaGuardado = datosRes.rutaGuardado;
      this.onchangeInputs();
      setTimeout(() => {
        this.refs.Map_Ref.injectJavaScript(
          ` mymap.flyTo([${this.state.data.latitude}, ${this.state.data.longitude}], ${this.state.data.zoom})`,
        );
        this.setLoadVisible(false);
      }, 1000);
      this.props.route.params = undefined;
    }
    this.setLoadVisible(false);
  }

  validarReporte = () => {
    this.setLoadVisible(true);
    if (
      this.state.data.email != undefined &&
      this.state.data.email != '' &&
      this.state.data.location != undefined &&
      this.state.data.location != ''
    ) {
      let emailTru = isEmail(this.state.data.email);
      if (emailTru !== 'Invalid Email') {
        this.guardarDatos();
      } else {
        this.setLoadVisible(false);
        Alert.alert(
          'Advertencia',
          'El correo electrónico es invalido.',
          [{text: 'Aceptar'}],
          {cancelable: false},
        );
      }
    } else {
      this.setLoadVisible(false);
      Alert.alert(
        'Campo obligatorio',
        'El campo correo electrónico es obligatorio.',
        [{text: 'Aceptar'}],
        {cancelable: false},
      );
    }
  };


  async guardarDatos() {
    this.setLoadVisible(true);
    let url = urlRoot + '/HuecosMed/guardarInfoHueco.hyg';
    let data = {
      ruta: this.state.rutaGuardado,
      nombre:
        this.state.data.urlFoto === undefined
          ? ''
          : this.state.data.urlFoto.split('/').pop(),
      archivo:
        this.state.data.base64 === undefined ? '' : this.state.data.base64,
      insert: JSON.stringify({
        email: this.state.data.email + '',
        location: this.state.data.location + '',
        description:
          this.state.data.description === undefined
            ? ''
            : this.state.data.description + '',
        latitude: this.state.data.latitude + '',
        longitude: this.state.data.longitude + '',
        ruta: this.state.rutaGuardado,
      }),
    };
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    };
    fetch(url, requestOptions)
      .then((e) => e.text())
      .then((data) => {
        this.onMensage(data);
      })
      .catch((error) => {
        this.setLoadVisible(false);
      });
  }

  async onMensage(datos) {
    let res = datos.split(',');
    if (res[0] === 'Ok') {
      Alert.alert(
        'Su reporte se ha realizado',
        'Gracias por su reporte  \n  \n' +
          'nuestro equipo se encuentra verificando  la información para dar solución. \n  \n ' +
          'Recuerde su número de reporte  ' +
          res[1],
        [{text: 'Aceptar'}],
        {cancelable: false},
      );
      this.props.navigation.navigate('Formulario');
    } else {
      Alert.alert(
        'Error',
        'comuniquese con su proveedor de servicios',
        [{text: 'Aceptar'}],{cancelable: false});
    }
    this.setLoadVisible(false);
  }
  onchangeInputs = (text, name) => {
    this.setState({data: {...this.state.data, [name]: text}});
    this.onsubmit();
  };

  onsubmit = () => {
    const data = this.state.data;
    //console.log(data.email);
  };

  renderFileData() {
    return (
      <Image source={{uri: this.state.data.urlFoto}} style={styles.captures} />
    );
  }
  renderFileModal() {
    return (
      <Image source={{uri: this.state.data.urlFoto}} style={styles.fotoModal} />
    );
  }

  render() {
    return (
      <View style={styles.Container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.body}>
          <ScrollView>
            <View style={styles.headerDiv}>
              <Text style={styles.texthead}>{txtDatosRep}</Text>
            </View>
            {this.renderload()}
            <WebView
              ref={'Map_Ref'}
              source={{
                html: WebHtml,
              }}
              style={styles.WebviewMapa}
            />
            <View style={styles.viewFooter}>
              <View style={styles.footer}>
                <Text style={styles.TextIni}>{txtDatosRep}</Text>
                <View style={styles.viewCampos}>
                  <Text style={styles.Text}>{txtUbicacion}</Text>
                  <TextInput
                    editable={false}
                    style={styles.TextInput}
                    value={this.state.data.location}
                  />
                </View>
                <View style={styles.viewCampos}>
                  <Text style={styles.Text}>{txtPunto}</Text>
                  <TextInput
                    style={styles.TextInput}
                    value={this.state.data.description}
                    onChangeText={(event) =>
                      this.onchangeInputs(event, 'description')
                    }
                  />
                </View>
                <View style={styles.viewCampos}>
                  <Text style={styles.Text}>{txtFotoEvidencia}</Text>
                  <View
                    style={
                      this.state.data.urlFoto == undefined ||
                      this.state.data.urlFoto == ''
                        ? styles.btnOculto
                        : styles.campoImagen
                    }>
                    <Pressable
                      onPress={() => {
                        this.setModalVisible(true);
                      }}>
                      {this.renderFileData()}
                    </Pressable>
                  </View>
                </View>

                {this.state.data.urlFoto === undefined ||
                this.state.data.urlFoto === ''
                  ? this.renderSinFoto()
                  : null}

                <View style={styles.viewCampos}>
                  <Text style={styles.Text}>{txtEmail}</Text>
                  <TextInput
                    style={styles.TextInput}
                    autoCompleteType={'email'}
                    value={this.state.data.email}
                    onChangeText={(event) =>
                      this.onchangeInputs(event, 'email')
                    }
                    onSubmitEditing={(e) =>
                      this.onchangeInputs(this.state.data.email, 'email')
                    }
                  />
                  <Text style={styles.ayuda}>{txtEmailAyuda}</Text>
                </View>
              </View>
              <Pressable
                style={
                  this.state.load ? {display: 'none'} : styles.buttonReportar
                }
                onPress={this.validarReporte}>
                <Image
                  style={styles.buttonOk}
                  source={require('../iconos/enviarReporte.png')}
                />
              </Pressable>
            </View>
            {this.renderModal()}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  renderSinFoto() {
    return (
      <View>
        <Text style={styles.TextFooter}>{txtAgregarFoto}</Text>
        <View style={styles.viewCamposBtn}>
          <Pressable style={styles.btn} onPress={this.camaraPress}>
            <Image
              style={styles.icono}
              source={require('../iconos/grupo4/001-camara-fotografica.png')}
            />
          </Pressable>
          <Pressable style={styles.btn} onPress={this.galeryPress}>
            <Image
              style={styles.icono}
              source={require('../iconos/grupo4/002-foto.png')}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  renderModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {this.renderFileModal()}
            <Pressable
              style={styles.openButton}
              onPress={() => {
                this.setModalVisible(false);
              }}>
              <Text style={styles.textStyle}>x</Text>
            </Pressable>
            <View style={styles.viewCamposBtn}>
              <Pressable style={styles.btn} onPress={this.camaraPress}>
                <Image
                  style={styles.icono}
                  source={require('../iconos/grupo4/001-camara-fotografica.png')}
                />
              </Pressable>
              <Pressable style={styles.btn} onPress={this.galeryPress}>
                <Image
                  style={styles.icono}
                  source={require('../iconos/grupo4/002-foto.png')}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  camaraPress = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'HuecosMed',
        privateDirectory: false,
      },
    };

    ImagePicker.launchCamera(options, (response) => {
      // //console.log('Response = ', response);
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        // console.log('response', JSON.stringify(response));
        this.state.data.urlFoto = response.uri;
        this.state.data.base64 = response.data;
        this.setModalVisible(false);
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
      // //console.log('Response = ', response);

      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        // console.log('response', JSON.stringify(response));
        this.state.data.urlFoto = response.uri;
        this.state.data.base64 = response.data;
        this.setModalVisible(false);
      }
    });
  };

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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  TextFooter: {
    color: '#575a5d',
    marginTop: 5,
    fontSize: 15,
    textAlign: 'center',
  },
  openButton: {
    top: '1%',
    right: '1%',
    width: 25,
    height: 25,
    position: 'absolute',
    textAlign: 'center',
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#03AED8',
  },
  textStyle: {
    color: '#03AED8',
    top: -8,
    textAlign: 'center',
    fontSize: 22,
  },
  fotoModal: {
    width: width / 2 + 100,
    height: height / 2,
    borderRadius: 5,
  },
  viewCamposBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    borderColor: '#03AED8',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: 5,
    paddingBottom: 5,
    borderWidth: 2,
    borderRadius: 20,
  },
  //fin modal.
  Container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  WebviewMapa: {
    flex: 1,
    height: height / 3 - 10,
    position: 'relative',
    width: width,
    margin: 0,
    padding: 0,
    backgroundColor: 'gray',
    zIndex: 1,
  },
  btnOculto: {
    display: 'none',
  },
  campoImagen: {
    width: 90,
    height: 80,
    flexDirection: 'row',
  },
  captures: {
    marginRight: 10,
    height: 80,
    width: 90,
  },
  TextInput: {
    width: 'auto',
    height: inputAlto,
    borderRadius: 18,
    borderColor: '#B7B7B7',
    borderWidth: 1,
    margin: 0,
    padding: 0,
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
    paddingTop: 5,
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
    width: '100%',
    zIndex: 1,
  },
  viewCampos: {
    flexDirection: 'column',
    padding: 0,
    paddingBottom: 5,
    height: 'auto',
  },
  body: {
    fontFamily: 'MavenPro-Medium',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  contenedorHead: {
    backgroundColor: 'transparent',
    paddingLeft: 0,
    paddingRight: 0,
    position: 'absolute',
  },
  headerDiv: {
    backgroundColor: '#03AED8',
    width: width,
    height: 50,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingLeft: 0,
    paddingRight: 0,
    position: 'absolute',
    zIndex: 3,
  },
  texthead: {
    color: '#fff',
    textAlign: 'center',
    position: 'absolute',
    fontFamily: 'MavenPro-Bold',
    fontSize: 20,
    left: 20,
    right: 20,
    bottom: 10,
  },
  viewFooter: {
    alignItems: 'center',
  },
  footer: {
    paddingTop: 10,
    bottom: 0,
    width: width,
    paddingLeft: 20,
    paddingRight: 20,
    opacity: 0.8,
  },
  TextIni: {
    textAlign: 'left',
    fontSize: 20,
    fontFamily: 'MavenPro-Bold',
  },
  buttonReportar: {
    bottom: 2,
  },
  buttonOk: {
    height: 47,
  },
});

export default DatosReporte;
