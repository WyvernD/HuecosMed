import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  TouchableOpacity,
  Image,
} from 'react-native';
import {RNCamera} from 'react-native-camera';

class MyCamera extends React.Component {
  state = {
    data: {},
  };

  async componentDidMount() {
    this.requestCameraPermission();
  }
  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permiso de la cámara',
          message:
            'La aplicación necesita acceso a tu cámara para que pueda tomar fotos impresionantes.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.log('Error: ', err);
    }
  }

  onchangeDatos = (text, name) => {
    this.setState({data: {...this.state.data, [name]: text}});

    console.log(this.state.data);
    this.props.navigation.navigate('Formulario', {
      dato: JSON.stringify(this.state.data),
    });
  };

  takePicture = async function () {
    if (this.camera) {
      const options = {quality: 0.5, base64: true, zoom: true};
      const objCamara = await this.camera.takePictureAsync(options);
      this.setState({data: {...this.state.data, base64: objCamara.base64}});
      this.onchangeDatos(objCamara.uri, 'urlFoto');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          zoom={0}
          onGoogleVisionBarcodesDetected={({barcodes}) => {
            console.log('RNCamera', barcodes);
          }}
        />
        <View style={styles.viewFoto}>
          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style={styles.capture}>
            <Image
              source={require('../iconos/camera.png')}
              style={styles.iconFondo}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default MyCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  viewFoto: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    left: '50%',
    right: '50%',
    position: 'absolute',
    bottom: 0,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconFondo: {
    height: 50,
    position: 'absolute',
    width: 50,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    alignItems: 'center',
    margin: 20,
    width: 100,
    height: 50,
  },
});
