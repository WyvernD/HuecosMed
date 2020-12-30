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
  takePicture = async function () {
    if (this.camera) {
      const options = {quality: 1080, base64: true};
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      console.log(this.props);
      this.props.navigation.navigate('Formulario');
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
          onGoogleVisionBarcodesDetected={({barcodes}) => {
            console.log(barcodes);
          }}
        />
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
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
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    alignItems: 'center',
    margin: 20,
    width: 100,
    height: 50,
  },
});
