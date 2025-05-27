import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useRouter } from "expo-router";
import BottomMenu from "../components/bottomMenu";
import { Icons } from "../constants/Icons";
import { Colors } from "../constants/Colors";
import CourseCard from "../components/courseCard";

const categories = ["Tout", "Mathematiques", "Physique", "Français"];

const ListCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [allCourses, setAllCourses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://192.168.10.1:8090/api/courses/all", {
        auth: {
          username: "jane@example.com",
          password: "wafae1234",
        },
      })
      .then((response) => {
        setCourses(response.data);
        setAllCourses(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the courses!", error);
        const dummy = Array(10).fill({
          title: "2 BAC SM BIOF Math Teacher",
          professor: { 
            lastName: "Arddour", 
            specialisation: "Mathematiques" 
          },
          rating: 5.0,
          numberOfReviews: 1200,
          subject: "Mathematiques",
          image: Icons.placeHolder,
        });
        setCourses(dummy);
        setAllCourses(dummy);
      });
  }, []);

  const filterCourses = () => {
    let filtered = [...allCourses];

    if (selectedCategory !== 0) {
      const categ = categories[selectedCategory].toLowerCase();
      filtered = filtered.filter(
        (course) => course.subject.toLowerCase() === categ
      );
    }

    if (searchText.trim() !== "") {
      const txt = searchText.toLowerCase().trim();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(txt) ||
          (course.professor &&
            course.professor.lastName.toLowerCase().includes(txt)) ||
          course.subject.toLowerCase().includes(txt)
      );
    }

    setCourses(filtered);
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
    <CourseCard
      title={item.title}
      professor={item.professor}
      rating={item.rating}
      numberOfReviews={item.numberOfReviews}
      imageSource={Icons.thumb}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.connexionBtn}>
          <Text style={styles.btnText}>Etudiant</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profBtn} onPress={()=>{router.push("./profDashboard")}}>
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
            <Text
              style={[
                styles.catText,
                i === selectedCategory && styles.catTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Formations Populaires</Text>

      <FlatList
        data={courses}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => router.push({
              pathname: "/course",
              params: { 
                courseId: item.id,
                title: item.title,
                professor: JSON.stringify(item.professor),
                price: item.price,
                thumbnail: item.thumbnail?.uri || null
              }
            })}
          >
            {renderCourse({ item })}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.catText}>
            Aucun cours ne correspond à votre recherche
          </Text>
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
    backgroundColor: Colors.backgroundColor,
  },
  topBar: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: Colors.lightGrey,
    borderRadius: 30,
    width: 120,
  },
  connexionBtn: {
    backgroundColor: "#000080",
    padding: 10,
    borderRadius: 30,
  },
  profBtn: {
    backgroundColor: Colors.lightGrey,
    padding: 10,
    borderRadius: 30,
  },
  btnText: {
    color: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  catBtn: {
    backgroundColor: "#EAEAEA",
    padding: 8,
    borderRadius: 20,
    margin: 4,
  },
  catActive: {
    backgroundColor: "#000080",
  },
  catText: {
    color: "#000",
    fontSize: 14,
    
  },
  catTextActive: {
    color: "#fff",
    fontWeight: 'bold',
    
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginVertical: 10,
  },
});