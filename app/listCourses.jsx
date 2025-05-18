import { StyleSheet, Text, View, FlatList, TouchableOpacity, StatusBar, Image, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useRouter } from 'expo-router';
import BottomMenu from '../components/bottomMenu';
import { Icons } from '../constants/Icons';

const categories = ['Tout', 'Mathematiques', 'Physique', 'Français'];

const ListCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [allCourses, setAllCourses] = useState([]);
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  useEffect(() => {
    axios.get('http://localhost:8080/')
      .then(response => {
        setCourses(response.data);
        setAllCourses(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the courses!', error);
        const dummy = Array(4).fill({
          title: '2 BAC SM BIOF Math Teacher',
          teacher: 'Pr. Arddour',
          rating: '5.0',
          reviews: '1.2K',
          price: '300 DH',
          subject: 'Mathematiques',
          image: Icons.placeHolder
        });
        setCourses(dummy);
        setAllCourses(dummy);
      });
  }, []);

  const filterCourses = () => {
    let filteredCourses = JSON.parse(JSON.stringify(allCourses)); 
    if (selectedCategory !== 0) {
      const categ = categories[selectedCategory].toLowerCase();
      filteredCourses = filteredCourses.filter(course => course.subject.toLowerCase() === categ);
    }
    if (searchText.trim() !== '') {
      const txt = searchText.toLowerCase().trim();
      filteredCourses = filteredCourses.filter(
        course => course.title.toLowerCase().includes(txt) || 
                  course.teacher.toLowerCase().includes(txt) || 
                  course.subject.toLowerCase().includes(txt)
      );
    }
    setCourses(filteredCourses); 
  };

  useEffect(() => {
    filterCourses();
  }, [selectedCategory, searchText]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleCategorySelect = (index) => {
    setSelectedCategory(index);
  };

  const renderCourse = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.teacher}>Avec {item.teacher}</Text>
        <Text style={styles.rating}>
          {item.rating} ★★★★☆ ({item.reviews})
        </Text>
        <Text style={styles.subject}>{item.subject}</Text>
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>s'inscrire</Text>
          </TouchableOpacity>
          <Image source={Icons.bookmark} style={styles.icon} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.connexionBtn}>
          <Text style={styles.btnText}>Connexion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profBtn}>
          <Text style={styles.btnText}>Prof</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Recherche"
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={filterCourses}>
          <Image source={Icons.srch} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.categories}>
        {categories.map((cat, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.catBtn, i === selectedCategory && styles.catActive]}
            onPress={() => handleCategorySelect(i)}
          >
            <Text style={[styles.catText, i === selectedCategory && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Formations Populaires</Text>
      <FlatList
        data={courses}
        renderItem={renderCourse}
        keyExtractor={(_, i) => i.toString()}
        ListEmptyComponent={
          <Text style={styles.catText}>Aucun cours ne correspond à votre recherche</Text>
        }
      />
      <BottomMenu />
    </SafeAreaView>
  );
};

export default ListCourses;


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10, 
    backgroundColor: '#fff' 
  },
  
  topBar: { 
    flexDirection: 'row', 
    marginBottom: 10,
    backgroundColor:'#D9D9D9',
    borderRadius: 30,
    width:120
  },
  connexionBtn: { 
    backgroundColor: '#000080', 
    padding: 10, 
    borderRadius: 30
  },
  profBtn: { 
    backgroundColor: '#D9D9D9', 
    padding: 10, 
    borderRadius: 30 
  },
  btnText: { 
    color: '#fff' 
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: { 
    flex: 1, 
    height: 40 
  },

  categories: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 10 ,
    color:"#0A3C53",
  },
  catBtn: { 
    backgroundColor: '#EAEAEA', 
    padding: 8, 
    borderRadius: 20, 
    margin: 4 
  },
  catActive: { 
    backgroundColor: '#000080' 
  },
  catText: { 
    color: '#000' 
  },
  catTextActive: { 
    color: '#fff' 
  },

  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginVertical: 10 ,
    color:"#0A3C53",
  },

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
    width:24,
    height:24,
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