import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';

const VideoPlayerScreen = () => {
  const router = useRouter();
  const { videoUrl, videoTitle, videoThumbnail } = useLocalSearchParams();
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBack = () => {
    // Lock to portrait when leaving
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
      .then(() => router.back());
  };

  const toggleFullscreen = async () => {
    if (isFullscreen) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    setIsFullscreen(!isFullscreen);
  };

  const handlePlaybackStatusUpdate = (playbackStatus) => {
    setStatus(playbackStatus);
    if (playbackStatus.isLoaded && !playbackStatus.isBuffering) {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isFullscreen && styles.fullscreenContainer]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{videoTitle || 'Video'}</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      {/* Video Player */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: videoUrl }}
          posterSource={{ uri: videoThumbnail }}
          usePoster={true}
          resizeMode="contain"
          shouldPlay={true}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onError={(error) => {
            console.error('Video Error:', error);
            setError('Failed to load video');
            setIsLoading(false);
          }}
        />

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        {error && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Controls Overlay */}
        {!isLoading && !error && (
          <View style={styles.controlsOverlay}>
            <TouchableOpacity 
              onPress={() => 
                status.isPlaying 
                  ? videoRef.current.pauseAsync() 
                  : videoRef.current.playAsync()
              }
              style={styles.controlButton}
            >
              <MaterialIcons 
                name={status.isPlaying ? "pause" : "play-arrow"} 
                size={48} 
                color="white" 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={toggleFullscreen}
              style={styles.fullscreenButton}
            >
              <MaterialIcons 
                name={isFullscreen ? "fullscreen-exit" : "fullscreen"} 
                size={28} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Video Info */}
      {!isFullscreen && (
        <View style={styles.infoContainer}>
          <Text style={styles.videoTitle}>{videoTitle}</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[
              styles.progressBar, 
              { width: `${(status.positionMillis / status.durationMillis) * 100 || 0}%` }
            ]} />
          </View>
          
          {/* Time Info */}
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {formatTime(status.positionMillis || 0)}
            </Text>
            <Text style={styles.timeText}>
              {formatTime(status.durationMillis || 0)}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

// Helper function to format time (ms -> mm:ss)
const formatTime = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  fullscreenContainer: {
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10,
  },
  backButton: {
    padding: 5,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    aspectRatio: 16/9,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    padding: 20,
  },
  fullscreenButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    padding: 10,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'black',
  },
  videoTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 16,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'red',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: 'white',
    fontSize: 14,
  },
});

export default VideoPlayerScreen;