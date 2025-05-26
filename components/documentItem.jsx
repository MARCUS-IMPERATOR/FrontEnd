import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const DocumentItem = ({ title, type, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <View style={styles.iconContainer}>
      {type === 'pdf' && <MaterialIcons name="picture-as-pdf" size={28} color="#E1341E" />}
      {type === 'doc' && <MaterialCommunityIcons name="file-word" size={28} color="#2B579A" />}
      {type === 'ppt' && <MaterialCommunityIcons name="file-powerpoint" size={28} color="#D24726" />}
    </View>
    <Text style={styles.title} numberOfLines={2}>{title}</Text>
    <MaterialIcons name="chevron-right" size={24} color="#999" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    flex: 1,
    fontSize: 16,
    marginRight: 8,
  },
});

export default DocumentItem;