import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookDetailScreen({ route }) {
  const { book } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserAndFavorites = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const currentUser = storedUser ? JSON.parse(storedUser) : null;
      setUser(currentUser);

      if (currentUser) {
        const storedFavorites = await AsyncStorage.getItem(`favorites_${currentUser.email}`);
        const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
        const isBookFavorite = favorites.some(fav => fav.id === book.id);
        setIsFavorite(isBookFavorite);
      }
    };

    loadUserAndFavorites();
  }, [book]);

  const handleAddToFavorites = async () => {
    if (!user) {
      Alert.alert('No estás logueado', 'Por favor, inicia sesión para agregar a favoritos.');
      return;
    }

    try {
      const storedFavorites = await AsyncStorage.getItem(`favorites_${user.email}`);
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (!favorites.some(fav => fav.id === book.id)) {
        favorites.push(book);
        await AsyncStorage.setItem(`favorites_${user.email}`, JSON.stringify(favorites));
        setIsFavorite(true);
        Alert.alert('Éxito', 'El libro ha sido agregado a tus favoritos.');
      } else {
        Alert.alert('Ya en favoritos', 'Este libro ya está en tu lista de favoritos.');
      }
    } catch (error) {
      console.log('Error al agregar a favoritos:', error);
      Alert.alert('Error', 'Hubo un problema al agregar el libro a favoritos.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Imagen del libro */}
      {book?.volumeInfo?.imageLinks?.thumbnail ? (
        <Image source={{ uri: book.volumeInfo.imageLinks.thumbnail }} style={styles.image} />
      ) : (
        <Text style={styles.noImageText}>No hay imagen disponible</Text>
      )}

      {/* Título del libro */}
      <Text style={styles.title}>{book?.volumeInfo?.title || 'Sin título'}</Text>

      {/* Autor(es) */}
      {book?.volumeInfo?.authors ? (
        <Text style={styles.author}>Autor: {book?.volumeInfo.authors.join(', ')}</Text>
      ) : (
        <Text style={styles.author}>Autor no disponible</Text>
      )}

      {/* Descripción */}
      <Text style={styles.description}>
        {book?.volumeInfo?.description || 'No hay descripción disponible.'}
      </Text>

      {/* Calificación */}
      <Text style={styles.rating}>
        {book?.volumeInfo?.averageRating
          ? `Calificación: ${book.volumeInfo.averageRating} ⭐ (${book.volumeInfo.ratingsCount} reseñas)`
          : 'Sin reseñas disponibles'}
      </Text>

      {/* Categorías o Géneros */}
      {book?.volumeInfo?.categories && book.volumeInfo.categories.length > 0 ? (
        <Text style={styles.categories}>Categorías: {book.volumeInfo.categories.join(', ')}</Text>
      ) : (
        <Text style={styles.categories}>Sin categorías disponibles</Text>
      )}

      {/* Fecha de publicación */}
      {book?.volumeInfo?.publishedDate ? (
        <Text style={styles.publishedDate}>Publicado en: {book.volumeInfo.publishedDate}</Text>
      ) : (
        <Text style={styles.publishedDate}>Fecha de publicación no disponible</Text>
      )}

      {/* Idioma */}
      {book?.volumeInfo?.language ? (
        <Text style={styles.language}>Idioma: {book.volumeInfo.language}</Text>
      ) : (
        <Text style={styles.language}>Idioma no disponible</Text>
      )}

      {/* Número de páginas */}
      {book?.volumeInfo?.pageCount ? (
        <Text style={styles.pageCount}>Número de páginas: {book.volumeInfo.pageCount}</Text>
      ) : (
        <Text style={styles.pageCount}>Sin información sobre el número de páginas</Text>
      )}

      {/* Editorial */}
      {book?.volumeInfo?.publisher ? (
        <Text style={styles.publisher}>Editorial: {book.volumeInfo.publisher}</Text>
      ) : (
        <Text style={styles.publisher}>Editorial no disponible</Text>
      )}

      {/* Enlace a Google Books */}
      {book?.volumeInfo?.infoLink ? (
        <TouchableOpacity onPress={() => Linking.openURL(book.volumeInfo.infoLink)}>
          <Text style={styles.link}>Ver más detalles en Google Books</Text>
        </TouchableOpacity>
      ) : null}

      {/* Enlace para comprar el libro */}
      {book?.saleInfo?.buyLink ? (
        <TouchableOpacity onPress={() => Linking.openURL(book.saleInfo.buyLink)}>
          <Text style={styles.link}>Comprar libro</Text>
        </TouchableOpacity>
      ) : null}

      {/* Botón para agregar a favoritos */}
      <TouchableOpacity onPress={handleAddToFavorites} style={styles.favoriteButton}>
        <Text style={styles.favoriteText}>{isFavorite ? 'Ya en favoritos' : 'Agregar a favoritos'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4', // Fondo suave
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Color de título más oscuro
  },
  author: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
    color: '#444',
    lineHeight: 22,
  },
  rating: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  categories: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  publishedDate: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  language: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  pageCount: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  publisher: {
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  link: {
    fontSize: 16,
    color: '#1E90FF',
    textDecorationLine: 'underline',
    marginBottom: 15,
  },
  favoriteButton: {
    backgroundColor: '#42f44b',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  favoriteText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  noImageText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
});
