import React, { useState, useEffect } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,ScrollView,FlatList,Modal,Dimensions,SafeAreaView,Alert,TextInput,ActivityIndicator,} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const ProfSeance = () => {
  const route = useRoute();
  const seanceId = route.params?.seanceId || route.params?.id;

  const [showVideo, setShowVideo] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [seanceData, setSeanceData] = useState(null);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  const player = useVideoPlayer(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    player => {
      player.loop = false;
      player.allowsExternalPlayback = true;
    }
  );

  const fetchSeanceData = async () => {
    try {
      if (!seanceId) {
        setError('Seance ID not found in route parameters');
        return;
      }

      setError(null);
      const response = await axios.get(`http://<...>:8090/api/seances/${seanceId}`);
      setSeanceData(response.data);
    } catch (err) {
      console.error('Error fetching seance data:', err);
      setError(err.response?.data?.message || 'Failed to load session data');

      Alert.alert(
        'Error',
        'Unable to load session data. Please check your connection and try again.',
        [
          { text: 'Retry', onPress: () => fetchSeanceData() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  useEffect(() => {
    fetchSeanceData();
  }, [seanceId]);

  const openDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const document = result.assets[0];
        setSelectedDocument(document);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to select document. Please try again.');
    }
  };

  const uploadDocument = async () => {
    if (!selectedDocument || !documentTitle.trim()) {
      Alert.alert('Error', 'Please select a document and provide a title.');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedDocument.uri,
        type: selectedDocument.mimeType,
        name: selectedDocument.name,
      });
      formData.append('title', documentTitle.trim());
      formData.append('seanceId', seanceId);

      const response = await axios.post('http://<...>:8090/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Document uploaded successfully!');
      setShowUploadModal(false);
      resetUploadForm();
      fetchSeanceData(); 
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'Failed to upload document. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setSelectedDocument(null);
    setDocumentTitle('');
  };

  const addDocument = () => {
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    resetUploadForm();
  };

  const handlePdfPress = (pdf) => {
    setSelectedPdf(pdf);
  };

  const handleVideoPlay = () => {
    setShowVideo(true);
    player.play();
  };

  const handleVideoClose = () => {
    setShowVideo(false);
    player.pause();
  };

  const getPdfViewerUrl = (pdfUrl) =>
    `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes('pdf')) return 'document-text';
    return 'document';
  };

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={24} color="#D32F2F" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.thumbnailContainer}>
          {showVideo ? (
            <View style={styles.videoContainer}>
              <VideoView
                style={styles.videoPlayer}
                player={player}
                allowsFullscreen
                allowsPictureInPicture
                contentFit="contain"
                nativeControls
              />
              <TouchableOpacity
                style={styles.closeVideoButton}
                onPress={handleVideoClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.fakeThumbnail}>
              <TouchableOpacity
                onPress={handleVideoPlay}
                style={styles.playOverlay}
                activeOpacity={0.7}
              >
                <Ionicons name="play-circle-outline" size={60} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.thumbnailText}>
                {seanceData?.videoTitle || 'Video: Les Ondes Lumineuses'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.sessionTitle}>
            {seanceData?.title ?? 'Untitled Session'}
          </Text>
          <Text style={styles.description}>
            {seanceData?.description ?? 'No description available.'}
          </Text>
        </View>

        <View style={styles.docsContainer}>
          <View style={styles.docsHeader}>
            <Text style={styles.docsTitle}>Documents</Text>
            <TouchableOpacity onPress={addDocument} activeOpacity={0.7}>
              <Ionicons name="add-circle" size={30} color="#003366" />
            </TouchableOpacity>
          </View>

          {seanceData?.documents?.length > 0 ? (
            <FlatList
              horizontal
              data={seanceData.documents}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pdfItem}
                  onPress={() => handlePdfPress(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="document-text" size={50} color="#D32F2F" />
                  <Text style={styles.pdfText} numberOfLines={2}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pdfListContainer}
            />
          ) : (
            <View style={styles.noDocumentsContainer}>
              <Ionicons name="document-outline" size={40} color="#ccc" />
              <Text style={styles.noDocumentsText}>No documents available</Text>
            </View>
          )}
        </View>

        {/* Document Upload Modal */}
        <Modal
          visible={showUploadModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={closeUploadModal}
        >
          <SafeAreaView style={styles.uploadModalContainer}>
            <View style={styles.uploadModalHeader}>
              <TouchableOpacity
                onPress={closeUploadModal}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={28} color="#003366" />
              </TouchableOpacity>
              <Text style={styles.uploadModalTitle}>Add Document</Text>
              <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.uploadModalContent}>
              <View style={styles.uploadSection}>
                <Text style={styles.sectionTitle}>Select Document</Text>
                
                {selectedDocument ? (
                  <View style={styles.selectedDocumentContainer}>
                    <View style={styles.documentInfo}>
                      <Ionicons 
                        name={getFileIcon(selectedDocument.mimeType)} 
                        size={40} 
                        color="#003366" 
                      />
                      <View style={styles.documentDetails}>
                        <Text style={styles.documentName} numberOfLines={2}>
                          {selectedDocument.name}
                        </Text>
                        <Text style={styles.documentSize}>
                          {formatFileSize(selectedDocument.size)}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={openDocumentPicker}
                      style={styles.changeDocumentButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.changeDocumentText}>Change</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={openDocumentPicker}
                    style={styles.selectDocumentButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="cloud-upload-outline" size={48} color="#003366" />
                    <Text style={styles.selectDocumentText}>
                      Tap to select a document
                    </Text>
                    <Text style={styles.supportedFormatsText}>
                      Supported: PDF, Word, PowerPoint, Text files
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Document Information</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Title *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={documentTitle}
                    onChangeText={setDocumentTitle}
                    placeholder="Enter document title"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.uploadModalFooter}>
              <TouchableOpacity
                onPress={closeUploadModal}
                style={[styles.footerButton, styles.cancelButton]}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={uploadDocument}
                style={[
                  styles.footerButton, 
                  styles.uploadButton,
                  (!selectedDocument || !documentTitle.trim() || uploading) && styles.disabledButton
                ]}
                activeOpacity={0.7}
                disabled={!selectedDocument || !documentTitle.trim() || uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.uploadButtonText}>Upload</Text>
                )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/* PDF Viewer Modal */}
        <Modal
          visible={!!selectedPdf}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setSelectedPdf(null)}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={30} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {selectedPdf?.title}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Open in Browser',
                    'Would you like to open this PDF in your browser?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Open',
                        onPress: () => {
                          Alert.alert('Info', 'PDF would open in browser');
                        }
                      }
                    ]
                  );
                }}
                style={styles.externalButton}
                activeOpacity={0.7}
              >
                <Ionicons name="open-outline" size={24} color="#003366" />
              </TouchableOpacity>
            </View>
            {selectedPdf && (
              <WebView
                source={{ uri: getPdfViewerUrl(selectedPdf.uri) }}
                style={styles.pdfViewer}
                startInLoadingState={true}
                renderLoading={() => (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading PDF...</Text>
                  </View>
                )}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.log('WebView error: ', nativeEvent);
                  Alert.alert('Error', 'Unable to load PDF. Please try again.');
                }}
              />
            )}
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 15, paddingBottom: 30 },
  thumbnailContainer: {
    height: 220,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fakeThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  thumbnailText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
  playOverlay: { padding: 10 },
  videoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    position: 'relative',
  },
  videoPlayer: { width: '100%', height: '100%' },
  closeVideoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  infoContainer: { marginBottom: 25 },
  sessionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 8,
  },
  description: { fontSize: 15, color: '#555', lineHeight: 22 },
  docsContainer: { marginTop: 10 },
  docsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  docsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
  },
  pdfListContainer: { paddingVertical: 5 },
  pdfItem: {
    marginRight: 20,
    alignItems: 'center',
    width: 90,
  },
  pdfText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    color: '#333',
    lineHeight: 16,
  },
  noDocumentsContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noDocumentsText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  closeButton: { padding: 5 },
  modalTitle: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    flex: 1,
  },
  externalButton: { padding: 5 },
  pdfViewer: {
    flex: 1,
    width: width,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { fontSize: 16, color: '#666', marginTop: 10 },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 6,
    marginBottom: 15,
  },
  errorText: {
    marginLeft: 10,
    color: '#D32F2F',
    fontSize: 14,
    flex: 1,
  },
  
  // Upload Modal Styles
  uploadModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  uploadModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  uploadModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
  },
  placeholder: {
    width: 28,
  },
  uploadModalContent: {
    flex: 1,
    padding: 20,
  },
  uploadSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 15,
  },
  selectDocumentButton: {
    borderWidth: 2,
    borderColor: '#003366',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  selectDocumentText: {
    fontSize: 16,
    color: '#003366',
    fontWeight: '500',
    marginTop: 12,
  },
  supportedFormatsText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  selectedDocumentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#003366',
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#003366',
  },
  documentSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  changeDocumentButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#003366',
    borderRadius: 6,
  },
  changeDocumentText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  uploadModalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  footerButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  uploadButton: {
    backgroundColor: '#003366',
    marginLeft: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default ProfSeance;