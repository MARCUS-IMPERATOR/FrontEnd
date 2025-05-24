import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Icons } from '../constants/Icons';
import { router } from 'expo-router';
import BottomMenu from '../components/bottomMenu';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfFormation = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { formationId } = route.params;

  const [formation, setFormation] = useState(null);
  const [seances, setSeances] = useState([]);
  const [error, setError] = useState(null);

  const fetchFormationData = async () => {
    try {
      setError(null);
      const formationResponse = await fetch(`http://<...>:8090/api/formations/${formationId}`);
      if (!formationResponse.ok) {
        throw new Error('Failed to fetch formation data');
      }
      const formationData = await formationResponse.json();
      setFormation(formationData);
      
      const seancesResponse = await fetch(`http://<...>:8090/api/formations/${formationId}/seances`);
      if (!seancesResponse.ok) {
        throw new Error('Failed to fetch seances data');
      }
      const seancesData = await seancesResponse.json();
      setSeances(seancesData);

    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchFormationData();
  }, [formationId]);

  const handleAddSeance = () => {
    navigation.navigate('AddSeance', { formationId });
  };

  const handleSeancePress = (seance) => {
    navigation.navigate('SeanceDetails', { seanceId: seance.id, formationId });
  };

  const formatSchedule = (schedule) => {
    if (!schedule || !Array.isArray(schedule)) return [];
    return schedule.map(item => ({
      day: item.day,
      startTime: item.startTime,
      endTime: item.endTime
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.container}>
      <Image source={formation?.thumbnail ? require('../assets/icons/thumb.jpg') : Icons.avatar} style={styles.banner}/>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{formation?.title || 'Formation'}</Text>
          <Text style={styles.subtitle}>{formation?.level} - {formation?.subject}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price} onPress={()=>{router.push('./profSeance')}}>{formation?.price} MAD</Text>
          <Text style={styles.priceUnit}>/ mois</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{formation?.rating?.toFixed(1) || '5.0'}</Text>
          <Icon name="star" color="#ff9500" size={16} />
          <Text style={styles.reviews}>({formation?.reviewsCount || 0})</Text>
        </View>
        <TouchableOpacity style={styles.subjectTag}>
          <Text style={styles.subjectText}>{formation?.subject}</Text>
        </TouchableOpacity>
        <View style={styles.studentsCount}>
          <Icon name="people" size={16} color="#666" />
          <Text style={styles.studentsText}>{formation?.enrolledStudents || 0} étudiants</Text>
        </View>
      </View>

      <View style={styles.descriptionBox}>
        <Text style={styles.description}>
          {formation?.description || 'Description non disponible'}
        </Text>
        
        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleTitle}>Horaires:</Text>
          {formatSchedule(formation?.schedule).map((item, index) => (
            <Text key={index} style={styles.scheduleItem}>
              {item.day} -------- {item.startTime} – {item.endTime}
            </Text>
          ))}
        </View>
        <View style={styles.additionalInfo}>
          <View style={styles.infoItem}>
            <Icon name="person" size={16} color="#666" />
            <Text style={styles.infoText}>Prof. {formation?.instructor || 'Non spécifié'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="access-time" size={16} color="#666" />
            <Text style={styles.infoText}>Durée: {formation?.duration || 'Non spécifiée'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="location-on" size={16} color="#666" />
            <Text style={styles.infoText}>{formation?.location || 'En ligne'}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Séances ({seances.length})</Text>
          <Text style={styles.sectionSubtitle}>
            {seances.length} séances disponibles
          </Text>
        </View>
        <TouchableOpacity onPress={handleAddSeance} style={styles.addButton}>
          <Icon name="add-circle" size={28} color="#0055ff" onPress={()=>{router.push('./profAddSession')}}/>
        </TouchableOpacity>
      </View>

      {seances.length > 0 ? (
        <ScrollView horizontal style={styles.sessionScroll} showsHorizontalScrollIndicator={false}>
          {seances.map((seance) => (
            <TouchableOpacity
              key={seance.id}
              style={[
                styles.sessionCard,
                seance.status === 'completed' && styles.sessionCardCompleted,
                seance.status === 'current' && styles.sessionCardCurrent
              ]}
              onPress={() => handleSeancePress(seance)}
            >
              <Image source={{ uri: seance.thumbnail}} style={styles.sessionImage}/>
              <View style={styles.sessionContent}>
                <Text style={styles.sessionTitle} numberOfLines={1}>{seance.title}</Text>
                <Text style={styles.sessionDate}>{formatDate(seance.date)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Icon name="video-library" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>Aucune séance disponible</Text>
          <Text style={styles.emptyStateSubtext}>Les séances apparaîtront ici une fois ajoutées</Text>
        </View>
      )}
      <BottomMenu/>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  banner: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  header: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0055ff',
  },
  priceUnit: {
    fontSize: 12,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  subjectTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 15,
  },
  subjectText: {
    fontSize: 12,
    color: '#0055ff',
    fontWeight: '500',
  },
  studentsCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  descriptionBox: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 15,
  },
  scheduleContainer: {
    marginBottom: 15,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  scheduleItem: {
    fontSize: 13,
    color: '#666',
    marginVertical: 2,
  },
  additionalInfo: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
  sectionHeader: {
    paddingHorizontal: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  addButton: {
    padding: 5,
  },
  sessionScroll: {
    paddingLeft: 15,
    marginBottom: 20,
  },
  sessionCard: {
    width: 140,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sessionCardCompleted: {
    opacity: 0.8,
  },
  sessionCardCurrent: {
    borderWidth: 2,
    borderColor: '#ff9500',
  },
  sessionImage: {
    width: '100%',
    height: 80,
    resizeMode: 'cover',
  },
  sessionContent: {
    padding: 10,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  actionContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#0055ff',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
});

export default ProfFormation;