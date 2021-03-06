import React from 'react';
import {
  Alert,
  Image,
  ImageBackground,
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
import {Dimensions} from 'react-native';

const txtUbicacion = 'Ubicación actual del daño en la via';
const txtUbicDecripcion =
  'Puede digitar la dirección donde se encuentra el daño o ubicar el PIN en el mapa';
const txtPunto = 'Digite un punto de referencia de la dirección';
const txtPuntoDEscripcion =
  'El punto de referencia permitira ubicar fácilmente la ubicación del daño';

const {width, height} = Dimensions.get('window');

class getFormulario extends React.Component {
  state = {
    data: {},
  };

  onsubmit = () => {
    const data = {...this.state.data};
    console.log(data);
  };

  componentDidMount() {
    console.log(html_script);
  }

  onchangeInputs = (text, name) => {
    this.setState({data: {...this.state.data, [name]: text}});
  };
  camaraPress = () => {
    this.props.navigation.navigate('Camera');
  };
  galeryPress = () => {
    this.props.navigation.navigate('Galery');
  };
  validarReporte = () => {
    this.props.navigation.navigate('Reporte');
  };
  getmapas = () => {
    Alert.alert('Capas');
  };
  getUbicacion = () => {
    Alert.alert('Ubicación');
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
                  value={this.state.location}
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
              <Pressable style={styles.btnCapas} onPress={this.getmapas}>
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
                      source={require('../iconos/reportar.png')}
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
  Webview: {
    flex: 2,
    height: height,
    width: width,
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
    height: 525,
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
    height: 210,
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
    bottom: 50,
    padding: 0,
    height: 100,
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
    width: 30,
    height: 23,
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
