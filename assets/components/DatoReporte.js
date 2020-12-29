import React, {Component} from 'react';
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
  TouchableOpacity,
  Pressable,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const txtUbicacion = 'Ubicación actual del daño en la via';
const txtUbicDecripcion =
  'Puede digitar la dirección donde se encuentra el daño o ubicar el PIN en el mapa';
const txtPunto = 'Digite un punto de referencia de la dirección';
const txtPuntoDEscripcion =
  'El punto de referencia permitira ubicar fácilmente la ubicación del daño';

class DatosReporte extends Component {
  camaraPress = () => {
    this.props.navigation.navigate('Camera');
  };
  galeryPress = () => {
    this.props.navigation.navigate('Galery');
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
              <Text>Mapa</Text>
            </View>
            <View style={styles.viewFooter}>
              <View style={styles.footer}>
                <View style={styles.viewCampos}>
                  <Text style={styles.TextIni}>Datos del reporte</Text>
                </View>
                <View style={styles.viewCampos}>
                  <Text style={styles.Text}>{txtUbicacion}</Text>
                  <TextInput style={styles.TextInput} />
                  <Text style={styles.ayuda}>{txtUbicDecripcion}</Text>
                </View>
                <View style={styles.viewCampos}>
                  <Text style={styles.Text}>{txtPunto}</Text>
                  <TextInput
                    style={styles.TextInput}
                    placeholder={'Ejemplo: Hueco cerca al consumo de la 80'}
                  />
                  <Text style={styles.ayuda}>{txtPuntoDEscripcion}</Text>
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
    height: 680,
    alignItems: 'center',
  },
  footer: {
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    width: 500,
    height: 450,
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
