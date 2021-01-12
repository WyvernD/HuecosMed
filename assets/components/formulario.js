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

const txtUbicacion = 'Ubicación actual del daño en la via';
const txtUbicDecripcion =
  'Puede digitar la dirección donde se encuentra el daño o ubicar el PIN en el mapa';
const txtPunto = 'Digite un punto de referencia de la dirección';
const txtPuntoDEscripcion =
  'El punto de referencia permitira ubicar fácilmente la ubicación del daño';
const urlRoot = 'https://www.medellin.gov.co';

class getFormulario extends React.Component {
  state = {
    data: {},
    consulta: [],
    filterData: [],
    selectedItem: {},
  };

  async componentDidMount() {
    this.cargarDatos();
    this.requestCameraPermission();
    if (Platform.OS === 'ios') {
      Geolocation.getCurrentPosition(
        //Will give you the current location
        (position) => {
          const currentLongitude = JSON.stringify(position.coords.longitude);
          const currentLatitude = JSON.stringify(position.coords.latitude);
          this.refs.Map_Ref.injectJavaScript(`
          mymap.setView([${currentLatitude}, ${currentLongitude}], 18)`);
        },
        (error) => {
          alert(error.message);
        },
        {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
      );
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'HUECOSMED necesita tu ubicación',
            message:
              'Es necesario activar el GPS para poder ubicar adecuadamente el daño en el momento del reporte',
            buttonNegative: 'No activar',
            buttonPositive: 'Activar GPS',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
        }
      } catch (err) {
        // console.log(err);
      }
    }
  }

  async requestCameraPermission() {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);

      const permissionCamera = await PermissionsAndroid.check(
        'android.permission.CAMERA',
      );
      const permissionWriteStorage = await PermissionsAndroid.check(
        'android.permission.WRITE_EXTERNAL_STORAGE',
      );

      if (!permissionCamera || !permissionWriteStorage) {
        return {
          error: 'Failed to get the required permissions.',
        };
      }
    } catch (error) {
      return {
        error: 'Failed to get the required permissions.',
      };
    }
  }

  async cargarDatos() {
    const consulta = {
      SQL: 'SQL_HUECOS_CONSULTAR_PARAMETROS_HUECO',
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
        this.setState({consulta: responseJson[0]});
        this.refs.Map_Ref.injectJavaScript(
          ` mymap.flyTo([${this.state.consulta.latitude}, ${this.state.consulta.longitude}], ${this.state.consulta.zoom})`,
        );
      })
      .catch((error) => {
        // console.error(error);
      });
  }

  onsubmit = () => {
    const data = {...this.state.data};
    // //console.log(data);
  };

  onchangeInputs = (text, name) => {
    this.setState({data: {...this.state.data, [name]: text}});
    this.onsubmit();
  };

  camaraPress = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
        privateDirectory: true,
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
        Alert.alert('Información', 'Imagen subida correctamente');
      }
    });
  };

  galeryPress = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
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
        alert(response.customButton);
      } else {
        //const source = {uri: response.uri};
        // console.log('response', JSON.stringify(response));
        this.state.data.urlFoto = response.uri;
        this.state.data.base64 = response.data;
        Alert.alert('Información', 'Imagen subida correctamente');
      }
    });
  };

  validarReporte = () => {
    const datos = {...this.state.data};
    if (datos.location !== undefined && datos.location !== '') {
      this.props.navigation.navigate('Reporte', {
        datos: JSON.stringify(this.state),
      });
    } else {
      Alert.alert(
        'Campo obligatorio',
        'El campo ubicación es obligatorio.',
        [{text: 'Aceptar'}],
        {cancelable: false},
      );
    }
  };

  coordinatesFromMap = (data) => {
    let datos = JSON.parse(data);
    console.log(datos);
    this.llenarUbicacion(datos.lat, datos.lng);
  };

  limpiar = () => {
    this.setState({selectedItem: ''});
    this.setState({filterData: []});
    this.searchCoordinates('');
    this.setState({
      data: {...this.state.data, ['location']: ''},
    });
  };

  getCapas = () => {};

  getUbicacion = () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        this.refs.Map_Ref.injectJavaScript(
          ` mymap.flyTo([${currentLatitude}, ${currentLongitude}], 18)`,
        );
      },
      (error) => {
        if (error.PERMISSION_DENIED === 1) {
          Alert.alert(
            'HUECOSMED necesita tu ubicación.',
            'Es necesario activar el GPS para poder ubicar adecuadamente el daño en el momento del reporte.',
            [{text: 'Aceptar', onPress: () => this.ActivarGps()}],
            {cancelable: false},
          );
        } else {
          alert(error.message);
        }
      },
      {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
    );
  };
  async ActivarGps() {
    console.log('Activar GPS');
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
    if (direccion.length > 0) {
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
      this.setState({filterData: []});
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
                <Text style={styles.texthead}>{'Reportar a HUECOSMED'}</Text>
              </View>
              <View style={[styles.viewCampos, styles.viewCampospad]}>
                <Text style={styles.Text}>{txtUbicacion}</Text>
                {this.renderAutoComplete()}
                <Text style={styles.ayuda}>{txtUbicDecripcion}</Text>
              </View>
              <View style={[styles.viewCampos, styles.viewCampospad]}>
                <Text style={styles.Text}>{txtPunto}</Text>
                <TextInput
                  style={styles.TextInput}
                  value={this.state.data.description}
                  placeholder={this.state.consulta.placeHolder}
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
                <Text style={styles.TextFooter}>
                  {'Agregar fotografia real (Opcional)'}
                </Text>
                <View style={styles.viewCamposFotos}>
                  <View style={styles.viewCamposBtn}>
                    <Text style={styles.Txtfoto}>Tomar fotografia</Text>
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
                    <Text style={styles.Txtfoto}>Agregar de galeria</Text>
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
                  onPress={this.validarReporte}>
                  <Image
                    style={styles.buttonOk}
                    source={require('../iconos/REPORTAR.png')}
                  />
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  renderAutoComplete() {
    return (
      <View style={{height: 40}}>
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
                this.setState({
                  data: {...this.state.data, ['location']: item},
                });
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
}

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
    fontSize: 12,
    zIndex: 9,
  },
  inputContainerStyle: {
    paddingLeft: 30,
    paddingRight: 30,
    fontSize: 12,
    borderWidth: 0,
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
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#B7B7B7',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    paddingTop: 2,
    zIndex: 10,
  },
  SearchBoxTextItem: {
    margin: 3,
    fontSize: 12,
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
    right: '5%',
    top: height / 3,
    borderRadius: 50,
  },
  iconoCapa: {
    height: '100%',
    width: '100%',
  },
  TextInput: {
    width: 'auto',
    height: 40,
    borderRadius: 18,
    borderColor: '#B7B7B7',
    borderWidth: 1,
    paddingLeft: 18,
  },
  Text: {
    color: Colors.black,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'MavenPro-Medium',
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
    fontSize: 9,
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
    height: 60,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingLeft: 0,
    paddingRight: 0,
  },
  texthead: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    fontFamily: 'MavenPro-Medium',
    fontSize: 20,
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
  },
  icono: {
    top: 5,
    left: '35%',
    right: '40%',
    width: '35%',
    height: '63%',
    position: 'relative',
    alignItems: 'center',
    zIndex: 3,
  },
  Txtfoto: {
    color: '#575a5d',
    fontSize: 10,
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
