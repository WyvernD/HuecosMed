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
  TouchableOpacity,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {WebView} from 'react-native-webview';
import WebHtml from './MapComponent';
import ImagePicker from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import {Dimensions} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';

const encode64 = require('../libs/B64');

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
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
        }
      } catch (err) {
        console.log(err);
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
        console.error(error);
      });
  }

  onsubmit = () => {
    const data = {...this.state.data};
    //console.log(data);
  };
  getDirecciones(text) {}

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
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.uri};
        console.log('response', JSON.stringify(response));
        this.state.data.urlFoto = response.uri;
        this.state.data.base64 = response.data;
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
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.uri};
        console.log('response', JSON.stringify(response));
        this.state.data.urlFoto = response.uri;
        this.state.data.base64 = response.data;
      }
    });
  };

  validarReporte = () => {
    const datos = {...this.state.data};
    const datosMapa = this.refs.Map_Ref.injectJavaScript('mymap.getCenter()');
    console.log(datosMapa);
    if (datos.location != undefined) {
      //this.llenarUbicacion(currentLatitude, currentLongitude);
      this.props.navigation.navigate('Reporte', {
        datos: JSON.stringify(this.state),
      });
    } else {
      Alert.alert(
        'Campo obligatorio',
        'El campo ubicación es obligatorio.',
        [{text: 'Aceptar', onPress: () => console.log('Aceptar Pressed')}],
        {cancelable: false},
      );
    }
  };

  coordinatesFromMap = (data) => {
    let datos = JSON.parse(data);
    this.llenarUbicacion(datos.lat, datos.lng);
    console.log(datos);
  }

  limpiar = () => {
    this.setState({
      data: {...this.state.data, ['location']: ''},
    });
  };

  ubicarDireccion = () => {
    let url =
      this.state.consulta.buscarDir + encode64(this.state.data.location);
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.Y == undefined || responseJson.X == undefined) {
          /*Alert.alert(
            'No se encontro la ubicación',
            'Por favor verifique la dirección.',
            [{text: 'Aceptar'}],
            {cancelable: false},
          );*/
        } else {
          const currentLatitude = responseJson.Y[0];
          const currentLongitude = responseJson.X[0];
          if (currentLatitude != 0 && currentLongitude != 0) {
            this.refs.Map_Ref.injectJavaScript(
              ` mymap.flyTo([${currentLatitude}, ${currentLongitude}], 18)`,
            );
          }
        }
      })
      .catch((error) => {
        console.error(error);
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
        alert(error.message);
      },
      {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
    );
  };

  llenarUbicacion = (currentLatitude, currentLongitude) => {
    this.setState({
      data: {...this.state.data, ['latitude']: currentLatitude},
    });
    this.setState({
      data: {...this.state.data, ['longitude']: currentLongitude},
    });
    this.setState({
      data: {...this.state.data, ['zoom']: 17},
    });
  };

  searchDirection = (direccion) => {
    if (direccion.length > 0){
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
          console.error(error);
        });
    }else{
      this.setState({filterData: []});
    }
  };

  searchCoordinates = (direccion) => {
    if (direccion.length > 0){
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
          let latitud = responseJson[0].LATITUD;
          let longitud = responseJson[0].LONGITUD;
          this.refs.Map_Ref.injectJavaScript(
            ` mymap.flyTo([${latitud}, ${longitud}], 18)`,
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }else{
      this.setState({filterData: []});
    }
  };


  render() {
    return (
      <View style={styles.Container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.body}>
          <ScrollView style={styles.scrollView}>
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
            <View style={[styles.contenedor, styles.contenedorTop]}>
              <View
                style={[styles.headerDiv, {paddingLeft: 0, paddingRight: 0}]}>
                <Text style={styles.texthead}>{'Reportar a HUECOSMED'}</Text>
              </View>
              <View style={[styles.viewCampos, styles.viewCampospad]}>
                <Text style={styles.Text}>{txtUbicacion}</Text>
                <Autocomplete
                  autoCapitalize="none"
                  defaultValue={this.state.selectedItem}
                  data={this.state.filterData}
                  containerStyle={styles.AutocompleteStyle}
                  keyExtractor={(item, i) => i.toString()}
                  onChangeText={(text) => this.searchDirection(text)}
                  placeholder="Type The Search Keyword..."
                  renderItem={({item, i}) => (
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({selectedItem: item});
                        this.setState({filterData: []});
                        this.searchCoordinates(item);
                      }}>
                      <Text style={styles.SearchBoxTextItem}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                <Pressable
                  style={
                    this.state.data.location == undefined ||
                    this.state.data.location == ''
                      ? styles.btnOculto
                      : styles.btnUbic
                  }
                  onPress={this.ubicarDireccion}>
                  <Image
                    style={styles.iconoText}
                    source={require('../iconos/ubicacion.png')}
                  />
                </Pressable>
                <TextInput
                  style={[styles.TextInput, styles.TextUbic]}
                  value={this.state.data.location}
                  onChangeText={(event) => [
                    this.onchangeInputs(event, 'location'),
                    this.ubicarDireccion(event),
                  ]}
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
                <Text style={styles.ayuda}>{txtUbicDecripcion}</Text>
              </View>
              <View style={[styles.viewCampos, styles.viewCampospad]}>
                <Text style={styles.Text}>{txtPunto}</Text>
                <TextInput
                  style={styles.TextInput}
                  value={this.state.data.description}
                  placeholder={'Ejemplo: Hueco cerca al consumo de la 80'}
                  onChangeText={(event) =>
                    this.onchangeInputs(event, 'description')
                  }
                />
                <Text style={styles.ayuda}>{txtPuntoDEscripcion}</Text>
              </View>
            </View>
            <Pressable style={styles.btnCapas} onPress={this.getCapas}>
              <Image
                style={styles.iconoCapa}
                source={require('../iconos/grupo3/capax2.png')}
              />
            </Pressable>
            <Pressable
              style={[styles.btnCapas, {top: '45%'}]}
              onPress={this.getUbicacion}>
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
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  AutocompleteStyle: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
    borderWidth:1,
    backgroundColor: '#e21818'
  },
  WebviewMapa: {
    height: height,
    width: width,
    margin: 0,
    padding: 0,
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'gray',
  },
  btnOculto: {
    display: 'none',
  },
  btnLimpiar: {
    position: 'absolute',
    top: '25%',
    right: '5%',
    width: 40,
    height: 40,
  },
  btnUbic: {
    position: 'absolute',
    alignItems: 'center',
    top: '25%',
    left: '10%',
    width: 40,
    height: 40,
    zIndex: 5,
  },
  iconoX: {
    position: 'absolute',
    height: '25%',
    width: '25%',
    left: 7,
    top: 7,
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
    width: 40,
    height: 40,
    right: 25,
    top: '38%',
    borderRadius: 50,
    alignItems: 'center',
  },
  iconoCapa: {
    position: 'relative',
    height: '100%',
    width: '100%',
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
    fontWeight: 'bold',
    fontFamily: 'MavenPro_500Medium',
    textAlign: 'left',
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
    height: 100,
  },
  scrollView: {
    textAlign: 'center',
  },
  contenedor: {
    backgroundColor: '#fff',
    opacity: 0.9,
    width: width,
    position: 'absolute',
  },
  viewCampospad: {
    paddingLeft: 30,
    paddingRight: 30,
  },
  body: {
    fontFamily: 'MavenPro-Medium',
  },
  contenedorTop: {
    top: 0,
  },
  contenedorHead: {
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: '#fff',
    width: width,
    position: 'absolute',
  },
  headerDiv: {
    backgroundColor: '#03AED8',
    height: 80,
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
    bottom: 20,
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
    opacity: 0.7,
    zIndex: 1,
  },
  TextFooter: {
    color: '#575a5d',
    marginTop: 5,
    fontSize: 18,
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
    height: 40,
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
  },
  Txtfoto: {
    color: '#575a5d',
    fontSize: 12,
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
  },
  SearchBoxTextItem: {
    margin: 5,
    fontSize: 16,
    paddingTop: 4,
  }
});

export default getFormulario;
