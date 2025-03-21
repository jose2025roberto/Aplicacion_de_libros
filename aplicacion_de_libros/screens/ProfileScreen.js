import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      // Obtener el usuario desde AsyncStorage
      const storedUser = await AsyncStorage.getItem('user');
      const currentUser = storedUser ? JSON.parse(storedUser) : null;
      setUser(currentUser);

      if (currentUser) {
        // Cargar los favoritos del usuario
        const storedFavorites = await AsyncStorage.getItem(`favorites_${currentUser.email}`);
        const favoriteBooks = storedFavorites ? JSON.parse(storedFavorites) : [];
        setFavorites(favoriteBooks);
      }
    };

    loadUserData();
  }, []); // El useEffect se ejecutará solo cuando la pantalla se cargue.

  const handleRemoveFavorite = async (bookId) => {
    if (!user) {
      Alert.alert('Error', 'No hay usuario logueado.');
      return;
    }

    try {
      const updatedFavorites = favorites.filter(book => book.id !== bookId);
      await AsyncStorage.setItem(`favorites_${user.email}`, JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
      Alert.alert('Éxito', 'El libro ha sido removido de favoritos.');
    } catch (error) {
      console.log('Error al eliminar de favoritos:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar el libro de favoritos.');
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      // Eliminar solo la información del usuario, no los favoritos
      await AsyncStorage.removeItem('user');
      setUser(null); // Limpiar el estado del usuario

      // Redirigir a la pantalla de inicio de sesión
      navigation.navigate('Login');
      Alert.alert('Éxito', 'Has cerrado sesión correctamente.');
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
      Alert.alert('Error', 'Hubo un problema al cerrar sesión.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {user ? (
        <>
          {/* Información del usuario */}
          <Text style={styles.header}>Perfil de {user.name}</Text>
          <Text style={styles.info}>Correo: {user.email}</Text>

          {/* Lista de libros favoritos */}
          <Text style={styles.favoritesHeader}>Libros Favoritos:</Text>
          {favorites.length > 0 ? (
            favorites.map((book) => (
              <View key={book.id} style={styles.bookItem}>
                <Text style={styles.bookTitle}>{book.volumeInfo.title}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveFavorite(book.id)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Eliminar de favoritos</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noFavoritesText}>No tienes libros favoritos.</Text>
          )}

          {/* Botón para cerrar sesión */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.noUserText}>No estás logueado.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#4a90e2',
  },
  info: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  favoritesHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  bookItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookTitle: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#ff5c5c',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#42f44b',
    padding: 15,
    borderRadius: 5,
    marginTop: 30,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noFavoritesText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  noUserText: {
    fontSize: 18,
    color: '#ff0000',
    textAlign: 'center',
    marginTop: 20,
  },
});
