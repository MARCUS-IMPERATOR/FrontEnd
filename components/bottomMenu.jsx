import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { Image } from 'react-native'
import { Icons } from '../constants/Icons'

const BottomMenu = () => {
  const router = useRouter()
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Image source={Icons.home} style={styles.iconStyles} resizeMode="contain"/>
      </TouchableOpacity>
      <TouchableOpacity>
        <Image source={Icons.professors} style={styles.iconStyles} resizeMode="contain"/>
      </TouchableOpacity>
      <TouchableOpacity>
        <Image source={Icons.courses} style={styles.iconStyles} resizeMode="contain"/>
      </TouchableOpacity>
      <TouchableOpacity>
        <Image source={Icons.chat} style={styles.iconStyles} resizeMode="contain"/>
      </TouchableOpacity>
      <TouchableOpacity>
        <Image source={Icons.account} style={styles.iconStyles} resizeMode="contain"/>
      </TouchableOpacity>
    </View>
  );
};

export default BottomMenu;

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    height:30,
  },
  iconStyles: {
    width: 70,
    height: 70,
  },
});
