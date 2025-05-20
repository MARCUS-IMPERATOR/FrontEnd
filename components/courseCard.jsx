import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Icons } from '../constants/Icons';

const CourseCard = ({ course }) => {
  return (
    <View style={styles.card}>
      <Image source={course.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.teacher}>Avec {course.teacher}</Text>
        <Text style={styles.rating}>
          {course.rating} ★★★★☆ ({course.reviews})
        </Text>
        <Text style={styles.subject}>{course.subject}</Text>
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>s'inscrire</Text>
          </TouchableOpacity>
          <Image source={Icons.bookmark} style={styles.icon} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { 
    flexDirection: 'row', 
    marginBottom: 10, 
    borderBottomWidth: 1, 
    borderColor: '#eee', 
    paddingBottom: 10 
  },
  image: { 
    width: 100, 
    height: 100, 
    borderRadius: 8, 
    marginRight: 10 
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain'
  },
  info: { 
    flex: 1 
  },
  title: { 
    fontWeight: 'bold' 
  },
  teacher: { 
    color: '#444' 
  },
  rating: { 
    color: 'orange' 
  },
  subject: { 
    color: 'red', 
    fontWeight: 'bold' 
  },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 5 
  },
  button: { 
    backgroundColor: '#000080', 
    padding: 8, 
    borderRadius: 6 
  },
  buttonText: { 
    color: '#fff' 
  },
});

export default CourseCard;
