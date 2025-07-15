import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Dashboard = ({ navigation }) => {
  const stats = [
    { id: '1', title: 'Orders', value: '12', icon: 'cart', color: '#4CAF50' },
    { id: '2', title: 'Wishlist', value: '5', icon: 'heart', color: '#F44336' },
    { id: '3', title: 'Messages', value: '3', icon: 'mail', color: '#2196F3' },
    { id: '4', title: 'Saved Items', value: '8', icon: 'bookmark', color: '#FFC107' },
  ];

  const recentActivities = [
    { id: '1', title: 'Order #12345 shipped', time: '2 hours ago' },
    { id: '2', title: 'New product added to wishlist', time: '1 day ago' },
    { id: '3', title: 'Payment received for Order #12344', time: '2 days ago' },
    { id: '4', title: 'Account details updated', time: '1 week ago' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>Welcome back, User!</Text>
        <Text style={styles.subText}>Here's what's happening with your account</Text>
      </View>
      
      <View style={styles.statsContainer}>
        {stats.map(stat => (
          <TouchableOpacity 
            key={stat.id}
            style={[styles.statCard, { backgroundColor: stat.color }]}
            onPress={() => navigation.navigate(stat.title)}
          >
            <Ionicons name={stat.icon} size={30} color="#fff" />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statTitle}>{stat.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activitiesContainer}>
        {recentActivities.map(activity => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityDot} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.helpCard}
        onPress={() => navigation.navigate('ContactUs')}
      >
        <Ionicons name="help-circle" size={24} color="#841584" />
        <Text style={styles.helpText}>Need help? Contact our support team</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  welcomeCard: {
    backgroundColor: '#841584',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subText: {
    fontSize: 14,
    color: '#eee',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 5,
  },
  statTitle: {
    fontSize: 16,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  activitiesContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#841584',
    marginRight: 15,
    marginTop: 5,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  helpText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#841584',
  },
});

export default Dashboard;