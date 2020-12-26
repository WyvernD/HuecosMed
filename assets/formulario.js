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
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

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

function Formulario() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView styles={stylesIndex.body}>
        <ScrollView styles={stylesIndex.scrollView}>
          <ImageBackground source={urlImage} style={stylesIndex.image}>
            <View styles={stylesIndex.contenedorHead}>
              <View styles={stylesIndex.headerDiv}>
                <Text styles={stylesIndex.texthead}>
                  {'Reportar a HUECOSMED'}
                </Text>
              </View>
            </View>
            <View styles={stylesIndex.contenedor}>
              <View styles={stylesIndex.viewCampos}>
                <Text styles={stylesIndex.Text}>{txtUbicacion}</Text>
                <TextInput style={stylesIndex.TextInput} />
                <Text styles={stylesIndex.ayuda}>{txtUbicDecripcion}</Text>
              </View>
              <View styles={stylesIndex.viewCampos}>
                <Text styles={stylesIndex.Text}>{txtPunto}</Text>
                <TextInput
                  styles={stylesIndex.TextInput}
                  placeholder={'Ejemplo: Hueco cerca al consumo de la 80'}
                />
                <Text styles={stylesIndex.ayuda}>{txtPuntoDEscripcion}</Text>
              </View>
            </View>
            <View styles={stylesIndex.viewFooter}>
              <View styles={stylesIndex.footer}>
                <Text styles={stylesIndex.TextFooter}>
                  {'Agregar fotografia real (Opcional)'}
                </Text>
                <View styles={stylesIndex.viewCamposFotos}>
                  <View>
                    <Text styles={stylesIndex.Txtfoto}>
                      {'Tomar fotografia'}
                    </Text>
                    <View style={stylesIndex.viewicono}>
                      <Image
                        style={stylesIndex.icono}
                        source={{
                          uri:
                            'https://image.flaticon.com/icons/png/512/56/56887.png',
                        }}
                      />
                    </View>
                  </View>
                  <View>
                    <Text style={stylesIndex.Txtfoto}>
                      {'Agregar de galeria'}
                    </Text>
                    <View style={stylesIndex.viewicono}>
                      <Image
                        style={stylesIndex.icono}
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
                    style={stylesIndex.buttonOk}
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

const stylesIndex = StyleSheet.create({
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

export default Formulario;
