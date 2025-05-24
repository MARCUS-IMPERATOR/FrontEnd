import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BottomMenu from '../components/bottomMenu';
import FormationCard from '../components/formationCard';
import { Icons } from '../constants/Icons';
import { Colors } from '../constants/Colors';

const dummyFormations = [
  {
    id: '1',
    title: '2 BAC SM BIOF Math T9achr',
    date: 'Mai 14, 22:00',
    students: '40 étudiant',
  },
  {
    id: '2',
    title: '2 BAC SM BIOF Math T9achr',
    date: 'Mai 14, 22:00',
    students: '40 étudiant',
  },
  {
    id: '3',
    title: '2 BAC SM BIOF Math T9achr',
    date: 'Mai 14, 22:00',
    students: '40 étudiant',
  },
];

const dummyProfInfo = {
  name: 'Professeur',
  image: null,
};

export default function DashboardScreen() {
  const [formations, setFormations] = useState([]);
  const [profInfo, setProfInfo] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const profInfoString = await AsyncStorage.getItem('profInfo');
        let profData;
        if (profInfoString) {
          profData = JSON.parse(profInfoString);
          setProfInfo(profData);
        } else {
          console.log('No professor info found in AsyncStorage, using dummy data');
          profData = dummyProfInfo;
          setProfInfo(profData);
        }

        const email = await AsyncStorage.getItem('email');
        const password = await AsyncStorage.getItem('pass');

        try {
          const response = await axios.get("http://<...>:8090/api/formations", {
            auth: { username: email, password }
          });
          setFormations(response.data);
        } catch (error) {
          console.error('Error fetching formations:', error);
          setFormations(dummyFormations);
        }
      } catch (error) {
        console.error('Unexpected error during data fetching:', error);
      }
    };
    fetchAllData();
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return date.toLocaleDateString('fr-FR', options);
    } catch (error) {
      return dateString;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <TouchableOpacity style={styles.notifCont}>
              <Image source={Icons.notif} style={styles.notifStyles} />
            </TouchableOpacity>
            <TouchableOpacity>
              {profInfo?.image ? (
                <Image source={{ uri: profInfo.image }} style={styles.avatar} />
              ) : (
                <Image source={require("../assets/img/profile.jpg")} style={styles.avatar} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes Formations</Text>
            <Image source={Icons.circAdd} style={styles.addIconStyles}/>
          </View>

          {formations.length > 0 ? (
            formations.map(item => (
                <FormationCard key={item.id} formation={item} onPress={(formation) => {}}/>
                ))
            ) : (
            <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Aucune formation disponible</Text>
            </View>
            )}
        </View>
      </ScrollView>

      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
  },
  header: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 20,
  },
  welcome: { 
    fontSize: 16, 
    color: '#666' 
  },
  name: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  profileContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20 
  },
  notifCont: {
    padding: 5,
  },
  notifStyles: {
    width: 30,
    height: 30,
    marginRight: 10,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#001f7f',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },

  section: { 
    marginTop: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: Colors.headerColor
  },
  viewAll: { 
    color: '#0033cc', 
    fontSize: 14,
    fontWeight: '500',
  },

  addBtn: {
    backgroundColor: '#001f7f',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addIconStyles: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  addBtnText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },

  time: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  emptyStateText: {
    color: '#999',
    fontSize: 14,
  },
  avatarStyles: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
});