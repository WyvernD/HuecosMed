import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import FormView from './assets/components/formulario';
import SliderView from './assets/components/Swiper';
import CamaraView from './assets/components/Camara';
import GaleryView from './assets/components/Galery';
import ReporteView from './assets/components/DatoReporte';

const Stack = createStackNavigator();

const navigationOptions = {
  title: '',
  headerTintColor: '#fff',
  headerTransparent: true,
};

const App: () => ReactNode = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Home'}>
        <Stack.Screen
          name="Home"
          component={SliderView}
          options={navigationOptions}
        />
        <Stack.Screen
          name="Formulario"
          component={FormView}
          options={{
            title: '',
            headerTransparent: true,
            headerTintColor: 'transparent',
          }}
        />
        <Stack.Screen
          name="Camera"
          component={CamaraView}
          options={navigationOptions}
        />
        <Stack.Screen
          name="Galery"
          component={GaleryView}
          options={navigationOptions}
        />
        <Stack.Screen
          name="Reporte"
          component={ReporteView}
          options={navigationOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
