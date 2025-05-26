import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import { Icons } from '../constants/Icons';

const Checkout = ({ navigation, route }) => {
  const [course, setCourse] = useState(null);

  const courseId = route.params?.courseId ?? null;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const mockCourse = {
    id: 1,
    title: "shi cours",
    teacher: "Dr. Smayka",
    price: 2.5,
    imageUrl: Icons.thumb
  };

  useEffect(() => {
    fetchCourseInfo();
  }, []);

  const fetchCourseInfo = async () => {
    try {
      if (!courseId) {
        setCourse(mockCourse);
        return;
      }

      const email = await AsyncStorage.getItem('email');
      const password = await AsyncStorage.getItem('password');
      const authHeader = 'Basic ' + btoa(`${email}:${password}`);
      
      const response = await axios.get(`http://<...>:8090/api/courses/${courseId}`, {
        headers: { 'Authorization': authHeader }
      });

      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
      Alert.alert('Erreur', 'Impossible de charger le cours');
      setCourse(mockCourse);
    }
  };

  const handlePayment = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      const password = await AsyncStorage.getItem('password');
      const authHeader = 'Basic ' + btoa(`${email}:${password}`);
      
      const response = await axios.post('http://<...>:8090/api/checkout', {
        amount: Math.round(course.price * 100), 
        courseId: course.id,
      }, {
        headers: { 'Authorization': authHeader }
      });

      const { clientSecret } = response.data;

      await initPaymentSheet({
        merchantDisplayName: 'Mouraja3ti',
        paymentIntentClientSecret: clientSecret,
      });

      const { error } = await presentPaymentSheet();

      if (error && error.code !== 'Canceled') {
        Alert.alert('Erreur', 'Le paiement a échoué');
      } else if (!error) {
        Alert.alert('Succès', 'Paiement réussi!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Erreur', 'Impossible de traiter le paiement');
    }
  };

  if (!course) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Aucun cours trouvé</Text>
        <TouchableOpacity 
          style={styles.payButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.payButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.courseCard}>
          <Image
            source={course.imageUrl}
            style={styles.courseImage}
          />
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseTeacher}>{course.teacher}</Text>
            <Text style={styles.coursePrice}>{course.price.toFixed(2)} MAD</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: {course.price.toFixed(2)} MAD</Text>
        <TouchableOpacity 
          style={styles.payButton} 
          onPress={handlePayment}
        >
          <Text style={styles.payButtonText}>Payer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    fontSize: 24,
    color: '#00008B',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  courseInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  courseTeacher: {
    fontSize: 14,
    color: '#666',
  },
  coursePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00008B',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  payButton: {
    backgroundColor: '#00008B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Checkout;