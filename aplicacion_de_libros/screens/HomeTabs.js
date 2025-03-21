import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#4a90e2', 
        tabBarInactiveTintColor: 'gray', 
        tabBarStyle: styles.tabBar, 
        tabBarLabelStyle: styles.tabBarLabel, 
        tabBarIconStyle: styles.tabBarIcon, 
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Buscar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff', 
    borderTopWidth: 0.5, 
    borderTopColor: '#ccc',
    height: 60, 
  },
  tabBarLabel: {
    fontSize: 12, 
    fontWeight: 'bold', 
  },
  tabBarIcon: {
    marginBottom: 5, 
  },
});
