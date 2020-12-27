import React from 'react';
import {
  Alert, Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const {width, height} = Dimensions.get('window');

const txtUbicacion = 'Ubicación actual del daño en la via';
const txtUbicDecripcion =
  'Puede digitar la dirección donde se encuentra el daño o ubicar el PIN en el mapa';
const txtPunto = 'Digite un punto de referencia de la dirección';
const txtPuntoDEscripcion =
  'El punto de referencia permitira ubicar fácilmente la ubicación del daño';

const urlImage = {
  uri:
    'https://i.pinimg.com/originals/71/2e/11/712e11b2786070e9a9f941abb65c7335.png',
};

function getFormulario() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView styles={style.body}>
        <ScrollView styles={style.scrollView}>
          <ImageBackground source={urlImage} style={style.image}>
            <View styles={style.contenedorHead}>
              <View styles={style.headerDiv}>
                <Text styles={style.texthead}>
                  {'Reportar a HUECOSMED'}
                </Text>
              </View>
            </View>
            <View styles={style.contenedor}>
              <View styles={style.viewCampos}>
                <Text styles={style.Text}>{txtUbicacion}</Text>
                <TextInput style={style.TextInput} />
                <Text styles={style.ayuda}>{txtUbicDecripcion}</Text>
              </View>
              <View styles={style.viewCampos}>
                <Text styles={style.Text}>{txtPunto}</Text>
                <TextInput
                  styles={style.TextInput}
                  placeholder={'Ejemplo: Hueco cerca al consumo de la 80'}
                />
                <Text styles={style.ayuda}>{txtPuntoDEscripcion}</Text>
              </View>
            </View>
            <View styles={style.viewFooter}>
              <View styles={style.footer}>
                <Text styles={style.TextFooter}>
                  {'Agregar fotografia real (Opcional)'}
                </Text>
                <View styles={style.viewCamposFotos}>
                  <View>
                    <Text styles={style.Txtfoto}>{'Tomar fotografia'}</Text>
                    <View style={style.viewicono}>
                      <Image
                        style={style.icono}
                        source={{
                          uri:
                            'https://image.flaticon.com/icons/png/512/56/56887.png',
                        }}
                      />
                    </View>
                  </View>
                  <View>
                    <Text style={style.Txtfoto}>{'Agregar de galeria'}</Text>
                    <View style={style.viewicono}>
                      <Image
                        style={style.icono}
                        source={{
                          uri:
                            'https://image.flaticon.com/icons/png/512/665/665896.png',
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    style={style.buttonOk}
                    onPress={() => Alert.alert('Reporte...')}>
                    <Text>{'Reportar'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const style = StyleSheet.create({
  TextInput: {
    width: 'auto',
    height: 45,
    borderRadius: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 20,
  },
  Text: {
    color: Colors.black,
    fontSize: 15,
    position: 'relative',
    textAlign: 'left',
    margin: 0,
    paddingLeft: 20,
    padding: 0,
  },
  ayuda: {
    color: 'gray',
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
  },
  body: {
    fontFamily: 'Roboto',
  },
  contenedorHead: {
    backgroundColor: '#ffffffd6',
    paddingLeft: 0,
    paddingRight: 0,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerDiv: {
    backgroundColor: '#03aed8',
    height: 90,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  texthead: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    fontSize: 20,
    left: 20,
    right: 20,
    bottom: 20,
  },
  viewFooter: {
    height: 500,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  footer: {
    textAlign: 'center',
    position: 'absolute',
    bottom: 1,
    width: 500,
    height: 200,
    backgroundColor: '#ffffffd6',
    alignItems: 'center',
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
    borderColor: '#03aed8',
    borderWidth: 2,
    margin: 2,
    paddingLeft: 30,
  },
  icono: {
    height: 30,
    width: 30,
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
  buttonOk: {
    backgroundColor: '#03aed8',
    color: '#fff',
    width: 200,
    height: 50,
    borderRadius: 50,
    fontWeight: 'bold',
    alignItems: 'center',
    padding: 10,
    fontSize: 20,
    top: 120,
    left: -100,
    position: 'absolute',
  },
});

export default getFormulario();
