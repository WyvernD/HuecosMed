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
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {WebView} from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import {Dimensions} from 'react-native';

const encode64 = require('../libs/B64');

const {width, height} = Dimensions.get('window');

const txtUbicacion = 'Ubicación actual del daño en la via';
const txtUbicDecripcion =
  'Puede digitar la dirección donde se encuentra el daño o ubicar el PIN en el mapa';
const txtPunto = 'Digite un punto de referencia de la dirección';
const txtPuntoDEscripcion =
  'El punto de referencia permitira ubicar fácilmente la ubicación del daño';
const urlRoot = 'https://www.medellin.gov.co';

const imagen =
  'https://cdn-sharing.adobecc.com/id/urn:aaid:sc:US:43234e60-0eaa-4fa8-8bdd-6fc7b735afd8;version=0?component_id=9842447a-6cf1-41fc-9e4f-e8db4db53887&api_key=CometServer1&access_token=1609996332_urn%3Aaaid%3Asc%3AUS%3A43234e60-0eaa-4fa8-8bdd-6fc7b735afd8%3Bpublic_37cce0b2660c3cb0c079e2150784ea10cd99b163';

const layer =
  'https://tiles.arcgis.com/tiles/FZVaYraI7sEGQ6rF/arcgis/rest/services/CartografiaBase/VectorTileServer?f=jsapi&cacheKey=81053369bb5849b1';

const layer1 =
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

class getFormulario extends React.Component {
  state = {
    data: {},
    consulta: [],
  };
  async componentDidMount() {
    if (Platform.OS === 'ios') {
      Geolocation.getCurrentPosition(
        //Will give you the current location
        (position) => {
          const currentLongitude = JSON.stringify(position.coords.longitude);
          const currentLatitude = JSON.stringify(position.coords.latitude);
          alert(currentLatitude);
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
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          consulta: responseJson[0],
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  async componentDidUpdate() {
    if (this.props.route.params != undefined) {
      const datosRes = JSON.parse(this.props.route.params.dato);
      console.log(datosRes.urlFoto);
      this.state.data.urlFoto = datosRes.urlFoto;
      this.onchangeInputs(datosRes.urlFoto, 'urlFoto');
      this.props.route.params = undefined;
    }
  }

  onsubmit = () => {
    const data = {...this.state.data};
    console.log(data);
  };

  onchangeInputs = (text, name) => {
    this.setState({data: {...this.state.data, [name]: text}});
    this.onsubmit();
  };
  camaraPress = () => {
    this.props.navigation.navigate('Camera', {
      datos: JSON.stringify({...this.state.data}),
    });
  };
  galeryPress = () => {
    this.props.navigation.navigate('Galery');
  };
  validarReporte = () => {
    const datos = {...this.state.data};
    if (datos.location != undefined) {
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
  getCapas = () => {};
  getUbicacion = () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        this.refs.Map_Ref.injectJavaScript(`
        mymap.flyTo([${currentLatitude}, ${currentLongitude}], 18)`);
        this.setState({
          data: {...this.state.data, ['latitude']: currentLatitude},
        });
        this.setState({
          data: {...this.state.data, ['longitude']: currentLongitude},
        });
        this.setState({
          data: {...this.state.data, ['zoom']: 18},
        });
      },
      (error) => {
        alert(error.message);
      },
      {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
    );
  };
  render() {
    return (
      <View style={styles.Container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.body}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.contenedorHead}>
              <View style={styles.headerDiv}>
                <Text style={styles.texthead}>{'Reportar a HUECOSMED'}</Text>
              </View>
            </View>
            <View style={styles.contenedor}>
              <View style={styles.viewCampos}>
                <Text style={styles.Text}>{txtUbicacion}</Text>
                <TextInput
                  style={styles.TextInput}
                  value={this.state.data.location}
                  onChangeText={(event) =>
                    this.onchangeInputs(event, 'location')
                  }
                />
                <Text style={styles.ayuda}>{txtUbicDecripcion}</Text>
              </View>
              <View style={styles.viewCampos}>
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
            <View>
              <WebView
                ref={'Map_Ref'}
                source={{
                  html:
                    `
                  <!DOCTYPE html>
                  <html>
                  <head>
                      <title>Quick Start - Leaflet</title>
                      <meta charset="utf-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <link rel="shortcut icon" type="image/x-icon" href="docs/images/favicon.ico">
                      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="">
                      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>
                   </head>
                  <body style="padding: 0; margin: 0">
                  <div id="mapid" style="width: 100%; height: 100vh;"></div>
                  <script>
                      var mymap = L.map('mapid').setView([` +
                    this.state.consulta.latitude +
                    ',' +
                    this.state.consulta.longitude +
                    '], ' +
                    this.state.consulta.zoom +
                    `);
                      
                      var myIcon = L.icon({
                      iconUrl: '` +
                    imagen +
                    `',
                          iconAnchor:   [22, 43], // point of the icon which will correspond to marker's location
                        });
                    
                      L.tileLayer('` +
                    layer1 +
                    `', {
                          maxZoom: 18,
                          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                              'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                          id: 'mapbox/streets-v11',
                          tileSize: 512,
                          zoomOffset: -1
                      }).addTo(mymap);
                      
                      var marker = L.marker(mymap.getCenter(), {icon: myIcon}).addTo(mymap);
                      var radius = L.circle(mymap.getCenter(), {
                            color: "#58D2FF",
                            fillColor: "#58D2FF",
                            radius: 10.0
                        }).addTo(mymap);
                  
                      var popup = L.popup();               
                      
                      mymap.on('move', function () {
                        marker.setLatLng(mymap.getCenter());
                        radius.setLatLng(mymap.getCenter());
                      });
                      
                      function onLocationFound(e) {
                      marker.setLatLng(mymap.getCenter());      
                    }
                      
                    function onLocationError(e) {
                      alert(e.message);
                    }
                  
                    mymap.on('locationfound', onLocationFound);
                    mymap.on('locationerror', onLocationError);
                  
                  </script>
                  </body>
                  </html>
                  `,
                }}
                style={styles.WebviewMapa}
              />
              <Pressable style={styles.btnCapas} onPress={this.getCapas}>
                <Image
                  style={styles.iconoCapa}
                  source={require('../iconos/capas.png')}
                />
              </Pressable>
              <Pressable
                style={[styles.btnCapas, {top: 60}]}
                onPress={this.getUbicacion}>
                <Image
                  style={styles.iconoCapa}
                  source={require('../iconos/marcador-de-posicion.png')}
                />
              </Pressable>
            </View>
            <View style={styles.viewFooter}>
              <View style={styles.footer}>
                <Text style={styles.TextFooter}>
                  {'Agregar fotografia real (Opcional)'}
                </Text>
                <View style={styles.viewCamposFotos}>
                  <View>
                    <Text style={styles.Txtfoto}>Tomar fotografia</Text>
                    <View style={styles.viewicono}>
                      <Pressable style={styles.btn} onPress={this.camaraPress}>
                        <Image
                          style={styles.icono}
                          source={require('../iconos/001-camara-fotografica.png')}
                        />
                      </Pressable>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.Txtfoto}>Agregar de galeria</Text>
                    <View style={styles.viewicono}>
                      <Pressable style={styles.btn} onPress={this.galeryPress}>
                        <Image
                          style={styles.icono}
                          source={require('../iconos/002-foto.png')}
                        />
                      </Pressable>
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
  WebviewMapa: {
    flex: 1,
    height: height / 2,
    width: width,
    margin: 0,
    padding: 0,
    backgroundColor: 'gray',
  },
  btnCapas: {
    position: 'absolute',
    width: 40,
    height: 40,
    right: 35,
    top: 10,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: '#03AED8',
    backgroundColor: '#ffffff',
  },
  iconoCapa: {
    position: 'absolute',
    bottom: 10,
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
    backgroundColor: '#ffffffd6',
    paddingLeft: 30,
    paddingRight: 30,
    opacity: 10,
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
    height: 100,
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
    height: 200,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    opacity: 0.8,
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
    bottom: 45,
    padding: 0,
    height: 120,
    width: 'auto',
  },
  viewicono: {
    width: 150,
    textAlign: 'center',
    height: 40,
    borderRadius: 50,
    borderColor: '#03AED8',
    borderWidth: 2,
    margin: 2,
    paddingLeft: 30,
    zIndex: 1,
    backgroundColor: '#ffffff',
  },
  btn: {
    height: 40,
    width: 100,
    zIndex: 1,
  },
  icono: {
    top: 5,
    width: 35,
    height: 28,
    left: 30,
    position: 'relative',
    alignItems: 'center',
  },
  Txtfoto: {
    color: '#575a5d',
    marginTop: -50,
    fontSize: 14,
    textAlign: 'center',
  },
  buttonReportar: {
    position: 'absolute',
    bottom: -20,
  },
  buttonOk: {
    width: 310,
    height: 47,
  },
});

export default getFormulario;
