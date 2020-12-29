import React from 'react';
import {
  Alert,
  Dimensions,
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

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import FormView from './assets/components/formulario';
import SliderView from './assets/components/Swiper';
import CamaraView from './assets/components/Camara';
import GaleryView from './assets/components/Galery';
import ReporteView from './assets/components/DatoReporte';

const Stack = createStackNavigator();

const App: () => ReactNode = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Home'}>
        <Stack.Screen
          name="Home"
          component={SliderView}
          options={{title: '', headerTransparent: true}}
        />
        <Stack.Screen
          name="Formulario"
          component={FormView}
          options={{title: '', headerTransparent: true}}
        />
        <Stack.Screen
          name="Camera"
          component={CamaraView}
          options={{title: '', headerTransparent: true}}
        />
        <Stack.Screen
          name="Galery"
          component={GaleryView}
          options={{title: '', headerTransparent: true}}
        />
        <Stack.Screen
          name="Reporte"
          component={ReporteView}
          options={{title: '', headerTransparent: true}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
