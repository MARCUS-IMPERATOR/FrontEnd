import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import CourseCard from '../components/courseCard';
import VideoItem from '../components/videoItem';
import DocumentItem from '../components/documentItem';

const DUMMY_DATA = {
  courses: [
    {
      id: 1,
      title: "2 BAC SM BIOF",
      professor: { lastName: "Adrdour", specialisation: "Math" },
      rating: 4.5,
      numberOfReviews: 128,
      price: "300DH",
      date: "13/9/2024 → En cours",
      level: "T9acher"
    },
    {
      id: 2,
      title: "Calcul Intégral Avancé",
      professor: { lastName: "Adrdour", specialisation: "Math" },
      rating: 4.2,
      numberOfReviews: 95,
      price: "350DH",
      date: "15/9/2024 → En cours",
      level: "T10"
    }
  ],
  videos: [
    { 
      id: 1, 
      title: "Introduction aux Intégrales", 
      duration: "15:32",
      date: "10/04/2024"
    },
    { 
      id: 2, 
      title: "Méthodes de Résolution", 
      duration: "22:45",
      date: "15/04/2024"
    }
  ],
  documents: [
    { 
      id: 1, 
      title: "Exercices d'Intégrales", 
      type: "pdf"
    },
    { 
      id: 2, 
      title: "Problèmes Résolus",
      type: "doc"
    }
  ]
};

const ViewAll = () => {
  const { section, profId, profName } = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiFailed, setApiFailed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://your-unavailable-api.com/professors/${profId}`);
        
        if (response.data) {
          setData(response.data[section] || []);
          setApiFailed(false);
        } else {
          throw new Error('No data received');
        }
      } catch (error) {
        // dummy data 
        setData(DUMMY_DATA[section] || []);
        setApiFailed(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [section, profId]);

  const renderItem = ({ item }) => {
    switch(section) {
      case 'courses':
        return <CourseCard {...item} />;
      case 'videos':
        return <VideoItem {...item} />;
      case 'documents':
        return <DocumentItem {...item} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    const titles = {
      courses: `Cours par ${profName}`,
      videos: `Vidéos par ${profName}`,
      documents: `Documents par ${profName}`
    };
    return titles[section] || 'Tous les éléments';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getTitle()}</Text>
      {apiFailed && (
        <Text style={styles.warningText}>
          Données de démonstration 
        </Text>
      )}
      
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={data.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucun {section} disponible</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  warningText: {
    color: 'orange',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
});

export default ViewAll;