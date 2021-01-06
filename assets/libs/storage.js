import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export default class Storage {
  static instance = Storage();
  add = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.log('storage Store err', e);
      return false;
    }
  };

  get = async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.log('storage get err', e);
      throw Error(e);
    }
  };

  getAllKeys = async () => {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (e) {
      console.log('storage getAllKeys err', e);
      throw Error(e);
    }
  };

  multiGet = async (keys) => {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (e) {
      console.log('storage multiGet err', e);
      throw Error(e);
    }
  };
}

