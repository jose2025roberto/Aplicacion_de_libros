import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    loadLastSearch();
  }, []);

  const fetchBooks = async (searchTerm, startIndex = 0) => {
    if (!searchTerm) {
      Alert.alert('Error', 'Por favor ingresa un término de búsqueda.');
      return;
    }

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&startIndex=${startIndex}&maxResults=10`
      );

      console.log('Datos obtenidos:', response.data);

      setBooks(startIndex === 0 ? response.data.items || [] : [...books, ...response.data.items || []]);
      await AsyncStorage.setItem('lastSearch', searchTerm);
    } catch (error) {
      console.log('Error al obtener los libros:', error);
      Alert.alert('Error', 'No se pudieron cargar los libros. Inténtalo nuevamente.');
    }
  };

  const loadLastSearch = async () => {
    const lastSearch = await AsyncStorage.getItem('lastSearch');
    if (lastSearch) {
      setQuery(lastSearch);
      fetchBooks(lastSearch);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Libros Disponibles</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar libros..."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Buscar" onPress={() => fetchBooks(query)} />
      <FlatList
        data={books}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('BookDetail', { book: item })}
          >
            <Text style={styles.bookTitle}>{item.volumeInfo?.title || 'Sin título'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  bookTitle: {
    fontSize: 18,
    padding: 10,
    backgroundColor: '#eee',
    marginVertical: 5,
    borderRadius: 5,
  },
});
