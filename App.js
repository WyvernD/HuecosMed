import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import FormView from './assets/components/formulario';
import SliderView from './assets/components/Swiper';
import ReporteView from './assets/components/DatoReporte';

const Stack = createStackNavigator();

const navigationOptions = {
  title: '',
  headerTintColor: 'transparent',
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
