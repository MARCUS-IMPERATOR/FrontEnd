import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const CourseScreenDetails = () => {
  const [course, setCourse] = useState({});
  const [seances, setSeances] = useState([]);
  // const {isLoggedIn} = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const router = useRouter();

  useEffect(() => {

    axios.get('/api/course-details')
      .then((response) => {
        const seancesWithDocuments = response.data.seances.map(seance => ({
          ...seance,
          documents: response.data.supports.filter(s => s.seanceId === seance.id)
        }));

        setCourse(response.data.course);
        setSeances(seancesWithDocuments);
      })
      .catch((error) => {
        console.error('Error fetching course data:', error);
        // Dummy data
        const dummyCourse = {
          id: 1,
          title: "2 BAC SM BIOF PHYSIQUE",
          professor: {
            firstName: "Pr.",
            lastName: "Laaouani"
          },
          rating: 4.3,
          numberOfReviews: "1.2K",
          price: "300",
          subject: "Physique",
          description: "Plongez au cœur des ondes lumineuses à travers une formation complète et interactive animée par le professeur Laaouani, expert en physique pour le niveau baccalauréat. Cette session est conçue spécialement pour les étudiants en filière Sciences Mathématiques option BIOF.",
          dates: [
            { day: "Lundi", time: "18h30 – 21h00" },
            { day: "Mercredi", time: "18h30 – 21h00" },
            { day: "Vendredi", time: "18h30 – 21h00" },
          ],
          thumbnail: require('../assets/img/hq720.jpg')
        };
        const dummySeances = [
          { id: 1, title: "Seance 1", date: "13/9/2024", duration: "23:00", videoUrl: "",img: require("../assets/img/hq720.jpg"),documents: [  
            { id: 1, title: "Introduction", type: "pdf" , url:"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"},
            { id: 2, title: "Exercices", type: "pdf" , url:"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}
          ] },
          { id: 2, title: "Seance 2", date: "15/9/2024", duration: "23:00", videoUrl: "" ,img: require("../assets/img/hq720.jpg"),
            documents: [  
            { id: 1, title: "Introduction", type: "pdf", url:"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
            { id: 2, title: "Exercices", type: "pdf",url:"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
          ]
          },
          { id: 3, title: "Seance 3", date: "17/9/2024", duration: "23:00", videoUrl: "",img: require("../assets/img/hq720.jpg"), documents: [ 
            { id: 1, title: "Introduction", type: "pdf",url:"" },
            { id: 2, title: "Exercices", type: "pdf",url:"" }
          ] },
          { id: 4, title: "Seance 4", date: "11/9/2024", duration: "23:00", videoUrl: "" ,img: require("../assets/img/hq720.jpg"), documents: [  
            { id: 1, title: "Introduction", type: "pdf",url:""},
            { id: 2, title: "Exercices", type: "pdf",url:"" }
          ]}
        ];
        
        setCourse(dummyCourse);
        setSeances(dummySeances);
        setSupports(dummySeances.documents);
      });
  }, []);

  
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

  // Function to handle press on seance or subscription button or support de cours
  const handlePress = (item, { 
    type = 'access',
    resourceName = 'cette ressource',
    targetScreen = null
  } = {}) => {
    if (isLoggedIn) {
      // If logged in, navigate directly to the target screen
      if (targetScreen) {
        const baseParams = {
          id: item.id,
          title: item.title,
        };

        // Add specific params based on target screen
        const screenParams = {
          seance: {
            ...baseParams,
            videoUrl: item.videoUrl,
            date: item.date,
            duration: item.duration,
            description: item.description
          },
          pdfviewer: {
            ...baseParams,
            url: item.url,
            type: item.type || 'pdf'
          },
          checkout: {
            ...baseParams,
            price: item.price,
            professor: item.professor,
            thumbnail: item.thumbnail

          }, 
        };

        router.push({
          pathname: targetScreen,
          params: screenParams[targetScreen] || baseParams
        });
      }
      return;
    }

    const messages = {
      subscription: `Veuillez vous connecter pour vous inscrire à ce cours.`,
      seance: `Veuillez vous connecter pour accéder à la séance "${item.title}".`,
      support: `Veuillez vous connecter pour accéder au support "${item.title}".`,
      access: `Veuillez vous connecter pour accéder à ${resourceName}.`
    };

    Alert.alert(
      'Connexion requise',
      messages[type] || messages.access,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Se connecter', 
          onPress: () => router.push({
            pathname: '/loginStudent',
            params: { 
              redirectTo: targetScreen, 
              itemId: item.id,
              actionType: type
            }
          }) 
        }
      ],
      { cancelable: false }
    );
  };


  // const handleViewDocument = (doc) => {
  //   if (!isLoggedIn) {
  //     handlePress(doc, { 
  //       type: 'support', 
  //       resourceName: doc.title,
  //       targetScreen: 'pdfviewer'
  //     });
  //     return;
  //   }

  //   //for dummy
  //   const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    
  //   router.push({
  //     pathname: 'pdfviewer',
  //     params: { 
  //       title: doc.title,
  //       url: doc.url || pdfUrl, 
  //       type: doc.type || 'pdf'  
  //     }
  //   });
  // };



  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={course.thumbnail} style={styles.banner} />
      </View>

      <View style={styles.courseInfo}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginBottom: 6 , flex: 1 }}>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={[styles.price, { fontFamily: 'IBM Plex Sans' , fontWeight: 'bold'}]}>{course.price} MAD</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{course.rating}</Text>
          {renderStars(course.rating)}
          <Text style={styles.reviews}>({course.numberOfReviews})</Text>
          <Text style={styles.subject}>{course.subject}</Text>
        </View>

        <View style={styles.teacherSection}>
          <TouchableOpacity style={styles.teacherInfo} onPress={() => router.push('/profProfile')}>
            <Image source={require('../assets/img/prof.png')} style={styles.profImage} />
            <Text style={styles.profName}>{course.professor?.firstName} {course.professor?.lastName}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.subscribeBtn}
            onPress={() => handlePress(course, { type: 'subscription', targetScreen: 'checkout' })}
          >
            <Text style={styles.subscribeText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.descriptionBox}>
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{course.description}</Text>
        <View style={styles.descriptionDates}>
          {course.dates &&
            course.dates.map((d, idx) => (
              <Text style={styles.sessions}  key={idx}>
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
              style={styles.seanceCard}
              onPress={() => handlePress(seance, {
                type: 'seance',
                resourceName: seance.title,
                targetScreen: 'seance'
              })}
            >
              <View style={styles.seanceImageContainer}>
                <Image source={seance.img} style={styles.seanceImage} />
                {/* <Text style={styles.seanceNumber}>Séance {seance.id}</Text> */}
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
            seance.documents?.map((doc, index) => (
              <TouchableOpacity
                key={`${seance.id}-${doc.id}`}
                onPress={() => handlePress(doc,{
                  type: 'support',
                  resourceName: doc.title,
                  targetScreen: 'pdfviewer'
                })}
                style={styles.supportCard}
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

      <TouchableOpacity 
        style={styles.testButton}
        onPress={() => router.replace({
          pathname: 'pdfviewer',
          params: {
            title: 'Test PDF',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        })}
      >
        <Text style={styles.testButtonText}>TEST PDF VIEWER</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
export default CourseScreenDetails;

const styles = StyleSheet.create({
  testButton: {
    backgroundColor: 'blue',
    padding: 15,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center'
  },
  testButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
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
    borderColor:'rgba(0,0,0,0.5)',
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
    // padding: 16,
    marginHorizontal: 12,
    backgroundColor: '#F3F6F8',
    borderRadius: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    paddingVertical: 12,
  },
  descriptionTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
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
    paddingHorizontal:16,
    paddingVertical: 12
  },
  seanceCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: '#F3F6F8',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
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
  seanceNumber: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },
  seanceContent: {
    paddingVertical: 8,
    paddingHorizontal: 6
  },
  seanceTitle: {
    font: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  seanceSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  seanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seanceDate: {
    fontSize: 12,
    color: '#666',
  },
  seanceDuration: {
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
  }
});

