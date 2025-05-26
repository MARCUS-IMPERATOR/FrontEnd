import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import logo from "../assets/img/logo.png";

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/courseList");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#010080",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  appName: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
});
