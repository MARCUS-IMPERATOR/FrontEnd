import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const PDFViewerScreen = () => {
  const { url, title } = useLocalSearchParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pdfRef = useRef(null);
  const router = useRouter();

  const { width, height } = Dimensions.get('window');

  const handleBack = () => {
    router.back();
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      pdfRef.current?.setPage(page + 1);
    }
  };

  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      pdfRef.current?.setPage(page - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {title || 'Document'} (Page {page}/{totalPages || '?'})
          </Text>
        </View>
      </View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Impossible de charger le document</Text>
        </View>
      ) : (
        <>
          <Pdf
            ref={pdfRef}
            source={{ uri: url }}
            style={[styles.pdf, { width, height: height - 100 }]}
            onLoadComplete={(numberOfPages) => {
              setTotalPages(numberOfPages);
              setLoading(false);
            }}
            onPageChanged={(page, numberOfPages) => {
              setPage(page);
            }}
            onError={(error) => {
              console.log(error);
              setError(error);
              setLoading(false);
            }}
            enablePaging={true}
            fitPolicy={0} // 0 = width, 1 = height, 2 = both
            spacing={0}
            minScale={1.0}
            maxScale={1.0}
          />

          {!loading && totalPages > 1 && (
            <View style={styles.pagination}>
              <TouchableOpacity onPress={goToPrevPage} disabled={page === 1}>
                <AntDesign 
                  name="leftcircle" 
                  size={32} 
                  color={page === 1 ? '#ccc' : '#000080'} 
                />
              </TouchableOpacity>
              
              <Text style={styles.pageIndicator}>
                {page} / {totalPages}
              </Text>
              
              <TouchableOpacity onPress={goToNextPage} disabled={page === totalPages}>
                <AntDesign 
                  name="rightcircle" 
                  size={32} 
                  color={page === totalPages ? '#ccc' : '#000080'} 
                />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202124',
  },
  pdf: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  pageIndicator: {
    marginHorizontal: 20,
    fontSize: 16,
  },
});

export default PDFViewerScreen;