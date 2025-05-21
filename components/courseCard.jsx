import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Icons } from '../constants/Icons';

const CourseCard = ({ title, professor, rating, numberOfReviews, imageSource }) => {
  const renderStars = (ratingValue) => {
    const fullStars = Math.floor(ratingValue);
    const halfStar = ratingValue - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {Array(fullStars)
          .fill()
          .map((_, i) => (
            <Text key={`full-${i}`} style={styles.star}>★</Text>
          ))}
        {halfStar && <Text key="half" style={styles.star}>½</Text>}
        {Array(emptyStars)
          .fill()
          .map((_, i) => (
            <Text key={`empty-${i}`} style={styles.star}>☆</Text>
          ))}
      </>
    );
  };

  return (
    <View style={styles.card}>
      <Image
        source={imageSource || Icons.thumb}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.teacher}>
          Avec Pr. {professor ? professor.lastName : 'Inconnu'}
        </Text>
        <Text style={styles.subject}>
          {professor ? professor.specialisation : 'Spécialité inconnue'}
        </Text>
        <Text style={styles.rating}>
          {rating} {renderStars(rating)} ({numberOfReviews})
        </Text>
      </View>
    </View>
  );
};

export default CourseCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  teacher: {
    color: '#444',
    marginTop: 4,
  },
  subject: {
    color: '#E1341E',
    fontWeight: 'bold',
    marginTop: 2,
  },
  rating: {
    color: 'orange',
    marginTop: 2,
  },
  star: {
    fontSize: 14,
    color: 'orange',
  },
});