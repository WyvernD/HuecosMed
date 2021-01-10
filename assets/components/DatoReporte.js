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
} from 'react-native';
import {WebView} from 'react-native-webview';
import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
import WebHtml from './MapComponent';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import ImagePicker from 'react-native-image-picker';
const txtUbicacion = 'Ubicación actual del daño en la via';

const txtUbicDecripcion =
  'Puede digitar la dirección donde se encuentra el daño o ubicar el PIN en el mapa';
const txtPunto = 'Digite un punto de referencia de la dirección';
const txtPuntoDEscripcion =
  'El punto de referencia permitira ubicar fácilmente la ubicación del daño';
const urlRoot = 'https://www.medellin.gov.co';
const encode64 = require('../libs/B64');
const validate = (email) => {
  const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

  return expression.test(String(email).toLowerCase());
};

class DatosReporte extends React.Component {
  state = {
    data: {},
    consulta: [],
    load: false,
    modalVisible: false,
  };

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  async componentDidMount() {
    this.state.data = JSON.parse(this.props.route.params.datos).data;
    this.state.consulta = JSON.parse(this.props.route.params.datos).consulta;
    this.refs.Map_Ref.injectJavaScript(
      ` mymap.flyTo([${this.state.data.latitude}, ${this.state.data.longitude}], ${this.state.data.zoom})`,
    );
    this.onchangeInputs();
  }

  onchangeInputs = (text, name) => {
    this.setState({data: {...this.state.data, [name]: text}});
    //console.log({...this.state.data});
  };

  validarReporte = () => {
    if (
      this.state.data.email != undefined &&
      this.state.data.email != '' &&
      this.state.data.location != undefined &&
      this.state.data.location != ''
    ) {
      if (!validate(this.state.data.email)) {
        Alert.alert(
          'Correo invalido',
          'El correo electrónico es incorrecto',
          [{text: 'Aceptar'}],
          {cancelable: false},
        );
        return;
      }

      this.guardarDatos();
    } else {
      Alert.alert(
        'Campo obligatorio',
        'El campo correo electrónico es obligatorio.',
        [{text: 'Aceptar'}],
        {cancelable: false},
      );
    }
  };

  async guardarDatos() {
    Alert.alert('Enviando reporte', 'Espere..', [{text: 'Aceptar'}], {
      cancelable: false,
    });

    let url = urlRoot + '/HuecosMed/guardarInfoHueco.hyg';
    let data = {
      ruta: this.state.consulta.URLLOCALPHOTO,
      nombre: this.state.data.urlFoto.split('/').pop(),
      archivo: this.state.data.base64,
      insert: JSON.stringify({
        email: this.state.data.email + '',
        location: this.state.data.location + '',
        description: this.state.data.description + '',
        latitude: this.state.data.latitude + '',
        longitude: this.state.data.longitude + '',
        ruta: this.state.consulta.URLLOCALPHOTO,
      }),
    };
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    };
    fetch(url, requestOptions)
      .then((e) => {
        this.onMensage();
      })
      .then(function (res) {
        this.onMensage();
      })
      .catch((error) => {});
  }

  async onMensage() {
    const consulta = {
      SQL: 'SQL_HUECOS_CONSULTAR_ULTIMO',
      N: 0,
      DATOS: {},
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
        console.log(responseJson);
        console.log(responseJson[0].ID);
        Alert.alert(
          'Gracias por su reporte',
          'Nuestro equipo se encuentra verificando  la información para dar solución. \n  \n ' +
            'Recuerde su número de reporte : ' +
            responseJson[0].ID,
          [{text: 'Aceptar'}],
          {cancelable: false},
        );
        this.props.navigation.navigate('Formulario');
      });
  }

  onsubmit = () => {
    const data = {...this.state.data};
    console.log(data);
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
          <ScrollView style={styles.scrollView}>
            <View style={styles.contenedorHead}>
              <View style={styles.headerDiv}>
                <Text style={styles.texthead}>{'Datos del reporte'}</Text>
              </View>
            </View>
            <WebView
              ref={'Map_Ref'}
              source={{
                html: WebHtml,
              }}
              style={styles.WebviewMapa}
            />
            <View style={styles.viewFooter}>
              <View style={styles.footer}>
                <Text style={styles.TextIni}>Datos del reporte</Text>
                <View style={styles.viewCampos}>
                  <Text style={styles.Text}>{txtUbicacion}</Text>
                  <TextInput
                    style={styles.TextInput}
                    value={this.state.data.location}
                  />
                  <Text style={styles.ayuda}>{txtUbicDecripcion}</Text>
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
                  <Text style={styles.ayuda}>{txtPuntoDEscripcion}</Text>
                </View>
                <View style={styles.viewCampos}>
                  <Text style={styles.TextIni}>Fotografías de evidencia</Text>
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
                  <Text style={styles.Text}>
                    {'Ingresa el correo electrónico de quien reporta'}
                  </Text>
                  <TextInput
                    style={styles.TextInput}
                    autoCompleteType={'email'}
                    value={this.state.data.email}
                    onChangeText={(event) =>
                      this.onchangeInputs(event, 'email')
                    }
                    onChange={(event) => this.onchangeInputs(event, 'email')}
                  />
                  <Text style={styles.ayuda}>
                    {
                      'A este correo llegarán las notificaciones de avances en la solución del daño'
                    }
                  </Text>
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
        <Text style={styles.TextFooter}>
          {'Agregar fotografia real (Opcional)'}
        </Text>
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
          Alert.alert('Modal has been closed.');
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
        path: 'images',
      },
    };

    this.setModalVisible(false);
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        console.log('response', JSON.stringify(response));
        this.state.data.urlFoto = response.uri;
        this.state.data.base64 = response.data;
        this.setModalVisible(true);
      }
    });
  };

  galeryPress = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    this.setModalVisible(false);
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        console.log('response', JSON.stringify(response));
        this.state.data.urlFoto = response.uri;
        this.state.data.base64 = response.data;
        this.setModalVisible(true);
      }
    });
  };
}

const styles = StyleSheet.create({
  fondo: {
    backgroundColor: 'red',
  },
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
    fontSize: 18,
    textAlign: 'center',
  },
  openButton: {
    top: '0%',
    right: '0%',
    width: 30,
    height: 30,
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
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25,
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
  },
  WebviewMapa: {
    flex: 1,
    height: height / 3 - 65,
    width: width,
    margin: 0,
    padding: 0,
    backgroundColor: 'gray',
  },
  btnOculto: {
    display: 'none',
  },
  campoImagen: {
    width: 90,
    height: 90,
    flexDirection: 'row',
  },
  captures: {
    marginLeft: 10,
    height: 80,
    width: 90,
  },
  TextInput: {
    width: 'auto',
    height: 45,
    borderRadius: 18,
    borderColor: '#B7B7B7',
    borderWidth: 1,
    paddingLeft: 18,
  },
  Text: {
    color: Colors.black,
    fontSize: 12,
    position: 'relative',
    textAlign: 'left',
    fontWeight: 'bold',
    left: 0,
    margin: 0,
    paddingLeft: 5,
    padding: 0,
  },
  ayuda: {
    color: '#9A9393',
    fontSize: 10,
    textAlign: 'left',
  },
  viewCampos: {
    flexDirection: 'column',
    padding: 0,
    paddingBottom: 10,
    height: 'auto',
  },
  scrollView: {
    textAlign: 'center',
  },
  body: {
    fontFamily: 'Maven Pro',
  },
  contenedorHead: {
    backgroundColor: '#ffffffd6',
    paddingLeft: 0,
    paddingRight: 0,
  },
  headerDiv: {
    backgroundColor: '#03AED8',
    height: 80,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  texthead: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    fontFamily: 'Maven Pro',
    fontSize: 20,
    left: 20,
    right: 20,
    bottom: 20,
  },
  viewFooter: {
    alignItems: 'center',
  },
  footer: {
    paddingTop: 10,
    bottom: 0,
    width: width,
    paddingLeft: 30,
    paddingRight: 30,
    opacity: 0.8,
  },
  TextIni: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonReportar: {
    bottom: 2,
  },
  buttonOk: {
    width: 304,
    height: 47,
  },
});

export default DatosReporte;
