import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomMenu from "../components/bottomMenu";
import { Icons } from "../constants/Icons";
import { useRouter } from "expo-router";
import axios from "axios";

const ProfList = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tout");
  const [searchText, setSearchText] = useState("");
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Dummy data with require() statements as you specified
  const dummyProfs = [
    { id: 1, name: "Adrdour", subject: "Mathematiques", imageUrl: require('../assets/img/profs/7.jpeg') },
    { id: 2, name: "Badaoui", subject: "Physique", imageUrl: null },
    { id: 3, name: "Ouissam", subject: "Français", imageUrl: null },
    { id: 4, name: "Elboukhari", subject: "Mathematiques", imageUrl: null },
    { id: 5, name: "Chokairi", subject: "Physique", imageUrl: null },
    { id: 6, name: "Taousse", subject: "Français", imageUrl: null },
    { id: 7, name: "Laauani", subject: "SVT", imageUrl: null },
    { id: 8, name: "Adrdour", subject: "Mathematiques", imageUrl: null },
    { id: 9, name: "Elboukhari", subject: "Mathematiques", imageUrl: null },
    { id: 10, name: "Ouissam", subject: "Français", imageUrl: null },
    { id: 11, name: "Chokairi", subject: "Physique", imageUrl: null },
    { id: 12, name: "Taousse", subject: "Anglais", imageUrl: null },
    { id: 13, name: "Taousse", subject: "Anglais", imageUrl: null },
    { id: 14, name: "Laauani", subject: "SVT", imageUrl: null },
    { id: 15, name: "Adrdour", subject: "Mathematiques", imageUrl: null },
  ];

  useEffect(() => {
    const fetchProfessors = () => {
      setLoading(true);
      setError(null);
      
      axios.get('/')
        .then(response => {
          const formattedData = response.data.map(prof => ({
            id: prof.id,
            name: prof.name,
            subject: prof.subject,
            imageUrl: prof.imageUrl ? { uri: prof.imageUrl } : null
          }));
          setProfessors(formattedData);
        })
        .catch(err => {
          console.error("API Error:", err);
          setError(err.message);
          // Use dummy data as fallback
          setProfessors(dummyProfs);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchProfessors();
  }, []);

  const categories = ["Tout", "Mathematiques", "Physique", "Français", "SVT", "Anglais"];

  const filteredProfs = professors.filter(prof => {
    const matchesCategory = selectedCategory === "Tout" || 
                          prof.subject === selectedCategory;
    const matchesSearch = prof.name.toLowerCase().includes(searchText.toLowerCase()) ||
                        prof.subject.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getImageSource = (prof) => {
    if (prof.imageUrl) {
      return prof.imageUrl;
    }
    return require('../assets/img/anonyme.jpeg');
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#000080" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
    
      {/* Search Bar */}
      <View style={styles.searchBar}>
          <TextInput
              placeholder="Rechercher"
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
          />
          <TouchableOpacity>
              <Image source={Icons.srch} style={styles.icon} />
          </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.categoryItem,
                selectedCategory === item && styles.activeCategoryItem
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={selectedCategory === item ? styles.activeCategoryText : styles.categoryText}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriesContent}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>Profs</Text>
      
      {/* Professors List */}
      <View style={styles.profsContainer}>
          {filteredProfs.length > 0 ? (
            <FlatList
              data={filteredProfs}
              renderItem={({ item }) => (
                  <TouchableOpacity 
                      style={styles.profItem}
                      onPress={() => router.push({
                        pathname: '/profProfile',
                        params: { 
                          prof: JSON.stringify(item) 
                        }
                      })}
                      activeOpacity={0.7}
                  >
                      <Image 
                        source={getImageSource(item)}
                        style={styles.profImage}
                      />
                      <Text style={styles.profName}>Pr. {item.name}</Text>
                      <Text style={styles.profSubject}>{item.subject}</Text>
                  </TouchableOpacity>
              )}
              numColumns={3}
              keyExtractor={(item) => item.id.toString()}
            />
          ) : (
            <Text style={styles.noResults}>Aucun professeur trouvé</Text>
          )}
          {error && (
            <Text style={styles.errorText}>Note: Using fallback data due to connection issues</Text>
          )}
      </View>

      <BottomMenu />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#F3F6F8",
  },
  searchInput: {
    flex: 1,
    height: 50,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  categoriesContainer: {
    height: 40,
    marginBottom: 5,
  },
  categoriesContent: {
    alignItems: 'center',
    paddingRight: 16, 
  },
  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: "#F3F6F8",
    borderRadius: 18,
  },
  activeCategoryItem: {
    backgroundColor: "#000080",
  },
  categoryText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
  activeCategoryText: {
    color: "#FFFFFF",
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
  },

  profsContainer: {
    flex: 1,

  },
  profItem: {
    width: "32%",
    margin: "0.66%",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    
  
    elevation: 2,
  },
  profImage: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginBottom: 8,
    backgroundColor: "#F5F5F5",
  },
  profName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
  profSubject: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  noResults: {
    textAlign: "center",
    marginTop: 24,
    color: "#666",
  },
});

export default ProfList;