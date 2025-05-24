import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Icons } from '../constants/Icons';

const FormationCard = ({ formation, onPress }) => {
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
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPress && onPress(formation)}>
      <View style={styles.card}>
        <Image
          style={styles.cardImage}
          source={
            formation?.image
              ? { uri: formation.image }
              : require('../assets/icons/thumb.jpg')
          }
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{formation.title}</Text>
          <Text style={styles.cardMeta}>
            <Image source={Icons.students} style={styles.iconStyles} />
            {formation.students || '0 étudiant'} · {formatDate(formation.date)}
          </Text>
        </View>
        <Image source={Icons.plus} style={styles.iconStyles} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  cardMeta: {
    fontSize: 13,
    color: '#666',
  },
  iconStyles: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
});

export default FormationCard;
