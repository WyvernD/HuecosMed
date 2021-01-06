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
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
import {Colors} from 'react-native/Libraries/NewAppScreen';
const txtUbicacion = 'Ubicación actual del daño en la via';
const txtUbicDecripcion =
  'Puede digitar la dirección donde se encuentra el daño o ubicar el PIN en el mapa';
const txtPunto = 'Digite un punto de referencia de la dirección';
const txtPuntoDEscripcion =
  'El punto de referencia permitira ubicar fácilmente la ubicación del daño';

const encode64 = require('../libs/B64');
const urlRoot = 'https://www.medellin.gov.co';

class DatosReporte extends React.Component {
  state = {
    data: {},
  };

  async componentDidMount() {
    this.state.data = JSON.parse(this.props.route.params.datos).data;

    this.onchangeInputs();
  }

  onchangeInputs = (text, name) => {
    this.setState({data: {...this.state.data, [name]: text}});
    console.log({...this.state.data});
  };

  validarReporte = () => {
    let consulta = [
      {
        SQL: 'SQL_HUECOS_GUARDAR_HUECO_MOVIL',
        N: 9,
        DATOS: [
          {
            P1: '',
            P2: '',
            P3: '',
            P4: this.state.data.email,
            P5: this.state.data.location,
            P6: this.state.data.description,
            P7: this.state.data.latitude + '',
            P8: this.state.data.longitude + '',
            P9: '',
          },
        ],
      },
    ];
    let url =
      urlRoot +
      '/HuecosMed/guardardatos.hyg?str_sql=' +
      encode64(JSON.stringify(consulta));
    console.log(url);
    fetch(url, {
      method: 'POST',
    })
      .then((response) => response)
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.ok) {
          Alert.alert(
            'Gracias por su reporte',
            'Nuestro equipo se encuentra verificando  la información para dar solución. \n  \n ' +
              'Recuerde su número de reporte : 01',
            [{text: 'Aceptar', onPress: () => console.log('Aceptar Pressed')}],
            {cancelable: false},
          );
        } else {
          Alert.alert(
            'Error al generar reporte',
            responseJson,
            [{text: 'Aceptar', onPress: () => console.log('Aceptar Pressed')}],
            {cancelable: false},
          );
        }
      })
      .catch((error) => {
        console.error('catch', error);
      });
  };

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
                      this.state.data.latitude +
                    ',' +
                      this.state.data.longitude +
                    '], ' +
                      this.state.data.zoom +
                    `);
                      
                      var myIcon = L.icon({
                      iconUrl: ` +
                    require('../iconos/pin.png') +
                    `,
                      iconAnchor:   [22, 43], // point of the icon which will correspond to marker's location
                  });
                    
                      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
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
            </View>
            <View style={styles.viewFooter}>
              <View style={styles.footer}>
                <View style={styles.viewCampos}>
                  <Text style={styles.TextIni}>Datos del reporte</Text>
                </View>
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
                  />
                  <Text style={styles.ayuda}>{txtPuntoDEscripcion}</Text>
                </View>
                <View style={styles.viewCampos}>
                  <View style={styles.campoImagen}>
                    <Image
                      source={{
                        uri: this.state.data.urlFoto,
                      }}
                      style={styles.captures}
                    />
                  </View>
                </View>
                <View style={styles.viewCampos}>
                  <Text style={styles.Text}>
                    {'Ingresa el correo electrónico de quien reporta'}
                  </Text>
                  <TextInput
                    style={styles.TextInput}
                    value={this.state.data.email}
                    onChangeText={(event) =>
                      this.onchangeInputs(event, 'email')
                    }
                  />
                  <Text style={styles.ayuda}>
                    {
                      'A este correo llegarán las notificaciones de avances en la solución del daño'
                    }
                  </Text>
                </View>
              </View>
              <Pressable
                style={styles.buttonReportar}
                onPress={this.validarReporte}>
                <Image
                  style={styles.buttonOk}
                  source={require('../iconos/enviarReporte.png')}
                />
              </Pressable>
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
    height: height / 3,
    width: width,
    margin: 0,
    padding: 0,
    backgroundColor: 'gray',
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
    paddingLeft: 18,
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
    paddingBottom: 15,
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
    height: height / 2,
    alignItems: 'center',
  },
  footer: {
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 500,
    backgroundColor: '#ffffffd6',
    paddingLeft: 30,
    paddingRight: 30,
    opacity: 0.8,
  },
  TextIni: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 20,
  },
  buttonReportar: {
    position: 'absolute',
    bottom: 20,
  },
  buttonOk: {
    width: 304,
    height: 47,
  },
});

export default DatosReporte;
