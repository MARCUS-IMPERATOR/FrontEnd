import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import CourseCard from '../components/courseCard';
import { MaterialIcons,  MaterialCommunityIcons } from '@expo/vector-icons';

const ProfProfile = () => {
  const router = useRouter();
  const { profId } = useLocalSearchParams();
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Dummy data structure
  const dummyProfessor = {
    id: profId || "1",
    name: "Adrdour",
    subject: "Mathématiques",
    imageUrl: "https://example.com/professorskl/1.jpg",
    courses: [
      {
        id: 1,
        title: "2 BAC SM BIOF",
        professor: { lastName: "Adrdour", specialisation: "Math" },
        rating: 4.5,
        numberOfReviews: 128,
        imageSource: { uri: "https://example.com/courses/math.jpg" },
        price: "300DH",
        date: "13/9/2024 → En cours",
        level: "T9acher",
        description: "Cours complet de mathématiques pour BAC SM"
      },
      {
        id: 2,
        title: "Calcul Intégral Avancé",
        professor: { lastName: "Adrdour", specialisation: "Math" },
        rating: 4.2,
        numberOfReviews: 95,
        imageSource: { uri: "https://example.com/courses/calculus.jpg" },
        price: "350DH",
        date: "15/9/2024 → En cours",
        level: "T10"
      }
    ],
    resources: [
      { 
        id: 1, 
        type: "pdf", 
        title: "Exercices d'Intégrales", 
        url: "https://example.com/resources/1.pdf"
      },
      { 
        id: 2, 
        type: "doc", 
        title: "Problèmes Résolus", 
        url: "https://example.com/resources/2.docx"
      }
    ],
    videos: [
      { 
        id: 1, 
        title: "Introduction aux Intégrales", 
        duration: "15:32",
        url: "https://youtube.com/watch?v=abc123",
        thumbnail: "https://img.youtube.com/vi/abc123/mqdefault.jpg",
        date: "10/04/2024"
      },
      { 
        id: 2, 
        title: "Méthodes de Résolution", 
        duration: "22:45",
        url: "https://youtube.com/watch?v=def456",
        thumbnail: "https://img.youtube.com/vi/def456/mqdefault.jpg",
        date: "15/04/2024"
      }
    ]
  };

  useEffect(() => {
    const API_URL = 'https://your-api.com'; 

    const api = axios.create({
      baseURL: API_URL,
      timeout: 100,
      headers: {
      }
    });

    api.get(`/professors/${profId}`)
      .then(response => {
        if (response.data) {
          setProfessor(response.data);
        } else {
          throw new Error('No data received from server');
        }
      })
      .catch(error => {
        setError(error.message);
        console.warn('API Error - Using dummy data:', error.message);
        return Promise.resolve({ data: dummyProfessor }); 
      })
      .then(fallbackResponse => {
        if (!professor) {
          setProfessor(fallbackResponse.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });

  }, [profId]);

  const handleViewAll = (section) => {
    router.push({
      pathname: "/viewAll",
      params: { 
        section,
        data: JSON.stringify(professor[section]),
        profName: professor.name
      }
    });
  };

  const renderResourceItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.resourceItem}
      onPress={() => router.push({
        pathname: "/pdfvoir",
        params: { documentUrl: item.url, documentTitle: item.title }
      })}
    >
    
      <View style={[styles.resourceThumbnail, styles.resourceIconContainer]}>
        {item.type === 'pdf' && <MaterialIcons name="picture-as-pdf" size={50} color="red" />}
        {item.type === 'doc' && <MaterialCommunityIcons name="file-word" size={50} color="blue" />}
        {item.type === 'ppt' && <MaterialCommunityIcons name="file-powerpoint" size={50} color="red" />}
      </View>

      <Text style={styles.resourceTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.videoItem}
      onPress={() => router.push({
        pathname: "/videoPlayer",
        params: { 
          videoUrl: item.url, 
          videoTitle: item.title,
          videoThumbnail: item.thumbnail
        }
      })}
    >
      <Image 
        source={imageError || !item.thumbnail
          ? require('../assets/img/video-placeholder.jpg')
          : { uri: item.thumbnail }}
        style={styles.videoThumbnail}
        onError={() => {
          console.log(`Failed to load thumbnail for video: ${item.title}`);
          setImageError(true);
      }}
      />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.videoMeta}>
          <Text style={styles.videoDuration}>{item.duration}</Text>
          {item.date && <Text style={styles.videoDate}>{item.date}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000080" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  if (!professor) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Impossible de charger les données du professeur</Text>
        {error && <Text style={styles.errorDetail}>{error}</Text>}
        <Text style={styles.errorHelp}>Veuillez réessayer plus tard</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Professor Header */}
      <View style={styles.profHeader}>
        <Image 
        source={imageError || !professor.imageUrl 
        ? require('../assets/img/anonyme.jpeg')
        : { uri: professor.imageUrl }}
        style={styles.profileImage}
        onError={() => setImageError(true)}
        />
        <View style={styles.profInfo}>
          <Text style={styles.name}>Pr. {professor.name}</Text>
          <Text style={styles.subject}>{professor.subject}</Text>
        </View>
      </View>

      {/* Courses Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Formations</Text>
          <TouchableOpacity onPress={() => handleViewAll('courses')}>
            <Text style={styles.viewAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={professor.courses.slice(0, 2)}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => router.push({
                pathname: "/course",
                params: { course: JSON.stringify(item) }
              })}
            >
              <CourseCard {...item} />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
      </View>

      {/* Videos Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vidéos Publiques</Text>
          <TouchableOpacity onPress={() => handleViewAll('videos')}>
            <Text style={styles.viewAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={professor.videos}
          renderItem={renderVideoItem}
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      {/* Resources Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ressources Pédagogiques</Text>
          <TouchableOpacity onPress={() => handleViewAll('resources')}>
            <Text style={styles.viewAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={professor.resources}
          renderItem={renderResourceItem}
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  errorText: {
    fontSize: 18,
    color: '#E1341E',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorHelp: {
    fontSize: 14,
    color: '#000080',
    marginTop: 8,
  },
  profHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    backgroundColor: '#f5f5f5',
  },
  profInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  subject: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#000',
  },
  viewAll: {
    color: '#002F6C',
    fontSize: 14,
    fontWeight: '500',
  },
  horizontalList: {
    paddingRight: 16
  },
  resourceItem: {
    width: 120,
    marginRight: 12,

  },
  resourceThumbnail: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceIconContainer: {
    backgroundColor: '#F3F6F8',
  },
  resourceTitle: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  videoItem: {
    width: 200,
    marginRight: 16,
    backgroundColor: '#F3F6F8',
  },
  videoThumbnail: {
    width: 200,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
  },
  videoInfo: {
    marginVertical: 6,
    marginHorizontal: 4,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  videoDuration: {
    fontSize: 12,
    color: '#666',
  },
  videoDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default ProfProfile;