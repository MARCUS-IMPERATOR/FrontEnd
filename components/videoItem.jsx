import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const VideoItem = ({ 
  title, 
  duration, 
  thumbnail, 
  date,
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
    >
      <Image 
        source={thumbnail ? { uri: thumbnail } : require('../assets/img/video-placeholder.jpg')}
        style={styles.thumbnail}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>{duration}</Text>
          <View style={styles.dotSeparator} />
          <Text style={styles.metaText}>{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width:'100vh',
    marginHorizontal: 2,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  thumbnail: {
    width: '100%',
    height: 90,
    backgroundColor: '#eee',
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666666',
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666666',
    marginHorizontal: 6,
  },
});

export default VideoItem;