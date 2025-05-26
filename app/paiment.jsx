import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import React from 'react';
import { useNavigation, useRouter } from 'expo-router';


const profProfile = () => {
    const router = useRouter();
    return(
        
        <SafeAreaView style = {styles.container}>
        <View style = {styles.content}>
            <Text style = {styles.title}>
            Welcome Smayka
            </Text>
        </View>
        </SafeAreaView>
        
    )
};

export default profProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});