import { View, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import Pdf from 'react-native-pdf';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState, useEffect } from 'react'; 

const PdfViewerScreen = () => {
  const router = useRouter();
  const { title, url } = useLocalSearchParams();
  const [downloading, setDownloading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  
  useEffect(() => {
    console.log('Params received:', { title, url });
    if (!url) {
      setPdfError('No URL provided for PDF');
    }
  }, [url, title]);

  const handleDownload = async () => {
    if (!url) {
      Alert.alert('Error', 'No PDF URL provided');
      return;
    }

    setDownloading(true);
    try {
      const fileExtension = url.split('.').pop().split(/\#|\?/)[0];
      const fileName = `${title || 'document'}.${fileExtension || 'pdf'}`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        fileUri,
        { headers: { 'Cache-Control': 'no-cache' } }
      );

      const { uri } = await downloadResumable.downloadAsync();
      
      Alert.alert(
        'Download Complete',
        'File saved successfully',
        [
          { text: 'Share', onPress: () => Sharing.shareAsync(uri, { UTI: `.${fileExtension}`, mimeType: 'application/pdf' }) },
          { text: 'OK' }
        ]
      );
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download file');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        
        <Text style={styles.title} numberOfLines={1}>
          {title || 'PDF Viewer'}
        </Text>
        
        <TouchableOpacity 
          onPress={handleDownload} 
          disabled={downloading || !url}
        >
          {downloading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <MaterialIcons 
              name="file-download" 
              size={24} 
              color={!url ? 'gray' : 'black'} 
            />
          )}
        </TouchableOpacity>
      </View>
      
      {pdfError ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={50} color="red" />
          <Text style={styles.errorText}>Failed to load PDF</Text>
          <Text style={styles.errorSubText}>{pdfError}</Text>
        </View>
      ) : (
        <Pdf
          style={styles.pdf}
          source={url ? { uri: url } : null} // Only render if url exists
          onError={(error) => {
            console.error('PDF Error:', error);
            setPdfError(error.message || 'Unknown error occurred');
          }}
          onLoadComplete={() => setPdfError(null)}
          fadeInDuration={250}
        />
      )}
    </View>
  );
};

export default PdfViewerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    flex: 1,
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  pdf: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginTop: 10,
  },
  errorSubText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
    textAlign: 'center',
  },
});