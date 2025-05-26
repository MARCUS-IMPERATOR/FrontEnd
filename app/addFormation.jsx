import React, { useState } from 'react';
import {  View,  Text,  TextInput,  TouchableOpacity,  Image,  StyleSheet,  ScrollView,  Alert,  ActivityIndicator,  KeyboardAvoidingView,  Platform,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { SafeAreaView } from "react-native-safe-area-context";
import BottomMenu from '../components/bottomMenu';
import { useRouter } from 'expo-router';


const AddFormation = ({ navigation, onSubmit }) => {
  const [formData, setFormData] = useState({title: '',domain: '',description: '',price: '',thumbnail: null,});
  const [errors, setErrors] = useState({});
  const router = useRouter()

  const domains = ['Mathematique','Physique','SVT','SI','Francais',];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.domain.trim()) newErrors.domain = 'Le domaine est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.price.trim()) newErrors.price = 'Le prix est requis';
    if (!formData.thumbnail) newErrors.thumbnail = 'Thumbnail est requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const chooseThumbnail = async () => {

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required');
      return;
    }
    Alert.alert(
      'Sélectionner une image',
      'Choisissez une source',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Galerie', 
          onPress: async () => {
            try {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              });

              if (!result.canceled && result.assets?.length > 0) {
                const asset = result.assets[0];
                updateFormData('thumbnail', {
                  uri: asset.uri,
                  type: 'image/jpeg',
                  fileName: asset.fileName || 'image.jpg',
                });
              }
            } catch (error) {
              console.error('Error picking image:', error);
              Alert.alert('Error', 'Failed to pick image');
            }
          }
        },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      let thumbnailUrl = null;

      if (formData.thumbnail) {
        const imageFormData = new FormData();
        imageFormData.append('file', {
          uri: formData.thumbnail.uri,
          type: formData.thumbnail.type || 'image/jpeg',
          name: formData.thumbnail.fileName || 'image.jpg',
        });

        const imageResponse = await axios.post('http://<...>:8090/api:8080/api/upload/image', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        thumbnailUrl = imageResponse.data.imageUrl || imageResponse.data.url || imageResponse.data.path;
      }

      const formationData = {
        title: formData.title.trim(),
        domain: formData.domain.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        thumbnailUrl: thumbnailUrl,
        createdAt: new Date().toISOString(),
      };

      if (onSubmit) {
        await onSubmit(formationData);
      } else {
        await axios.post('http://<...>:8090/api:8080/api/formation', formationData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      Alert.alert(
        'Succès',
        'Formation ajoutée avec succès!',
        [
          {
            text: 'OK',
            onPress: () => {
              setFormData({
                title: '',
                domain: '',
                description: '',
                price: '',
                thumbnail: null,
              });
              navigation?.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error adding a formation:', error);
      
      let errorMessage = 'Une erreur est survenue lors de l\'ajout de la formation';
      
      if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Erreur d\'authentification. Veuillez vous reconnecter.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Données invalides. Vérifiez les informations saisies.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      }
      
      Alert.alert('Erreur', errorMessage);
    }
  };

  const renderError = (field) => {
    if (errors[field]) {
      return <Text style={styles.errorText}>{errors[field]}</Text>;
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header} onPress={()=>{router.push('./profFormation')}}>Ajouter une nouvelle formation</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Titre <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            value={formData.title}
            onChangeText={(value) => updateFormData('title', value)}
            placeholder="Entrez le titre de la formation"
            maxLength={100}
          />
          {renderError('title')}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Domaine <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.domain && styles.inputError]}
            value={formData.domain}
            onChangeText={(value) => updateFormData('domain', value)}
            placeholder="Ex: Développement Web, Design..."
          />
          {renderError('domain')}
  
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.domainSuggestions}
          >
            {domains.map((domainOption, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.domainChip,
                  formData.domain === domainOption && styles.domainChipSelected
                ]}
                onPress={() => updateFormData('domain', domainOption)}
              >
                <Text style={[
                  styles.domainChipText,
                  formData.domain === domainOption && styles.domainChipTextSelected
                ]}>
                  {domainOption}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.description && styles.inputError]}
            value={formData.description}
            onChangeText={(value) => updateFormData('description', value)}
            placeholder="Décrivez votre formation en détail..."
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.characterCount}>
            {formData.description.length}/500 caractères
          </Text>
          {renderError('description')}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Image de présentation <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.thumbnailContainer}>
            <TouchableOpacity 
              onPress={chooseThumbnail} 
              style={[
                styles.thumbnailBox,
                errors.thumbnail && styles.inputError
              ]}
            >
              {formData.thumbnail ? (
                <Image source={{ uri: formData.thumbnail.uri }} style={styles.thumbnail} />
              ) : (
                <View style={styles.thumbnailPlaceholderContainer}>
                  <Text style={styles.thumbnailPlaceholder}>📷</Text>
                  <Text style={styles.thumbnailPlaceholderText}>Ajouter</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.thumbnailActions}>
              <TouchableOpacity onPress={chooseThumbnail} style={styles.thumbnailButton}>
                <Text style={styles.thumbnailButtonText}>
                  {formData.thumbnail ? 'Changer l\'image' : 'Choisir une image'}
                </Text>
              </TouchableOpacity>
              {formData.thumbnail && (
                <TouchableOpacity 
                  onPress={() => updateFormData('thumbnail', null)}
                  style={[styles.thumbnailButton, styles.removeButton]}
                >
                  <Text style={styles.removeButtonText}>Supprimer</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {renderError('thumbnail')}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Prix<Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.price && styles.inputError]}
            value={formData.price}
            onChangeText={(value) => updateFormData('price', value.replace(/[^0-9.]/g, ''))}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />
          {renderError('price')}
        </View>

        <TouchableOpacity style={[styles.submitButton]} onPress={handleSubmit}>
            <Text style={styles.submitText}>Ajouter la formation</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomMenu/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    color: '#2d3748',
    fontWeight: '600',
    fontSize: 16,
  },
  required: {
    color: '#e53e3e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#e53e3e',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    textAlign: 'right',
    color: '#718096',
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 12,
    marginTop: 4,
  },
  domainSuggestions: {
    marginTop: 8,
  },
  domainChip: {
    backgroundColor: '#edf2f7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  domainChipSelected: {
    backgroundColor: '#3182ce',
    borderColor: '#3182ce',
  },
  domainChipText: {
    color: '#4a5568',
    fontSize: 12,
    fontWeight: '500',
  },
  domainChipTextSelected: {
    color: '#fff',
  },
  thumbnailContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  thumbnailBox: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#fff',
  },
  thumbnailPlaceholderContainer: {
    alignItems: 'center',
  },
  thumbnailPlaceholder: {
    fontSize: 32,
    marginBottom: 4,
  },
  thumbnailPlaceholderText: {
    fontSize: 12,
    color: '#718096',
  },
  thumbnail: {
    width: 96,
    height: 96,
    borderRadius: 10,
  },
  thumbnailActions: {
    flex: 1,
    justifyContent: 'center',
  },
  thumbnailButton: {
    backgroundColor: '#3182ce',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  thumbnailButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: '#e53e3e',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#2b6cb0',
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#a0aec0',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddFormation;