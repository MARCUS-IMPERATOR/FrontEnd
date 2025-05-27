import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const CourseScreenDetails = () => {
  const [course, setCourse] = useState({});
  const [seances, setSeances] = useState([]);
  const [students, setStudents] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageProfError, setImageProfError] = useState(false);
  const { isLoading, user, login, logout } = useAuth();
  const { 
    courseId, 
    title: paramTitle, 
    professor: paramProfessor, 
    price: paramPrice,
    thumbnail: paramThumbnail 
  } = useLocalSearchParams();
  const isLoggedIn = true; 

  const router = useRouter();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        if (courseId) {
          const response = await axios.get(`/api/courses/${courseId}`);
          const seancesWithDocuments = response.data.seances.map(seance => ({
            ...seance,
            documents: response.data.supports.filter(s => s.seanceId === seance.id)
          }));

          setCourse(response.data.course);
          setSeances(seancesWithDocuments);
          
          if (isLoggedIn && user) {
            const subscriptionResponse = await axios.get(`/api/subscriptions?userId=${user.id}&courseId=${courseId}`);
            setIsSubscribed(subscriptionResponse.data.isSubscribed);
          }
        } else {
          // Use dummy data with params if available
          const parsedProfessor = paramProfessor ? JSON.parse(paramProfessor) : {
            id: "1",
            firstName: "Pr.",
            lastName: "Laaouani",
            imageUrl: "https://example.com/professors/1.jpg"
          };

          const dummyCourse = {
            id: courseId || 1,
            title: paramTitle || "2 BAC SM BIOF PHYSIQUE",
            professor: parsedProfessor,
            rating: 4.3,
            numberOfReviews: "1.2K",
            price: paramPrice || "300",
            subject: "Physique",
            description: "Plongez au cœur des ondes lumineuses à travers une formation complète et interactive animée par le professeur Laaouani, expert en physique pour le niveau baccalauréat. Cette session est conçue spécialement pour les étudiants en filière Sciences Mathématiques option BIOF.",
            dates: [
              { day: "Lundi", time: "18h30 – 21h00" },
              { day: "Mercredi", time: "18h30 – 21h00" },
              { day: "Vendredi", time: "18h30 – 21h00" },
            ],
            thumbnail: paramThumbnail ? { uri: paramThumbnail } : require('../assets/img/hq720.jpg')
          };

          const dummySeances = [
            { id: 1, title: "Seance 1", date: "13/9/2024", duration: "23:00", 
              videoUrl: "", img: require("../assets/img/hq720.jpg"), documents: [  
                { id: 1, title: "Introduction", type: "pdf", url:"https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf"},
                { id: 2, title: "Exercices", type: "pdf", url:"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}
              ] 
            },
            { id: 2, title: "Seance 2", date: "15/9/2024", duration: "23:00", videoUrl: "", img: require("../assets/img/hq720.jpg"), documents: [  
              { id: 1, title: "Introduction", type: "pdf", url:"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
              { id: 2, title: "Exercices", type: "pdf", url:"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
            ]},
            { id: 3, title: "Seance 3", date: "17/9/2024", duration: "23:00", videoUrl: "", img: require("../assets/img/hq720.jpg"), documents: [ 
              { id: 1, title: "Introduction", type: "pdf", url:"" },
              { id: 2, title: "Exercices", type: "pdf", url:"" }
            ] },
            { id: 4, title: "Seance 4", date: "11/9/2024", duration: "23:00", videoUrl: "", img: require("../assets/img/hq720.jpg"), documents: [  
              { id: 1, title: "Introduction", type: "pdf", url:""},
              { id: 2, title: "Exercices", type: "pdf", url:"" }
            ]}
          ];

          // Dummy students data
          const dummyStudents = [
            {
              id: 1,
              name: "Ahmed Benali",
              avatar: "https://randomuser.me/api/portraits/men/1.jpg"
            },
            {
              id: 2,
              name: "Fatima Zahra",
              avatar: "https://randomuser.me/api/portraits/women/1.jpg"
            },
            {
              id: 3,
              name: "Mehdi El",
              avatar: "https://randomuser.me/api/portraits/men/2.jpg"
            },
            {
              id: 4,
              name: "Amina Karima",
              avatar: "https://randomuser.me/api/portraits/women/2.jpg"
            },
            {
              id: 5,
              name: "Amina Karima",
              avatar: null
            }
          ];

          setStudents(dummyStudents);    
          setCourse(dummyCourse);
          setSeances(dummySeances);
          setIsSubscribed(true); // Default to not subscribed
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourseData();
  }, [courseId, paramTitle, paramProfessor, paramPrice, paramThumbnail, isLoggedIn, user]);

  const renderStars = (rating) => {
    const safeRating = Math.min(Math.max(Number(rating) || 0, 5));
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <View style={styles.starContainer}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <Text key={`full-${i}`} style={{color:'gold'}}>★</Text>
        ))}
        {hasHalfStar && <Text key="half">½</Text>}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Text key={`empty-${i}`}>☆</Text>
        ))}
      </View>
    );
  };

  const handleAction = (item, type, targetScreen) => {
    if (!isLoggedIn) {
      Alert.alert(
        'Connexion requise',
        'Veuillez vous connecter pour accéder à cette fonctionnalité',
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Se connecter', 
            onPress: () => router.push({
              pathname: '/loginStudent',
              params: { 
                redirectTo: 'course', 
                itemId: course.id 
              }
            }) 
          }
        ]
      );
      return;
    }

    if (!isSubscribed && type !== 'subscription') {
      Alert.alert(
        'Abonnement requis',
        'Vous devez vous abonner pour accéder à ce contenu',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: "S'abonner", onPress: () => handleSubscription() }
        ]
      );
      return;
    }

    if (targetScreen) {
      router.push({
        pathname: targetScreen,
        params: { ...item, isSubscribed }
      });
    }
  };

  const handleSubscription = async () => {
    if (!isLoggedIn) {
      router.push({
        pathname: '/loginStudent',
        params: { 
          redirectTo: 'checkout', 
          itemId: course.id 
        }
      });
      return;
    }

    router.push({
      pathname: '/checkout',
      params: {
        id: course.id,
        title: course.title,
        price: course.price,
        professor: course.professor,
        thumbnail: course.thumbnail,
        userId: user?.id 
      }
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={course.thumbnail} style={styles.banner} />
      </View>

      <View style={styles.courseInfo}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flex: 1 }}>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={[styles.price, { fontFamily: 'IBM Plex Sans', fontWeight: 'bold'}]}>{course.price} MAD</Text>
        </View>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{course.rating}</Text>
          {renderStars(course.rating)}
          <Text style={styles.reviews}>({course.numberOfReviews})</Text>
          <Text style={styles.subject}>{course.subject}</Text>
        </View>

        <View style={styles.teacherSection}>
          <TouchableOpacity 
            style={styles.teacherInfo} 
            onPress={() => router.push({
              pathname: '/profProfile',
              params: { profId: course.professor?.id || '1' }
            })}
          >
            <Image
              source={!imageProfError && course.professor?.imageUrl ? { uri: course.professor.imageUrl } : require('../assets/img/anonyme.jpeg')}
              defaultSource={require('../assets/img/anonyme.jpeg')}
              style={styles.profImage}
              onError={() => setImageProfError(true)}
            />
            
            <Text style={styles.profName}>{course.professor?.firstName} {course.professor?.lastName}</Text>
          </TouchableOpacity>
          
          {!isSubscribed && (
            <TouchableOpacity 
              style={styles.subscribeBtn}
              onPress={() => handleAction(course, 'subscription', 'checkout')}
            >
              <Text style={styles.subscribeText}>S'inscrire</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.descriptionBox}>
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{course.description}</Text>
        <View style={styles.descriptionDates}>
          {course.dates && course.dates.map((d, idx) => (
            <Text style={styles.sessions} key={idx}>
              {d.day.padEnd(12, " ")}  {d.time}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Séances</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {seances.map((seance) => (
            <TouchableOpacity 
              key={seance.id} 
              style={[
                styles.seanceCard,
                !isSubscribed && styles.disabledCard
              ]}
              onPress={() => handleAction(seance, 'seance', 'seance')}
              disabled={!isSubscribed}
            >
              <View style={styles.seanceImageContainer}>
                <Image source={seance.img} style={styles.seanceImage} />
              </View>
              <View style={styles.seanceContent}>
                <View style={styles.seanceFooter}>
                  <Text style={styles.seanceTitle}>{seance.title}</Text>
                  <Text style={styles.seanceDuration}>{seance.duration}</Text>
                </View>
                <Text style={styles.seanceDate}>{seance.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support de cours</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {seances.flatMap(seance => 
            seance.documents?.map((doc) => (
              <TouchableOpacity
                key={`${seance.id}-${doc.id}`}
                style={[
                  styles.supportCard,
                  !isSubscribed && styles.disabledCard
                ]}
                onPress={() => handleAction(doc, 'document', 'pdfvoir')}
                disabled={!isSubscribed}
              >
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons
                    name={doc.type === 'pdf' ? 'picture-as-pdf' : 'description'}
                    size={40}
                    color={doc.type === 'pdf' ? 'red' : 'blue'}
                  />
                  <Text style={styles.supportText}>Séance {seance.id}</Text>
                  <Text style={styles.supportText}>{doc.title}</Text>
                </View>   
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      {/* Students Section */}
      {isSubscribed && students.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Étudiants inscrits</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {students.map(student => (
              <View key={student.id} style={styles.studentItem}>
                <Image
                  source={!imageError && student.avatar ? { uri: student.avatar } : require('../assets/img/anonyme.jpeg')}
                  defaultSource={require('../assets/img/anonyme.jpeg')}
                  style={styles.studentAvatar}
                  onError={() => setImageError(true)}
                />
                <Text style={styles.studentName} numberOfLines={1}>
                  {student.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 200,
  },
  banner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  courseInfo: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flexShrink: 1
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    marginRight: 4,
    fontWeight: 'bold',
  },
  starContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviews: {
    marginRight: 16,
  },
  subject: {
    color: 'rgba(0, 100, 200, 0.8)',
    fontWeight: 'Medium',
  },
  teacherSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    marginRight: 8,
  },
  profName: {
    fontSize: 16,
    flex: 1,
  },
  subscribeBtn: {
    backgroundColor: '#000080',
    padding: 8,
    borderRadius: 5,
  },
  subscribeText: {
    color: 'white',
  },
  descriptionBox: {
    marginHorizontal: 12,
    backgroundColor: '#F3F6F8',
    borderRadius: 8,
    marginBottom: 10,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 9,
    paddingHorizontal: 9,
  },
  descriptionText: {
    paddingHorizontal: 9,
    paddingBottom: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  descriptionDates: {
    paddingHorizontal: 9,
    paddingBottom: 8,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  seanceCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: '#F3F6F8',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  disabledCard: {
    opacity: 0.6,
  },
  seanceImageContainer: {
    height: 100,
    position: 'relative',
  },
  seanceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  seanceContent: {
    paddingVertical: 8,
    paddingHorizontal: 6
  },
  seanceTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  seanceDuration: {
    fontSize: 12,
    color: '#666',
  },
  seanceDate: {
    fontSize: 12,
    color: '#666',
  },
  supportCard: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F3F6F8',
    borderRadius: 8,
  },
  supportText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  studentItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 80,
  },
  studentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginBottom: 5,
  },
  studentName: {
    fontSize: 12,
    textAlign: 'center',
  },
  studentsList: {
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default CourseScreenDetails;