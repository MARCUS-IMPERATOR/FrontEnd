import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const CheckoutScreen = () => {
  const router = useRouter();
  const { id, title, thumbnail, price, professor } = useLocalSearchParams();

  const courseData = {
    id: id || 1,
    title: title || "2 BAC SM BIOF PHYSIQUE",
    professor: professor.lastname || "Pr. Laaouani" ,
    price: price || 350.0,
    thumbnail:  require('../assets/img/hq720.jpg')
    // thumbnail ? { uri: thumbnail.toString() } :
  };

  const handlePayment = () => {
    router.push({
      pathname: '/courseDetails',
      params: { id: courseData.id, paymentSuccess: true }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Options de paiement</Text>
      </View>
      
      
      <ScrollView style={styles.scrollContent}>
        <View style={styles.courseInfo}>
          <Image source={courseData.thumbnail} style={styles.profImage} />
          <View style={styles.courseDetails}>
            <Text style={styles.courseTitle}>{courseData.title}</Text>
            <Text style={styles.professorName}>{courseData.professor}</Text>
            <Text style={styles.price}>{courseData.price} MAD/mois</Text>
          </View>
        </View>
        
       
      </ScrollView>
      
      
      <View style={styles.priceBreakdown}>
        <View style={styles.breakdownTotal}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>{courseData.price} MAD/mois</Text>
        </View>
        <TouchableOpacity style={styles.proceedButton} onPress={handlePayment}>
          <Text style={styles.proceedButtonText}>Procéder au paiement</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContent: {
    flex: 1,
    paddingBottom: 100, 
  },
  courseInfo: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#F3F6F8',
    borderRadius: 8,
    margin: 16,
  },
  profImage: {
    width: 110,
    height: 100,
    borderRadius: 10,
    marginRight: 12,
  },
  courseDetails: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  professorName: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  priceBreakdown: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  breakdownTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  proceedButton: {
    backgroundColor: '#000080',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});