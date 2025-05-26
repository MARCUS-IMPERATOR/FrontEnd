import React, { useState, useEffect } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Image,Alert,ScrollView,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { useRouter } from "expo-router";

export default function AccountProf() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [specilite, setSpecilite] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await axios.get("http://<...>:8090/api/users/profile");
      const userData = response.data;
      
      setPrenom(userData.firstName || "");
      setNom(userData.lastName || "");
      setEmail(userData.email || "");
      setSpecilite(userData.specialite || "");
      setProfileImage(userData.profileImage || null);
    } catch (error) {
      console.log("Error loading user data:", error.response?.data || error.message);
      setPrenom("John");
      setNom("Doe");
      setEmail("john.doe@gmail.com");
      setSpecilite("Mathématiques");
    }
  };

  const pickImage = async () => {
    if (!isEditing) return;

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission requise", "Permission d'accès à la galerie requise");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    const err = {};

    if (!prenom) err.prenom = "Le prénom est requis";
    if (!nom) err.nom = "Le nom est requis";

    if (!email) {
      err.email = "L'email est requis";
    } else if (!/\S+@\S+\.com$/.test(email)) {
      err.email = "Format d'email invalide";
    }

    if (!specilite) {
      err.specilite = "La spécialité est requise";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.put("http://<...>:8090/api/users/profile", {
        firstName: prenom,
        lastName: nom,
        email: email,
        specialite: specilite,
        profileImage: profileImage,
      });

      console.log("Update success:", response.data);
      Alert.alert("Succès", "Profil mis à jour avec succès !");
      setIsEditing(false);
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
      Alert.alert("Erreur", "Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    loadUserData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require("../assets/img/logoCol.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.welcomeText}>Mon Profil</Text>
        <View style={styles.imageContainer}>
          <TouchableOpacity 
            onPress={pickImage}
            style={[styles.imageWrapper, !isEditing && styles.imageDisabled]}
          >
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>
                  {isEditing ? "Ajouter une photo" : "Aucune photo"}
                </Text>
              </View>
            )}
            {/* {isEditing && (
              <View style={styles.editImageOverlay}>
                <Text style={styles.editImageText}>Modifier</Text>
              </View>
            )} */}
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Prénom</Text>
          <TextInput
            placeholder="John"
            placeholderTextColor="#aaa"
            style={[
              styles.input, 
              errors.prenom && styles.inputError,
              !isEditing && styles.inputDisabled
            ]}
            value={prenom}
            onChangeText={setPrenom}
            editable={isEditing}
          />
          {errors.prenom && <Text style={styles.errorText}>{errors.prenom}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            placeholder="Doe"
            placeholderTextColor="#aaa"
            style={[
              styles.input, 
              errors.nom && styles.inputError,
              !isEditing && styles.inputDisabled
            ]}
            value={nom}
            onChangeText={setNom}
            editable={isEditing}
          />
          {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="john.doe@gmail.com"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            style={[
              styles.input, 
              errors.email && styles.inputError,
              !isEditing && styles.inputDisabled
            ]}
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Spécialité</Text>
          <TextInput
            placeholder="Mathématiques"
            placeholderTextColor="#aaa"
            style={[
              styles.input, 
              errors.specilite && styles.inputError,
              !isEditing && styles.inputDisabled
            ]}
            value={specilite}
            onChangeText={setSpecilite}
            editable={isEditing}
          />
          {errors.specilite && <Text style={styles.errorText}>{errors.specilite}</Text>}
        </View>
        <View style={styles.buttonContainer}>
          {!isEditing ? (
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editText}>Modifier</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editButtonsContainer}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCancel}
              >
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSave}
              >
                <Text style={styles.saveText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  logo: {
    width: "100%",
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    color: "#0D3C4E",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "600",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  imageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#1976D2",
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  placeholderText: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
  },
  editImageOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1976D2",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  editImageText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "600",
  },
  imageDisabled: {
    opacity: 0.8,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 15,
    backgroundColor: "#f9f9f9",
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#666",
  },
  inputError: {
    borderColor: "#ff3b30",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
  editButton: {
    backgroundColor: "#1976D2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  editText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  editButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#6c757d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});